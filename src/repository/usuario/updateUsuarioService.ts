import { prisma } from "@/lib/prisma";

import { UsuarioFormType } from "@/schemas/usuarioSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type UsuarioUpdate = Partial<UsuarioFormType>

export default async function updateUsuario(id: number, { tipoId, nome, senha }: UsuarioUpdate) {
  try {
    const usuario = await prisma.usuario.update({
      where: { id: id },
      data: {
        nome: nome,
        senha: senha,
        tipo_id: tipoId
      }
    });

    return { usuario };
  } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new Error("Erro: Nome de usuário em uso.");
        }

        if (err.code === "P2003") {
          throw new Error("Erro: Relacionamento inválido em tipo de usuário.");
        }

        if (err.code === "P2025") {
          throw new Error("Erro: Usuário não encontrado.");
        }
      }
    }
}