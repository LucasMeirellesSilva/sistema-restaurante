import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getProdutosDisponiveisPorCategoria from "@/repository/produto/getProdutosDisponiveisPorCategoriaService";

export async function GET(req: NextRequest) {
  const { isValid, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  const id = req.nextUrl.searchParams.get("id");

  // Interação com o banco
  try {
    if (!id) throw new Error("Id é obrigatório.")

    const start = performance.now();

    const produtos = await getProdutosDisponiveisPorCategoria(Number(id));

    const end = performance.now();

    console.log(`⏱️ Tempo total da rota: ${(end - start).toFixed(2)}ms`);

    return NextResponse.json(produtos);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }

}