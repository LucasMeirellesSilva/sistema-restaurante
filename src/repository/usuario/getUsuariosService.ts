import { prisma } from "@/lib/prisma";

export default async function getUsuarios() {
  const usuarios = await prisma.usuario.findMany();

  return { usuarios };
}
