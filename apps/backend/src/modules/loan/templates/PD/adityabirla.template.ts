import { format, toZonedTime } from 'date-fns-tz';

export const adityabirlaTemplate = (verificationData1: any, html_data: any) => {
    const verificationData = {
        proposal_no: '1234567890',
        date_of_visit: '2025-01-01',
        name: 'John Doe',
        relation: 'Brother',
        age: '25',
        business: 'Business',
        education: 'Bachelor',
        applicant_details: {
            name: 'John Doe',
            co_applicant_name: 'Jane Doe',
            business_name: 'ABC Inc.',
            business_address: '123 Main St, Anytown, USA',
            years_at_address: '10',
            constitution: 'Private Limited',
            partners: 'John Doe, Jane Doe',
            management: 'John Doe, Jane Doe',
            contact_number: '1234567890',
            tin: '1234567890',
            pan: '1234567890',
            certificate_of_incorporation: 'Yes',
            documents_verified: 'Yes',
            nature_of_business: 'Manufacturing',
            main_product: 'Samosa',
            main_raw_material: 'Flour, Oil, Sugar',
            vendors: 'ABC Inc., XYZ Inc.',
            business_transaction: 'Cash',
            stock_observed: 'Yes',
            reason_no_stock: 'No stock observed',
            activity_observed: 'Manufacturing',
            main_customers: 'ABC Inc., XYZ Inc.',
            sales_payment_terms: 'Cash',
            gst_registration: 'Yes',
            itrs_filing: 'Yes',
            employees: {
                declared: '10',
                observed: '10',
                salary: '10000'
            },
            go_down_address: '123 Main St, Anytown, USA',
            other_business_details: 'ABC Inc., XYZ Inc.',
            family: [
                {
                    name: 'John Doe',
                    relation: 'Brother',
                    age: '25',
                    business: 'Business',
                    education: 'Bachelor'
                }
            ]
        },
        financial: {
            sales_bills: '100000',
            purchase_bills: '100000',
            neighbour_check: 'ABC Inc., XYZ Inc.',
            cibil: 'CIBIL Score: 750',
            previous_loans: 'Previous loan from ABC Bank',
            banking: {
                firm_account: '1234567890',
                savings_account: '1234567890'
            },
            assets: {
                own_house: 'Yes',
                other_income: '100000',
                business_machinery: '100000'
            }
        },
        business_profile: {
            start_year: '2025',
            type: 'Sole Proprietorship',
            experience_years: '10',
            operations: 'Manufacturing',
            pricing: {
                samosa: '10',
                kachori: '10',
                papad: '10'
            },
            raw_material_source: 'ABC Inc., XYZ Inc.',
            workers: '10',
            monthly_salary: '10000',
            stock_maintained: '100000',
            transaction_mode: 'Cash',
            native_place: 'ABC Inc., XYZ Inc.',
            business_duration: '10',
            premises: {
                ownership: 'Owned',
                location: 'Commercial',
                sq_ft: '500'
            },
            market_references: 'Market Reference 1, Market Reference 2',
            vendors_contact: 'Vendor Contact 1, Vendor Contact 2',
            monthly_sales: '50000'
        },
        personal_details: {
            residence: '123 Main St, Anytown, USA',
            family: [
                {
                    name: 'John Doe',
                    relation: 'Brother',
                    age: '25',
                    business: 'Business',
                    education: 'Bachelor'
                }
            ]
        },
        financial_summary: {
            sales: '100000',
            purchase: '100000',
            rent: '100000',
            salaries: '100000',
            transport: '100000',
            electricity: '100000',
            other_expenses: '100000',
            total_expenses: '100000',
            net_profit: '100000',
            net_margin_percent: '10',
            neighbour_check: 'ABC Inc., XYZ Inc.',
            cibil: 'CIBIL Score: 750',
            existing_loans: 'Previous loan from ABC Bank',
            banking: {
                firm_account: '1234567890',
                savings_account: '1234567890'
            },
            assets: {
                own_house: 'Yes',
                other_income: '100000',
                business_machinery: '100000'
            }
        },
        observation: {
            location: '123 Main St, Anytown, USA',
            documents: 'Yes',
            this: 'Yes',
            upi_registered_name: 'Yes',
            duration_same_premises: '10'
        },
        loan_details: {
            amount_applied: '100000',
            purpose: 'Business',
            status: 'Approved'
        },
        cibil_details: {
            cibil_score: '1000',
            cibil_report: 'Yes'
        },
        previous_loans: {
            bank_name: 'ABC Bank',
            account_number: '1234567890',
            ifsc_code: 'ABC123',
            account_type: 'Savings',
            account_balance: '100000'
        },
        status: 'Approved'
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
                <td class="branch-value" style="border-right: 1px solid #000;">${verificationData.proposal_no}</td>
                <td class="branch-label">Date of Visit</td>
                <td class="branch-value">${verificationData.date_of_visit}</td>
              </tr>
            </table>
          </div>
        </div>
    
        <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">APPLICANT'S DETAIL</td></tr>
        <tr>
          <th>Name of the Applicant</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.name || ''}</span></td>
        </tr>
        <tr>
          <th>Name of Business</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.business_name || ''}</span></td>
        </tr>
        <tr>
          <th>Business Address</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.business_address || ''}</span></td>
        </tr>
        <tr>
          <th>No. of years in the current address</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.years_at_address || ''}</span></td>
        </tr>
        <tr>
          <th>Constitution of Business</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.constitution || ''}</span></td>
        </tr>
        <tr>
          <th>Name of other Partners(if it is a partnership concern)</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.partners || ''}</span></td>
        </tr>
        <tr>
          <th>Management</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.management || ''}</span></td>
        </tr>
        <tr>
          <th>Contact Number</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.contact_number || ''}</span></td>
        </tr>
        <tr>
          <th>TIN</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.tin || ''}</span></td>
        </tr>
        <tr>
          <th>PAN</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.pan || ''}</span></td>
        </tr>
        <tr>
          <th>Certificate of Incorporation</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.certificate_of_incorporation || ''}</span></td>
        </tr>
        <tr>
          <th>Documents verified</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.documents_verified || ''}</span></td>
        </tr>
        <tr>
          <th>Nature of Business</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.nature_of_business || ''}</span></td>
        </tr>
        <tr>
          <th>Main Product</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.main_product || ''}</span></td>
        </tr>
        <tr>
          <th>Main Raw Material</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.main_raw_material || ''}</span></td>
        </tr>
        <tr>
          <th>Vendors / suppliers to applicant</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.vendors || ''}</span></td>
        </tr>
        <tr>
          <th>Business transaction</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.business_transaction || ''}</span></td>
        </tr>
        <tr>
          <th>Stock observed</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.stock_observed || ''}</span></td>
        </tr>
        <tr>
          <th>If no stocks observed, reason for the same</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.reason_no_stock || ''}</span></td>
        </tr>
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr>
          <th>Business activity observed</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.activity_observed || ''}</span></td>
        </tr>
        <tr>
          <th>Main Customers in the business</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.main_customers || ''}</span></td>
        </tr>
        <tr>
          <th>Sales payment terms</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.sales_payment_terms || ''}</span></td>
        </tr>
        <tr>
          <th>GST Registration</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.gst_registration || ''}</span></td>
        </tr>
        <tr>
          <th>ITRs filing</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.itrs_filing || ''}</span></td>
        </tr>
        <tr>
          <th>No. of Employees (Co-applicant)</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.employees.declared || ''}</span></td>
        </tr>
        <tr>
          <th>Go down address (if any)</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.go_down_address || ''}</span></td>
        </tr>
        <tr>
          <th>Other business details (if any)</th>
          <td colspan="5"><span class="var-value">${verificationData.applicant_details.other_business_details || ''}</span></td>
        </tr>

        </table>
        </div>



    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Business Profile of the Applicant</td></tr>
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
        <tr>
          <th>Native Place</th>
          <td colspan="5"><span class="var-value">${verificationData.business_profile.native_place || ''}</span></td>
        </tr>
        <tr>
          <th>Business since</th>
          <td colspan="5"><span class="var-value">${verificationData.business_profile.business_duration || ''}</span></td>
        </tr>
        <tr>
          <th>Previous Experience</th>
          <td colspan="5"><span class="var-value">${verificationData.business_profile.experience_years || ''}</span></td>
        </tr>
        <tr>
          <th>Business Premises</th>
          <td colspan="5"><span class="var-value">${verificationData.business_profile.premises.location || ''}</span></td>
        </tr>
        <tr>
          <th>If Rented</th>
          <td colspan="5"><span class="var-value">${verificationData.business_profile.premises.ownership || ''}</span></td>
        </tr>
        <tr>
          <th>Business Premises in Sq. ft.</th>
          <td colspan="5"><span class="var-value">${verificationData.business_profile.premises.sq_ft || ''}</span></td>
        </tr>
        <tr>
          <th>Market References from</th>
          <td colspan="5"><span class="var-value">${verificationData.business_profile.market_references || ''}</span></td>
        </tr>
        <tr>
          <th>Vendors contact details</th>
          <td colspan="5"><span class="var-value">${verificationData.business_profile.vendors_contact || ''}</span></td>
        </tr>
        <tr>
          <th>Daily Sales / Monthly Sales</th>
          <td colspan="5"><span class="var-value">${verificationData.business_profile.monthly_sales || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Personal Details</td></tr>
        <tr>
          <th>Current Residence</th>
          <td colspan="5"><span class="var-value">${verificationData.personal_details.residence || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
      <tr><td colspan="6" class="section-header">Family Details</td></tr>
      <tr>
        <th>Name</th>
        <th>Relation</th>
        <th>Age</th>
        <th>Business</th>
        <th>Education</th>
      </tr>
      ${Array.isArray(verificationData.personal_details.family) && verificationData.personal_details.family.length > 0
        ? verificationData.personal_details.family.map(family => `
          <tr>
            <td><span class="var-value">${family.name || ''}</span></td>
            <td><span class="var-value">${family.relation || ''}</span></td>
            <td><span class="var-value">${family.age || ''}</span></td>
            <td><span class="var-value">${family.business || ''}</span></td>
            <td><span class="var-value">${family.education || ''}</span></td>
          </tr>
        `).join('')
        : '<tr><td colspan="5" style="text-align: center;">No family members found</td></tr>'}
      </table>
    </div>

    <div style="page-break-before: always;"></div>


    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Applicant's family details</td></tr>
        <tr>
          <th>Sales Bills</th>
          <td colspan="5"><span class="var-value">${verificationData.financial_summary.sales || ''}</span></td>
        </tr>
        <tr>
          <th>Purchase Bills</th>
          <td colspan="5"><span class="var-value">${verificationData.financial_summary.purchase || ''}</span></td>
        </tr>
        <tr>
          <th>Neighbour Check</th>
          <td colspan="5"><span class="var-value">${verificationData.financial_summary.neighbour_check || ''}</span></td>
        </tr>
        <tr>
          <th>CIBIL Details</th>
          <td colspan="5"><span class="var-value">${verificationData.financial_summary.cibil || ''}</span></td>
        </tr>
        <tr>
          <th>Previous Loans</th>
          <td colspan="5"><span class="var-value">${verificationData.financial_summary.existing_loans || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Banking Details</td></tr>
        <tr>
          <th>Firm Account</th>
          <td colspan="5"><span class="var-value">${verificationData.financial_summary.banking.firm_account || ''}</span></td>
        </tr>
        <tr>
          <th>Savings Account</th>
          <td colspan="5"><span class="var-value">${verificationData.financial_summary.banking.savings_account || ''}</span></td>
        </tr>
        <tr>
          <th>Assets Details</th>
          <td colspan="5"><span class="var-value">${verificationData.financial_summary.assets.own_house || ''}</span></td>
        </tr>
        <tr>
          <th>Other income</th>
          <td colspan="5"><span class="var-value">${verificationData.financial_summary.assets.other_income || ''}</span></td>
        </tr>
        <tr>
          <th>Business Machinery</th>
          <td colspan="5"><span class="var-value">${verificationData.financial_summary.assets.business_machinery || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Observation</td></tr>
        <tr>
          <td colspan="5">
            <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
              <li>He charges around Rs. 1000/- to Rs. /- per person based on service provided.</li>
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
        <tr><td colspan="6" class="section-header">Loan Details</td></tr>
        <tr>
          <th>Loan Amount Applied</th>
          <td colspan="5"><span class="var-value">${verificationData.loan_details.amount_applied || ''}</span></td>
        </tr>
        <tr>
          <th>Purpose of loan</th>
          <td colspan="5"><span class="var-value">${verificationData.loan_details.purpose || ''}</span></td>
        </tr>
        <tr>
          <th>Status of loan</th>
          <td colspan="5"><span class="var-value">${verificationData.loan_details.status || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
          <thead>
            <tr>
              <th>Particulars</th>
              <th>Units</th>
              <th>Charge</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sales</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Purchase</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Rent</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Salaries</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Transport</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Electricity</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Other Expenses</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td><strong>Total Expenses</strong></td>
              <td></td>
              <td></td>
              <td>-</td>
            </tr>
            <tr>
              <td><strong>Net Profit</strong></td>
              <td></td>
              <td></td>
              <td>-</td>
            </tr>
            <tr>
              <td><strong>Net Margin</strong></td>
              <td></td>
              <td></td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
    </div>
    
    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Applicant's Monthly Expenses of the business</td></tr>
        <tr>
          <th>Sales</th>
          <td colspan="5"><span class="var-value">${verificationData.financial_summary.sales || ''}</span></td>
        </tr>
        <tr>
          <th>Purchase</th>
          <td colspan="5"><span class="var-value">${verificationData.financial_summary.purchase || ''}</span></td>
        </tr>
        <tr>
          <th>Rent</th>
          <td colspan="5"><span class="var-value">${verificationData.financial_summary.rent || ''}</span></td>
        </tr>
        <tr>
          <th>Salaries</th>
          <td colspan="5"><span class="var-value">${verificationData.financial_summary.salaries || ''}</span></td>
        </tr>
        <tr>
          <th>Transport</th>
          <td colspan="5"><span class="var-value">${verificationData.financial_summary.transport || ''}</span></td>
        </tr>
        <tr>
          <th>Electricity</th>
          <td colspan="5"><span class="var-value">${verificationData.financial_summary.electricity || ''}</span></td>
        </tr>
        <tr>
          <th>Other Expenses</th>
          <td colspan="5"><span class="var-value">${verificationData.financial_summary.other_expenses || ''}</span></td>
        </tr>
        <tr>
          <th>Total Expenses</th>
          <td colspan="5"><span class="var-value">${verificationData.financial_summary.total_expenses || ''}</span></td>
        </tr>
        <tr>
          <th>Net Profit</th>
          <td colspan="5"><span class="var-value">${verificationData.financial_summary.net_profit || ''}</span></td>
        </tr>
        <tr>
          <th>Net Margin</th>
          <td colspan="5"><span class="var-value">${verificationData.financial_summary.net_margin_percent || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">

        We taken the estimated figures based on customer feedback and the gross profit has been calculated taking into consideration market information gathered on our experience.
        <br><br>
        Disclaimer clause: - The Report (Including any attachments) has been prepared on the basis of verbal information provided by the person contacted.
        <br><br>
        ADITYA BIRLA CAPITAL (Aditya Birla Housing Finance Ltd., will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions, our efficient services will not be liable in any case.
    </div>
    `
}