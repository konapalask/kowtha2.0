# Schema-Template Mismatch Analysis

## Root Cause

There's a **systematic mismatch** between how data is structured in the JSON schemas vs. how templates expect to access it.

### The Problem

**Schema Structure** (how data is saved):

```javascript
{
  id: "tradeReferences",  // Single section ID
  schema: {
    properties: {
      suppliers: [...],   // Array property
      customers: [...]    // Array property
    }
  }
}
```

**Data Saved in Database**:

```javascript
verificationData = {
  tradeReferences: {
    suppliers: [{...}, {...}],
    customers: [{...}, {...}]
  }
}
```

**Template Expectation** (how template tries to access):

```javascript
verificationData.tradeReferencesSuppliers.suppliers; // ❌ undefined!
verificationData.tradeReferencesCustomers.customers; // ❌ undefined!
```

**Template Should Access**:

```javascript
verificationData.tradeReferences.suppliers; // ✅ Correct!
verificationData.tradeReferences.customers; // ✅ Correct!
```

## Why This Happened

The template was likely created **before** or **independently** of the schema, assuming a different data structure. The template author expected:

- Separate sections: `tradeReferencesSuppliers`, `tradeReferencesCustomers`
- Each with nested arrays: `.suppliers`, `.customers`

But the schema uses:

- Single section: `tradeReferences`
- With properties: `suppliers`, `customers`

## Affected Sections in RBL Template

| Template Access                                              | Schema Structure                                             | Fix Required                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ----------------------------- |
| `verificationData.tradeReferencesSuppliers.suppliers`        | `verificationData.tradeReferences.suppliers`                 | ✅ Yes                        |
| `verificationData.tradeReferencesCustomers.customers`        | `verificationData.tradeReferences.customers`                 | ✅ Yes                        |
| `verificationData.otherSourcesOfIncome.otherSourcesOfIncome` | `verificationData.otherSourcesOfIncome.otherSourcesOfIncome` | ✅ Correct (nested in schema) |

## Systematic Issue Across All Banks

This issue **can affect all 27 banks** if:

1. **Schema has single section with multiple properties** (like RBL's `tradeReferences`)
2. **Template expects multiple separate sections** (like `tradeReferencesSuppliers`, `tradeReferencesCustomers`)

### How to Check for This Issue

For each bank:

1. Look at schema section IDs
2. Look at template data access paths
3. Ensure they match

**Example Patterns to Watch:**

❌ **Mismatch Pattern**:

```javascript
// Schema
{ id: "familyDetails", properties: { members: [...], coApplicant: {...} } }

// Template trying:
verificationData.familyMembers.members          // Wrong!
verificationData.familyCoApplicant.coApplicant  // Wrong!

// Should be:
verificationData.familyDetails.members          // Correct!
verificationData.familyDetails.coApplicant      // Correct!
```

✅ **Correct Pattern**:

```javascript
// Schema
{ id: "familyMembers", properties: { members: [...] } }

// Template access:
verificationData.familyMembers.members  // Correct!
```

## Solution Approach

### Option 1: Fix Templates (Recommended)

**Pros:**

- Data structure remains consistent
- Schemas don't need changes
- QA-tested data is still valid

**Cons:**

- Need to update all affected templates
- Need to re-test PDF generation

### Option 2: Fix Schemas

**Pros:**

- Templates remain unchanged

**Cons:**

- Need to migrate existing data
- Mobile app needs updates
- QA needs to re-test forms
- More complex and risky

**Recommendation**: Fix templates to match schemas (Option 1).

## Fix for RBL Template

### Lines to Change

**Line 271-272** (Trade References - Suppliers):

```javascript
// Before:
${Array.isArray(verificationData.tradeReferencesSuppliers.suppliers) &&
  verificationData.tradeReferencesSuppliers.suppliers.length > 0
  ? verificationData.tradeReferencesSuppliers.suppliers.map(supplier => `

// After:
${Array.isArray(verificationData.tradeReferences.suppliers) &&
  verificationData.tradeReferences.suppliers.length > 0
  ? verificationData.tradeReferences.suppliers.map(supplier => `
```

**Line 290-291** (Trade References - Customers):

```javascript
// Before:
${Array.isArray(verificationData.tradeReferencesCustomers.customers) &&
  verificationData.tradeReferencesCustomers.customers.length > 0
  ? verificationData.tradeReferencesCustomers.customers.map(customer => `

// After:
${Array.isArray(verificationData.tradeReferences.customers) &&
  verificationData.tradeReferences.customers.length > 0
  ? verificationData.tradeReferences.customers.map(customer => `
```

## Prevention for Other Banks

### Checklist Before Creating/Updating Templates

1. ✅ Review the schema JSON file for the bank
2. ✅ Note all section IDs and their structure
3. ✅ Ensure template accesses match section IDs exactly
4. ✅ Test with real/QA data before marking as production-ready

### Validation Script (Future Enhancement)

Could create a script to validate schema-template alignment:

```javascript
// For each bank:
//   1. Parse schema sections and IDs
//   2. Parse template for verificationData access paths
//   3. Compare and report mismatches
```

## Testing After Fix

1. Submit QA form for RBL bank
2. Generate PDF
3. Verify "Trade References" section displays:
   - Suppliers table with data
   - Customers table with data
4. Check no console errors
5. Repeat for all sections with array data

## Files to Review for Similar Issues

Priority banks to audit (have complex schemas):

1. ✅ RBL - Fix applied
2. Axis Finance UBL (Above/Below 10L)
3. Hero Housing (Salaried/Self Employed)
4. India Shelter (Salaried/Self Employed)
5. IDFC (HL/ML vs PL)
6. Any bank with array sections

## Summary

- **Root Cause**: Schema section IDs don't match template access paths
- **Impact**: PDF generation fails for affected sections
- **Solution**: Align template access paths with schema section IDs
- **Prevention**: Validate schema-template alignment during development
- **Fix Applied**: RBL template updated to match schema structure
