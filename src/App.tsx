import { useEffect, useRef } from 'react';
import { PBRT_TOC } from './data/books/pbrt-4ed/toc';
import { BOOKS } from './data/books';
import { createLibrary } from './reader/books/index';
import { createReader } from './reader/app';
import { attachNativeTranslations } from './reader/native';

// React owns the host; the reader owns and disposes its isolated subtree.
export default function App() {
    const host = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!host.current) return;
        const library = createLibrary(PBRT_TOC, async () => {
            const { SECTIONS_MAP } = await import('./data/sections');
            return SECTIONS_MAP;
        }, BOOKS);
        const node=host.current, controller=new AbortController();
        let dispose:(()=>void)|undefined,closed=false;
        node.textContent='학습 자료를 준비하고 있습니다…';
        void attachNativeTranslations(library,controller.signal).then(result=>{
            if(closed)return;
            dispose=createReader(node,library);
            if(result.warning){const warning=document.createElement('p');warning.className='native-import-warning';warning.textContent=result.warning;node.prepend(warning);}
        }).catch(error=>{
            if(closed)return;
            dispose=createReader(node,library);
            const warning=document.createElement('p');warning.className='native-import-warning';warning.setAttribute('role','alert');
            warning.textContent='번역 자료를 연결하지 못했습니다. 기존 자료는 계속 사용할 수 있습니다. '+String(error instanceof Error?error.message:error);node.prepend(warning);
        });
        return ()=>{closed=true;controller.abort();dispose?.();};
    }, []);
    return <div ref={host}/>;
}
