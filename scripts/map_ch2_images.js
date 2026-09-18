import fs from 'fs';

const ch2Files = [
  'Monte_Carlo_Basics.html',
  'Improving_Efficiency.html',
  'Sampling_Using_the_Inversion_Method.html',
  'Transforming_between_Distributions.html'
];

async function mapImages() {
  for (const f of ch2Files) {
    const html = await (await fetch('https://raw.githubusercontent.com/mmp/pbr-book-website/HEAD/4ed/Monte_Carlo_Integration/' + f)).text();
    const imgs = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m => m[1]).filter(s => !s.includes('pbr.jpg') && !s.includes('mitpress'));
    const caps = [...html.matchAll(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/g)].map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 100));
    console.log(`\n=== ${f} ===`);
    console.log('Images:', imgs);
    console.log('Captions:', caps);
  }
}
mapImages();
