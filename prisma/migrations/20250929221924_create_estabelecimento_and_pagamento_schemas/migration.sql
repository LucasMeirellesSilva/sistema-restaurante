-- DropForeignKey
ALTER TABLE `item` DROP FOREIGN KEY `Item_produto_id_fkey`;

-- DropIndex
DROP INDEX `Item_produto_id_fkey` ON `item`;

-- AlterTable
ALTER TABLE `item` MODIFY `produto_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `mesa` ADD COLUMN `disponivel` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `Estabelecimento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `numero_mesas` INTEGER NOT NULL,
    `pergunta_seguranca` VARCHAR(191) NOT NULL,
    `resposta_seguranca` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Estabelecimento_cnpj_key`(`cnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FormaPagamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pagamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `valor` DECIMAL(10, 2) NOT NULL,
    `forma_pagamento_id` INTEGER NOT NULL,
    `pedido_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `Pagamento_forma_pagamento_id_fkey` FOREIGN KEY (`forma_pagamento_id`) REFERENCES `FormaPagamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `Pagamento_pedido_id_fkey` FOREIGN KEY (`pedido_id`) REFERENCES `Pedido`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_produto_id_fkey` FOREIGN KEY (`produto_id`) REFERENCES `Produto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
