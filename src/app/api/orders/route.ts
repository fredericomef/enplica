import { NextResponse } from "next/server";

import { ENPLICA_SERVICES } from "@/domain/services/services.config";
import { supabaseServer } from "@/lib/supabase-server";

const EXCLUDED_SIM_SERVICES = [
  "CON-00",
  "CON-01",
  "MNT-01",
  "MNT-02",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      clientId,
      serviceCode,
    } = body;

    if (!clientId || !serviceCode) {
      return NextResponse.json(
        {
          error: "clientId e serviceCode são obrigatórios.",
        },
        { status: 400 },
      );
    }

    const service = ENPLICA_SERVICES.find(
      (item) => item.code === serviceCode,
    );

    if (!service) {
      return NextResponse.json(
        {
          error: "Serviço não encontrado.",
        },
        { status: 404 },
      );
    }

    if (service.pricingType === "QUOTE") {
      return NextResponse.json(
        {
          error:
            "Este serviço precisa de orçamento personalizado.",
          pricingType: "QUOTE",
        },
        { status: 400 },
      );
    }

    if (
      service.provider === "SIM" &&
      EXCLUDED_SIM_SERVICES.includes(service.code)
    ) {
      return NextResponse.json(
        {
          error:
            "Este serviço não pode ser contratado por este fluxo.",
        },
        { status: 400 },
      );
    }

    const { data: client, error: clientError } =
      await supabaseServer
        .from("clients")
        .select("id")
        .eq("id", clientId)
        .maybeSingle();

    if (clientError) {
      console.error(
        "Erro ao consultar cliente:",
        clientError,
      );

      return NextResponse.json(
        {
          error: "Erro ao consultar cliente.",
        },
        { status: 500 },
      );
    }

    if (!client) {
      return NextResponse.json(
        {
          error: "Cliente não encontrado.",
        },
        { status: 404 },
      );
    }

    const { data: order, error: orderError } =
      await supabaseServer
        .from("enplica_orders")
        .insert({
          client_id: clientId,
          service_code: service.code,
          service_name: service.name,
          provider: service.provider,
          amount: service.price,
          pricing_type: service.pricingType,
          status: "WAITING_PAYMENT",
          payment_status: "WAITING",
        })
        .select()
        .single();

    if (orderError) {
      console.error(
        "Erro ao criar contratação:",
        orderError,
      );

      return NextResponse.json(
        {
          error: "Não foi possível criar a contratação.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Erro inesperado em /api/orders:",
      error,
    );

    return NextResponse.json(
      {
        error: "Erro interno do servidor.",
      },
      { status: 500 },
    );
  }
}
