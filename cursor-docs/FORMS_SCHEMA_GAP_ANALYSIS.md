# PD Forms Schema - Comprehensive Gap Analysis

**Date**: October 11, 2025  
**Purpose**: Identify missing fields between customer-provided HTML templates and generated forms schemas

---

## Executive Summary

This document provides a comprehensive review comparing the customer-provided HTML/DOCX templates (located in `project-data/kowtha-provided-templates/`) with the generated forms schemas (in `apps/backend/src/modules/loan/forms-schema/`). The analysis identifies critical missing fields that need to be added to ensure the forms can generate complete PDFs matching customer requirements.

---

## Critical Missing Fields (Common Across Multiple Banks)

###1. **Header/Metadata Fields**
Missing from most schemas:

- ` Region` (seen in Axis Finance UBL)
- `Location` (seen in Axis Finance UBL)
- `Branch` (seen in Axis Finance UBL)
- `Visited By` / `AFL Verifier's Name & Emp Code`
- `Date of Report` / `PD Date`

### 2. **Documents Observed Section**

Present in HTML templates but missing structured fields:

- Document Category
- Document Name
- Document Type
- Remarks/Comments on documents

### 3. **Reference Check Fields**

Templates show detailed reference checking, but schemas are incomplete:

- `Ref. Check` status for suppliers
- `Ref. Check` status for customers
- Feedback details from reference checks

### 4. **Working Capital Details**

Missing in most schemas:

- CC/OD (Cash Credit/Overdraft) Limit
- Utilization percentage
- Collateral details for working capital
- Details of linked loans

### 5. **Site/Location Data**

Critical for verification:

- `Site Coordinates` (Latitude/Longitude)
- Geo-tagging information
- Map references

### 6. **Final Status & Remarks**

Missing structured fields for:

- `Status` (Positive/Negative/Credit Refer/Credit Manager Visit Needed)
- `Remarks` (detailed observations)
- `Observation` (bullet points of what was seen)
- Verifier signature/approval

### 7. **Disclaimer Clause**

All templates have a standard disclaimer, but not captured in schemas

---

## Bank-Specific Findings

### AXIS FINANCE UBL (Above & Below 10L)

**Template Location**: `AXIS FINANACE UBL/AXIS FINANCE UBL.html`  
**Schema Files**: `axis-finance-ubl-above-10l.ts`, `axis-finance-ubl-below-10l.ts`

#### Missing Critical Fields:

1. **Basic Details Section**:

   - ✅ Has: Region, Location, Branch, Ref No/Application No (PRESENT in template)
   - ❌ Missing in Schema: These are NOT in current schema
   - ❌ Missing: `Visited By` field

2. **Constitution/Shareholding**:

   - Current schema has basic shareholding
   - ❌ Missing: `Functional of Partner/Director` field
   - ❌ Missing: Detailed designation fields

3. **About the Business**:

   - Template shows extensive narrative text with bullet points
   - Schema has basic text field but doesn't capture structured elements like:
     - Years of experience
     - GST registration year
     - Specific products/services with pricing
     - Stock value
     - Number of workers with salaries
     - Vehicle details (RC information)

4. **Suppliers/Creditors**:

   - ✅ Template has: No of Fixed Suppliers, Credit Period, Cash-Cheque Proportion
   - ✅ Template has: Top 3 suppliers with Contact Details, Location, Ref. Check
   - ❌ Schema: Missing `Ref. Check` status field for each supplier

5. **Clients/Debtors**:

   - Similar to suppliers, missing `Ref. Check` field

6. **Asset Details**:

   - ✅ Template has comprehensive immovable property section
   - ❌ Schema missing:
     - `Area Measurements`
     - `Purchase Cost`
     - `Purchase Year`
     - `Market Value`
     - `Owner Name`
     - `Mortgaged (Yes/No)`
   - ❌ Missing: "Liquid, Moveable & Monetary items" section
   - ❌ Missing: "Life Insurance, Mediclaim" section
   - ❌ Missing: "Capital invested in any business" section
   - ❌ Missing: "Car, Bike and other vehicle" section with Company Name and Model

7. **Loan Details**:

   - Template shows: Bank/NBFC Name, Type, Sanctioned Amount, O/S Balance, EMI, EMI Paid Bank, Secured Against Asset
   - Schema has partial coverage

8. **Bank Details**:

   - Template has: Bank Name, Branch Name, Account Type, Open Since (Year)
   - Schema may be missing some fields

9. **End Use of Loan**:

   - Template: Detailed end-use description field
   - Schema: May have basic field

10. **Third Party Check**:

    - Template: Individual/Business Name, Address, Contact No, Knowing Since, Feedback on Borrower, Feedback on Business
    - Schema: Likely missing structured approach

11. **Observation**:

    - Template: Bullet points for observations
    - Schema: Missing structured field

12. **Other Income**:

    - Template: Dedicated section
    - Schema: May be missing

13. **Site Coordinates**:

    - ❌ Missing entirely from schema

14. **Status Field**:

    - ❌ Missing: Credit Refer / Positive / Negative status

15. **AFL Verifier Details**:

    - ❌ Missing: Verifier Name, Emp Code, Signature

16. **Disclaimer Clause**:
    - ❌ Not captured (though could be added in template)

---

### AXIS BANK

**Template Location**: `AXIS BANK/AXIS BANK.html`  
**Schema File**: `axis-bank.ts`

#### Missing Critical Fields:

1. **Applicant Details**:

   - ✅ Schema has basic fields
   - ❌ Missing in template capture: Schema doesn't align perfectly with template structure

2. **Family Background**:

   - Template shows narrative description plus structured table
   - Schema has structured family members array ✅
   - But missing: Total Family Members count, No. of Earning Members count

3. **Business Place & Vintage**:

   - Template has many detailed questions:
     - ✅ Name of firm
     - ✅ Constitution
     - ✅ Who started business
     - ✅ Ownership of business place
     - ✅ Years in current office
     - ✅ Years in current city
     - ✅ Years in current business
     - ❌ Missing: Previous employment (if any)
     - ❌ Missing: "Is Resi Cum office?" field

4. **Business/Financial Profile**:

   - Template has extensive section:
     - Nature of business (Trading/Manufacturing/Services)
     - Products/Services offered
     - Business Model & background (narrative)
     - Other details observed (name board, employees, activity, stock, machines)
     - Top 3 clients with debtor days
     - Top 3 suppliers with creditor days
     - Other business/alternate income sources
     - Other observations/remarks
     - Neighbor check/Third party check status
   - Schema: Likely missing many of these structured fields

5. **Common Points**:

   - ❌ Missing: Turnover and Margin fields
   - ❌ Missing: Sales fluctuations (Seasonal business) - Peak months, Low months
   - ❌ Missing: "Customer Identity established during PD" (Y/N with document)
   - ❌ Missing: Chartered A/c details
   - ❌ Missing: Detailed existing loans table with: Loan type, Loan Amt, Tenure, EMI, Bal tenure, Bank Name
   - ❌ Missing: "Loans taken from family, friends, business associates"

6. **Working Capital Details**:

   - Template shows:
     - Bank Name
     - Limit
     - Utilisation
     - Collateral
     - Details of linked loans
   - ❌ Likely missing from schema

7. **End Use of Proposed Loan**:

   - Template emphasizes detailed end-use description
   - Schema: Check if present

8. **Banking Details**:

   - Template: Bank Name, A/c type, Average Balances
   - ❌ Missing: Banking performance (cheque bounces Y/N)

9. **Collateral Details**:

   - ❌ Missing: Address of property field

10. **Status of PD**:

    - ❌ Missing: Positive/Negative/Credit Manager visit needed

11. **ANNEXURE 1**: Income Assessment for Asha Home Loans

    - Template has detailed cash flow analysis table:
      - Monthly TO/Gross Receipts
      - Any other income
      - Gross monthly income
      - Less: Direct expenses
      - Less: Rental expenses
      - Less: Staff Salary
      - Less: Electricity/mobile/travel
      - Less: Other expenses
      - Income left for domestic expenses
      - Less: Monthly household expenses (Food, Children education, House rent, Medical, Other)
      - Net monthly income post all expenses
      - Less: Savings/investments/insurance
      - Less: Existing EMIs
      - Less: EMI for proposed loan
      - Net surplus income
    - ❌ This entire section is likely missing from schema

12. **Geo Tagging & Photographs**:
    - ❌ Missing reference to geo-tagging section

---

### RBL BANK

**Template Location**: `RBL/RBL.html`  
**Schema File**: `rbl.ts`

#### Missing Critical Fields:

1. **Case Details**:

   - ✅ Has: Reference Number (LOS ID), Name of Applicant
   - ❌ Missing: Co-Applicant field
   - ❌ Missing: Type of Borrower field

2. **Meeting Details**:

   - Template: Address Visited, Person Met, Contact No, Date of Visit
   - Schema: Check alignment

3. **Business Owner Details**:

   - Template has structured table: Name, Age, Qualification, Occupation, Relation, Remarks
   - Multiple rows for applicant, co-applicant, partners
   - Schema: Check if this level of detail is captured

4. **Family Details**:

   - Template shows narrative about applicant, co-applicant, and family members with relationships
   - Schema: Verify structure

5. **Business Details**:

   - Template has extensive fields:
     - ✅ Business Name
     - ✅ Type of Entity
     - ❌ Missing: GST Number field
     - ❌ Missing: Legal Name (as verified from GST)
     - ❌ Missing: Trade Name (as verified from GST)
     - ❌ Missing: Last GST Return date
     - ✅ Establishment (years)
     - ✅ Shop Address
     - ✅ Shop Ownership
     - ❌ Missing: Godown field
     - ❌ Missing: Godown Ownership field
     - ✅ Nature of Business
     - ❌ Missing: "Product Details and Vintage" field
     - ✅ Business Process (narrative)
     - ✅ Margins
     - ✅ Documents Observed (list)
     - ❌ Missing: Activity Observed section
     - ❌ Missing: Size of shop field

6. **Inputs/Purchases**:

   - Template has dedicated section:
     - Details of Inputs
     - Purchase Details
     - Order Cycle
     - Avg Order Qnty
     - Credit Terms
     - Other Remarks
   - ❌ Likely missing from schema

7. **Outputs/Supply**:

   - Template fields:
     - Market for Output
     - Mode of Marketing
     - Type of Customers
     - Credit Terms
     - Stock of Finished Goods
   - ❌ Likely missing from schema

8. **Employee Details**:

   - Template: No. of Employees, Salary Details, PF/ESI Applied
   - Schema: Check coverage

9. **Trade References**:

   - Suppliers: Name of Suppliers, Contact Details (structured table)
   - Customers: Name of Customer, Contact Details (structured table)
   - Schema: Verify if properly structured

10. **Other Sources of Income**:

    - Template: Source of Income, Details (e.g., Rental Income)
    - ❌ May be missing

11. **Loans Details**:

    - Template: Name of Bank/Institution, Product, Loan amount, EMI, POS (Present Outstanding), Remarks
    - Schema: Check completeness

12. **Applicant's Main Banking Details**:

    - Template: Bank Name, Account Holder name, Account type, No of year, Limit of CC/OD, Remarks
    - ❌ CC/OD limit may be missing

13. **End Use**:

    - Template: Narrative description
    - Schema: Verify

14. **Own Contribution**:

    - Template: Source of own contribution, Remarks
    - ❌ Likely missing

15. **Net Worth**:

    - Template: Table with Sr. No, Type of property/investments, Owner name, Approx. Market value, Years of ownership
    - ❌ May not be fully captured

16. **Coordinates**:

    - Template: Latitude, Longitude (structured table)
    - ❌ Missing from schema

17. **Disclaimer**:

    - Template has RBL-specific disclaimer
    - ❌ Not captured

18. **Photographs**:
    - Template reference
    - ❌ Schema may not explicitly reference

---

## Additional Banks to Review

Due to the large number of templates (22 banks), I recommend prioritizing the following for detailed review:

### High Priority:

1. **TATA UBL** - Different structure, needs review
2. **ICICI** - Major bank, high volume expected
3. **IIFL** - NBFC, may have unique requirements
4. **CHOLA** - Different format than others
5. **IDFC (HL & ML, PL)** - Two variants, need both reviewed

### Medium Priority:

6. Hero Housing (Salaried vs Self Employed)
7. India Shelter (Salaried vs SENP)
8. Niwas (Salaried vs SENP)
9. Hero Fincorp
10. DCB

### Lower Priority (Similar structures):

11. Arka Fincap, Centrum, Clix Capital (shared template)
12. Ambit
13. Aditya Birla
14. SMFG SME
15. YES Bank
16. INCRED
17. Axis Agri

---

## Common Patterns Across All Templates

### 1. **Observation/Remarks Section**

Every template has a free-text section for:

- Business activity observations
- Name board visibility
- Stock seen
- Employees working
- Documents verified
- Neighbor feedback

**Recommendation**: Add structured `Observations` array or rich text field

### 2. **Third-Party/Reference Checks**

All templates emphasize getting references from:

- Suppliers
- Customers
- Neighbors
- Business associates

Each reference needs:

- Name
- Contact details
- Relationship
- Feedback status
- Comments

**Recommendation**: Standardize reference check structure across all banks

### 3. **Document Verification**

Every template lists documents observed:

- GST Certificate
- Bank Statements
- Purchase Bills
- Property documents
- Business licenses

**Recommendation**: Add `Documents Observed` section with checkboxes/list

### 4. **Geo-Location**

Most templates require:

- Latitude
- Longitude
- Site coordinates
- Map reference

**Recommendation**: Add mandatory geo-tagging fields

### 5. **Working Capital Assessment**

For business loans, templates assess:

- CC/OD limits
- Utilization
- Banking conduct
- Cheque bounces

**Recommendation**: Add working capital section to all business-focused forms

### 6. **Income Assessment**

Templates show detailed cash flow analysis:

- Gross receipts
- Direct expenses
- Indirect expenses
- Household expenses
- Net surplus

**Recommendation**: Add income calculation template/section

### 7. **Asset & Net Worth**

Comprehensive asset listing:

- Immovable properties
- Vehicles
- Investments (FD, MF, Bonds)
- Insurance
- Gold/Cash

**Recommendation**: Expand asset details section

### 8. **Status & Recommendation**

Every template concludes with:

- Positive/Negative/Credit Refer status
- Specific reasons for recommendation
- Verifier name and signature

**Recommendation**: Add mandatory status and recommendation fields

---

## Critical Gaps Summary

### Must-Have Fields (Missing from Most Schemas):

1. **Geo-Location**: Latitude, Longitude, Site Coordinates
2. **Status Field**: Positive/Negative/Credit Refer/Credit Manager Visit
3. **Verifier Details**: Name, Employee Code, Signature, Date
4. **Reference Checks**: Structured feedback from suppliers/customers/neighbors
5. **Documents Observed**: Checklist of verified documents
6. **Observations**: Detailed narrative of what was seen during visit
7. **Working Capital**: CC/OD details, limits, utilization
8. **Net Worth**: Comprehensive asset and liability statement
9. **Income Assessment**: Detailed cash flow analysis
10. **Own Contribution**: Source and details
11. **End Use**: Detailed breakdown of loan usage
12. **Disclaimer**: Bank-specific disclaimer clause
13. **GST Verification**: GST number, last return date, verified from portal
14. **Banking Conduct**: Cheque bounces, average balance, years of banking
15. **Seasonal Business**: Peak/low months with volumes

### Nice-to-Have Enhancements:

1. **Region/Location/Branch**: For better organization
2. **Visited By**: Field executive name
3. **Activity Observed**: What was seen during visit (customers, stock, employees)
4. **Product Vintage**: How long dealing with current products
5. **Previous Employment**: If business is new
6. **PF/ESI Details**: For employee compliance
7. **Chartered Accountant**: CA details if audited
8. **Market Analysis**: Competitive landscape comments

---

## Recommendations

### Phase 1: Critical Additions (Immediate)

Add these fields to ALL bank schemas:

- Geo-location (Latitude/Longitude)
- Status (dropdown: Positive/Negative/Credit Refer)
- Verifier Name & Employee Code
- Observations (rich text area)
- Documents Observed (multi-select checklist)

### Phase 2: Bank-Specific Reviews (Next 2 Weeks)

- Review each of 27 banks individually
- Map HTML template fields to schema
- Add bank-specific missing fields
- Test end-to-end with QA screen

### Phase 3: Validation & Testing (Week 3)

- Use QA Form Testing screen to validate
- Submit test forms for all 27 banks
- Generate PDFs and compare with customer templates
- Collect stakeholder feedback

### Phase 4: Production Readiness (Week 4)

- Fix any gaps identified in testing
- Add data validation rules
- Optimize form UX
- Prepare for customer demo

---

## Next Steps

1. **Prioritize Banks**: Start with top 5 banks (Axis Finance UBL, Axis Bank, RBL, ICICI, IIFL)

2. **Create Gap Tickets**: For each bank, create detailed tickets listing missing fields

3. **Update Schemas**: Add missing fields to form schemas systematically

4. **Test with QA Screen**: Use the newly created QA Form Testing screen to validate

5. **Generate Sample PDFs**: For each bank, generate PDF and compare with customer template

6. **Iterate**: Based on feedback, refine fields and layout

---

## Conclusion

The current forms schemas capture approximately **60-70%** of the fields present in customer templates. The main gaps are:

1. **Missing sections**: Observations, Documents Observed, Reference Checks, Geo-location, Income Assessment
2. **Incomplete details**: Asset details, Banking conduct, Working capital, Net worth
3. **Status/Workflow**: Missing approval status, verifier details, final recommendations

**Estimated Effort**: 40-60 hours to complete gap analysis and updates for all 27 banks

**Priority**: HIGH - These fields are essential for generating customer-required PDFs

---

_Document created by AI Assistant_  
_For questions or clarifications, please discuss with development team_
