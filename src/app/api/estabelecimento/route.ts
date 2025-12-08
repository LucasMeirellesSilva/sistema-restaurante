import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getEstabelecimento from "@/repository/estabelecimento/getEstabelecimento";

export async function GET() {
  // Interação com o banco
  const result = await getEstabelecimento();

  return NextResponse.json(result, { status: 200 });
}

import {
  validateEstabelecimentoForm,
  validateEstabelecimentoUpdate,
} from "@/schemas/estabelecimentoSchema";
import createEstabelecimento from "@/repository/estabelecimento/createEstabelecimento";

export async function POST(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  if (decoded!.role !== "Admin")
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });

  try {
    const estabelecimento = await validateEstabelecimentoForm(await req.json());

    const result = await createEstabelecimento(estabelecimento);

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

import updateEstabelecimento from "@/repository/estabelecimento/updateEstabelecimento";

export async function PATCH(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Apenas administradores podem alterar informações do estabelecimento.
  if (decoded!.role !== "Admin")
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });

  try {
    const estabelecimento = validateEstabelecimentoUpdate(await req.json());

    const result = await updateEstabelecimento(estabelecimento);

    if (result) return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}