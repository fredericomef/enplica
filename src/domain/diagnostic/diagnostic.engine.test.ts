import { describe, expect, it } from "vitest";

import {
  calculateDiagnostic,
  getAreaStatus,
  validateDiagnosticAnswers,
} from "./diagnostic.engine";

import type { DiagnosticAnswers } from "./diagnostic.types";

const createAnswers = (
  value: 0 | 1 | 2 | 3,
): DiagnosticAnswers => ({
  E: [value, value, value],
  N: [value, value, value],
  P: [value, value, value],
  L: [value, value, value],
  I: [value, value, value],
  C: [value, value, value],
  A: [value, value, value],
});

describe("ENPLICA Diagnostic Engine", () => {
  describe("getAreaStatus", () => {
    it("classifica 0 a 3 como TRATAR", () => {
      expect(getAreaStatus(0)).toBe("TRATAR");
      expect(getAreaStatus(3)).toBe("TRATAR");
    });

    it("classifica 4 a 6 como ATENCAO", () => {
      expect(getAreaStatus(4)).toBe("ATENCAO");
      expect(getAreaStatus(6)).toBe("ATENCAO");
    });

    it("classifica 7 a 9 como SAUDAVEL", () => {
      expect(getAreaStatus(7)).toBe("SAUDAVEL");
      expect(getAreaStatus(9)).toBe("SAUDAVEL");
    });

    it("rejeita pontuações fora da escala", () => {
      expect(() => getAreaStatus(-1)).toThrow();
      expect(() => getAreaStatus(10)).toThrow();
    });
  });

  describe("calculateDiagnostic", () => {
    it("calcula corretamente o cenário mínimo: 0/63", () => {
      const result = calculateDiagnostic(createAnswers(0));

      expect(result.totalScore).toBe(0);
      expect(result.maxScore).toBe(63);
      expect(result.percentage).toBe(0);
      expect(result.areas).toHaveLength(7);

      for (const area of result.areas) {
        expect(area.score).toBe(0);
        expect(area.status).toBe("TRATAR");
      }
    });

    it("calcula corretamente o cenário máximo: 63/63", () => {
      const result = calculateDiagnostic(createAnswers(3));

      expect(result.totalScore).toBe(63);
      expect(result.maxScore).toBe(63);
      expect(result.percentage).toBe(100);
      expect(result.priorities).toHaveLength(0);

      for (const area of result.areas) {
        expect(area.score).toBe(9);
        expect(area.status).toBe("SAUDAVEL");
      }
    });

    it("calcula corretamente o exemplo oficial de 49/63", () => {
      const answers: DiagnosticAnswers = {
        E: [3, 3, 2],
        N: [2, 2, 2],
        P: [2, 2, 2],
        L: [3, 2, 2],
        I: [3, 2, 2],
        C: [3, 2, 2],
        A: [3, 3, 2],
      };

      const result = calculateDiagnostic(answers);

      expect(result.totalScore).toBe(49);
      expect(result.maxScore).toBe(63);
      expect(result.priorities).toHaveLength(2);

      expect(result.priorities[0].areaId).toBe("N");
      expect(result.priorities[1].areaId).toBe("P");
    });

    it("prioriza a área com menor pontuação", () => {
      const answers: DiagnosticAnswers = {
        E: [3, 3, 3],
        N: [1, 1, 1],
        P: [2, 2, 1],
        L: [3, 3, 3],
        I: [3, 3, 3],
        C: [3, 3, 3],
        A: [3, 3, 3],
      };

      const result = calculateDiagnostic(answers);

      expect(result.priorities[0].areaId).toBe("N");
      expect(result.priorities[1].areaId).toBe("P");
    });

    it("desempata usando a quantidade de respostas zero", () => {
      const answers: DiagnosticAnswers = {
        E: [3, 3, 3],
        N: [3, 3, 0],
        P: [2, 2, 2],
        L: [3, 3, 3],
        I: [3, 3, 3],
        C: [3, 3, 3],
        A: [3, 3, 3],
      };

      const result = calculateDiagnostic(answers);

      expect(result.priorities[0].areaId).toBe("N");
      expect(result.priorities[1].areaId).toBe("P");
    });
  });

  describe("validateDiagnosticAnswers", () => {
    it("rejeita uma área com quantidade incorreta de respostas", () => {
      const answers = createAnswers(3);

      answers.E = [3, 3];

      expect(() => validateDiagnosticAnswers(answers)).toThrow(
        "A área E deve possuir exatamente 3 respostas.",
      );
    });

    it("rejeita valores fora da escala ENPLICA", () => {
      const invalidAnswers = {
        ...createAnswers(3),
        E: [3, 4, 2],
      } as unknown as DiagnosticAnswers;

      expect(() =>
        validateDiagnosticAnswers(invalidAnswers),
      ).toThrow("Resposta inválida na área E");
    });

    it("rejeita respostas decimais", () => {
      const invalidAnswers = {
        ...createAnswers(3),
        E: [3, 1.5, 2],
      } as unknown as DiagnosticAnswers;

      expect(() =>
        validateDiagnosticAnswers(invalidAnswers),
      ).toThrow("Resposta inválida na área E");
    });
  });
});