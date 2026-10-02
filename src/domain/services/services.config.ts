import type { AreaId } from "@/domain/diagnostic/diagnostic.types";

export type ServiceProvider = "SIM" | "NEXA";

export type ServicePricingType = "FIXED" | "QUOTE";

export interface EnplicaService {
  code: string;
  name: string;
  description: string;
  duration: string;
  modality: string;
  provider: ServiceProvider;
  price: number;
  pricingType: ServicePricingType;
  areas: AreaId[];
}

export const ENPLICA_SERVICES: EnplicaService[] = [
  // =========================================================
  // SIM — CONSULTA E DIAGNÓSTICO
  // =========================================================
  {
    code: "CON-00",
    name: "Raio-X ENPLICA",
    description:
      "Mapa das sete áreas em verde, âmbar e vermelho, devolvido por e-mail em 24h com link de agenda.",
    duration: "10 min",
    modality: "Online",
    provider: "SIM",
    price: 0,
    pricingType: "FIXED",
    areas: ["E", "N", "P", "L", "I", "C", "A"],
  },
  {
    code: "CON-01",
    name: "Consulta de Gestão",
    description:
      "Uma dor tratada na hora e um plano de tratamento com até três procedimentos, com data do primeiro já marcada.",
    duration: "60 min",
    modality: "Ambos",
    provider: "SIM",
    price: 220,
    pricingType: "FIXED",
    areas: ["E", "N", "P", "L", "I", "C", "A"],
  },

  // =========================================================
  // SIM — LIMPEZA
  // =========================================================
  {
    code: "LMP-01",
    name: "Limpeza de Agenda",
    description:
      "Agenda reconstruída com blocos, regra de aceite de reunião e rotina semanal já lançada.",
    duration: "90 min",
    modality: "Ambos",
    provider: "SIM",
    price: 450,
    pricingType: "FIXED",
    areas: ["P"],
  },
  {
    code: "LMP-02",
    name: "Limpeza de Caixa de Entrada",
    description:
      "Triagem, filtros e respostas-padrão configurados no e-mail e no WhatsApp, testados na sessão.",
    duration: "90 min",
    modality: "Online",
    provider: "SIM",
    price: 450,
    pricingType: "FIXED",
    areas: ["C"],
  },
  {
    code: "LMP-03",
    name: "Limpeza de Backlog",
    description:
      "Lista única de pendências com critério de corte aplicado ao vivo. O que morre, morre na sessão.",
    duration: "90 min",
    modality: "Ambos",
    provider: "SIM",
    price: 450,
    pricingType: "FIXED",
    areas: ["E", "P"],
  },

  // =========================================================
  // SIM — RESTAURAÇÃO
  // =========================================================
  {
    code: "RST-01",
    name: "Restauração de Processo",
    description:
      "Um processo mapeado e redesenhado, entregue como fluxo desenhado mais checklist operacional.",
    duration: "2h",
    modality: "Ambos",
    provider: "SIM",
    price: 750,
    pricingType: "FIXED",
    areas: ["E"],
  },
  {
    code: "RST-02",
    name: "Restauração de Proposta",
    description:
      "Modelo de proposta técnica reescrito: estrutura, critério de precificação e argumento de valor.",
    duration: "2h",
    modality: "Ambos",
    provider: "SIM",
    price: 750,
    pricingType: "FIXED",
    areas: ["N", "C"],
  },
  {
    code: "RST-03",
    name: "Restauração de Reunião",
    description:
      "Pauta-padrão, ritual e ata automática de uma reunião recorrente, aplicados na próxima ocorrência.",
    duration: "90 min",
    modality: "Ambos",
    provider: "SIM",
    price: 600,
    pricingType: "FIXED",
    areas: ["L", "C"],
  },

  // =========================================================
  // SIM — IMPLANTE
  // =========================================================
  {
    code: "IMP-01",
    name: "Implante de IA",
    description:
      "Um agente treinado no contexto do cliente assumindo uma tarefa recorrente, rodando ao fim da sessão.",
    duration: "2h",
    modality: "Ambos",
    provider: "SIM",
    price: 900,
    pricingType: "FIXED",
    areas: ["I"],
  },
  {
    code: "IMP-02",
    name: "Implante de Trello",
    description:
      "Board montado com listas, automações e rotina de uso, com a equipe dentro antes de a sessão acabar.",
    duration: "2h",
    modality: "Ambos",
    provider: "SIM",
    price: 900,
    pricingType: "FIXED",
    areas: ["P", "L"],
  },
  {
    code: "IMP-03",
    name: "Implante de Painel",
    description:
      "Os cinco números da semana em um painel simples, alimentado com dados reais e testado na sessão.",
    duration: "2h30",
    modality: "Ambos",
    provider: "SIM",
    price: 1200,
    pricingType: "FIXED",
    areas: ["N"],
  },

  // =========================================================
  // SIM — CANAL
  // =========================================================
  {
    code: "CNL-01",
    name: "Canal de Processo",
    description:
      "Processo crítico apodrecido, refeito do zero com a equipe em duas sessões, com dono e prazo definidos.",
    duration: "2 × 2h",
    modality: "Presencial",
    provider: "SIM",
    price: 1800,
    pricingType: "FIXED",
    areas: ["E"],
  },

  // =========================================================
  // SIM — ESTÉTICA
  // =========================================================
  {
    code: "EST-01",
    name: "Clareamento de Comunicação",
    description:
      "Uma apresentação, pitch ou ofício reescrito e ensaiado dentro da sessão, pronto para usar no dia seguinte.",
    duration: "90 min",
    modality: "Ambos",
    provider: "SIM",
    price: 600,
    pricingType: "FIXED",
    areas: ["C"],
  },
  {
    code: "EST-02",
    name: "Preparação para Câmera",
    description:
      "Roteiro, postura e condução testados em gravação real. O cliente sai com o vídeo na mão.",
    duration: "90 min",
    modality: "Presencial",
    provider: "SIM",
    price: 600,
    pricingType: "FIXED",
    areas: ["A", "C"],
  },
  {
    code: "EST-03",
    name: "Restauração de Marca",
    description:
      "Identidade revista com o cliente, cores e aplicação definidas e uma peça-modelo produzida na sessão como padrão.",
    duration: "2h",
    modality: "Ambos",
    provider: "SIM",
    price: 750,
    pricingType: "FIXED",
    areas: ["A"],
  },

  // =========================================================
  // SIM — MANUTENÇÃO
  // =========================================================
  {
    code: "MNT-01",
    name: "Retorno Semestral",
    description:
      "Raio-X refeito e comparado com o anterior. O que voltou a doer, e por quê.",
    duration: "60 min",
    modality: "Ambos",
    provider: "SIM",
    price: 220,
    pricingType: "FIXED",
    areas: ["E", "N", "P", "L", "I", "C", "A"],
  },
  {
    code: "MNT-02",
    name: "Aparelho",
    description:
      "Três meses de ajuste: uma sessão por mês e canal de dúvidas entre elas, até o novo hábito pegar.",
    duration: "3 × 60 min",
    modality: "Online",
    provider: "SIM",
    price: 1500,
    pricingType: "FIXED",
    areas: ["E", "N", "P", "L", "I", "C", "A"],
  },

  // =========================================================
  // NEXA — ESTRATÉGIA
  // =========================================================
  {
    code: "NEX-E01",
    name: "Automação de Processos",
    description:
      "Automação de tarefas e etapas repetitivas para reduzir trabalho manual e tornar a operação mais eficiente.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 1500,
    pricingType: "FIXED",
    areas: ["E"],
  },
  {
    code: "NEX-E02",
    name: "Digitalização de Processo",
    description:
      "Transformação de controles manuais, documentos e planilhas em um fluxo digital organizado.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 2500,
    pricingType: "FIXED",
    areas: ["E"],
  },
  {
    code: "NEX-E03",
    name: "Sistema Sob Medida",
    description:
      "Desenvolvimento de uma ferramenta exclusiva para uma necessidade específica do negócio.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 4500,
    pricingType: "QUOTE",
    areas: ["E"],
  },

  // =========================================================
  // NEXA — NEGÓCIOS
  // =========================================================
  {
    code: "NEX-N01",
    name: "Dashboard Empresarial",
    description:
      "Painel visual com indicadores importantes para acompanhar o desempenho do negócio.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 1800,
    pricingType: "FIXED",
    areas: ["N"],
  },
  {
    code: "NEX-N02",
    name: "Dashboard de Vendas",
    description:
      "Painel para acompanhar vendas, clientes, conversão, ticket médio e desempenho comercial.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 1500,
    pricingType: "FIXED",
    areas: ["N"],
  },
  {
    code: "NEX-N03",
    name: "CRM Sob Medida",
    description:
      "Sistema personalizado para organizar leads, clientes, oportunidades e histórico comercial.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 3500,
    pricingType: "FIXED",
    areas: ["N"],
  },
  {
    code: "NEX-N04",
    name: "Automação Comercial",
    description:
      "Automação do fluxo comercial desde a entrada do lead até acompanhamento e follow-up.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 2500,
    pricingType: "FIXED",
    areas: ["N"],
  },

  // =========================================================
  // NEXA — PLANEJAMENTO
  // =========================================================
  {
    code: "NEX-P01",
    name: "Agenda Inteligente",
    description:
      "Sistema para organizar horários, compromissos e rotinas com automações.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 1500,
    pricingType: "FIXED",
    areas: ["P"],
  },
  {
    code: "NEX-P02",
    name: "Sistema de Tarefas",
    description:
      "Ferramenta para organizar tarefas, responsáveis, prazos e acompanhamento da execução.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 2000,
    pricingType: "FIXED",
    areas: ["P"],
  },
  {
    code: "NEX-P03",
    name: "Painel de Metas",
    description:
      "Dashboard para acompanhar metas, progresso e indicadores de desempenho.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 1500,
    pricingType: "FIXED",
    areas: ["P"],
  },
  {
    code: "NEX-P04",
    name: "Automação de Rotinas",
    description:
      "Automação de tarefas recorrentes para reduzir atividades manuais e liberar tempo da equipe.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 1800,
    pricingType: "FIXED",
    areas: ["P"],
  },

  // =========================================================
  // NEXA — LIDERANÇA
  // =========================================================
  {
    code: "NEX-L01",
    name: "Painel de Equipe",
    description:
      "Painel para acompanhar tarefas, produtividade, indicadores e desempenho da equipe.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 1800,
    pricingType: "FIXED",
    areas: ["L"],
  },
  {
    code: "NEX-L02",
    name: "Sistema de Gestão Interna",
    description:
      "Sistema personalizado para organizar responsabilidades, tarefas, processos e acompanhamento interno.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 4500,
    pricingType: "FIXED",
    areas: ["L"],
  },
  {
    code: "NEX-L03",
    name: "Automação de Relatórios",
    description:
      "Relatórios gerados automaticamente a partir dos dados da operação.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 1500,
    pricingType: "FIXED",
    areas: ["L"],
  },
  {
    code: "NEX-L04",
    name: "Central de Gestão",
    description:
      "Ambiente centralizado para acompanhar informações, tarefas e indicadores da empresa.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 3500,
    pricingType: "FIXED",
    areas: ["L"],
  },

  // =========================================================
  // NEXA — IA E TECNOLOGIA
  // =========================================================
  {
    code: "NEX-I01",
    name: "Agente de IA",
    description:
      "Agente de inteligência artificial configurado para atuar em tarefas específicas do negócio.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 2500,
    pricingType: "FIXED",
    areas: ["I"],
  },
  {
    code: "NEX-I02",
    name: "Bot de WhatsApp",
    description:
      "Bot para atendimento, triagem, coleta de informações e encaminhamento de clientes.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 1800,
    pricingType: "FIXED",
    areas: ["I", "C"],
  },
  {
    code: "NEX-I03",
    name: "Atendimento Automatizado",
    description:
      "Estrutura automatizada para responder dúvidas, realizar triagem e direcionar atendimentos.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 2500,
    pricingType: "FIXED",
    areas: ["I", "C"],
  },
  {
    code: "NEX-I04",
    name: "Automação com IA",
    description:
      "Integração de inteligência artificial com processos e ferramentas utilizadas pela empresa.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 2500,
    pricingType: "FIXED",
    areas: ["I"],
  },
  {
    code: "NEX-I05",
    name: "Assistente Comercial IA",
    description:
      "Assistente de IA para qualificação, atendimento e apoio ao processo comercial.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 3000,
    pricingType: "FIXED",
    areas: ["I", "N"],
  },
  {
    code: "NEX-I06",
    name: "Integrações com APIs",
    description:
      "Conexão entre sistemas, plataformas e serviços para automatizar a troca de informações.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 1500,
    pricingType: "QUOTE",
    areas: ["I"],
  },

  // =========================================================
  // NEXA — COMUNICAÇÃO
  // =========================================================
  {
    code: "NEX-C01",
    name: "Automação de WhatsApp",
    description:
      "Automação de mensagens, atendimento, distribuição de contatos e acompanhamento.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 1800,
    pricingType: "FIXED",
    areas: ["C"],
  },
  {
    code: "NEX-C02",
    name: "Chatbot",
    description:
      "Chatbot estruturado para atendimento e interação automatizada com clientes.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 1500,
    pricingType: "FIXED",
    areas: ["C"],
  },
  {
    code: "NEX-C03",
    name: "CRM + WhatsApp",
    description:
      "Integração entre relacionamento com clientes e atendimento pelo WhatsApp.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 3500,
    pricingType: "FIXED",
    areas: ["C", "N"],
  },
  {
    code: "NEX-C04",
    name: "Automação de Follow-up",
    description:
      "Acompanhamento automático de leads e clientes para reduzir oportunidades esquecidas.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 1500,
    pricingType: "FIXED",
    areas: ["C", "N"],
  },
  {
    code: "NEX-C05",
    name: "Sistema de Comunicação",
    description:
      "Ferramenta personalizada para centralizar comunicação e informações importantes.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 3000,
    pricingType: "FIXED",
    areas: ["C"],
  },

  // =========================================================
  // NEXA — ARTES / MARCA
  // =========================================================
  {
    code: "NEX-A01",
    name: "Identidade Visual Digital",
    description:
      "Estrutura visual para fortalecer a presença digital e manter consistência da marca.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 1200,
    pricingType: "FIXED",
    areas: ["A"],
  },
  {
    code: "NEX-A02",
    name: "Kit de Conteúdo com IA",
    description:
      "Estrutura de conteúdo com apoio de inteligência artificial para produção recorrente.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 900,
    pricingType: "FIXED",
    areas: ["A"],
  },
  {
    code: "NEX-A03",
    name: "Landing Page",
    description:
      "Página comercial personalizada para apresentar uma oferta e captar clientes.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 1800,
    pricingType: "FIXED",
    areas: ["A", "N"],
  },
  {
    code: "NEX-A04",
    name: "Site Institucional",
    description:
      "Site profissional personalizado para apresentar a empresa, serviços e posicionamento.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 2500,
    pricingType: "FIXED",
    areas: ["A"],
  },
  {
    code: "NEX-A05",
    name: "Sistema Web Personalizado",
    description:
      "Aplicação web desenvolvida de acordo com as necessidades específicas do negócio.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 4500,
    pricingType: "QUOTE",
    areas: ["A", "E"],
  },
  {
    code: "NEX-A06",
    name: "Ferramentas de Marketing com IA",
    description:
      "Ferramentas personalizadas para apoiar produção, organização e automação do marketing.",
    duration: "Projeto",
    modality: "Online",
    provider: "NEXA",
    price: 1500,
    pricingType: "FIXED",
    areas: ["A", "I"],
  },
];

export function getServicesForArea(areaId: AreaId): EnplicaService[] {
  return ENPLICA_SERVICES.filter((service) =>
    service.areas.includes(areaId),
  );
}

export function getNexaServicesForAreas(
  areaIds: AreaId[],
): EnplicaService[] {
  return ENPLICA_SERVICES.filter(
    (service) =>
      service.provider === "NEXA" &&
      service.areas.some((area) => areaIds.includes(area)),
  );
}

