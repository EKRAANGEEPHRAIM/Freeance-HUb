-- Le numéro de facture devient unique par freelance (contrôlé dans InvoicesService),
-- et non plus dans toute l'application.
DROP INDEX IF EXISTS "Invoice_number_key";

CREATE INDEX IF NOT EXISTS "Invoice_number_idx" ON "Invoice"("number");
