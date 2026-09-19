import { Library } from '../library.js';
import { bookAdditions } from './additions.js';
import { Repository, type LegacyLoader } from '../repository.js';
import { curriculum } from '../curriculum.js';
import { pbrtGuides } from './pbrt/guides.js';
import { pbrtOutline } from './pbrt/outline.js';
import type { ChapterMeta, BookMeta } from '../../types/book.js';
import type { BookDefinition } from '../types.js';

const plannedDefaults: Pick<BookDefinition,'status'|'role'|'rights'> = {
    role:'book', status:'planned', rights:{status:'unverified',label:'자료 이용 조건과 콘텐츠 준비를 확인한 뒤 공개합니다.'}
};

export function createLibrary(toc: ChapterMeta[] = [], loader?: LegacyLoader, catalog: BookMeta[] = []): Library {
    const library = new Library();
    library.register({
        id:'pbrt-4ed',title:'물리 기반 렌더링',subtitle:'PBRT · 제4판 학습 동반자',
        description:'수학에서 한 픽셀까지. 기존 학습 노트와 독자 해설을 공식 원문에 연결하며 읽습니다.',
        authors:['Matt Pharr','Wenzel Jakob','Greg Humphreys'],edition:'4판',role:'book',status:'available',
        sourceUrl:'https://pbr-book.org/4ed/contents',outline:pbrtOutline,
        rights:{status:'permission-required',label:'원문: CC BY-NC-ND 4.0. 원문 전체의 번역·재배포 허락을 받은 것으로 간주하지 않습니다.',url:'https://creativecommons.org/licenses/by-nc-nd/4.0/'},
        glossary:[
            {term:'방사휘도 (Radiance)',english:'Radiance',text:'한 방향으로 이동하는 빛의 양을 투영 면적과 입체각당 나타낸 물리량입니다. 사람의 시감도로 가중한 휘도(Luminance)와 구분합니다. 단위는 W/(m²·sr)입니다.',lesson:'ch04-01'},
            {term:'반사율과 BRDF',english:'Reflectance / BRDF',text:'반사율은 입사 에너지 중 반사되는 비율이고, BRDF는 방향별 반사를 기술합니다. BRDF 값 자체를 0~1 확률로 해석하지 않습니다.',lesson:'reading-9-02'},
            {term:'투과율',english:'Transmittance',text:'빛이 한 구간을 통과하며 남는 비율입니다. 연속한 구간들의 투과율은 곱합니다. 물리량의 방향별 변화와 구간별 누적을 구분해 읽으세요.',lesson:'reading-11-02'},
            {term:'확률밀도 보정',english:'Sampling PDF',text:'자주 뽑힌 표본을 그대로 더하면 한쪽으로 치우칩니다. 몬테카를로 추정에서는 각 기여를 그 표본을 뽑은 밀도로 나누며, 밀도의 단위와 정의역도 맞아야 합니다.',lesson:'reading-13-02'},
        ]
    },new Repository(toc,loader,[...curriculum.filter(x=>x.chapter!=='0'),...pbrtGuides]));
    library.register({id:'foundations',title:'수학·코드 준비실',subtitle:'모든 책에서 함께 쓰는 기초',
        description:'미분·적분을 몰라도 시작하는 여덟 수업. 수식 읽기, 함수, 벡터, 확률, 코드의 출발점입니다.',
        authors:['결 스터디 독자 집필'],edition:'공통 기초',role:'foundation',status:'available',
        rights:{status:'original',label:'독자적으로 작성한 기초 해설과 수치 예제입니다. 특정 책의 번역본이 아닙니다.'}
    },new Repository([],undefined,curriculum.filter(x=>x.chapter==='0')));
    // The user will choose the remaining five books later. Keep stable slot IDs
    // but do not present the former sample catalog as the selected curriculum.
    for(const [i,id] of ['ostep','csapp','ddia','planned-05','planned-06'].entries())
        library.register({id,title:`추가 예정 도서 ${i+2}`,subtitle:'사용자 자료 선택 예정',
            description:'다음 책의 링크를 받은 뒤 목차·본문을 연결합니다. 임의로 책을 선정하지 않습니다.',
            authors:[],edition:'미정',...plannedDefaults});
    for(const addition of bookAdditions)library.replace(addition.slotId,addition.definition,addition.repository);
    return library;
}
