# QA Form Testing Setup Guide

## The Problem

The QA Form Testing screen needs **real database IDs** to work because:

1. `Loan.id` is an auto-increment integer in the database
2. `Verification.loanId` is a foreign key that MUST reference a real `Loan.id`
3. The backend validation requires these IDs to exist

## Solution Options

### ✅ **Option 1: Use an Existing Loan (RECOMMENDED for quick testing)**

1. **Find an existing loan ID from your database:**

```sql
-- Run this in your PostgreSQL database
SELECT id, "applicationNumber", "applicantName", "bankName"
FROM "Loan"
WHERE department = 'PD'
LIMIT 5;
```

This will show you available loan IDs. Pick one (e.g., ID = 3).

2. **Find the verification ID for that loan:**

```sql
-- Replace 3 with your actual loan ID
SELECT id, "loanId", type, status
FROM "Verification"
WHERE "loanId" = 3 AND type = 'Business';
```

3. **Update the QA screen with real IDs:**

Open `apps/mobile/src/screens/QAFormTesting.tsx` and update lines 218-219:

```typescript
verificationId: 3, // Replace with your real verification ID
loanId: 3, // Replace with your real loan ID
```

---

### ✅ **Option 2: Create a Dedicated QA Test Loan (RECOMMENDED for permanent setup)**

Run this SQL script to create a permanent QA test loan:

```sql
-- Step 1: Create a QA test loan
INSERT INTO "Loan" (
  "applicationNumber",
  "applicantName",
  "applicantMobile",
  "applicantAddress",
  "loanType",
  "bankName",
  "templateName",
  "loanAmount",
  status,
  department,
  "officeId",
  "createdAt",
  "updatedAt"
) VALUES (
  'QA-TEST-PERMANENT-001',
  'QA Test Applicant',
  '9999999999',
  'QA Test Address, Test City, Test State - 123456',
  'Business Loan',
  'Axis Bank', -- You can change this to match your test bank
  'Axis Bank',
  1000000,
  'Assigned',
  'PD',
  1, -- Replace with your actual office ID
  NOW(),
  NOW()
)
RETURNING id;

-- Step 2: Note the returned ID (let's say it's 999)
-- Step 3: Create a verification for this loan
INSERT INTO "Verification" (
  "loanId",
  type,
  "addressType",
  department,
  "fieldExecutiveId", -- Replace with your user ID
  status,
  "businessName",
  "templateName",
  "applicantAddress",
  "createdAt",
  "updatedAt"
) VALUES (
  999, -- Use the ID returned from Step 1
  'Business',
  'Business',
  'PD',
  1, -- Replace with your actual user ID
  'Pending',
  'QA Test Business',
  'Axis Bank',
  'QA Test Address, Test City, Test State - 123456',
  NOW(),
  NOW()
)
RETURNING id;

-- Step 4: Note the verification ID (let's say it's 888)
```

Then update `QAFormTesting.tsx`:

```typescript
verificationId: 888, // Use the ID from Step 4
loanId: 999, // Use the ID from Step 1
```

---

### 🔧 **Option 3: Make it Dynamic (BEST for long-term)**

Create a backend API endpoint to fetch or create QA test loans on-demand. This is more complex but cleaner.

---

## Quick Setup Steps (Using Option 1)

1. **Connect to your PostgreSQL database:**

```bash
# From your project root
docker exec -it kowtha-postgres-1 psql -U postgres -d kowtha_dev
```

2. **Find a loan ID:**

```sql
SELECT id FROM "Loan" WHERE department = 'PD' LIMIT 1;
```

Let's say it returns `id = 5`.

3. **Check if that loan has a Business verification:**

```sql
SELECT id FROM "Verification" WHERE "loanId" = 5 AND type = 'Business';
```

If it returns a verification ID (e.g., `id = 7`), great! If not, create one:

```sql
INSERT INTO "Verification" (
  "loanId", type, "addressType", department,
  "fieldExecutiveId", status, "createdAt", "updatedAt"
) VALUES (
  5, 'Business', 'Business', 'PD',
  1, 'Pending', NOW(), NOW()
)
RETURNING id;
```

4. **Update QA Screen:**

Edit `apps/mobile/src/screens/QAFormTesting.tsx` line 218-219:

```typescript
verificationId: 7, // Your verification ID
loanId: 5, // Your loan ID
```

5. **Rebuild the mobile app:**

```bash
cd apps/mobile
npm run android
```

6. **Test!**

Open the QA Form Testing screen, select a bank, load the form, fill it, and submit. It should work now!

---

## Checking IDs in Your Database

If you're not sure what IDs exist:

```sql
-- List all loans
SELECT id, "applicationNumber", "applicantName", "bankName", status
FROM "Loan"
ORDER BY id DESC
LIMIT 10;

-- List all verifications
SELECT v.id, v."loanId", v.type, v.status, l."applicationNumber"
FROM "Verification" v
JOIN "Loan" l ON v."loanId" = l.id
ORDER BY v.id DESC
LIMIT 10;
```

---

## Why This Happens

The database schema enforces referential integrity:

```prisma
model Verification {
  id       Int  @id @default(autoincrement())
  loanId   Int  // ← MUST be a real Loan.id
  loan     Loan @relation(fields: [loanId], references: [id])
  ...
}
```

Mock string IDs like `"qa-test-123"` won't work. You need real integer IDs from the database.

---

## Recommended Solution

For **quick testing now**: Use **Option 1** (5 minutes setup)

For **permanent QA setup**: Use **Option 2** (create dedicated QA loan)

For **production-ready**: Use **Option 3** (create backend API)

---

## Alternative: Test from Real Verifications

Instead of using the QA screen, you can:

1. Go to **Verification List** screen
2. Select any existing verification
3. Open the PD form for that verification
4. Test the forms there with real data

This way you're using real loan/verification IDs automatically!

---

_Created: 2025-10-11_  
_This is a temporary limitation of the QA testing setup and will be improved in future iterations._
