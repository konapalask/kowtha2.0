# Arka Fincap Template - Field Mapping Quick Reference

## Quick Lookup Table

Use this table when working with Arka Fincap forms to quickly find the correct field path.

### Section: Applicant Details (`applicantDetails`)
| Display Label | Schema Field Path | Data Type |
|--------------|-------------------|-----------|
| Application No | `applicantDetails.applicationNo` | string |
| Name of Applicant | `applicantDetails.nameOfApplicant` | string |
| Name of Co-Applicant | `applicantDetails.nameOfCoApplicant` | string |
| Phone Number | `applicantDetails.phoneNumber` | integer |
| Name of Concern | `applicantDetails.nameOfConcern` | string |
| Initiated Premises | `applicantDetails.initiatedPremises` | string |
| Visited Premises | `applicantDetails.visitedPremises` | string |
| Residential Premises | `applicantDetails.residentialPremises` | string |
| Appointment Fixed | `applicantDetails.appointmentFixed` | string (time) |
| Date of Visit | `applicantDetails.dateOfVisit` | string (date) |
| Person Met | `applicantDetails.personMet` | string |
| Amount and Purpose of Loan | `applicantDetails.amountAndPurposeOfLoan` | string |
| Type of Collateral | `applicantDetails.typeOfCollateral` | string |
| Market Value of Collateral | `applicantDetails.marketValueOfCollateral` | string |
| Collateral Property Address | `applicantDetails.collateralPropertyAddress` | string |
| About the Applicant | `applicantDetails.aboutTheApplicant` | string |

### Section: Family Members (`familyMembers`)
| Display Label | Schema Field Path | Data Type |
|--------------|-------------------|-----------|
| Family Members | `familyMembers.familyMembers[]` | array |
| └─ Name | `familyMembers.familyMembers[].name` | string |
| └─ Relationship | `familyMembers.familyMembers[].relationship` | string |
| └─ Age | `familyMembers.familyMembers[].age` | integer |
| └─ Education | `familyMembers.familyMembers[].education` | string |
| └─ Occupation | `familyMembers.familyMembers[].occupation` | string |

### Section: Banking Details (`bankingDetails`)
| Display Label | Schema Field Path | Data Type |
|--------------|-------------------|-----------|
| Banking Details | `bankingDetails.bankingDetails[]` | array |
| └─ Bank Name | `bankingDetails.bankingDetails[].bankName` | string |
| └─ Account Type | `bankingDetails.bankingDetails[].accountType` | enum: Savings/Current/CC-OD |
| └─ Avg Balance | `bankingDetails.bankingDetails[].avgBalance` | number (formatted) |
| └─ Years Maintained | `bankingDetails.bankingDetails[].noOfYearsMaintained` | number |

### Section: LIC/Mutual Funds (`licMutualFunds`)
| Display Label | Schema Field Path | Data Type |
|--------------|-------------------|-----------|
| LIC/Mutual Funds | `licMutualFunds.licMutualFunds` | string |

### Section: Assets (`assets`)
| Display Label | Schema Field Path | Data Type |
|--------------|-------------------|-----------|
| Assets | `assets.assets[]` | array |
| └─ Asset Description | `assets.assets[].description` | string |
| └─ Area | `assets.assets[].area` | string |
| └─ Market Value | `assets.assets[].marketValue` | number (formatted) |
| └─ Asset Holder Name | `assets.assets[].nameOfAssetHolder` | string |

### Section: Existing Loans (`existingLoans`)
| Display Label | Schema Field Path | Data Type |
|--------------|-------------------|-----------|
| Existing Loans | `existingLoans.loans[]` | array |
| └─ Bank | `existingLoans.loans[].bank` | string |
| └─ Type | `existingLoans.loans[].type` | string |
| └─ Loan Amount | `existingLoans.loans[].loanAmount` | number (formatted) |
| └─ EMI | `existingLoans.loans[].emi` | number (formatted) |
| └─ Status | `existingLoans.loans[].status` | enum: Open/Close |

### Section: About the Business (`aboutTheBusiness`)
| Display Label | Schema Field Path | Data Type |
|--------------|-------------------|-----------|
| About the Business | `aboutTheBusiness[]` | array of strings |

### Section: Regular Customers (`regularCustomers`)
| Display Label | Schema Field Path | Data Type |
|--------------|-------------------|-----------|
| Regular Customers | `regularCustomers.customers[]` | array |
| └─ Customer Name | `regularCustomers.customers[].name` | string |
| └─ Contact Number | `regularCustomers.customers[].contactNumber` | integer |

### Section: Regular Suppliers (`regularSuppliers`)
| Display Label | Schema Field Path | Data Type |
|--------------|-------------------|-----------|
| Regular Suppliers | `regularSuppliers.suppliers[]` | array |
| └─ Supplier Name | `regularSuppliers.suppliers[].name` | string |
| └─ Contact Number | `regularSuppliers.suppliers[].contactNumber` | number |

### Section: Business Activity Observed (`businessActivityObserved`)
| Display Label | Schema Field Path | Data Type |
|--------------|-------------------|-----------|
| Business Activity & Stock Level | `businessActivityObserved.businessActivityAndStockLevelObserved` | string |

### Section: Documents Observed (`documentsObserved`)
| Display Label | Schema Field Path | Data Type |
|--------------|-------------------|-----------|
| Documents Observed | `documentsObserved.documentsObserved` | string |

### Section: GST Registration (`gstRegistration`)
| Display Label | Schema Field Path | Data Type |
|--------------|-------------------|-----------|
| GST Registered? | `gstRegistration.gstRegistered` | string |

### Section: ITR Details (`itrDetails`)
| Display Label | Schema Field Path | Data Type |
|--------------|-------------------|-----------|
| ITR Filed | `itrDetails.itrFiled` | string |

### Section: Financial Details
| Display Label | Schema Field Path | Data Type |
|--------------|-------------------|-----------|
| Monthly Gross Receipts | `monthlyGrossReceipts.monthlyGrossReceipts` | number (formatted) |
| Monthly Expenses | `monthlyExpenses.monthlyExpenses` | number (formatted) |
| Net Profit | `netProfit.netProfit` | number (formatted) |
| Net Margin | `netMargin.netMargin` | number |
| Family Expenses | `familyExpenses.familyExpenses` | string |

### Section: Employees (`employees`)
| Display Label | Schema Field Path | Data Type |
|--------------|-------------------|-----------|
| Number of Employees | `employees.numberOfEmployees` | integer |

### Section: Concerns (`concerns`)
| Display Label | Schema Field Path | Data Type |
|--------------|-------------------|-----------|
| Concerns | `concerns[]` | array of strings |

### Section: Other Observations (`otherObservations`)
| Display Label | Schema Field Path | Data Type |
|--------------|-------------------|-----------|
| Other Observations | `otherObservations[]` | array of strings |

### Section: Other Incomes (`otherIncomes`)
| Display Label | Schema Field Path | Data Type |
|--------------|-------------------|-----------|
| Other Incomes | `otherIncomes[]` | array of strings |

### Section: Neighbor Check (`neighborCheck`)
| Display Label | Schema Field Path | Data Type |
|--------------|-------------------|-----------|
| Neighbor Check | `neighborCheck.neighborCheck` | string |

### Section: Status (`status`)
| Display Label | Schema Field Path | Data Type |
|--------------|-------------------|-----------|
| Status | `status.status` | string |

## Number Formatting

Fields marked with "formatted" use Indian number formatting:
```javascript
{
  useIndianFormat: true,
  locale: "en-IN",
  maxDecimalPlaces: 2,
  minDecimalPlaces: 0,
}
```

**Example:** 
- Input: `1000000` 
- Output: `10,00,000`

## Array Display Notes

### Arrays of Objects
- Display as table rows (e.g., family members, loans, assets)
- Show "No [items] listed" when empty

### Arrays of Strings
- Display joined with `<br />` tags
- Show empty string when array is empty

## Common Mistakes to Avoid

❌ **Wrong:** `verificationData.applicantDetails.initiatedAddress`
✅ **Correct:** `verificationData.applicantDetails.initiatedPremises`

❌ **Wrong:** `verificationData.noOfLoans.noOfLoans`
✅ **Correct:** `verificationData.existingLoans.loans`

❌ **Wrong:** `verificationData.aboutBusiness.aboutBusinessDescription`
✅ **Correct:** `verificationData.aboutTheBusiness` (array)

❌ **Wrong:** `verificationData.concerns.concernsDetails`
✅ **Correct:** `verificationData.concerns` (array)

## Template Usage Example

```typescript
// Accessing a simple field
const appNo = verificationData.applicantDetails?.applicationNo;

// Accessing an array of objects
const familyMembers = verificationData.familyMembers?.familyMembers || [];
familyMembers.forEach(member => {
  console.log(member.name, member.age);
});

// Accessing an array of strings
const concerns = verificationData.concerns || [];
const concernsText = concerns.join('<br />');

// Accessing nested object field
const gstStatus = verificationData.gstRegistration?.gstRegistered;
```

## Testing Checklist

- [ ] All required fields display correctly
- [ ] Array fields render as tables
- [ ] Empty arrays show appropriate messages
- [ ] Number fields use Indian formatting
- [ ] String arrays join with line breaks
- [ ] Missing optional fields show empty instead of errors
- [ ] Photos section renders correctly
- [ ] Footer displays bank name and timestamp
- [ ] Disclaimer clause is present

