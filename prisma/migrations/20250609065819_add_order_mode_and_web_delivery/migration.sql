-- AlterEnum
ALTER TYPE "DeliveryMethod" ADD VALUE 'WEB_DELIVERY';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "mode" TEXT NOT NULL DEFAULT 'web';
