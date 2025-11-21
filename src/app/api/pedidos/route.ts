import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getPedidos from "@/repository/pedido/getPedidos";
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
  const { allowed, res: notAllowedRes } = checkPermission(
    decoded!.role,
    "verHistorico"
  );

  if (!allowed) return notAllowedRes;

  // Interação com o banco
  const { pedidosFormatados, totalPages, total } = await getPedidos({
    limit,
    skip,
  });

  const response = NextResponse.json({
    items: pedidosFormatados,
    page,
    totalPages,
    total,
  });

  return response;
}

import { prisma } from "@/lib/prisma";
import { validatePedidoForm } from "@/schemas/pedidoSchema";
import createPedido from "@/repository/pedido/createPedido";
import getValorProdutos from "@/repository/produto/getValorProdutos";
import createItem from "@/repository/item/createItem";

export async function POST(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  if (!isValid) return res;

  const autorId = decoded!.id;

  try {
    const { itens, clienteId, mesaId, observacao } = validatePedidoForm(
      await req.json()
    );

    if (!itens || itens.length < 1)
      throw new Error("O pedido deve possuir ao menos um item.");

    const result = await prisma.$transaction(async (tx) => {
      // Criação do Pedido
      const pedido = await createPedido(tx, {
        autorId,
        clienteId,
        mesaId,
        observacao,
      });

      // Consultar no banco os valores dos produtos.
      const produtoIds = itens.flatMap((item) => [
        item.produtoId,
        ...(item.adicionais?.map((a) => a.produtoId) ?? []),
      ]);

      const produtos = await getValorProdutos(produtoIds);

      // Transformar em Map para otimizar consulta.
      const produtoMap = new Map(produtos.map((p) => [p.id, p]));

      // Criar os itens vinculados com valor do produto.
      for (const item of itens) {
        const produto = produtoMap.get(item.produtoId);
        if (!produto) {
          throw new Error(`Produto ${item.produtoId} não encontrado`);
        }

        if (!produto.disponivel) {
          throw new Error(
            `Produto ${item.produtoId} não está disponível para venda.`
          );
        }

        // cria o item principal
        const itemCriado = await createItem(tx, {
          pedidoId: pedido.id,
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          valorUnitario: produto.valor,
        });

        // cria os adicionais se existirem
        if (item.adicionais?.length) {
          for (const adicional of item.adicionais) {
            const prodAd = produtoMap.get(adicional.produtoId);
            if (!prodAd)
              throw new Error(
                `Produto adicional ${adicional.produtoId} não encontrado`
              );
            if (!prodAd.disponivel)
              throw new Error(
                `Adicional ${adicional.produtoId} não está disponível.`
              );

            await createItem(tx, {
              pedidoId: pedido.id,
              produtoId: adicional.produtoId,
              quantidade: adicional.quantidade,
              valorUnitario: prodAd.valor,
              pertenceId: itemCriado.id,
            });
          }
        }
      }

      return pedido;
    });

    if (result) {
      fetch("http://192.168.1.5:3000/api/invalidate-pedidos");
      fetch("http://192.168.1.5:3000/api/imprimir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: result.id }),
      });

      return NextResponse.json({ status: 201 });
    } else {
      throw new Error("Falha inesperada na criação do pedido.");
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

import updatePedido, {
  PedidoUpdateType,
} from "@/repository/pedido/updatePedido";
import getPedidoPorId from "@/repository/pedido/getPedidoPorId";
import deleteItems from "@/repository/item/deleteItem";

export async function PATCH(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  if (!isValid) return res;

  try {
    const { itens, pedidoId, clienteId, mesaId, observacao }: PedidoUpdateType =
      await req.json();

    const pedido = await getPedidoPorId(pedidoId);

    // Verifica se o usuário é autor ou administrador
    if (pedido?.autorId !== decoded!.id && decoded!.role !== "Admin")
      return NextResponse.json(
        {
          error: "Não é possível atualizar um pedido feito por outro usuário.",
        },
        { status: 400 }
      );

    // Verifica se o status do pedido é pendente
    if (pedido?.status !== "Pendente")
      return NextResponse.json(
        { error: "Não é possível editar um pedido que não esteja pendente." },
        { status: 400 }
      );

    if (!itens || itens.length < 1)
      throw new Error("O pedido deve possuir ao menos um item.");

    const result = await prisma.$transaction(async (tx) => {
      await deleteItems({ tx, pedidoId });

      // Consultar no banco os valores dos produtos.
      const produtoIds = itens.flatMap((item) => [
        item.produtoId,
        ...(item.adicionais?.map((a) => a.produtoId) ?? []),
      ]);

      const produtos = await getValorProdutos(produtoIds);

      // Transformar em Map para otimizar consulta.
      const produtoMap = new Map(produtos.map((p) => [p.id, p]));

      // Criar os itens vinculados com valor do produto.
      for (const item of itens) {
        const produto = produtoMap.get(item.produtoId);
        if (!produto) {
          throw new Error(`Produto ${item.produtoId} não encontrado`);
        }

        if (!produto.disponivel) {
          throw new Error(
            `Produto ${item.produtoId} não está disponível para venda.`
          );
        }

        // cria o item principal
        const itemCriado = await createItem(tx, {
          pedidoId: pedido.id,
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          valorUnitario: produto.valor,
        });

        // cria os adicionais se existirem
        if (item.adicionais?.length) {
          for (const adicional of item.adicionais) {
            const prodAd = produtoMap.get(adicional.produtoId);
            if (!prodAd)
              throw new Error(
                `Produto adicional ${adicional.produtoId} não encontrado`
              );
            if (!prodAd.disponivel)
              throw new Error(
                `Adicional ${adicional.produtoId} não está disponível.`
              );

            await createItem(tx, {
              pedidoId: pedido.id,
              produtoId: adicional.produtoId,
              quantidade: adicional.quantidade,
              valorUnitario: prodAd.valor,
              pertenceId: itemCriado.id,
            });
          }
        }
      }

      return await updatePedido(tx, {
        pedidoId,
        clienteId,
        mesaId,
        observacao,
      });
    });

    if (result) {
      fetch("http://192.168.1.5:3000/api/invalidate-pedidos");
      fetch("http://192.168.1.5:3000/api/imprimir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: result.id }),
      });

      return NextResponse.json({ status: 200 });
    } else {
      throw new Error("Falha inesperada na criação do pedido.");
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
