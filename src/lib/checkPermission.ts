import { NextResponse } from "next/server";

const forbiddenRoles = {
deletarPedido: ["Garçom", "Caixa"],
finalizarPedido: ["Garçom"],
verHistorico: ["Garçom"],
} satisfies Record<string, string[]>;

type Action = keyof typeof forbiddenRoles;

export default function checkPermission(role: string, action: Action): { allowed: boolean, res?: NextResponse} {
  if(forbiddenRoles[action].includes(role)) {
    return { allowed: false, res: NextResponse.json({error: "Acesso negado."}, { status: 403 })};
  }
  return { allowed: true };
}