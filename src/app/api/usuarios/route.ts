import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getUsuarios from "@/repository/usuario/getUsuariosService";
import checkPermission from "@/lib/checkPermission";

export async function GET(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(decoded!.role, "verUsuarios");

  console.log(allowed)

  if (!allowed) return notAllowedRes;
   
  // Interação com o banco
  const usuarios = await getUsuarios();

  return NextResponse.json(usuarios);
}


import { UsuarioFormType, validateUsuarioForm } from "@/schemas/usuarioSchema";
import createUsuario from "@/repository/usuario/createUsuarioService";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(decoded!.role, "criarUsuario");

  if (!allowed) return notAllowedRes;

  let { tipoId, nome, senha }: UsuarioFormType = await req.json();

  try {
    const usuario = validateUsuarioForm({ tipoId, nome, senha });

    const result = await createUsuario(usuario);
  
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });

    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }  
}

import updateUsuario, { UsuarioUpdateType } from "@/repository/usuario/updateUsuarioService";

export async function PATCH(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(decoded!.role, "editarUsuario");

  if (!allowed) return notAllowedRes;

  const { usuarioId, nome, senha, tipoId }: UsuarioUpdateType = await req.json();

  try {
    const result = await updateUsuario({ usuarioId, nome, senha, tipoId })

    return NextResponse.json(result, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }  
}

import deleteUsuario from "@/repository/usuario/deleteUsuarioService";

export async function DELETE(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(decoded!.role, "editarUsuario");

  if (!allowed) return notAllowedRes;

  const { id }: { id: number } = await req.json();

  try {
    const result = await deleteUsuario(id);

    return NextResponse.json(result.nome, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}