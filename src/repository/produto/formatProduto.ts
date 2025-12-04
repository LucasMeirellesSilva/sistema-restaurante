import { ProdutoModelType } from "@/schemas/produtoSchema";
import { Prisma } from "@prisma/client";

type ProdutoComCategoria = Prisma.ProdutoGetPayload<{
  include: {
    categoria: true;
  };
}>;

export default function formatarProdutos(
  produtos: ProdutoComCategoria[]
): ProdutoModelType[] {
  return produtos.map((p) => ({
    ...p,
    categoria: p.categoria.nome,
    categoriaId: p.categoria.id,
    valor: Number(p.valor),
    valorFormatado: new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(p.valor)),
  }));
}
