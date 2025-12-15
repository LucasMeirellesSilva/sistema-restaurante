import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

import { UsuarioFormType } from "@/schemas/usuarioSchema";

export default async function createUsuario({
  tipoId,
  nome,
  senha,
}: UsuarioFormType) {
  const senhaHash = await bcrypt.hash(senha, 10);
  try {
    const usuario = await prisma.usuario.create({
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
      throw new Error("Nível de acesso não encontrado.");
    }
    throw err;
  }
}
