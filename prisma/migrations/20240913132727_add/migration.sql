-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "director_name" VARCHAR(100),
ADD COLUMN     "tax_id" VARCHAR(20);

-- CreateTable
CREATE TABLE "users_companies" (
    "user_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "joined_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_companies_pkey" PRIMARY KEY ("user_id","company_id")
);

-- CreateTable
CREATE TABLE "passports" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "passport_number" VARCHAR(20) NOT NULL,
    "issue_date" DATE NOT NULL,
    "expiry_date" DATE NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "issued_by" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "passports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "passports_passport_number_key" ON "passports"("passport_number");

-- AddForeignKey
ALTER TABLE "users_companies" ADD CONSTRAINT "users_companies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_companies" ADD CONSTRAINT "users_companies_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "passports" ADD CONSTRAINT "passports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
