# Arka Fincap Interface Documentation

## Overview
TypeScript interface definition for Arka Fincap verification data structure.

**File:** `apps/backend/src/modules/loan/templates/PD/interface/arka-fincap.interface.ts`

## Interface: `ArkaFincapInterface`

### Structure Overview

The interface defines the complete data structure for Arka Fincap loan verification forms with 24 main sections plus uploaded items.

## Section Breakdown

### 1. Applicant Details
**Type:** Object with 16 properties

| Property | Type | Description |
|----------|------|-------------|
| `applicationNo` | string | Application number |
| `nameOfApplicant` | string | Primary applicant name |
| `nameOfCoApplicant` | string | Co-applicant name |
| `phoneNumber` | number | Contact number |
| `nameOfConcern` | string | Business/concern name |
| `initiatedPremises` | string | Initiated premises address |
| `visitedPremises` | string | Visited premises address |
| `residentialPremises` | string | Residential premises address |
| `appointmentFixed` | string | Appointment time |
| `dateOfVisit` | string | Date of visit |
| `personMet` | string | Person met during visit |
| `amountAndPurposeOfLoan` | string | Loan amount and purpose |
| `typeOfCollateral` | string | Collateral type |
| `marketValueOfCollateral` | string | Collateral market value |
| `collateralPropertyAddress` | string | Collateral property address |
| `aboutTheApplicant` | string | Applicant information |

### 2. Family Members
**Type:** Object containing array

```typescript
familyMembers: {
  name: string;
  relationship: string;
  age: number;
  education: string;
  occupation: string;
}[]
```

### 3. Banking Details
**Type:** Object containing array

```typescript
bankingDetails: {
  bankName: string;
  accountType: string;       // "Savings", "Current", "CC/OD"
  avgBalance: number;         // Formatted with Indian numbering
  noOfYearsMaintained: number;
}[]
```

### 4. LIC/Mutual Funds
**Type:** Object with string property

```typescript
licMutualFunds: {
  licMutualFunds: string;
}
```

### 5. Assets
**Type:** Object containing array

```typescript
assets: {
  description: string;
  area: string;
  marketValue: number;        // Formatted with Indian numbering
  nameOfAssetHolder: string;
}[]
```

### 6. Existing Loans
**Type:** Object containing array

```typescript
loans: {
  bank: string;
  type: string;
  loanAmount: number;         // Formatted with Indian numbering
  emi: number;                // Formatted with Indian numbering
  status: string;             // "Open" or "Close"
}[]
```

### 7. About the Business
**Type:** Array of strings

```typescript
aboutTheBusiness: string[]
```

### 8. Regular Customers
**Type:** Object containing array

```typescript
customers: {
  name: string;
  contactNumber: number;
}[]
```

### 9. Regular Suppliers
**Type:** Object containing array

```typescript
suppliers: {
  name: string;
  contactNumber: number;
}[]
```

### 10. Business Activity Observed
**Type:** Object with string property

```typescript
businessActivityObserved: {
  businessActivityAndStockLevelObserved: string;
}
```

### 11. Documents Observed
**Type:** Object with string property

```typescript
documentsObserved: {
  documentsObserved: string;
}
```

### 12. GST Registration
**Type:** Object with string property

```typescript
gstRegistration: {
  gstRegistered: string;
}
```

### 13. ITR Details
**Type:** Object with string property

```typescript
itrDetails: {
  itrFiled: string;
}
```

### 14-17. Financial Details
**Type:** Objects with number properties

```typescript
monthlyGrossReceipts: { monthlyGrossReceipts: number }  // Indian formatted
monthlyExpenses: { monthlyExpenses: number }            // Indian formatted
netProfit: { netProfit: number }                        // Indian formatted
netMargin: { netMargin: number }
```

### 18. Family Expenses
**Type:** Object with string property

```typescript
familyExpenses: {
  familyExpenses: string;
}
```

### 19. Employees
**Type:** Object with number property

```typescript
employees: {
  numberOfEmployees: number;
}
```

### 20-22. Additional Details (Array of Strings)
**Type:** Arrays of strings

```typescript
concerns: string[]
otherObservations: string[]
otherIncomes: string[]
```

### 23. Neighbor Check
**Type:** Object with string property

```typescript
neighborCheck: {
  neighborCheck: string;
}
```

### 24. Status
**Type:** Object with string property

```typescript
status: {
  status: string;
}
```

### 25. Uploaded Items
**Type:** Array of objects

```typescript
uploadedItems: {
  id: string;
  uri: string;
  type: string;
  pincode: string;
  isCamera: boolean;
  latitude: number;
  locality: string;
  longitude: number;
  timestamp: string;
  s3ImageUrl: string;
  isOverlayNeeded: boolean;
}[]
```

## Usage Examples

### Import the Interface
```typescript
import { ArkaFincapInterface } from './templates/PD/interface/arka-fincap.interface';
```

### Type a Variable
```typescript
const verificationData: ArkaFincapInterface = {
  applicantDetails: {
    applicationNo: "ARK123456",
    nameOfApplicant: "John Doe",
    phoneNumber: 9876543210,
    // ... other fields
  },
  familyMembers: {
    familyMembers: [
      {
        name: "Jane Doe",
        relationship: "Spouse",
        age: 35,
        education: "Graduate",
        occupation: "Teacher"
      }
    ]
  },
  // ... other sections
};
```

### Type Function Parameters
```typescript
function generateArkaFincapPDF(data: ArkaFincapInterface): Buffer {
  // Implementation
}
```

### Partial Data Handling
```typescript
// All properties are optional, so partial data is valid
const partialData: ArkaFincapInterface = {
  applicantDetails: {
    applicationNo: "ARK123456",
    nameOfApplicant: "John Doe"
  }
};
```

## Type Safety Benefits

1. **Autocomplete:** IDEs provide field suggestions while coding
2. **Type Checking:** Catch type mismatches at compile time
3. **Documentation:** Interface serves as living documentation
4. **Refactoring:** Safe renaming and structural changes
5. **Validation:** Ensures data structure consistency

## Consistency with Schema

This interface is derived directly from the Arka Fincap schema definition (`arka-fincap.ts`) and matches:

- ✅ All section IDs
- ✅ All property names
- ✅ All data types
- ✅ Array structures
- ✅ Nested objects

## Related Files

- **Schema:** `apps/backend/src/modules/loan/forms-schema/arka-fincap.ts`
- **Template:** `apps/backend/src/modules/loan/templates/PD/html/arka-fincap.template.ts`
- **Interface:** `apps/backend/src/modules/loan/templates/PD/interface/arka-fincap.interface.ts`

## Version
Created: October 22, 2025  
Based on: Arka Fincap Schema v1.0

