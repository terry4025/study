import fs from 'fs';

async function inspect2_4() {
  const html = await (await fetch('https://raw.githubusercontent.com/mmp/pbr-book-website/HEAD/4ed/Monte_Carlo_Integration/Transforming_between_Distributions.html')).text();
  fs.writeFileSync('scripts/2_4_raw.html', html);
  console.log('Saved 2_4_raw.html, length:', html.length);

  function clean(str) {
    return str.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&ldquo;|&rdquo;/g, '"').replace(/&lsquo;|&rsquo;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  }

  const parts = html.split(/<h3[^>]*>/);
  parts.forEach((part, i) => {
    if (i === 0) {
      console.log('=== INTRO ===');
      const ps = [...part.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(m => clean(m[1])).filter(p => p.length > 20);
      ps.forEach((p, pi) => console.log(`  [P${pi+1}] ${p.substring(0, 120)}...`));
      return;
    }
    const title = clean(part.match(/^([\s\S]*?)<\/h3>/)[1]);
    console.log(`\n========================================`);
    console.log(`SUBSECTION ${i}: ${title}`);
    console.log(`========================================`);
    const ps = [...part.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(m => clean(m[1])).filter(p => p.length > 20);
    ps.forEach((p, pi) => console.log(`  [P${pi+1}] ${p.substring(0, 120)}...`));
  });
}
inspect2_4();
