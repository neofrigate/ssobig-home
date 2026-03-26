export const DAY_NAMMAE_NOTICE_SECTIONS = [
  {
    title: "승인 기준",
    body: [
      "쏘빅 오프라인 콘텐츠는 작성한 신청서를 보고 결이 맞는 사람들만 모임에 초대드리고 있습니다.",
      "저희 모임에 결이 맞지 않으신 분들께는 죄송하지만 참여가 어렵습니다. 그리고 그럴 경우엔 100% 환불을 진행하니 양해 부탁드립니다.",
    ],
  },
  {
    title: "마케팅 동의",
    body: [
      "저희 모임에선 콘텐츠 촬영을 진행하며 SNS 마케팅에 활용될 수 있으며, 동의해주신 분들만 참여가 가능합니다.",
      "현장 분위기만 보이게 블러 처리되어 사용됩니다.",
    ],
  },
  {
    title: "주의 사항",
    body: [
      "15분 이상 지각하시면 모임 참가가 어렵습니다. 쏘빅은 알찬 콘텐츠를 진행하기 위해 모두가 참석한 뒤 시작합니다.",
      "당일 노쇼나 지각으로 인한 불참의 경우 환불은 불가능합니다.",
      "",
      "현재 2차는 별도로 진행하고 있지 않지만, 모임 후 마음 맞는 분들끼리 자유롭게 이어가셔도 좋아요 :)",
    ],
  },
];

export const DAY_NAMMAE_BIRTH_YEARS = Array.from(
  { length: 16 },
  (_, index) => String(1992 + index)
);

export const DAY_NAMMAE_FALLBACK_SCHEDULE = [
  {
    schedule: "3/13 (금) 19:30 일일남매",
    maxCapacity: 48,
    exposedTotal: 48,
    exposedFemale: 24,
    exposedMale: 24,
    status: "전체마감",
  },
  {
    schedule: "3/14 (토) 15:00 일일남매",
    maxCapacity: 48,
    exposedTotal: 47,
    exposedFemale: 21,
    exposedMale: 26,
    status: "남자마감",
  },
  {
    schedule: "3/14 (토) 19:00 일일남매",
    maxCapacity: 48,
    exposedTotal: 44,
    exposedFemale: 22,
    exposedMale: 22,
    status: "임박",
  },
  {
    schedule: "3/20 (금) 19:30 일일남매",
    maxCapacity: 48,
    exposedTotal: 48,
    exposedFemale: 24,
    exposedMale: 24,
    status: "전체마감",
  },
  {
    schedule: "3/21 (토) 15:00 일일남매",
    maxCapacity: 48,
    exposedTotal: 41,
    exposedFemale: 21,
    exposedMale: 20,
    status: "여자마감",
  },
  {
    schedule: "3/21 (토) 19:00 일일남매",
    maxCapacity: 48,
    exposedTotal: 39,
    exposedFemale: 20,
    exposedMale: 19,
    status: "임박",
  },
  {
    schedule: "3/27 (금) 19:30 일일남매",
    maxCapacity: 48,
    exposedTotal: 32,
    exposedFemale: 20,
    exposedMale: 12,
    status: "임박",
  },
  {
    schedule: "3/28 (토) 15:00 일일남매",
    maxCapacity: 48,
    exposedTotal: 35,
    exposedFemale: 19,
    exposedMale: 16,
    status: "여유",
  },
  {
    schedule: "3/28 (토) 19:00 일일남매",
    maxCapacity: 48,
    exposedTotal: 32,
    exposedFemale: 18,
    exposedMale: 14,
    status: "여유",
  },
];
