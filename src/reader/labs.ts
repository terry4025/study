import { element, button } from './text.js';
import type { LabKind } from './types.js';
const NS = 'http://www.w3.org/2000/svg';
function svgNode(tag: string, attrs: Record<string, string | number> = {}, text?: string): SVGElement {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs))
        e.setAttribute(k, String(v));
    if (text)
        e.textContent = text;
    return e;
}
function graph(title: string): SVGSVGElement {
    const svg = svgNode('svg', { viewBox: '0 0 600 240', role: 'img', 'aria-label': title }) as SVGSVGElement;
    svg.append(svgNode('title', {}, title));
    return svg;
}
function axes(s: SVGSVGElement, xmax = 1, ymax = 1, xlabel = '입력 x', ylabel = '출력'): void {
    s.append(svgNode('path', { d: 'M42 18 V208 H578', class: 'axis' }));
    s.append(svgNode('text', { x: 18, y: 210, class: 'graph-label' }, '0'));
    s.append(svgNode('text', { x: 36, y: 29, class: 'graph-label', 'text-anchor': 'end' }, String(ymax)));
    s.append(svgNode('text', { x: 572, y: 226, class: 'graph-label', 'text-anchor': 'end' }, String(xmax)));
    s.append(svgNode('text', { x: 62, y: 15, class: 'graph-label' }, ylabel));
    s.append(svgNode('text', { x: 310, y: 235, class: 'graph-label', 'text-anchor': 'middle' }, xlabel));
}
function poly(s: SVGSVGElement, fn: (x: number) => number, xmax: number, ymax: number, className = 'curve'): void {
    const points = Array.from({ length: 101 }, (_, i) => { const x = xmax * i / 100; return `${42 + x / xmax * 530},${208 - fn(x) / ymax * 180}`; }).join(' ');
    s.append(svgNode('polyline', { points, class: className }));
}
function range(label: string, min: number, max: number, step: number, value: number, onChange: () => void = () => { }): {
    node: HTMLElement;
    input: HTMLInputElement;
    output: HTMLOutputElement;
} {
    const row = element('label', 'lab-control');
    const span = element('span', '', label);
    const o = element('output');
    o.value = String(value);
    const input = element('input');
    input.type = 'range';
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.value = String(value);
    input.setAttribute('aria-label', label);
    input.addEventListener('input', () => { o.value = input.value; onChange(); });
    row.append(span, o, input);
    return { node: row, input, output: o };
}
function seeded(seed: number): () => number { let state = seed >>> 0; return () => { state = (Math.imul(1664525, state) + 1013904223) >>> 0; return (state + 0.5) / 4294967296; }; }
export function createLab(kind: LabKind): HTMLElement {
    const root = element('div', 'lab-inner');
    root.dataset.lab = kind;
    const picture = element('div', 'lab-picture');
    const controls = element('div', 'lab-controls');
    const result = element('div', 'lab-result');
    result.setAttribute('aria-live', 'polite');
    const note = element('p', 'lab-note');
    root.append(picture, controls, result, note);
    if (kind === 'derivative') {
        const x = range('관찰 위치 x', 0.5, 3, 0.1, 2, draw);
        const h = range('두 점의 간격 h', 0.01, 1, 0.01, 0.5, draw);
        controls.append(x.node, h.node);
        function draw() {
            const a = Number(x.input.value), b = Number(h.input.value);
            const slope = ((a + b) ** 2 - a * a) / b;
            const s = graph('제곱 함수와 두 점을 연결한 직선');
            axes(s, 4, 16, '입력 x', '출력 x²');
            poly(s, t => t * t, 4, 16);
            const sx = (v: number) => 42 + v / 4 * 530, sy = (v: number) => 208 - v / 16 * 180;
            s.append(svgNode('line', { x1: sx(a), y1: sy(a * a), x2: sx(a + b), y2: sy((a + b) ** 2), class: 'secant' }));
            for (const v of [a, a + b])
                s.append(svgNode('circle', { cx: sx(v), cy: sy(v * v), r: 5, class: 'point' }));
            picture.replaceChildren(s);
            result.textContent = `평균 변화율 ${slope.toFixed(3)}   /   미분계수 2x = ${(2 * a).toFixed(3)}`;
            note.textContent = 'h를 줄이면 두 점 사이 평균 변화율이 한 점의 미분계수에 가까워집니다. h = 0으로 직접 나누지 않습니다.';
        }
        draw();
    }
    else if (kind === 'integral') {
        const n = range('직사각형 개수 N', 2, 64, 1, 4, draw);
        controls.append(n.node);
        function draw() {
            const count = Number(n.input.value);
            const s = graph('제곱 함수 아래의 왼쪽 직사각형 합');
            axes(s, 1, 1, '입력 x', '높이 x²');
            let sum = 0;
            for (let i = 0; i < count; i++) {
                const x = i / count, y = x * x;
                sum += y / count;
                s.append(svgNode('rect', { x: 42 + x * 530, y: 208 - y * 180, width: 530 / count, height: y * 180, class: 'area-bar' }));
            }
            poly(s, x => x * x, 1, 1);
            picture.replaceChildren(s);
            result.textContent = `조각의 합 ${sum.toFixed(5)}   /   정확한 값 1/3 ≈ 0.33333   /   차이 ${(1 / 3 - sum).toFixed(5)}`;
            note.textContent = '각 구간의 왼쪽 끝에서 높이를 고른 근사입니다. 증가하는 이 함수에서는 정확한 값보다 작습니다.';
        }
        draw();
    }
    else if (kind === 'diffuse') {
        const angle = range('법선과 조명 방향의 각도 θ', 0, 90, 1, 30, draw);
        const r = range('반사율 ρ', 0, 1, 0.05, 0.6, draw);
        controls.append(angle.node, r.node);
        function draw() {
            const a = Number(angle.input.value) * Math.PI / 180, rho = Number(r.input.value), cos = Math.cos(a);
            const s = graph('표면 법선과 광원 방향');
            s.append(svgNode('path', { d: 'M80 195 H520', class: 'axis' }), svgNode('path', { d: 'M300 195 V25', class: 'axis' }));
            s.append(svgNode('line', { x1: 300, y1: 195, x2: 300 + 145 * Math.sin(a), y2: 195 - 145 * cos, class: 'secant' }));
            s.append(svgNode('text', { x: 310, y: 29, class: 'graph-label' }, '법선'), svgNode('text', { x: 350, y: 225, class: 'graph-label' }, '표면'));
            s.append(svgNode('circle', { cx: 120, cy: 100, r: 45, fill: `rgb(${Math.round(40 + 200 * rho * cos)},${Math.round(40 + 200 * rho * cos)},${Math.round(40 + 200 * rho * cos)})` }));
            picture.replaceChildren(s);
            result.textContent = `cos θ = ${cos.toFixed(3)}   /   상대 반사 기여 ρ cos θ = ${(rho * cos).toFixed(3)}`;
            note.textContent = '색 원은 정규화한 코사인 반응의 시각적 비유입니다. 광도 보정된 실제 렌더링이나 최종 RGB가 아닙니다.';
        }
        draw();
    }
    else if (kind === 'transmittance') {
        const d = range('이동 거리 d (m)', 0, 10, 0.1, 2, draw), sigma = range('소멸 계수 σt (1/m)', 0, 2, 0.05, 0.5, draw);
        controls.append(d.node, sigma.node);
        function draw() { const v = Number(d.input.value), t = Number(sigma.input.value), T = Math.exp(-t * v); const s = graph('균일 매질의 지수 통과율'); axes(s, 10, 1, '거리 d (m)', '통과율 T'); poly(s, x => Math.exp(-t * x), 10, 1); s.append(svgNode('circle', { cx: 42 + v / 10 * 530, cy: 208 - T * 180, r: 5, class: 'point' })); picture.replaceChildren(s); result.textContent = `통과율 T = ${T.toFixed(4)}   /   100 중 남은 양 ${(100 * T).toFixed(2)}`; note.textContent = '균일 매질에서의 직접 통과 성분입니다. 다른 방향에서 들어오는 산란광과 자체 발광은 제외합니다.'; }
        draw();
    }
    else if (kind === 'sampling') {
        const count = range('표본 수 N', 4, 1024, 4, 32, draw);
        controls.append(count.node);
        function draw() { const N = Number(count.input.value), rand = seeded(429), values = Array.from({ length: N }, () => rand()), mean = values.reduce((s, x) => s + x * x, 0) / N; const s = graph('고정 난수열의 적분 추정값'); axes(s, N, 1, '표본 수', '추정값'); poly(s, () => 1 / 3, 1, 1, 'reference-curve'); let total = 0; const points = values.map((x, i) => { total += x * x; return `${42 + (i + 1) / N * 530},${208 - total / (i + 1) * 180}`; }).join(' '); s.append(svgNode('polyline', { points, class: 'curve' })); picture.replaceChildren(s); result.textContent = `평균 추정 ${mean.toFixed(5)}   /   정확한 적분 0.33333   /   절대 오차 ${Math.abs(mean - 1 / 3).toFixed(5)}`; note.textContent = '재현을 위해 같은 시드의 의사난수를 사용합니다. 한 번의 실험에서 표본을 늘릴 때 오차가 매번 줄어들지는 않습니다.'; }
        draw();
    }
    else if (kind === 'lights') {
        const d = range('점광원까지 거리 d', 0.5, 5, 0.1, 1, draw);
        controls.append(d.node);
        function draw() { const distance = Number(d.input.value); const s = graph('거리 제곱에 반비례하는 직접 조도'); axes(s, 5, 64, '거리 d', '상대 조도'); poly(s, x => 16 / Math.max(0.5, x) ** 2, 5, 64); s.append(svgNode('circle', { cx: 42 + distance / 5 * 530, cy: 208 - (16 / distance ** 2) / 64 * 180, r: 5, class: 'point' })); picture.replaceChildren(s); result.textContent = `상대 직접 조도 = 16 / ${distance.toFixed(1)}² = ${(16 / distance ** 2).toFixed(3)}`; note.textContent = '점광원, 같은 표면 방향, 가림과 매질이 없다는 가정입니다. 0거리에는 이 모델을 적용하지 않습니다.'; }
        draw();
    }
    else if (kind === 'roulette') {
        const s = range('생존 확률 s', 0.05, 1, 0.05, 0.5, draw);
        controls.append(s.node);
        function draw() {
            const p = Number(s.input.value), rand = seeded(941), N = 400;
            let live = 0;
            const svg = graph('러시안 룰렛 생존과 종료');
            for (let i = 0; i < N; i++) {
                const alive = rand() < p;
                if (alive)
                    live++;
                svg.append(svgNode('rect', { x: 20 + (i % 40) * 14, y: 18 + Math.floor(i / 40) * 18, width: 9, height: 12, class: alive ? 'survivor' : 'terminated' }));
            }
            picture.replaceChildren(svg);
            result.textContent = `생존 기여 ${(6 / p).toFixed(2)}   /   이론적 평균 6.00   /   400회 실험 평균 ${(live * 6 / p / N).toFixed(2)}`;
            note.textContent = '초록은 생존, 옅은 칸은 종료입니다. 실험 평균은 유한 표본이라 이론적 평균과 다를 수 있습니다.';
        }
        draw();
    }
    else if (kind === 'queues') {
        let grouped = false;
        controls.append(button('작업별 묶기 / 원래 순서', () => { grouped = !grouped; draw(); }, 'button secondary'));
        function draw() { const types = ['무광', '유리', '무광', '안개', '유리', '무광', '유리', '안개', '무광', '안개', '유리', '무광']; if (grouped)
            types.sort(); const svg = graph('경로 작업을 재질별로 묶는 개념도'); types.forEach((v, i) => { svg.append(svgNode('rect', { x: 20 + (i % 6) * 96, y: 28 + Math.floor(i / 6) * 90, width: 80, height: 64, rx: 4, class: 'queue-cell' })); svg.append(svgNode('text', { x: 60 + (i % 6) * 96, y: 65 + Math.floor(i / 6) * 90, 'text-anchor': 'middle', class: 'graph-label' }, v)); }); picture.replaceChildren(svg); result.textContent = grouped ? '현재: 비슷한 작업을 같은 큐에 모았습니다.' : '현재: 경로가 들어온 순서입니다.'; note.textContent = '작업 분류만 보여 줍니다. 실제 GPU 실행 시간이나 가속비를 시뮬레이션하지 않습니다.'; }
        draw();
    }
    else if (kind === 'texture') {
        const x = range('픽셀 중심 위치', 0, 1, 0.01, 0.5), width = range('픽셀이 덮는 폭', 0.01, 0.5, 0.01, 0.2); // listeners added below
        function stripe(t: number) { return ((Math.floor(t * 16) % 2) + 2) % 2 === 0 ? 0 : 1; }
        function draw() { const center = Number(x.input.value), w = Number(width.input.value); let sum = 0; for (let i = 0; i < 256; i++)
            sum += stripe(center - w / 2 + (i + .5) / 256 * w); const average = sum / 256, point = stripe(center); const svg = graph('줄무늬의 점 샘플과 발자국 평균'); for (let i = 0; i < 16; i++)
            svg.append(svgNode('rect', { x: 20 + i * 35, y: 25, width: 35, height: 80, fill: i % 2 ? '#fafafa' : '#202525' })); svg.append(svgNode('rect', { x: 20 + (center - w / 2) * 560, y: 15, width: w * 560, height: 100, class: 'footprint' })); for (const [v, i] of [[point, 0], [average, 1]]) {
            svg.append(svgNode('rect', { x: 120 + i * 250, y: 150, width: 110, height: 50, fill: `rgb(${v * 255},${v * 255},${v * 255})`, class: 'preview-swatch' }));
            svg.append(svgNode('text', { x: 120 + i * 250, y: 224, class: 'graph-label' }, i ? '영역 평균' : '점 하나'));
        } picture.replaceChildren(svg); result.textContent = `점 샘플 ${point.toFixed(2)}   /   256점 수치 평균 ${average.toFixed(3)}`; note.textContent = '동일 가중치의 1차원 평균 실험입니다. 유한 표본의 근사이며 실제 GPU 필터의 재현은 아닙니다.'; }
        for (const c of [x, width]) {
            c.input.addEventListener('input', () => { c.output.value = c.input.value; draw(); });
            controls.append(c.node);
        }
        draw();
    }
    return root;
}
