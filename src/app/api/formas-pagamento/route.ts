import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getFormasPagamento from "@/repository/formaPagamento/getFormasPagamentoService";

export async function GET(req: NextRequest) {
  const { isValid, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Interação com o banco
  const formasPagamento = await getFormasPagamento();

  return NextResponse.json(formasPagamento);
}