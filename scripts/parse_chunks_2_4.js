import fs from 'fs';

const html = fs.readFileSync('scripts/2_4_raw.html', 'utf-8');

function clean(str) {
  return str.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&ldquo;|&rdquo;/g, '"').replace(/&lsquo;|&rsquo;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

const chunks = [...html.matchAll(/<div class="fragmentname">([\s\S]*?)<\/div>\s*<div class="fragmentcode">([\s\S]*?)<\/div>/g)];
console.log('Total chunks in 2.4:', chunks.length);
chunks.forEach((c, i) => {
  console.log(`\n[Chunk ${i+1}] ${clean(c[1])}`);
  console.log(clean(c[2]));
});
