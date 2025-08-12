import { format, toZonedTime } from 'date-fns-tz';

export const cholaTemplate = () => {
    const verificationData = {
        reportHeader: {
            programName: 'Liquid Income Program',
            dateOfVisit: '2025-01-01',
            personMet: 'John Doe'
        },
        applicantDetails: {
            primary: {
                name: 'John Doe'
            },
            coApplicant: {
                name: 'Jane Doe'
            }
        },
        thirdPartyCheck: {
            checks: [
                {
                    tpcName: 'John Doe',
                    mobileNumber: '1234567890',
                    relationship: 'Brother',
                    feedbackStatus: 'Approved',
                    comments: 'The business is doing well and the applicant is a good credit risk.'
                }
            ]
        },
        phoneNumbers: '1234567890',
        businessDetails: {
            businessName: 'ABC Inc.',
            constitution: 'Private Limited',
            visitedAddress: '123 Main St, Anytown, USA'
        },
        assets: '100000',
        customerReferences: {
            phoneNumbers: '1234567890'
        },
        otherIncomes: '100000',
        existingLoans: '100000',
        bankingDetails: {
            bankName: 'ABC Bank',
            accountNumber: '1234567890',
            ifscCode: 'ABC123',
            accountType: 'Savings',
            accountBalance: '100000'
        },
        pdStatus: 'Approved',
        recommendations: 'Approved',
        disclaimer: 'The business is doing well and the applicant is a good credit risk.',
        documentsVerified: 'Yes',
        businessPhotos: 'Yes',
        customerPhotos: 'Yes',
        vendorPhotos: 'Yes',
        grossDisposableIncome: '100000',
        totalObligations: '100000',
        netDisposableIncome: '100000',
        age: '25',
        name: 'John Doe',
        relation: 'Brother',
        loanDetails: {
            requestedAmount: 100000,
            purpose: 'Business Expansion'
        },
        itrProvided: 'Yes',
        receiptsProvided: 'No',
        bankStatementsProvided: 'No',
        billsProvided: 'No',
        comfortFactors: '100000',
        discomfortFactors: '100000',
        completed: 'Yes',
        feedback: 'The business is doing well and the applicant is a good credit risk.',
        remarks: 'The business is doing well and the applicant is a good credit risk.'
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
                <td class="branch-value" style="border-right: 1px solid #000;"></td>
                <td class="branch-label">Bank Name</td>
                <td class="branch-value"></td>
              </tr>
            </table>
          </div>
        </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Residence Verification</td></tr>
        <tr>
          <th>Name of the Applicant</th>
          <td colspan="5"><span class="var-value">${verificationData.name || ''}</span></td>
        </tr>
        <tr>
          <th>Name of the co-applicant</th>
          <td colspan="5"><span class="var-value">${verificationData.name || ''}</span></td>
        </tr>
        <tr>
          <th>Business name</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessName || ''}</span></td>
        </tr>
        <tr>
          <th>Constitution</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.constitution || ''}</span></td>
        </tr>
        <tr>
          <th>Visited Address</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.visitedAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Loan Requested</th>
          <td colspan="5"><span class="var-value">Rs. ${verificationData.loanDetails.requestedAmount}/-</span></td>
        </tr>
        <tr>
          <th>Purpose of loan</th>
          <td colspan="5"><span class="var-value">${verificationData.loanDetails.purpose || ''}</span></td>
        </tr>
        <tr>
          <th>Date of Visit</th>
          <td colspan="5"><span class="var-value">${verificationData.reportHeader.dateOfVisit || ''}</span></td>
        </tr>
        <tr>
          <th>Person Met</th>
          <td colspan="5"><span class="var-value">${verificationData.reportHeader.personMet || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">About the applicant and its business</td></tr>
        <tr>
          <td colspan="5">
            <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
              <li>${verificationData.name} is applicant aged.</li>
              <li>Applicant started business under the name of </li>
              <li>business concern, applicant is proprietor of the business and applicant manages all the business activities.</li>
              <li>Nature of the business is erificationData.businessDetails.experienceYears years of experience in same field.</li>
              <li>Business provides services like verificationData.businessDetails etc.</li>
              <li>He charges around Rs. 1000/- to Rs. /- per person based on service provided.</li>
              <li>He also does outdoor services and charges around Rs. verificationData.businessDetails.pricing.outdoorServices.min to verificationData.businessDetails.pricing.outdoorServices.max based on service.</li>
              <li>He does around verificationData.businessDetails.monthlyFunctions functions per month.</li>
              <li>Customers are verificationData.businessDetails.customerBase.</li>
              <li>He purchases stock at verificationData.businessDetails.procurement.sources mode.</li>
              <li>He is running business from verificationData.businessDetails.premises.type premise and he pays rent amount of Rs. verificationData.businessDetails.premises.monthlyRent/- per month.</li>
              <li>During the PD, observed that there are verificationData.businessDetails.premises.facilities.chairs chairs, verificationData.businessDetails.premises.facilities.pedicureManicureChairs pedicure and manicure chairs and verificationData.businessDetails.premises.facilities.facialBeds facials beds observed in the premises</li>
              <li>There are verificationData.businessDetails.numberOfWorkers workers working in this parlour under her and she pays salary amount of Rs. verificationData.businessDetails.staff.totalMonthlySalary}/- per month.</li>
            </ul>
          </td>
        </tr>
      </table>
    </div>

     <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Applicant's family details</td></tr>
        <tr>
          <th>Co Applicant Name</th>
          <td colspan="5"><span class="var-value">${verificationData.name || ''}</span></td>
        </tr>
        <tr>
          <th>Age</th>
          <td colspan="5"><span class="var-value">${verificationData.age || ''}</span></td>
        </tr>
        <tr>
          <th>Relation</th>
          <td colspan="5"><span class="var-value">${verificationData.relation || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Assets</td></tr>
        <tr>
          <th>Assets</th>
          <td colspan="5"><span class="var-value">${verificationData.assets || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Customers -- Reference numbers</td></tr>
        <tr>
          <th>Customers</th>
          <td colspan="5"><span class="var-value">${verificationData.phoneNumbers || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Other Incomes</td></tr>
        <tr>
          <th>Other Incomes</th>
          <td colspan="5"><span class="var-value">${verificationData.otherIncomes || ''}</span></td>
        </tr>
      </table>
    </div>


    <div class="align-wrapper">
      <table class="section-table">
      <tr><td colspan="6" class="section-header">Existing Loan Details</td></tr>
      <tr>
        <th>Bank name</th>
        <th>Type of Loan</th>
        <th>Loan amount (In Rs.)</th>
        <th>EMI/Interest (In Rs.)</th>
        <th>Total Tenure/completed [in months]</th>
      </tr>
      ${Array.isArray(verificationData.thirdPartyCheck?.checks) && verificationData.thirdPartyCheck.checks.length > 0
        ? verificationData.thirdPartyCheck.checks.map(tpc => `
          <tr>
            <td><span class="var-value">${''}</span></td>
            <td><span class="var-value">${''}</span></td>
            <td><span class="var-value">${''}</span></td>
            <td><span class="var-value">${''}</span></td>
            <td><span class="var-value">${''}</span></td>
          </tr>
        `).join('')
        : '<tr><td colspan="5" style="text-align: center;">No existing loans found</td></tr>'}
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
      <tr><td colspan="6" class="section-header">Banking Details</td></tr>
      <tr>
        <th>Bank name</th>
        <th>Account Number</th>
        <th>IFSC Code</th>
        <th>Account Type</th>
        <th>Account Balance (In Rs.)</th>
      </tr>
      ${Array.isArray(verificationData.thirdPartyCheck?.checks) && verificationData.thirdPartyCheck.checks.length > 0
        ? verificationData.thirdPartyCheck.checks.map(tpc => `
          <tr>
            <td><span class="var-value">${verificationData.bankingDetails.bankName || ''}</span></td>
            <td><span class="var-value">${verificationData.bankingDetails.accountNumber || ''}</span></td>
            <td><span class="var-value">${verificationData.bankingDetails.ifscCode || ''}</span></td>
            <td><span class="var-value">${verificationData.bankingDetails.accountType || ''}</span></td>
            <td><span class="var-value">${verificationData.bankingDetails.accountBalance || ''}</span></td>
          </tr>
        `).join('')
        : '<tr><td colspan="5" style="text-align: center;">No banking details found</td></tr>'}
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">ITR, Receipts, Verification, GP Margin & Expenses details</td></tr>
        <tr>
            <th>ITR Provided</th>
            <td colspan="5"><span class="var-value">${verificationData.itrProvided || ''}</span></td>
        </tr>
        <tr>
            <th>Receipts Provided</th>
            <td colspan="5"><span class="var-value">${verificationData.receiptsProvided || ''}</span></td>
        </tr>
        <tr>
            <th>Bank Statements Provided</th>
            <td colspan="5"><span class="var-value">${verificationData.bankStatementsProvided || ''}</span></td>
        </tr>
        <tr>
            <th>Bills Provided</th>
            <td colspan="5"><span class="var-value">${verificationData.billsProvided || ''}</span></td>
        </tr>
    </div>

     <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Recommendations</td></tr>
        <tr>
          <th>Comfort Factor</th>
          <td colspan="5"><span class="var-value">${verificationData.comfortFactors || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Discomfort Factor</td></tr>
        <tr>
          <th>Discomfort Factor</th>
          <td colspan="5"><span class="var-value">${verificationData.discomfortFactors || ''}</span></td>
        </tr>
        <tr>
          <th>Status of PD</th>
          <td colspan="5"><span class="var-value">${verificationData.pdStatus} (${verificationData.recommendations})</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Financial Summary</td></tr>
        <tr>
          <th>Total Gross disposable Income (A)</th>
          <td colspan="5"><span class="var-value">Rs. ${verificationData.grossDisposableIncome}/- per month</span></td>
        </tr>
        <tr>
          <th>Total Obligations (B)</th>
          <td colspan="5"><span class="var-value">Rs. ${verificationData.totalObligations}/- per month</span></td>
        </tr>
        <tr>
          <th>Net Disposable Income (C = A - B)</th>
          <td colspan="5"><span class="var-value">Rs. ${verificationData.netDisposableIncome}/- per month</span></td>
        </tr>
      </table>
    </div>
     <div style="page-break-before: always;"></div>

    `
}