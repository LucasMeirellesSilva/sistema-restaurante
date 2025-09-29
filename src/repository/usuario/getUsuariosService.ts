import { prisma } from "@/lib/prisma";

export default async function getUsuarios() {
  const result = await prisma.usuario.findMany();

  return result;
}
