import fs from 'fs';

const html = fs.readFileSync('scripts/2_1_raw.html', 'utf-8');

// Let's print each subsection with its paragraphs, extracting formulas where possible
const parts = html.split(/<h3[^>]*>/);
parts.forEach((part, i) => {
  if (i === 0) return;
  const title = part.match(/^([\s\S]*?)<\/h3>/)[1].replace(/<[^>]+>/g, '').trim();
  console.log(`\n========================================`);
  console.log(`SUBSECTION ${i}: ${title}`);
  console.log(`========================================`);
  
  // match paragraphs
  const ps = [...part.matchAll(/<p>([\s\S]*?)<\/p>/g)];
  console.log(`Total paragraphs: ${ps.length}`);
  ps.forEach((p, pi) => {
    // remove mathjax svg and keep title or alt or text
    let text = p[1].replace(/<svg[^>]*aria-labelledby="MathJax-SVG-\d+-Title"[^>]*><title id="[^"]*">([\s\S]*?)<\/title>[\s\S]*?<\/svg>/g, '$$$1$$');
    text = text.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.length > 20) {
      console.log(`[P${pi+1}] ${text.substring(0, 140)}...`);
    }
  });
});
