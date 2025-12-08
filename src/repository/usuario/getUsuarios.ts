import { FilteredUsuariosType } from "@/lib/hooks/useUsuarios";
import { prisma } from "@/lib/prisma";
import { UsuarioModelType } from "@/schemas/usuarioSchema";

export default async function getUsuarios(
  filter: FilteredUsuariosType
): Promise<UsuarioModelType[]> {
  const result = await prisma.usuario.findMany({
    where: {
      deletado_em: null,
      ...(filter.nome && {
        nome: {
          contains: filter.nome,
        },
      }),
    },
    select: {
      id: true,
      nome: true,
      tipo: true,
      _count: {
        select: {
          pedidos: true,
        },
      },
    },
  });

  return result.map((usuario) => ({
    id: usuario.id,
    nome: usuario.nome,
    tipo: usuario.tipo.descricao,
    tipoId: usuario.tipo.id,
    pedidosAnotados: usuario._count.pedidos,
  }));
}
