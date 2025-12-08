/*
  Warnings:

  - Made the column `produto_id` on table `item` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `item` DROP FOREIGN KEY `Item_produto_id_fkey`;

-- DropIndex
DROP INDEX `Item_produto_id_fkey` ON `item`;

-- AlterTable
ALTER TABLE `categoria` ADD COLUMN `deletado_em` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `cliente` ADD COLUMN `deletado_em` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `item` MODIFY `produto_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `produto` ADD COLUMN `deletado_em` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `deletado_em` DATETIME(3) NULL;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_produto_id_fkey` FOREIGN KEY (`produto_id`) REFERENCES `Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
