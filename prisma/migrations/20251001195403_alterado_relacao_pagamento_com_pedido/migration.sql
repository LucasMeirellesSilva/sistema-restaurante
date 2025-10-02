/*
  Warnings:

  - A unique constraint covering the columns `[pedido_id]` on the table `Pagamento` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Pagamento_pedido_id_key` ON `Pagamento`(`pedido_id`);
