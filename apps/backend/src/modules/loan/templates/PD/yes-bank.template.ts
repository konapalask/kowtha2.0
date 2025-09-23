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
    <th>Name of the Main applicant </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th>PD done with and Relation with applicant</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Address of the Visit with Landmark</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  tr>
    <th>CAS ID</th>
    <td colspan="2"><span class="var-value">${verificationData.businessDetails.constitution || ''}</span></td>
    <th>Product (AFHL/MLAP)</th>
    <td colspan="2"><span class="var-value">${verificationData.businessDetails.incorporationDate || ''}</span></td>
  </tr>
  <tr>
    <th> PD Visit date and time</th>
    <td colspan="2"><span class="var-value">${verificationData.businessDetails.constitution || ''}</span></td>
    <th>Contact number </th>
    <td colspan="2"><span class="var-value">${verificationData.businessDetails.incorporationDate || ''}</span></td>
  </tr>
  <tr>
    <th>Loan Applied Amt </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Tenor Required </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th>Address visited Type (Residence/Business/Employment place) </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  
    <tr>
    <th> Applicant 
Business
Educational background 
Past experience </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
    <tr>
    <th> Co-Applicant 
Business
Employment
Educational background 
Past experience </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
    <tr>
    <th>Parents Occupation/Business/Employment background </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
    <tr>
    <th> Details of children (studying/working) </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
<tr>
<th> Siblings Business/Employment background (if residing together)</th>
 <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> Name of the Business / Employment</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> Constitution of Business Entity (Proprietorship, Partnership, Ltd. Co.)</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> Name of Proprietor, Partners/Shareholders with % share of each </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> No of Years in Current Business </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> Business profile (to include nature of industry, product preference in the market, competition, seasonality, and other aspects of business </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> Whether GST registered (if Yes, since when GST registration exist) </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th>Details of any other proof of business existence /stability available/verified during visit </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr> 
  <tr>
    <th> Average Monthly sales/ receipts </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr> 
  <tr>
    <th> Average monthly purchase </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Gross margin on the on goods sold </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Overheads to run the business (Indirect expenses) </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Net monthly profit from business </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Stock level </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th>Description about major customers along with credit terms </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Description about major suppliers along with credit terms </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Business set up details </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Infrastructure and manpower details (to include Business / factory details, plant capacity utilization and staff strength etc) </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Details of other owned Assets (Property, Land etc) / Investment Details (FD, MF, Share etc) </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th>Details of other Source of Income (Rental income, Agri income, Interest income etc) </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Monthly total Household expenses </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th>Collateral Details (for MLAP) – Capture Type, Occupancy status, Year of purchase, Parental owned etc </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
<th> MLAP (End use in detail), (In case of BT Loan/Loan consolidation, capture end use of earlier loans), (For LCP - capture Cost, AV, source of OCR etc)</th>
<td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Premise Address </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>

  </tr>
  <tr>
    <th> Ownership status (Rented/Owned, Parental)  </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th>Owned /rented since when (number of Years) </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Details of Proof of ownership (if available /documented) </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Rented premised verification status </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th>Rent per month (if rented) </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Locality comment (Middle class/Upper middle class/Lower middle class/Lower class/Tin roof) </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Whether Property already Mortgage (if same is owned) – mention Bank/NBFC name </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> QR code check status (for retail counters on best effort basis) – Positive /Negative </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Premise visit comment (whichever visited), also attach visit Pics with selfie </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Reference type (Nearby business premises, Buyer, Suppliers) </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th>  Name of Shop/Business premises with whom ref check done </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th>  Name of person spoken to</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Feedback on business stability, vintage of business, Volume of business, Payment regularity, Capture contact number of person as well (in case ref check done from Suppliers/Buyer)</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Any other Ref check feedback </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th>Ref Check status (Positive, Negative, Neutral)</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Residence Ref check (if visited)</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
<th>Reference type (from neighbors, nearby Grocery stores, sweets shops, Dairy etc.)</th>
 <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
 </tr>
 <tr>
    <th>Name of Person, Shop/Business premises with whom ref check done </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Name of person spoken to </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Feedback on applicant’s behavior, Involvement in Negative activity, Vintage at residence, involvement in political activity etc </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Any other Ref check feedback </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Ref Check status (Positive, Negative, Neutral) </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> Interviewer’s overall comments, along with explanations </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> Level of Activity & Stocks observed Along with other Observations </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> RPD Status </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr> 
  <tr>
    <th> Remarks for Positive, Negative and Referred Cases </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> Name of the YBL Employee </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> Designation </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> EMP ID </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Signature </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>htmldata.py
  <tr>
    <th> PD agency Interviewer’s Name </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Report Processed By </th>
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