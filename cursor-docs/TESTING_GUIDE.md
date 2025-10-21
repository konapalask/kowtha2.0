# Testing Guide - Schema-Driven PD Forms

## Quick Start Testing

### 1. Backend API Testing

Test the enhanced schema endpoint:

```bash
# Get list of all supported banks
curl http://localhost:3000/api/loans/banks

# Get schema for a specific bank
curl http://localhost:3000/api/loans/get-bank-forms?bankName=RBL

# Expected response structure:
{
  "status": 200,
  "message": "Bank forms fetched successfully",
  "data": {
    "bankName": "RBL",
    "schema": {
      "id": 6,
      "bankName": "RBL",
      "sections": [...]
    },
    "metadata": {
      "verifierFields": ["financialAnalysis", "synopsis", "path", "approvedStatus", "comments"],
      "hasCustomTemplate": true,
      "sectionIds": ["caseDetails", "businessOwnerDetails", ...]
    }
  }
}
```

### 2. Web Application Testing

#### Test Dynamic Form Loading

1. Navigate to: `/test-dynamic-form`
2. Select a bank from the dropdown
3. Verify:
   - Schema loads successfully
   - Form fields render correctly
   - Validation works
   - Sample data populates

#### Test BusinessVerificationDetails

1. Create a test PD loan for any bank
2. Assign to field executive
3. On mobile, fill and submit the form
4. On web, navigate to verification details
5. Verify:
   - All sections display correctly
   - Financial analysis form appears
   - Synopsis editor works
   - Approval workflow functions

### 3. Mobile Application Testing

#### Test Schema Loading

1. Create a PD loan for any bank
2. Assign to your test field executive account
3. Open mobile app and sync
4. Open the PD form
5. Verify:
   - Form loads from backend
   - All field types render:
     - Text inputs
     - Number inputs
     - Date pickers
     - Dropdowns (enum)
     - Nested objects
     - Array fields (repeatable sections)
   - Validation works
   - Data submits successfully

### 4. PDF Generation Testing

#### Test Generic Template

```bash
# Generate preview PDF for a loan
curl http://localhost:3000/api/loans/{loanId}/preview-final-report?type=Business&department=PD
```

Verify in generated PDF:

- All sections appear
- Field labels are correct
- Array data renders as tables
- Financial analysis section appears (if added)
- Synopsis and recommendation appear
- Images and signature included

## Bank-Specific Testing Checklist

### Priority 1 Banks (Must Test First)

#### RBL (Custom Template)

- [ ] Mobile: Form loads and submits
- [ ] Web: Data displays correctly
- [ ] PDF: Custom template generates correctly
- [ ] All sections match expected RBL format

#### Axis Bank (Custom Template)

- [ ] Mobile: Form loads and submits
- [ ] Web: Data displays correctly
- [ ] PDF: Custom template generates correctly

### Priority 2 Banks (Generic Template)

#### Axis Finance UBL Above 10L

- [ ] Mobile: All sections render
  - [ ] Basic Details
  - [ ] Family Details
  - [ ] Shareholding Details
  - [ ] Business Details
  - [ ] Suppliers/Creditors
  - [ ] Clients/Debtors
  - [ ] Expenditure
  - [ ] Asset Details
  - [ ] Loan Details
  - [ ] Banking Details
  - [ ] Third Party Check
- [ ] Web: All sections display
- [ ] PDF: Generic template renders all sections

#### Tata UBL

- [ ] Mobile: Form loads with nested objects
  - [ ] Repayment From (object field)
  - [ ] Family Details (array)
  - [ ] Business Details (array)
  - [ ] Liabilities (array)
- [ ] Web: Nested structures display correctly
- [ ] PDF: Complex structures render properly

#### Arka Fincap

- [ ] Test complete flow
- [ ] Verify array fields render correctly
- [ ] Check PDF generation

### Priority 3 Banks (Spot Check)

Test 3-5 additional banks randomly to ensure generic template works universally:

- [ ] Hero Fincorp
- [ ] ICICI
- [ ] IDFC HL & ML
- [ ] IIFL
- [ ] Niwas Salaried

## Field Type Testing

### Text Fields

- [ ] Single-line text renders
- [ ] TextArea (for descriptions) renders
- [ ] Validation (required) works
- [ ] Read-only fields display correctly

### Number Fields

- [ ] Integer inputs work
- [ ] Decimal inputs work
- [ ] Numeric keyboard shows (mobile)
- [ ] Formatting displays correctly

### Date Fields

- [ ] Date picker appears
- [ ] Date format (DD-MM-YYYY) correct
- [ ] Past dates accepted
- [ ] Displays correctly in PDF

### Dropdown/Select Fields

- [ ] Options populate from enum
- [ ] Selection works
- [ ] Selected value displays
- [ ] PDF shows selected value

### Boolean Fields

- [ ] Checkbox/toggle renders (mobile)
- [ ] Switch renders (web)
- [ ] True/False or Yes/No display
- [ ] PDF shows Yes/No correctly

### Array Fields (Repeatable Sections)

- [ ] "Add" button appears
- [ ] Can add multiple items
- [ ] Can remove items
- [ ] Each item has all fields
- [ ] Data saves correctly
- [ ] Displays as table in PDF

### Object Fields (Nested Sections)

- [ ] Nested fields group together
- [ ] Visual distinction from parent
- [ ] All subfields accessible
- [ ] Data structure correct in DB

## Workflow Testing

### Complete Field Operator Flow

1. **Loan Creation** (Operations Executive)

   - [ ] Create loan with bank name
   - [ ] Assign to field executive

2. **Mobile Data Entry** (Field Executive)

   - [ ] Receive loan assignment
   - [ ] Open PD form
   - [ ] Schema loads from backend
   - [ ] Fill all required fields
   - [ ] Upload photos
   - [ ] Submit successfully
   - [ ] Data syncs to backend

3. **Verification** (Verifier - Web)

   - [ ] View submitted data (read-only)
   - [ ] All fields display correctly
   - [ ] Add financial analysis
   - [ ] Write synopsis
   - [ ] Approve/Reject
   - [ ] Data saves

4. **PDF Generation** (Backend)
   - [ ] Preview PDF
   - [ ] All sections appear
   - [ ] Generate final report
   - [ ] Download successful

### Edit Request Flow

1. **Request Edit** (Verifier)

   - [ ] Request edit for specific section
   - [ ] Field executive receives notification

2. **Make Changes** (Field Executive - Mobile)

   - [ ] See edit request
   - [ ] Modify data
   - [ ] Resubmit

3. **Review Changes** (Verifier)
   - [ ] See updated data
   - [ ] Approve changes
   - [ ] Complete verification

## Error Handling Testing

### Backend Errors

- [ ] Invalid bank name returns 400
- [ ] Schema not found returns 404
- [ ] Network errors handled gracefully

### Mobile Errors

- [ ] Offline mode shows error message
- [ ] Failed schema load shows retry option
- [ ] Invalid data shows validation errors

### Web Errors

- [ ] Failed schema fetch shows error
- [ ] Network errors display user-friendly message
- [ ] Form submission errors handled

## Performance Testing

### Schema Loading

- [ ] First load takes < 2 seconds
- [ ] Cached schemas load instantly
- [ ] Large schemas (10+ sections) load smoothly

### Form Rendering

- [ ] Forms with 50+ fields render in < 1 second
- [ ] Array sections add items quickly
- [ ] No lag when typing

### PDF Generation

- [ ] Simple PDFs (< 5 sections) generate in < 5 seconds
- [ ] Complex PDFs (10+ sections) generate in < 10 seconds
- [ ] Large PDFs with images generate in < 15 seconds

## Regression Testing

### Existing Functionality

- [ ] FI (Field Investigation) forms still work
- [ ] Loan management unchanged
- [ ] User management unchanged
- [ ] Dashboard works
- [ ] Reports generate correctly

### Legacy Banks (RBL, Axis)

- [ ] Custom templates still work
- [ ] No breaking changes
- [ ] PDFs match previous format

## Browser/Device Testing

### Web Browsers

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Devices

- [ ] Android 10+
- [ ] iOS 13+
- [ ] Different screen sizes
- [ ] Tablet view

## Data Validation Testing

### Required Fields

- [ ] Cannot submit without required fields
- [ ] Error messages display
- [ ] Highlights missing fields

### Field Formats

- [ ] Phone numbers: 10 digits
- [ ] Email: valid format
- [ ] Numbers: only numeric
- [ ] Dates: valid dates only

### Data Consistency

- [ ] Data saved matches data submitted
- [ ] No data loss on page refresh
- [ ] Backend data matches mobile submission
- [ ] PDF data matches backend data

## Security Testing

### Authorization

- [ ] Field executives can only see assigned loans
- [ ] Verifiers can only access loans in their office
- [ ] Operations executives have proper access

### Data Protection

- [ ] Sensitive data not exposed in URLs
- [ ] API requires authentication
- [ ] File uploads sanitized

## Automated Testing Commands

```bash
# Backend unit tests
cd apps/backend
npm test

# Web integration tests
cd apps/web
npm test

# Mobile tests
cd apps/mobile
npm test

# E2E tests (if available)
npm run test:e2e
```

## Issue Reporting Template

If you find any issues during testing, report using this format:

```markdown
**Bank Name:** RBL
**Platform:** Mobile / Web / Backend
**Issue:** Brief description
**Steps to Reproduce:**

1.
2.
3.

**Expected:** What should happen
**Actual:** What actually happened
**Screenshots:** (if applicable)
**Priority:** High / Medium / Low
```

## Success Criteria

The refactoring is considered successful when:

✅ All 27 banks load schemas from backend
✅ Mobile forms render correctly for all banks
✅ Web verification displays all data properly
✅ PDFs generate for all banks (custom or generic)
✅ No data loss in migration
✅ Performance is equal or better than before
✅ All existing workflows continue to function
✅ No breaking changes for users
✅ Zero hardcoded forms remain
✅ New banks can be added by schema file only

## Test Reporting

Create a test report in the following format:

| Bank Name | Mobile | Web | PDF | Status | Notes                  |
| --------- | ------ | --- | --- | ------ | ---------------------- |
| RBL       | ✅     | ✅  | ✅  | Pass   | Custom template works  |
| Axis Bank | ✅     | ✅  | ✅  | Pass   | Custom template works  |
| Tata UBL  | ✅     | ✅  | ✅  | Pass   | Generic template works |
| ...       |        |     |     |        |                        |

Status: Pass / Fail / Blocked
