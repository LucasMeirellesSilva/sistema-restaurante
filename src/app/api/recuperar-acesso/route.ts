import { NextRequest, NextResponse } from "next/server";
import getEstabelecimentoRespostaSeguranca from "@/repository/estabelecimento/getEstabelecimentoRespostaSegurancaService";
import bcrypt from "bcryptjs";
import updateUsuario from "@/repository/usuario/updateUsuarioService";

export type RecuperarAcessoForm = {
  respostaSeguranca: string
  senha: string
}

export async function POST(req: NextRequest) {
  const { respostaSeguranca, senha }: RecuperarAcessoForm = await req.json();

  try {
    if (senha.length < 6) throw new Error("A senha deve possuir 6 caracteres ou mais.");
    
    const estabelecimento = await getEstabelecimentoRespostaSeguranca();

    if (!estabelecimento) throw new Error("O estabelecimento não existe.")

    if (!estabelecimento.respostaSeguranca) throw new Error("Resposta ausente."); 

    const valid = await bcrypt.compare(respostaSeguranca, estabelecimento.respostaSeguranca)

    if (!valid) throw new Error("Resposta inválida.");

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