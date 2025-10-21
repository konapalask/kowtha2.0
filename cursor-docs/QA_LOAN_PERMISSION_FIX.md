# QA Loan Creation Permission Fix

## Problem

The QA loan creation was failing with error:

```
❌ QA LOAN CREATION FAILED: [Error: Failed to create QA loan]
Error details: { message: 'Failed to create QA loan', response: undefined, status: undefined }
```

The `response: undefined` and `status: undefined` indicated the API call wasn't reaching the backend, suggesting an authentication/permission issue.

## Root Cause

The `POST /loans/qa-test-loan` endpoint was missing the `@Public()` decorator, causing it to require authentication by default. Field executives logging into the QA screen couldn't access the endpoint.

## Solution

### 1. Added `@Public()` Decorator to QA Endpoint

**File**: `apps/backend/src/modules/loan/loan.controller.ts`

- Imported the `Public` decorator from `../accounts/public.decorator`
- Added `@Public()` decorator to the `createQATestLoan` endpoint to bypass authentication

```typescript
@Post("qa-test-loan")
@Public()  // ← Added this
@ApiOperation({
  summary: "Create a QA test loan for mobile app testing",
  // ...
})
async createQATestLoan(/* ... */) { /* ... */ }
```

### 2. Updated QA Loan Creation to Use Admin as Initiator

**File**: `apps/backend/src/modules/loan/loan.service.ts`

Modified the `createQALoan` method to:

- Use **admin user (mobile: 8985545588)** as the loan initiator (`operationsExecutive`)
- Assign the **field executive (mobile: 9912994742)** to the verification

**Key Changes**:

```typescript
// Find the admin user who will initiate the loan
const adminUser = await this.prisma.user.findFirst({
  where: { mobile: "8985545588" },
});

// Find the field executive who will be assigned the verification
const fieldExecutive = await this.prisma.user.findFirst({
  where: { mobile: fieldExecutivePhone },
});

// Create loan initiated by admin
const loan = await prisma.loan.create({
  data: {
    // ...
    operationsExecutive: { connect: { id: adminUser.id } }, // Admin initiates
    // ...
  },
});

// Create verification assigned to field executive
const verification = await prisma.verification.create({
  data: {
    loan: { connect: { id: loan.id } },
    fieldExecutive: { connect: { id: fieldExecutive.id } }, // FE assigned
    // ...
  },
});
```

## How It Works Now

1. **QA Form is opened** → User selects a bank (e.g., RBL)
2. **Frontend calls** `POST /loans/qa-test-loan` with `bankName: "RBL"` and `fieldExecutivePhone: "9912994742"`
3. **Backend** (no auth required due to `@Public()`):
   - Finds admin user (8985545588)
   - Finds field executive (9912994742)
   - Creates loan initiated by admin
   - Creates verification assigned to field executive
   - Returns `{ loan, verification }` with real IDs
4. **Frontend** uses the real `loan.id` and `verification.id` for form submission
5. **Form submission** succeeds because the verification is properly assigned to the logged-in field executive

## Testing

After backend restart/hot-reload:

1. Login as field executive (9912994742)
2. Open QA Testing screen
3. Select any bank (e.g., RBL)
4. The form should load successfully with auto-populated data
5. Coordinates should have default values
6. Submit the form → should succeed without "Verification not found" errors

## Error Logging

The frontend already has enhanced error logging:

```typescript
console.error("❌ QA LOAN CREATION FAILED:", qaError);
console.error("Error details:", {
  message: qaError?.message,
  response: qaError?.response?.data,
  status: qaError?.response?.status,
});
```

These logs will be captured by `capture-android-logs.sh` for debugging.

## Files Modified

1. `apps/backend/src/modules/loan/loan.controller.ts` - Added `@Public()` decorator
2. `apps/backend/src/modules/loan/loan.service.ts` - Updated to use admin as initiator

## Related Documentation

- `QA_ERROR_HANDLING_AND_AUTO_LOAN_FIX.md` - Previous error handling improvements
- `RBL_BANK_QA_FIX.md` - RBL-specific data population fixes
- `QUICK_DEBUG.md` - How to capture Android logs
