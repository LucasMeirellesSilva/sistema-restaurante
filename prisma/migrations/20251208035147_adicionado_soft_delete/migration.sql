/*
  Warnings:

  - Made the column `produto_id` on table `item` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_produto_id_fkey`;

-- DropIndex
DROP INDEX `Item_produto_id_fkey` ON `Item`;

-- AlterTable
ALTER TABLE `Categoria` ADD COLUMN `deletado_em` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Cliente` ADD COLUMN `deletado_em` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Item` MODIFY `produto_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Produto` ADD COLUMN `deletado_em` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Usuario` ADD COLUMN `deletado_em` DATETIME(3) NULL;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_produto_id_fkey` FOREIGN KEY (`produto_id`) REFERENCES `Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
