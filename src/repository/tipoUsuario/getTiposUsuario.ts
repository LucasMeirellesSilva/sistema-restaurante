import { prisma } from "@/lib/prisma";

export default async function getTiposUsuario() {
  const tiposUsuario = await prisma.tipo.findMany();

  return tiposUsuario;
}
