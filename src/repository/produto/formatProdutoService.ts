import { Decimal } from "@prisma/client/runtime/library";
import { ProdutoModelType } from "@/schemas/produtoSchema";

type ProdutoComValorDecimal = Omit<ProdutoModelType, "valor" | "categoria"> & { valor: Decimal }

export default function formatarProdutos(produtos: ProdutoComValorDecimal[]) {
  return produtos.map((p) => ({
    ...p,
    valor: new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(p.valor)),
  }));
}