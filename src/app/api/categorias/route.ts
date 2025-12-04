import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import checkPermission from "@/lib/checkPermission";
import getCategorias from "@/repository/categoria/getCategorias";
import getCategoriasPaginado from "@/repository/categoria/getCategoriasPaginado";

export async function GET(req: NextRequest) {
  const { isValid, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  const { searchParams } = new URL(req.url);
  const rawPage = searchParams.get("page");
  
  if (rawPage) {
    const page = parseInt(rawPage);
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const { categoriasFormatadas, total, totalPages } =
      await getCategoriasPaginado({ limit, skip });

    const response = NextResponse.json({
      items: categoriasFormatadas,
      page,
      totalPages,
      total,
    });

    return response;
  }

  const categorias = await getCategorias();

  return NextResponse.json(categorias);
}

import { validateCategoriaForm } from "@/schemas/categoriaSchema";
import createCategoria from "@/repository/categoria/createCategoria";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(
    decoded!.role,
    "criarCategoria"
  );

  if (!allowed) return notAllowedRes;

  try {
    const categoria = validateCategoriaForm(await req.json());

    const result = await createCategoria(categoria);

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

import updateCategoria, {
  CategoriaUpdateType,
} from "@/repository/categoria/updateCategoria";

export async function PATCH(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(
    decoded!.role,
    "editarCategoria"
  );

  if (!allowed) return notAllowedRes;

  const { categoriaId, nome }: CategoriaUpdateType = await req.json();

  try {
    const result = await updateCategoria({ categoriaId, nome });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

import deleteCategoria from "@/repository/categoria/deleteCategoria";

export async function DELETE(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(
    decoded!.role,
    "deletarCategoria"
  );

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
