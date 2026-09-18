import fs from 'fs';

async function inspect2_1() {
  const url = 'https://raw.githubusercontent.com/mmp/pbr-book-website/HEAD/4ed/Monte_Carlo_Integration/Monte_Carlo_Basics.html';
  const html = await (await fetch(url)).text();
  fs.writeFileSync('scripts/2_1_raw.html', html);
  console.log('Saved 2_1_raw.html, length:', html.length);

  function clean(str) {
    return str.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&ldquo;|&rdquo;/g, '"').replace(/&lsquo;|&rsquo;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  }

  const hMatches = [...html.matchAll(/<(h[2-4])[^>]*>([\s\S]*?)<\/\1>/g)];
  hMatches.forEach(h => console.log(`[${h[1]}]`, clean(h[2])));

  const chunkMatches = [...html.matchAll(/<div class="fragmentname">([\s\S]*?)<\/div>\s*<div class="fragmentcode">([\s\S]*?)<\/div>/g)];
  console.log(`Found ${chunkMatches.length} chunks:`);
  chunkMatches.forEach((c, i) => console.log(`  [Chunk ${i+1}] ${clean(c[1])}`));

  const figMatches = [...html.matchAll(/Figure\s*2\.\d+[^<]*/g)];
  console.log('Figures:', figMatches.map(f => clean(f[0])));
}
inspect2_1();
