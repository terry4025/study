import { ChapterMeta } from '../../../types/book';

export const PBRT_TOC: ChapterMeta[] = [
  {
    id: 'ch01',
    number: '1',
    title: 'Introduction',
    titleKo: '제1장 소개 (Introduction)',
    sections: [
      { id: 'ch01-01', number: '1.1', title: 'Literate Programming', titleKo: '1.1 문학적 프로그래밍', isAvailable: true },
      { id: 'ch01-02', number: '1.2', title: 'Photorealistic Rendering and the Ray-Tracing Algorithm', titleKo: '1.2 사실적 렌더링과 광선 추적(Ray-Tracing) 알고리즘', isAvailable: true },
      { id: 'ch01-03', number: '1.3', title: 'pbrt: System Overview', titleKo: '1.3 pbrt 시스템 전체 개요', isAvailable: true },
      { id: 'ch01-04', number: '1.4', title: 'How to Proceed through This Book', titleKo: '1.4 이 책을 효율적으로 공부하는 법', isAvailable: true },
      { id: 'ch01-05', number: '1.5', title: 'Using and Understanding the Code', titleKo: '1.5 코드 이해 및 활용 가이드', isAvailable: true },
      { id: 'ch01-06', number: '1.6', title: 'A Brief History of Physically Based Rendering', titleKo: '1.6 물리 기반 렌더링의 간략한 역사', isAvailable: true },
    ]
  },
  {
    id: 'ch02',
    number: '2',
    title: 'Monte Carlo Integration',
    titleKo: '제2장 몬테카를로 적분 (Monte Carlo Integration)',
    sections: [
      { id: 'ch02-01', number: '2.1', title: 'Monte Carlo: Basics', titleKo: '2.1 몬테카를로 적분의 기초 원리', isAvailable: true },
      { id: 'ch02-02', number: '2.2', title: 'Improving Efficiency', titleKo: '2.2 샘플링 효율성 향상 기법', isAvailable: true },
      { id: 'ch02-03', number: '2.3', title: 'Sampling Using the Inversion Method', titleKo: '2.3 역변환 방법을 이용한 확률 샘플링', isAvailable: true },
      { id: 'ch02-04', number: '2.4', title: 'Transforming between Distributions', titleKo: '2.4 다차원 확률 분포 간 변환', isAvailable: true },
    ]
  },
  {
    id: 'ch03',
    number: '3',
    title: 'Geometry and Transformations',
    titleKo: '제3장 기하학과 3차원 변환 (Geometry & Transformations)',
    sections: [
      { id: 'ch03-01', number: '3.1', title: 'Coordinate Systems', titleKo: '3.1 3차원 좌표계와 아핀 공간', isAvailable: true },
      { id: 'ch03-02', number: '3.2', title: 'n-Tuple Base Classes', titleKo: '3.2 n-튜플 기본 클래스와 C++ CRTP 템플릿 설계', isAvailable: true },
      { id: 'ch03-03', number: '3.3', title: 'Vectors', titleKo: '3.3 벡터(Vector): 3차원 방향과 연산', isAvailable: true },
      { id: 'ch03-04', number: '3.4', title: 'Points', titleKo: '3.4 점(Point): 3차원 공간 속 위치 모델링', isAvailable: true },
      { id: 'ch03-05', number: '3.5', title: 'Normals', titleKo: '3.5 법선 벡터(Normal): 표면의 수직 방향', isAvailable: true },
      { id: 'ch03-06', number: '3.6', title: 'Rays', titleKo: '3.6 광선(Ray): 빛의 이동 경로와 파라메트릭 방정식', isAvailable: true },
      { id: 'ch03-07', number: '3.7', title: 'Bounding Boxes', titleKo: '3.7 바운딩 박스 (Bounding Boxes & AABB)', isAvailable: true },
      { id: 'ch03-08', number: '3.8', title: 'Spherical Geometry', titleKo: '3.8 구면 기하학과 방향 표현', isAvailable: true },
      { id: 'ch03-09', number: '3.9', title: 'Transformations', titleKo: '3.9 3차원 동차 변환 행렬', isAvailable: true },
      { id: 'ch03-10', number: '3.10', title: 'Applying Transformations', titleKo: '3.10 변환 적용과 법선 벡터의 역전치 변환', isAvailable: true },
      { id: 'ch03-11', number: '3.11', title: 'Interactions', titleKo: '3.11 광선-표면 상호작용 구조체', isAvailable: true },
    ]
  },
  {
    id: 'ch04',
    number: '4',
    title: 'Radiometry, Spectra, and Color',
    titleKo: '제4장 방사측정학, 스펙트럼, 색상 (Radiometry & Color)',
    sections: [
      { id: 'ch04-01', number: '4.1', title: 'Radiometry', titleKo: '4.1 방사측정학 기본 물리량', isAvailable: true },
      { id: 'ch04-02', number: '4.2', title: 'Working with Radiometric Integrals', titleKo: '4.2 광학 적분 다루기', isAvailable: true },
      { id: 'ch04-03', number: '4.3', title: 'Surface Reflection', titleKo: '4.3 표면 반사의 물리 (BRDF)', isAvailable: true },
      { id: 'ch04-04', number: '4.4', title: 'Light Emission', titleKo: '4.4 광원 방출 메커니즘과 흑체 복사', isAvailable: true },
      { id: 'ch04-05', number: '4.5', title: 'Representing Spectral Distributions', titleKo: '4.5 파장별 스펙트럼 표현과 C++ 설계', isAvailable: true },
      { id: 'ch04-06', number: '4.6', title: 'Color', titleKo: '4.6 인간의 시각과 RGB/XYZ 색 공간', isAvailable: true },
    ]
  },
  {
    id: 'ch05',
    number: '5',
    title: 'Cameras and Film',
    titleKo: '제5장 가상 카메라와 필름 (Cameras and Film)',
    sections: [
      { id: 'ch05-01', number: '5.1', title: 'Camera Interface', titleKo: '5.1 카메라 인터페이스 설계', isAvailable: true },
      { id: 'ch05-02', number: '5.2', title: 'Projective Camera Models', titleKo: '5.2 투영 카메라 모델 (원근 투영)', isAvailable: true },
      { id: 'ch05-03', number: '5.3', title: 'Spherical Camera', titleKo: '5.3 구면 360도 카메라', isAvailable: true },
      { id: 'ch05-04', number: '5.4', title: 'Film and Imaging', titleKo: '5.4 디지털 필름과 픽셀 센서', isAvailable: true },
    ]
  },
  {
    id: 'ch06',
    number: '6',
    title: 'Shapes',
    titleKo: '제6장 3차원 형상과 교차 검사 (Shapes)',
    sections: [
      { id: 'ch06-01', number: '6.1', title: 'Basic Shape Interface', titleKo: '6.1 기본 Shape 인터페이스', isAvailable: true },
      { id: 'ch06-02', number: '6.2', title: 'Spheres', titleKo: '6.2 구(Sphere)의 해석적 교차 검사', isAvailable: true },
      { id: 'ch06-03', number: '6.3', title: 'Cylinders', titleKo: '6.3 원기둥(Cylinder)', isAvailable: true },
      { id: 'ch06-04', number: '6.4', title: 'Disks', titleKo: '6.4 원판(Disk)', isAvailable: true },
      { id: 'ch06-05', number: '6.5', title: 'Triangle Meshes', titleKo: '6.5 삼각 메시(Triangle Meshes)', isAvailable: true },
      { id: 'ch06-06', number: '6.6', title: 'Bilinear Patches', titleKo: '6.6 쌍선형 패치 곡면', isAvailable: true },
      { id: 'ch06-07', number: '6.7', title: 'Curves', titleKo: '6.7 베지어 곡선과 머리카락 렌더링', isAvailable: true },
      { id: 'ch06-08', number: '6.8', title: 'Managing Rounding Error', titleKo: '6.8 부동소수점 반올림 오차 엄밀 제어', isAvailable: true },
    ]
  },
  {
    id: 'ch07',
    number: '7',
    title: 'Primitives and Intersection Acceleration',
    titleKo: '제7장 가속 구조 BVH (Intersection Acceleration)',
    sections: [
      { id: 'ch07-01', number: '7.1', title: 'Primitive Interface and Geometric Primitives', titleKo: '7.1 기본 프리미티브 인터페이스', isAvailable: true },
      { id: 'ch07-02', number: '7.2', title: 'Aggregates', titleKo: '7.2 집합체 구조', isAvailable: true },
      { id: 'ch07-03', number: '7.3', title: 'Bounding Volume Hierarchies', titleKo: '7.3 BVH(계층적 바운딩 볼륨) 트리 구조', isAvailable: true },
    ]
  },
  {
    id: 'ch08',
    number: '8',
    title: 'Sampling and Reconstruction',
    titleKo: '제8장 샘플링과 이미지 복원 (Sampling & Reconstruction)',
    sections: [
      { id: 'ch08-01', number: '8.1', title: 'Sampling Theory', titleKo: '8.1 샘플링 이론과 앨리어싱', isAvailable: true },
      { id: 'ch08-02', number: '8.2', title: 'Sampling and Integration', titleKo: '8.2 샘플링과 수치 적분', isAvailable: true },
      { id: 'ch08-03', number: '8.3', title: 'Sampling Interface', titleKo: '8.3 샘플러 인터페이스', isAvailable: true },
      { id: 'ch08-04', number: '8.4', title: 'Independent Sampler', titleKo: '8.4 독립 랜덤 샘플러', isAvailable: true },
      { id: 'ch08-05', number: '8.5', title: 'Stratified Sampler', titleKo: '8.5 계층화(Stratified) 샘플러', isAvailable: true },
      { id: 'ch08-06', number: '8.6', title: 'Halton Sampler', titleKo: '8.6 Halton 저불일치(Quasi-Monte Carlo) 샘플러', isAvailable: true },
      { id: 'ch08-07', number: '8.7', title: 'Sobol’ Samplers', titleKo: '8.7 Sobol 저불일치 샘플러', isAvailable: true },
      { id: 'ch08-08', number: '8.8', title: 'Image Reconstruction', titleKo: '8.8 픽셀 재구성 필터링', isAvailable: true },
    ]
  },
  {
    id: 'ch09',
    number: '9',
    title: 'Reflection Models',
    titleKo: '제9장 표면 반사 모델 BSDF (Reflection Models)',
    sections: [
      { id: 'ch09-01', number: '9.1', title: 'BSDF Representation', titleKo: '9.1 BSDF 표현 체계', isAvailable: false },
      { id: 'ch09-02', number: '9.2', title: 'Diffuse Reflection', titleKo: '9.2 완전 확산 반사 (Lambertian)', isAvailable: false },
      { id: 'ch09-03', number: '9.3', title: 'Specular Reflection and Transmission', titleKo: '9.3 거울 반사와 굴절', isAvailable: false },
      { id: 'ch09-04', number: '9.4', title: 'Conductor BRDF', titleKo: '9.4 도체(금속) 재질 모델', isAvailable: false },
      { id: 'ch09-05', number: '9.5', title: 'Dielectric BSDF', titleKo: '9.5 유전체(유리, 물) 재질 모델', isAvailable: false },
      { id: 'ch09-06', number: '9.6', title: 'Roughness Using Microfacet Theory', titleKo: '9.6 미세 표면(Microfacet) 이론과 거칠기', isAvailable: false },
      { id: 'ch09-07', number: '9.7', title: 'Rough Dielectric BSDF', titleKo: '9.7 반투명 불투명 유리 재질', isAvailable: false },
      { id: 'ch09-08', number: '9.8', title: 'Measured BSDFs', titleKo: '9.8 실제 측정 데이터 기반 재질', isAvailable: false },
      { id: 'ch09-09', number: '9.9', title: 'Scattering from Hair', titleKo: '9.9 모발(Hair) 산란 모델', isAvailable: false },
    ]
  },
  {
    id: 'ch13',
    number: '13',
    title: 'Light Transport I: Surface Reflection',
    titleKo: '제13장 광선 전달 I: 경로 추적 (Path Tracing)',
    sections: [
      { id: 'ch13-01', number: '13.1', title: 'The Light Transport Equation', titleKo: '13.1 카지야(Kajiya) 렌더링 방정식', isAvailable: false },
      { id: 'ch13-02', number: '13.2', title: 'Path Tracing', titleKo: '13.2 경로 추적(Path Tracing) 핵심 알고리즘', isAvailable: false },
      { id: 'ch13-03', number: '13.3', title: 'A Simple Path Tracer', titleKo: '13.3 심플 패스 트레이서 구현', isAvailable: false },
      { id: 'ch13-04', number: '13.4', title: 'A Better Path Tracer', titleKo: '13.4 MIS(다중 중요도 샘플링) 최적화 패스 트레이서', isAvailable: false },
    ]
  },
  {
    id: 'ch15',
    number: '15',
    title: 'Wavefront Rendering on GPUs',
    titleKo: '제15장 GPU 웨이브프론트 렌더링 (Wavefront on GPU)',
    sections: [
      { id: 'ch15-01', number: '15.1', title: 'Mapping Path Tracing to the GPU', titleKo: '15.1 GPU 병렬 아키텍처에 패스 트레이싱 매핑하기', isAvailable: false },
      { id: 'ch15-02', number: '15.2', title: 'Implementation Foundations', titleKo: '15.2 웨이브프론트 큐 및 메모리 레이아웃', isAvailable: false },
      { id: 'ch15-03', number: '15.3', title: 'Path Tracer Implementation', titleKo: '15.3 GPU 패스 트레이서 전체 구현', isAvailable: false },
    ]
  }
];
