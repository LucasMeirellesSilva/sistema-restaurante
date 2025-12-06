import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getProdutos, {
  FilteredProdutosType,
} from "@/repository/produto/getProdutos";
import checkPermission from "@/lib/checkPermission";

export async function GET(req: NextRequest) {
  const { isValid, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const skip = (page - 1) * limit;

  const categoriaParam = searchParams.get("categoria");
  const nomeParam = searchParams.get("nome");

  const filter: FilteredProdutosType = {
    ...(categoriaParam !== null && {
      categoriaId: parseInt(categoriaParam),
    }),
    ...(nomeParam !== null && {
      nome: nomeParam,
    }),
  };

  // Interação com o banco
  const { produtosFormatados, total, totalPages } = await getProdutos({
    limit,
    skip,
    adicional: true,
    filter,
  });

  return NextResponse.json({
    items: produtosFormatados,
    page,
    totalPages,
    total,
  });
}

import { validateProdutoForm } from "@/schemas/produtoSchema";
import createProduto from "@/repository/produto/createProduto";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(
    decoded!.role,
    "criarProduto"
  );

  if (!allowed) return notAllowedRes;

  // Se o produto possuir adicional === false, então ele não pode ser inserido na rota de Adicional, e sim na rota de Produto.

  try {
    const produto = validateProdutoForm(await req.json());

    if (!produto.adicional) throw new Error("Dados inválidos.");

    const result = await createProduto(produto);

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

import updateProduto from "@/repository/produto/updateProduto";

export async function PATCH(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(
    decoded!.role,
    "editarProduto"
  );

  if (!allowed) return notAllowedRes;

  try {
    const validatedAdicional = validateProdutoForm(await req.json());

    const result = await updateProduto(validatedAdicional);

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

import deleteProduto from "@/repository/produto/deleteProduto";

export async function DELETE(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(
    decoded!.role,
    "deletarProduto"
  );

  if (!allowed) return notAllowedRes;

  const { id }: { id: number } = await req.json();

  try {
    const result = await deleteProduto(id);

    return NextResponse.json(result.nome, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
