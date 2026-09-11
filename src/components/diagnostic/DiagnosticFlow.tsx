"use client";

import { useState } from "react";

import {
  ANSWER_OPTIONS,
  ENPLICA_AREAS,
} from "@/domain/diagnostic/enplica.config";

import type {
  AnswerValue,
  DiagnosticAnswers,
} from "@/domain/diagnostic/diagnostic.types";

const TOTAL_QUESTIONS = 21;

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

export default function DiagnosticFlow() {
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [answers, setAnswers] =
    useState<DiagnosticAnswers>(createInitialAnswers);

  const currentArea = ENPLICA_AREAS[currentAreaIndex];

  const currentQuestion =
    currentArea.questions[currentQuestionIndex];

  const globalQuestionNumber =
    currentAreaIndex * 3 + currentQuestionIndex + 1;

  function handleAnswer(value: AnswerValue) {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,

      [currentArea.id]: [
        ...previousAnswers[currentArea.id],
        value,
      ],
    }));

    const isLastQuestionOfArea =
      currentQuestionIndex ===
      currentArea.questions.length - 1;

    const isLastArea =
      currentAreaIndex === ENPLICA_AREAS.length - 1;

    if (isLastQuestionOfArea && !isLastArea) {
      setCurrentAreaIndex((previous) => previous + 1);
      setCurrentQuestionIndex(0);

      return;
    }

    if (!isLastQuestionOfArea) {
      setCurrentQuestionIndex((previous) => previous + 1);

      return;
    }

    console.log("DIAGNÓSTICO FINALIZADO:", answers);
  }

  const progress =
    ((globalQuestionNumber - 1) / TOTAL_QUESTIONS) * 100;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      {/* Fundo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#00B8FF]/15 blur-[140px]" />

        <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#8A2EFF]/15 blur-[140px]" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-12">

        {/* Cabeçalho */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold tracking-[0.3em] text-[#00B8FF]">
              ENPLICA
            </div>

            <div className="mt-2 text-sm text-white/40">
              Diagnóstico Estratégico Empresarial
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-semibold text-white">
              {globalQuestionNumber} / {TOTAL_QUESTIONS}
            </div>

            <div className="mt-1 text-xs text-white/40">
              perguntas
            </div>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="mb-12 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00B8FF] to-[#8A2EFF] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Área */}
        <div className="mb-8">
          <div className="text-sm font-bold tracking-[0.2em] text-[#8A2EFF]">
            ÁREA {currentArea.id}
          </div>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            {currentArea.name}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/50">
            {currentArea.description}
          </p>
        </div>

        {/* Pergunta */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl sm:p-12">

          <div className="mb-6 text-sm font-medium text-[#00B8FF]">
            Pergunta {currentQuestionIndex + 1} de 3
          </div>

          <h2 className="max-w-3xl text-2xl font-semibold leading-relaxed sm:text-3xl">
            {currentQuestion}
          </h2>

          {/* Respostas */}
          <div className="mt-10 grid gap-4">
            {ANSWER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  handleAnswer(option.value as AnswerValue)
                }
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-left transition-all duration-300 hover:border-[#00B8FF]/60 hover:bg-[#00B8FF]/10"
              >
                <span className="font-medium text-white/80 group-hover:text-white">
                  {option.label}
                </span>

                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-sm text-white/40 transition-all group-hover:border-[#00B8FF] group-hover:text-[#00B8FF]">
                  {option.value}
                </span>
              </button>
            ))}
          </div>

        </div>

        {/* Informação inferior */}
        <p className="mt-8 text-center text-sm text-white/30">
          Responda de acordo com a realidade atual do seu negócio.
        </p>

      </section>
    </main>
  );
}