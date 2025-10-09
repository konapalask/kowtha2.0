import { format, toZonedTime } from 'date-fns-tz';
import { pdBaseTemplate } from './pd-base.tempate';

export const cholaTemplate = (verificationData1: any, html_data: any) => {
  const verificationData = {
    // Basic Information
      "basicInformation": {
        "name_of_the_applicant": "Ramesh Kumar",
        "name_of_the_co-applicant": "Sita Devi",
        "business_name": "Ramesh Enterprises",
        "constitution": "Proprietorship",
        "visited_address": "123, MG Road, Bangalore",
        "loan_requested": 1000000,
        "purpose_of_loan": "Business Expansion",
        "date_of_visit": "2025-10-05",
        "person_met": "Mr. Sharma",
      },
      

  // Family Details
  "applicants_family_details": {
  "name": "Anil Kumar",
  "relationship": "Father",
  "age": "55",
  // "education": "High School",
  // "qualification": "Diploma",
  },
  
  // Extra fields (seen in docx but not in ids JSON)
  "assets": "House, Car", 
  "reference_numbers": "9876543210, 8765432109",
  "other_incomes": "Rental Income",
  
  //existing loan details
  "existing_loans": {
    "bank_name": "State Bank of India",
    "loan_type": "Home Loan",
    "loan_amount_in_rs": "2000000",
    "emiinterest_in_rs": "1500000",
    "total_tenure_completed_in_months": "60",
  },

  // Banking Details
  "bankingDetails": {
  "bank_name": "State Bank of India",
  "ac_no": "123456789012",
  "ac_type": "Savings",
  },

  // ITR / Financial Details
  "itr": "ITR-2024-25.pdf",
  "receipts": "500000",
  "verification": "Verified",
  "net_profit_marigin": "40%",

  // Discomfort Factor
  "status_of_this_case_-_positivenegativecredit_refer": "Positive",
  "disclaimer": "All information provided is true to the best of my knowledge",

  // Total Gross Disposable Income (A)
  "total_gross_disposable_income_a": "150000",
  "total_obligations_b": "50000",

  // Profit & Loss style financial statement (sample figures to mirror screenshot)
  "financialStatement": {
    "income": {
      "grossReceipts": 3600000,
    },
    "expenses": {
      "purchases": 1080000,
      "electricity": 120000,
      "rent": 720000,
      "salaries": 600000,
      "transportation": 24000,
      "other": 24000
    }
  }

};

    // Helper to safely format amounts (Indian numbering system)
    const formatAmount = (val: any) => {
      if (val === null || val === undefined || val === '') return '';
      const num = typeof val === 'number' ? val : parseFloat(val);
      if (isNaN(num)) return '' + val;
      return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const fs = (verificationData as any).financialStatement || {};
    const exp = fs.expenses || {};
    const inc = fs.income || {};
    const expenseTotal = [exp.purchases, exp.electricity, exp.rent, exp.salaries, exp.transportation, exp.other]
      .filter(v => typeof v === 'number')
      .reduce((a: number, b: number) => a + b, 0);
    const incomeTotal = [inc.grossReceipts]
      .filter(v => typeof v === 'number')
      .reduce((a: number, b: number) => a + b, 0);
    const netProfit = incomeTotal - expenseTotal;

    // Disposable income summary (A, B, C = A - B)
    const grossA = parseFloat((verificationData as any).total_gross_disposable_income_a) || 0;
    const obligationsB = parseFloat((verificationData as any).total_obligations_b) || 0;
    const netDisposableC = grossA - obligationsB;

    return `
     <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
              font-family: Arial, sans-serif;
              margin-top: 24px;
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
              margin-top: 40px;
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
              bottom: 20px;
              left: 0;
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              color: #8b9090ff;
              font-size: 12px;
              padding: 6px 40px 4px 40px; /* horizontal padding for spacing */
              z-index: 1000;
              box-sizing: border-box;
            }
            .pdf-footer p {
              margin: 0;
              padding: 0;
              color: #444;
            }
            /* Page break helper: create a new page and reserve top spacing on next page */
            .page-break { page-break-before: always; display: block; height: 50px; }
            
            .logo {
              margin-top: 24px;
              text-align: center;
              opacity: 0.15;
            }
            .var-value {
              font-weight: bold;
            }





            /* P&L table styling */
                .pl-statement-table { width: 100%; border-collapse: collapse; margin: 32px 0 0 0; font-size: 14px; margin-bottom: 24px; }
                .pl-statement-table th, .pl-statement-table td { border: 1px solid #000; padding: 6px 8px; }
                .pl-statement-table th { background: #f2f2f2; text-align: center; font-weight: bold; }
                .pl-heading { font-weight: bold; text-decoration: underline; }
                .pl-section-label { font-weight: bold; }
                .pl-total-row td { font-weight: bold; }
                .pl-blank { background: #fff; }

            /* Income summary list */
                .income-summary-list {
                  padding-left: 10px;
                  margin: 8px 0 0 0;
                }
                .income-summary-list li {
                  display: flex;
                  justify-content: space-between;
                  gap: 16px;
                  position: relative;
                  padding-left: 14px; /* space for bullet */
                }
                .income-summary-list li::before {
                  content: '•';
                  position: absolute;
                  left: 0;
                  top: 50%;
                  transform: translateY(-50%);
                  font-size: 14px;
                  line-height: 1;
                }
                .income-summary-list .label {
                  flex: 1 1 auto;
                }
                .income-summary-list .value {
                  flex: 0 0 auto;
                  font-weight: normal;
                }

        </style>
      </head>


      <body>
        <div class="header">
          <div>
            <div class="firm">KOWTHA & CO.,</div>
            <div class="subtitle">CHARTERED ACCOUNTANTS</div>
            <div class="address">Flat No. 501, AB Heights, Prem Nagar Colony</div>
            <div class="address">Road No. 1, Banjara Hills, Hyderabad-500 033</div>
          </div>
          <div class="contact">
            9490008968(AP)<br>8332037517(TS)<br>
            Mail ID: <a href="mailto:kowthaTS@gmail.com">kowthaTS@gmail.com</a><br>
          </div>
        </div>

        <div class="report-title">LIQUID INCOME PROGRAM REPORT</div>

        <footer class="pdf-footer">
          <p>KOWTHA AND CO</p>
          <p>CHOLA</p>
        </footer>


    <!-- Basic Information Table (rendered) -->
    <div class="align-wrapper" style="margin-top:24px;">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Basic Information</td></tr>
        <tr>
          <th>Name of the Applicant</th>
          <td colspan="5"><span class="var-value">${verificationData.basicInformation.name_of_the_applicant || ''}</span></td>
        </tr>
        <tr>
          <th>Name of the Co-applicant</th>
          <td colspan="5"><span class="var-value">${verificationData.basicInformation["name_of_the_co-applicant"] || ''}</span></td>
        </tr>
        <tr>
          <th>Business Name</th>
          <td colspan="5"><span class="var-value">${verificationData.basicInformation.business_name || ''}</span></td>
        </tr>
        <tr>
          <th>Constitution</th>
          <td colspan="5"><span class="var-value">${verificationData.basicInformation.constitution || ''}</span></td>
        </tr>
        <tr>
          <th>Visited Address</th>
          <td colspan="5"><span class="var-value">${verificationData.basicInformation.visited_address || ''}</span></td>
        </tr>
        <tr>
          <th>Loan Requested</th>
          <td colspan="5"><span class="var-value">${verificationData.basicInformation.loan_requested || ''}</span></td>
        </tr>
        <tr>
          <th>Purpose of Loan</th>
          <td colspan="5"><span class="var-value">${verificationData.basicInformation.purpose_of_loan || ''}</span></td>
        </tr>
        <tr>
          <th>Date of Visit</th>
          <td colspan="5"><span class="var-value">${verificationData.basicInformation.date_of_visit || ''}</span></td>
        </tr>
        <tr>
          <th>Person Met</th>
          <td colspan="5"><span class="var-value">${verificationData.basicInformation.person_met || ''}</span></td>
        </tr>
      </table>
    </div>

      <div class="align-wrapper">
        <table class="section-table">
          <tr>
            <th style="margin-bottom: 6px;"><b>About the applicant and its business:</b></th>
          </tr>
          <tr>
            <td>
              <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
                <li>Mr. ${verificationData.basicInformation.name_of_the_applicant || 'XXX'} is applicant aged 34 years, under graduate and native is Addanki.</li>
                <li>Applicant started business under the name of M/s. ${verificationData.basicInformation.business_name || 'XXXX'} since 2022.</li>
                <li>It is a sole proprietorship business concern, applicant is proprietor of the business and applicant manages all the business activities.</li>
              <li>Nature of the business is saloon services, having overall 5 years of experience in same field.</li>
              <li>Business provides services like hair cutting, facials, waxing, pedicure and manicure etc.</li>
              <li>He also provides special works in the bridal makeup for marriages and other functions.</li>
              <li>He charges around Rs. 300/- to Rs. 3,000/- per person based on service provided.</li>
              <li>He also does outdoor services and charges around Rs. 15,000/- to 25,000/- based on service.</li>
              <li>He does around 5–6 functions per month.</li>
              <li>Customers are general public who are living around the same location.</li>
              <li>He purchases stock at local market at Hyderabad and online mode.</li>
              <li>He is running business from rented premise and he pays rent amount of Rs. 60,000/- per month.</li>
              <li>During the PD, observed that there are 5 chairs, 3 pedicure and manicure chairs and 4 facial beds observed in the premises.</li>
              <li>There are four workers working in this parlour under him and he pays salary amount of Rs. 50,000/- per month.</li>
              <li>All business transactions will be done in cash.</li>
              <li>Neighbor check done we got positive feedback about the applicant.</li>
              <li>Hence Status of the case is Negative.</li>
            </ul>
          </td>
        </tr>
        </table>
    </div>

  <div class="page-break"></div>

    <!-- Applicant's Family Details Table -->
    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Applicant’s Family Details</td></tr>
        <tr>
          <th>Co Applicant Name</th>
          <td colspan="5"><span class="var-value">${verificationData.basicInformation['name_of_the_co-applicant'] || ''}</span></td>
        </tr>
        <tr>
          <th>Age</th>
          <td colspan="5"><span class="var-value">${verificationData.applicants_family_details.age || ''}</span></td>
        </tr>
        <tr>
          <th>Relationship</th>
          <td colspan="5"><span class="var-value">${verificationData.applicants_family_details.relationship || ''}</span></td>
        </tr>
      </table>
    </div>

    <!-- Assets Table -->
    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Assets</td></tr>
        <tr>
          <td colspan="5"><span class="var-value">${verificationData.assets || ''}</span></td>
        </tr>
      </table>
    </div>

    <!-- Customers Reference Numbers Table -->
    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Customers - Reference Numbers</td></tr>
        <tr>
          <td colspan="5"><span class="var-value">${verificationData.reference_numbers || ''}</span></td>
        </tr>
      </table>
    </div>

    <!-- Other Incomes Table -->
    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Other Incomes</td></tr>
        <tr>
          <td colspan="5"><span class="var-value">${verificationData.other_incomes || ''}</span></td>
        </tr>
      </table>
    </div>



    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Existing Loans</td></tr>
        <!-- Horizontal header row -->
        <tr>
          <th>Bank Name</th>
          <th>Type of Loan</th>
          <th>Loan Amount (Rs.)</th>
          <th>EMI / Interest (Rs.)</th>
          <th>Total Tenure Completed (Months)</th>
        </tr>
        <!-- Values row -->
        <tr>
          <td><span class="var-value">${verificationData.existing_loans.bank_name || ''}</span></td>
          <td><span class="var-value">${verificationData.existing_loans.loan_type || ''}</span></td>
          <td><span class="var-value">${verificationData.existing_loans.loan_amount_in_rs || ''}</span></td>
          <td><span class="var-value">${verificationData.existing_loans.emiinterest_in_rs || ''}</span></td>
          <td><span class="var-value">${verificationData.existing_loans.total_tenure_completed_in_months || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Banking Details</td></tr>
        <!-- Horizontal header row -->
        <tr>
          <th>Bank Name</th>
          <th>A/c No</th>
          <th>A/c Type</th>
        </tr>
        <!-- Values row -->
        <tr>
          <td><span class="var-value">${verificationData.bankingDetails.bank_name || ''}</span></td>
          <td><span class="var-value">${verificationData.bankingDetails.ac_no || ''}</span></td>
          <td><span class="var-value">${verificationData.bankingDetails.ac_type || ''}</span></td>
        </tr>
      </table>
    </div>


    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">ITR / Financial Details</td></tr>
        <!-- Horizontal header row -->
        <tr>
          <th>ITR</th>
          <th>Receipts</th>
          <th>Verification</th>
          <th>Gp Margin & Expenses details</th>
        </tr>
        <!-- Values row -->
        <tr>
          <td><span class="var-value">${verificationData.itr || ''}</span></td>
          <td><span class="var-value">${verificationData.receipts || ''}</span></td>
          <td><span class="var-value">${verificationData.verification || ''}</span></td>
          <td><span class="var-value">${verificationData.net_profit_marigin || ''}</span></td>
        </tr>
      </table>
    </div>

  <div class="page-break"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Comfort Factor</td></tr>
        <tr>
          <td colspan="6" style="padding:0;">
            <ul style="margin:0; padding:8px 16px 8px 32px; list-style-type:disc;">
              <li>Business name board seen</li>
              <li>Verified Rental agreement, trade license, Bank statements, kacha records.</li>
              <li>He has 05 years of experience in this field.</li>
            </ul>
          </td>
        </tr>
      </table>
    </div>

    
    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Discomfort Factor</td></tr>
        <tr>
          <td colspan="6" style="padding:0;">
            <ul style="margin:0; padding:8px 16px 8px 32px; list-style-type:disc;">
              <li>Not provided IT, Bank Statement and Bills.</li>
              <li>During the observation, UPI scanner was in the name of A Reddy. However, KYC has been verified applicant name is Mr. Ayyappa Swamy</li>
            </ul>
          </td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Recommendations</td></tr>
        <tr>
          <td colspan="6" style="padding:0;">
            <ul style="margin:0; padding:8px 16px 8px 32px; list-style-type:disc;">
              <li>Status of PD is ${verificationData["status_of_this_case_-_positivenegativecredit_refer"] || ''}  (Phone-Pe linked bank account was showing other name of Mr. A Reddy and firm name is Heaven Family beauty.)</li>
            </ul>
          </td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Disclaimer if any</td></tr>
        <tr>
          <td colspan="6">We estimated financials, purely based on the valid documents provided by the applicant.</td>
        </tr>
      </table>
    </div>

    
    <!-- Profit & Loss Style Statement (Expenditure vs Income) -->
    <div class="align-wrapper">
      <table class="pl-statement-table">
        <tr>
          <th style="width:30%">PARTICULARS</th>
          <th style="width:20%">Estimated</th>
          <th style="width:30%">PARTICULARS</th>
          <th style="width:20%">Estimated</th>
        </tr>
        <tr>
          <td class="pl-heading">EXPENDITURE</td>
          <td></td>
          <td class="pl-heading">INCOME</td>
          <td></td>
        </tr>
        <tr>
          <td>To purchases of Material</td>
          <td>${formatAmount(exp.purchases)}</td>
          <td>By Gross Receipts</td>
          <td>${formatAmount(inc.grossReceipts)}</td>
        </tr>
        <tr>
          <td>To Electricity</td>
          <td>${formatAmount(exp.electricity)}</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>To Rent</td>
          <td>${formatAmount(exp.rent)}</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>To Salaries</td>
          <td>${formatAmount(exp.salaries)}</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>To Transportation</td>
          <td>${formatAmount(exp.transportation)}</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>To Other expenses</td>
          <td>${formatAmount(exp.other)}</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td><b>To Net Profit</b></td>
          <td>${formatAmount(netProfit >= 0 ? netProfit : '')}</td>
          <td></td>
          <td></td>
        </tr>
        <tr class="pl-total-row">
          <td>Total</td>
          <td>${formatAmount(incomeTotal)}</td>
          <td></td>
          <td>${formatAmount(incomeTotal)}</td>
        </tr>
      </table>
    </div>
    
  
    <div class="align-wrapper" style="font-size:14px;">
      <ul class="income-summary-list" style="list-style-type: disc;">
        <li><span class="label">Total Gross Disposable Income (A)</span><span class="value">Rs. ${formatAmount(grossA)} /- per month</span></li>
        <li><span class="label">Total Obligations (B)</span><span class="value">Rs. ${formatAmount(obligationsB)} /- per month</span></li>
        <li><span class="label">Net Disposable Income (C = A - B)</span><span class="value">Rs. ${formatAmount(netDisposableC)} /- per month</span></li>
      </ul>
    </div>

    <div class="align-wrapper" style="font-size:14px;">
      <p>Gross disposable income is sum of Net profit & interest depreciations</p>
        <ul >  
          <li>Business premises photo with customer& Vendor’s Self to be attached in this report</li>
        </ul>
    </div>
    
  <div class="page-break"></div>

    <div class="align-wrapper"">
      <p style="margin-bottom: 6px;"><b><u>Business Photos:</u></b></p>
      
    </div>
  `
}