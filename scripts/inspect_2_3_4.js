import fs from 'fs';

async function inspect2_3_4() {
  for (const f of ['Sampling_Using_the_Inversion_Method.html', 'Transforming_between_Distributions.html']) {
    const html = await (await fetch('https://raw.githubusercontent.com/mmp/pbr-book-website/HEAD/4ed/Monte_Carlo_Integration/' + f)).text();
    console.log(`\n=== ${f} (len: ${html.length}) ===`);
    const hMatches = [...html.matchAll(/<(h[2-4])[^>]*>([\s\S]*?)<\/\1>/g)];
    hMatches.forEach(h => console.log(`  [${h[1]}]`, h[2].replace(/<[^>]+>/g, '').trim()));
    const figs = [...html.matchAll(/Figure\s*2\.\d+[^<]*/g)];
    console.log('  Figures:', figs.map(f => f[0].trim()));
  }
}
inspect2_3_4();
