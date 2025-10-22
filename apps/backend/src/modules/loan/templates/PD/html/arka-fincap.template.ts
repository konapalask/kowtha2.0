import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate } from "./pd-base.tempate";

export const arkaFincapTemplate = (verificationData: any, html_data: any) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  return `
    ${pdBaseTemplate()}

    <div class="report-title">ARKA FINCAP - VERIFICATION REPORT</div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Applicant Details</td></tr>
        <tr>
          <th>Application No</th>
          <td colspan="6"><span class="var-value">${verificationData.applicantDetails?.applicationNo || html_data.applicationNumber || ""}</span></td>
        </tr>
        <tr>
          <th>Name of Applicant</th>
          <td colspan="6"><span class="var-value">${verificationData.applicantDetails?.nameOfApplicant || ""}</span></td>
        </tr>
        <tr>
          <th>Name of Co-Applicant</th>
          <td colspan="6"><span class="var-value">${verificationData.applicantDetails?.nameOfCoApplicant || ""}</span></td>
        </tr>
        <tr>
          <th>Phone Number</th>
          <td colspan="6"><span class="var-value">${verificationData.applicantDetails?.phoneNumber || ""}</span></td>
        </tr>
        <tr>
          <th>Name of Concern</th>
          <td colspan="6"><span class="var-value">${verificationData.applicantDetails?.nameOfConcern || ""}</span></td>
        </tr>
        <tr>
          <th>Initiated Premises</th>
          <td colspan="6"><span class="var-value">${verificationData.applicantDetails?.initiatedPremises || ""}</span></td>
        </tr>
        <tr>
          <th>Visited Premises</th>
          <td colspan="6"><span class="var-value">${verificationData.applicantDetails?.visitedPremises || ""}</span></td>
        </tr>
        <tr>
          <th>Residential Premises</th>
          <td colspan="6"><span class="var-value">${verificationData.applicantDetails?.residentialPremises || ""}</span></td>
        </tr>
        <tr>
          <th>Appointment Fixed</th>
          <td colspan="2"><span class="var-value">${verificationData.applicantDetails?.appointmentFixed || ""}</span></td>
          <th>Date of Visit</th>
          <td colspan="3"><span class="var-value">${verificationData.applicantDetails?.dateOfVisit || html_data.dateOfReport || ""}</span></td>
        </tr>
        <tr>
          <th>Person Met</th>
          <td colspan="6"><span class="var-value">${verificationData.applicantDetails?.personMet || ""}</span></td>
        </tr>
        <tr>
          <th>Amount and Purpose of Loan</th>
          <td colspan="6"><span class="var-value">${verificationData.applicantDetails?.amountAndPurposeOfLoan || ""}</span></td>
        </tr>
        <tr>
          <th>Type of Collateral</th>
          <td colspan="6"><span class="var-value">${verificationData.applicantDetails?.typeOfCollateral || ""} ${verificationData.applicantDetails?.marketValueOfCollateral ? `(Market Value: ${verificationData.applicantDetails.marketValueOfCollateral})` : ""}</span></td>
        </tr>
        <tr>
          <th>Collateral Property Address</th>
          <td colspan="6"><span class="var-value">${verificationData.applicantDetails?.collateralPropertyAddress || ""}</span></td>
        </tr>
        <tr>
          <th>About the Applicant</th>
          <td colspan="6"><span class="var-value">${verificationData.applicantDetails?.aboutTheApplicant || ""}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Family Members</td></tr>
        <tr>
          <th>Name</th>
          <th>Relationship</th>
          <th>Age</th>
          <th>Education</th>
          <th>Occupation</th>
        </tr>
        ${
          Array.isArray(verificationData.familyMembers?.familyMembers) &&
          verificationData.familyMembers?.familyMembers.length > 0
            ? verificationData.familyMembers?.familyMembers
                .map(
                  (member) => `
        <tr>
          <td><span class="var-value">${member.name || ""}</span></td>
          <td><span class="var-value">${member.relationship || ""}</span></td>
          <td><span class="var-value">${member.age || ""}</span></td>
          <td><span class="var-value">${member.education || ""}</span></td>
          <td><span class="var-value">${member.occupation || ""}</span></td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="5" style="text-align:center;">No family members listed</td></tr>'
        }
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Banking Details</td></tr>
        <tr>
          <th>Bank Name</th>
          <th>Account Type</th>
          <th>Average Balance</th>
          <th>Years Maintained</th>
        </tr>
        ${
          Array.isArray(verificationData.bankingDetails?.bankingDetails) &&
          verificationData.bankingDetails?.bankingDetails.length > 0
            ? verificationData.bankingDetails?.bankingDetails
                .map(
                  (bank) => `
        <tr>
          <td><span class="var-value">${bank.bankName || ""}</span></td>
          <td><span class="var-value">${bank.accountType || ""}</span></td>
          <td><span class="var-value">${bank.avgBalance || ""}</span></td>
          <td><span class="var-value">${bank.noOfYearsMaintained || ""}</span></td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="4" style="text-align:center;">No banking details available</td></tr>'
        }
        <tr>
          <th>LIC/Mutual Funds</th>
          <td colspan="6"><span class="var-value">${verificationData.licMutualFunds?.licMutualFunds || ""}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Assets</td></tr>
        <tr>
          <th>Asset Description</th>
          <th>Area</th>
          <th>Market Value</th>
          <th>Name of Asset Holder</th>
        </tr>
        ${
          Array.isArray(verificationData.assets?.assets) &&
          verificationData.assets?.assets.length > 0
            ? verificationData.assets?.assets
                .map(
                  (asset) => `
        <tr>
          <td><span class="var-value">${asset.description || ""}</span></td>
          <td><span class="var-value">${asset.area || ""}</span></td>
          <td><span class="var-value">${asset.marketValue || ""}</span></td>
          <td><span class="var-value">${asset.nameOfAssetHolder || ""}</span></td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="4" style="text-align:center;">No assets listed</td></tr>'
        }
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Existing Loans</td></tr>
        <tr>
          <th>Bank</th>
          <th>Type</th>
          <th>Loan Amount</th>
          <th>EMI</th>
          <th>Status</th>
        </tr>
        ${
          Array.isArray(verificationData.existingLoans?.loans) &&
          verificationData.existingLoans?.loans.length > 0
            ? verificationData.existingLoans?.loans
                .map(
                  (loan) => `
        <tr>
          <td><span class="var-value">${loan.bank || ""}</span></td>
          <td><span class="var-value">${loan.type || ""}</span></td>
          <td><span class="var-value">${loan.loanAmount || ""}</span></td>
          <td><span class="var-value">${loan.emi || ""}</span></td>
          <td><span class="var-value">${loan.status || ""}</span></td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="5" style="text-align:center;">No loans listed</td></tr>'
        }
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Business Information</td></tr>
        <tr>
          <th>About the Business</th>
          <td colspan="6"><span class="var-value">${
            Array.isArray(verificationData.aboutTheBusiness) && verificationData.aboutTheBusiness.length > 0
              ? verificationData.aboutTheBusiness.join('<br />')
              : ""
          }</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Regular Customers</td></tr>
        <tr>
          <th>Customer Name</th>
          <th>Contact Number</th>
        </tr>
        ${
          Array.isArray(verificationData.regularCustomers?.customers) &&
          verificationData.regularCustomers?.customers.length > 0
            ? verificationData.regularCustomers?.customers
                .map(
                  (customer) => `
        <tr>
          <td><span class="var-value">${customer.name || ""}</span></td>
          <td><span class="var-value">${customer.contactNumber || ""}</span></td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="2" style="text-align:center;">No customers listed</td></tr>'
        }
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Regular Suppliers</td></tr>
        <tr>
          <th>Supplier Name</th>
          <th>Contact Number</th>
        </tr>
        ${
          Array.isArray(verificationData.regularSuppliers?.suppliers) &&
          verificationData.regularSuppliers?.suppliers.length > 0
            ? verificationData.regularSuppliers?.suppliers
                .map(
                  (supplier) => `
        <tr>
          <td><span class="var-value">${supplier.name || ""}</span></td>
          <td><span class="var-value">${supplier.contactNumber || ""}</span></td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="2" style="text-align:center;">No suppliers listed</td></tr>'
        }
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Business Activity & Documentation</td></tr>
        <tr>
          <th>Business Activity and Stock Level Observed</th>
          <td colspan="6"><span class="var-value">${verificationData.businessActivityObserved?.businessActivityAndStockLevelObserved || ""}</span></td>
        </tr>
        <tr>
          <th>Documents Observed</th>
          <td colspan="6"><span class="var-value">${verificationData.documentsObserved?.documentsObserved || ""}</span></td>
        </tr>
        <tr>
          <th>Whether Business Registered under GST?</th>
          <td colspan="6"><span class="var-value">${verificationData.gstRegistration?.gstRegistered || ""}</span></td>
        </tr>
        <tr>
          <th>As per Audited individual ITR's</th>
          <td colspan="6"><span class="var-value">${verificationData.itrDetails?.itrFiled || ""}</span></td>
        </tr>
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Financial Details</td></tr>
        <tr>
          <th>Monthly Gross Receipts</th>
          <td colspan="6"><span class="var-value">${verificationData.monthlyGrossReceipts?.monthlyGrossReceipts || ""}</span></td>
        </tr>
        <tr>
          <th>Monthly Expenses</th>
          <td colspan="6"><span class="var-value">${verificationData.monthlyExpenses?.monthlyExpenses || ""}</span></td>
        </tr>
        <tr>
          <th>Net Profit</th>
          <td colspan="6"><span class="var-value">${verificationData.netProfit?.netProfit || ""}</span></td>
        </tr>
        <tr>
          <th>Net Margin</th>
          <td colspan="6"><span class="var-value">${verificationData.netMargin?.netMargin || ""}</span></td>
        </tr>
        <tr>
          <th>Family Expenses</th>
          <td colspan="6"><span class="var-value">${verificationData.familyExpenses?.familyExpenses || ""}</span></td>
        </tr>
        <tr>
          <th>Number of Employees</th>
          <td colspan="6"><span class="var-value">${verificationData.employees?.numberOfEmployees || ""}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Additional Observations</td></tr>
        <tr>
          <th>Concerns</th>
          <td colspan="6"><span class="var-value">${
            Array.isArray(verificationData.concerns) && verificationData.concerns.length > 0
              ? verificationData.concerns.join('<br />')
              : ""
          }</span></td>
        </tr>
        <tr>
          <th>Other Observations</th>
          <td colspan="6"><span class="var-value">${
            Array.isArray(verificationData.otherObservations) && verificationData.otherObservations.length > 0
              ? verificationData.otherObservations.join('<br />')
              : ""
          }</span></td>
        </tr>
        <tr>
          <th>Other Incomes</th>
          <td colspan="6"><span class="var-value">${
            Array.isArray(verificationData.otherIncomes) && verificationData.otherIncomes.length > 0
              ? verificationData.otherIncomes.join('<br />')
              : ""
          }</span></td>
        </tr>
        <tr>
          <th>Neighbor Check</th>
          <td colspan="6"><span class="var-value">${verificationData.neighborCheck?.neighborCheck || ""}</span></td>
        </tr>
        <tr>
          <th>Status</th>
          <td colspan="6"><strong><span class="var-value">${verificationData.status?.status || html_data.status || ""}</span></strong></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr>
          <td colspan="7"><strong>Disclaimer Clause:</strong></td>
        </tr>
        <tr>
          <td colspan="7"><span class="var-value">This report (including any attachments) has been prepared based on verbal information provided by the person contacted. ARKA FINCAP LIMITED will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. <strong>M/s. KOWTHA & CO</strong> will not be held liable in any case.</span></td>
        </tr>
      </table>
    </div>

    <br>
    <img src="${html_data.imageDataUri}" width="50%" height="40%" style="margin-left: 2%;" />

    <footer class="pdf-footer">
      <span style="color:rgb(8, 136, 36);">${html_data.bankName || "Arka Fincap"}</span><br>
      Generated on ${istDate}
    </footer>
    ${html_data.imagesData || ""}
  `;
};
