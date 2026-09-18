import { useEffect, useRef } from 'react';
import { PBRT_TOC } from './data/books/pbrt-4ed/toc';
import { Repository } from './reader/repository';
import { createReader } from './reader/app';
// React owns the host. The reader owns only the isolated subtree inside it.
// Every listener/observer is disposed, including the StrictMode setup/cleanup cycle.
export default function App() {
    const host = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!host.current)
            return;
        const repository = new Repository(PBRT_TOC, async () => {
            const { SECTIONS_MAP } = await import('./data/sections');
            return SECTIONS_MAP;
        });
        return createReader(host.current, repository);
    }, []);
    return <div ref={host}/>;
}
