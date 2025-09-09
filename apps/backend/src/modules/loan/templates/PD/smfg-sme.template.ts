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
    <th>Branch Name </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th>Application Reference No</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  
  <tr>
    <th> Applicant Name</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th>Applicant Office Address</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Person Met - Name, Designation & Mobile No</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Personal Information:</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
    <tr>
    <th> Details of family members name, age and occupation: (pls tick on dependents):</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
    <tr>
    <th> Residence Address</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
    <tr>
    <th>Whether self owned/parental/rented</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
    <tr>
    <th> Area of the house property and estimated market value</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
    <tr>
    <th> No. of Years at same Residence</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> No. of Years in same city</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> Permanent Address</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> Details of other owned property in the city</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> Any other source of income apart from this business</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> Business Information</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th> Name of Business</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
   <tr>
    <th>Nature of Business</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr> 
  <tr>
    <th> Constitution</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr> 
  <tr>
    <th> Name of Partners/Directors and share %</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Type of Customer</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Stability in same business - No of Years</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Whether the stability was verified by any Registration certificate / distribution / dealership letter displayed in shop / office / Factory</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Family Structure involved in Business</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Business Premises whether owned or rented</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Actual monthly sales/Receipts as per Customer</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> What % sales is done on credit</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Manufacturing process / Trading details</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Whether sales concentration is >50% on one party. If yes name of Party and contact no</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Business Cycle -How many days credit allowed to Debtors and what are actual debtors amount as on date </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Business Cycle - How many days credit allowed by creditors to CM and what are actual Creditors amount as on date</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Business Cycle – What is stock valuation as on date</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Gross & Net margins % in Business</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Monthly Net saving after all expenses in Rs </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Name and contact no of two major suppliers </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Name and contact no of two major buyers </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> No of Employees</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Name board seen if yes what was written </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th>Locality of Business/Office </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Whether Residence cum office set up </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Applicability of VAT / Excise / Service tax and rate of same </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Latest Qtr VAT return value/Service tax paid </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Environmental and Social Safeguards (ESS) </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Is the entity involved in any commercial pest control operation,  use any Ozone depleting substance, hazardous chemicals, bio medical waste, Dyes, forest products, tobacco, alcohol, weapons, gambling, radioactive materials, unbounded asbestos, harmful fishing practice, commercial logging.</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Does the entity involve in Child or forced Labour or business involve displacement of people, impact on indigenous people or established in land designated as forest or forest products</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Does the entity have required consent of establishment from State pollution control board and other government authorities on establishment in  Wetland Area, near National Park, Sanctuaries or Forest areas, ASI certificate for establishment up to 300 meters near a protected monument or cultural heritage, 500 meters near Coastal Regulation Zone</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Does the entity involves in proper mechanism for treatment or disposal of waste and does not emit air, water or noise pollutants.</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Does the Entity comply with the above ESS guidelines </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Customer Behavior</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Detailed purpose/End use of Loan Amount</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  
  <tr>
    <th> Detailed observations (Positive and Negative)</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th>Status of PD </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> PD conducted by:</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Name : HARISH </th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Signature :</th>
      <td colspan="5"><span class="var-value">${verificationData.basicDetails.businessName || ''}</span></td>
  </tr>
  <tr>
    <th> Date:  09-05-2025 </th>
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