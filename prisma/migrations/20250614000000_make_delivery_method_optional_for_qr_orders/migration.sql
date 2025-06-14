-- AlterTable
ALTER TABLE "order" ALTER COLUMN "deliveryMethod" DROP NOT NULL;
ALTER TABLE "order" ALTER COLUMN "deliveryMethod" DROP DEFAULT;
