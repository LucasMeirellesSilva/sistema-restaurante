import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getEstabelecimento from "@/repository/estabelecimento/getEstabelecimentoService";

export async function GET(req: NextRequest) {
  const { isValid, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Interação com o banco
  const result = await getEstabelecimento();
   
  return NextResponse.json(result, { status: 200 });
}

import { EstabelecimentoFormType } from "@/schemas/estabelecimentoSchema";
import createEstabelecimento from "@/repository/estabelecimento/createEstabelecimentoService";

export async function POST(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  if (decoded!.role !== "Admin") return NextResponse.json({error: "Acesso negado."}, { status: 400 });

  const estabelecimento: EstabelecimentoFormType = await req.json();

  try {
    const result = await createEstabelecimento(estabelecimento)

    return NextResponse.json(result, { status: 201 });

  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }  
}

import { EstabelecimentoUpdate } from "@/repository/estabelecimento/updateEstabelecimentoService"; 
import updateEstabelecimento from "@/repository/estabelecimento/updateEstabelecimentoService";

export async function PATCH(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Apenas administradores podem alterar informações do estabelecimento.
  if (decoded!.role !== "Admin") return NextResponse.json({error: "Acesso negado."}, { status: 400 });

  const estabelecimento: EstabelecimentoUpdate = await req.json();

  try {
    const result = await updateEstabelecimento(estabelecimento);

    if(result) return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}