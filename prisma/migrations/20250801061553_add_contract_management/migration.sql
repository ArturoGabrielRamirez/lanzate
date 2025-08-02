-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'EXPIRED');

-- CreateTable
CREATE TABLE "contracts" (
    "id" SERIAL NOT NULL,
    "store_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "comments" TEXT,
    "status" "ContractStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER NOT NULL,
    "assigned_to" INTEGER,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_responses" (
    "id" SERIAL NOT NULL,
    "contract_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "status" "ContractStatus" NOT NULL,
    "comments" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contract_responses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_responses" ADD CONSTRAINT "contract_responses_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_responses" ADD CONSTRAINT "contract_responses_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
