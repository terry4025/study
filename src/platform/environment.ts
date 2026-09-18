/** Shared browser behavior with a cleanup compatible with React StrictMode. */
export function installReaderEnvironment(host: HTMLElement): () => void {
    const abort = new AbortController();
    const previous = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    host.addEventListener('keydown', event => {
        if (event.key !== 'Escape' || event.isComposing) return;
        const dialog = host.querySelector<HTMLDialogElement>('dialog[open]');
        if (!dialog) return;
        // Search inputs consume Escape to clear themselves; dismiss the modal first.
        event.preventDefault();
        event.stopPropagation();
        dialog.close();
    }, { capture: true, signal: abort.signal });
    return () => { abort.abort(); history.scrollRestoration = previous; };
}
