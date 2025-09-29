import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getPedidos from "@/repository/pedido/getPedidosService";
import checkPermission from "@/lib/checkPermission";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const skip = (page - 1) * limit;

  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(decoded!.role, "verHistorico");

  if (!allowed) return notAllowedRes;
   
  // Interação com o banco
  const { pedidosFormatados, totalPages, total } = await getPedidos({ limit, skip });

  const response = NextResponse.json({
    items: pedidosFormatados,
    page,
    totalPages,
    total,
  });

  return response;
}

import { prisma } from "@/lib/prisma";
import { PedidoFormType } from "@/schemas/pedidoSchema";
import createPedido from "@/repository/pedido/createPedidoService";
import getValorProdutos from "@/repository/produto/getValorProdutosService";
import createItem from "@/repository/item/createItemService";

export async function POST(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  if (!isValid) return res;

  let { itens, clienteId, mesaId, observacao }: PedidoFormType = await req.json();

  const autorId = decoded!.id;

  try {
    const pedido = await prisma.$transaction(async (tx) => {
      // Criação do Pedido
      const pedido = await createPedido(tx, { autorId, clienteId, mesaId, observacao });

      // Consultar no banco os valores dos produtos.
      const produtoIds = itens.map((item) => item.produtoId);
      const produtos = await getValorProdutos(produtoIds);

      // Transformar em Map para otimizar consulta.
      const produtoMap = new Map(produtos.map((p) => [p.id, p]));

      // Criar os itens vinculados com valor do produto.
      for (const item of itens) {
        const produto = produtoMap.get(item.produtoId);
        if (!produto) {
          throw new Error(`Produto ${item.produtoId} não encontrado`);
        }

        await createItem(tx, {
          ...item,
          pedidoId: pedido.id,
          valorUnitario: produto.valor,
        });

        return pedido;
      }
    });

    return NextResponse.json({ pedido }, { status: 201 });

  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }  
}

import updatePedido, { PedidoUpdate } from "@/repository/pedido/updatePedidoService";
import getPedidoPorId from "@/repository/pedido/getPedidoPorIdService";

export async function PATCH(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  if (!isValid) return res;

  const { pedidoId, clienteId, mesaId, observacao }: PedidoUpdate = await req.json();

  const pedido = await getPedidoPorId(pedidoId);

  // Verificar se o usuário é autor ou administrador
  if (pedido?.usuario_id !== decoded!.id && decoded!.role !== "Admin") return NextResponse.json({error: "Não é possível atualizar um pedido feito por outro usuário."}, { status: 400 });
  
  // Verificar se o status do pedido é pendente
  if (pedido?.status.descricao !== "Pendente") return NextResponse.json({error: "Não é possível cancelar um pedido que não esteja pendente."}, { status: 400 });

  try {
    const result = await updatePedido({ pedidoId, clienteId, mesaId, observacao })

    return NextResponse.json({ result }, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }  
}