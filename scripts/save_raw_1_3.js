import fs from 'fs';

async function dumpDetailed1_3() {
  const res = await fetch('https://raw.githubusercontent.com/mmp/pbr-book-website/HEAD/4ed/Introduction/pbrt_System_Overview.html');
  const html = await res.text();
  fs.writeFileSync('scripts/1_3_raw.html', html);
  console.log('Saved 1_3_raw.html, length:', html.length);
}
dumpDetailed1_3();
