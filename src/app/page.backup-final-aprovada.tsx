"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
  const flashSoundRef = useRef<HTMLAudioElement | null>(null);

  function handleStartDiagnostic() {
    if (isStarting) return;

    setIsStarting(true);

    if (flashSoundRef.current) {
      flashSoundRef.current.currentTime = 0;

      flashSoundRef.current.play().catch((error) => {
        console.error("Erro ao reproduzir o som do flash:", error);
      });
    }

    window.setTimeout(() => {
      router.push("/diagnostico");
    }, 900);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      <audio
        ref={flashSoundRef}
        src="/sounds/flash.mp3"
        preload="auto"
      />

      {/* Fundo tecnológico */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#00B8FF]/15 blur-[140px]" />

        <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#8A2EFF]/15 blur-[140px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-4 text-center sm:px-6 sm:py-6">

        {/* Logos parceiras */}
        <div className="mb-5 flex items-center justify-center gap-5 sm:gap-8">

          <div className="flex h-16 w-32 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 backdrop-blur-xl sm:h-16 sm:w-36">
            <Image
              src="/logos/sim.png"
              alt="SIM"
              width={150}
              height={80}
              className="max-h-12 w-auto object-contain sm:max-h-14"
              priority
            />
          </div>

          <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />

          <div className="flex h-16 w-32 items-center justify-center rounded-2xl border border-[#00B8FF]/20 bg-white/[0.04] px-4 backdrop-blur-xl sm:h-16 sm:w-36">
            <Image
              src="/logos/nexa.png"
              alt="Nexa"
              width={150}
              height={80}
              className="mt-3 max-h-[105px] w-auto object-contain sm:mt-4 sm:max-h-[119px]"
              priority
            />
          </div>

        </div>

        {/* Marca ENPLICA */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-[#00B8FF] shadow-[0_0_20px_#00B8FF]" />

          <span className="text-sm font-semibold tracking-[0.35em] text-white/60">
            ENPLICA
          </span>
        </div>

        {/* Badge */}
        <div className="mb-4 rounded-full border border-[#00B8FF]/30 bg-[#00B8FF]/5 px-5 py-2 text-sm font-medium text-[#7DDAFF] backdrop-blur-xl">
          DIAGNÓSTICO ESTRATÉGICO EMPRESARIAL
        </div>

        {/* Título */}
        <h1 className="max-w-4xl text-4xl font-bold leading-[0.9] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
          Faça um
          <span className="block bg-gradient-to-r from-[#00B8FF] via-white to-[#8A2EFF] bg-clip-text text-transparent">
            RAIO-X
          </span>
          do seu negócio.
        </h1>

        {/* Descrição */}
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-lg">
          Descubra onde sua empresa está perdendo{" "}
          <span className="font-semibold text-white">tempo</span>,{" "}
          <span className="font-semibold text-white">dinheiro</span> e{" "}
          <span className="font-semibold text-white">oportunidades</span>.
        </p>

        <p className="mt-2 max-w-xl text-base leading-relaxed text-white/40">
          Um diagnóstico estratégico baseado em sete áreas fundamentais
          para entender onde agir primeiro.
        </p>

        {/* Indicadores */}
        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 sm:px-5 sm:py-4 backdrop-blur-xl">
            <div className="text-xl font-bold sm:text-2xl text-[#00B8FF]">7</div>

            <div className="mt-0.5 text-xs sm:text-sm text-white/50">
              Áreas analisadas
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 sm:px-5 sm:py-4 backdrop-blur-xl">
            <div className="text-xl font-bold sm:text-2xl text-white">21</div>

            <div className="mt-0.5 text-xs sm:text-sm text-white/50">
              Perguntas estratégicas
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 sm:px-5 sm:py-4 backdrop-blur-xl">
            <div className="text-xl font-bold sm:text-2xl text-[#8A2EFF]">∞</div>

            <div className="mt-0.5 text-xs sm:text-sm text-white/50">
              Possibilidades de evolução
            </div>
          </div>
        </div>

        {/* Botão */}
        <button
          type="button"
          onClick={handleStartDiagnostic}
          disabled={isStarting}
          className="group relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#00B8FF] to-[#8A2EFF] px-8 py-4 text-base font-bold text-white shadow-[0_0_50px_rgba(0,184,255,0.25)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_80px_rgba(138,46,255,0.35)] active:scale-[0.98] disabled:cursor-not-allowed"
        >
          <span className="relative z-10">
            {isStarting
              ? "INICIANDO ANÁLISE..."
              : "INICIAR MEU DIAGNÓSTICO"}
          </span>

          <span className="absolute inset-0 translate-x-[-100%] bg-white/20 transition-transform duration-700 group-hover:translate-x-[100%]" />
        </button>

        <p className="mt-3 text-xs tracking-wide text-white/30">
          LEVA APENAS ALGUNS MINUTOS
        </p>

      </section>

      {/* Flash cinematográfico */}
      {isStarting && (
        <div className="enplica-flash pointer-events-none fixed inset-0 z-50" />
      )}
    </main>
  );
}






