"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  questions,
} from "./prototypeData";
import {
  characterImages,
} from "./prototypeCharacters";
import { resolveResult, type Answers, type Result } from "./prototypeEngine";

const ACCENT = "#d60404";

type ResultCopy = {
  resultTitle: string;
  behaviorSummary: string[];
  prototypeMatch: string;
  bestMatchName: string;
  bestMatchReason: string;
  rivalName: string;
  rivalReason: string;
};

const groupLabels = {
  A그룹: "공존형",
  B그룹: "통제형",
  C그룹: "경계형",
} as const;

const resultCopyByProfile: Record<string, ResultCopy> = {
  "목사": {
    resultTitle: "당신은 사람을 다시 묶어 세우는 공존형 리더입니다.",
    behaviorSummary: [
      "위기가 닥쳤을 때 당신은 먼저 사람의 마음이 무너지지 않게 붙잡으려 합니다. 누군가 겁에 질리거나 서로를 의심하기 시작하면, 상황을 정리하기 전에 공동체를 다시 한 방향으로 모으는 쪽을 택합니다. 당신은 살아남는 일도 중요하지만, 어떻게 함께 살아남느냐를 더 크게 보는 사람입니다.",
      "절망적인 상황에서도 쉽게 희망을 놓지 않고, 누군가의 버팀목이 되려는 성향이 강합니다. 그래서 주변 사람들은 당신을 따라 안정을 찾기도 하지만, 때로는 너무 많은 사람을 품으려다 위험을 감수할 수도 있습니다.",
    ],
    prototypeMatch:
      "당신은 프로토타입에서 목사 캐릭터와 가장 비슷한 면을 가지고 있습니다.",
    bestMatchName: "의사",
    bestMatchReason:
      "당신이 사람들을 하나로 묶는다면, 의사는 그 안에서 실제로 사람을 살리고 버틸 방법을 찾아줍니다. 이상과 현실이 맞물릴 때 가장 강한 팀이 됩니다.",
    rivalName: "좀도둑",
    rivalReason:
      "당신은 함께 살아남는 쪽을 믿지만, 좀도둑은 먼저 챙기는 사람이 살아남는다고 생각합니다. 결정적인 순간에 서로를 가장 불편하게 느낄 가능성이 큽니다.",
  },
  "공사장 반장": {
    resultTitle: "당신은 사람을 살릴 구조부터 세우는 공존형 실무 리더입니다.",
    behaviorSummary: [
      "당신은 감정만으로 사람을 모으지 않습니다. 누가 어디에 서야 하는지, 무엇부터 막아야 하는지, 지금 당장 손을 대야 할 구조가 무엇인지를 빠르게 파악합니다. 당신에게 생존은 기세가 아니라 버틸 수 있는 기반을 만드는 일입니다.",
      "말보다 행동이 빠르고, 혼란스러운 상황에서도 손에 잡히는 해결책을 먼저 내놓습니다. 다만 모두를 챙기려는 마음이 있는 만큼, 책임을 혼자 너무 많이 짊어질 위험도 있습니다.",
    ],
    prototypeMatch:
      "당신은 프로토타입에서 공사장 반장 캐릭터와 가장 비슷한 면을 가지고 있습니다.",
    bestMatchName: "요가강사",
    bestMatchReason:
      "당신이 무너지는 구조를 붙들면, 요가강사는 무너지는 사람의 마음을 붙듭니다. 현장 정리와 분위기 회복이 동시에 가야 오래 버틸 수 있습니다.",
    rivalName: "경호원",
    rivalReason:
      "둘 다 질서를 세우려 하지만, 당신은 함께 버티기 위한 구조를 만들고 경호원은 붕괴를 막기 위한 통제를 먼저 봅니다. 주도권이 겹치면 강하게 부딪힐 수 있습니다.",
  },
  "요가강사": {
    resultTitle: "당신은 분위기를 무너뜨리지 않는 공존형 버팀목입니다.",
    behaviorSummary: [
      "당신은 위기 앞에서 모두를 다그치기보다, 먼저 사람들의 표정과 감정을 읽습니다. 누가 불안해하는지, 누가 혼자 무너질 것 같은지, 지금 어떤 말이 필요한지를 본능적으로 알아차립니다. 당신에게 생존은 싸움만이 아니라 끝까지 인간다움을 잃지 않는 일입니다.",
      "겉으로는 밝고 부드럽지만, 바로 그런 태도 때문에 오히려 많은 사람이 당신에게 기대게 됩니다. 다만 현실을 낙관으로만 덮으려 하면, 위험 신호를 늦게 볼 수도 있습니다.",
    ],
    prototypeMatch:
      "당신은 프로토타입에서 요가강사 캐릭터와 가장 비슷한 면을 가지고 있습니다.",
    bestMatchName: "공사장 반장",
    bestMatchReason:
      "당신이 사람을 붙들고, 공사장 반장이 상황을 정리하면 팀이 훨씬 오래 버팁니다. 감정과 구조가 같이 가는 조합입니다.",
    rivalName: "공대생",
    rivalReason:
      "당신은 사람의 마음을 먼저 보지만, 공대생은 계산과 구조를 먼저 봅니다. 서로의 방식이 너무 차갑거나 너무 답답하게 느껴질 수 있습니다.",
  },
  "의사": {
    resultTitle:
      "당신은 살릴 수 있는 사람과 방법을 끝까지 놓지 않는 공존형 전략가입니다.",
    behaviorSummary: [
      "당신은 감정에 휩쓸리기보다, 지금 누구를 어떻게 살릴 수 있는지부터 계산합니다. 하지만 그 계산은 냉혹한 거리두기가 아니라, 더 오래 버티기 위해 필요한 책임감에 가깝습니다. 당신에게 생존은 무조건 살아남는 일이 아니라 살아남을 가치가 있는 것을 지키는 일입니다.",
      "차분하고 실용적이며, 위기 속에서도 해야 할 일을 놓치지 않습니다. 다만 모든 것을 혼자 감당하려 하면 마음속 피로가 가장 늦게 터질 수 있습니다.",
    ],
    prototypeMatch:
      "당신은 프로토타입에서 의사 캐릭터와 가장 비슷한 면을 가지고 있습니다.",
    bestMatchName: "목사",
    bestMatchReason:
      "당신이 현실적인 생존 가능성을 계산하면, 목사는 사람을 다시 묶는 힘을 보탭니다. 냉정함과 신념이 함께 가야 팀이 오래 유지됩니다.",
    rivalName: "좀도둑",
    rivalReason:
      "당신은 누군가를 살릴 가능성을 끝까지 보려 하지만, 좀도둑은 손익과 탈출 경로를 더 빨리 계산합니다. 같은 상황을 두고 내리는 결론이 크게 달라질 수 있습니다.",
  },
  "소방관": {
    resultTitle: "당신은 위기 앞에서 몸이 먼저 움직이는 통제형 돌파 리더입니다.",
    behaviorSummary: [
      "당신은 위기 상황을 오래 바라보지 않습니다. 망설이는 순간 더 많은 것이 무너진다고 느끼기 때문에, 먼저 뛰어들고 먼저 방향을 잡습니다. 당신에게 생존은 토론보다 즉각적인 대응과 실행에 가깝습니다.",
      "사람들은 당신의 속도감 덕분에 살 길을 찾기도 하지만, 때로는 당신의 결단이 너무 빠르다고 느낄 수도 있습니다. 그래도 모두가 얼어붙은 순간 가장 먼저 판을 움직이는 쪽은 대개 당신입니다.",
    ],
    prototypeMatch:
      "당신은 프로토타입에서 소방관 캐릭터와 가장 비슷한 면을 가지고 있습니다.",
    bestMatchName: "공대생",
    bestMatchReason:
      "당신이 먼저 움직이고 공대생이 구조를 계산하면, 속도와 정확도가 함께 살아납니다. 즉흥성과 분석이 서로의 약점을 보완합니다.",
    rivalName: "목사",
    rivalReason:
      "당신은 지금 움직여야 산다고 느끼지만, 목사는 사람들을 먼저 모으고 결속시키려 합니다. 위기 순간엔 그 차이가 답답함과 충돌로 이어질 수 있습니다.",
  },
  "경호원": {
    resultTitle: "당신은 무너지기 전에 선을 긋는 통제형 전략 리더입니다.",
    behaviorSummary: [
      "당신은 위험이 터진 뒤 대응하기보다, 애초에 무너지지 않도록 통제 가능한 상태를 만드는 데 강합니다. 누가 위험 요소인지, 어떤 경계가 필요한지, 어디서부터 틈이 생기는지를 빠르게 읽습니다. 당신에게 생존은 질서를 잃지 않는 것입니다.",
      "감정에 휘둘리지 않고, 신뢰보다 검증을 먼저 택하는 편입니다. 그래서 위험한 상황일수록 더 든든하게 느껴지지만, 반대로 차갑고 단단하게 보일 수도 있습니다.",
    ],
    prototypeMatch:
      "당신은 프로토타입에서 경호원 캐릭터와 가장 비슷한 면을 가지고 있습니다.",
    bestMatchName: "셰프",
    bestMatchReason:
      "당신이 바깥 질서를 세우는 동안 셰프는 안쪽 리듬과 체력을 지켜줍니다. 통제와 생활 감각이 합쳐질 때 팀의 안정감이 커집니다.",
    rivalName: "목사",
    rivalReason:
      "당신은 믿음보다 검증을 먼저 보지만, 목사는 믿음으로 사람을 묶으려 합니다. 위기의 기준을 어디에 두느냐부터 달라서 쉽게 부딪힐 수 있습니다.",
  },
  "셰프": {
    resultTitle: "당신은 무너진 일상을 다시 이어 붙이는 통제형 지원자입니다.",
    behaviorSummary: [
      "당신은 거창한 구호보다, 오늘 먹을 것과 지금 버틸 리듬을 먼저 챙깁니다. 누군가는 그것을 사소하다고 생각할 수 있지만, 당신은 가장 현실적인 생존이 결국 사람을 살린다고 압니다. 당신에게 생존은 버티는 생활을 계속 가능하게 만드는 일입니다.",
      "전면에 나서기보다 필요한 자리를 채우는 데 강하고, 작은 균형이 깨질 때 누구보다 예민하게 알아차립니다. 다만 규칙을 흔드는 사람에게는 의외로 강한 불신을 보일 수 있습니다.",
    ],
    prototypeMatch:
      "당신은 프로토타입에서 셰프 캐릭터와 가장 비슷한 면을 가지고 있습니다.",
    bestMatchName: "경호원",
    bestMatchReason:
      "경호원이 바깥을 통제하면, 당신은 안쪽 리듬을 회복시킵니다. 질서와 생활이 함께 돌아갈 때 공동체는 오래 버틸 수 있습니다.",
    rivalName: "좀도둑",
    rivalReason:
      "당신은 모두가 버틸 수 있는 최소 질서를 지키려 하지만, 좀도둑은 먼저 챙기고 빠져나갈 계산을 합니다. 자원과 신뢰 문제에서 특히 크게 충돌할 가능성이 있습니다.",
  },
  "공대생": {
    resultTitle: "당신은 감정보다 구조를 먼저 읽는 통제형 분석가입니다.",
    behaviorSummary: [
      "당신은 위기 속에서도 패턴과 시스템을 찾습니다. 무엇이 문제를 만들었는지, 어디를 막아야 하는지, 어떤 선택이 가장 높은 생존 확률을 갖는지를 빠르게 계산합니다. 당신에게 생존은 운이 아니라 구조와 판단의 문제입니다.",
      "침착하고 이성적이며, 혼란 속에서도 해결 가능성을 조합하는 데 능합니다. 하지만 다른 사람들에게는 당신이 지나치게 차갑거나 계산적으로 보일 수도 있습니다.",
    ],
    prototypeMatch:
      "당신은 프로토타입에서 공대생 캐릭터와 가장 비슷한 면을 가지고 있습니다.",
    bestMatchName: "소방관",
    bestMatchReason:
      "당신이 계산한 길을 소방관이 즉시 실행하면, 전략이 실제 생존력으로 바뀝니다. 판단과 돌파가 맞물리는 조합입니다.",
    rivalName: "요가강사",
    rivalReason:
      "당신은 계산을 먼저 보지만, 요가강사는 분위기와 감정을 먼저 봅니다. 서로의 접근 방식이 비현실적이거나 답답하게 느껴질 수 있습니다.",
  },
  "퇴역군인": {
    resultTitle: "당신은 위험 앞에서 다시 몸을 세우는 경계형 실전 리더입니다.",
    behaviorSummary: [
      "당신은 세상이 무너졌을 때 오히려 자신이 해야 할 일을 더 분명하게 느끼는 사람입니다. 위험을 오래 고민하기보다, 살아남기 위해 지금 누가 움직여야 하는지를 먼저 봅니다. 당신에게 생존은 망설임 없는 실전 대응입니다.",
      "강한 책임감과 본능적인 행동력이 있지만, 쉽게 긴장을 풀지 못합니다. 그래서 많은 사람을 지킬 수도 있지만, 동시에 사람들에게 휴식을 주지 못할 수도 있습니다.",
    ],
    prototypeMatch:
      "당신은 프로토타입에서 퇴역군인 캐릭터와 가장 비슷한 면을 가지고 있습니다.",
    bestMatchName: "간호사",
    bestMatchReason:
      "당신이 앞으로 밀고 나가면, 간호사는 무너진 사람과 감정을 뒤에서 수습합니다. 실전 대응과 회복력이 같이 있을 때 팀이 오래 갑니다.",
    rivalName: "의사",
    rivalReason:
      "둘 다 사람을 살리고 싶어도, 당신은 실전과 선택을 먼저 보고 의사는 끝까지 살릴 가능성을 계산합니다. 결정적인 순간 판단 기준이 갈릴 수 있습니다.",
  },
  "좀도둑": {
    resultTitle: "당신은 먼저 읽고 먼저 챙기는 경계형 전략 생존자입니다.",
    behaviorSummary: [
      "당신은 사람보다 상황의 흐름을 먼저 읽습니다. 누가 어떤 패를 숨기고 있는지, 어디서 틈이 생기는지, 지금 빠져나갈 길이 있는지를 가장 빨리 계산합니다. 당신에게 생존은 남보다 한발 먼저 움직이는 것입니다.",
      "쉽게 믿지 않고, 늘 대비책을 하나쯤 더 만들어 둡니다. 그래서 위험한 상황에선 가장 빠르게 살아남을 수 있지만, 동시에 가장 의심받기 쉬운 타입이기도 합니다.",
    ],
    prototypeMatch:
      "당신은 프로토타입에서 좀도둑 캐릭터와 가장 비슷한 면을 가지고 있습니다.",
    bestMatchName: "농부",
    bestMatchReason:
      "당신이 빠르게 길을 읽는다면, 농부는 끝까지 버티는 힘을 더합니다. 속도와 끈기가 묶일 때 예상보다 안정적인 조합이 됩니다.",
    rivalName: "목사",
    rivalReason:
      "당신은 신뢰보다 계산을 먼저 보고, 목사는 계산보다 신념으로 사람을 모읍니다. 두 사람은 서로를 가장 이해하기 어려운 축에 서 있습니다.",
  },
  "농부": {
    resultTitle: "당신은 조용히 오래 버티는 경계형 생존자입니다.",
    behaviorSummary: [
      "당신은 눈에 띄게 앞에 나서지는 않지만, 끝까지 버티는 힘이 강합니다. 지금 이 순간의 화려한 결정보다, 결국 마지막까지 남을 사람과 지켜야 할 것을 더 오래 붙듭니다. 당신에게 생존은 버티고 돌아갈 이유를 잃지 않는 것입니다.",
      "말은 적어도 마음속 기준은 분명하고, 한 번 마음 준 사람은 쉽게 놓지 않습니다. 하지만 너무 오래 혼자 참으면, 진짜 위험이 왔을 때 도움을 요청하지 못할 수도 있습니다.",
    ],
    prototypeMatch:
      "당신은 프로토타입에서 농부 캐릭터와 가장 비슷한 면을 가지고 있습니다.",
    bestMatchName: "좀도둑",
    bestMatchReason:
      "당신이 오래 버티는 힘을 갖고 있다면, 좀도둑은 위험한 순간 빠르게 활로를 찾습니다. 의외로 서로의 부족한 속도와 끈기를 채워줄 수 있습니다.",
    rivalName: "소방관",
    rivalReason:
      "당신은 버티며 지키는 쪽에 가깝고, 소방관은 바로 뛰어들어 판을 바꾸는 쪽에 가깝습니다. 속도감의 차이가 부담으로 느껴질 수 있습니다.",
  },
  "간호사": {
    resultTitle: "당신은 흔들려도 끝까지 판단을 놓지 않는 경계형 회복자입니다.",
    behaviorSummary: [
      "당신은 겉으로 강한 척하기보다, 두려움과 현실을 둘 다 안고 움직이는 사람입니다. 무섭더라도 포기하지 않고, 상처 입은 사람과 무너진 상황을 동시에 살피며 어떻게든 다음으로 이어지게 만듭니다. 당신에게 생존은 다시 시작할 가능성을 남기는 것입니다.",
      "섬세하고 조심스럽지만, 정말 필요할 때는 생각보다 훨씬 단단한 판단을 내립니다. 다만 주변의 압박이 너무 강해지면 스스로를 뒤로 미루는 경향이 생길 수 있습니다.",
    ],
    prototypeMatch:
      "당신은 프로토타입에서 간호사 캐릭터와 가장 비슷한 면을 가지고 있습니다.",
    bestMatchName: "퇴역군인",
    bestMatchReason:
      "퇴역군인이 앞에서 위험을 뚫고 나가면, 당신은 뒤에서 회복과 균형을 책임집니다. 압박을 버티는 힘과 사람을 살리는 감각이 함께 가는 조합입니다.",
    rivalName: "공사장 반장",
    rivalReason:
      "당신은 조심스럽게 살피며 움직이지만, 공사장 반장은 구조를 세우기 위해 빠르게 밀어붙이는 편입니다. 속도와 압박감의 차이가 가장 크게 느껴질 수 있습니다.",
  },
};

function getQuestionHelper(id: number) {
  const helpers: Record<number, string> = {
    1: "당신의 첫 반응은?",
    2: "당신이 제일 먼저 하는 행동은?",
    3: "당신이 가장 먼저 할 일은?",
    4: "당신은?",
    5: "가장 끌리는 곳은?",
    6: "당신은 어떻게 할까?",
    7: "당신은?",
    8: "당신은?",
    9: "당신은?",
    10: "당신은?",
  };

  return helpers[id] ?? "하나를 골라주세요.";
}

function MatchCharacterImage({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const src = characterImages[name];

  if (!src) {
    return null;
  }

  return (
    <div
      className={`relative shrink-0 overflow-visible bg-transparent ${className}`}
      aria-hidden="true"
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="96px"
        className="object-contain object-center"
      />
    </div>
  );
}

function getStepInfo(stepIndex: number) {
  if (stepIndex === 0) {
    return {
      title: "캠프에 도착한 당신",
      description:
        "원인 모를 바이러스가 세상을 멈춰 세웠습니다. 이성을 잃은 감염자들이 거리를 장악했고, 살아남은 사람들은 서로를 믿어야만 밤을 넘길 수 있습니다.",
      countLabel: "intro",
      actionLabel: "생존 성향 테스트 시작하기",
    };
  }

  if (stepIndex === questions.length + 1) {
    return {
      title: "결과 분석 중",
      description: "당신의 선택을 대조하고 생존 프로필을 찾고 있습니다.",
      countLabel: "loading",
      actionLabel: "",
    };
  }

  if (stepIndex === questions.length + 2) {
    return {
      title: "결과가 나왔습니다.",
      description: "당신의 선택을 바탕으로 가장 닮은 생존 캐릭터를 보여줍니다.",
      countLabel: "result",
      actionLabel: "다시 테스트",
    };
  }

  const question = questions[stepIndex - 1];
  return {
    title: question.prompt,
    description: getQuestionHelper(question.id),
    countLabel: `${question.id}/${questions.length}`,
    actionLabel: stepIndex === questions.length ? "결과 보기" : "다음",
  };
}

function getPercent(score: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.round((score / total) * 100);
}

function getAxisPosition(scores: number[]) {
  const total = scores.reduce((sum, score) => sum + score, 0);

  if (total <= 0) {
    return 50;
  }

  if (scores.length === 2) {
    return (scores[1] / total) * 100;
  }

  return ((scores[1] * 50) + (scores[2] * 100)) / total;
}

function AxisLine({
  title,
  winner,
  labels,
  scores,
}: {
  title: string;
  winner: string;
  labels: string[];
  scores: number[];
}) {
  const markerPosition = getAxisPosition(scores);
  const total = scores.reduce((sum, score) => sum + score, 0);

  return (
    <div className="py-3">
      <div className="flex items-center justify-between gap-4">
        <p className="font-[family-name:var(--font-preview-display)] text-[9px] uppercase tracking-[0.14em] text-[#d60404] sm:text-[12px] sm:tracking-[0.16em]">
          {title}
        </p>
        <p className="text-[10px] font-black text-[#f0d4bf] sm:text-[12px]">
          {winner}
        </p>
      </div>

      <div className="mt-4">
        <div className="relative h-8">
          <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-[#6b2d23]/70" />
          <div
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#d60404] shadow-[0_0_18px_rgba(214,4,4,0.88)]"
            style={{ left: `${markerPosition}%` }}
          />
          {labels.map((label, index) => {
            const left =
              labels.length === 1 ? 50 : (index / (labels.length - 1)) * 100;
            const percent = getPercent(scores[index] ?? 0, total);
            const isWinner = label === winner;

            return (
              <div
                key={label}
                className="absolute top-7 -translate-x-1/2 text-center"
                style={{ left: `${left}%` }}
              >
                <p
                  className={`whitespace-nowrap text-[9px] font-black tracking-normal sm:text-[12px] ${
                    isWinner ? "text-[#fff1df]" : "text-[#a97864]"
                  }`}
                >
                  {label}
                </p>
                <p
                  className={`mt-1 text-[9px] font-black sm:text-[11px] ${
                    isWinner ? "text-[#d60404]" : "text-[#6f493c]"
                  }`}
                >
                  {percent}%
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ResultAxisGraph({ result }: { result: Result }) {
  const groupWinner = groupLabels[result.group];

  return (
    <div className="grid gap-10 pb-4">
      <AxisLine
        title="survival tendency"
        winner={groupWinner}
        labels={["공존형", "통제형", "경계형"]}
        scores={[
          result.scoreBreakdown.group.A그룹,
          result.scoreBreakdown.group.B그룹,
          result.scoreBreakdown.group.C그룹,
        ]}
      />
      <AxisLine
        title="role position"
        winner={result.position}
        labels={["주도형", "지원형"]}
        scores={[
          result.scoreBreakdown.position.주도형,
          result.scoreBreakdown.position.지원형,
        ]}
      />
      <AxisLine
        title="judgment mode"
        winner={result.judgment}
        labels={["본능형", "전략형"]}
        scores={[
          result.scoreBreakdown.judgment.본능형,
          result.scoreBreakdown.judgment.전략형,
        ]}
      />
    </div>
  );
}

function loadCanvasImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function drawCoverImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const targetRatio = width / height;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;
  let sourceX = 0;
  let sourceY = 0;

  if (imageRatio > targetRatio) {
    sourceWidth = image.naturalHeight * targetRatio;
    sourceX = (image.naturalWidth - sourceWidth) / 2;
  } else {
    sourceHeight = image.naturalWidth / targetRatio;
    sourceY = (image.naturalHeight - sourceHeight) / 2;
  }

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  );
}

function drawContainedImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const targetWidth = image.naturalWidth * scale;
  const targetHeight = image.naturalHeight * scale;
  context.drawImage(
    image,
    x + (width - targetWidth) / 2,
    y + (height - targetHeight) / 2,
    targetWidth,
    targetHeight,
  );
}

function fillRoundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
  context.fill();
}

function drawShareAxis({
  context,
  title,
  winner,
  labels,
  scores,
  y,
}: {
  context: CanvasRenderingContext2D;
  title: string;
  winner: string;
  labels: string[];
  scores: number[];
  y: number;
}) {
  const x = 108;
  const width = 864;
  const markerPosition = getAxisPosition(scores);
  const total = scores.reduce((sum, score) => sum + score, 0);

  context.textAlign = "left";
  context.fillStyle = "#d60404";
  context.font = "900 26px MaruBuri, serif";
  context.fillText(title.toUpperCase(), x, y);

  context.textAlign = "right";
  context.fillStyle = "#fff1df";
  context.font = "900 30px MaruBuri, serif";
  context.fillText(winner, x + width, y);

  const lineY = y + 58;
  context.strokeStyle = "rgba(214, 4, 4, 0.42)";
  context.lineWidth = 5;
  context.beginPath();
  context.moveTo(x, lineY);
  context.lineTo(x + width, lineY);
  context.stroke();

  const markerX = x + (width * markerPosition) / 100;
  context.save();
  context.translate(markerX, lineY);
  context.rotate(Math.PI / 4);
  context.fillStyle = "#d60404";
  context.shadowColor = "rgba(214, 4, 4, 0.88)";
  context.shadowBlur = 18;
  context.fillRect(-13, -13, 26, 26);
  context.restore();

  labels.forEach((label, index) => {
    const left =
      labels.length === 1 ? 50 : (index / (labels.length - 1)) * 100;
    const labelX = x + (width * left) / 100;
    const percent = getPercent(scores[index] ?? 0, total);
    const isWinner = label === winner;

    context.textAlign = "center";
    context.fillStyle = isWinner ? "#fff1df" : "#a97864";
    context.font = "900 28px MaruBuri, serif";
    context.fillText(label, labelX, lineY + 58);
    context.fillStyle = isWinner ? "#d60404" : "#6f493c";
    context.font = "900 24px MaruBuri, serif";
    context.fillText(`${percent}%`, labelX, lineY + 92);
  });
}

function wrapCanvasText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const tokens = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  tokens.forEach((token) => {
    const testLine = currentLine ? `${currentLine} ${token}` : token;

    if (context.measureText(testLine).width <= maxWidth) {
      currentLine = testLine;
      return;
    }

    if (currentLine) {
      lines.push(currentLine);
    }
    currentLine = token;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to create image"));
      }
    }, "image/png");
  });
}

async function createResultShareImage({
  result,
  resultCopy,
  resultImageSrc,
}: {
  result: Result;
  resultCopy: ResultCopy | null;
  resultImageSrc: string | null;
}) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not available");
  }

  await document.fonts.ready;

  const [background, character] = await Promise.all([
    loadCanvasImage("/images/prototype-background.png"),
    resultImageSrc ? loadCanvasImage(resultImageSrc) : Promise.resolve(null),
  ]);

  drawCoverImage(context, background, 0, 0, canvas.width, canvas.height);

  const overlay = context.createLinearGradient(0, 0, 0, canvas.height);
  overlay.addColorStop(0, "rgba(0, 0, 0, 0.56)");
  overlay.addColorStop(0.42, "rgba(0, 0, 0, 0.18)");
  overlay.addColorStop(0.72, "rgba(0, 0, 0, 0.48)");
  overlay.addColorStop(1, "rgba(0, 0, 0, 0.92)");
  context.fillStyle = overlay;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const sideVignette = context.createRadialGradient(
    canvas.width / 2,
    canvas.height * 0.34,
    180,
    canvas.width / 2,
    canvas.height * 0.34,
    980,
  );
  sideVignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  sideVignette.addColorStop(1, "rgba(0, 0, 0, 0.78)");
  context.fillStyle = sideVignette;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const tagItems = [
    groupLabels[result.group],
    result.position,
    result.judgment,
  ];
  let tagX = 78;
  context.font = "900 30px MaruBuri, serif";
  tagItems.forEach((tag) => {
    const tagWidth = Math.ceil(context.measureText(tag).width) + 44;
    context.fillStyle = "rgba(0, 0, 0, 0.44)";
    fillRoundRect(context, tagX, 96, tagWidth, 58, 4);
    context.strokeStyle = "rgba(214, 4, 4, 0.78)";
    context.lineWidth = 2;
    context.strokeRect(tagX, 96, tagWidth, 58);
    context.fillStyle = "#fff1df";
    context.fillText(tag, tagX + 22, 134);
    tagX += tagWidth + 14;
  });

  context.fillStyle = "#fff1df";
  context.font = "900 58px MaruBuri, serif";
  context.textAlign = "left";
  const titleLines = wrapCanvasText(
    context,
    resultCopy?.resultTitle ?? result.profile.tagline,
    900,
  ).slice(0, 4);
  titleLines.forEach((line, index) => {
    context.fillText(line, 78, 245 + index * 76);
  });

  if (character) {
    drawContainedImage(context, character, 180, 520, 720, 760);
  }

  drawShareAxis({
    context,
    title: "survival tendency",
    winner: groupLabels[result.group],
    labels: ["공존형", "통제형", "경계형"],
    scores: [
      result.scoreBreakdown.group.A그룹,
      result.scoreBreakdown.group.B그룹,
      result.scoreBreakdown.group.C그룹,
    ],
    y: 1335,
  });
  drawShareAxis({
    context,
    title: "role position",
    winner: result.position,
    labels: ["주도형", "지원형"],
    scores: [
      result.scoreBreakdown.position.주도형,
      result.scoreBreakdown.position.지원형,
    ],
    y: 1540,
  });
  drawShareAxis({
    context,
    title: "judgment mode",
    winner: result.judgment,
    labels: ["본능형", "전략형"],
    scores: [
      result.scoreBreakdown.judgment.본능형,
      result.scoreBreakdown.judgment.전략형,
    ],
    y: 1745,
  });

  return canvasToBlob(canvas);
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function copyShareFallback(blob: Blob, url: string) {
  try {
    if (navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      return true;
    }
  } catch {
    // Try link copy below.
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

export default function PrototypeQuizClient() {
  const [answers, setAnswers] = useState<Answers>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [shareState, setShareState] = useState<
    "idle" | "working" | "done" | "saved" | "failed"
  >("idle");

  const isIntro = stepIndex === 0;
  const isLoadingResult = stepIndex === questions.length + 1;
  const isResult = stepIndex === questions.length + 2;
  const currentQuestion =
    !isIntro && !isLoadingResult && !isResult ? questions[stepIndex - 1] : null;
  const stepInfo = getStepInfo(stepIndex);
  const result = useMemo(() => resolveResult(answers), [answers]);
  const resultImageSrc = result ? characterImages[result.profile.name] : null;
  const resultCopy = result ? resultCopyByProfile[result.profile.name] : null;

  const canProceed = isIntro
    ? true
    : isResult
      ? true
      : isLoadingResult
        ? false
        : Boolean(currentQuestion && answers[currentQuestion.id]);

  function handleSelect(optionId: string) {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  }

  function handleNext() {
    if (!canProceed) return;

    if (isResult) {
      setAnswers({});
      setStepIndex(0);
      setShareState("idle");
      return;
    }

    setStepIndex((prev) => prev + 1);
  }

  function handlePrev() {
    if (stepIndex === 0 || isLoadingResult) return;
    setStepIndex((prev) => prev - 1);
  }

  async function handleSaveAndShare() {
    if (!result) {
      return;
    }

    setShareState("working");

    try {
      const blob = await createResultShareImage({
        result,
        resultCopy,
        resultImageSrc,
      });
      const fileName = `prototype-${result.profile.name}.png`;
      const file = new File([blob], fileName, { type: "image/png" });
      const shareTitle = "PROTO TYPE 생존 성향 테스트";
      const shareText =
        resultCopy?.resultTitle ?? `${result.profile.name} 결과가 나왔습니다.`;
      let shareSucceeded = false;

      try {
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: shareTitle,
            text: shareText,
            url: window.location.href,
          });
          shareSucceeded = true;
        } else if (navigator.share) {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: window.location.href,
          });
          shareSucceeded = true;
        } else if (await copyShareFallback(blob, window.location.href)) {
          shareSucceeded = true;
        }
      } catch {
        if (await copyShareFallback(blob, window.location.href)) {
          shareSucceeded = true;
        }
      }

      downloadBlob(blob, fileName);
      setShareState(shareSucceeded ? "done" : "saved");
      window.setTimeout(() => setShareState("idle"), 2200);
    } catch {
      setShareState("failed");
      window.setTimeout(() => setShareState("idle"), 2200);
    }
  }

  useEffect(() => {
    document.body.classList.add("survival-test-page");

    return () => {
      document.body.classList.remove("survival-test-page");
    };
  }, []);

  useEffect(() => {
    if (!isLoadingResult) {
      return;
    }

    const revealTimer = window.setTimeout(() => {
      setStepIndex(questions.length + 2);
    }, 2000);

    return () => window.clearTimeout(revealTimer);
  }, [isLoadingResult]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [stepIndex]);

  return (
    <main className="prototype-grit relative flex min-h-screen w-full flex-col overflow-x-hidden text-[#f3e6d7]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.38),rgba(0,0,0,0.03)_48%,rgba(0,0,0,0.38))]" />
        <div className="absolute inset-x-0 bottom-0 h-[48%] bg-[linear-gradient(180deg,rgba(3,3,3,0)_0%,rgba(3,3,3,0.44)_58%,rgba(3,3,3,0.78)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[30%] bg-[linear-gradient(180deg,rgba(3,3,3,0.28)_0%,rgba(3,3,3,0)_100%)]" />
      </div>

      <div className="relative z-10 h-[6px] w-full overflow-hidden bg-black/60">
        <div className="flex h-full w-full">
          {questions.map((question, index) => {
            const isComplete = Boolean(answers[question.id]);
            const isCurrent =
              !isIntro && !isResult && currentQuestion?.id === index + 1;

            return (
              <div
                key={question.id}
                className="h-full flex-1"
                style={{
                  backgroundColor:
                    isComplete || isCurrent ? ACCENT : "rgba(244, 225, 200, 0.18)",
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        <div
          className={`mx-auto flex w-full max-w-[680px] flex-1 flex-col px-7 pt-7 lg:px-0 lg:pt-10 ${
            isResult ? "pb-[330px]" : "pb-[156px]"
          }`}
        >
          <div className="relative flex min-h-[104px] items-start justify-center">
            <div className="w-[238px] sm:w-[310px]">
              <Image
                src="/images/prototype-logo-transparent.png"
                alt="PROTO TYPE"
                width={900}
                height={300}
                priority
                unoptimized
                className="prototype-logo h-auto w-full"
              />
            </div>
            <div className="absolute right-0 top-0 text-[10px] font-black uppercase tracking-[0.12em] text-[#f0d4bf] drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] sm:text-[13px] sm:tracking-[0.16em]">
              {stepInfo.countLabel}
            </div>
          </div>

          <div className={isIntro ? "mt-4 lg:mt-8" : "mt-10 lg:mt-9"}>
            {isIntro ? (
              <section className="max-w-[620px]">
                <p className="font-[family-name:var(--font-preview-display)] text-[10px] uppercase tracking-[0.2em] text-[#d60404] drop-shadow-[2px_2px_0_rgba(0,0,0,0.78)] sm:text-[13px]">
                  incoming survivor record
                </p>
                <h1 className="prototype-title mt-4 text-[30px] font-black leading-[1.08] tracking-normal text-[#fff1df] sm:text-[44px]">
                  {stepInfo.title}
                </h1>
                <div className="mt-7 grid gap-5 text-[14px] font-semibold leading-[1.8] text-[#f3e6d7] drop-shadow-[2px_2px_0_rgba(0,0,0,0.72)] sm:text-[18px] sm:leading-8">
                  <p>{stepInfo.description}</p>
                  <p>
                    긴 도망 끝에 당신은 생존자들이 모인 캠프의 문 앞에
                    섰습니다. 안에서는 식량을 지키는 사람, 경계를 서는 사람,
                    다친 이들을 돌보는 사람이 각자의 방식으로 버티고 있습니다.
                  </p>
                  <p>
                    이곳에서 선택은 성격이 아니라 생존 방식입니다. 당신은 어떤
                    사람으로 기억될까요?
                  </p>
                </div>
                <p className="mt-8 font-[family-name:var(--font-preview-display)] text-[13px] uppercase tracking-[0.18em] text-[#d60404] sm:text-[16px]">
                  find your survival type
                </p>
              </section>
            ) : !isResult ? (
              <div className="max-w-[620px]">
                <p className="mb-3 inline-block text-[9px] font-black uppercase tracking-[0.16em] text-[#d60404] drop-shadow-[2px_2px_0_rgba(0,0,0,0.78)] sm:text-[12px] sm:tracking-[0.22em]">
                  restricted survival report
                </p>
                <h1 className="text-[17px] font-bold leading-[1.75] tracking-normal text-[#fff1df] drop-shadow-[2px_2px_0_rgba(0,0,0,0.72)] sm:text-[22px] sm:leading-[1.65] lg:text-[21px]">
                  {stepInfo.title}
                </h1>
                <p className="mt-4 max-w-[560px] text-[15px] font-bold leading-[1.75] tracking-normal text-[#e9d5be] drop-shadow-[2px_2px_0_rgba(0,0,0,0.72)] sm:mt-5 sm:text-[19px] sm:leading-[1.65] lg:text-[18px]">
                  {stepInfo.description}
                </p>
              </div>
            ) : null}

            {currentQuestion && (
              <div className="mt-9 grid gap-3 lg:mt-8">
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id] === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelect(option.id)}
                      className={`w-full px-0 py-4 text-left transition lg:py-3 ${
                        isSelected
                          ? "bg-[radial-gradient(ellipse_at_left,rgba(214,4,4,0.22),rgba(105,0,0,0.1)_46%,transparent_78%)]"
                          : "bg-transparent hover:bg-[radial-gradient(ellipse_at_left,rgba(214,4,4,0.12),transparent_72%)]"
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center text-[12px] font-black sm:h-7 sm:w-7 sm:text-[14px] ${
                            isSelected
                              ? "bg-[#d60404] text-black"
                              : "border border-[#f3e6d7]/60 bg-[#f3e6d7]/12 text-transparent shadow-[0_0_0_1px_rgba(0,0,0,0.74),0_0_12px_rgba(243,230,215,0.16)]"
                          }`}
                        >
                          ✓
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-bold leading-[1.65] tracking-normal text-[#fff1df] sm:text-[18px] sm:leading-7 lg:text-[16px] lg:leading-6">
                            {option.text}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {isLoadingResult && (
              <div className="mt-10 grid gap-5 lg:mt-8">
                <div className="py-6">
                  <div className="flex items-center justify-between gap-4 font-[family-name:var(--font-preview-display)] text-[10px] uppercase tracking-[0.14em] text-[#d60404] sm:text-[13px] sm:tracking-[0.2em]">
                    <span>profile scan</span>
                    <span>02 sec</span>
                  </div>
                  <div className="mt-5 h-4 overflow-hidden bg-black/62">
                    <div className="prototype-loading-bar h-full w-full bg-[#d60404] shadow-[0_0_18px_rgba(214,4,4,0.9)]" />
                  </div>
                  <div className="mt-5 grid gap-2 text-[12px] font-semibold leading-5 text-[#d7bda1] sm:text-[15px] sm:leading-6">
                    <p>응답 패턴 대조 중...</p>
                    <p>생존 성향 코드 추출 중...</p>
                    <p>최종 캐릭터 매칭 대기...</p>
                  </div>
                </div>
              </div>
            )}

            {isResult && result && (
              <div className="mt-10 grid gap-4 lg:mt-8">
                <div>
                  <div className="mb-7">
                    <div className="flex items-start justify-between gap-4">
                      <p className="font-[family-name:var(--font-preview-display)] text-[10px] uppercase tracking-[0.16em] text-[#d60404] sm:text-[13px] sm:tracking-[0.22em]">
                        result
                      </p>
                      <div className="flex max-w-[58%] flex-wrap justify-end gap-1.5 sm:gap-2">
                        {[
                          groupLabels[result.group],
                          result.position,
                          result.judgment,
                        ].map((label) => (
                          <span
                            key={label}
                            className="border border-[#d60404]/58 bg-black/28 px-2 py-1 text-[10px] font-black leading-none tracking-normal text-[#fff1df] shadow-[2px_2px_0_rgba(0,0,0,0.62)] sm:px-2.5 sm:text-[12px]"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h1 className="prototype-title mt-3 text-[24px] font-black leading-[1.15] tracking-normal text-[#fff1df] sm:text-[36px] sm:leading-[1.08] lg:text-[30px]">
                      {resultCopy?.resultTitle ?? result.profile.name}
                    </h1>
                  </div>
                  {resultImageSrc && (
                    <div className="relative mx-auto mb-5 aspect-[3/4] w-full max-w-[520px]">
                      <Image
                        src={resultImageSrc}
                        alt={result.profile.name}
                        fill
                        sizes="(min-width: 640px) 680px, 100vw"
                        priority
                        className="object-contain object-center"
                      />
                    </div>
                  )}
                  <ResultAxisGraph result={result} />
                  <div className="mt-8">
                    <p className="mt-3 text-[13px] font-bold leading-5 tracking-normal text-[#f3e6d7] sm:text-[17px] sm:leading-7 lg:text-[15px] lg:leading-6">
                      프로토타입 캐릭터: {result.profile.name}
                    </p>
                    <div className="mt-5 grid gap-4 text-[13px] leading-[1.65] tracking-normal text-[#d7bda1] sm:text-[16px] sm:leading-7 lg:text-[15px] lg:leading-6">
                      {(resultCopy?.behaviorSummary ?? [result.profile.summary]).map(
                        (paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ),
                      )}
                    </div>
                    <p className="mt-5 text-[13px] font-bold leading-[1.65] tracking-normal text-[#f3e6d7] sm:text-[16px] sm:leading-7 lg:text-[15px] lg:leading-6">
                      {resultCopy?.prototypeMatch ?? result.profile.tagline}
                    </p>
                    {resultCopy && (
                      <div className="mt-7 grid gap-5">
                        <div className="border border-white/10 bg-white/5 p-4 shadow-[5px_5px_0_rgba(0,0,0,0.62)] backdrop-blur-sm sm:p-5">
                          <p className="font-[family-name:var(--font-preview-display)] text-[9px] uppercase tracking-[0.16em] text-[#d60404] sm:text-[12px] sm:tracking-[0.2em]">
                            best match
                          </p>
                          <div className="mt-4 flex items-start gap-4 sm:gap-5">
                            <MatchCharacterImage
                              name={resultCopy.bestMatchName}
                              className="h-[92px] w-[68px] sm:h-[118px] sm:w-[88px]"
                            />
                            <div className="min-w-0 flex-1">
                              <h3 className="text-[16px] font-black tracking-normal text-[#fff1df] sm:text-[22px]">
                                {resultCopy.bestMatchName}
                              </h3>
                              <p className="mt-2 text-[12px] leading-[1.65] tracking-normal text-[#e5d1bb] sm:text-[15px] sm:leading-7">
                                {resultCopy.bestMatchReason}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="border border-white/10 bg-white/5 p-4 shadow-[5px_5px_0_rgba(0,0,0,0.62)] backdrop-blur-sm sm:p-5">
                          <p className="font-[family-name:var(--font-preview-display)] text-[9px] uppercase tracking-[0.16em] text-[#d60404] sm:text-[12px] sm:tracking-[0.2em]">
                            watch out
                          </p>
                          <div className="mt-4 flex items-start gap-4 sm:gap-5">
                            <MatchCharacterImage
                              name={resultCopy.rivalName}
                              className="h-[92px] w-[68px] sm:h-[118px] sm:w-[88px]"
                            />
                            <div className="min-w-0 flex-1">
                              <h3 className="text-[16px] font-black tracking-normal text-[#fff1df] sm:text-[22px]">
                                {resultCopy.rivalName}
                              </h3>
                              <p className="mt-2 text-[12px] leading-[1.65] tracking-normal text-[#e5d1bb] sm:text-[15px] sm:leading-7">
                                {resultCopy.rivalReason}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 bg-[linear-gradient(180deg,rgba(3,3,3,0)_0%,rgba(3,3,3,0.72)_26%,#030303_68%,#030303_100%)] px-5 pb-6 pt-11 lg:px-0">
          <div className="mx-auto w-full max-w-[680px]">
            {isLoadingResult ? (
              <div className="py-4 text-center font-[family-name:var(--font-preview-display)] text-[11px] uppercase tracking-[0.14em] text-[#b9856f] sm:text-[14px] sm:tracking-[0.18em]">
                result loading
              </div>
            ) : isResult ? (
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleSaveAndShare}
                  disabled={shareState === "working"}
                  className="w-full bg-[#d60404] px-4 py-4 text-[13px] font-black tracking-normal text-black transition shadow-[5px_5px_0_rgba(0,0,0,0.75)] hover:bg-[#ff1d1d] disabled:bg-[#6f1c18] disabled:text-[#8d7266] sm:px-6 sm:text-[17px]"
                >
                  {shareState === "working" && "이미지 생성 중"}
                  {shareState === "done" && "이미지 저장/공유 완료"}
                  {shareState === "saved" && "이미지 저장 완료"}
                  {shareState === "failed" && "저장/공유 재시도"}
                  {shareState === "idle" && "결과 저장하고 공유하기"}
                </button>
                <a
                  href="/survival-test/characters"
                  className="w-full border border-[#d60404]/55 bg-black/28 px-4 py-4 text-center text-[13px] font-black tracking-normal text-[#fff1df] transition hover:bg-[#d60404]/18 sm:px-6 sm:text-[17px]"
                >
                  모든 캐릭터 보러가기
                </a>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-black/42 px-4 py-4 text-[13px] font-black tracking-normal text-[#f3e6d7] transition hover:bg-black/64 sm:px-6 sm:text-[17px]"
                >
                  다시하기
                </button>
              </div>
            ) : isIntro ? (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-[#d60404] px-5 py-4 text-center text-[13px] font-black tracking-normal text-black transition shadow-[5px_5px_0_rgba(0,0,0,0.75)] hover:bg-[#ff1d1d] sm:text-[17px]"
                >
                  {stepInfo.actionLabel}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={stepIndex === 0}
                  className={`flex h-14 w-14 items-center justify-center text-[28px] font-black transition ${
                    stepIndex === 0
                      ? "bg-black/18 text-[#7d5b4e]/50"
                      : "bg-black/34 text-[#f3e6d7]"
                  }`}
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed}
                  className={`flex-1 px-4 py-4 text-[13px] font-black tracking-normal transition sm:px-6 sm:text-[17px] ${
                    canProceed
                      ? "bg-[#d60404] text-black shadow-[5px_5px_0_rgba(0,0,0,0.75)] hover:bg-[#ff1d1d]"
                      : "bg-[#3a302c] text-[#8d7266]"
                  }`}
                >
                  {stepInfo.actionLabel}
                </button>
              </div>
            )}
            <p className="mt-4 text-center font-[family-name:var(--font-preview-display)] text-[12px] font-black uppercase tracking-[0.18em] text-[#8e2b22]">
              made by ssobig preview
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
