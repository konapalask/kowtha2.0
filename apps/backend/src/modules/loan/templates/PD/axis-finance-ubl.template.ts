import { format, toZonedTime } from 'date-fns-tz';
import { category } from 'google-play-scraper';
import * as path from 'path';
import * as fs from 'fs';
import { AxisFinanceUBLVerificationDataData } from './interface/axis-finance-ubl.interface';
import { axisFinanceUBLSample } from './sample_data/axis-finance-ubl.sample';
import { pdBaseTemplate } from './pd-base.tempate';

// About applicant should be points list


export const axisFinanceUBLTemplate = (verificationData: any, html_data: any) => {

  const imagePath = path.resolve(process.env.SIGNATURE_PATH || '/home/ubuntu/kowtha/new_sign.jpg');
  const imageBase64 = fs.readFileSync(imagePath, 'base64');
  const imageDataUri = `data:image/jpeg;base64,${imageBase64}`;
  html_data = {
    ...html_data,
    imageDataUri: imageDataUri
  }
    verificationData = axisFinanceUBLSample as AxisFinanceUBLVerificationDataData;
    return `
    ${pdBaseTemplate()}

      <div class="report-title">PERSONAL DISCUSSION SHEET</div>
    
      <div class="align-wrapper">
        <table class="section-table">
          <tr>
          <th>Region</th>
          <th>Location</th>
          <th>Branch</th>
          <th>Ref No/Application No</th>
        </tr>
        <tr style="text-align: center;">
          <td><span class="var-value">${verificationData.reportDetails.region || ''}</span></td>
          <td><span class="var-value">${verificationData.reportDetails.location || ''}</span></td>
          <td><span class="var-value">${verificationData.reportDetails.branch || ''}</span></td>
          <td><span class="var-value">${verificationData.reportDetails.referenceNo || ''}</span></td>
        </tr>
        </table>
      </div>

      <div class="align-wrapper">
        <table class="section-table">
          <tr>
            <th>Name of the Customer</th>
            <td colspan="5"><span class="var-value">${verificationData.reportDetails.applicantName || ''}</span></td>
          </tr>
          <tr>
            <th>Date of Report</th>
            <td colspan="5"><span class="var-value">${verificationData.reportDetails.dateOfReport || ''}</span></td>
          </tr>
          <tr>
            <th>Name of Concern</th>
            <td colspan="5"><span class="var-value">${verificationData.reportDetails.concernName || ''}</span></td>
          </tr>
          <tr>
            <th>Constitution</th>
            <td colspan="5"><span class="var-value">${verificationData.reportDetails.constitution || ''}</span></td>
          </tr>
          <tr>
            <th>Initiated Address</th>
            <td colspan="5"><span class="var-value">${verificationData.reportDetails.initiatedAddress || ''}</span></td>
          </tr>
          <tr>
            <th>Visited Address</th>
            <td colspan="5"><span class="var-value">${verificationData.reportDetails.visitedAddress || ''}</span></td>
          </tr>
          <tr>
          <th>Phone No</th>
            <td colspan="5"><span class="var-value">${verificationData.reportDetails.phoneNumber || ''}</span></td>
          </tr>
          <tr>
            <th>Appointment Fixed</th>
            <td colspan="5"><span class="var-value">${verificationData.reportDetails.appointmentFixed || ''}</span></td>
          </tr>
          <tr>
            <th>Structure of Loan</th>
            <td colspan="5"><span class="var-value">${verificationData.reportDetails.structureOfLoan || ''}</span></td>
          </tr>
          <tr>
            <th>No of Visit</th>
            <td colspan="5"><span class="var-value">${verificationData.reportDetails.numberOfVisits || ''}</span></td>
          </tr>
          <tr>
            <th>Person Met</th>
            <td colspan="5"><span class="var-value">${verificationData.reportDetails.personMet || ''}</span></td>
          </tr>
          <tr>
            <th>Visited By</th>
            <td colspan="5"><span class="var-value">${verificationData.reportDetails.visitedBy || ''}</span></td>
          </tr>
          <tr>
            <th>About Applicant</th>
            <td colspan="5"><span class="var-value">${verificationData.reportDetails.aboutApplicant || ''}</span></td>
          </tr>
          <tr>
            <th>Residential Details</th>
            <td colspan="5"><span class="var-value">${verificationData.reportDetails.residentialDetails || ''}</span></td>
          </tr>
          <tr>
            <th>Co-Applicant Details</th>
            <td colspan="5"><span class="var-value">${verificationData.reportDetails.coApplicantDetails || ''}</span></td>
          </tr>
        </table>
      </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Family Details</td></tr>
        <tr>
          <th>Name</th>
          <th>Relation with Applicant</th>
          <th>Age</th>
          <th>Qualification</th>
          <th>Occupation</th>
          <th>Income Per Month</th>
          <th>Dependent</th>
        </tr>
        ${Array.isArray(verificationData.familyMembers) && verificationData.familyMembers.length > 0
          ? verificationData.familyMembers.map(familyMember => `
            <tr>
              <td><span class="var-value">${familyMember.name || ''}</span></td>
              <td><span class="var-value">${familyMember.relationWithApplicant || ''}</span></td>
              <td><span class="var-value">${familyMember.age || ''}</span></td>
              <td><span class="var-value">${familyMember.qualification || ''}</span></td>
              <td><span class="var-value">${familyMember.occupation || ''}</span></td>
              <td><span class="var-value">${familyMember.incomePerMonth || ''}</span></td>
              <td><span class="var-value">${familyMember.dependent || ''}</span></td>
            </tr>
          `).join('')
          : '<tr><td colspan="6" style="text-align: center;">No family members details available</td></tr>'}
        <tr>
          <th>About the Business</th>
          <td colspan="6"><span class="var-value">${verificationData.businessDetails.aboutBusiness || ''}</span></td>
        </tr>
        <tr>
          <th>Documents Observed</th>
          <td colspan="6">
            ${Array.isArray(verificationData.businessDetails.documentsObserved) && verificationData.businessDetails.documentsObserved.length > 0
              ? verificationData.businessDetails.documentsObserved.map(doc => `
                <span class="var-value">${doc.documentName || ''} (${doc.category || ''}) - ${doc.remarks || ''}</span><br>
              `).join('')
              : '<span class="var-value">No documents observed</span>'}
          </td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Shareholding Details</td></tr>
        <tr>
          <th>Name of Shareholder</th>
          <th>Percentage of Shareholding</th>
          <th>Relationship with Applicant</th>
          <th>Designation</th>
          <th>Coming into Loan Structure</th>
          <th>Functional of Partner/Director</th>
        </tr>
        ${Array.isArray(verificationData.shareholdingDetails) && verificationData.shareholdingDetails.length > 0
          ? verificationData.shareholdingDetails.map(shareholder => `
            <tr>
              <td><span class="var-value">${shareholder.shareholderName || ''}</span></td>
              <td><span class="var-value">${shareholder.shareholdingPercentage || ''}%</span></td>
              <td><span class="var-value">${shareholder.relationWithApplicant || ''}</span></td>
              <td><span class="var-value">${shareholder.designation || ''}</span></td>
              <td><span class="var-value">${shareholder.includedInLoanStructure || ''}</span></td>
              <td><span class="var-value">${shareholder.functionOfPartnerOrDirector || ''}</span></td>
            </tr>
          `).join('')
          : '<tr><td colspan="6" style="text-align: center;">No shareholding details available</td></tr>'}
        <tr>
          <th>About the Business</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.aboutBusiness || ''}</span></td>
        </tr>
        <tr>
          <th>Documents Observed</th>
          <td colspan="5">
            ${Array.isArray(verificationData.businessDetails.documentsObserved) && verificationData.businessDetails.documentsObserved.length > 0
              ? verificationData.businessDetails.documentsObserved.map(doc => `
                <span class="var-value">${doc.documentName || ''} (${doc.category || ''}) - ${doc.remarks || ''}</span><br>
              `).join('')
              : '<span class="var-value">No documents observed</span>'}
          </td>
        </tr>
      </table>
    </div>


    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Suppliers/Creditors</td></tr>
        <tr>
          <th>No of Fixed Suppliers</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.suppliers.numberOfFixedSuppliers || ''}</span></td>
        </tr>
        <tr>
          <th>Credit Period</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.suppliers.creditPeriod || ''}</span></td>
        </tr>
        <tr>
          <th>Cash-Cheque Proportion</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.suppliers.cashChequeProportion || ''}</span></td>
        </tr>
        <tr>
          <th>Top 3 Suppliers</th>
          <td colspan="5">
            ${Array.isArray(verificationData.businessDetails.suppliers.topSuppliers) && verificationData.businessDetails.suppliers.topSuppliers.length > 0
              ? verificationData.businessDetails.suppliers.topSuppliers.map(supplier => `
                <span class="var-value">${supplier.name || ''} - ${supplier.contactDetails || ''} (${supplier.location || ''}) - ${supplier.referenceCheck || ''}</span><br>
              `).join('')
              : '<span class="var-value">No suppliers listed</span>'}
          </td>
        </tr>
        <tr><td colspan="6" class="section-header">Clients/Debtors</td></tr>
        <tr>
          <th>No of Fixed Customers</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.clients.numberOfFixedCustomers || ''}</span></td>
        </tr>
        <tr>
          <th>Credit Period</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.clients.creditPeriod || ''}</span></td>
        </tr>
        <tr>
          <th>Cash-Cheque Proportion</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.clients.cashChequeProportion || ''}</span></td>
        </tr>
        <tr>
          <th>Top 3 Customers</th>
          <td colspan="5">
            ${Array.isArray(verificationData.businessDetails.clients.topCustomers) && verificationData.businessDetails.clients.topCustomers.length > 0
              ? verificationData.businessDetails.clients.topCustomers.map(customer => `
                <span class="var-value">${customer.name || ''} - ${customer.contactDetails || ''} (${customer.location || ''}) - ${customer.referenceCheck || ''}</span><br>
              `).join('')
              : '<span class="var-value">No customers listed</span>'}
          </td>
        </tr>
        <tr>
          <th>Average Stock Maintainance</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.averageStockMaintained || ''}</span></td>
        </tr>
        <tr>
          <th>Turnover & Margins</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.turnoverAndMargins || ''}</span></td>
        </tr>
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Expenditure</td></tr>
        <tr><td colspan="7" class="section-header">Salaries & Wages</td></tr>
        <tr>
          <th>No of Employees</th>
          <td colspan="6"><span class="var-value">${verificationData.businessDetails.salariesAndWages.numberOfEmployees || ''}</span></td>
        </tr>
        <tr>
          <th>Salary Per month per employee</th>
          <td colspan="6"><span class="var-value">${verificationData.businessDetails.salariesAndWages.salaryPerEmployee || ''}</span></td>
        </tr>
        <tr>
          <th>Status of Employee</th>
          <td colspan="6"><span class="var-value">${verificationData.businessDetails.salariesAndWages.statusOfEmployees || ''}</span></td>
        </tr>
        <tr>
          <th>No. of Labours</th>
          <td colspan="6"><span class="var-value">${verificationData.businessDetails.salariesAndWages.numberOfLabours || ''}</span></td>
        </tr>
        <tr>
          <th>Wages per month/per day</th>
          <td colspan="6"><span class="var-value">${verificationData.businessDetails.salariesAndWages.wages || ''}</span></td>
        </tr>
        <tr>
          <th>Status of Labour</th>
          <td colspan="6"><span class="var-value">${verificationData.businessDetails.salariesAndWages.statusOfLabour || ''}</span></td>
        </tr>
        <tr>
          <th>Remarks</th>
          <td colspan="6"><span class="var-value">${verificationData.businessDetails.remarks || ''}</span></td>
        </tr>
        <tr>
          <th>Working Hours</th>
          <td colspan="6"><span class="var-value">${verificationData.businessDetails.workingHours || ''}</span></td>
        </tr>
        <tr>
          <th>Other Major Expenditure</th>
          <td colspan="6"><span class="var-value">${verificationData.businessDetails.otherMajorExpenses || ''}</span></td>
        </tr>
        <tr><td colspan="7" class="section-header">Asset Details</td></tr>
        <tr><td colspan="7" class="section-header">All Immovable properties held that is Residential, Commercial, Land, Plot and any fixed structure</td></tr>
        <tr>
          <th>Address</th>
          <th>Area Measured in Sq.ft</th>
          <th>Purchase Cost in Lakhs</th>
          <th>Purchase Year</th>
          <th>Market Value in Lakhs</th>
          <th>Owner Name</th>
          <th>Mortgaged</th>
        </tr>
        ${Array.isArray(verificationData.assetDetails.immovableProperties) && verificationData.assetDetails.immovableProperties.length > 0
          ? verificationData.assetDetails.immovableProperties.map(property => `
            <tr>
              <td><span class="var-value">${property.address || ''}</span></td>
              <td><span class="var-value">${property.areaMeasurements || ''}</span></td>
              <td><span class="var-value">${property.purchaseCost || ''}</span></td>
              <td><span class="var-value">${property.purchaseYear || ''}</span></td>
              <td><span class="var-value">${property.marketValue || ''}</span></td>
              <td><span class="var-value">${property.ownerName || ''}</span></td>
              <td><span class="var-value">${property.mortgaged || ''}</span></td>
            </tr>
          `).join('')
          : '<tr><td colspan="7" style="text-align: center;">No immovable properties listed</td></tr>'}
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr>
          <th>Any Liquid, Moveable & Monetary items such as Cash,Gold, FD, RD, Mutual Fund Holdings, Shares, Bonds,Securities </th>
          <td colspan="6"><span class="var-value">${verificationData.assetDetails.movableAssets.liquidMonetaryItems || ''}</span></td>
        </tr>
        <tr>
          <th>Life Insurance, Mediclaim, Property/Asset Insurance(Premium & Sum Assured) </th>
          <td colspan="6"><span class="var-value">${verificationData.assetDetails.movableAssets.insuranceDetails || ''}</span></td>
        </tr>
        <tr>
          <th>Capital invested in any business, Loans & Advances given</th>
          <td colspan="6"><span class="var-value">${verificationData.assetDetails.movableAssets.capitalInvested || ''}</span></td>
        </tr>
        <tr>
          <th>Car, Bike and any other vehicle (Company Name and Model)</th>
          <td colspan="6">
            ${Array.isArray(verificationData.assetDetails.movableAssets.vehicles) && verificationData.assetDetails.movableAssets.vehicles.length > 0
              ? verificationData.assetDetails.movableAssets.vehicles.map(vehicle => `
                <span class="var-value">${vehicle.companyName || ''} ${vehicle.model || ''}</span><br>
              `).join('')
              : '<span class="var-value">No vehicles listed</span>'}
          </td>
        </tr>
        </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Existing EMI's/Loans</td></tr>
        <tr>
          <th>Name</th>
          <th>Type of Loan</th>
          <th>Sanctioned Amount</th>
          <th>Outstanding Balance</th>
          <th>EMI</th>
          <th>EMI Paid Bank</th>
          <th>Secured Against</th>
        </tr>
        ${Array.isArray(verificationData.existingLoans) && verificationData.existingLoans.length > 0
          ? verificationData.existingLoans.map(loan => `
            <tr>
              <td><span class="var-value">${loan.bankName || ''}</span></td>
              <td><span class="var-value">${loan.typeofLoan || ''}</span></td>
              <td><span class="var-value">${loan.sanctionedAmount || ''}</span></td>
              <td><span class="var-value">${loan.outstandingBalance || ''}</span></td>
              <td><span class="var-value">${loan.emi || ''}</span></td>
              <td><span class="var-value">${loan.emiPaidBank || ''}</span></td>
              <td><span class="var-value">${loan.securedAgainst || ''}</span></td>
            </tr>
          `).join('')
          : '<tr><td colspan="7" style="text-align: center;">No existing loans details available</td></tr>'}
        </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Bank Details</td></tr>
        <tr>
          <th>Name</th>
          <th>Branch Name</th>
          <th>Account Type</th>
          <th>Open Since Year</th>
        </tr>
        ${Array.isArray(verificationData.bankDetails) && verificationData.bankDetails.length > 0
          ? verificationData.bankDetails.map(bank => `
            <tr>
              <td><span class="var-value">${bank.bankName || ''}</span></td>
              <td><span class="var-value">${bank.branchName || ''}</span></td>
              <td><span class="var-value">${bank.accountType || ''}</span></td>
              <td><span class="var-value">${bank.openSinceYear || ''}</span></td>
            </tr>
          `).join('')
          : '<tr><td colspan="7" style="text-align: center;">No bank details available</td></tr>'}
        </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Third Party Check</td></tr>
        <tr>
          <th>Individual/Business Name</th>
          <th>Address</th>
          <th>Contact Number</th>
          <th>Knowing Since</th>
          <th>Feedback On Borrower</th>
          <th>Feedback On Business</th>
        </tr>
          ${Array.isArray(verificationData.thirdPartyCheck) && verificationData.thirdPartyCheck.length > 0
            ? verificationData.thirdPartyCheck.map(tpc => `
              <tr>
                <td><span class="var-value">${tpc.individualOrBusinessName || ''}</span></td>
                <td><span class="var-value">${tpc.address || ''}</span></td>
                <td><span class="var-value">${tpc.contactNumber || ''}</span></td>
                <td><span class="var-value">${tpc.knowingSince || ''}</span></td>
                <td><span class="var-value">${tpc.feedbackOnBorrower || ''}</span></td>
                <td><span class="var-value">${tpc.feedbackOnBusiness || ''}</span></td>
              </tr>
            `).join('')
            : '<tr><td colspan="6" style="text-align: center;">No third party checks details available</td></tr>'}

      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr>
          <th>Observations</th>
          <td colspan="6"><span class="var-value">${verificationData.finalRemarks || ''}</span></td>
        </tr>
        <tr>
          <th>Other Income: (Income from other than initiated business)</th>
          <td colspan="6"><span class="var-value">${verificationData.otherIncome || ''}</span></td>
        </tr>
        <tr>
          <th>Site Coordinates</th>
          <td colspan="6"><span class="var-value">${verificationData.siteCoordinates || ''}</span></td>
        </tr>
        <tr>
          <th>Remarks</th>
          <td colspan="6"><span class="var-value">${verificationData.finalRemarks || ''}</span></td>
        </tr>
        <tr>
          <th>Status</th>
          <td colspan="6"><span class="var-value">${verificationData.status || ''}</span></td>
        </tr>
        <tr>
          <th>AFL Verifier's Name & Emp Code</th>
          <td colspan="6"><span class="var-value">${verificationData.aflVerifier.name || ''} - ${verificationData.aflVerifier.employeeCode || ''}</span></td>
        </tr>
        <tr>
          <th>AFL Verifier's Signature</th>
          <td colspan="6"><span class="var-value">${verificationData.aflVerifier.signature || ''}</span></td>
        </tr>
    </table>
    </div>
    <br>
    <img src="${html_data.imageDataUri}" width="50%" height="40%" style="margin-left: 2%;" />
    <footer class="pdf-footer">
      <span style="color:rgb(8, 136, 36);">${"Bank of India"}</span><br>
      Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    </footer>
  `
}