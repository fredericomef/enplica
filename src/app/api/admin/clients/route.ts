import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Não autenticado." },
        { status: 401 },
      );
    }

    const token = authorization.replace("Bearer ", "").trim();

    const {
      data: { user },
      error: userError,
    } = await supabaseServer.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Sessão inválida." },
        { status: 401 },
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (
      !adminEmail ||
      user.email?.trim().toLowerCase() !== adminEmail
    ) {
      return NextResponse.json(
        { error: "Acesso administrativo não autorizado." },
        { status: 403 },
      );
    }

    const { data: clients, error: clientsError } =
      await supabaseServer
        .from("clients")
        .select(
          `
          id,
          name,
          email,
          whatsapp,
          birth_date,
          role,
          cnpj,
          created_at,
          diagnostics (
            id,
            overall_score,
            max_score,
            percentage,
            priority_area,
            status,
            created_at
          )
        `,
        )
        .order("name", { ascending: true });

    if (clientsError) {
      console.error("Erro ao buscar clientes:", clientsError);

      return NextResponse.json(
        { error: clientsError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      clients: clients ?? [],
    });
  } catch (error) {
    console.error("Erro inesperado no admin:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}
