async function dumpOverview() {
  const res = await fetch('https://raw.githubusercontent.com/mmp/pbr-book-website/HEAD/4ed/Introduction/pbrt_System_Overview.html');
  const html = await res.text();
  
  // print all headings, code chunk titles, figures, etc.
  const regex = /(<h[1-4][^>]*>[\s\S]*?<\/h[1-4]>|<span class="chunk-title">[\s\S]*?<\/span>|<figure[\s\S]*?<\/figure>|<div class="figure-row"[\s\S]*?<\/figcaption>|<pre class="sourceCode[\s\S]*?<\/pre>)/g;
  let m;
  console.log('=== STRUCTURE OF SECTION 1.3 ===');
  // let's just extract all h2, h3, h4 and chunk names
  const hRegex = /<(h[2-4])[^>]*>([\s\S]*?)<\/\1>/g;
  while ((m = hRegex.exec(html)) !== null) {
    console.log(`[${m[1]}]`, m[2].replace(/<[^>]+>/g, '').trim());
  }

  const chunkRegex = /class="chunk-title"[^>]*>([\s\S]*?)<\/span>/g;
  console.log('=== CODE CHUNKS ===');
  while ((m = chunkRegex.exec(html)) !== null) {
    console.log('[CHUNK]', m[1].replace(/<[^>]+>/g, '').trim());
  }

  console.log('=== FIGURES ===');
  const figRegex = /Figure\s+1\.\d+[^<]*/g;
  while ((m = figRegex.exec(html)) !== null) {
    console.log('[FIG]', m[0].trim());
  }
}
dumpOverview();
