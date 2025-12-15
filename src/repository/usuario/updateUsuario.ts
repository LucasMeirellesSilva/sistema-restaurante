import { prisma } from "@/lib/prisma";

import { UsuarioFormType } from "@/schemas/usuarioSchema";
import bcrypt from "bcryptjs";

export type UsuarioUpdateType = Partial<UsuarioFormType>;

export default async function updateUsuario({
  id,
  tipoId,
  nome,
  senha,
}: UsuarioUpdateType) {
  try {
    const senhaHash = senha ? await bcrypt.hash(senha, 10) : senha;

    const usuario = await prisma.usuario.update({
      where: { id: id },
      data: {
        nome: nome,
        senha: senhaHash,
        tipo_id: tipoId,
      },
    });

    return usuario;
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new Error("Nome de usuário em uso.");
    }

    if (err.code === "P2003") {
      throw new Error("Relacionamento inválido em tipo de usuário.");
    }

    if (err.code === "P2025") {
      throw new Error("Usuário não encontrado.");
    }
    throw err;
  }
}
