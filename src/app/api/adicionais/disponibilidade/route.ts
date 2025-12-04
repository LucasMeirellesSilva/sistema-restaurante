import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import checkPermission from "@/lib/checkPermission";
import updateProdutosDisponibilidade from "@/repository/produto/updateProdutosDisponibilidade";

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
    const { productsId }: { productsId: number[] } = await req.json();

    if (productsId.length < 1) throw new Error("Erro: Nenhum produto recebido");

    const result = await updateProdutosDisponibilidade(productsId);

    if (result) {
      return NextResponse.json({ status: 201 });
    } else {
       throw new Error("Ocorreu um erro inesperado") 
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
