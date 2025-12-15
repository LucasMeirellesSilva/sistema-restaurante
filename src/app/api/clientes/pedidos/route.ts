import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getPedidos from "@/repository/pedido/getPedidos";
import { FilteredHistoricoType } from "@/lib/hooks/usePedidosPaginado";

export async function GET(req: NextRequest) {
  const { isValid, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const clienteParam = searchParams.get("cliente");

    if (!clienteParam) throw new Error("Cliente não fornecido.");

    const filter: FilteredHistoricoType = {
      ...(clienteParam !== null && {
        cliente: clienteParam,
      }),
    };

    const { pedidosFormatados, totalPages, total } = await getPedidos({ limit, skip, filter });

    const response = NextResponse.json({
    items: pedidosFormatados,
    page,
    totalPages: totalPages,
    total: total,
  });

  return response;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
