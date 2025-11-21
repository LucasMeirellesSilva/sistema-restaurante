import { ProdutoModelType } from "@/schemas/produtoSchema";

type ProdutoComValorDecimal = Omit<ProdutoModelType, "valorFormatado" | "categoria">

export default function formatarProdutos(produtos: ProdutoComValorDecimal[]) {
  return produtos.map((p) => ({
    ...p,
    valorFormatado: new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(p.valor)),
  }));
}