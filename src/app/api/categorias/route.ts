import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import checkPermission from "@/lib/checkPermission";
import getCategorias from "@/repository/categoria/getCategoriasService";

export async function GET(req: NextRequest) {
  const { isValid, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Interação com o banco
  const categorias = await getCategorias();

  return NextResponse.json(categorias);
}

import { CategoriaFormType } from "@/schemas/categoriaSchema";
import createCategoria from "@/repository/categoria/createCategoriaService";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(decoded!.role, "criarCategoria");

  if (!allowed) return notAllowedRes;

  let { nome }: CategoriaFormType = await req.json();

  try {
    const result = await createCategoria({ nome });
  
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });

    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }  
}

import updateCategoria, { CategoriaUpdateType } from "@/repository/categoria/updateCategoriaService";

export async function PATCH(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(decoded!.role, "editarCategoria");

  if (!allowed) return notAllowedRes;

  const { categoriaId, nome }: CategoriaUpdateType = await req.json();

  try {
    const result = await updateCategoria({ categoriaId, nome })

    return NextResponse.json(result, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }  
}

import deleteCategoria from "@/repository/categoria/deleteCategoriaService";

export async function DELETE(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(decoded!.role, "deletarCategoria");

  if (!allowed) return notAllowedRes;

  const { id }: { id: number } = await req.json();

  try {
    const result = await deleteCategoria(id);

    return NextResponse.json(result?.nome, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}