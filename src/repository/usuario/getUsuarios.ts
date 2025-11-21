import { prisma } from "@/lib/prisma";
import { UsuarioModelType } from "@/schemas/usuarioSchema";

export default async function getUsuarios(): Promise<UsuarioModelType[]> {
  const result = await prisma.usuario.findMany({
    select: {
      id: true,
      nome: true,
      tipo: true,
      _count: {
        select: {
          pedidos: true
        }
      }
    }
  });

  return result.map(usuario => ({
    id: usuario.id,
    nome: usuario.nome,
    tipo: usuario.tipo.descricao,
    tipoId: usuario.tipo.id,
    pedidosAnotados: usuario._count.pedidos
  }));
}
