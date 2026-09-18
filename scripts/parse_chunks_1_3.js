import fs from 'fs';

const html = fs.readFileSync('scripts/1_3_raw.html', 'utf-8');

function clean(str) {
  return str.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&ldquo;|&rdquo;/g, '"').replace(/&lsquo;|&rsquo;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

const parts = html.split(/<h3[^>]*>/);
parts.forEach((part, i) => {
  if (i === 0) return;
  const title = clean(part.match(/^([\s\S]*?)<\/h3>/)[1]);
  console.log(`\n======================================================`);
  console.log(`SECTION: ${title}`);
  console.log(`======================================================`);
  
  const chunkMatches = [...part.matchAll(/<div class="fragmentname">([\s\S]*?)<\/div>\s*<div class="fragmentcode">([\s\S]*?)<\/div>/g)];
  console.log(`Found ${chunkMatches.length} chunks:`);
  chunkMatches.forEach((cm, ci) => {
    console.log(`  [Chunk ${ci+1}] ${clean(cm[1])}`);
    console.log(`  Code sample:\n${clean(cm[2]).substring(0, 150)}...\n`);
  });
});
