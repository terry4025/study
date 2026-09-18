#!/usr/bin/env node
/** Native-browser integration checks. Run against your own local dev server:
 * npm install --no-save --package-lock=false playwright
 * npx playwright install chromium
 * npm run dev  (in another terminal)
 * node scripts/browser-smoke.mjs
 * Optional: STUDY_BASE_URL=http://127.0.0.1:5173
 * Uses an isolated browser context; never clears your normal browser profile.
 * This script was supplied, NOT successfully executed in the restricted authoring container.
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.STUDY_BASE_URL||'http://127.0.0.1:5173';
const url=new URL(base);if(!['localhost','127.0.0.1','[::1]'].includes(url.hostname))throw new Error('Use a local development server, not a production site.');
const browser=await chromium.launch(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}),context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(base+'/?view=library');await page.waitForSelector('.shelf-card');assert.equal(await page.locator('.shelf-card').count(),6);
 await page.getByRole('link',{name:'책 펼치기 →',exact:true}).click();await page.waitForSelector('.source-row',{state:'attached'});assert.equal(await page.locator('.source-row').count(),105);
 await page.locator('details').evaluateAll(list=>list.forEach(d=>d.open=true));
 await page.getByRole('button',{name:'9.1 원문 읽음 표시',exact:true}).click();
 await page.locator('[data-source-section="9.2"]').getByRole('link',{name:'길잡이 열기',exact:true}).click();await page.waitForSelector('.reading-article');
 await page.getByRole('button',{name:'이 수업 읽음으로 표시 ✓',exact:true}).click();
 await page.getByRole('button',{name:'이 문단에 메모',exact:true}).first().click();await page.locator('textarea').fill('Native browser persistence check');await page.getByRole('button',{name:'메모 저장',exact:true}).click();
 await page.reload();await page.waitForSelector('.reading-article');assert.equal(await page.getByRole('button',{name:'읽음 표시 취소',exact:true}).count(),1);
 let data=await page.evaluate(()=>JSON.parse(localStorage.getItem('gyeol.library.v3')));assert.ok(data.books['pbrt-4ed'].sourceRead.includes('9.1'));assert.ok(Object.values(data.books['pbrt-4ed'].notes).some(n=>n.text==='Native browser persistence check'));
 await page.locator('.prerequisite-link').first().click();await page.waitForSelector('.reading-article');assert.ok(page.url().includes('book=foundations'));
 await page.goBack();await page.waitForSelector('.reading-article');assert.ok(page.url().includes('sec=reading-9-02'));
 const routes=[];await page.goto(base+'/?book=pbrt-4ed');await page.waitForSelector('.course-contents');routes.push(...await page.locator('.chapter-lessons a').evaluateAll(a=>a.map(x=>x.href)));
 await page.goto(base+'/?book=foundations');await page.waitForSelector('.course-contents');routes.push(...await page.locator('.chapter-lessons a').evaluateAll(a=>a.map(x=>x.href)));
 for(const route of routes){await page.goto(route);await page.waitForSelector('.reading-article');assert.ok(await page.locator('.content-block').count()>0,route);assert.equal(await page.locator('.unsupported-block').count(),0,route)}
 await page.goto(base+'/?book=unknown&sec=reading-9-02');await page.getByRole('heading',{name:'등록되지 않은 책입니다.',exact:true}).waitFor();
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,nativeHistory:true,nativeLocalStorage:true,renderedRoutes:routes.length,errors},null,2));
}finally{await context.close();await browser.close();}
