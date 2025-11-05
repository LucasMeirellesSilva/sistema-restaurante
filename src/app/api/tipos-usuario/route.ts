import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getTiposUsuario from "@/repository/tipoUsuario/getTiposUsuario";

export async function GET(req: NextRequest) {
  const { isValid, res} = await verifyToken(req);

  if (!isValid) return res;

  const tiposUsuario = await getTiposUsuario();

  return NextResponse.json(tiposUsuario);;
}
