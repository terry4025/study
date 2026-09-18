import fs from 'fs';

async function inspect2_2() {
  const url = 'https://raw.githubusercontent.com/mmp/pbr-book-website/HEAD/4ed/Monte_Carlo_Integration/Improving_Efficiency.html';
  const html = await (await fetch(url)).text();
  fs.writeFileSync('scripts/2_2_raw.html', html);
  console.log('Saved 2_2_raw.html, length:', html.length);

  function clean(str) {
    return str.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&ldquo;|&rdquo;/g, '"').replace(/&lsquo;|&rsquo;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  }

  const hMatches = [...html.matchAll(/<(h[2-4])[^>]*>([\s\S]*?)<\/\1>/g)];
  hMatches.forEach(h => console.log(`[${h[1]}]`, clean(h[2])));

  const figs = [...html.matchAll(/Figure\s*2\.\d+[^<]*/g)];
  console.log('Figures:', figs.map(f => clean(f[0])));
}
inspect2_2();
