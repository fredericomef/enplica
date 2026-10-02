import type {
  AreaId,
  AreaResult,
  AreaStatus,
  DiagnosticResult,
} from "@/domain/diagnostic/diagnostic.types";

import {
  ENPLICA_SERVICES,
  type EnplicaService,
} from "@/domain/services/services.config";

export interface RecommendedService extends EnplicaService {
  areaId: AreaId;
  areaScore: number;
  areaStatus: AreaStatus;
  recommendedReason: string;
}

const AREA_NAMES: Record<AreaId, string> = {
  E: "Estratégia",
  N: "Negócios",
  P: "Planejamento",
  L: "Liderança",
  I: "IA e Tecnologia",
  C: "Comunicação",
  A: "Artes",
};

const PRIMARY_SIM_BY_AREA: Partial<Record<AreaId, string>> = {
  E: "RST-01",
  N: "IMP-03",
  P: "LMP-01",
  L: "RST-03",
  I: "IMP-01",
  C: "EST-01",
  A: "EST-03",
};

const PRIMARY_NEXA_BY_AREA: Partial<Record<AreaId, string>> = {
  E: "NEX-E01",
  N: "NEX-N01",
  P: "NEX-P01",
  L: "NEX-L01",
  I: "NEX-I01",
  C: "NEX-C01",
  A: "NEX-A01",
};

function getAreaPriority(area: AreaResult): number {
  if (area.status === "TRATAR") return 0;
  if (area.status === "ATENCAO") return 1;
  return 2;
}

function getReason(area: AreaResult, provider: "SIM" | "NEXA"): string {
  const areaName = AREA_NAMES[area.areaId];

  if (area.status === "TRATAR") {
    return provider === "SIM"
      ? `A área de ${areaName} está em nível de tratamento (${area.score}/9). O procedimento SIM foi selecionado para atuar diretamente no problema identificado.`
      : `A área de ${areaName} está em nível de tratamento (${area.score}/9). A solução Nexa foi selecionada para apoiar a evolução tecnológica e operacional dessa área.`;
  }

  if (area.status === "ATENCAO") {
    return provider === "SIM"
      ? `A área de ${areaName} apresenta atenção (${area.score}/9). O procedimento SIM foi selecionado para estruturar uma melhoria prática.`
      : `A área de ${areaName} apresenta atenção (${area.score}/9). A solução Nexa foi selecionada para ampliar eficiência e organização.`;
  }

  return provider === "SIM"
    ? `A área de ${areaName} está saudável (${area.score}/9). O procedimento foi selecionado como oportunidade de potencialização.`
    : `A área de ${areaName} está saudável (${area.score}/9). A solução Nexa foi selecionada como oportunidade de evolução.`;
}

function findService(code: string | undefined): EnplicaService | null {
  if (!code) return null;

  return (
    ENPLICA_SERVICES.find(
      (service) => service.code === code,
    ) ?? null
  );
}

function createRecommendation(
  area: AreaResult,
  provider: "SIM" | "NEXA",
): RecommendedService | null {
  const code =
    provider === "SIM"
      ? PRIMARY_SIM_BY_AREA[area.areaId]
      : PRIMARY_NEXA_BY_AREA[area.areaId];

  const service = findService(code);

  if (!service) return null;

  return {
    ...service,
    areaId: area.areaId,
    areaScore: area.score,
    areaStatus: area.status,
    recommendedReason: getReason(area, provider),
  };
}

export function getRecommendedServices(
  result: DiagnosticResult,
): RecommendedService[] {
  const areas = [...result.areas].sort((a, b) => {
    const statusDifference =
      getAreaPriority(a) - getAreaPriority(b);

    if (statusDifference !== 0) {
      return statusDifference;
    }

    return a.score - b.score;
  });

  const priorityAreas = areas.filter(
    (area) => area.status !== "SAUDAVEL",
  );

  const targetAreas =
    priorityAreas.length > 0
      ? priorityAreas
      : areas;

  const recommendations: RecommendedService[] = [];

  for (const area of targetAreas) {
    if (recommendations.length >= 3) {
      break;
    }

    const simService = createRecommendation(area, "SIM");

    if (simService) {
      recommendations.push(simService);
    }

    if (recommendations.length >= 3) {
      break;
    }

    const nexaService = createRecommendation(area, "NEXA");

    if (nexaService) {
      recommendations.push(nexaService);
    }
  }

  return recommendations.slice(0, 3);
}

export function getServicesForDiagnostic(
  result: DiagnosticResult,
): RecommendedService[] {
  return getRecommendedServices(result);
}
