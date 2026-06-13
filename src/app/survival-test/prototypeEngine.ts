import {
  profiles,
  questions,
  type CharacterProfile,
  type GroupType,
  type JudgmentType,
  type PositionType,
} from "./prototypeData";

export type Answers = Record<number, string>;

export type Result = {
  profile: CharacterProfile;
  group: GroupType;
  position: PositionType;
  judgment: JudgmentType;
  scoreBreakdown: {
    group: Record<GroupType, number>;
    position: Record<PositionType, number>;
    judgment: Record<JudgmentType, number>;
  };
};

const groupOrder: GroupType[] = ["A그룹", "B그룹", "C그룹"];
const positionOrder: PositionType[] = ["주도형", "지원형"];
const judgmentOrder: JudgmentType[] = ["본능형", "전략형"];

function pickAxisWinner<T extends string>(
  labels: T[],
  scores: Record<T, number>,
  lastUpdatedQuestionIds: Record<T, number>,
) {
  const maxScore = Math.max(...labels.map((label) => scores[label]));
  const topLabels = labels.filter((label) => scores[label] === maxScore);

  if (topLabels.length === 1) {
    return topLabels[0];
  }

  const latestQuestionId = Math.max(
    ...topLabels.map((label) => lastUpdatedQuestionIds[label]),
  );
  const tieWinners = topLabels.filter(
    (label) => lastUpdatedQuestionIds[label] === latestQuestionId,
  );

  return tieWinners[0];
}

export function isCompleteAnswers(answers: Answers) {
  return Object.keys(answers).length === questions.length;
}

export function isValidAnswersPayload(value: unknown): value is Answers {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return questions.every((question) => {
    const rawAnswer = candidate[String(question.id)];
    if (typeof rawAnswer !== "string") {
      return false;
    }

    return question.options.some((option) => option.id === rawAnswer);
  });
}

export function resolveResult(answers: Answers): Result | null {
  if (!isCompleteAnswers(answers)) {
    return null;
  }

  const groupScores: Record<GroupType, number> = {
    A그룹: 0,
    B그룹: 0,
    C그룹: 0,
  };
  const positionScores: Record<PositionType, number> = {
    주도형: 0,
    지원형: 0,
  };
  const judgmentScores: Record<JudgmentType, number> = {
    본능형: 0,
    전략형: 0,
  };
  const groupLastUpdatedQuestionIds: Record<GroupType, number> = {
    A그룹: 0,
    B그룹: 0,
    C그룹: 0,
  };
  const positionLastUpdatedQuestionIds: Record<PositionType, number> = {
    주도형: 0,
    지원형: 0,
  };
  const judgmentLastUpdatedQuestionIds: Record<JudgmentType, number> = {
    본능형: 0,
    전략형: 0,
  };

  for (const question of questions) {
    const selectedOptionId = answers[question.id];
    const selectedOption = question.options.find(
      (option) => option.id === selectedOptionId,
    );

    if (!selectedOption) {
      continue;
    }

    for (const [key, value] of Object.entries(selectedOption.scores)) {
      if (!value) {
        continue;
      }

      if (key in groupScores) {
        const groupKey = key as GroupType;
        groupScores[groupKey] += value;
        groupLastUpdatedQuestionIds[groupKey] = question.id;
      }

      if (key in positionScores) {
        const positionKey = key as PositionType;
        positionScores[positionKey] += value;
        positionLastUpdatedQuestionIds[positionKey] = question.id;
      }

      if (key in judgmentScores) {
        const judgmentKey = key as JudgmentType;
        judgmentScores[judgmentKey] += value;
        judgmentLastUpdatedQuestionIds[judgmentKey] = question.id;
      }
    }
  }

  const group = pickAxisWinner(
    groupOrder,
    groupScores,
    groupLastUpdatedQuestionIds,
  );
  const position = pickAxisWinner(
    positionOrder,
    positionScores,
    positionLastUpdatedQuestionIds,
  );
  const judgment = pickAxisWinner(
    judgmentOrder,
    judgmentScores,
    judgmentLastUpdatedQuestionIds,
  );

  const profile = profiles.find(
    (item) =>
      item.group === group &&
      item.position === position &&
      item.judgment === judgment,
  );

  if (!profile) {
    return null;
  }

  return {
    profile,
    group,
    position,
    judgment,
    scoreBreakdown: {
      group: groupScores,
      position: positionScores,
      judgment: judgmentScores,
    },
  };
}
