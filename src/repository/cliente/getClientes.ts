import { prisma } from "@/lib/prisma";

export default async function getClientes() {
  const clientes = await prisma.cliente.findMany({
    where: {
      deletado_em: null,
    },
    orderBy: {
      nome: "asc",
    },
  });

  return clientes;
}
