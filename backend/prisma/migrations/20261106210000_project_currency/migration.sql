-- Devise des projets (et de leurs factures) : franc CFA par défaut
CREATE TYPE "Currency" AS ENUM ('XOF', 'EUR');

ALTER TABLE "Project" ADD COLUMN "currency" "Currency" NOT NULL DEFAULT 'XOF';

-- Les projets existants avaient leurs montants en euros
UPDATE "Project" SET "currency" = 'EUR';
