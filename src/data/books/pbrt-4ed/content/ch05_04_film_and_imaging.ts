import { SectionContent } from '../../../../types/book';

export const CH05_04_FILM_AND_IMAGING: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '5',
  chapterTitleKo: '제5장 가상 카메라와 필름 (Cameras and Film)',
  sectionNumber: '5.4',
  sectionTitle: 'Film and Imaging',
  sectionTitleKo: '5.4 디지털 필름과 픽셀 센서 (Film and Imaging)',
  originalUrl: 'https://pbr-book.org/4ed/Cameras_and_Film/Film_and_Imaging.html',
  prevSection: {
    id: 'ch05-03',
    title: '5.3 구면 360도 카메라',
  },
  nextSection: {
    id: 'ch06-01',
    title: '6.1 기본 Shape 인터페이스',
  },
  summary: {
    keyTakeaways: [
      '필름(Film)은 카메라를 통과한 빛의 분광 방사휘도를 측정하여 이산적인 2D 픽셀 격자에 최종 색상과 광학적 데이터를 기록하는 최종 수신체입니다.',
      '`PixelSensor`는 실제 디지털 카메라 센서(Canon EOS 5D 등)의 파장별 감도 반응 곡선($S(\\lambda)$)을 시뮬레이션하여 임의의 연속 파장 빛을 정확한 센서 RGB 신호로 변환합니다.',
      '수백만 개의 광선 샘플을 멀티코어 CPU나 GPU에서 병렬로 안전하게 합산하기 위해, pbrt는 타일 기반(Tile-based) 분할과 원자적 부동소수점 누적(`AtomicDouble`) 구조를 사용합니다.',
      '`GBufferFilm`은 픽셀 색상뿐만 아니라 표면 노멀(법선), 깊이(Depth), 알베도(반사율), 색상 분산(Variance)을 함께 기록하여 최신 AI 디노이저(OIDN, OptiX)와 적응형 샘플링의 핵심 입력 데이터를 제공합니다.'
    ],
    prerequisites: [
      '스펙트럼 분광 분포와 색공간 변환 (제4장 내용)',
      '멀티스레딩과 병렬 처리 (Race Condition, False Sharing, Atomic Operation)',
      '이미지 재구성 필터 (Box, Gaussian, Mitchell Filter)'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '5.4 디지털 필름과 센서의 물리 모델',
      titleEn: '5.4 Film and Imaging'
    },
    {
      type: 'paragraph',
      textKo: '카메라 렌즈를 통과한 빛은 최종적으로 이미지 센서나 필름에 도달합니다. 전통적인 필름 카메라는 은염 입자의 화학 반응으로 빛을 포착하지만, 현대의 디지털 카메라는 수천만 개의 미세한 포토다이오드로 나뉜 **고체 촬상 센서(CMOS/CCD)**를 사용합니다. 각 픽셀 센서는 노출 시간 동안 도착한 광자(Photon)들의 수를 파장 대역별로 계수하여 디지털 전기 신호로 변환합니다.',
      textEn: 'After passing through a lens system, light is measured by a sensor. Traditional film uses photochemical processes, while modern cameras use solid-state sensors (CMOS/CCD) divided into pixels that count photons arriving over time across wavelength ranges.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '픽셀 센서 (PixelSensor)와 분광 응답 특성',
      titleEn: 'PixelSensor and Spectral Response'
    },
    {
      type: 'paragraph',
      textKo: '실제 디지털 카메라는 수학적으로 순수한 RGB를 곧바로 읽지 못합니다. 센서 표면의 미세 컬러 필터(Color Filter Array / Bayer Filter)에 따라 파장별 감도 응답 곡선 $S_r(\\lambda), S_g(\\lambda), S_b(\\lambda)$가 다르게 작용합니다. pbrt의 `PixelSensor` 클래스는 이 물리적 분광 감도를 정밀하게 모델링합니다.',
      textEn: 'Real cameras do not measure pure RGB directly; each pixel is covered by a color filter with wavelength-dependent spectral sensitivities. pbrt models this with the PixelSensor class.'
    },
    {
      type: 'equation',
      tex: '\\text{RGB}_i = \\int L_i(\\lambda) S(\\lambda) d\\lambda',
      explanationKo: '도착한 빛의 연속 스펙트럼 $L(\\lambda)$과 센서의 파장별 감도 함수 $S(\\lambda)$의 곱을 가시광선 전 영역에 걸쳐 적분하여 픽셀의 최종 RGB 전압 신호를 산출합니다.'
    },
    {
      type: 'figure',
      id: 'fig-sensor-curves',
      number: 'Figure 5.16',
      title: 'Sensor Spectral Responsivities',
      titleKo: '실제 카메라 센서와 CIE 1931 표준 관측자의 분광 응답 비교',
      src: '/books/pbrt-4ed/images/zero-day-sensor-canon_eos_5d.png',
      captionKo: '실제 DSLR 카메라(Canon EOS 5D) 센서의 RGB 분광 감도 곡선. 인간의 눈(CIE 1931)과 미묘하게 다른 반응을 보이며, pbrt는 이를 반영하여 실제 카메라로 찍은 듯한 사실적인 색감을 형성합니다.',
      captionEn: 'Spectral responsivity curves of the Canon EOS 5D digital camera sensor, compared to standard human color matching functions.'
    },
    {
      type: 'paragraph',
      textKo: '또한 pbrt는 가시광선 전 영역을 균일하게 뽑는 대신, 센서의 감도가 높은 파장 영역을 집중적으로 추출하는 **파장 중요도 샘플링(Wavelength Importance Sampling)**을 적용하여 노이즈를 대폭 절감합니다.',
      textEn: 'pbrt also employs wavelength importance sampling based on sensor response, dramatically reducing Monte Carlo noise compared to naive uniform sampling.'
    },
    {
      type: 'figure',
      id: 'fig-wavelength-sampling',
      number: 'Figure 5.17',
      title: 'Wavelength Sampling Comparison',
      titleKo: '파장 균일 샘플링 vs 센서 감도 기반 중요도 샘플링',
      src: '/books/pbrt-4ed/images/lte-orb-wavelength-visible.png',
      captionKo: '센서 분광 감도에 비례하여 파장을 샘플링한 결과. 동일한 샘플 수에서도 색상 얼룩 노이즈가 현저히 적은 맑은 이미지를 얻을 수 있습니다.',
      captionEn: 'Wavelength importance sampling according to sensor spectral response leads to significantly lower noise for the same sample count.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: 'FilmBase와 픽셀 재구성 필터링',
      titleEn: 'FilmBase and Image Reconstruction'
    },
    {
      type: 'paragraph',
      textKo: '필름은 전체 이미지 해상도(`fullResolution`), 렌더링할 특정 서브 영역 크기(`pixelBounds`), 필름의 물리적 대각선 길이(`diagonal`, 기본 35mm 풀프레임 기준 43.3mm), 그리고 픽셀 재구성 필터(`Filter`)를 관리합니다.',
      textEn: 'FilmBase manages overall image resolution, cropped pixel bounds, physical film dimensions, and the pixel reconstruction filter.'
    },
    {
      type: 'figure',
      id: 'fig-film-filter',
      number: 'Figure 5.18',
      title: 'Pixel Reconstruction Filter',
      titleKo: '픽셀 영역을 넘어 주변으로 확장되는 샘플 필터 영역',
      src: '/books/pbrt-4ed/images/pha05f18.svg',
      captionKo: '고품질 안티앨리어싱을 위해 픽셀에 떨어진 샘플은 주변 인접 픽셀들에도 가중치(Gaussian, Mitchell 등)에 비례하여 에너지를 나누어 기여합니다.',
      captionEn: 'Pixel reconstruction filters extend over neighboring pixels, weighting sample contributions according to spatial distance.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '멀티코어 병렬 렌더링을 위한 RGBFilm 타일링 구조',
      titleEn: 'Tile-Based Parallel Rendering in RGBFilm'
    },
    {
      type: 'paragraph',
      textKo: '수십 개의 CPU 스레드나 수천 개의 GPU 워크그룹이 동시에 하나의 필름 메모리에 값을 쓸 때 발생하는 락(Lock) 경합과 캐시 무효화(False Sharing)를 막기 위해, pbrt는 전체 이미지를 $16 \\times 16$ 픽셀 단위의 작은 **타일(Tile)**로 분할합니다.',
      textEn: 'To prevent memory contention and false sharing across parallel worker threads, pbrt decomposes the image into independent 16x16 pixel tiles.'
    },
    {
      type: 'figure',
      id: 'fig-film-tiles',
      number: 'Figure 5.19',
      title: 'Film Tile Decomposition',
      titleKo: '병렬 처리를 위한 타일 분할 및 픽셀 바운드 격자',
      src: '/books/pbrt-4ed/images/pha05f21.svg',
      captionKo: '각 스레드는 독립된 타일을 할당받아 연산하므로, 다른 스레드와 메모리를 경합하지 않고 최고 속도로 렌더링을 병렬 수행할 수 있습니다.',
      captionEn: 'Independent tile decomposition enables high-throughput parallel rendering without lock contention between worker threads.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: '원자적 덧셈(Atomic Double)과 부동소수점 누적 오차의 함정',
      summary: '수백만 개의 작은 샘플 값을 그냥 더하면 왜 큰 숫자가 깎여 나갈까요?',
      points: [
        {
          title: '부동소수점 흡수 오차 (Catastrophic Loss of Precision)',
          content: '픽셀에 이미 $1000.0$이라는 큰 값이 누적되어 있는데, 새로운 샘플 값 $0.00001$을 더하려고 하면 float32의 24비트 가수부 범위를 벗어나 $0.00001$이 완전히 0으로 버려지는 흡수 오차가 일어납니다!'
        },
        {
          title: 'pbrt-v4의 AtomicDouble 해결책',
          content: 'pbrt는 픽셀마다 64비트 정밀도를 제공하는 `AtomicDouble`을 사용합니다. 락(Mutex) 없이 원자적 하드웨어 명령어(Compare-and-Swap)로 덧셈을 수행하며, 64비트의 넓은 가수부(53비트) 덕분에 수백만 번의 샘플이 더해져도 오차가 거의 발생하지 않습니다.'
        }
      ]
    },
    {
      type: 'figure',
      id: 'fig-float-precision',
      number: 'Figure 5.20',
      title: 'Float vs Double Precision in Pixel Accumulation',
      titleKo: '단정밀도(Float)와 배정밀도(Double)의 픽셀 누적 오차 비교 그래프',
      src: '/books/pbrt-4ed/images/float-vs-double-reference.svg',
      captionKo: '샘플 수가 수천~수만 개로 증가할 때 float32는 심각한 누적 오차를 나타내지만, pbrt-v4의 AtomicDouble은 완벽한 정밀도를 유지합니다.',
      captionEn: 'Comparison of pixel value accumulation error between 32-bit float and 64-bit double as sample count grows.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '필름 스플래팅 (Film Splatting)과 화이트 밸런스',
      titleEn: 'Film Splatting and White Balance'
    },
    {
      type: 'paragraph',
      textKo: '양방향 경로 추적(Bidirectional Path Tracing)이나 포톤 매핑(Photon Mapping) 같은 고급 렌더링 기법에서는 카메라에서 출발하지 않은 광선이 광원 경로로부터 거꾸로 카메라 렌즈를 통과하여 필름의 특정 위치에 에너지를 "뿌려주는(Splatting)" 연산이 필요합니다. pbrt는 `AddSplat()` 메서드를 통해 이를 지원합니다.',
      textEn: 'Algorithms like bidirectional path tracing and photon mapping need to deposit energy directly onto the film from light-side paths. This is handled by film splatting.'
    },
    {
      type: 'figure',
      id: 'fig-film-splat',
      number: 'Figure 5.21',
      title: 'Film Splatting',
      titleKo: '필름 스플래팅을 통한 에너지 직접 증착',
      src: '/books/pbrt-4ed/images/pha05f23.svg',
      captionKo: '광선 샘플이 픽셀 격자 위의 임의의 연속 위치에 에너지를 뿌리면, 스플랫 필터가 이를 주변 픽셀들에 누적합니다.',
      captionEn: 'Film splatting deposits energy directly onto the film, filtered across neighboring pixels.'
    },
    {
      type: 'paragraph',
      textKo: '또한 센서에서 수집된 원시 센서 RGB는 최종 출력 포맷에 맞춰 화이트 밸런스(White Balance) 색온도 보정과 $3 \\times 3$ 색공간 변환 행렬을 거쳐 sRGB, Display-P3, ACES 등의 표준 이미지 파일로 저장됩니다.',
      textEn: 'Sensor RGB values are white-balanced and transformed via 3x3 matrices into standard output color spaces such as sRGB or Display-P3.'
    },
    {
      type: 'figure',
      id: 'fig-white-balance',
      number: 'Figure 5.22',
      title: 'White Balance Adjustment',
      titleKo: 'RGBFilm의 화이트 밸런스 적용 전후 비교',
      src: '/books/pbrt-4ed/images/staircase-wb.png',
      captionKo: '따뜻한 백열등 조명 환경에서 화이트 밸런스를 적용하여 하얀 벽면과 계단의 본래 색채를 정확하게 보정한 결과.',
      captionEn: 'Staircase scene before and after white balance correction in RGBFilm.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: 'AI 디노이저와 미래형 기하 버퍼 (GBufferFilm)',
      titleEn: 'GBufferFilm and AI Denoising'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt-v4에 새롭게 도입된 `GBufferFilm`은 픽셀의 최종 RGB 색상뿐만 아니라, 첫 번째로 교차한 물체 표면의 **기하학적 보조 정보(Geometry Buffer / G-Buffer)**를 동시에 기록합니다.',
      textEn: 'GBufferFilm extends standard RGB film by recording auxiliary geometric channels at the first visible surface intersection point, providing indispensable data for modern AI denoisers.'
    },
    {
      type: 'code',
      chunkName: '<<GBufferFilm::Pixel Structure>>=',
      language: 'cpp',
      code: `struct Pixel {
    // 1. 기본 색상 누적
    AtomicDouble rgbSum[3];
    AtomicDouble weightSum;

    // 2. AI 디노이저(OIDN)를 위한 1차 교차 표면 기하 정보
    Normal3f normal;       // 표면 법선 벡터 (노멀)
    Point3f p;             // 3차원 교차점 위치 (깊이 Z-Depth 유도용)
    RGB albedo;            // 표면 본연의 텍스처 색상 (빛의 음영 제외)

    // 3. 적응형 샘플링을 위한 색상 분산 추정기
    VarianceEstimator<Float> varianceEstimator[3];
};`,
      explanationKo: '인텔 OIDN(Open Image Denoise)이나 엔비디아 OptiX 같은 딥러닝 AI 디노이저는 노이즈가 가득한 RGB 이미지와 함께 깨끗한 Normal, Albedo 버퍼를 입력받아, 단 몇 초 만에 수만 샘플 수준의 고품질 무노이즈 이미지를 복원해 냅니다.'
    }
  ]
};
