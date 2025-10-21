# QA Form Testing - Error Handling & Auto Loan Creation Fix

## Issues Fixed

### 1. ✅ Frontend Crash on 500 Errors

**Problem**: The axios interceptor wasn't handling 500 errors gracefully, causing the app to crash instead of showing user-friendly error messages.

**Root Cause**:

- Axios interceptor only handled 401 errors
- No catch for 500+ server errors
- Unsafe property access (error.config instead of error?.config)

**Solution**:

```typescript
// Handle 500 errors gracefully - just reject, don't crash
if (errorStatusCode >= 500) {
  console.error("Server error:", error?.response?.data);
  return Promise.reject(error);
}

// Handle network errors
if (!error.response) {
  console.error("Network error:", error.message);
  return Promise.reject(error);
}
```

**Files Modified**:

- `apps/mobile/src/config/axios.ts`

---

### 2. ✅ Better Error Messages in QA Form

**Problem**: Line 561 in QAFormTesting was just showing generic "Failed to submit form data" without details.

**Solution**: Enhanced error extraction to show meaningful backend error messages:

```typescript
const errorMessage =
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Failed to submit form data";

const errorStatus = error?.response?.status;

Toast.show({
  type: "error",
  text1: errorStatus ? `Error ${errorStatus}` : "Submission Error",
  text2: errorMessage,
  visibilityTime: 5000,
});
```

**Files Modified**:

- `apps/mobile/src/screens/QAFormTesting.tsx`

---

### 3. ✅ Auto-Create QA Loans on Bank Selection

**Problem**: Backend error "Verification not found or not assigned to this field executive" because no loan existed for the QA test.

**Solution**: Created a complete auto-loan creation system:

#### Backend - New QA Loan Creation Endpoint

Created `/loans/qa-test-loan` endpoint that:

1. Finds field executive by phone number (9912994742)
2. Auto-creates a loan with QA test data
3. Creates a PD verification assigned to the user
4. Returns loan and verification IDs

**New Files**:

- `apps/backend/src/modules/loan/dto/create-qa-loan.dto.ts`

**Modified Files**:

- `apps/backend/src/modules/loan/loan.service.ts` - Added `createQALoan()` method
- `apps/backend/src/modules/loan/loan.controller.ts` - Added `@Post("qa-test-loan")` endpoint

#### Frontend - Auto-Call QA Loan Endpoint

Enhanced `loadForm()` in QAFormTesting to:

1. Call backend to create QA loan when bank is selected
2. Use real loan ID and verification ID from response
3. Fall back to mock data if creation fails (graceful degradation)

**Flow**:

```
1. User selects bank → Click "Load Form"
2. Frontend calls POST /loans/qa-test-loan with:
   - bankName: "RBL"
   - fieldExecutivePhone: "9912994742"
   - qaData: {applicantName, address, loanAmount, etc.}
3. Backend creates:
   - Loan with real ID (e.g., 42)
   - Verification with real ID (e.g., 123)
   - Assigns to user with phone 9912994742
4. Frontend receives loan and verification IDs
5. Uses real IDs for form submission ✅
```

**Files Modified**:

- `apps/mobile/src/screens/QAFormTesting.tsx`

---

## API Endpoint Details

### POST `/loans/qa-test-loan`

**Request**:

```json
{
  "bankName": "RBL",
  "fieldExecutivePhone": "9912994742",
  "qaData": {
    "applicantName": "Rahul Kumar",
    "applicantMobile": "9876543210",
    "applicantAddress": "123 MG Road, Mumbai - 400001",
    "loanAmount": 1000000,
    "loanType": "Business Loan"
  }
}
```

**Response**:

```json
{
  "status": 201,
  "message": "QA test loan created successfully",
  "data": {
    "loan": {
      "id": 42,
      "applicationNumber": "QA-RBL-1728654123000",
      "applicantName": "Rahul Kumar",
      "bankName": "RBL",
      "loanAmount": 1000000,
      "status": "Assigned"
    },
    "verification": {
      "id": 123,
      "loanId": 42,
      "type": "Business",
      "status": "Pending",
      "addressType": "BusinessAddress"
    }
  }
}
```

---

## User Experience Flow

### Before Fix ❌

```
1. Select bank → Load Form
2. Fill data → Submit
3. Backend: "Verification not found" ❌
4. Frontend: Crashes or shows generic error ❌
```

### After Fix ✅

```
1. Select bank → Click "Load Form"
2. Toast: "Creating QA Test Loan..."
3. Backend creates loan automatically
4. Toast: "QA Loan Created ✓ | Loan #42"
5. Form loads with faker data
6. Fill remaining fields → Submit
7. Backend: ✅ Success (real loan ID)
8. Toast: "QA Test Form submitted successfully!"
```

---

## Technical Details

### Service Method (loan.service.ts)

```typescript
async createQALoan(bankName: string, fieldExecutivePhone: string, qaData?: any) {
  // Find field executive by phone
  const fieldExecutive = await this.prisma.user.findFirst({
    where: { phone: fieldExecutivePhone },
  });

  // Create loan
  const loan = await prisma.loan.create({
    data: {
      applicationNumber: `QA-${bankName}-${timestamp}`,
      applicantName: qaData?.applicantName,
      bankName: bankName,
      loanAmount: qaData?.loanAmount || 1000000,
      status: LoanStatus.Assigned,
      department: Department.PD,
    },
  });

  // Create verification
  const verification = await prisma.verification.create({
    data: {
      loan: { connect: { id: loan.id } },
      type: VerificationType.Business,
      fieldExecutive: { connect: { id: fieldExecutive.id } },
      status: VerificationStatus.Pending,
    },
  });

  return { loan, verification };
}
```

### Controller Endpoint (loan.controller.ts)

```typescript
@Post("qa-test-loan")
@All()
async createQATestLoan(
  @Body("bankName") bankName: string,
  @Body("fieldExecutivePhone") fieldExecutivePhone: string,
  @Body("qaData") qaData?: any,
) {
  const result = await this.loanService.createQALoan(
    bankName,
    fieldExecutivePhone,
    qaData
  );
  return {
    status: 201,
    message: "QA test loan created successfully",
    data: result,
  };
}
```

---

## Error Handling Improvements

### Axios Interceptor

- ✅ Handles 500+ errors gracefully
- ✅ Handles network errors
- ✅ Safe property access with optional chaining
- ✅ Better error logging for debugging

### QA Form Testing

- ✅ Extracts specific error messages from backend
- ✅ Shows error status code (e.g., "Error 500")
- ✅ 5-second toast visibility for errors
- ✅ Graceful fallback if QA loan creation fails

---

## Testing Instructions

1. **Ensure user 9912994742 exists in the database**

   ```sql
   SELECT id, phone, name FROM "User" WHERE phone = '9912994742';
   ```

2. **Test QA Form Flow**:

   - Open mobile app
   - Go to Verification List
   - Click orange QA button (FAB)
   - Select "RBL" from dropdown
   - Click "Load Form"
   - Watch toasts:
     - "Creating QA Test Loan..."
     - "QA Loan Created ✓ | Loan #XX"
   - Verify form loads with faker data
   - Submit form
   - Should succeed! ✅

3. **Check Database**:

   ```sql
   SELECT * FROM "Loan" WHERE applicationNumber LIKE 'QA-RBL%' ORDER BY id DESC LIMIT 1;
   SELECT * FROM "Verification" WHERE loanId = (last loan id);
   ```

4. **Test Error Handling**:
   - Stop backend
   - Try to load form
   - Should show: "Using Mock Data | Could not create real loan, using test IDs"
   - Frontend should not crash ✅

---

## Benefits

1. **No Manual Loan Creation** - Loans auto-create on demand
2. **Real End-to-End Testing** - Uses actual loan/verification IDs
3. **Better Error Messages** - Shows what actually went wrong
4. **No More Crashes** - Graceful error handling everywhere
5. **Fast QA Workflow** - One click to set up everything
6. **User-Specific** - Always assigned to correct tester (9912994742)

---

## Files Changed Summary

### Backend

1. ✅ `apps/backend/src/modules/loan/dto/create-qa-loan.dto.ts` - NEW
2. ✅ `apps/backend/src/modules/loan/loan.service.ts` - Added createQALoan method
3. ✅ `apps/backend/src/modules/loan/loan.controller.ts` - Added qa-test-loan endpoint

### Frontend

1. ✅ `apps/mobile/src/config/axios.ts` - Enhanced error handling
2. ✅ `apps/mobile/src/screens/QAFormTesting.tsx` - Auto loan creation + better errors

---

**Status**: ✅ COMPLETE - Ready for testing  
**Date**: October 11, 2025  
**Impact**: Eliminates manual QA loan setup and prevents app crashes from server errors
