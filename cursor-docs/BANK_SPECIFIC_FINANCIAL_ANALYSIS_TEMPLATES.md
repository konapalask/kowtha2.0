# Bank-Specific Financial Analysis Templates

## Overview

The financial analysis export feature now supports different Excel template formats based on the bank name. Each bank has specific requirements for how financial data should be presented, and this system automatically selects and generates the appropriate format.

## Architecture

### Components

1. **DTO Files** (`apps/backend/src/modules/loan/dto/`)
   - `financial-analysis-standard.dto.ts` - Standard P&L format (default)
   - `financial-analysis-service.dto.ts` - Service business format
   - `financial-analysis-detailed.dto.ts` - Detailed with balance sheet
   - `financial-analysis-proprietor-gst.dto.ts` - Proprietor with GST tables
   - `financial-analysis-gp-pbdit.dto.ts` - GP/PBDIT margin format
   - `financial-analysis-comprehensive.dto.ts` - Multi-year comparison format

2. **Template Service** (`apps/backend/src/modules/loan/financial-analysis-templates.service.ts`)
   - Main service that routes to appropriate template generator
   - Contains bank-to-template mapping logic
   - Implements Excel generation for each format

3. **Controller Updates** (`apps/backend/src/modules/loan/loan.controller.ts`)
   - Export endpoint now accepts `bankName` query parameter
   - Create/Update endpoints accept any DTO structure
   - New endpoint for template information: `GET /loans/financial-analysis-template-info`

## Template Formats

### 1. Standard Format (Default)
**Used by:** Generic/Default banks  
**DTO:** `FinancialAnalysisStandardDto`  
**Format:** Traditional two-column Trading and P&L Account
- Left side: Expenditure (To Opening Stock, To Purchase, etc.)
- Right side: Income (By Sales, By Services, etc.)
- Both Actuals and Estimations columns
- Gross Profit and Net Profit calculations

**Fields:**
- `openingStock`, `openingStockActual`
- `purchase`, `purchaseActual`
- `sales`, `salesActual`
- `grossProfit`, `grossProfitActual`
- `netProfit`, `netProfitActual`
- And all other standard P&L items

### 2. Service Business Format
**Used by:** Chola, Cholamandalam  
**DTO:** `FinancialAnalysisServiceDto`  
**Format:** Simplified P&L with monthly calculations

**Key Features:**
- Business name and proprietor name header
- Estimated values only (no actuals)
- Monthly breakdown (TO monthly, Payments Monthly, NP monthly)
- GP% and NP% calculations

**Fields:**
- `businessName`, `proprietorName`
- `costOfService`, `rent`, `salaries`
- `electricity`, `transport`, `maintenance`
- `byService`, `netProfit`
- `monthlyTurnover`, `monthlyPayments`, `monthlyNetProfit`
- `grossProfitPercentage`, `netProfitPercentage`

### 3. Detailed Format with Balance Sheet
**Used by:** HDFC, ICICI, Axis  
**DTO:** `FinancialAnalysisDetailedDto`  
**Format:** Comprehensive P&L with side-by-side balance sheet

**Key Features:**
- P&L on left, Balance Sheet on right
- Note, Audited Income, Assessed, and Estimated columns
- Detailed balance sheet with assets and liabilities
- GP Margin and NP Margin calculations

**Fields:**
- `openingStockAssessed`, `openingStockAudited`
- `grossProfitAssessed`, `grossProfitEstimated`
- `salesAudited`, `salesEstimated`
- `balanceSheet` (object with detailed structure)
- `gpMargin`, `npMargin`

### 4. Proprietor Format with GST
**Used by:** Kotak, IndusInd  
**DTO:** `FinancialAnalysisProprietorGstDto`  
**Format:** Estimated P&L with GST payment tables

**Key Features:**
- Estimated values only
- Monthly calculations
- GST payment tables for two fiscal years (2023-2024, 2024-2025)
- GP% and NP% calculations

**Fields:**
- `openingStock`, `purchases`, `sales`
- `grossProfit`, `netProfit`
- `monthlyTurnover`, `monthlyPayments`
- `gst2023_2024` (object with monthly values)
- `gst2024_2025` (object with monthly values)
- `gpPercentage`, `npPercentage`

### 5. GP/PBDIT Format
**Used by:** Bajaj, Tata  
**DTO:** `FinancialAnalysisGpPbditDto`  
**Format:** Detailed cost analysis with margin calculations

**Key Features:**
- Gross Receipts and Other Income
- Cost of material consumed percentage
- GP ratio calculation
- PBDIT (Profit Before Depreciation, Interest, and Tax) margin
- Detailed expense breakdown
- Net profit before and after tax

**Fields:**
- `grossReceipts`, `otherIncome`
- `costOfMaterialConsumed`, `costToReceiptsPercentage`
- `grossProfitAsPerAssumption`, `gpRatio`
- `salary`, `rent`, `electricity`, `travelling`
- `netProfitBeforeInterestTaxDepreciation`, `pbditMargin`
- `netProfitBeforeTax`, `netProfitAfterTax`

### 6. Comprehensive Format
**Used by:** SBI, PNB, Bank of Baroda  
**DTO:** `FinancialAnalysisComprehensiveDto`  
**Format:** Multi-year comparison with change analysis

**Key Features:**
- Actuals for multiple years (31/03/23, 31/03/24)
- Change percentage between years
- Estimated values for future
- Detailed indirect expenses
- Monthly breakdown
- GP% and NP% calculations

**Fields:**
- `openingStock_2023`, `openingStock_2024`, `openingStockChange`, `openingStockEstimated`
- `sales_2023`, `sales_2024`, `salesChange`, `salesEstimated`
- All expense items with `Estimated` suffix
- `monthlyTurnover`, `monthlyPayments`, `monthlyNetProfit`
- `gpPercentage`, `npPercentage`

## API Endpoints

### Export Financial Analysis
```
GET /loans/:id/export-financial-analysis?bankName={bankName}
```
**Parameters:**
- `id` (path): Loan ID
- `bankName` (query, optional): Bank name - if not provided, uses the loan's bank name

**Response:** Excel file (.xlsx)

**Example:**
```bash
GET /loans/123/export-financial-analysis?bankName=HDFC
```

### Get Template Information
```
GET /loans/financial-analysis-template-info?bankName={bankName}
```
**Parameters:**
- `bankName` (query, required): Bank name

**Response:**
```json
{
  "status": 200,
  "message": "Template information fetched successfully",
  "data": {
    "bankName": "HDFC",
    "templateType": "detailed",
    "dtoType": "FinancialAnalysisDetailedDto",
    "description": "Detailed Format with Balance Sheet and Audited/Assessed columns",
    "requiredFields": ["grossProfitEstimated", "netProfit", "salesEstimated", "balanceSheet"],
    "availableTemplates": [...]
  }
}
```

### Create Financial Analysis
```
POST /loans/verification/:id/financial-analysis?bankName={bankName}
```
**Body:** Bank-specific DTO structure (use template info endpoint to get required fields)

### Update Financial Analysis
```
PATCH /loans/verification/:id/financial-analysis?bankName={bankName}
```
**Body:** Bank-specific DTO structure

## Usage Examples

### Frontend Integration

```typescript
// 1. Get template information for the bank
const templateInfo = await fetch(
  `/loans/financial-analysis-template-info?bankName=${loan.bankName}`
);
const { templateType, requiredFields } = templateInfo.data;

// 2. Build form based on required fields
const formFields = buildFormFields(requiredFields);

// 3. Submit financial analysis
await fetch(`/loans/verification/${loanId}/financial-analysis`, {
  method: 'POST',
  body: JSON.stringify(financialAnalysisData),
  headers: { 'Content-Type': 'application/json' }
});

// 4. Export to Excel
window.location.href = `/loans/${loanId}/export-financial-analysis?bankName=${loan.bankName}`;
```

### Backend: Adding a New Template

1. **Create DTO file:**
```typescript
// apps/backend/src/modules/loan/dto/financial-analysis-{template-name}.dto.ts
export class FinancialAnalysisNewBankDto {
  // Define fields specific to this template
}
```

2. **Update template service:**
```typescript
// financial-analysis-templates.service.ts

private isNewBankFormat(bankName: string): boolean {
  const newBanks = ['newbank1', 'newbank2'];
  return newBanks.some((bank) => bankName.includes(bank));
}

private async generateNewBankFormat(
  ExcelJS: any,
  financialAnalysis: any,
  loan: any
): Promise<Buffer> {
  // Implementation
}

// Add to exportFinancialAnalysisToExcel router
if (this.isNewBankFormat(bankNameLower)) {
  return await this.generateNewBankFormat(ExcelJS, financialAnalysis, loan);
}
```

3. **Update controller template info:**
```typescript
// loan.controller.ts - getFinancialAnalysisTemplateInfo method
else if (["newbank1", "newbank2"].some(b => bankNameLower.includes(b))) {
  templateType = "new-template";
  dtoType = "FinancialAnalysisNewBankDto";
  description = "New bank template description";
  requiredFields = ["field1", "field2"];
}
```

## Bank-to-Template Mapping

| Bank Name(s) | Template Type | DTO Class |
|-------------|---------------|-----------|
| Default/Generic | standard | FinancialAnalysisStandardDto |
| Chola, Cholamandalam | service | FinancialAnalysisServiceDto |
| HDFC, ICICI, Axis | detailed | FinancialAnalysisDetailedDto |
| Kotak, IndusInd | proprietor-gst | FinancialAnalysisProprietorGstDto |
| Bajaj, Tata | gp-pbdit | FinancialAnalysisGpPbditDto |
| SBI, PNB, Bank of Baroda | comprehensive | FinancialAnalysisComprehensiveDto |

## Excel Format Features

All templates include:
- Professional formatting with borders and colors
- Bold formatting for totals (Gross Profit, Net Profit)
- Number formatting for currency values
- Signature image at the bottom (if available)
- Proper column widths and row heights
- Header styling with background colors

## Testing

### Test Export for Each Bank Type:

```bash
# Standard format
curl "http://localhost:3000/loans/123/export-financial-analysis?bankName=Generic" -o standard.xlsx

# Service format
curl "http://localhost:3000/loans/123/export-financial-analysis?bankName=Chola" -o service.xlsx

# Detailed format
curl "http://localhost:3000/loans/123/export-financial-analysis?bankName=HDFC" -o detailed.xlsx

# And so on for other templates...
```

### Test Template Info:

```bash
curl "http://localhost:3000/loans/financial-analysis-template-info?bankName=HDFC"
```

## Notes

- The `synopsis` field is common across all DTOs and stored separately
- All numeric fields are optional to support partial data entry
- The system falls back to the standard format if bank name doesn't match any specific template
- The old implementation is preserved as `exportFinancialAnalysisToExcelOld` for reference
- Template selection is case-insensitive

## Migration Guide

For existing financial analysis data:
1. Data is stored in JSON format and is flexible
2. Old data will work with new templates
3. Missing fields will show as empty in exports
4. No database migration needed

## Future Enhancements

- [ ] Add more banks and templates as needed
- [ ] Support custom template upload per bank
- [ ] Add validation for required fields per template
- [ ] Support multiple fiscal year comparisons
- [ ] Add charts and graphs in Excel export
- [ ] Support PDF export with same templates

