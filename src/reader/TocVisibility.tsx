import { useEffect } from 'react';

/** Reveal the active section in its independently scrolling book tree.
 * React may expand a chapter after navigation. Observe the resulting DOM
 * without taking keyboard focus or scrolling the reading document itself.
 */
export function TocVisibility() {
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;
    let frame = 0;
    let lastKey = '';
    const reveal = () => {
      frame = 0;
      const active = root.querySelector<HTMLButtonElement>('.desktop-toc [aria-current="page"]');
      const tree = active?.closest<HTMLElement>('.toc-list');
      if (!active || !tree) { lastKey = ''; return; }
      if (tree.clientHeight === 0) return;
      const key = active.textContent || '';
      if (key === lastKey) return;
      lastKey = key;
      const a = active.getBoundingClientRect();
      const t = tree.getBoundingClientRect();
      if (a.top < t.top + 12 || a.bottom > t.bottom - 12) {
        tree.scrollTop += a.top - t.top - tree.clientHeight * 0.3;
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(reveal); };
    const resize = () => { lastKey = ''; schedule(); };
    const observer = new MutationObserver(schedule);
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-current'] });
    window.addEventListener('resize', resize);
    schedule();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);
  return null;
}
