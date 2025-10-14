import { NextResponse } from "next/server";
import getEstabelecimentoRespostaSeguranca from "@/repository/estabelecimento/getEstabelecimentoRespostaSegurancaService";

export async function GET() {
  // Interação com o banco
  const result = await getEstabelecimentoRespostaSeguranca();
   
  return NextResponse.json(result, { status: 200 });
}