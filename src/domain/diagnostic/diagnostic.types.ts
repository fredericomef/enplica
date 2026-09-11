export type AreaId = "E" | "N" | "P" | "L" | "I" | "C" | "A";

export type AnswerValue = 0 | 1 | 2 | 3;

export type AreaStatus = "TRATAR" | "ATENCAO" | "SAUDAVEL";

export interface DiagnosticAnswers {
  E: AnswerValue[];
  N: AnswerValue[];
  P: AnswerValue[];
  L: AnswerValue[];
  I: AnswerValue[];
  C: AnswerValue[];
  A: AnswerValue[];
}

export interface AreaResult {
  areaId: AreaId;
  score: number;
  maxScore: number;
  status: AreaStatus;
  zeroAnswers: number;
}

export interface DiagnosticResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  areas: AreaResult[];
  priorities: AreaResult[];
}