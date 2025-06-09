/*
  Warnings:

  - You are about to drop the column `mode` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentDate` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[webOrderId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Made the column `customerName` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `customerEmail` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `customerPhone` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "mode",
ALTER COLUMN "deliveryMethod" SET DEFAULT 'PICKUP',
ALTER COLUMN "customerName" SET NOT NULL,
ALTER COLUMN "customerEmail" SET NOT NULL,
ALTER COLUMN "customerPhone" SET NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "paymentDate",
ADD COLUMN     "webOrderId" TEXT,
ALTER COLUMN "orderId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "WebOrder" (
    "id" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "deliveryMethod" "DeliveryMethod" NOT NULL DEFAULT 'PICKUP',
    "deliveryAddress" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebOrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "size" TEXT,
    "milk" TEXT,
    "drink" TEXT,
    "toppings" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_webOrderId_key" ON "Payment"("webOrderId");

-- AddForeignKey
ALTER TABLE "WebOrderItem" ADD CONSTRAINT "WebOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "WebOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebOrderItem" ADD CONSTRAINT "WebOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_webOrderId_fkey" FOREIGN KEY ("webOrderId") REFERENCES "WebOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
