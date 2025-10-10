import { NextRequest, NextResponse } from "next/server";
import getEstabelecimentoRespostaSeguranca from "@/repository/estabelecimento/getEstabelecimentoRespostaSegurancaService";
import bcrypt from "bcryptjs";
import updateUsuario from "@/repository/usuario/updateUsuarioService";

export type RecuperarAcesso = {
  respostaSeguranca: string
  senha: string
}

export async function POST(req: NextRequest) {
  const { respostaSeguranca, senha }: RecuperarAcesso = await req.json();

  try {
    const { respostaSeguranca: resposta } = await getEstabelecimentoRespostaSeguranca();
    
    const respostaHash = await bcrypt.hash(respostaSeguranca, 10);

    if (resposta !== respostaHash) throw new Error("Resposta inválida.");

    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await updateUsuario({ usuarioId: 1, senha: senhaHash });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}