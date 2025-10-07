import { NextResponse } from "next/server";

const forbiddenRoles = {
deletarPedido: ["Garçom", "Caixa"],
finalizarPedido: ["Garçom"],
verHistorico: ["Garçom"],
verUsuarios: ["Garçom, Caixa"],
criarUsuario: ["Garçom, Caixa"],
editarUsuario: ["Garçom, Caixa"],
deletarUsuario: ["Garçom, Caixa"],
criarProduto: ["Garçom, Caixa"],
editarProduto: ["Garçom, Caixa"],
deletarProduto: ["Garçom, Caixa"],
criarCategoria: ["Garçom, Caixa"],
editarCategoria: ["Garçom, Caixa"],
deletarCategoria: ["Garçom, Caixa"],
} satisfies Record<string, string[]>;

type Action = keyof typeof forbiddenRoles;

export default function checkPermission(role: string, action: Action): { allowed: boolean, res?: NextResponse} {
  if(forbiddenRoles[action].includes(role)) {
    return { allowed: false, res: NextResponse.json({error: "Acesso negado."}, { status: 403 })};
  }
  return { allowed: true };
}