async function inspectCodeChunks() {
  const res = await fetch('https://raw.githubusercontent.com/mmp/pbr-book-website/HEAD/4ed/Introduction/pbrt_System_Overview.html');
  const t = await res.text();
  
  // Find all code blocks
  const codeBlocks = [...t.matchAll(/<div class="code-header"[\s\S]*?<\/pre>/g)];
  console.log('Code blocks count:', codeBlocks.length);
  codeBlocks.forEach((cb, i) => {
    const text = cb[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(`[CODE ${i+1}]`, text.substring(0, 150));
  });
  
  if (codeBlocks.length === 0) {
    // maybe pre class="sourceCode"
    const pres = [...t.matchAll(/<pre class="sourceCode[\s\S]*?<\/pre>/g)];
    console.log('Pre sourceCode count:', pres.length);
    pres.forEach((p, i) => {
      const text = p[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      console.log(`[PRE ${i+1}]`, text.substring(0, 150));
    });
  }
}
inspectCodeChunks();
