-- DropForeignKey
ALTER TABLE "branches" DROP CONSTRAINT "branches_store_id_fkey";

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
