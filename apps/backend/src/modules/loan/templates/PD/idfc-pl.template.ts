import { format, toZonedTime } from 'date-fns-tz';

export const idfcPlTemplate = (verificationData1: any, html_data: any) => {
    const verificationData = {
        "basicDetails": {
            "nameOfApplicant": "Jeevan Reddy",
            "sdfcId": "SDFC001234",
            "personContacted": "Jeevan Reddy",
            "visitedAddress": "Plot No 45, Hi-Tech City, Hyderabad, Telangana",
            "dateOfVisit": "2025-01-15",
            "timeOfVisit": "10:30 AM",
            "alternateContactNumber": "+91-9876543210",
            "maritalStatus": "Married"
        },
        "employmentDetails": {
            "nameOfEmployer": "BeyondScale Solutions",
            "typeOfFirm": "Proprietor",
            "numberOfEmployees": "15",
            "department": "Operations",
            "designation": "Managing Director",
            "yearsInCurrentCompany": "8",
            "previousJobDetails": "Worked as Software Engineer at Tech Corp for 4 years",
            "totalYearsOfExperience": "12",
            "levelOfActivityStocks": "High activity observed with adequate stock levels",
            "companyProfile": "IT Services"
        },
        "thirdPartyCheck": {
            "checkConducted": "Yes",
            "feedback": "Positive feedback from neighbors and business associates",
            "contactDetails": "Ramesh Kumar - +91-9876001122 (Business Associate)"
        },
        "incomeDetails": {
            "grossSalary": "₹1,50,000",
            "netSalary": "₹1,20,000",
            "overtimeDetails": "Occasional overtime - ₹5,000 per month",
            "monthlyExpenses": "₹80,000",
            "monthlyNetIncome": "₹40,000",
            "totalFamilyMembers": "4",
            "earningFamilyMembers": "2",
            "numberOfDependents": "2",
            "otherSourceOfIncome": "Investment returns - ₹10,000 per month"
        },
        "familyMembers": {
            "familyComposition": "Wife (Anitha Reddy, 32 years, Homemaker), Son (Aditya Reddy, 8 years, Student), Father (Ramesh Reddy, 65 years, Retired), Mother (Lakshmi Reddy, 60 years, Homemaker)"
        },
        "bankingDetails": {
            "bankingRelationshipWith": "HDFC Bank",
            "cashCreditLimit": "₹2,00,000",
            "overdraftLimit": "₹1,50,000"
        },
        "obligationsLoans": {
            "loans": [
                {
                    "institutionName": "ICICI Bank",
                    "typeOfLoan": "HL",
                    "monthlyEmi": "₹15,000",
                    "loanAmount": "₹25,00,000"
                },
                {
                    "institutionName": "Axis Bank",
                    "typeOfLoan": "AL",
                    "monthlyEmi": "₹8,000",
                    "loanAmount": "₹3,00,000"
                }
            ]
        },
        "residenceAssets": {
            "currentResidence": "Owned",
            "yearsAtCurrentResidence": "5",
            "assetsOwned": "House, Car, Bike",
            "fourWheeler": "Honda City 2020",
            "twoWheeler": "Bajaj Pulsar 2018"
        },
        "loanDetails": {
            "loanAmountApplied": "₹5,00,000",
            "endUse": "Business expansion and working capital requirements"
        },
        "interviewDetails": {
            "nameOfInterviewer": "PD Officer Name",
            "designation": "Personal Discussion Officer",
            "signature": "Digital Signature",
            "pdStatus": "Positive",
            "interviewerRemarks": "Applicant has stable income, good credit history, and adequate repayment capacity. Business is well established with good growth prospects."
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

        <div class="report-title">Personal Discussion Report</div>
        <div class="align-wrapper">
          <div class="branch-box">
            <table class="branch-table">
              <tr>
                <td class="branch-label">SDFC ID</td>
                <td class="branch-value" style="border-right: 1px solid #000;">${verificationData.basicDetails.sdfcId}</td>
                <td class="branch-label">Date of Visit</td>
                <td class="branch-value">${verificationData.basicDetails.dateOfVisit}</td>
              </tr>
              <tr>
                <td class="branch-label">Time of Visit</td>
                <td class="branch-value" style="border-right: 1px solid #000;">${verificationData.basicDetails.timeOfVisit}</td>
                <td class="branch-label">Marital Status</td>
                <td class="branch-value">${verificationData.basicDetails.maritalStatus}</td>
              </tr>
            </table>
          </div>
        </div>
    
        <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">BASIC DETAILS</td></tr>
        <tr>
          <th>Name of the Applicant</th>
          <td colspan="5"><span class="var-value">${verificationData.basicDetails.nameOfApplicant || ''}</span></td>
        </tr>
        <tr>
          <th>Person Contacted</th>
          <td colspan="5"><span class="var-value">${verificationData.basicDetails.personContacted || ''}</span></td>
        </tr>
        <tr>
          <th>Visited Address</th>
          <td colspan="5"><span class="var-value">${verificationData.basicDetails.visitedAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Alternate Contact Number</th>
          <td colspan="5"><span class="var-value">${verificationData.basicDetails.alternateContactNumber || ''}</span></td>
        </tr>
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">EMPLOYMENT DETAILS</td></tr>
        <tr>
          <th>Name of the Employer</th>
          <td colspan="5"><span class="var-value">${verificationData.employmentDetails.nameOfEmployer || ''}</span></td>
        </tr>
        <tr>
          <th>Type of Firm</th>
          <td colspan="5"><span class="var-value">${verificationData.employmentDetails.typeOfFirm || ''}</span></td>
        </tr>
        <tr>
          <th>Number of Employees</th>
          <td colspan="5"><span class="var-value">${verificationData.employmentDetails.numberOfEmployees || ''}</span></td>
        </tr>
        <tr>
          <th>Department</th>
          <td colspan="5"><span class="var-value">${verificationData.employmentDetails.department || ''}</span></td>
        </tr>
        <tr>
          <th>Designation</th>
          <td colspan="5"><span class="var-value">${verificationData.employmentDetails.designation || ''}</span></td>
        </tr>
        <tr>
          <th>Years in Current Company</th>
          <td colspan="5"><span class="var-value">${verificationData.employmentDetails.yearsInCurrentCompany || ''}</span></td>
        </tr>
        <tr>
          <th>Previous Job Details / Work Experience</th>
          <td colspan="5"><span class="var-value">${verificationData.employmentDetails.previousJobDetails || ''}</span></td>
        </tr>
        <tr>
          <th>Total Years of Experience</th>
          <td colspan="5"><span class="var-value">${verificationData.employmentDetails.totalYearsOfExperience || ''}</span></td>
        </tr>
        <tr>
          <th>Level of Activity & Stocks (Observations)</th>
          <td colspan="5"><span class="var-value">${verificationData.employmentDetails.levelOfActivityStocks || ''}</span></td>
        </tr>
        <tr>
          <th>Company Profile</th>
          <td colspan="5"><span class="var-value">${verificationData.employmentDetails.companyProfile || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">THIRD PARTY CHECK</td></tr>
        <tr>
          <th>Check Conducted</th>
          <td colspan="2"><span class="var-value">${verificationData.thirdPartyCheck.checkConducted || ''}</span></td>
          <th>Feedback</th>
          <td colspan="2"><span class="var-value">${verificationData.thirdPartyCheck.feedback || ''}</span></td>
        </tr>
        <tr>
          <th>Contact Details</th>
          <td colspan="5"><span class="var-value">${verificationData.thirdPartyCheck.contactDetails || ''}</span></td>
        </tr>
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">INCOME DETAILS</td></tr>
        <tr>
          <th>Gross Salary</th>
          <td colspan="2"><span class="var-value">${verificationData.incomeDetails.grossSalary || ''}</span></td>
          <th>Net Salary</th>
          <td colspan="2"><span class="var-value">${verificationData.incomeDetails.netSalary || ''}</span></td>
        </tr>
        <tr>
          <th>Overtime Details (if any)</th>
          <td colspan="5"><span class="var-value">${verificationData.incomeDetails.overtimeDetails || ''}</span></td>
        </tr>
        <tr>
          <th>Monthly Expenses</th>
          <td colspan="2"><span class="var-value">${verificationData.incomeDetails.monthlyExpenses || ''}</span></td>
          <th>Monthly Net Income</th>
          <td colspan="2"><span class="var-value">${verificationData.incomeDetails.monthlyNetIncome || ''}</span></td>
        </tr>
        <tr>
          <th>Total No. of Family Members</th>
          <td colspan="2"><span class="var-value">${verificationData.incomeDetails.totalFamilyMembers || ''}</span></td>
          <th>Earning Family Members</th>
          <td colspan="2"><span class="var-value">${verificationData.incomeDetails.earningFamilyMembers || ''}</span></td>
        </tr>
        <tr>
          <th>No. of Dependents</th>
          <td colspan="2"><span class="var-value">${verificationData.incomeDetails.numberOfDependents || ''}</span></td>
          <th>Other Source of Income</th>
          <td colspan="2"><span class="var-value">${verificationData.incomeDetails.otherSourceOfIncome || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">FAMILY MEMBERS</td></tr>
        <tr>
          <th>Family Composition</th>
          <td colspan="5"><span class="var-value">${verificationData.familyMembers.familyComposition || ''}</span></td>
        </tr>
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">BANKING DETAILS</td></tr>
        <tr>
          <th>Banking Relationship With</th>
          <td colspan="5"><span class="var-value">${verificationData.bankingDetails.bankingRelationshipWith || ''}</span></td>
        </tr>
        <tr>
          <th>Cash Credit Limit</th>
          <td colspan="2"><span class="var-value">${verificationData.bankingDetails.cashCreditLimit || ''}</span></td>
          <th>Overdraft Limit</th>
          <td colspan="2"><span class="var-value">${verificationData.bankingDetails.overdraftLimit || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">OBLIGATIONS / LOANS</td></tr>
        <tr>
          <th>Institution / Bank / NBFC Name</th>
          <th>Type of Loan</th>
          <th>Monthly Principal / EMI</th>
          <th>Loan Amount (Rs. Lacs)</th>
        </tr>
        ${Array.isArray(verificationData.obligationsLoans.loans) && verificationData.obligationsLoans.loans.length > 0
          ? verificationData.obligationsLoans.loans.map(loan => `
            <tr>
              <td><span class="var-value">${loan.institutionName || ''}</span></td>
              <td><span class="var-value">${loan.typeOfLoan || ''}</span></td>
              <td><span class="var-value">${loan.monthlyEmi || ''}</span></td>
              <td><span class="var-value">${loan.loanAmount || ''}</span></td>
            </tr>
          `).join('')
          : '<tr><td colspan="4" style="text-align: center;">No existing loans</td></tr>'}
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">RESIDENCE & ASSETS</td></tr>
        <tr>
          <th>Current Residence</th>
          <td colspan="5"><span class="var-value">${verificationData.residenceAssets.currentResidence || ''}</span></td>
        </tr>
        <tr>
          <th>Years at Current Residence</th>
          <td colspan="5"><span class="var-value">${verificationData.residenceAssets.yearsAtCurrentResidence || ''}</span></td>
        </tr>
        <tr>
          <th>Assets Owned</th>
          <td colspan="5"><span class="var-value">${verificationData.residenceAssets.assetsOwned || ''}</span></td>
        </tr>
        <tr>
          <th>Four Wheeler (Make/Model)</th>
          <td colspan="2"><span class="var-value">${verificationData.residenceAssets.fourWheeler || ''}</span></td>
          <th>Two Wheeler (Make/Model)</th>
          <td colspan="2"><span class="var-value">${verificationData.residenceAssets.twoWheeler || ''}</span></td>
        </tr>
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">LOAN DETAILS (BIL)</td></tr>
        <tr>
          <th>Loan Amount Applied</th>
          <td colspan="5"><span class="var-value">${verificationData.loanDetails.loanAmountApplied || ''}</span></td>
        </tr>
        <tr>
          <th>End Use</th>
          <td colspan="5"><span class="var-value">${verificationData.loanDetails.endUse || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">INTERVIEW DETAILS</td></tr>
        <tr>
          <th>Name of Interviewer</th>
          <td colspan="2"><span class="var-value">${verificationData.interviewDetails.nameOfInterviewer || ''}</span></td>
          <th>Designation</th>
          <td colspan="2"><span class="var-value">${verificationData.interviewDetails.designation || ''}</span></td>
        </tr>
        <tr>
          <th>Signature</th>
          <td colspan="5"><span class="var-value">${verificationData.interviewDetails.signature || ''}</span></td>
        </tr>
        <tr>
          <th>PD Status</th>
          <td colspan="5"><span class="var-value">${verificationData.interviewDetails.pdStatus || ''}</span></td>
        </tr>
        <tr>
          <th>Interviewer's Remarks</th>
          <td colspan="5"><span class="var-value">${verificationData.interviewDetails.interviewerRemarks || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
        <br><br>
        <strong>Disclaimer:</strong> This report has been prepared based on the information provided by the applicant and observations made during the personal discussion. The accuracy of the information is subject to verification through appropriate documentation.
        <br><br>
        <strong>Note:</strong> IDFC First Bank shall be solely responsible for any actions taken based on this report. Our services shall not be liable for any direct or indirect consequences arising from such actions.
    </div>
    `
}
