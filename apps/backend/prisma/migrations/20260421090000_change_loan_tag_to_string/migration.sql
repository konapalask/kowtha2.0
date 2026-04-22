-- Convert loanTag from enum LoanTag ('PD', 'LIP') to free-text VARCHAR(20).
-- Existing enum values are preserved verbatim via the ::text cast.
ALTER TABLE "Loan" ALTER COLUMN "loanTag" TYPE VARCHAR(20) USING "loanTag"::text;

-- Drop the now-unused enum type.
DROP TYPE "LoanTag";
