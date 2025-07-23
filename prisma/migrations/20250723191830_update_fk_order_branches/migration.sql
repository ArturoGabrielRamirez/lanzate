-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_branch_id_fkey";

-- AlterTable
ALTER TABLE "branches" ADD COLUMN     "is_main" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "branch_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
