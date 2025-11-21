import { ProdutoModelType } from "@/schemas/produtoSchema";

type ProdutoFormatadoSemCategoria = Omit<ProdutoModelType, "categoria">

export default function separarProdutos(produtos: ProdutoFormatadoSemCategoria[]) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const adicionais = produtos
    .filter(p => p.adicional)
    .map(({ adicional, ...resto }) => resto);

  const normais = produtos
    .filter(p => !p.adicional)
    .map(({ adicional, ...resto }) => resto);

  return { adicionais, normais };
}