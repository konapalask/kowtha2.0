# QA Loan Creation - Complete Fix

## Issues Fixed

### 1. **Wrong API Endpoint**

- **Problem**: Was calling `/loans/qa-test-loan` but backend has global prefix `/api/`
- **Fix**: Endpoint is now `/api/loans/qa-test-loan` (handled automatically by axiosInstance)

### 2. **Wrong Port**

- **Problem**: Backend runs on port 3001, not 3000
- **Fix**: axiosInstance already configured with correct port from env

### 3. **Using fetch() instead of axios**

- **Problem**: User requested to always use axios, not native fetch
- **Fix**: Replaced `fetch()` with `axiosInstance.post()`

### 4. **Finding users by phone number**

- **Problem**: Service was looking up users by mobile number instead of using IDs
- **Fix**:
  - Frontend now passes `fieldExecutiveId` (logged-in user's ID)
  - Backend finds admin user by querying `DepartmentRole` table for `UserRole.Admin`
  - Uses proper Prisma relations

### 5. **Incorrect User Model References**

- **Problem**: Tried to access `user.role` and `user.officeId` which don't exist on User model
- **Fix**:
  - `role` is in `DepartmentRole` table (many-to-many relationship)
  - `officeId` doesn't exist on User - query `Office` table directly

## Changes Made

### Backend (`apps/backend/src/modules/loan/`)

#### `loan.service.ts` - `createQALoan` method

```typescript
async createQALoan(
  bankName: string,
  fieldExecutiveId: number,  // ✅ Changed from phone to ID
  qaData?: any
) {
  // ✅ Query DepartmentRole to find admin
  const adminDepartmentRole = await this.prisma.departmentRole.findFirst({
    where: { role: UserRole.Admin },
    include: { user: true },
  });

  const adminUser = adminDepartmentRole.user;

  // ✅ Verify field executive by ID
  const fieldExecutive = await this.prisma.user.findUnique({
    where: { id: fieldExecutiveId },
  });

  // ✅ Get first office in system
  const office = await this.prisma.office.findFirst();

  // Create loan with admin as initiator, field executive as assignee
  ...
}
```

#### `loan.controller.ts` - `createQATestLoan` endpoint

```typescript
@Post("qa-test-loan")
@Public()
async createQATestLoan(
  @Body("bankName") bankName: string,
  @Body("fieldExecutiveId") fieldExecutiveId: number,  // ✅ Changed from phone
  @Body("qaData") qaData?: any
) {
  const result = await this.loanService.createQALoan(
    bankName,
    fieldExecutiveId,
    qaData
  );
  return { status: 201, message: "QA test loan created successfully", data: result };
}
```

### Frontend (`apps/mobile/src/screens/QAFormTesting.tsx`)

1. **Added axiosInstance import**:

   ```typescript
   import axiosInstance from "../config/axios";
   ```

2. **Store logged-in user ID**:

   ```typescript
   const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

   useEffect(() => {
     const fetchUserDetails = async () => {
       const userDetails = await getItem("userDetails");
       if (userDetails?.id) {
         setLoggedInUserId(userDetails.id);
       }
     };
     fetchUserDetails();
   }, []);
   ```

3. **Use axios with user ID**:
   ```typescript
   const qaLoanResponse = await axiosInstance.post('/loans/qa-test-loan', {
     bankName: selectedBank,
     fieldExecutiveId: loggedInUserId,  // ✅ Send user ID, not phone
     qaData: { ... },
   });
   ```

## Testing

### 1. Restart Backend (if not already done)

```bash
cd /Users/shashank/projects/kowtha/apps/backend
npm run start:dev
```

### 2. Test API Directly (Optional)

Replace `<field_executive_id>` with actual ID from database (e.g., 29):

```bash
curl -X POST http://localhost:3001/api/loans/qa-test-loan \
  -H "Content-Type: application/json" \
  -d '{
    "bankName": "RBL",
    "fieldExecutiveId": 29
  }'
```

**Expected**: 201 response with loan and verification data

### 3. Test in Mobile App

1. Make sure you're logged in as a field executive
2. Go to QA Testing screen
3. Select a bank (e.g., RBL)
4. Monitor logs: `./capture-android-logs.sh`

**Expected logs**:

```
🔵 QA LOAN CREATION: Calling API
🔵 Request body: { bankName: 'RBL', fieldExecutiveId: 29 }
🔵 QA LOAN RESPONSE STATUS: 201
✅ QA LOAN RESPONSE DATA: { ... }
Toast: QA Loan Created ✓
```

## Key Improvements

1. ✅ Uses proper database schema relationships
2. ✅ Uses axios (not fetch) for consistency
3. ✅ Uses user IDs (not phone numbers) as primary identifiers
4. ✅ Follows existing loan creation patterns in the codebase
5. ✅ Properly handles authentication with `@Public()` decorator
6. ✅ Finds admin user dynamically from database (not hardcoded)

## Database Schema Reference

```
User (id, name, mobile, ...)
  ↓
DepartmentRole (userId, department, role)  ← Admin role is here
  ↓
Loan (id, operationsExecutiveId → User, officeId → Office)
  ↓
Verification (id, loanId, fieldExecutiveId → User)
```

Admin user initiates the loan, field executive is assigned to the verification.
