import { ENPLICA_AREAS } from "./enplica.config";
import type {
  AnswerValue,
  AreaId,
  AreaResult,
  AreaStatus,
  DiagnosticAnswers,
  DiagnosticResult,
} from "./diagnostic.types";

const MIN_ANSWER_VALUE = 0;
const MAX_ANSWER_VALUE = 3;
const QUESTIONS_PER_AREA = 3;
const MAX_SCORE_PER_AREA = QUESTIONS_PER_AREA * MAX_ANSWER_VALUE;

const AREA_ORDER: AreaId[] = ["E", "N", "P", "L", "I", "C", "A"];

export function getAreaStatus(score: number): AreaStatus {
  if (score >= 0 && score <= 3) {
    return "TRATAR";
  }

  if (score >= 4 && score <= 6) {
    return "ATENCAO";
  }

  if (score >= 7 && score <= 9) {
    return "SAUDAVEL";
  }

  throw new Error(
    `Pontuação inválida para classificação: ${score}. Esperado um valor entre 0 e 9.`,
  );
}

function isValidAnswerValue(value: unknown): value is AnswerValue {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= MIN_ANSWER_VALUE &&
    value <= MAX_ANSWER_VALUE
  );
}

export function validateDiagnosticAnswers(
  answers: DiagnosticAnswers,
): void {
  for (const areaId of AREA_ORDER) {
    const areaAnswers = answers[areaId];

    if (!Array.isArray(areaAnswers)) {
      throw new Error(`Respostas inválidas para a área ${areaId}.`);
    }

    if (areaAnswers.length !== QUESTIONS_PER_AREA) {
      throw new Error(
        `A área ${areaId} deve possuir exatamente ${QUESTIONS_PER_AREA} respostas.`,
      );
    }

    for (const answer of areaAnswers) {
      if (!isValidAnswerValue(answer)) {
        throw new Error(
          `Resposta inválida na área ${areaId}. Use apenas valores entre 0 e 3.`,
        );
      }
    }
  }
}

function calculateAreaResult(
  areaId: AreaId,
  answers: AnswerValue[],
): AreaResult {
 const score = answers.reduce<number>(
  (total, answer) => total + answer,
  0,
);

  const zeroAnswers = answers.filter((answer) => answer === 0).length;

  return {
    areaId,
    score,
    maxScore: MAX_SCORE_PER_AREA,
    status: getAreaStatus(score),
    zeroAnswers,
  };
}

function sortPriorities(areas: AreaResult[]): AreaResult[] {
  return [...areas].sort((a, b) => {
    if (a.score !== b.score) {
      return a.score - b.score;
    }

    if (a.zeroAnswers !== b.zeroAnswers) {
      return b.zeroAnswers - a.zeroAnswers;
    }

    return AREA_ORDER.indexOf(a.areaId) - AREA_ORDER.indexOf(b.areaId);
  });
}

export function calculateDiagnostic(
  answers: DiagnosticAnswers,
): DiagnosticResult {
  validateDiagnosticAnswers(answers);

  const areas = ENPLICA_AREAS.map((area) =>
    calculateAreaResult(area.id, answers[area.id]),
  );

  const totalScore = areas.reduce(
    (total, area) => total + area.score,
    0,
  );

  const maxScore = areas.reduce(
    (total, area) => total + area.maxScore,
    0,
  );

  const percentage = Math.round((totalScore / maxScore) * 100);

  const priorities = sortPriorities(
    areas.filter((area) => area.status !== "SAUDAVEL"),
  );

  return {
    totalScore,
    maxScore,
    percentage,
    areas,
    priorities,
  };
}