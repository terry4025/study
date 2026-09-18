async function checkOverviewFragments() {
  const t = await (await fetch('https://raw.githubusercontent.com/mmp/pbr-book-website/HEAD/4ed/Introduction/pbrt_System_Overview.html')).text();
  const frags = [...t.matchAll(/<div class="fragmentcode">([\s\S]*?)<\/div>/g)];
  console.log('Total fragmentcode in 1.3:', frags.length);
  frags.forEach((f, i) => {
    // Also look backwards for fragment title/header if any
    const prev = t.substring(Math.max(0, f.index - 200), f.index);
    const chunkTitle = prev.match(/<span class="chunk-title"[^>]*>([\s\S]*?)<\/span>/);
    console.log(`\n=== FRAGMENT ${i+1}: ${chunkTitle ? chunkTitle[1].replace(/<[^>]+>/g, '').trim() : 'No Title'} ===`);
    console.log(f[1].trim().substring(0, 300));
  });
}
checkOverviewFragments();
