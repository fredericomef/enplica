import { NextResponse } from "next/server";

import { supabaseServer } from "@/lib/supabase-server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          error: "ID do pedido não informado.",
        },
        { status: 400 },
      );
    }

    const { data: order, error } = await supabaseServer
      .from("enplica_orders")
      .select(
        `
          id,
          client_id,
          service_code,
          service_name,
          provider,
          amount,
          pricing_type,
          status,
          payment_status,
          payment_provider,
          payment_id,
          payment_reference,
          checkout_url,
          pix_qr_code,
          pix_copy_paste,
          paid_at,
          created_at,
          updated_at
        `,
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(
        "Erro ao consultar pedido:",
        error,
      );

      return NextResponse.json(
        {
          error: "Não foi possível consultar o pedido.",
        },
        { status: 500 },
      );
    }

    if (!order) {
      return NextResponse.json(
        {
          error: "Pedido não encontrado.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Erro inesperado em /api/orders/[id]:",
      error,
    );

    return NextResponse.json(
      {
        error: "Erro interno ao consultar o pedido.",
      },
      { status: 500 },
    );
  }
}
