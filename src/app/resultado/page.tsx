"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ENPLICA_AREAS } from "@/domain/diagnostic/enplica.config";

import type {
  AreaResult,
  DiagnosticResult,
} from "@/domain/diagnostic/diagnostic.types";

export default function ResultadoPage() {
  const router = useRouter();

  const [result, setResult] = useState<DiagnosticResult | null>(null);

  useEffect(() => {
    const storedResult = sessionStorage.getItem(
      "enplica-diagnostic-result",
    );

    if (!storedResult) {
      router.replace("/diagnostico");
      return;
    }

    try {
      const parsedResult = JSON.parse(
        storedResult,
      ) as DiagnosticResult;

      setResult(parsedResult);
    } catch {
      sessionStorage.removeItem("enplica-diagnostic-result");
      router.replace("/diagnostico");
    }
  }, [router]);

  function getArea(areaId: AreaResult["areaId"]) {
    return ENPLICA_AREAS.find((area) => area.id === areaId);
  }

  function getStatusStyle(status: AreaResult["status"]) {
    if (status === "TRATAR") {
      return {
        label: "PRECISA DE ATENÇÃO",
        className:
          "border-red-500/30 bg-red-500/10 text-red-300",
      };
    }

    if (status === "ATENCAO") {
      return {
        label: "ATENÇÃO",
        className:
          "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
      };
    }

    return {
      label: "SAUDÁVEL",
      className:
        "border-[#00B8FF]/30 bg-[#00B8FF]/10 text-[#7DDAFF]",
    };
  }

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050507] text-white">
        <div className="text-center">
          <div className="mx-auto h-3 w-3 animate-pulse rounded-full bg-[#00B8FF] shadow-[0_0_25px_#00B8FF]" />

          <p className="mt-6 text-sm tracking-[0.3em] text-white/50">
            ANALISANDO SEU NEGÓCIO
          </p>
        </div>
      </main>
    );
  }

  const priority = result.priorities[0];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      {/* Fundo tecnológico */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[5%] h-[500px] w-[500px] rounded-full bg-[#00B8FF]/10 blur-[150px]" />

        <div className="absolute bottom-[10%] right-[5%] h-[500px] w-[500px] rounded-full bg-[#8A2EFF]/10 blur-[150px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-10 sm:py-16">
        {/* Marca */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-[#00B8FF] shadow-[0_0_20px_#00B8FF]" />

            <span className="text-sm font-semibold tracking-[0.35em] text-white/60">
              ENPLICA
            </span>
          </div>

          <span className="text-xs tracking-[0.2em] text-white/30">
            RESULTADO DO DIAGNÓSTICO
          </span>
        </header>

        {/* Hero */}
        <div className="mt-20 text-center">
          <div className="inline-flex rounded-full border border-[#00B8FF]/20 bg-[#00B8FF]/5 px-5 py-2 text-sm font-medium text-[#7DDAFF]">
            RAIO-X EMPRESARIAL CONCLUÍDO
          </div>

          <h1 className="mt-8 text-4xl font-bold tracking-[-0.04em] sm:text-6xl">
            Seu negócio está em
            <span className="block bg-gradient-to-r from-[#00B8FF] via-white to-[#8A2EFF] bg-clip-text text-transparent">
              {result.percentage}%
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/50">
            Esta análise mostra onde sua empresa está mais forte e
            onde existem oportunidades reais de evolução.
          </p>
        </div>

        {/* Score principal */}
        <div className="mx-auto mt-14 max-w-3xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl sm:p-12">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            <div>
              <div className="text-sm tracking-[0.2em] text-white/40">
                PONTUAÇÃO GERAL
              </div>

              <div className="mt-3 text-5xl font-bold sm:text-6xl">
                {result.totalScore}
                <span className="text-white/30">
                  /{result.maxScore}
                </span>
              </div>
            </div>

            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-[#00B8FF]/30 bg-[#00B8FF]/5">
              <span className="text-3xl font-bold text-[#7DDAFF]">
                {result.percentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Prioridade */}
        {priority && (() => {
          const area = getArea(priority.areaId);

          if (!area) return null;

          return (
            <div className="mt-16 rounded-3xl border border-[#8A2EFF]/30 bg-gradient-to-br from-[#8A2EFF]/10 to-[#00B8FF]/5 p-8 sm:p-12">
              <div className="text-sm font-semibold tracking-[0.25em] text-[#C69CFF]">
                SUA PRINCIPAL PRIORIDADE
              </div>

              <h2 className="mt-5 text-3xl font-bold sm:text-5xl">
                {area.name}
              </h2>

              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/55">
                {area.description}
              </p>

              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/20 px-5 py-3">
                <span className="text-sm text-white/40">
                  Tratamento recomendado:
                </span>

                <span className="font-semibold text-white">
                  {area.treatment}
                </span>
              </div>
            </div>
          );
        })()}

        {/* Áreas */}
        <div className="mt-20">
          <div className="text-center">
            <div className="text-sm tracking-[0.25em] text-white/40">
              MAPA DO SEU NEGÓCIO
            </div>

            <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
              As 7 áreas analisadas
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {result.areas.map((areaResult) => {
              const area = getArea(areaResult.areaId);

              if (!area) return null;

              const status = getStatusStyle(areaResult.status);

              return (
                <div
                  key={areaResult.areaId}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-[#00B8FF]">
                        ÁREA {areaResult.areaId}
                      </div>

                      <h3 className="mt-2 text-2xl font-bold">
                        {area.name}
                      </h3>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-8">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/40">
                        Pontuação
                      </span>

                      <span className="font-semibold text-white">
                        {areaResult.score}/{areaResult.maxScore}
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#00B8FF] to-[#8A2EFF]"
                        style={{
                          width: `${
                            (areaResult.score /
                              areaResult.maxScore) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <p className="mt-6 text-sm leading-relaxed text-white/45">
                    {area.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-3xl border border-[#00B8FF]/20 bg-[#00B8FF]/5 p-10 text-center sm:p-16">
          <div className="text-sm tracking-[0.25em] text-[#7DDAFF]">
            PRÓXIMO PASSO
          </div>

          <h2 className="mt-5 text-3xl font-bold sm:text-5xl">
            Agora você sabe onde agir.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/50">
            O diagnóstico revelou os pontos mais importantes.
            O próximo passo é transformar essas informações
            em ações reais para evoluir seu negócio.
          </p>

          <button
            type="button"
            onClick={() => router.push("/diagnostico")}
            className="mt-10 rounded-2xl bg-gradient-to-r from-[#00B8FF] to-[#8A2EFF] px-8 py-4 font-bold transition-transform hover:scale-[1.03]"
          >
            FAZER NOVO DIAGNÓSTICO
          </button>
        </div>
      </section>
    </main>
  );
}