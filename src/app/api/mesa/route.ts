import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getEstabelecimento from "@/repository/estabelecimento/getEstabelecimentoService";

export async function GET(req: NextRequest) {
  const { isValid, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Interação com o banco
  const result = await getEstabelecimento();
   
  return NextResponse.json({ result }, { status: 200 });
}

import { EstabelecimentoFormType } from "@/schemas/estabelecimentoSchema";
import createEstabelecimento from "@/repository/estabelecimento/createEstabelecimentoService";

export async function POST(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  if (decoded!.role !== "Admin") return NextResponse.json({error: "Apenas administradores podem acessar esta rota."}, { status: 400 });

  let estabelecimento: EstabelecimentoFormType = await req.json();

  try {
    const result = await createEstabelecimento(estabelecimento)

    return NextResponse.json({ result }, { status: 201 });

  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }  
}