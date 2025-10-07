import { ProdutoModelType } from "@/schemas/produtoSchema";

type ProdutoComValorStringSemCategoria = Omit<ProdutoModelType, "categoria">

export default function separarProdutos(produtos: ProdutoComValorStringSemCategoria[]) {
  const adicionais = produtos
    .filter(p => p.adicional)
    .map(({ adicional, ...resto }) => resto);

  const normais = produtos
    .filter(p => !p.adicional)
    .map(({ adicional, ...resto }) => resto);

  return { adicionais, normais };
}