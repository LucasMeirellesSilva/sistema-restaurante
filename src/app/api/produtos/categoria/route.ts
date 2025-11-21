import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getProdutosDisponiveisPorCategoria from "@/repository/produto/getProdutosDisponiveisPorCategoria";

export async function GET(req: NextRequest) {
  const { isValid, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });

  // Interação com o banco
  try {
    const produtos = await getProdutosDisponiveisPorCategoria(Number(id));

    return NextResponse.json(produtos);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }

}