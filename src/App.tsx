import { useEffect, useRef } from 'react';
import { PBRT_TOC } from './data/books/pbrt-4ed/toc';
import { BOOKS } from './data/books';
import { createLibrary } from './reader/books/index';
import { createReader } from './reader/app';

// React owns the host; the reader owns and disposes its isolated subtree.
export default function App() {
    const host = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!host.current) return;
        const library = createLibrary(PBRT_TOC, async () => {
            const { SECTIONS_MAP } = await import('./data/sections');
            return SECTIONS_MAP;
        }, BOOKS);
        return createReader(host.current, library);
    }, []);
    return <div ref={host}/>;
}
