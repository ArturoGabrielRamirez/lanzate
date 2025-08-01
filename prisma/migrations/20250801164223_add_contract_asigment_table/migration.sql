/*
  Warnings:

  - You are about to drop the column `assigned_to` on the `contracts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_assigned_to_fkey";

-- AlterTable
ALTER TABLE "contract_responses" ADD COLUMN     "assignment_id" INTEGER;

-- AlterTable
ALTER TABLE "contracts" DROP COLUMN "assigned_to";

-- CreateTable
CREATE TABLE "contract_assignments" (
    "id" SERIAL NOT NULL,
    "contract_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ContractStatus" NOT NULL DEFAULT 'PENDING',
    "assigned_by" INTEGER NOT NULL,

    CONSTRAINT "contract_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contract_assignments_contract_id_employee_id_key" ON "contract_assignments"("contract_id", "employee_id");

-- AddForeignKey
ALTER TABLE "contract_assignments" ADD CONSTRAINT "contract_assignments_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_assignments" ADD CONSTRAINT "contract_assignments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_assignments" ADD CONSTRAINT "contract_assignments_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_responses" ADD CONSTRAINT "contract_responses_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "contract_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
