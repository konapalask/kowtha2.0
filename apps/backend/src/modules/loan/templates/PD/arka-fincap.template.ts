import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate } from "./pd-base.tempate";

export const arkaFincapTemplate = (verificationData: any, html_data: any) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  return `
    ${pdBaseTemplate()}

    <div class="template-content">
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Application No</strong></p></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${html_data.applicationNumber || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of Applicant</strong></p></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.nameOfApplicant || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of Co-Applicant</strong></p></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.nameOfCoApplicant || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Phone Number</strong></p></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.phoneNumber || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of Concern</strong></p></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.nameOfConcern || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Initiated Premises</strong></p></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.initiatedAddress || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Visited Premises</strong></p></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.visitedAddress || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Residential Premises</strong></p></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.residentialAddress || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Appointment Fixed</strong></p></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.appointmentFixed || ""}</p></td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Date of Visit</strong>: ${verificationData.applicantDetails?.dateOfVisit || html_data.dateOfReport || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Person Met</strong></p></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.personMet || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Amount and Purpose of Loan</strong></p></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.amountAndPurposeOfLoan || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Type of collateral</strong></p></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.typeOfCollateral || ""} and Market value of collateral security - ${verificationData.applicantDetails?.marketValueOfCollateral || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Collateral Property Address</strong></p></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.collateralPropertyAddress || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>About the Applicant</strong></p></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.aboutApplicant || ""}</p></td>
        </tr>
        <tr>
          <td rowspan="${(Array.isArray(verificationData.familyMembers?.familyMembers) ? verificationData.familyMembers?.familyMembers.length : 0) + 2}" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Family Members</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name</strong></p></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Relationship</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Age</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Education</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Occupation</strong></p></td>
        </tr>
        ${
          Array.isArray(verificationData.familyMembers?.familyMembers) &&
          verificationData.familyMembers?.familyMembers.length > 0
            ? verificationData.familyMembers?.familyMembers
                .map(
                  (member, index) => `
        <tr>
          ${index === 0 ? "" : '<td style="border:1px solid #ccc;padding:8px"></td>'}
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.name || ""}</p></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.relationship || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.age || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.education || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.occupation || ""}</p></td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="6" style="border:1px solid #ccc;padding:8px;text-align:center;">No family members listed</td></tr>'
        }
      </table>

      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td rowspan="${(Array.isArray(verificationData.bankingDetails?.bankingDetails) ? verificationData.bankingDetails?.bankingDetails.length : 0) + 1}" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Banking Details</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>BANK NAME</strong></p></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>ACCOUNT TYPE</strong></p></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>AVG BAL</strong></p></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>NO: OF YEARS MAINTAINED</strong></p></td>
        </tr>
        ${
          Array.isArray(verificationData.bankingDetails?.bankingDetails) &&
          verificationData.bankingDetails?.bankingDetails.length > 0
            ? verificationData.bankingDetails?.bankingDetails
                .map(
                  (bank) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${bank.bankName || ""}</p></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${bank.accountType || ""}</p></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${bank.avgBalance || ""}</p></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${bank.noOfYearsMaintained || ""}</p></td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="7" style="border:1px solid #ccc;padding:8px;text-align:center;">No banking details available</td></tr>'
        }
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>LIC/Mutual funds</strong></p></td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.licMutualFunds?.licMutualFundsDetails || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Assets</strong></p></td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.assetsDetails?.assetsDetails || ""}</p></td>
        </tr>
        <tr>
          <td rowspan="${(Array.isArray(verificationData.noOfLoans?.noOfLoans) ? verificationData.noOfLoans?.noOfLoans.length : 0) + 1}" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>No. of Loans</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>BANK</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>TYPE</strong></p></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>LOAN</strong></p></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>EMI</strong></p></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>OPEN/CLOSE</strong></p></td>
        </tr>
        ${
          Array.isArray(verificationData.noOfLoans?.noOfLoans) &&
          verificationData.noOfLoans?.noOfLoans.length > 0
            ? verificationData.noOfLoans?.noOfLoans
                .map(
                  (loan) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${loan.bank || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${loan.type || ""}</p></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${loan.loanAmount || ""}</p></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${loan.emi || ""}</p></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${loan.openClose || ""}</p></td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="8" style="border:1px solid #ccc;padding:8px;text-align:center;">No loans listed</td></tr>'
        }
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>About the Business</strong></p></td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.aboutBusiness?.aboutBusinessDescription || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name and Contact number of Regular Customers</strong></p></td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.regularCustomers?.regularCustomersDetails || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name and Contact number of Regular Suppliers</strong></p></td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.regularSuppliers?.regularSuppliersDetails || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Business Activity and stock level observed at the time of visit</strong></p></td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.businessActivityObserved?.businessActivityObservedDescription || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Documents Observed</strong></p></td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.documentsObserved?.documentsObservedDetails || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Whether Business Registered under GST?</strong></p></td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.gstRegistration?.gstRegistrationDetails || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>As per Audited individual ITR's</strong></p></td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.itrDetails?.itrDetailsDescription || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Monthly Gross Receipts</strong></p></td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.monthlyGrossReceipts?.monthlyGrossReceipts || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Monthly Expenses</strong></p></td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.monthlyExpenses?.monthlyExpenses || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Net Profit</strong></p></td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.netProfit?.netProfit || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Net Margin</strong></p></td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.netMargin?.netMargin || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Family Expenses</strong></p></td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.familyExpenses?.familyExpensesDetails || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Employees</strong></p></td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.employees?.employeesDetails || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Concerns</strong></p></td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.concerns?.concernsDetails || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Other observations</strong></p></td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.otherObservations?.otherObservationsDetails || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Other Incomes</strong></p></td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.otherIncomes?.otherIncomesDetails || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Neighbor Check</strong></p></td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.neighborCheck?.neighborCheckDetails || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Status</strong></p></td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>${html_data.status || ""}</strong></p></td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>Disclaimer Clause:</strong></p>
      <p style="margin:8px 0;line-height:1.5">This report (including any attachments) has been prepared based on verbal information provided by the person contacted. ARKA FINCAP LIMITED will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. <strong>M/s. KOWTHA & CO </strong>will not be held liable in any case.</p>

      <p style="margin:8px 0;line-height:1.5"><strong>Photos</strong>:</p>
    </div>

    <footer class="pdf-footer">
      <span style="color:rgb(8, 136, 36);">${html_data.bankName || "Arka Fincap"}</span><br>
      Generated on ${istDate}
    </footer>
    ${html_data.imagesData || ""}
  `;
};
