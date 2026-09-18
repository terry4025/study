async function inspectHtml() {
  const res = await fetch('https://raw.githubusercontent.com/mmp/pbr-book-website/HEAD/4ed/Introduction/pbrt_System_Overview.html');
  const t = await res.text();
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
  let match;
  while ((match = imgRegex.exec(t)) !== null) {
    const start = Math.max(0, match.index - 200);
    const end = Math.min(t.length, match.index + match[0].length + 300);
    console.log('=== IMAGE:', match[1]);
    console.log(t.substring(start, end).replace(/\n\s*\n/g, '\n'));
  }
}
inspectHtml();
