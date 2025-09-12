import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient({ log: [] });

async function main() {
  console.log("🌱 Seed iniciado...");

  // -----------------------
  // Tipos e Usuários
  // -----------------------
  const tiposData = [
    { descricao: "Caixa" },
    { descricao: "Garçom" },
  ];
  await prisma.tipo.createMany({ data: tiposData, skipDuplicates: true });

  const tipoCaixa = await prisma.tipo.findFirst({ where: { descricao: "Caixa" } });
  const tipoGarcom = await prisma.tipo.findFirst({ where: { descricao: "Garçom" } });

  const senhaHash = await bcrypt.hash("senha123", 10);

  await prisma.usuario.createMany({
    data: [
      { nome: "Caixa", senha: senhaHash, tipo_id: tipoCaixa.id },
      { nome: "Garçom", senha: senhaHash, tipo_id: tipoGarcom.id },
    ],
    skipDuplicates: true,
  });

  // -----------------------
  // Categorias e Produtos
  // -----------------------
  const categoriasData = [
    { nome: "Categoria 1" },
    { nome: "Categoria 2" },
    { nome: "Categoria 3" },
  ];
  await prisma.categoria.createMany({ data: categoriasData, skipDuplicates: true });
  const categorias = await prisma.categoria.findMany();

  const produtosData = [];
  for (const categoria of categorias) {
    // 15 produtos normais
    for (let i = 0; i < 15; i++) {
      produtosData.push({
        nome: faker.food.dish() + ` ${i + 1}`,
        valor: parseFloat(faker.finance.amount(0, 100, 2)),
        descricao: faker.lorem.words(3),
        disponivel: true,
        adicional: false,
        categoria_id: categoria.id,
      });
    }
    // 5 produtos adicionais
    for (let i = 0; i < 5; i++) {
      produtosData.push({
        nome: faker.food.ingredient() + ` ${i + 1}`,
        valor: parseFloat(faker.finance.amount(0, 100, 2)),
        descricao: faker.lorem.words(3),
        disponivel: true,
        adicional: true,
        categoria_id: categoria.id,
      });
    }
  }
  await prisma.produto.createMany({ data: produtosData });

  const produtos = await prisma.produto.findMany();

  // Separar produtos normais e adicionais
  const produtosNormais = produtos.filter(p => !p.adicional);
  const produtosAdicionais = produtos.filter(p => p.adicional);

  // -----------------------
  // 3️⃣ Pedidos e Itens
  // -----------------------
  const totalPedidos = 10000; // 10k pedidos x 10 itens = 100k itens
  const itensPorPedido = 10;

  console.log("📝 Criando pedidos e itens...");

  const batchPedidos = 500; // batch de pedidos
  const batchItens = 5000;  // batch de itens

  let pedidosData = [];
  let itensData = [];
  let pedidoId = 1;

  for (let i = 0; i < totalPedidos; i++) {
    const usuarioId = i % 2 === 0 ? tipoCaixa.id : tipoGarcom.id;
    pedidosData.push({ usuario_id: usuarioId });

    // Batch de pedidos
    if (pedidosData.length === batchPedidos || i === totalPedidos - 1) {
      const createdPedidos = await prisma.pedido.createMany({ data: pedidosData });
      pedidosData = [];
    }

    // Criar itens para este pedido
    const pedidoItens = [];
    const itensPrincipais = [];

    for (let j = 0; j < itensPorPedido; j++) {
      // 80% chance de ser normal, 20% chance adicional (ajuste conforme quiser)
      const usarAdicional = Math.random() < 0.2 && produtosAdicionais.length > 0 && itensPrincipais.length > 0;
      if (usarAdicional) {
        // Item adicional, precisa apontar para um item principal
        const principal = itensPrincipais[Math.floor(Math.random() * itensPrincipais.length)];
        const produto = produtosAdicionais[Math.floor(Math.random() * produtosAdicionais.length)];

        pedidoItens.push({
          valor_unitario: produto.valor,
          quantidade: 1,
          produto_id: produto.id,
          pedido_id: pedidoId,
          pertence_a_id: principal.id,
        });
      } else {
        // Item normal
        const produto = produtosNormais[Math.floor(Math.random() * produtosNormais.length)];
        const item = {
          valor_unitario: produto.valor,
          quantidade: 1,
          produto_id: produto.id,
          pedido_id: pedidoId,
          pertence_a_id: null,
        };
        pedidoItens.push(item);
        itensPrincipais.push({ ...item, id: itensData.length + pedidoItens.length }); // gerar id fictício
      }
    }

    itensData.push(...pedidoItens);

    // Batch de itens
    if (itensData.length >= batchItens || i === totalPedidos - 1) {
      await prisma.item.createMany({ data: itensData });
      itensData = [];
    }

    pedidoId++;
    if (i % 1000 === 0) console.log(`✔ ${i} pedidos processados`);
  }

  console.log("✅ Seed finalizado!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
