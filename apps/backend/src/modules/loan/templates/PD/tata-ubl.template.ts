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
    <th>Name of  applicant </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th>Name of Entity </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Name of Co-Applicant(s)</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  tr>
    <th>ProposedLoan Details </th>
    <td colspan="2"><span class="var-value">${verificationData.businessDetails.constitution || ''}</span></td>
    </tr>
  <tr>
    <th> Office Address </th>
    <td colspan="2"><span class="var-value">${verificationData.businessDetails.constitution || ''}</span></td>
    </tr>
  <tr>
    <th>Residential Address </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Address of PD </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th>Family Details </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  
    <tr>
    <th> Current Business Details </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
    <tr>
    <th> Stock as on date</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
    <tr>
    <th>Employees Details </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
    <tr>
    <th> Bank Details </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
<tr>
<th>Sales and Profit Details </th>
 <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> Customer Details </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> Supplier Details </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> Other Business/ Income Details (if any) </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th>Assets </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> Liabilities </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> End Use of proposed Loan </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> Political Connection </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr> 
  <tr>
    <th> Any Court Cases </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr> 
  <tr>
    <th> Business belongs to which industry </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Value Added Information </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Strengths </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Weaknesses </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Site Visit Observations </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th>Third Party Confirmation </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Pan Card </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th>Document Seen</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Final Status  </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Date of PD: </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th>Person met at the time of PD: </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Phone No. of Applicant: </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th>PD done by: </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
<th> Latitude and Longitude </th>
<td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
<th> Person Interviewed / Met: </th>
 <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
</tr>
  <tr>
    <th> Designation  </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Signature </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
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
        </table>
      </div>


  `
}