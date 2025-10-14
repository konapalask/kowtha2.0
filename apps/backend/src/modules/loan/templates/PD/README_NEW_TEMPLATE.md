# New Template - PDF generation notes

This template is based on the RBL template structure and follows the same pattern for generating Personal Discussion (PD) reports.

## Files Created

1. **Interface**: `interface/new-template.interface.ts`
   - Defines the TypeScript interface for the template data structure
   - Contains all the fields required for the PD report

2. **Template**: `new-template.ts`
   - Main template file that generates the HTML for the PDF
   - Uses the same styling and structure as the RBL template
   - Includes all sections: Case Details, Business Details, Financial Analysis, etc.

3. **Sample Data**: `sample_data/new-template.sample.ts`
   - Contains sample data for testing the template
   - Can be used for development and testing purposes

4. **Service Integration**: Updated `pd-templates.service.ts`
   - Added import for the new template and interface
   - Added mapping logic for 'New Bank' in the InterfaceMapping method

## How to Use

### 1. Update Bank Name
In the `pd-templates.service.ts` file, change the bank name from 'New Bank' to the actual bank name:

```typescript
if (bankName == 'Your Bank Name') {
  let verificationData = verification as NewTemplateInterface
  const html_data = await this.FormatPDImages(verificationData, bankName, loan.applicationNumber, synopsis, financialAnalysis);
  return newTemplate(verificationData, html_data);
}
```

### 2. Customize Template
You can modify the `new-template.ts` file to:
- Add or remove sections as needed
- Change the styling and layout
- Modify the HTML structure
- Add bank-specific branding

### 3. Update Interface
If you need additional fields, update the `NewTemplateInterface` in the interface file and then update the template accordingly.

## Template Structure

The template includes the following sections:

1. **Case Details** - Basic loan and applicant information
2. **Meeting Details** - Visit information and contact details
3. **Business Owner Details** - Information about business owners
4. **Family Details** - Applicant and co-applicant family information
5. **Business Details** - Comprehensive business information
6. **Inputs/Purchases** - Purchase and input details
7. **Outputs/Supply** - Sales and supply information
8. **Employee Details** - Staff and salary information
9. **Trade References** - Supplier and customer references
10. **Other Sources of Income** - Additional income sources
11. **Loan Details** - Existing loan information
12. **Banking Details** - Main banking information
13. **Own Contribution** - Personal contributions
14. **Net Worth** - Assets and property details
15. **Financial Analysis** - Financial calculations and analysis
16. **Final Remarks** - Synopsis and recommendations

## Testing

To test the template:

1. Use the sample data from `sample_data/new-template.sample.ts`
2. Create a loan with the appropriate bank name
3. Call the preview endpoint: `GET /loans/:id/preview-final-report?type=Business&department=PD`
4. The service will generate the PDF using the new template

## Customization Notes

- The template uses the same base styling as other PD templates
- All sections are optional and will show "No data available" if not provided
- The template supports arrays for multiple entries (suppliers, customers, etc.)
- Financial analysis section uses the same structure as RBL template
- Images and signatures are handled by the existing image processing logic

## Next Steps

1. Replace 'New Bank' with the actual bank name
2. Customize the template content as per bank requirements
3. Test with real data
4. Deploy and integrate with the frontend
