import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getUsuarios from "@/repository/usuario/getUsuarios";
import checkPermission from "@/lib/checkPermission";

export async function GET(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(
    decoded!.role,
    "verUsuarios"
  );

  if (!allowed) return notAllowedRes;

  const { searchParams } = new URL(req.url);

  const nomeParam = searchParams.get("nome");

  const filter: FilteredUsuariosType = {
    ...(nomeParam !== null && {
      nome: nomeParam,
    }),
  };

  // Interação com o banco
  const usuarios = await getUsuarios(filter);

  return NextResponse.json(usuarios);
}

import { validateUsuarioForm } from "@/schemas/usuarioSchema";
import createUsuario from "@/repository/usuario/createUsuario";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(
    decoded!.role,
    "criarUsuario"
  );

  if (!allowed) return notAllowedRes;

  try {
    const usuario = validateUsuarioForm(await req.json());

    const result = await createUsuario(usuario);

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError)
      return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });

    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

import updateUsuario from "@/repository/usuario/updateUsuario";

export async function PATCH(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(
    decoded!.role,
    "editarUsuario"
  );

  if (!allowed) return notAllowedRes;

  try {
    const usuario = validateUsuarioForm(await req.json());

    const result = await updateUsuario(usuario);

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

import deleteUsuario from "@/repository/usuario/deleteUsuario";
import { FilteredUsuariosType } from "@/lib/hooks/useUsuarios";
import getUsuarioPorId from "@/repository/usuario/getUsuarioPorId";

export async function DELETE(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(
    decoded!.role,
    "deletarUsuario"
  );

  if (!allowed) return notAllowedRes;

  const { id }: { id: number } = await req.json();

  try {
    const usuario = await getUsuarioPorId(id);

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    if (usuario.id === 1) {
      return NextResponse.json(
        { error: "Não é possível deletar o administrador padrão" },
        { status: 400 }
      );
    }

    const result = await deleteUsuario(usuario.id);

    return NextResponse.json(result.nome, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
