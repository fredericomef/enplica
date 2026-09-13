import type {
  AreaResult,
  AreaStatus,
  DiagnosticResult,
} from "./diagnostic.types";

export interface ActionPlanGroup {
  status: AreaStatus;
  title: string;
  description: string;
  areas: AreaResult[];
}

export interface ActionPlan {
  groups: ActionPlanGroup[];
}

function getGroupContent(status: AreaStatus) {
  if (status === "TRATAR") {
    return {
      title: "TRATAR PRIMEIRO",
      description:
        "Estas são as áreas que exigem atenção imediata e devem ser priorizadas para reduzir riscos e destravar a evolução do negócio.",
    };
  }

  if (status === "ATENCAO") {
    return {
      title: "MELHORAR EM SEGUIDA",
      description:
        "Estas áreas possuem uma base funcional, mas precisam de melhorias para aumentar a eficiência e a previsibilidade.",
    };
  }

  return {
    title: "POTENCIALIZAR",
    description:
      "Estas áreas estão saudáveis. O objetivo agora é manter os bons resultados e buscar novas oportunidades de evolução.",
  };
}

export function createActionPlan(
  result: DiagnosticResult,
): ActionPlan {
  const statusOrder: AreaStatus[] = [
    "TRATAR",
    "ATENCAO",
    "SAUDAVEL",
  ];

  const groups = statusOrder
    .map((status) => {
      const areas = result.areas
        .filter((area) => area.status === status)
        .sort((a, b) => a.score - b.score);

      if (areas.length === 0) {
        return null;
      }

      const content = getGroupContent(status);

      return {
        status,
        title: content.title,
        description: content.description,
        areas,
      };
    })
    .filter(
      (group): group is ActionPlanGroup => group !== null,
    );

  return {
    groups,
  };
}