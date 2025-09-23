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

        <div class="report-title">Personal Discussion Sheet(PD)</div>
        <div class="align-wrapper">
          <div class="branch-box">
            <table class="branch-table">
              <tr>
                <td colspan="6" class="section-header">Reference Number - ${verificationData.basicDetails.applicationNumber}</td>
              </tr>
            </table>
          </div>
        </div>
    
      <div class="align-wrapper">
        <table class="section-table">
          <tr>
            <th>Name of the Firm</th>
              <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
          </tr>
          <tr>
            <th>Constitution</th>
            <td colspan="2"><span class="var-value">${verificationData.businessDetails.constitution || ''}</span></td>
            <th>Incorporation Date</th>
            <td colspan="2"><span class="var-value">${verificationData.businessDetails.incorporationDate || ''}</span></td>
          </tr>
          <tr>
            <th>Address of the Firm</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessAddress || ''}</span></td>
          </tr>
          <tr>
            <th>Date & Time of PD</th>
            <td colspan="2"><span class="var-value">${html_data?.date_of_visit || ''}</span></td>
            <th>Place of PD</th>
            <td colspan="2"><span class="var-value">${html_data?.place_of_pd || ''}</span></td>
          </tr>
          <tr>
            <th>Name of Person Met</th>
            <td colspan="2"><span class="var-value">${verificationData.applicantDetails.personMet || ''}</span></td>
            <th>Designation</th>
            <td colspan="2"><span class="var-value">${html_data?.designation || ''}</span></td>
          </tr>
          <tr>
            <th>Name of PD Officer</th>
            <td colspan="5"><span class="var-value">${html_data?.pd_officer || ''}</span></td>
          </tr>
          <tr><td colspan="6" class="section-header">BUSINESS PROFILE</td></tr>
          <tr>
            <th>Type fo Industry</th>
            <td colspan="5"><span class="var-value">${html_data?.type_of_industry || ''}</span></td>
          </tr>
          <tr>
            <th>Nature of Business</th>
            <td colspan="5"><span class="var-value">${html_data?.type_of_industry || ''}</span></td>
          </tr>
          <tr>
            <th>Business Governance & Operations</th>
            <td colspan="5"><span class="var-value">${html_data?.type_of_industry || ''}</span></td>
          </tr>
          <tr>
            <th>Business Line Experience</th>
            <td colspan="5"><span class="var-value">${html_data?.type_of_industry || ''}</span></td>
          </tr>
        </table>
      </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr>
          <th>Shareholding Details</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessActivity || ''}</span></td>
        </tr>
        <tr>
          <th>Business Locality</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.typeOfBusiness || ''}</span></td>
        </tr>
        <tr>
          <th>Business Premise setup / Ownership / Nameplate / Staff etc.</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.netMargin || ''}</span></td>
        </tr>
        <tr>
          <th>Financial Brief</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessStartYear || ''}</span></td>
        </tr>
        <tr>
          <th>End use of the Loan & Loan amount Required</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.occupiedSince || ''}</span></td>
        </tr>
        <tr>
          <th>Other Businesses owned & Other Incomes</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.numberOfEmployees || ''}</span></td>
        </tr>
        <tr>
          <th>Business License Information</th>
          <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Documents Provided</th>
          <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Banking & Working Capital Limit Information</th>
          <td colspan="5"><span class="var-value">Applicant manages all the business activities</span></td>
        </tr>
        <tr>
          <th>Is it a Takeover</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessStartYear} years</span></td>
        </tr>
    </table>
    </div>


    <div class="align-wrapper">
      <table class="section-table">
        <tr>
          <th>Current Account Details</th>
          <td colspan="5"><span class="var-value">${verificationData.applicantDetails.currentAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Collateral Security Details</th>
          <td colspan="5"><span class="var-value">${verificationData.applicantDetails.currentAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Existing Banking Relations with Axis if any</th>
          <td colspan="5"><span class="var-value">${verificationData.applicantDetails.currentAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Major Suppliers & Clients</th>
          <td colspan="5"><span class="var-value">${verificationData.applicantDetails.currentAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Stocks/Raw material related observations</th>
          <td colspan="5"><span class="var-value">${verificationData.applicantDetails.currentAddress || ''}</span></td>
        </tr>
        <tr>
          <th>COVID-19 Impact & Recovery period Or any other Business Risks</th>
          <td colspan="5"><span class="var-value">${verificationData.applicantDetails.currentAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Family Background & Net-worth</th>
          <td colspan="5"><span class="var-value">${verificationData.applicantDetails.currentAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Business Succession Plan</th>
          <td colspan="5"><span class="var-value">${verificationData.applicantDetails.currentAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Qualification of Proprietor / Partners / Directors</th>
          <td colspan="5"><span class="var-value">${verificationData.applicantDetails.currentAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Lease land Verification</th>
          <td colspan="5"><span class="var-value">${verificationData.applicantDetails.currentAddress || ''}</span></td>
        </tr>
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr>
          <th>Remarks & Observations</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessActivity || ''}</span></td>
        </tr>
        <tr>
          <th>PD Final Status</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.typeOfBusiness || ''}</span></td>
        </tr>
        <tr>
          <th>PD Vendor Name & Address</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.netMargin || ''}</span></td>
        </tr>
    </table>
    </div>
  `
}