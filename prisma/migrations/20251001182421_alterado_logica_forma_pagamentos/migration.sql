/*
  Warnings:

  - You are about to drop the column `forma_pagamento_id` on the `pagamento` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `pagamento` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `pagamento` DROP FOREIGN KEY `Pagamento_forma_pagamento_id_fkey`;

-- DropIndex
DROP INDEX `Pagamento_forma_pagamento_id_fkey` ON `pagamento`;

-- AlterTable
ALTER TABLE `pagamento` DROP COLUMN `forma_pagamento_id`,
    DROP COLUMN `valor`;

-- CreateTable
CREATE TABLE `PagamentoFormaPagamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `valor` DECIMAL(10, 2) NOT NULL,
    `pagamento_id` INTEGER NOT NULL,
    `forma_pagamento_id` INTEGER NOT NULL,

    INDEX `PagamentoFormaPagamento_pagamento_id_idx`(`pagamento_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PagamentoFormaPagamento` ADD CONSTRAINT `PagamentoFormaPagamento_pagamento_id_fkey` FOREIGN KEY (`pagamento_id`) REFERENCES `Pagamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PagamentoFormaPagamento` ADD CONSTRAINT `PagamentoFormaPagamento_forma_pagamento_id_fkey` FOREIGN KEY (`forma_pagamento_id`) REFERENCES `FormaPagamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `Pagamento_pedido_id_idx` ON `Pagamento`(`pedido_id`);
ALTER TABLE `pagamento` DROP FOREIGN KEY `Pagamento_pedido_id_fkey`;
