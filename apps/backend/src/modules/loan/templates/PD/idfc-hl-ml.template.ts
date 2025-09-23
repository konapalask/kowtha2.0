import { format, toZonedTime } from 'date-fns-tz';

export const idfcHlMlTemplate = (verificationData1: any, html_data: any) => {
    const verificationData = {
        "generalDetails": {
            "nameOfApplicant": "Jeevan Reddy",
            "nameOfCoApplicants": "Anitha Reddy (Spouse)",
            "referenceNumber": "REF001234",
            "product": "Home Loan",
            "customerCategory": "Salaried",
            "dateOfInitiation": "2025-01-10",
            "dateOfCustomerAvailability": "2025-01-15",
            "dateOfPD": "2025-01-20",
            "numberOfVisitsMade": "1",
            "personMet": "Jeevan Reddy",
            "placeAndAddressOfVisit": "Plot No 45, Hi-Tech City, Hyderabad, Telangana",
            "ownedRental": "Owned",
            "whetherNameBoardSeen": "Yes"
        },
        "personalDetails": {
            "nameOfApplicant": "Jeevan Reddy",
            "phoneNoOfApplicant": "+91-9876543210",
            "panNo": "ABCDE1234F",
            "educationalQualification": "MBA",
            "roleInBusiness": "Managing Director",
            "detailsOfFamilyMembers": "Wife (Anitha Reddy, 32 years, Homemaker), Son (Aditya Reddy, 8 years, Student), Father (Ramesh Reddy, 65 years, Retired)",
            "residenceAddress": "Flat 301, Sunshine Apartments, Hyderabad, Telangana",
            "natureOfResidence": "Owned",
            "noOfYearsInSameAddress": "5",
            "noOfYearsInSameCity": "8",
            "permanentAddress": "Same as residence address",
            "nameOfCoApplicantsAndRelationship": "Anitha Reddy (Spouse)"
        },
        "businessWorkDetails": {
            "nameOfEntityEmployerName": "BeyondScale Solutions",
            "constitution": "Proprietorship",
            "briefOnBusinessModel": "IT Services and Software Development",
            "natureOfBusiness": "Technology Services",
            "yearOfIncorporation": "2015",
            "businessActivelyManagedBy": "Self",
            "numberOfYearsInBusiness": "8",
            "totalWorkExperience": "12",
            "businessStartedBy": "Self",
            "previousWorkExperience": "Software Engineer at Tech Corp (2010-2015)",
            "nameOfDirectorsAndShareholding": "N/A (Proprietorship)",
            "registeredWithShopEstablishmentAct": "Yes, Regn No: SE/2015/001234"
        },
        "operationalDetails": {
            "natureOfBusiness": "IT Services and Software Development",
            "lineOfActivity": "Software Development, Web Applications, Mobile Apps",
            "relevantExperience": "12 years in IT industry",
            "qualification": "MBA in Information Technology",
            "describeBusinessProcess": "Client consultation, requirement analysis, development, testing, deployment and maintenance",
            "detailsOfProduct": "Custom software solutions, web applications, mobile applications",
            "sourceOfRawMaterial": "Software licenses, cloud services, development tools",
            "namesOfCustomersWithContactNo": "ABC Corp (+91-9876543211), XYZ Ltd (+91-9876543212)",
            "namesOfSuppliersWithContactNo": "Microsoft (+91-9876543213), AWS (+91-9876543214)",
            "employeeStrength": "15",
            "actualSeenAtVisit": "12",
            "strengthsAndWeaknesses": "Strengths: Good client base, experienced team. Weaknesses: Seasonal business fluctuations",
            "activityLevelAtTimeOfVisit": "High - Active development work in progress"
        },
        "financialDetails": {
            "grossIncomePerYear": "₹18,00,000",
            "netIncomePerYear": "₹15,00,000",
            "netProfitForLast2Years": "₹12,00,000 (2023), ₹13,50,000 (2024)",
            "grossBusinessMargin": "25%",
            "netBusinessMargin": "20%",
            "noOfYearsFilingITRs": "8",
            "last2YearsITRs": "2023, 2024 - Filed",
            "last2YearsForm16": "N/A (Self-employed)",
            "termLoans": [
                {
                    "institutionName": "ICICI Bank",
                    "typeOfLoan": "HL",
                    "monthlyPrincipalEmi": "₹25,000",
                    "monthlyInterest": "₹8,000",
                    "loanAmount": "₹30,00,000",
                    "mob": "24",
                    "outstanding": "₹20,00,000"
                }
            ],
            "bankingDetails": [
                {
                    "bankName": "HDFC Bank",
                    "typeOfAccount": "Current",
                    "relationshipSince": "2015",
                    "avgBalance": "₹2,50,000"
                }
            ],
            "otherAssets": "Car (Honda City), Two-wheeler (Bajaj Pulsar)",
            "otherBusiness": "None",
            "rentalIncome": {
                "propertyAddress": "Commercial property in Secunderabad",
                "tenantName": "ABC Retail Store",
                "sinceWhen": "3 years",
                "rentAgreementAvailable": "Y",
                "monthlyRentAmount": "₹25,000"
            }
        },
        "loanDetails": {
            "amountOfLoanApplied": "₹50,00,000",
            "purposeOfLoan": "Purchase of residential property",
            "endUse": "Home purchase for self-occupancy",
            "collateralOffered": "Property to be purchased",
            "addressOfPropertyOfferedAsCollateral": "Plot No 123, Green Valley, Hyderabad",
            "ownerOfProperty": "To be purchased from developer",
            "ifPropertyVacantReason": "N/A - New construction",
            "areaOfProperty": "1200 sq. yd.",
            "marketValueOfProperty": "₹55,00,000",
            "isPropertyMortgaged": "No",
            "nameOfFinancierAndLoanDetails": "N/A"
        },
        "personalDiscussionDetails": {
            "strengths": "Stable income, good credit history, adequate repayment capacity, established business",
            "otherObservations": "GST registered, regular GST returns filed, bank statements show healthy transactions, ITRs filed regularly, all required licenses in place",
            "overallOutcome": "Positive - Applicant meets all eligibility criteria",
            "remarks": "Applicant has demonstrated strong financial discipline and business acumen. Property valuation is appropriate and loan amount is within repayment capacity.",
            "pdConductedBy": "PD Officer Name",
            "signature": "Digital Signature",
            "date": "2025-01-20",
            "consistencyCheck": "Yes - All details in application form match with discussion"
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

        <div class="report-title">Personal Discussion Report - Home Loan / Mortgage Loan</div>
        <div class="align-wrapper">
          <div class="branch-box">
            <table class="branch-table">
              <tr>
                <td class="branch-label">Reference Number</td>
                <td class="branch-value" style="border-right: 1px solid #000;">${verificationData.generalDetails.referenceNumber}</td>
                <td class="branch-label">Product</td>
                <td class="branch-value">${verificationData.generalDetails.product}</td>
              </tr>
              <tr>
                <td class="branch-label">Date of PD</td>
                <td class="branch-value" style="border-right: 1px solid #000;">${verificationData.generalDetails.dateOfPD}</td>
                <td class="branch-label">Customer Category</td>
                <td class="branch-value">${verificationData.generalDetails.customerCategory}</td>
              </tr>
            </table>
          </div>
        </div>
    
        <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">I] GENERAL DETAILS</td></tr>
        <tr>
          <th>Name of the Applicant</th>
          <td colspan="5"><span class="var-value">${verificationData.generalDetails.nameOfApplicant || ''}</span></td>
        </tr>
        <tr>
          <th>Name of the Co-Applicant/s</th>
          <td colspan="5"><span class="var-value">${verificationData.generalDetails.nameOfCoApplicants || ''}</span></td>
        </tr>
        <tr>
          <th>Date of Initiation</th>
          <td colspan="2"><span class="var-value">${verificationData.generalDetails.dateOfInitiation || ''}</span></td>
          <th>Date of Customer Availability</th>
          <td colspan="2"><span class="var-value">${verificationData.generalDetails.dateOfCustomerAvailability || ''}</span></td>
        </tr>
        <tr>
          <th>Number of Visits Made</th>
          <td colspan="2"><span class="var-value">${verificationData.generalDetails.numberOfVisitsMade || ''}</span></td>
          <th>Person Met</th>
          <td colspan="2"><span class="var-value">${verificationData.generalDetails.personMet || ''}</span></td>
        </tr>
        <tr>
          <th>Place and Address of Visit</th>
          <td colspan="5"><span class="var-value">${verificationData.generalDetails.placeAndAddressOfVisit || ''}</span></td>
        </tr>
        <tr>
          <th>Owned/Rental</th>
          <td colspan="2"><span class="var-value">${verificationData.generalDetails.ownedRental || ''}</span></td>
          <th>Whether Name Board Seen</th>
          <td colspan="2"><span class="var-value">${verificationData.generalDetails.whetherNameBoardSeen || ''}</span></td>
        </tr>
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">II] PERSONAL DETAILS</td></tr>
        <tr>
          <th>Name of the Applicant</th>
          <td colspan="5"><span class="var-value">${verificationData.personalDetails.nameOfApplicant || ''}</span></td>
        </tr>
        <tr>
          <th>Phone No. of the Applicant</th>
          <td colspan="2"><span class="var-value">${verificationData.personalDetails.phoneNoOfApplicant || ''}</span></td>
          <th>PAN No.</th>
          <td colspan="2"><span class="var-value">${verificationData.personalDetails.panNo || ''}</span></td>
        </tr>
        <tr>
          <th>Educational Qualification</th>
          <td colspan="2"><span class="var-value">${verificationData.personalDetails.educationalQualification || ''}</span></td>
          <th>Role in Business</th>
          <td colspan="2"><span class="var-value">${verificationData.personalDetails.roleInBusiness || ''}</span></td>
        </tr>
        <tr>
          <th>Details of Family Members</th>
          <td colspan="5"><span class="var-value">${verificationData.personalDetails.detailsOfFamilyMembers || ''}</span></td>
        </tr>
        <tr>
          <th>Residence Address</th>
          <td colspan="5"><span class="var-value">${verificationData.personalDetails.residenceAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Nature of Residence</th>
          <td colspan="2"><span class="var-value">${verificationData.personalDetails.natureOfResidence || ''}</span></td>
          <th>No. of Years in the Same Address</th>
          <td colspan="2"><span class="var-value">${verificationData.personalDetails.noOfYearsInSameAddress || ''}</span></td>
        </tr>
        <tr>
          <th>No. of Years in the Same City</th>
          <td colspan="2"><span class="var-value">${verificationData.personalDetails.noOfYearsInSameCity || ''}</span></td>
          <th>Permanent Address</th>
          <td colspan="2"><span class="var-value">${verificationData.personalDetails.permanentAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Name of the Co-applicants and Relationship</th>
          <td colspan="5"><span class="var-value">${verificationData.personalDetails.nameOfCoApplicantsAndRelationship || ''}</span></td>
        </tr>
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">III] BUSINESS / WORK DETAILS</td></tr>
        <tr>
          <th>Name of the Entity / Employer Name</th>
          <td colspan="5"><span class="var-value">${verificationData.businessWorkDetails.nameOfEntityEmployerName || ''}</span></td>
        </tr>
        <tr>
          <th>Constitution</th>
          <td colspan="2"><span class="var-value">${verificationData.businessWorkDetails.constitution || ''}</span></td>
          <th>Year of Incorporation</th>
          <td colspan="2"><span class="var-value">${verificationData.businessWorkDetails.yearOfIncorporation || ''}</span></td>
        </tr>
        <tr>
          <th>Brief on Business Model and Nature of Business</th>
          <td colspan="5"><span class="var-value">${verificationData.businessWorkDetails.briefOnBusinessModel || ''} - ${verificationData.businessWorkDetails.natureOfBusiness || ''}</span></td>
        </tr>
        <tr>
          <th>Business actively managed by</th>
          <td colspan="5"><span class="var-value">${verificationData.businessWorkDetails.businessActivelyManagedBy || ''}</span></td>
        </tr>
        <tr>
          <th>Number of Years in Business / Service</th>
          <td colspan="2"><span class="var-value">${verificationData.businessWorkDetails.numberOfYearsInBusiness || ''}</span></td>
          <th>Total Work Experience</th>
          <td colspan="2"><span class="var-value">${verificationData.businessWorkDetails.totalWorkExperience || ''}</span></td>
        </tr>
        <tr>
          <th>Business Started by</th>
          <td colspan="2"><span class="var-value">${verificationData.businessWorkDetails.businessStartedBy || ''}</span></td>
          <th>Previous Work Experience</th>
          <td colspan="2"><span class="var-value">${verificationData.businessWorkDetails.previousWorkExperience || ''}</span></td>
        </tr>
        <tr>
          <th>If Pvt. Ltd. – Name of Directors and their Shareholding</th>
          <td colspan="5"><span class="var-value">${verificationData.businessWorkDetails.nameOfDirectorsAndShareholding || ''}</span></td>
        </tr>
        <tr>
          <th>Registered with Shop & Establishment Act</th>
          <td colspan="5"><span class="var-value">${verificationData.businessWorkDetails.registeredWithShopEstablishmentAct || ''}</span></td>
        </tr>
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">IV] OPERATIONAL DETAILS</td></tr>
        <tr>
          <th>Nature of Business / Line of Activity</th>
          <td colspan="5"><span class="var-value">${verificationData.operationalDetails.natureOfBusiness || ''} - ${verificationData.operationalDetails.lineOfActivity || ''}</span></td>
        </tr>
        <tr>
          <th>Relevant Experience / Qualification</th>
          <td colspan="5"><span class="var-value">${verificationData.operationalDetails.relevantExperience || ''} - ${verificationData.operationalDetails.qualification || ''}</span></td>
        </tr>
        <tr>
          <th>Describe Business Process</th>
          <td colspan="5"><span class="var-value">${verificationData.operationalDetails.describeBusinessProcess || ''}</span></td>
        </tr>
        <tr>
          <th>Details of Product</th>
          <td colspan="5"><span class="var-value">${verificationData.operationalDetails.detailsOfProduct || ''}</span></td>
        </tr>
        <tr>
          <th>Source of Raw Material</th>
          <td colspan="5"><span class="var-value">${verificationData.operationalDetails.sourceOfRawMaterial || ''}</span></td>
        </tr>
        <tr>
          <th>Names of Customers with Contact No.</th>
          <td colspan="5"><span class="var-value">${verificationData.operationalDetails.namesOfCustomersWithContactNo || ''}</span></td>
        </tr>
        <tr>
          <th>Names of Suppliers with Contact No.</th>
          <td colspan="5"><span class="var-value">${verificationData.operationalDetails.namesOfSuppliersWithContactNo || ''}</span></td>
        </tr>
        <tr>
          <th>Employee Strength and Actual Seen at Visit</th>
          <td colspan="5"><span class="var-value">Declared: ${verificationData.operationalDetails.employeeStrength || ''}, Seen: ${verificationData.operationalDetails.actualSeenAtVisit || ''}</span></td>
        </tr>
        <tr>
          <th>Strengths and Weaknesses of Business</th>
          <td colspan="5"><span class="var-value">${verificationData.operationalDetails.strengthsAndWeaknesses || ''}</span></td>
        </tr>
        <tr>
          <th>Activity Level at Time of Visit</th>
          <td colspan="5"><span class="var-value">${verificationData.operationalDetails.activityLevelAtTimeOfVisit || ''}</span></td>
        </tr>
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">V] FINANCIAL DETAILS</td></tr>
        <tr>
          <th>Gross Income per Year</th>
          <td colspan="2"><span class="var-value">${verificationData.financialDetails.grossIncomePerYear || ''}</span></td>
          <th>Net Income per Year</th>
          <td colspan="2"><span class="var-value">${verificationData.financialDetails.netIncomePerYear || ''}</span></td>
        </tr>
        <tr>
          <th>Net Profit for Last 2 Years</th>
          <td colspan="5"><span class="var-value">${verificationData.financialDetails.netProfitForLast2Years || ''}</span></td>
        </tr>
        <tr>
          <th>Gross Business Margin %</th>
          <td colspan="2"><span class="var-value">${verificationData.financialDetails.grossBusinessMargin || ''}</span></td>
          <th>Net Business Margin %</th>
          <td colspan="2"><span class="var-value">${verificationData.financialDetails.netBusinessMargin || ''}</span></td>
        </tr>
        <tr>
          <th>No. of Years Filing ITRs</th>
          <td colspan="2"><span class="var-value">${verificationData.financialDetails.noOfYearsFilingITRs || ''}</span></td>
          <th>Last 2 Years ITRs</th>
          <td colspan="2"><span class="var-value">${verificationData.financialDetails.last2YearsITRs || ''}</span></td>
        </tr>
        <tr>
          <th>Last 2 Years Form 16 (if salaried)</th>
          <td colspan="5"><span class="var-value">${verificationData.financialDetails.last2YearsForm16 || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Term Loans</td></tr>
        <tr>
          <th>Institution / Bank / NBFC Name</th>
          <th>Type of Loan</th>
          <th>Monthly Principal / EMI</th>
          <th>Monthly Interest</th>
          <th>Loan Amount (Rs. Lacs)</th>
          <th>MOB</th>
          <th>O/s (Rs)</th>
        </tr>
        ${Array.isArray(verificationData.financialDetails.termLoans) && verificationData.financialDetails.termLoans.length > 0
          ? verificationData.financialDetails.termLoans.map(loan => `
            <tr>
              <td><span class="var-value">${loan.institutionName || ''}</span></td>
              <td><span class="var-value">${loan.typeOfLoan || ''}</span></td>
              <td><span class="var-value">${loan.monthlyPrincipalEmi || ''}</span></td>
              <td><span class="var-value">${loan.monthlyInterest || ''}</span></td>
              <td><span class="var-value">${loan.loanAmount || ''}</span></td>
              <td><span class="var-value">${loan.mob || ''}</span></td>
              <td><span class="var-value">${loan.outstanding || ''}</span></td>
            </tr>
          `).join('')
          : '<tr><td colspan="7" style="text-align: center;">No existing term loans</td></tr>'}
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Banking Details</td></tr>
        <tr>
          <th>Bank Name</th>
          <th>Type of Account</th>
          <th>Relationship Since</th>
          <th>Avg Balance</th>
        </tr>
        ${Array.isArray(verificationData.financialDetails.bankingDetails) && verificationData.financialDetails.bankingDetails.length > 0
          ? verificationData.financialDetails.bankingDetails.map(bank => `
            <tr>
              <td><span class="var-value">${bank.bankName || ''}</span></td>
              <td><span class="var-value">${bank.typeOfAccount || ''}</span></td>
              <td><span class="var-value">${bank.relationshipSince || ''}</span></td>
              <td><span class="var-value">${bank.avgBalance || ''}</span></td>
            </tr>
          `).join('')
          : '<tr><td colspan="4" style="text-align: center;">No banking details available</td></tr>'}
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Other Assets & Income</td></tr>
        <tr>
          <th>Other Assets</th>
          <td colspan="5"><span class="var-value">${verificationData.financialDetails.otherAssets || ''}</span></td>
        </tr>
        <tr>
          <th>Other Business (if any)</th>
          <td colspan="5"><span class="var-value">${verificationData.financialDetails.otherBusiness || ''}</span></td>
        </tr>
        <tr>
          <th>Rental Income (if any)</th>
          <td colspan="5">
            <span class="var-value">
              Property: ${verificationData.financialDetails.rentalIncome.propertyAddress || ''}<br>
              Tenant: ${verificationData.financialDetails.rentalIncome.tenantName || ''}<br>
              Since: ${verificationData.financialDetails.rentalIncome.sinceWhen || ''}<br>
              Agreement: ${verificationData.financialDetails.rentalIncome.rentAgreementAvailable || ''}<br>
              Monthly Rent: ${verificationData.financialDetails.rentalIncome.monthlyRentAmount || ''}
            </span>
          </td>
        </tr>
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">VI] LOAN DETAILS</td></tr>
        <tr>
          <th>Amount of Loan Applied</th>
          <td colspan="5"><span class="var-value">${verificationData.loanDetails.amountOfLoanApplied || ''}</span></td>
        </tr>
        <tr>
          <th>Purpose of Loan (End Use)</th>
          <td colspan="5"><span class="var-value">${verificationData.loanDetails.purposeOfLoan || ''} - ${verificationData.loanDetails.endUse || ''}</span></td>
        </tr>
        <tr>
          <th>Collateral Offered</th>
          <td colspan="5"><span class="var-value">${verificationData.loanDetails.collateralOffered || ''}</span></td>
        </tr>
        <tr>
          <th>Address of the Property Offered as Collateral</th>
          <td colspan="5"><span class="var-value">${verificationData.loanDetails.addressOfPropertyOfferedAsCollateral || ''}</span></td>
        </tr>
        <tr>
          <th>Owner of the Property</th>
          <td colspan="2"><span class="var-value">${verificationData.loanDetails.ownerOfProperty || ''}</span></td>
          <th>If the Property is Vacant, Reason</th>
          <td colspan="2"><span class="var-value">${verificationData.loanDetails.ifPropertyVacantReason || ''}</span></td>
        </tr>
        <tr>
          <th>Area of the Property (Sq. yd.)</th>
          <td colspan="2"><span class="var-value">${verificationData.loanDetails.areaOfProperty || ''}</span></td>
          <th>Market Value of the Property (Approx)</th>
          <td colspan="2"><span class="var-value">${verificationData.loanDetails.marketValueOfProperty || ''}</span></td>
        </tr>
        <tr>
          <th>Is the Property Mortgaged with any Bank/FI?</th>
          <td colspan="2"><span class="var-value">${verificationData.loanDetails.isPropertyMortgaged || ''}</span></td>
          <th>Name of Financier and Loan Details</th>
          <td colspan="2"><span class="var-value">${verificationData.loanDetails.nameOfFinancierAndLoanDetails || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">VII] PERSONAL DISCUSSION DETAILS</td></tr>
        <tr>
          <th>Strengths</th>
          <td colspan="5"><span class="var-value">${verificationData.personalDiscussionDetails.strengths || ''}</span></td>
        </tr>
        <tr>
          <th>Other Observation</th>
          <td colspan="5"><span class="var-value">${verificationData.personalDiscussionDetails.otherObservations || ''}</span></td>
        </tr>
        <tr>
          <th>Overall Outcome of the Personal Discussion</th>
          <td colspan="5"><span class="var-value">${verificationData.personalDiscussionDetails.overallOutcome || ''}</span></td>
        </tr>
        <tr>
          <th>Remarks</th>
          <td colspan="5"><span class="var-value">${verificationData.personalDiscussionDetails.remarks || ''}</span></td>
        </tr>
        <tr>
          <th>PD Conducted by</th>
          <td colspan="2"><span class="var-value">${verificationData.personalDiscussionDetails.pdConductedBy || ''}</span></td>
          <th>Date</th>
          <td colspan="2"><span class="var-value">${verificationData.personalDiscussionDetails.date || ''}</span></td>
        </tr>
        <tr>
          <th>Signature</th>
          <td colspan="5"><span class="var-value">${verificationData.personalDiscussionDetails.signature || ''}</span></td>
        </tr>
        <tr>
          <th>Consistency Check</th>
          <td colspan="5"><span class="var-value">${verificationData.personalDiscussionDetails.consistencyCheck || ''}</span></td>
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
