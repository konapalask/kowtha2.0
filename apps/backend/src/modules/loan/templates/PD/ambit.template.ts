import { format, toZonedTime } from 'date-fns-tz';

export const adityabirlaTemplate = () => {
    const verificationData = {
        application_number: '1234567890',
        name_of_applicant: 'John Doe',
        name_of_co_applicant: 'Jane Doe',
        name_of_concern: 'ABC Inc.',
        name_of_proprietor: 'ABC Inc.',
        pd_initiated_address: '123 Main St, Anytown, USA',
        visited_premise: '123 Main St, Anytown, USA',
        business_license_address: '123 Main St, Anytown, USA',
        residential_details: {
            address: '123 Main St, Anytown, USA',
            rented_owned: 'Rented',
            owned_by: 'ABC Inc.',
            area: '1000',
            occupied_since: '10'
        },
        phone_number: '1234567890',
        appointment_fixed: '1234567890',
        date_of_visit: '2025-01-01',
        structure_of_loan: '1234567890',
        number_of_visit: '10',
        person_met: 'John Doe',
        about_the_applicant: 'John Doe is a business owner of ABC Inc.',
        family_details: [{
            name: 'John Doe',
            relationship: 'Brother',
            age: '25',
            education: 'Bachelor',
            occupation: 'Business Owner'
        }],
        business_nature: 'Business',
        business_type: 'Business',
        products_sold: 'Products',
        purchase_source: 'Source',
        customer_type: 'Customer Type',
        employees: 'Employees',
        stock_maintained: 'Stock Maintained',
        business_transactions: 'Business Transactions',
        documents_submitted: 'Documents Submitted',
        receipts: 'Receipts',
        payments: 'Payments',
        net_margin: 'Net Margin',
        assets: 'Assets',
        banking_details: [
            {
                bank_name: 'Bank Name',
                account_type: 'Account Type',
                avg_balance: 'Avg Balance',
                years_maintained: 'Years Maintained'
            }
        ],
        loans: 'Loans',
        security_offered: 'Security Offered',
        other_business_income: 'Other Business/Income',
        neighbor_check: 'Neighbor Check',
        status: 'Status'
    };
    return `
     <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background: #fff;
              color: #222;
              position: relative;
              min-height: 60vh;
            }
            .header {
              text-align: left;
              padding: 24px 40px 8px 40px;
              border-bottom: 2px solid #2c3e50;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .header .firm {
              font-size: 28px;
              font-weight: bold;
              color: #1a237e;
              letter-spacing: 1px;
            }
            .header .subtitle {
              color: #1976d2;
              font-style: italic;
              font-size: 18px;
              margin-bottom: 8px;
            }
            .header .address {
              font-size: 14px;
              margin-bottom: 4px;
            }
            .header .contact {
              font-size: 14px;
              text-align: right;
            }
            .logo {
              display: block;
              width: 220px;
              filter: contrast(200%) brightness(80%) saturate(150%);
              background: white;
              image-rendering: auto;
              margin-left: 0; /* aligns to left */
              margin-bottom: 20px;
            }
            .report-title {
              text-align: center;
              font-size: 20px;
              font-weight: bold;
              margin: 24px 0 0 0;
              letter-spacing: 1px;
              text-decoration: underline;
            }
            .align-wrapper {
              width: 90%;
              margin: 0 auto;
            }
            .branch-box {
              width: 100%;
              margin: 18px 0 0 0;
              border: 2px solid #888;
              border-radius: 4px;
              background: #f8f9fa;
            }
            .branch-table {
              width: 100%;
              border-collapse: collapse;
            }
            .branch-table td {
              border: none;
              padding: 10px 16px;
              font-size: 16px;
            }
            .branch-label {
              font-weight: bold;
              width: 160px;
            }
            .branch-value {
              font-size: 18px;
              font-weight: bold;
              color: #222;
            }
            .branch-note {
              background: #ffe0b2;
              color: #b26a00;
              font-size: 13px;
              text-align: center;
              border-radius: 3px;
              font-weight: bold;
            }
            .section-table {
              width: 100%;
              margin: 24px 0 0 0;
              border-collapse: collapse;
              font-size: 15px;
            }
            .section-header {
              background: #f5f5f5;
              font-weight: bold;
              font-size: 16px;
              text-align: center;
              border: 1px solid #888;
              padding: 8px;
              letter-spacing: 1px;
            }
            .section-table th, .section-table td {
              border: 1px solid #888;
              padding: 8px 10px;
              vertical-align: top;
            }
            .section-table th {
              background: #f5f5f5;
              font-weight: bold;
              text-align: center; 
              width: 220px;
            }
            .highlight {
              font-weight: bold;
              color: #1a237e;
            }
            .tick {
              font-weight: bold;
              color: #388e3c;
              font-size: 18px;
            }
            .pdf-footer {
              position: fixed;
              bottom: 0;
              left: 0;
              width: 100%;
              text-align: center;
              color: #7f8c8d;
              font-size: 12px;
              border-top: 1px solid #eee;
              padding: 8px 0 6px 0;
              background-color: transparent;
              z-index: 1000;
            }
            .logo {
              margin-top: 24px;
              text-align: center;
              opacity: 0.15;
            }
            .var-value {
              font-weight: bold;
            }
        </style>
      </head>
      <body>
      <div class="header">
          <div>
            <div class="firm">KOWTHA & CO.</div>
            <div class="subtitle">CHARTERED ACCOUNTANTS</div>
            <div class="address"></div>
          </div>
          <div class="contact">
            Mobile no: 8332037517<br>
            Mail ID: 
          </div>
        </div>

        <div class="report-title">DUE DILIGENCE REPORT</div>
        <div class="align-wrapper">
          <div class="branch-box">
            <table class="branch-table">
              <tr>
                <td class="branch-label">Application Number</td>
                <td class="branch-value" style="border-right: 1px solid #000;">${verificationData.application_number}</td>
              </tr>
            </table>
          </div>
        </div>
    
        <table>
        <tr>
            <td class="bold">Application No</td>
            <td colspan="18" class="content-cell auto-height">${verificationData.application_number}</td>
        </tr>
        <tr>
            <td class="bold">Name of Applicant</td>
            <td colspan="18" class="content-cell auto-height">${verificationData.name_of_applicant}</td>
        </tr>
        <tr>
            <td class="bold">Name of Co-Applicant</td>
            <td colspan="18" class="content-cell auto-height">${verificationData.name_of_co_applicant}</td>
        </tr>
        <tr>
            <td class="bold">Name of Concern</td>
            <td colspan="18" class="content-cell auto-height">${verificationData.name_of_concern}</td>
        </tr>
        <tr>
            <td class="bold">Name of the proprietor as per license</td>
            <td colspan="18" class="content-cell auto-height">${verificationData.name_of_proprietor}</td>
        </tr>
        <tr>
            <td class="bold">PD Initiated address</td>
            <td colspan="18" class="content-cell auto-height">${verificationData.pd_initiated_address}</td>
        </tr>
        <tr>
            <td class="bold">Visited Premise</td>
            <td colspan="18" class="content-cell auto-height">${verificationData.visited_premise}</td>
        </tr>
        <tr>
            <td class="bold">Business License Address</td>
            <td colspan="18" class="content-cell auto-height">${verificationData.business_license_address}</td>
        </tr>
        <tr>
            <td rowspan="3" class="bold">Residential Details</td>
            <td colspan="18" class="content-cell auto-height"><span class="bold">Address</span>: ${verificationData.residential_details.address}</td>
        </tr>
        <tr>
            <td colspan="3" class="bold">Rented/Owned</td>
            <td colspan="7" class="bold">Owned by</td>
            <td colspan="5" class="bold">Area (In Sq. Ft.)</td>
            <td colspan="3" class="bold">Occupied since (years)</td>
        </tr>
        <tr>
            <td colspan="3" class="content-cell auto-height">${verificationData.residential_details.rented_owned}</td>
            <td colspan="7" class="content-cell auto-height">${verificationData.residential_details.owned_by}</td>
            <td colspan="5" class="content-cell auto-height">${verificationData.residential_details.area}</td>
            <td colspan="3" class="content-cell auto-height">${verificationData.residential_details.occupied_since}</td>
        </tr>
        <tr>
            <td class="bold">Phone Number</td>
            <td colspan="18" class="content-cell auto-height">${verificationData.phone_number}</td>
        </tr>
        <tr>
            <td class="bold">Appointment Fixed</td>
            <td colspan="5" class="content-cell auto-height">${verificationData.appointment_fixed}</td>
            <td colspan="13" class="bold content-cell auto-height">Date of Visit: ${verificationData.date_of_visit}</td>
        </tr>
        <tr>
            <td class="bold">Structure of Loan</td>
            <td colspan="18" class="content-cell auto-height">${verificationData.structure_of_loan}</td>
        </tr>
        <tr>
            <td class="bold">No. of Visit</td>
            <td colspan="18" class="content-cell auto-height">${verificationData.number_of_visit}</td>
        </tr>
        <tr>
            <td class="bold">Person Met</td>
            <td colspan="18" class="content-cell auto-height">${verificationData.person_met}</td>
        </tr>
        <tr>
            <td class="bold">About the Applicant</td>    
            <td colspan="18" class="content-cell auto-height">${verificationData.about_the_applicant}</td>
        </tr>
        <tr>
            <td rowspan="8" class="bold" style="padding: 6px;">Family details</td>
            <td class="bold" style="padding: 6px;">Name</td>
            <td colspan="7" class="bold" style="padding: 6px;">Relationship</td>
            <td colspan="4" class="bold" style="padding: 6px;">Age</td>
            <td colspan="5" class="bold" style="padding: 6px;">Education</td>
            <td class="bold" style="padding: 6px;">Occupation</td>
        </tr>
        ${verificationData.family_details.map((family: any) => `
        <tr>
            <td class="content-cell auto-height" style="padding: 6px;">${family.name}</td>
            <td colspan="7" class="content-cell auto-height" style="padding: 6px;">${family.relationship}</td>
            <td colspan="4" class="content-cell auto-height" style="padding: 6px;">${family.age}</td>
            <td colspan="5" class="content-cell auto-height" style="padding: 6px;">${family.education}</td>
            <td class="content-cell auto-height" style="padding: 6px;">${family.occupation}</td>
        </tr>
        `).join('')}
    </table>

    <div style="page-break-before: always;"></div>
    <table>
        <tr>
            <td class="bold">About the Business</td>
            <td class="content-cell auto-height">${verificationData.business_nature} - ${verificationData.business_type}</td>
        </tr>
        <tr>
            <td class="bold">Products Sold</td>
            <td class="content-cell auto-height">
                ${verificationData.products_sold}
            </td>
        </tr>
        <tr>
            <td class="bold">Purchase Source</td>
            <td class="content-cell auto-height">${verificationData.purchase_source}</td>
        </tr>
        <tr>
            <td class="bold">Customer Type</td>
            <td class="content-cell auto-height">${verificationData.customer_type}</td>
        </tr>
        <tr>
            <td class="bold">Employees</td>
            <td class="content-cell auto-height">${verificationData.employees}</td>
        </tr>
        <tr>
            <td class="bold">Stock Maintained</td>
            <td class="content-cell auto-height">${verificationData.stock_maintained}</td>
        </tr>
        <tr>
            <td class="bold">Business Transactions</td>
            <td class="content-cell auto-height">${verificationData.business_transactions}</td>
        </tr>
        <tr>
            <td class="bold">Documents Submitted</td>
            <td class="content-cell auto-height">
                ${verificationData.documents_submitted}
            </td>
        </tr>
    </table>

    <div style="page-break-before: always;"></div>
    <table>
        <tr>
            <td class="bold">Receipts</td>
            <td colspan="18" class="content-cell auto-height">${verificationData.receipts}</td>
        </tr>
        <tr>
            <td class="bold">Payments</td>
            <td colspan="18" class="content-cell auto-height">${verificationData.payments}</td>
        </tr>
        <tr>
            <td class="bold">Net Margin</td>
            <td colspan="18" class="content-cell auto-height">${verificationData.net_margin}</td>
        </tr>
        <tr>
            <td class="bold">Assets</td>
            <td colspan="18" class="content-cell auto-height">
                  ${verificationData.assets}
            </td>
        </tr>
        <tr>
            <td rowspan="3" class="bold">Banking details</td>
            <td colspan="4" class="bold">BANKNAME</td>
            <td colspan="3" class="bold">ACCOUNTTYPE</td>
            <td colspan="6" class="bold">AVGBAL</td>
            <td colspan="5" class="bold">NO:OFYEARSMAINTAINED</td>
        </tr>
        ${verificationData.banking_details.map(banking => `
        <tr>
            <td colspan="4" class="content-cell auto-height">${banking.bank_name}</td>
            <td colspan="3" class="content-cell auto-height">${banking.account_type}</td>
            <td colspan="6" class="content-cell auto-height">${banking.avg_balance}</td>
            <td colspan="5" class="content-cell auto-height">${banking.years_maintained}</td>
        </tr>
        `).join('')}
        <tr>
            <td class="bold">Loans</td>
            <td colspan="18" class="content-cell auto-height">${verificationData.loans}</td>
        </tr>
        <tr>
            <td class="bold">Security Offered</td>
            <td colspan="18" class="content-cell auto-height">${verificationData.security_offered}</td>
        </tr>
        <tr>
            <td class="bold">Other Business/Income</td>
            <td colspan="18" class="content-cell auto-height">${verificationData.other_business_income}</td>
        </tr>
        <tr>
            <td class="bold">Neighbor Check</td>
            <td colspan="18" class="content-cell auto-height">${verificationData.neighbor_check}</td>
        </tr>
        <tr>
            <td class="bold">Status</td>
            <td colspan="18" class="content-cell auto-height">${verificationData.status}</td>
        </tr>
    </table>

    <p><span class="bold underline">Disclaimer Clause:</span></p>
    <p>This report (including any attachments) has been prepared based on verbal information provided by the person contacted. Ambit Finvest Pvt. Ltd. will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. M/s. KOWTHA & CO will not be held liable in any case.</p>
    
    <div style="page-break-before: always;"></div>
    <div class="photo">
        <h3>Residence photos:</h3>
    </div>
    <div class="photo">
        <h3>Property Photos:</h3>
    </div>
    <div style="page-break-before: always;"></div>
    <div class="photo">
        <h3>Business photos:</h3>
    </div>
    
    <div class="pdf-footer">
        AMBIT
    </div>
    `
}