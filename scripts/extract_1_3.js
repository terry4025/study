async function extractSection1_3() {
  const html = await (await fetch('https://raw.githubusercontent.com/mmp/pbr-book-website/HEAD/4ed/Introduction/pbrt_System_Overview.html')).text();
  
  // Let's parse each h3 section
  const sections = html.split(/<h3[^>]*>/);
  console.log('Found sections count:', sections.length);
  sections.forEach((sec, idx) => {
    if (idx === 0) {
      console.log(`=== INTRO PART ===`);
      console.log(sec.substring(sec.indexOf('1.3 pbrt: System Overview')).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 500));
      return;
    }
    const titleMatch = sec.match(/^([\s\S]*?)<\/h3>/);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Unknown';
    console.log(`\n=== SECTION 1.3.${idx}: ${title} ===`);
    // Find paragraphs and code
    const pMatches = [...sec.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).filter(t => t.length > 30);
    console.log(`Paragraphs: ${pMatches.length}`);
    pMatches.slice(0, 3).forEach((p, pi) => console.log(`  P${pi+1}: ${p.substring(0, 100)}...`));
  });
}
extractSection1_3();
