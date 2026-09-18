import fs from 'fs';

const html = fs.readFileSync('scripts/2_1_raw.html', 'utf-8');

function clean(str) {
  return str.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&ldquo;|&rdquo;/g, '"').replace(/&lsquo;|&rsquo;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

const imgMatches = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m => m[1]);
console.log('Images in 2.1:', imgMatches);

const captions = [...html.matchAll(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/g)].map(m => clean(m[1]));
console.log('Captions in 2.1:', captions);
