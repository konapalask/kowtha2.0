import { format, toZonedTime } from 'date-fns-tz';
import { category } from 'google-play-scraper';


export const axisagriTemplate = (verificationData1: any, html_data: any) => {
    const verificationData = {
      "basicDetails": {
        "aadhar": "1234-5678-9012",
        "panNumber": "ABCDE1234F",
        "businessName": "BeyondScale Solutions",
        "applicantName": "Jeevan Reddy",
        "applicantNumber": "+91-9876543210",
        "applicationNumber": "1234567890",
        "businessAddress": "Plot No 45, Hi-Tech City, Hyderabad, Telangana",
        "bankName": "HDFC Bank"
      },
      "businessDetails": {
        "typeOfBusiness": "Retail",
        "numberOfEmployees": "10",
        "businessActivity": "Electronics Sales",
        "businessActivityOther": "",
        "constitution": "Proprietorship",
        "natureOfBusiness": "Trading",
        "stockSeen": "Yes",
        "businessStartYear": "2015",
        "occupiedSince": "2016",
        "netMargin": "15%",
        "businessPremisesSize": "1200 sqft",
        "rawMaterialSupply": "Local Vendors",
        "supplierRelationDuration": "5 years",
        "incorporationDate": "2015-01-01"
      },
      "applicantDetails": {
        "currentAddress": "Flat 301, Sunshine Apartments, Hyderabad",
        "assets": "Car, Bike",
        "purposeOfLoan": "Business Expansion",
        "personMet": "Applicant",
        "educationQualification": "MBA",
        "incomeDetails": "Monthly Income: ₹1,50,000",
        "nameOfCoApplicant": "Anitha Reddy",
        "relationWithApplicant": "Spouse",
        "maritalStatus": "Married",
        "houseSize": "1500 sqft",
        "workExperience": "12 years",
        "purchase": "Latest Inventory Worth ₹5,00,000"
      },
      "uploadedItems": [
        {
          "id": "1",
          "uri": "file://local/image1.jpg",
          "type": "Aadhar",
          "timestamp": "2025-09-02T10:30:00Z",
          "s3ImageUrl": "https://s3.amazonaws.com/bucket/image1.jpg"
        },
        {
          "id": "2",
          "uri": "file://local/image2.jpg",
          "type": "Business Premises",
          "timestamp": "2025-09-02T10:35:00Z",
          "s3ImageUrl": "https://s3.amazonaws.com/bucket/image2.jpg"
        }
      ],
      "thirdPartyCheck": {
        "checks": [
          {
            "tpcName": "Ramesh Kumar",
            "comments": "Applicant is well known and trustworthy",
            "relationship": "Supplier",
            "mobileNumber": "+91-9876001122",
            "feedbackStatus": "Positive"
          },
          {
            "tpcName": "Suresh Reddy",
            "comments": "Regular customer of the applicant's business",
            "relationship": "Neighbor",
            "mobileNumber": "+91-9876554321",
            "feedbackStatus": "Neutral"
          }
        ]
      },
      "existingLoans": {
        "loans": [
          {
            "emi": "₹10,000",
            "tenure": "24 months",
            "purpose": "Business Working Capital",
            "bankName": "ICICI Bank",
            "loanAmount": "₹2,00,000"
          },
          {
            "emi": "₹8,000",
            "tenure": "36 months",
            "purpose": "Vehicle Purchase",
            "bankName": "Axis Bank",
            "loanAmount": "₹3,00,000"
          }
        ]
      },
      "familyMemberDetails": [
        {
          "age": "35",
          "name": "Anitha Reddy",
          "relation": "Spouse",
          "otherRelation": "",
          "employmentType": "Homemaker",
          "educationalQualification": "Graduate"
        },
        {
          "age": "8",
          "name": "Aditya Reddy",
          "relation": "Son",
          "otherRelation": "",
          "employmentType": "Student",
          "educationalQualification": "Primary School"
        }
      ]
    }
    ;
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
              font-weight: normal;
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

      <div class="report-title">Personal Discussion Sheet</div>
        
    
      <div class="align-wrapper">
        <table class="section-table">
          <tr>
            <th>Region</th>
            <td colspan="4"><span class="var-value">${verificationData.businessDetails.constitution || ''}</span></td>
            <th>Location</th>
            <td colspan="4"><span class="var-value">${verificationData.businessDetails.incorporationDate || ''}</span></td>
            <th>Branch</th>
            <td colspan="4"><span class="var-value">${verificationData.businessDetails.incorporationDate || ''}</span></td>
            <th>Ref No/Application No</th>
            <td colspan="4"><span class="var-value">${verificationData.businessDetails.incorporationDate || ''}</span></td>
          </tr>
          <tr>
            <th>Name of the Customer</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessAddress || ''}</span></td>
          </tr>
          <tr>
            <th>Date of Report</th>
            <td colspan="5"><span class="var-value">${html_data?.pd_officer || ''}</span></td>
          </tr>
          <tr>
            <th>Name of Concern</th>
            <td colspan="5"><span class="var-value">${html_data?.type_of_industry || ''}</span></td>
          </tr>
          <tr>
            <th>Constitution</th>
            <td colspan="5"><span class="var-value">${html_data?.type_of_industry || ''}</span></td>
          </tr>
          <tr>
            <th>Initiated Address</th>
            <td colspan="5"><span class="var-value">${html_data?.type_of_industry || ''}</span></td>
          </tr>
          <tr>
            <th>Visited Address</th>
            <td colspan="5"><span class="var-value">${html_data?.type_of_industry || ''}</span></td>
          </tr>
          <tr><td colspan="6" class="section-header">BORROWER DETAILS</td></tr>
          <tr>
          <th>Phone No</th>
            <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessActivity || ''}</span></td>
          </tr>
          <tr>
            <th>Appointment Fixed Date</th>
            <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessStartYear} years</span></td>
          </tr>
          <tr>
            <th>Structure of Loan</th>
            <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessStartYear} years</span></td>
          </tr>
          <tr>
            <th>No of Visit</th>
            <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessStartYear} years</span></td>
          </tr>
          <tr>
            <th>Person Met</th>
            <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessStartYear} years</span></td>
          </tr>
          <tr>
            <th>Visited By</th>
            <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessStartYear} years</span></td>
          </tr>
          <tr>
            <th>About Applicant</th>
            <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessStartYear} years</span></td>
          </tr>
          <tr>
            <th>Residential Details</th>
            <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessStartYear} years</span></td>
          </tr>
          <tr>
            <th>Co-Applicant Details</th>
            <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessStartYear} years</span></td>
          </tr>
        </table>
      </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Shareholding Details</td></tr>

        <tr>
          <th>Name of Shareholder</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessActivity || ''}</span></td>
        </tr>
        <tr>
          <th>Percentage of Shareholding</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.typeOfBusiness || ''}</span></td>
        </tr>
        <tr>
          <th>Relationship with Applicant</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.netMargin || ''}</span></td>
        </tr>
        <tr>
          <th>Designation</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessStartYear || ''}</span></td>
        </tr>
        <tr>
          <th>Coming into Loan Structure</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.occupiedSince || ''}</span></td>
        </tr>
        <tr>
          <th>Functional of Partner/Director</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.numberOfEmployees || ''}</span></td>
        </tr>
        <tr>
          <th>About the Business</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessStartYear} years</span></td>
        </tr>
        <tr>
          <th>Documents Observed</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessStartYear} years</span></td>
        </tr>
    </table>
    </div>


    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Suppliers/Creditors</td></tr>
        <tr>
          <th>No of Fixed Suppliers</th>
          <td colspan="5"><span class="var-value">${verificationData.applicantDetails.currentAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Credit Period</th>
          <td colspan="5"><span class="var-value">${verificationData.applicantDetails.currentAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Cash-Cheque Proportion</th>
          <td colspan="5"><span class="var-value">${verificationData.applicantDetails.currentAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Top 3 Suppliers</th>
          <td colspan="5"><span class="var-value">${verificationData.applicantDetails.currentAddress || ''}</span></td>
        </tr>
        <tr><td colspan="6" class="section-header">Clients/Debtors</td></tr>
        <tr>
          <th>No of Fixed Customers</th>
          <td colspan="5"><span class="var-value">${verificationData.applicantDetails.currentAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Credit Period</th>
          <td colspan="5"><span class="var-value">${verificationData.applicantDetails.currentAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Cash-Cheque Proportion</th>
          <td colspan="5"><span class="var-value">${verificationData.applicantDetails.currentAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Top 3 Customers</th>
          <td colspan="5"><span class="var-value">${verificationData.applicantDetails.currentAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Average Stock Maintainance</th>
          <td colspan="5"><span class="var-value">${verificationData.applicantDetails.currentAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Turnover & Margins</th>
          <td colspan="5"><span class="var-value">${verificationData.applicantDetails.currentAddress || ''}</span></td>
        </tr>
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Expenditure</td></tr>
        <tr><td colspan="6" class="section-header">Salaries & Wages</td></tr>
        <tr>
          <th>No of Employees</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessActivity || ''}</span></td>
        </tr>
        <tr>
          <th>Salary Per month per employee</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.typeOfBusiness || ''}</span></td>
        </tr>
        <tr>
          <th>Status of Employee</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.netMargin || ''}</span></td>
        </tr>
        <tr>
          <th>No. of Labours</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.netMargin || ''}</span></td>
        </tr>
        <tr>
          <th>Wages per month/per day</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.netMargin || ''}</span></td>
        </tr>
        <tr>
          <th>Status of Labour</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.netMargin || ''}</span></td>
        </tr>
        <tr>
          <th>Remarks</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.netMargin || ''}</span></td>
        </tr>
        <tr>
          <th>Working Hours</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.netMargin || ''}</span></td>
        </tr>
        <tr>
          <th>Other Major Expenditure</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.netMargin || ''}</span></td>
        </tr>
        <tr><td colspan="6" class="section-header">Asset Details</td></tr>
        <tr><td colspan="6" class="section-header">All Immovable properties held that is Residential, Commercial, Land, Plot and any fixed structure</td></tr>
        <tr>
          <th>Address</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.netMargin || ''}</span></td>
        </tr>
        <tr>
          <th>Area Measured in Sq.ft</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.netMargin || ''}</span></td>
        </tr>
        <tr>
          <th>Purchase Cost in Lakhs</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.netMargin || ''}</span></td>
        </tr>
        <tr>
          <th>Purchase Year</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.netMargin || ''}</span></td>
        </tr>
        <tr>
          <th>Market Value in Lakhs</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.netMargin || ''}</span></td>
        </tr>
        <tr>
          <th>Owner Name</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.netMargin || ''}</span></td>
        </tr>
        <tr>
          <th>Mortgaged</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.netMargin || ''}</span></td>
        </tr>
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">

        <tr>
          <th>Any Liquid, Moveable & Monetary items such as Cash,Gold, FD, RD, Mutual Fund Holdings, Shares, Bonds,Securities </th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessActivity || ''}</span></td>
        </tr>
        <tr>
          <th>Life Insurance, Mediclaim, Property/Asset Insurance(Premium & Sum Assured) </th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.typeOfBusiness || ''}</span></td>
        </tr>
        <tr>
          <th>Capital invested in any business, Loans & Advances given</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.netMargin || ''}</span></td>
        </tr>
        <tr>
          <th>Car, Bike and any other vehicle (Company Name and Model)</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessStartYear || ''}</span></td>
        </tr>
        <tr>
          <th>Exisiting EMI's/Loans</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.occupiedSince || ''}</span></td>
        </tr>
        <tr>
          <th>TPCs</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.numberOfEmployees || ''}</span></td>
        </tr>
        <tr>
          <th>Observations</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.numberOfEmployees || ''}</span></td>
        </tr>
        <tr>
          <th>Other Income: (Income from other than initiated business)</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.numberOfEmployees || ''}</span></td>
        </tr>
        <tr>
          <th>Site Coordinates</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.numberOfEmployees || ''}</span></td>
        </tr>
        <tr>
          <th>Remarks</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.numberOfEmployees || ''}</span></td>
        </tr>
        <tr>
          <th>Status</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.numberOfEmployees || ''}</span></td>
        </tr>
        <tr>
          <th>AFL Verifier's Name & Emp Code</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.numberOfEmployees || ''}</span></td>
        </tr>
        <tr>
          <th>AFL Verifier's Signature</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.numberOfEmployees || ''}</span></td>
        </tr>
    </table>
    </div>
  `
}