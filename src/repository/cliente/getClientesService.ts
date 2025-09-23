import { prisma } from "@/lib/prisma";

export default async function getClientes() {
  const clientes = await prisma.cliente.findMany();

  return { clientes };
}
