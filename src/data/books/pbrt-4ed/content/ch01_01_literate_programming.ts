import { SectionContent } from '../../../../types/book';

export const CH01_01_LITERATE_PROGRAMMING: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '1',
  chapterTitleKo: '제1장 소개 (Introduction)',
  sectionNumber: '1.1',
  sectionTitle: 'Literate Programming',
  sectionTitleKo: '1.1 문학적 프로그래밍 (Literate Programming)',
  originalUrl: 'https://pbr-book.org/4ed/Introduction/Literate_Programming.html',
  nextSection: {
    id: 'ch01-02',
    title: '1.2 사실적 렌더링과 광선 추적(Ray-Tracing) 알고리즘',
  },
  summary: {
    keyTakeaways: [
      '문학적 프로그래밍(Literate Programming)은 컴퓨터 과학의 거장 도널드 커누스(Donald Knuth)가 창안한 프로그래밍 방법론입니다.',
      '컴퓨터에게 명령을 내리는 코드 중심의 사고에서 벗어나, "사람에게 설명하는 글(Essay)"을 중심으로 프로그램과 코드를 하나로 엮습니다.',
      '위버(Weaver)를 통해 사람이 읽는 책(문서)을 만들고, 탱글러(Tangler)를 통해 컴퓨터가 빌드할 C++ 소스코드를 자동 생성합니다.',
      '복잡한 함수를 10줄 이내의 명확한 목적을 가진 작은 코드 조각(Fragment)들로 분해하여 설명의 논리적 흐름에 맞춰 배치합니다.'
    ],
    prerequisites: [
      '기본적인 프로그래밍 경험 (C/C++ 기본 문법)'
    ]
  },
  blocks: [
    {
      type: 'paragraph',
      textKo: '세계적인 문서 조판 시스템인 TeX(텍)을 개발하던 중, 컴퓨터 과학의 거장 **도널드 커누스(Donald Knuth)** 교수는 단순하면서도 혁신적인 아이디어에 기반한 새로운 프로그래밍 방법론을 창안했습니다. 커누스 교수의 말을 직접 인용하자면 이렇습니다:\n\n> "프로그램을 작성할 때 우리의 전통적인 태도를 바꿔봅시다. 우리의 주된 과업이 컴퓨터에게 무엇을 하라고 지시하는 것이라 생각하는 대신, **사람들에게 우리가 컴퓨터에게 무엇을 시키고자 하는지를 설명하는 것**에 집중합시다."\n\n그는 이 방법론을 **문학적 프로그래밍(Literate Programming)**이라고 명명했습니다. 지금 여러분이 읽고 계신 이 책(이 챕터를 포함하여) 전체가 바로 하나의 거대한 문학적 프로그램입니다. 즉, 이 책을 읽어 나가는 과정 자체가 pbrt 렌더링 시스템의 대략적인 개요뿐만 아니라, **실제로 돌아가는 전체 소스코드의 구현 일체**를 읽는 과정이라는 뜻입니다.',
      textEn: 'While creating the TeX typesetting system, Donald Knuth developed a new programming methodology based on a simple but revolutionary idea. To quote Knuth, "let us change our traditional attitude to the construction of programs: Instead of imagining that our main task is to instruct a computer what to do, let us concentrate rather on explaining to human beings what we want a computer to do." He named this methodology literate programming. This book (including the chapter you are reading now) is a long literate program. This means that in the course of reading this book, you will read the full implementation of the pbrt rendering system, not just a high-level description of it.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 상식',
      title: '도널드 커누스(Donald Knuth) 교수의 문학적 프로그래밍 철학',
      summary: '"코드는 컴퓨터만을 위한 명령어가 아니라, 사람과 사람이 소통하는 가장 정밀한 에세이다."',
      points: [
        {
          title: '책 = 완전한 소프트웨어',
          content: 'PBRT는 책에 적힌 설명과 코드 조각들을 그대로 추출(Tangle)하여 빌드하면, 실제로 아카데미 과학기술상을 수상한 최첨단 물리 기반 렌더러 실행 파일이 생성됩니다!'
        },
        {
          title: '순서의 해방 (사람 중심 설계)',
          content: 'C++ 컴파일러는 선언과 정의 순서에 매우 엄격하지만, 사람이 학습할 때는 핵심 아이디어부터 먼저 이해하고 세부 구현은 나중에 보는 것이 훨씬 자연스럽습니다. 문학적 프로그래밍은 설명의 논리적 흐름에 맞춰 코드를 배치할 수 있게 해줍니다.'
        }
      ],
      tags: ['컴퓨터 과학 역사', '프로그래밍 철학', '도널드 커누스']
    },
    {
      type: 'paragraph',
      textKo: '문학적 프로그램은 문서 서식 언어(예: TeX 또는 HTML)와 실제 프로그래밍 언어(예: C++)를 한데 섞어 쓰는 **메타언어(Metalanguage)**로 작성됩니다. 이 프로그램은 서로 다른 두 개의 독립된 시스템에 의해 처리됩니다:\n1. **위버(Weaver, 베 짜는 도구)**: 문학적 프로그램을 조판에 적합한 책/문서 형태로 변환합니다.\n2. **탱글러(Tangler, 실 엉키는 도구)**: 문학적 프로그램에서 코드 블록들만 알맞게 엮어 컴파일러가 빌드할 수 있는 순수 소스코드 파일로 추출합니다.\n\npbrt에서 사용된 문학적 프로그래밍 시스템은 자체 제작된 도구이지만, 노먼 램지(Norman Ramsey)의 유명한 noweb 시스템의 영향을 깊이 받았습니다.',
      textEn: 'Literate programs are written in a metalanguage that mixes a document formatting language (e.g., TeX or HTML) and a programming language (e.g., C++). Two separate systems process the program: a "weaver" that transforms the literate program into a document suitable for typesetting and a "tangler" that produces source code suitable for compilation. Our literate programming system is homegrown, but it was heavily influenced by Norman Ramsey’s noweb system.'
    },
    {
      type: 'paragraph',
      textKo: '이 메타언어는 두 가지 매우 중요한 핵심 기능을 제공합니다.  \n첫째, **설명 글(Prose)과 소스코드를 동등한 위치에서 자유롭게 섞어 쓸 수 있는 능력**입니다. 이 덕분에 소프트웨어의 세심한 설계 철학과 문서화가 실제 코드와 분리되지 않고 동일한 비중으로 다루어집니다.  \n둘째, **컴파일러가 요구하는 순서와 완전히 다른, 사람의 논리적 사고 흐름에 맞춘 순서로 코드를 독자에게 제시할 수 있는 메커니즘**을 제공합니다. 프로그램의 각 명명된 코드 덩어리를 **조각(Fragment)**이라고 부르며, 각 조각은 다른 조각을 이름으로 자유롭게 참조할 수 있습니다.',
      textEn: 'The literate programming metalanguage provides two important features. The first is the ability to mix prose with source code. This feature puts the description of the program on equal footing with its actual source code, encouraging careful design and documentation. Second, the language provides mechanisms for presenting the program code to the reader in an order that is entirely different from the compiler input. Thus, the program can be described in a logical manner. Each named block of code is called a fragment, and each fragment can refer to other fragments by name.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '전통적 프로그래밍의 문제점: 전역 변수 초기화 예시',
      titleEn: 'Traditional Code vs. Literate Programming Example'
    },
    {
      type: 'paragraph',
      textKo: '간단한 예로, 프로그램의 모든 전역 변수를 한꺼번에 초기화하는 `InitGlobals()` 함수를 한번 생각해 봅시다:',
      textEn: 'As a simple example, consider a function InitGlobals() that is responsible for initializing all of a program’s global variables:'
    },
    {
      type: 'code',
      chunkName: '전통적인 C++ 함수 작성 예시',
      language: 'cpp',
      code: `void InitGlobals() {
    nMarbles = 25.7;
    shoeSize = 13;
    dielectric = true;
}`,
      explanationKo: '컴파일러 입장에서는 지극히 정상적인 코드이지만, 아무런 맥락 없이 이 함수만 마주한 사람에게는 매우 난해합니다.'
    },
    {
      type: 'paragraph',
      textKo: '이 함수는 코드가 아주 짧음에도 불구하고, **사전 맥락(Context)이 전혀 없다면 이해하기가 극히 어렵습니다.** 왜 구슬 개수를 뜻하는 것 같은 `nMarbles` 변수가 25.7이라는 부동소수점(실수) 값을 가질까요? 갑자기 신발 사이즈(`shoeSize = 13`)와 재질 속성(`dielectric = true`, 유전체 여부)은 왜 한 공간에서 초기화되고 있을까요?  \n단지 이 코드만 봐서는, 각 변수가 도대체 프로그램 어디에서 선언되었고 무슨 용도로 쓰이는지, 유효한 값의 범위가 무엇인지 파악하기 위해 **수만 줄짜리 프로그램 전체를 뒤져봐야만** 합니다.  \n이러한 구조는 컴파일러에게는 아무 문제가 없지만, 사람인 독자 입장에서는 **변수가 선언되고 실제로 사용되는 설명 바로 곁에서 그 변수의 초기화 코드를 각각 따로 확인하는 것**이 훨씬 이해하기 편합니다.',
      textEn: 'Despite its brevity, this function is hard to understand without any context. Why, for example, can the variable nMarbles take on floating-point values? Just looking at the code, one would need to search through the entire program to see where each variable is declared and how it is used in order to understand its purpose and the meanings of its legal values. Although this structuring of the system is fine for a compiler, a human reader would much rather see the initialization code for each variable presented separately, near the code that declares and uses the variable.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '문학적 프로그래밍의 해결책: 조각(Fragment)과 매크로 치환',
      titleEn: 'Literate Solution: Named Fragments'
    },
    {
      type: 'paragraph',
      textKo: '문학적 프로그래밍에서는 `InitGlobals()` 함수를 다음과 같이 추상화하여 먼저 작성할 수 있습니다:',
      textEn: 'In a literate program, one can instead write InitGlobals() like this:'
    },
    {
      type: 'code',
      chunkName: '<<Function Definitions>>=',
      language: 'cpp',
      code: `void InitGlobals() {
    <<Initialize Global Variables>>
}`,
      explanationKo: 'InitGlobals()의 뼈대만 먼저 정의하고, 구체적인 변수 초기화는 <<Initialize Global Variables>>라는 이름의 다른 조각을 참조하도록 비워둡니다.'
    },
    {
      type: 'paragraph',
      textKo: '이것은 `InitGlobals()` 함수의 정의를 담고 있는 `<<Function Definitions>>`라는 이름의 조각을 새로 정의한 것입니다. 이 함수 내부에서는 또 다른 조각인 `<<Initialize Global Variables>>`를 참조하고 있습니다.  \n아직 초기화 조각의 구체적인 내용이 정의되지 않았기 때문에, 지금 단계에서는 이 함수가 "앞으로 전역 변수들을 대입하는 내용을 담게 될 것"이라는 사실 외에는 아무것도 모릅니다. (하지만 웹사이트에서는 오른쪽에 있는 기호를 클릭해 최종 완성 코드를 미리 엿볼 수 있습니다.)',
      textEn: 'This defines a fragment, called <<Function Definitions>>, that contains the definition of the InitGlobals() function. The InitGlobals() function itself refers to another fragment, <<Initialize Global Variables>>. Because the initialization fragment has not yet been defined, we do not know anything about this function except that it will presumably contain assignments to global variables. (However, we can peek ahead by clicking on the plus sign on the right side of it; doing so expands out all the fragment’s final code.)'
    },
    {
      type: 'paragraph',
      textKo: '아직 변수들이 전혀 선언되지 않은 도입부에서는, 구체적인 변수 대입 코드 대신 이렇게 **조각 이름만 남겨두는 것이 딱 알맞은 수준의 추상화(Abstraction)**입니다.  \n그런 다음, 책의 뒷부분에서 `shoeSize`라는 전역 변수를 소개하고 설명할 때, 바로 그 설명 문맥 곁에 다음과 같이 작성합니다:',
      textEn: 'Just having the fragment name is just the right level of abstraction for now, since no variables have been declared yet. When we introduce the global variable shoeSize somewhere later in the program, we can then write'
    },
    {
      type: 'code',
      chunkName: '<<Initialize Global Variables>>=',
      language: 'cpp',
      code: `shoeSize = 13;`,
      explanationKo: '드디어 <<Initialize Global Variables>> 조각의 초기 내용을 정의하기 시작합니다.'
    },
    {
      type: 'paragraph',
      textKo: '여기서 드디어 `<<Initialize Global Variables>>` 조각의 내용을 정의하기 시작했습니다. 나중에 문학적 프로그램이 컴파일을 위해 소스코드로 엮일(Tangled) 때, 시스템은 `InitGlobals()` 함수 정의 내부의 `<<Initialize Global Variables>>` 자리에 `shoeSize = 13;` 코드를 자동으로 치환해 넣습니다. 등호(`=`) 뒤에 붙는 기호는 나중에 이 조각에 더 많은 코드가 추가될 것임을 나타냅니다.',
      textEn: 'Here we have started to define the contents of <<Initialize Global Variables>>. When the literate program is tangled into source code for compilation, the literate programming system will substitute the code shoeSize = 13; inside the definition of the InitGlobals() function. The symbol after the equals sign indicates that more code will later be added to this fragment. Clicking on it brings you to where that happens.'
    },
    {
      type: 'paragraph',
      textKo: '책의 더 뒤쪽에서 광학 재질과 관련된 또 다른 전역 변수 `dielectric`을 정의하게 되면, 그 설명 옆에서 기존 조각에 초기화 코드를 덧붙입니다:',
      textEn: 'Later in the text, we may define another global variable, dielectric, and we can append its initialization to the fragment:'
    },
    {
      type: 'code',
      chunkName: '<<Initialize Global Variables>>+=',
      language: 'cpp',
      code: `dielectric = true;`,
      explanationKo: '+= 기호는 이전에 선언된 조각에 새로운 내용을 이어서 덧붙인다는 뜻입니다.'
    },
    {
      type: 'paragraph',
      textKo: '조각 이름 뒤에 붙은 `+=` 기호는 **이미 정의된 조각에 코드를 이어 붙였다는 것**을 명확히 보여줍니다. 또한 옆의 화살표 링크는 이전에 코드가 추가되었던 위치로 거슬러 올라갈 수 있게 연결해 줍니다.  \n\n컴파일을 위해 탱글러(Tangler)가 이 세 개의 흩어진 조각들을 하나로 합치면, 마침내 다음과 같은 온전한 컴파일용 소스코드가 탄생합니다:',
      textEn: 'The += symbol after the fragment name shows that we have added to a previously defined fragment. Further, the symbol links back to the previous place where <<Initialize Global Variables>> had code added to it. When tangled, these three fragments turn into the code'
    },
    {
      type: 'code',
      chunkName: '탱글링(Tangling)되어 자동 생성된 최종 C++ 코드',
      language: 'cpp',
      code: `void InitGlobals() {
    // Initialize Global Variables
    shoeSize = 13;
    dielectric = true;
}`,
      explanationKo: '분산되어 설명과 함께 작성된 코드 조각들이 컴파일 시점에는 완벽한 하나의 C++ 함수로 조립됩니다.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '복잡한 함수를 논리적 단위로 분해하기 (complexFunc)',
      titleEn: 'Decomposing Complex Functions'
    },
    {
      type: 'paragraph',
      textKo: '이러한 방식을 활용하면 아무리 복잡한 함수라도 **논리적으로 명확히 구분되는 독립된 단위들로 분해**하여 훨씬 쉽게 이해할 수 있습니다. 예를 들어 복잡한 함수 하나를 일련의 조각들로 구성할 수 있습니다:',
      textEn: 'In this way, we can decompose complex functions into logically distinct parts, making them much easier to understand. For example, we can write a complicated function as a series of fragments:'
    },
    {
      type: 'code',
      chunkName: '<<Function Definitions>>+=',
      language: 'cpp',
      code: `void complexFunc(int x, int y, double *values) {
    <<Check validity of arguments>>
    if (x < y) {
        <<Swap x and y>>
    }
    <<Do precomputation before loop>>
    <<Loop through and update values array>>
}`,
      explanationKo: '함수 전체의 흐름(인자 유효성 검사 -> 필요시 스왑 -> 루프 전 사전 연산 -> 루프 순회 및 배열 갱신)을 한눈에 알아볼 수 있는 목차처럼 서술합니다.'
    },
    {
      type: 'paragraph',
      textKo: '컴파일 시점에는 각 조각의 실제 구현 내용이 `complexFunc()` 내부의 해당 위치에 인라인으로 확장되어 들어갑니다. 그리고 책 본문에서는 각 조각의 세부 구현을 차례대로 하나씩 소개하고 설명할 수 있습니다.  \n이러한 분해 기법 덕분에 **한 번에 단 몇 줄의 코드에만 온전히 집중**할 수 있어 독자가 시스템을 이해하기가 비약적으로 쉬워집니다.  \n\n이 스타일의 또 다른 위대한 장점은, **하나의 명확하고 잘 정의된 목적을 가진 논리적 조각 단위로 함수가 분리되므로, 각 조각을 독립적으로 작성하고, 검증하고, 읽을 수 있다는 점**입니다. 일반적으로 이 책에서는 **각 조각의 길이를 10줄 이내**로 유지하도록 노력할 것입니다.',
      textEn: 'Again, the contents of each fragment are expanded inline in complexFunc() for compilation. In the document, we can introduce each fragment and its implementation in turn. This decomposition lets us present code a few lines at a time, making it easier to understand. Another advantage of this style of programming is that by separating the function into logical fragments, each with a single and well-delineated purpose, each one can then be written, verified, or read independently. In general, we will try to make each fragment less than 10 lines long.'
    },
    {
      type: 'paragraph',
      textKo: '어떤 관점에서 보면 문학적 프로그래밍 시스템은 단지 소스코드의 순서를 재배치하는 데 특화된 "강화된 매크로 치환 패키지"에 불과해 보일 수도 있습니다. 얼핏 사소한 변화처럼 느껴질 수 있지만, 실상은 **소프트웨어 시스템을 설계하고 지식을 전달하는 방식을 송두리째 뒤바꾸는 근본적인 패러다임의 전환**입니다.',
      textEn: 'In some sense, the literate programming system is just an enhanced macro substitution package tuned to the task of rearranging program source code. This may seem like a trivial change, but in fact literate programming is quite different from other ways of structuring software systems.'
    }
  ]
};
