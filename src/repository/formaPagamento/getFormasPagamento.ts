import { prisma } from "@/lib/prisma";

export default async function getFormasPagamento() {
  const formasPagamento = await prisma.formaPagamento.findMany();

  return formasPagamento;
}