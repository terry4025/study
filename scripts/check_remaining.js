async function checkRemainingChapter1() {
  const sections = [
    'How_to_Proceed_through_This_Book.html',
    'Using_and_Understanding_the_Code.html',
    'A_Brief_History_of_Physically_Based_Rendering.html'
  ];
  for (const s of sections) {
    const html = await (await fetch('https://raw.githubusercontent.com/mmp/pbr-book-website/HEAD/4ed/Introduction/' + s)).text();
    const h3s = [...html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
    const imgs = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m => m[1]);
    console.log(`\n=== ${s} ===`);
    console.log('Headings:', h3s);
    console.log('Images:', imgs);
  }
}
checkRemainingChapter1();
