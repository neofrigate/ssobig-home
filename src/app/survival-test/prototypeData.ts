export type GroupType = "A그룹" | "B그룹" | "C그룹";
export type PositionType = "주도형" | "지원형";
export type JudgmentType = "본능형" | "전략형";

type ScoreKey = GroupType | PositionType | JudgmentType;

export type QuestionOption = {
  id: string;
  label: string;
  text: string;
  scores: Partial<Record<ScoreKey, number>>;
};

export type Question = {
  id: number;
  prompt: string;
  options: QuestionOption[];
};

export type CharacterProfile = {
  group: GroupType;
  position: PositionType;
  judgment: JudgmentType;
  name: string;
  tagline: string;
  summary: string;
};

export const questions: Question[] = [
  {
    id: 1,
    prompt: "생존캠프의 철문 앞에 선 당신. 안쪽 사람들은 쉽게 문을 열어주지 않고, 밖에서는 또 다른 생존자 무리가 도움을 요청하고 있습니다.",
    options: [
      {
        id: "A",
        label: "A",
        text: "최대한 지친 모습을 보여주며, 제발 살려달라고 호소한다.",
        scores: { A그룹: 1, 본능형: 1 },
      },
      {
        id: "B",
        label: "B",
        text: "내가 할 수 있는 일과 가진 기술을 말하며 쓸모를 증명한다.",
        scores: { C그룹: 1, 전략형: 1 },
      },
      {
        id: "C",
        label: "C",
        text: "우리를 못 들여보내도 어린아이와 약한 사람만은 들여보내달라고 한다.",
        scores: { A그룹: 1, 지원형: 1 },
      },
      {
        id: "D",
        label: "D",
        text: "이 상황에 사람을 밖에 세워두는 게 말이 되냐고 따진다.",
        scores: { C그룹: 1, 주도형: 1 },
      },
    ],
  },
  {
    id: 2,
    prompt: "간신히 철문 안으로 들어왔지만, 아직 누구도 당신을 완전히 믿지는 않습니다. 사람들은 각자 바쁘고, 당신이 어떤 사람인지 지켜보고 있습니다.",
    options: [
      {
        id: "A",
        label: "A",
        text: "주변 사람들에게 말을 걸고, 분위기를 살피며 자연스럽게 섞인다.",
        scores: { A그룹: 1, 지원형: 1 },
      },
      {
        id: "B",
        label: "B",
        text: "캠프 구조와 출입구, 물자 위치부터 조용히 파악한다.",
        scores: { B그룹: 1, 전략형: 1 },
      },
      {
        id: "C",
        label: "C",
        text: "내가 맡을 수 있는 일을 찾아서 바로 움직인다.",
        scores: { A그룹: 1, 주도형: 1 },
      },
      {
        id: "D",
        label: "D",
        text: "누가 실세인지, 누구와 가까워져야 할지 먼저 본다.",
        scores: { C그룹: 1, 전략형: 1 },
      },
    ],
  },
  {
    id: 3,
    prompt: "캠프에 들어온 지 얼마 지나지 않아 식량이 예상보다 빠르게 줄고 있다는 이야기를 듣습니다. 모두가 불안해하지만, 아직 정확한 대책은 없습니다.",
    options: [
      {
        id: "A",
        label: "A",
        text: "사람들을 모아 솔직하게 상황을 공유한다.",
        scores: { A그룹: 1, 주도형: 1 },
      },
      {
        id: "B",
        label: "B",
        text: "배급표를 다시 짜고 낭비를 막는다.",
        scores: { B그룹: 1, 지원형: 1 },
      },
      {
        id: "C",
        label: "C",
        text: "다음에 구할 식량 위치부터 찾는다.",
        scores: { C그룹: 1, 전략형: 1 },
      },
      {
        id: "D",
        label: "D",
        text: "불안해하는 사람들을 먼저 챙긴다.",
        scores: { A그룹: 1, 지원형: 1 },
      },
    ],
  },
  {
    id: 4,
    prompt: "밤이 되자 좀비들이 더 활발해집니다. 캠프 밖에서는 울음 같은 소리, 긁는 소리, 무언가 부딪히는 소리가 계속 들려옵니다.",
    options: [
      {
        id: "A",
        label: "A",
        text: "경비를 더 철저히 한다. 이런 밤일수록 긴장을 늦추면 안 된다.",
        scores: { B그룹: 1, 본능형: 1 },
      },
      {
        id: "B",
        label: "B",
        text: "내일 할 일이 많으니 귀를 막고 잠을 청한다.",
        scores: { C그룹: 1, 본능형: 1 },
      },
      {
        id: "C",
        label: "C",
        text: "잠자기는 글렀으니 믿을 만한 사람들과 조용히 대화한다.",
        scores: { C그룹: 1, 지원형: 1 },
      },
      {
        id: "D",
        label: "D",
        text: "소리가 나는 방향과 패턴을 기억해둔다. 내일 움직일 때 도움이 될 수 있다.",
        scores: { B그룹: 1, 전략형: 1 },
      },
    ],
  },
  {
    id: 5,
    prompt: "다음 날, 캠프는 부족한 물자를 구하기 위해 탐사 장소를 정해야 합니다. 모든 장소에는 위험이 있지만, 가만히 있을 수도 없습니다.",
    options: [
      {
        id: "A",
        label: "A",
        text: "생존캠프 안에서 쓸 만한 물건을 찾아보고 정보를 수집한다.",
        scores: { A그룹: 1, 전략형: 1 },
      },
      {
        id: "B",
        label: "B",
        text: "구조가 안전하고 빠져나오기 쉬운 곳",
        scores: { B그룹: 1, 본능형: 1 },
      },
      {
        id: "C",
        label: "C",
        text: "물자가 많을 가능성이 높은 곳",
        scores: { C그룹: 1, 주도형: 1 },
      },
      {
        id: "D",
        label: "D",
        text: "내가 잘 아는 방식으로 움직일 수 있는 곳",
        scores: { C그룹: 1, 본능형: 1 },
      },
    ],
  },
  {
    id: 6,
    prompt: "탐사 중 우연히 식량이 쌓인 장소를 발견했습니다. 아직 이걸 본 사람은 당신뿐이고, 딱 봐도 양이 꽤 많아 보입니다.",
    options: [
      {
        id: "A",
        label: "A",
        text: "바로 사람들에게 알려서 모두가 먹을 수 있게 한다.",
        scores: { A그룹: 1, 주도형: 1 },
      },
      {
        id: "B",
        label: "B",
        text: "먼저 위치와 양을 확인하고, 안전하게 옮길 계획을 세운다.",
        scores: { B그룹: 1, 지원형: 1 },
      },
      {
        id: "C",
        label: "C",
        text: "우선 나와 친한 사람들에게만 조용히 알려둔다.",
        scores: { C그룹: 1, 지원형: 1 },
      },
      {
        id: "D",
        label: "D",
        text: "혹시 모르니 아무에게도 말하지 않고 몇 개만 내 몫으로 숨겨둔다.",
        scores: { C그룹: 1, 본능형: 1 },
      },
    ],
  },
  {
    id: 7,
    prompt: "며칠 뒤, 또 다른 생존자들이 캠프를 찾아왔습니다. 지친 얼굴의 사람들, 다친 사람, 어린아이까지 섞여 있습니다. 하지만 캠프의 식량과 공간은 이미 빠듯합니다.",
    options: [
      {
        id: "A",
        label: "A",
        text: "사람이 많아야 방어도 된다. 일단 받아들이자.",
        scores: { A그룹: 1, 주도형: 1 },
      },
      {
        id: "B",
        label: "B",
        text: "능력과 상태를 확인한 뒤, 받을 사람을 정하자.",
        scores: { B그룹: 1, 지원형: 1 },
      },
      {
        id: "C",
        label: "C",
        text: "모두는 어렵더라도 아이와 다친 사람은 들여보내자.",
        scores: { A그룹: 1, 지원형: 1 },
      },
      {
        id: "D",
        label: "D",
        text: "지금은 우리도 위험하다. 함부로 받을 수 없다.",
        scores: { C그룹: 1, 본능형: 1 },
      },
    ],
  },
  {
    id: 8,
    prompt: "최근 들어온 생존자 중, 마음이 잘 맞는 동료가 생겼습니다. 함께 탐사를 다니며 꽤 믿을 만한 사람이라고 생각했습니다. 그런데 우연히 그 사람이 과거 범죄자였다는 사실을 알게 됩니다.",
    options: [
      {
        id: "A",
        label: "A",
        text: "과거보다 지금 어떤 사람인지가 더 중요하다. 모른 척한다.",
        scores: { A그룹: 1, 본능형: 1 },
      },
      {
        id: "B",
        label: "B",
        text: "위험 요소일 수 있으니 리더에게만 조용히 알린다.",
        scores: { B그룹: 1, 지원형: 1 },
      },
      {
        id: "C",
        label: "C",
        text: "모두가 알아야 한다. 공개적으로 문제를 제기한다.",
        scores: { B그룹: 1, 주도형: 1 },
      },
      {
        id: "D",
        label: "D",
        text: "먼저 따로 불러 직접 이야기를 들어본다.",
        scores: { A그룹: 1, 지원형: 1 },
      },
    ],
  },
  {
    id: 9,
    prompt: "항상 닫혀 있어야 할 캠프의 문이 열려 있었습니다. 다행히 좀비들이 활발하지 않은 낮이라 피해는 없었습니다. 하지만 누가, 왜 열었는지는 아무도 모릅니다.",
    options: [
      {
        id: "A",
        label: "A",
        text: "실수였을 수도 있다. 먼저 사람들에게 침착하게 확인한다.",
        scores: { A그룹: 1, 지원형: 1 },
      },
      {
        id: "B",
        label: "B",
        text: "출입 기록과 주변 동선을 확인해 범위를 좁힌다.",
        scores: { B그룹: 1, 전략형: 1 },
      },
      {
        id: "C",
        label: "C",
        text: "내부에 위험한 사람이 있을 수 있다. 믿을 사람들끼리 먼저 대비한다.",
        scores: { C그룹: 1, 본능형: 1 },
      },
      {
        id: "D",
        label: "D",
        text: "지금 당장 문 관리 규칙을 강화하고 책임자를 세운다.",
        scores: { B그룹: 1, 주도형: 1 },
      },
    ],
  },
  {
    id: 10,
    prompt: "이제 이 생존캠프도 예전만큼 안전하지 않습니다. 사람이 많아진 탓인지 식량은 부족하고, 서로를 의심하는 일도 늘었습니다. 이곳에 남을지, 떠날지 결정해야 할 때가 왔습니다.",
    options: [
      {
        id: "A",
        label: "A",
        text: "그래도 함께 버텨야 한다. 캠프를 다시 세울 방법을 찾는다.",
        scores: { A그룹: 1, 주도형: 1 },
      },
      {
        id: "B",
        label: "B",
        text: "통제만 제대로 하면 아직 가능성이 있다. 규칙부터 바꾼다.",
        scores: { B그룹: 1, 주도형: 1 },
      },
      {
        id: "C",
        label: "C",
        text: "믿을 수 있는 사람들과 조용히 떠날 준비를 한다.",
        scores: { C그룹: 1, 지원형: 1 },
      },
      {
        id: "D",
        label: "D",
        text: "당장 떠나진 않지만, 언제든 나갈 수 있는 길을 확보해둔다.",
        scores: { C그룹: 1, 전략형: 1 },
      },
    ],
  },
];

export const profiles: CharacterProfile[] = [
  {
    group: "A그룹",
    position: "주도형",
    judgment: "본능형",
    name: "목사",
    tagline: "우리는 아직 끝나지 않았습니다. 함께 살 수 있습니다.",
    summary:
      "무너진 세상 속에서도 공동체를 세우려는 믿음을 놓지 않는 인물. 사람을 모으고 마음을 일으키는 방식으로 판을 움직입니다.",
  },
  {
    group: "A그룹",
    position: "주도형",
    judgment: "전략형",
    name: "공사장 반장",
    tagline: "살고 싶으면 말보다 먼저 손부터 움직여.",
    summary:
      "혼란 속에서도 생존 기반을 바로 세우는 실무형 리더. 감정보다 구조를 먼저 보고, 구조가 무너지기 전에 행동합니다.",
  },
  {
    group: "A그룹",
    position: "지원형",
    judgment: "본능형",
    name: "요가강사",
    tagline: "괜찮아질 거예요, 우리. 웃고 있으면 분명히.",
    summary:
      "분위기를 무너뜨리지 않고 사람의 마음을 붙드는 생존자. 함께 버티는 감각이 강하고, 불안한 순간에도 낙관을 유지합니다.",
  },
  {
    group: "A그룹",
    position: "지원형",
    judgment: "전략형",
    name: "의사",
    tagline: "살아남아야죠. 잃은 걸 전부 되찾을 때까지.",
    summary:
      "사람을 살리는 역할에 익숙하지만, 그 안에 냉정한 집념도 함께 가진 인물. 돌봄과 계산이 균형을 이루는 타입입니다.",
  },
  {
    group: "B그룹",
    position: "주도형",
    judgment: "본능형",
    name: "소방관",
    tagline: "망설이면 늦어. 살아남고 싶으면 지금 움직여.",
    summary:
      "위기 앞에서 몸이 먼저 움직이는 돌파형 리더. 모두가 얼어붙는 순간에도 명확한 방향과 속도로 팀을 끌고 갑니다.",
  },
  {
    group: "B그룹",
    position: "주도형",
    judgment: "전략형",
    name: "경호원",
    tagline: "방심하지 마. 무너지는 건 늘 한순간이니까.",
    summary:
      "붕괴를 막기 위해 질서와 경계를 먼저 세우는 타입. 통제 가능한 상태를 만드는 데 강하고, 경계심이 생존력으로 이어집니다.",
  },
  {
    group: "B그룹",
    position: "지원형",
    judgment: "본능형",
    name: "셰프",
    tagline: "일단 먹고 버텨. 살아남는 건 그런 것부터야.",
    summary:
      "평온한 일상의 감각을 지켜내려는 현실적인 지원자. 작지만 실제적인 것부터 챙기며 팀의 생존 리듬을 회복시킵니다.",
  },
  {
    group: "B그룹",
    position: "지원형",
    judgment: "전략형",
    name: "공대생",
    tagline: "감정은 나중에. 일단 살아남을 방법부터 계산하자.",
    summary:
      "시스템과 구조를 읽는 데 강한 분석형 생존자. 감정에 휘둘리지 않고 생존 공식을 빠르게 조합합니다.",
  },
  {
    group: "C그룹",
    position: "주도형",
    judgment: "본능형",
    name: "퇴역군인",
    tagline: "이젠 명령이 아니라 생존이다. 따라와.",
    summary:
      "세상이 전쟁터가 되자 다시 몸을 일으키는 타입. 위험을 두려워하기보다 팀을 이끌며 버틸 방법을 실전적으로 찾습니다.",
  },
  {
    group: "C그룹",
    position: "주도형",
    judgment: "전략형",
    name: "좀도둑",
    tagline: "믿을 건 없지. 그러니까 먼저 챙기는 사람이 사는 거야.",
    summary:
      "남보다 먼저 읽고 먼저 움직이는 냉정한 생존자. 신뢰보다 계산을 우선하지만, 그만큼 상황 판단이 빠릅니다.",
  },
  {
    group: "C그룹",
    position: "지원형",
    judgment: "본능형",
    name: "농부",
    tagline: "끝까지 버텨야지... 돌아가야 할 곳이 있으니까.",
    summary:
      "화려하진 않지만 오래 버티는 힘을 가진 타입. 내 사람을 지키고 돌아갈 곳을 남겨두기 위해 묵묵히 버팁니다.",
  },
  {
    group: "C그룹",
    position: "지원형",
    judgment: "전략형",
    name: "간호사",
    tagline: "무섭더라도 살아야 해요. 그래야 다시 시작할 수 있으니까.",
    summary:
      "상처받기 쉬워도 끝까지 살아남으려는 의지를 가진 인물. 흔들리더라도 필요한 판단을 놓치지 않습니다.",
  },
];
