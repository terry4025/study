import fs from 'fs';

async function inspect1_5() {
  const url = 'https://raw.githubusercontent.com/mmp/pbr-book-website/HEAD/4ed/Introduction/Using_and_Understanding_the_Code.html';
  const html = await (await fetch(url)).text();
  fs.writeFileSync('scripts/1_5_raw.html', html);
  console.log('Saved 1_5_raw.html, length:', html.length);
  
  function clean(str) {
    return str.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&ldquo;|&rdquo;/g, '"').replace(/&lsquo;|&rsquo;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  }

  const parts = html.split(/<h3[^>]*>/);
  parts.forEach((part, i) => {
    if (i === 0) {
      console.log('=== INTRO ===');
      const ps = [...part.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(m => clean(m[1])).filter(p => p.length > 20);
      ps.forEach((p, pi) => console.log(`  [P${pi+1}] ${p.substring(0, 100)}...`));
      return;
    }
    const title = clean(part.match(/^([\s\S]*?)<\/h3>/)[1]);
    console.log(`\n=== SECTION: ${title} ===`);
    const chunks = [...part.matchAll(/<div class="fragmentname">([\s\S]*?)<\/div>/g)].map(m => clean(m[1]));
    if (chunks.length > 0) console.log('  Chunks:', chunks);
    const ps = [...part.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(m => clean(m[1])).filter(p => p.length > 20);
    ps.forEach((p, pi) => console.log(`  [P${pi+1}] ${p.substring(0, 100)}...`));
  });
}
inspect1_5();
