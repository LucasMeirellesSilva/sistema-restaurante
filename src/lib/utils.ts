import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { ItemModelType } from "@/schemas/itemSchema";

// Função que "normaliza" o item antes de comparar devido ao fato de que adicionais podem ser adicionados em ordem diferente.
export function normalizar(item: ItemModelType) {
  return {
    ...item,
    id: 0, // ignora id (caso o item seja um item que já existe no pedido e não criado agora)
    quantidade: 0, // ignora quantidade
    valorTotal: 0, // ignora valorTotal
    valorTotalFormatado: "",
    adicionais: [...item.adicionais]
      .map((a) => ({
        ...a,
        id: 0, // ignora id (caso o adicional seja um item que já existe no pedido e não criado agora)
      }))
      .sort((a, b) => a.produtoId! - b.produtoId!),
  };
}
