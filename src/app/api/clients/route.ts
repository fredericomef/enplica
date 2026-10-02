import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

type ClientPayload = {
  name?: string;
  email?: string;
  whatsapp?: string;
  birthDate?: string;
  role?: string;
  cnpj?: string;
  diagnostic?: {
    overallScore?: number;
    maxScore?: number;
    percentage?: number;
    priorityArea?: string | null;
    answers?: unknown;
    areas?: unknown;
  };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ClientPayload;

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const whatsapp = body.whatsapp?.trim();
    const birthDate = body.birthDate?.trim() || null;
    const role = body.role?.trim() || null;
    const cnpj = body.cnpj?.trim() || null;

    if (!name || !email || !whatsapp) {
      return NextResponse.json(
        {
          error:
            "Nome, e-mail e WhatsApp são obrigatórios.",
        },
        { status: 400 },
      );
    }

    if (!body.diagnostic) {
      return NextResponse.json(
        {
          error: "Dados do diagnóstico não enviados.",
        },
        { status: 400 },
      );
    }

    const diagnostic = body.diagnostic;

    const { data: client, error: clientError } =
      await supabaseServer
        .from("clients")
        .insert({
          name,
          email,
          whatsapp,
          birth_date: birthDate,
          role,
          cnpj,
        })
        .select("id, name, email, whatsapp")
        .single();

    if (clientError || !client) {
      console.error("Erro ao criar cliente:", clientError);

      return NextResponse.json(
        {
          error:
            clientError?.message ||
            "Não foi possível cadastrar o cliente.",
        },
        { status: 500 },
      );
    }

    const { data: diagnosticRecord, error: diagnosticError } =
      await supabaseServer
        .from("diagnostics")
        .insert({
          client_id: client.id,
          overall_score: diagnostic.overallScore ?? 0,
          max_score: diagnostic.maxScore ?? 63,
          percentage: diagnostic.percentage ?? 0,
          priority_area: diagnostic.priorityArea ?? null,
          status: "COMPLETED",
          answers: diagnostic.answers ?? {},
          areas: diagnostic.areas ?? [],
        })
        .select("id")
        .single();

    if (diagnosticError || !diagnosticRecord) {
      console.error(
        "Erro ao criar diagnóstico:",
        diagnosticError,
      );

      await supabaseServer
        .from("clients")
        .delete()
        .eq("id", client.id);

      return NextResponse.json(
        {
          error:
            diagnosticError?.message ||
            "Não foi possível salvar o diagnóstico.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        clientId: client.id,
        diagnosticId: diagnosticRecord.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro inesperado na API:", error);

    return NextResponse.json(
      {
        error: "Erro interno ao processar o cadastro.",
      },
      { status: 500 },
    );
  }
}
