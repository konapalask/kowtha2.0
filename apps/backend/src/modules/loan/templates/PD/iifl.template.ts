import { format, toZonedTime } from 'date-fns-tz';

export const iiflTemplate = (verificationData1: any, html_data: any) => {
    const verificationData = {
      "basicDetails": {
        "prospectNo": "PROS001",
        "name": "Jeevan Reddy",
        "maritalStatus": "Married",
        "educationalQualification": "Graduate",
        "category": "General",
        "numberOfDependents": "3",
        "children": "1",
        "adults": "2",
        "others": "0",
        "yearsInCurrentResidence": ">5 Years",
        "currentResidenceHouseSize": "2BHK",
        "previousAddress": "N/A",
        "yearsAtPreviousAddress": "N/A",
        "yearsInCurrentCity": ">3 Years",
        "previousCity": "N/A",
        "yearsInPreviousCity": "N/A",
        "reasonForChange": "N/A",
        "parentsStayingWith": "Separate",
        "usageOfProperty": "Self-Occupancy",
        "briefComments": "Good credit history and stable income",
        "dateOfCaseInitiated": "2025-01-15",
        "dateOfAppointmentProvided": "2025-01-20",
        "initiatedAddress": "Plot No 45, Hi-Tech City, Hyderabad",
        "visitedAddress": "Plot No 45, Hi-Tech City, Hyderabad",
        "residentialAddress": "Flat 301, Sunshine Apartments, Hyderabad",
        "contactNumber": "+91-9876543210",
        "loanAmountRequired": "₹5,00,000",
        "purposeOfLoan": "Business Expansion",
        "profileInitiated": "Business Loan"
      },
      "familyDetails": {
        "familyMembers": "Applicant, Spouse (Anitha Reddy), Son (Aditya Reddy, 8 years)",
        "applicantEducation": "MBA",
        "nativePlace": "Hyderabad, Telangana",
        "businessName": "BeyondScale Solutions",
        "businessType": "Proprietorship",
        "yearsOfExperience": "12 years",
        "assetsUsed": "Computer Systems, Office Equipment",
        "natureOfBusiness": "IT Services",
        "dailyOutputRates": "₹15,000 per day average",
        "materialsPurchased": "Software Licenses, Hardware",
        "numberOfWorkers": "5",
        "salary": "₹25,000 per worker",
        "customers": "Local IT Companies",
        "businessPremises": "Owned",
        "rentPaid": "N/A",
        "neighborEnquiryResult": "Positive feedback",
        "concernsObservations": "None",
        "businessVintageDocuments": "Y",
        "businessNameBoard": "Permanent",
        "workersPresentAtVisit": "3",
        "kachaRecordsProvided": "Y",
        "upiPaymentsProvided": "Y",
        "addressMatch": "Match",
        "otherObservations": "Well organized office with good infrastructure"
      },
      "incomeDetails": {
        "grossReceipts": "₹4,50,000",
        "otherIncome": "₹50,000",
        "totalIncome": "₹5,00,000",
        "purchases": "₹1,50,000",
        "salaries": "₹1,25,000",
        "electricity": "₹15,000",
        "otherExpenses": "₹25,000",
        "totalExpenses": "₹3,15,000",
        "netProfit": "₹1,85,000",
        "netMargin": "37%",
        "spouseIncome": "₹30,000 (Part-time work)"
      },
      "referenceDetails": {
        "references": [
          {
            "name": "Ramesh Kumar",
            "contactNo": "+91-9876001122",
            "relationship": "Business Associate"
          },
          {
            "name": "Suresh Reddy",
            "contactNo": "+91-9876554321",
            "relationship": "Neighbor"
          }
        ]
      },
      "caseStatus": {
        "status": "Positive",
        "reason": "Good credit history, stable business, adequate income"
      },
      "pdOfficerDetails": {
        "name": "PD Officer Name",
        "dateOfDiscussion": "2025-01-25",
        "signature": "Digital Signature"
      }
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
              margin-left: 0;
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
          Mail ID: opspd@gmail.com
        </div>
      </div>

      <div class="report-title">IIFL Personal Discussion Report</div>
        
    
      <div class="align-wrapper">
        <table class="section-table">
          <tr><td colspan="6" class="section-header">BASIC DETAILS</td></tr>
          <tr>
            <th>Prospect No.</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.prospectNo || ''}</span></td>
            <th>Name</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.name || ''}</span></td>
          </tr>
          <tr>
            <th>Marital Status</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.maritalStatus || ''}</span></td>
            <th>Educational Qualification</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.educationalQualification || ''}</span></td>
          </tr>
          <tr>
            <th>Category</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.category || ''}</span></td>
            <th>Number of Dependents</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.numberOfDependents || ''}</span></td>
          </tr>
          <tr>
            <th>Children</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.children || ''}</span></td>
            <th>Adults</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.adults || ''}</span></td>
          </tr>
          <tr>
            <th>Others</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.others || ''}</span></td>
            <th>Years in Current Residence</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.yearsInCurrentResidence || ''}</span></td>
          </tr>
          <tr>
            <th>Current Residence House Size</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.currentResidenceHouseSize || ''}</span></td>
            <th>Previous Address</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.previousAddress || ''}</span></td>
          </tr>
          <tr>
            <th>Years at Previous Address</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.yearsAtPreviousAddress || ''}</span></td>
            <th>Years in Current City</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.yearsInCurrentCity || ''}</span></td>
          </tr>
          <tr>
            <th>Previous City</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.previousCity || ''}</span></td>
            <th>Years in Previous City</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.yearsInPreviousCity || ''}</span></td>
          </tr>
          <tr>
            <th>Reason for Change</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.reasonForChange || ''}</span></td>
            <th>Parents Staying With</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.parentsStayingWith || ''}</span></td>
          </tr>
          <tr>
            <th>Usage of Property</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.usageOfProperty || ''}</span></td>
            <th>Brief Comments</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.briefComments || ''}</span></td>
          </tr>
          <tr>
            <th>Date of Case Initiated</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.dateOfCaseInitiated || ''}</span></td>
            <th>Date of Appointment</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.dateOfAppointmentProvided || ''}</span></td>
          </tr>
          <tr>
            <th>Initiated Address</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails.initiatedAddress || ''}</span></td>
          </tr>
          <tr>
            <th>Visited Address</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails.visitedAddress || ''}</span></td>
          </tr>
          <tr>
            <th>Residential Address</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails.residentialAddress || ''}</span></td>
          </tr>
          <tr>
            <th>Contact Number</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.contactNumber || ''}</span></td>
            <th>Loan Amount Required</th>
            <td colspan="2"><span class="var-value">${verificationData.basicDetails.loanAmountRequired || ''}</span></td>
          </tr>
          <tr>
            <th>Purpose of Loan</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails.purposeOfLoan || ''}</span></td>
          </tr>
          <tr>
            <th>Profile Initiated</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails.profileInitiated || ''}</span></td>
          </tr>
        </table>
      </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">FAMILY DETAILS</td></tr>
        <tr>
          <th>Family Members</th>
          <td colspan="5"><span class="var-value">${verificationData.familyDetails.familyMembers || ''}</span></td>
        </tr>
        <tr>
          <th>Applicant's Education</th>
          <td colspan="5"><span class="var-value">${verificationData.familyDetails.applicantEducation || ''}</span></td>
        </tr>
        <tr>
          <th>Native Place</th>
          <td colspan="5"><span class="var-value">${verificationData.familyDetails.nativePlace || ''}</span></td>
        </tr>
        <tr>
          <th>Business Name</th>
          <td colspan="5"><span class="var-value">${verificationData.familyDetails.businessName || ''}</span></td>
        </tr>
        <tr>
          <th>Business Type</th>
          <td colspan="5"><span class="var-value">${verificationData.familyDetails.businessType || ''}</span></td>
        </tr>
        <tr>
          <th>Years of Experience</th>
          <td colspan="5"><span class="var-value">${verificationData.familyDetails.yearsOfExperience || ''}</span></td>
        </tr>
        <tr>
          <th>Assets Used</th>
          <td colspan="5"><span class="var-value">${verificationData.familyDetails.assetsUsed || ''}</span></td>
        </tr>
        <tr>
          <th>Nature of Business</th>
          <td colspan="5"><span class="var-value">${verificationData.familyDetails.natureOfBusiness || ''}</span></td>
        </tr>
        <tr>
          <th>Daily Output & Rates</th>
          <td colspan="5"><span class="var-value">${verificationData.familyDetails.dailyOutputRates || ''}</span></td>
        </tr>
        <tr>
          <th>Materials Purchased</th>
          <td colspan="5"><span class="var-value">${verificationData.familyDetails.materialsPurchased || ''}</span></td>
        </tr>
        <tr>
          <th>No. of Workers & Salary</th>
          <td colspan="5"><span class="var-value">${verificationData.familyDetails.numberOfWorkers || ''} workers, ${verificationData.familyDetails.salary || ''}</span></td>
        </tr>
        <tr>
          <th>Customers</th>
          <td colspan="5"><span class="var-value">${verificationData.familyDetails.customers || ''}</span></td>
        </tr>
        <tr>
          <th>Business Premises</th>
          <td colspan="5"><span class="var-value">${verificationData.familyDetails.businessPremises || ''}</span></td>
        </tr>
        <tr>
          <th>Rent Paid</th>
          <td colspan="5"><span class="var-value">${verificationData.familyDetails.rentPaid || ''}</span></td>
        </tr>
        <tr>
          <th>Neighbor Enquiry Result</th>
          <td colspan="5"><span class="var-value">${verificationData.familyDetails.neighborEnquiryResult || ''}</span></td>
        </tr>
        <tr>
          <th>Concerns / Observations</th>
          <td colspan="5"><span class="var-value">${verificationData.familyDetails.concernsObservations || ''}</span></td>
        </tr>
        <tr>
          <th>Business Vintage Documents</th>
          <td colspan="2"><span class="var-value">${verificationData.familyDetails.businessVintageDocuments || ''}</span></td>
          <th>Business Name Board</th>
          <td colspan="2"><span class="var-value">${verificationData.familyDetails.businessNameBoard || ''}</span></td>
        </tr>
        <tr>
          <th>Workers Present at Visit</th>
          <td colspan="2"><span class="var-value">${verificationData.familyDetails.workersPresentAtVisit || ''}</span></td>
          <th>Kacha Records Provided</th>
          <td colspan="2"><span class="var-value">${verificationData.familyDetails.kachaRecordsProvided || ''}</span></td>
        </tr>
        <tr>
          <th>UPI Payments Provided</th>
          <td colspan="2"><span class="var-value">${verificationData.familyDetails.upiPaymentsProvided || ''}</span></td>
          <th>Address Match/Mismatch</th>
          <td colspan="2"><span class="var-value">${verificationData.familyDetails.addressMatch || ''}</span></td>
        </tr>
        <tr>
          <th>Other Observations</th>
          <td colspan="5"><span class="var-value">${verificationData.familyDetails.otherObservations || ''}</span></td>
        </tr>
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">INCOME DETAILS</td></tr>
        <tr>
          <th>Gross Receipts</th>
          <td colspan="2"><span class="var-value">${verificationData.incomeDetails.grossReceipts || ''}</span></td>
          <th>Other Income</th>
          <td colspan="2"><span class="var-value">${verificationData.incomeDetails.otherIncome || ''}</span></td>
        </tr>
        <tr>
          <th>Total (A)</th>
          <td colspan="5"><span class="var-value">${verificationData.incomeDetails.totalIncome || ''}</span></td>
        </tr>
        <tr><td colspan="6" class="section-header">Less: Expenses</td></tr>
        <tr>
          <th>Purchases</th>
          <td colspan="2"><span class="var-value">${verificationData.incomeDetails.purchases || ''}</span></td>
          <th>Salaries</th>
          <td colspan="2"><span class="var-value">${verificationData.incomeDetails.salaries || ''}</span></td>
        </tr>
        <tr>
          <th>Electricity</th>
          <td colspan="2"><span class="var-value">${verificationData.incomeDetails.electricity || ''}</span></td>
          <th>Other Expenses</th>
          <td colspan="2"><span class="var-value">${verificationData.incomeDetails.otherExpenses || ''}</span></td>
        </tr>
        <tr>
          <th>Total (B)</th>
          <td colspan="5"><span class="var-value">${verificationData.incomeDetails.totalExpenses || ''}</span></td>
        </tr>
        <tr>
          <th>Net Profit (A-B)</th>
          <td colspan="2"><span class="var-value">${verificationData.incomeDetails.netProfit || ''}</span></td>
          <th>Net Margin %</th>
          <td colspan="2"><span class="var-value">${verificationData.incomeDetails.netMargin || ''}</span></td>
        </tr>
        <tr>
          <th>Spouse Income</th>
          <td colspan="5"><span class="var-value">${verificationData.incomeDetails.spouseIncome || ''}</span></td>
        </tr>
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">REFERENCE DETAILS</td></tr>
        <tr>
          <th>References (Name & Contact No.)</th>
          <td colspan="5">
            ${verificationData.referenceDetails.references.map(ref => 
              `<span class="var-value">${ref.name} - ${ref.contactNo} (${ref.relationship})</span><br>`
            ).join('')}
          </td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">CASE STATUS</td></tr>
        <tr>
          <th>Status of the Case</th>
          <td colspan="5"><span class="var-value">${verificationData.caseStatus.status || ''} - ${verificationData.caseStatus.reason || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">PD OFFICER DETAILS</td></tr>
        <tr>
          <th>Name of PD Officer</th>
          <td colspan="2"><span class="var-value">${verificationData.pdOfficerDetails.name || ''}</span></td>
          <th>Date of Discussion</th>
          <td colspan="2"><span class="var-value">${verificationData.pdOfficerDetails.dateOfDiscussion || ''}</span></td>
        </tr>
        <tr>
          <th>Signature of PD Officer</th>
          <td colspan="5"><span class="var-value">${verificationData.pdOfficerDetails.signature || ''}</span></td>
        </tr>
      </table>
    </div>
  `
}
