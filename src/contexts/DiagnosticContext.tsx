"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { ENPLICA_AREAS } from "@/domain/diagnostic/enplica.config";

import {
  calculateDiagnostic,
  validateDiagnosticAnswers,
} from "@/domain/diagnostic/diagnostic.engine";

import type {
  AnswerValue,
  AreaId,
  DiagnosticAnswers,
  DiagnosticResult,
} from "@/domain/diagnostic/diagnostic.types";

interface DiagnosticContextValue {
  currentAreaIndex: number;
  answers: DiagnosticAnswers;

  setAnswer: (
    areaId: AreaId,
    questionIndex: number,
    value: AnswerValue,
  ) => void;

  nextArea: () => void;
  previousArea: () => void;

  canGoNext: boolean;
  canGoPrevious: boolean;

  progress: number;

  isCompleted: boolean;

  result: DiagnosticResult | null;

  finishDiagnostic: () => DiagnosticResult;

  resetDiagnostic: () => void;
}

const DiagnosticContext =
  createContext<DiagnosticContextValue | null>(null);

function createInitialAnswers(): DiagnosticAnswers {
  return {
    E: [],
    N: [],
    P: [],
    L: [],
    I: [],
    C: [],
    A: [],
  };
}

export function DiagnosticProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);

  const [answers, setAnswers] =
    useState<DiagnosticAnswers>(createInitialAnswers);

  const [result, setResult] =
    useState<DiagnosticResult | null>(null);

  const setAnswer = useCallback(
    (
      areaId: AreaId,
      questionIndex: number,
      value: AnswerValue,
    ) => {
      setAnswers((currentAnswers) => {
        const areaAnswers = [...currentAnswers[areaId]];

        areaAnswers[questionIndex] = value;

        return {
          ...currentAnswers,
          [areaId]: areaAnswers,
        };
      });
    },
    [],
  );

  const currentArea = ENPLICA_AREAS[currentAreaIndex];

  const currentAreaAnswers =
    answers[currentArea.id];

  const isCurrentAreaComplete =
    currentAreaAnswers.length ===
    currentArea.questions.length;

  const canGoNext =
    isCurrentAreaComplete &&
    currentAreaIndex < ENPLICA_AREAS.length - 1;

  const canGoPrevious = currentAreaIndex > 0;

  const progress = Math.round(
    ((currentAreaIndex + 1) /
      ENPLICA_AREAS.length) *
      100,
  );

  const isCompleted = useMemo(() => {
    return ENPLICA_AREAS.every(
      (area) =>
        answers[area.id].length ===
        area.questions.length,
    );
  }, [answers]);

  const nextArea = useCallback(() => {
    setCurrentAreaIndex((currentIndex) => {
      if (
        currentIndex >=
        ENPLICA_AREAS.length - 1
      ) {
        return currentIndex;
      }

      const area =
        ENPLICA_AREAS[currentIndex];

      const areaAnswers =
        answers[area.id];

      if (
        areaAnswers.length !==
        area.questions.length
      ) {
        return currentIndex;
      }

      return currentIndex + 1;
    });
  }, [answers]);

  const previousArea = useCallback(() => {
    setCurrentAreaIndex((currentIndex) => {
      if (currentIndex <= 0) {
        return 0;
      }

      return currentIndex - 1;
    });
  }, []);

  const finishDiagnostic = useCallback(() => {
    validateDiagnosticAnswers(answers);

    const diagnosticResult =
      calculateDiagnostic(answers);

    setResult(diagnosticResult);

    return diagnosticResult;
  }, [answers]);

  const resetDiagnostic = useCallback(() => {
    setCurrentAreaIndex(0);
    setAnswers(createInitialAnswers());
    setResult(null);
  }, []);

  const value = useMemo<DiagnosticContextValue>(
    () => ({
      currentAreaIndex,
      answers,

      setAnswer,

      nextArea,
      previousArea,

      canGoNext,
      canGoPrevious,

      progress,

      isCompleted,

      result,

      finishDiagnostic,

      resetDiagnostic,
    }),
    [
      currentAreaIndex,
      answers,
      setAnswer,
      nextArea,
      previousArea,
      canGoNext,
      canGoPrevious,
      progress,
      isCompleted,
      result,
      finishDiagnostic,
      resetDiagnostic,
    ],
  );

  return (
    <DiagnosticContext.Provider value={value}>
      {children}
    </DiagnosticContext.Provider>
  );
}

export function useDiagnostic() {
  const context = useContext(DiagnosticContext);

  if (!context) {
    throw new Error(
      "useDiagnostic deve ser usado dentro de DiagnosticProvider.",
    );
  }

  return context;
}