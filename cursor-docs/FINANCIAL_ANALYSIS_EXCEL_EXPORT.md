# Financial Analysis Excel Export

## Overview
This feature allows you to export financial analysis data from the Verification model to a formatted Excel file that matches the Trading and Profit & Loss Account structure.

## Implementation

### Prerequisites
Ensure the following environment variable is set in your `.env` file:
```bash
SIGNATURE_PATH=apps/backend/src/images/signature.jpg
```
This path should point to the signature image file (JPEG format recommended).

### New Endpoint
**GET** `/loans/:id/export-financial-analysis`

- **Description**: Export financial analysis data as an Excel file
- **Access**: Admin and Verifier roles only
- **Parameters**:
  - `id` (path parameter): The loan ID

### Response
- **Content-Type**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **Filename**: `financial-analysis-loan-{loanId}.xlsx`

### Error Responses
- **404**: Verification not found
- **500**: Failed to export financial analysis

## Excel File Structure

The exported Excel file contains a "Financial Analysis" worksheet with the following structure:

### Header
- **Title**: Trading and Profit & Loss Account for the year ending 31.03.2026
- **Columns**: 
  - Left Side: Particulars, Actuals, Estimations
  - Right Side: Particulars, Actuals, Estimations

### Data Fields

#### Left Side (Debit Items)
- To Opening Stock
- To Purchase
- To Cost of Services
- To Wages
- To Hamali Charges
- To Manufacturing Expenses
- To Packing Charges
- **To Gross Profit** (bold)
- To Salaries
- To Rent
- To Electricity Charges
- To Printing & Stationery
- To Telephone Charges
- To Postage & Telegram
- To Office Maintenance
- To Repairs & Maintenance
- To Sadar Expenses
- To Audit Fee
- To Advertisement
- To Bank Charges
- To Insurance
- To Depreciation
- To Interest on Loan
- **To Net Profit** (bold)

#### Right Side (Credit Items)
- By Sales
- By Services
- By Closing Stock
- **By Gross Profit** (bold)
- By Rent Received
- By Commission Received

### Formatting
- **Title Row**: Bold, 14pt, centered, merged across all columns
- **Header Row**: Bold, gray background, centered
- **Data Rows**: 
  - Bordered cells
  - Number values aligned right
  - Bold formatting for Gross Profit and Net Profit rows
- **Signature Section**: 
  - "Authorized Signature" label (bold, right-aligned)
  - Signature image (150x75 pixels, positioned on the right)
  - Loaded from `process.env.SIGNATURE_PATH`

## Usage Examples

### Using cURL
```bash
curl -X GET \
  'http://localhost:3000/loans/123/export-financial-analysis' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  --output financial-analysis.xlsx
```

### Using Fetch API (Frontend)
```javascript
const exportFinancialAnalysis = async (loanId) => {
  try {
    const response = await fetch(
      `${API_URL}/loans/${loanId}/export-financial-analysis`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to export financial analysis');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-analysis-loan-${loanId}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Export failed:', error);
  }
};
```

### Using React with Axios
```javascript
import axios from 'axios';

const handleExport = async (loanId) => {
  try {
    const response = await axios.get(
      `/loans/${loanId}/export-financial-analysis`,
      {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `financial-analysis-loan-${loanId}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export failed:', error);
  }
};
```

## Data Source

The export function retrieves data from:
- **Model**: `Verification`
- **Filter**: 
  - `loanId`: The specified loan ID
  - `department`: PD (Physical Document)
  - `type`: Business

The financial analysis data is stored in the `financialAnalysis` JSONB field of the Verification model.

## Field Mappings

| Excel Label | Database Field | Type |
|------------|---------------|------|
| To Opening Stock | openingStock | number |
| To Purchase | purchase | number |
| To Cost of Services | costOfServices | number |
| To Wages | wages | number |
| To Hamali Charges | hamaliCharges | number |
| To Manufacturing Expenses | manufacturingExpenses | number |
| To Packing Charges | packingCharges | number |
| To Gross Profit | grossProfit | number |
| To Salaries | salaries | number |
| To Rent | rent | number |
| To Electricity Charges | electricityCharges | number |
| To Printing & Stationery | printingStationery | number |
| To Telephone Charges | telephoneCharges | number |
| To Postage & Telegram | postageTelegram | number |
| To Office Maintenance | officeMaintenance | number |
| To Repairs & Maintenance | repairsMaintenance | number |
| To Sadar Expenses | sadarExpenses | number |
| To Audit Fee | auditFee | number |
| To Advertisement | advertisement | number |
| To Bank Charges | bankCharges | number |
| To Insurance | insurance | number |
| To Depreciation | depreciation | number |
| To Interest on Loan | interestOnLoan | number |
| To Net Profit | netProfit | number |
| By Sales | sales | number |
| By Services | services | number |
| By Closing Stock | closingStock | number |
| By Rent Received | rentReceived | number |
| By Commission Received | commissionReceived | number |

## Notes

- The **Estimations** columns are currently left empty and can be filled manually in the Excel file
- Empty values in the database will appear as blank cells in the Excel file
- The exported file is generated on-the-fly and not stored on the server
- The file size is typically small (< 50KB for most cases)
- **Signature**: 
  - Automatically added at the end of the Excel sheet
  - Reads from the path specified in `process.env.SIGNATURE_PATH`
  - If signature file is missing, export continues without error (warning logged)
  - Image positioned right-aligned below "Authorized Signature" label

## Future Enhancements

Possible improvements for future versions:
1. Add support for exporting estimations data
2. Include multiple years of data in separate sheets
3. Add charts and visualizations
4. Support for bulk export of multiple loans
5. Customizable templates for different bank requirements
6. Include synopsis and other related fields in a separate sheet

