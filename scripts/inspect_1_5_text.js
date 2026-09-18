import fs from 'fs';

const html = fs.readFileSync('scripts/1_5_raw.html', 'utf-8');

function clean(str) {
  return str.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&ldquo;|&rdquo;/g, '"').replace(/&lsquo;|&rsquo;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

const parts = html.split(/<h3[^>]*>/);
parts.forEach((part, i) => {
  if (i === 0) return;
  const title = clean(part.match(/^([\s\S]*?)<\/h3>/)[1]);
  console.log(`\n========================================`);
  console.log(`SECTION: ${title}`);
  console.log(`========================================`);
  const ps = [...part.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(m => clean(m[1])).filter(p => p.length > 20);
  ps.forEach((p, pi) => console.log(`  [P${pi+1}] ${p}\n`));
});
