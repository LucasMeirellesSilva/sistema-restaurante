/*
  Warnings:

  - The primary key for the `pagamentoformapagamento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `pagamentoformapagamento` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pagamentoformapagamento` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`pagamento_id`, `forma_pagamento_id`);

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `Pagamento_pedido_id_fkey` FOREIGN KEY (`pedido_id`) REFERENCES `Pedido`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
