/*
  Warnings:

  - You are about to drop the column `disponivel` on the `Mesa` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Pagamento` DROP FOREIGN KEY `Pagamento_pedido_id_fkey`;

-- DropForeignKey
ALTER TABLE `PagamentoFormaPagamento` DROP FOREIGN KEY `PagamentoFormaPagamento_forma_pagamento_id_fkey`;

-- DropForeignKey
ALTER TABLE `PagamentoFormaPagamento` DROP FOREIGN KEY `PagamentoFormaPagamento_pagamento_id_fkey`;

-- DropIndex
DROP INDEX `Pagamento_pedido_id_idx` ON `Pagamento`;

-- DropIndex
DROP INDEX `PagamentoFormaPagamento_forma_pagamento_id_fkey` ON `PagamentoFormaPagamento`;

-- AlterTable
ALTER TABLE `Mesa` DROP COLUMN `disponivel`;

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `Pagamento_pedido_id_fkey` FOREIGN KEY (`pedido_id`) REFERENCES `Pedido`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PagamentoFormaPagamento` ADD CONSTRAINT `PagamentoFormaPagamento_pagamento_id_fkey` FOREIGN KEY (`pagamento_id`) REFERENCES `Pagamento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PagamentoFormaPagamento` ADD CONSTRAINT `PagamentoFormaPagamento_forma_pagamento_id_fkey` FOREIGN KEY (`forma_pagamento_id`) REFERENCES `FormaPagamento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
