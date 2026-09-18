import { useEffect, useRef } from 'react';
import { createPlatform } from './platform/app';
import './platform/platform.css';
export default function App() {
    const host = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!host.current) return;
        return createPlatform(host.current);
    }, []);
    return <div ref={host} />;
}
