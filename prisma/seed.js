import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1. Criar Tipos
  const tipos = await prisma.tipo.createMany({
    data: [
      { descricao: "Caixa" },
      { descricao: "Garçom" },
      { descricao: "Admin" },
    ],
    skipDuplicates: true,
  });

  const tipoAdmin = await prisma.tipo.findFirst({
    where: { descricao: "Admin" },
  });

  // 2. Criar Status
  await prisma.status.createMany({
    data: [
      { descricao: "Pendente" },
      { descricao: "Cancelado" },
      { descricao: "Finalizado" },
    ],
    skipDuplicates: true,
  });

  // 3. Criar Usuário Admin
  if (tipoAdmin) {
    const senhaHash = await bcrypt.hash("123", 10);

    await prisma.usuario.create({
      data: {
        nome: "Admin",
        senha: senhaHash,
        tipo_id: tipoAdmin.id,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
