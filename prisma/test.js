import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ['query'] });

async function main() {
  // IDs específicos de teste
  const pedidoIds = [16, 52, 4, 50, 545, 467, 12, 23, 231, 935, 432];

  console.log("Buscando pedidos específicos com itens e produtos...");

  console.time("Pedidos específicos com produtos");
  const pedidos = await prisma.pedido.findMany({
    where: { id: { in: pedidoIds } },
    include: {
      itens: {
        include: {
          produto: {
            select: { nome: true } // só pega o nome do produto
          }
        }
      }
    }
  });
  console.timeEnd("Pedidos específicos com produtos");

  console.log(`Pedidos carregados: ${pedidos.length}`);
  pedidos.forEach(pedido => {
    console.log(`Pedido ${pedido.id}:`);
    pedido.itens.forEach(item => {
      console.log(`  Item: ${item.quantidade}x ${item.produto.nome} - Valor unitário: ${item.valor_unitario}`);
    });
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
