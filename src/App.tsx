import { useEffect, useRef } from 'react';
import { createPlatform } from './platform/app';
import { installReaderEnvironment } from './platform/environment';
import './platform/platform.css';
export default function App() {
    const host = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!host.current) return;
        const releaseEnvironment = installReaderEnvironment(host.current);
        const disposePlatform = createPlatform(host.current);
        return () => { disposePlatform(); releaseEnvironment(); };
    }, []);
    return <div ref={host} />;
}
