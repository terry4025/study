#!/usr/bin/env node
/** Offline checks for existing repository data. NOT a translation certificate.
 * npm install/ci first, then:
 *   node scripts/check-pbrt-content.mjs --unit
 *   node scripts/check-pbrt-content.mjs --audit
 * --audit loads actual legacy data and reports structural/math problems.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const ts = require('typescript');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'pbrt-content-check-'));
const audit = process.argv.includes('--audit');
const report = {
    scope: audit ? 'actual-repository-structural-audit' : 'unit-and-fixture-tests',
    translationComplete: false, semanticReviewComplete: false,
    sections: 0, appliedCorrections: [], unmatchedRules: [],
    equationsChecked: 0, missingImages: [], errors: [],
    limitations: ['No full paragraph-by-paragraph source comparison.', 'No semantic verification of figure/caption correspondence.', 'No new full translation of chapters 9-16 or appendices.']
};
function files(dir) {
    return fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]) : [];
}
try {
    fs.writeFileSync(path.join(temp, 'package.json'), '{"type":"commonjs"}');
    for (const file of ['reader', 'data', 'types'].flatMap(dir => files(path.join(root, 'src', dir))).filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts'))) {
        const result = ts.transpileModule(fs.readFileSync(file, 'utf8'), { reportDiagnostics: true, compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true } });
        for (const item of result.diagnostics || []) if (item.category === ts.DiagnosticCategory.Error) report.errors.push(ts.flattenDiagnosticMessageText(item.messageText, '\n'));
        const out = path.join(temp, path.relative(path.join(root, 'src'), file).replace(/\.ts$/, '.js'));
        fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, result.outputText);
    }
    const tests = spawnSync(process.execPath, ['--test', path.join(root, 'tests/content-revisions.test.cjs')], { env: { ...process.env, PBRT_TEST_BUILD: temp }, stdio: 'inherit' });
    if (tests.error || tests.status !== 0) report.errors.push('Unit/fixture tests failed.');
    if (audit) {
        const katex = require('katex');
        const { SECTIONS_MAP } = require(path.join(temp, 'data/sections.js'));
        const { REVISIONS, reviseLegacyContent } = require(path.join(temp, 'reader/content-revisions.js'));
        const { adaptLegacy } = require(path.join(temp, 'reader/repository.js'));
        const counts = new Map();
        function checkMath(tex, location) {
            report.equationsChecked++;
            try { katex.renderToString(tex, { throwOnError: true, trust: false, strict: 'ignore', maxExpand: 2000, output: 'mathml' }); }
            catch (error) { report.errors.push(`${location}: ${error.message}`); }
        }
        for (const [id, source] of Object.entries(SECTIONS_MAP)) {
            report.sections++;
            const original = JSON.stringify(source);
            const revised = reviseLegacyContent(id, source);
            for (const change of revised.changes) {
                counts.set(change.id, (counts.get(change.id) || 0) + 1);
                report.appliedCorrections.push({ section: id, ...change });
            }
            // Inventory original paths too: quarantining a diagram does not fix its asset.
            for (const block of source.blocks) if (block.type === 'figure' && block.src.startsWith('/')) {
                const publicRoot = path.resolve(root, 'public');
                const file = path.resolve(publicRoot, block.src.slice(1));
                if (!file.startsWith(publicRoot + path.sep) || !fs.existsSync(file)) report.missingImages.push({ section: id, blockId: block.id, path: block.src });
            }
            const lesson = adaptLegacy(id, source);
            if (original !== JSON.stringify(source)) report.errors.push(`${id}: input mutated`);
            if (new Set(lesson.blocks.map(block => block.id)).size !== lesson.blocks.length) report.errors.push(`${id}: duplicate rendered block IDs`);
            for (const block of lesson.blocks) {
                const location = `${id}/${block.id}`;
                if (block.type === 'unknown') report.errors.push(`${location}: unsupported block ${block.label}`);
                if (block.type === 'equation') checkMath(block.tex, location);
                const fields = block.type === 'paragraph' ? [block.text] : block.type === 'aside' ? [block.title, block.text] : block.type === 'equation' ? [block.explanation || ''] : block.type === 'heading' ? [block.text] : [];
                for (const text of fields) for (const match of text.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$\n]+)\$/g)) checkMath(match[1] ?? match[2], location);
            }
        }
        for (const rule of REVISIONS) {
            const count = counts.get(rule.id) || 0;
            if (count !== 1) report.unmatchedRules.push({ id: rule.id, matches: count, message: 'Expected one identified passage; inspect source changes rather than forcing replacement.' });
        }
        if (report.unmatchedRules.length || report.missingImages.length) report.errors.push('Unresolved correction matches or missing image paths remain.');
    }
} catch (error) { report.errors.push(error.stack || String(error)); }
finally { fs.rmSync(temp, { recursive: true, force: true }); }
console.log(JSON.stringify(report, null, 2));
if (report.errors.length) process.exitCode = 1;
