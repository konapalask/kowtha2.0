import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate } from "./pd-base.tempate";

export const ambitTemplate = (verificationData: any, html_data: any) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  return `
    ${pdBaseTemplate()}

        <div class="report-title">DUE DILIGENCE REPORT</div>

        <div class="align-wrapper">
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Name of Applicant</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.general?.nameOfApplicant || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Name of Co-Applicant</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.general?.nameOfCoApplicant || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Application no.</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.general?.applicationNo || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Name of Concern</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.general?.nameOfConcern || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Name of the proprietor as per license</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.general?.nameOfTheProprietorAsPerLicense || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>PD Initiated address</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.pdDetails?.pdInitiatedAddress || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Visited Premise</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.pdDetails?.visitedPremise || ""}</td>
              </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Business License Address</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.pdDetails?.businessLicenseAddress || ""}</td>
        </tr>
        <tr>
          <td rowspan="3" style="border:1px solid #ccc;padding:8px"><strong>Residential Details</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px"><strong>Address</strong>: ${verificationData.address?.address || ""}</td>
        </tr>
        <tr>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"><strong>Rented/Owned</strong></td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px"><strong>Owned by</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px"><strong>Area (In Sq. Ft.)</strong></td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"><strong>Occupied since (years)</strong></td>
        </tr>
        <tr>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.address?.rentedOwned || ""}</td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">${verificationData.address?.ownedBy || ""}</td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.address?.areaInSqFt || ""}</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.address?.occupiedSinceYears || ""}</td>
        </tr>
        <tr>
          <td rowspan="3" style="border:1px solid #ccc;padding:8px"><strong>Property Details</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px"><strong>Address</strong>: ${verificationData.propertyDetails?.propertyAddress || ""}</td>
        </tr>
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Market Value</strong></td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px"><strong>Owned by</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px"><strong>Area (In Sq. Ft.)</strong></td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px"><strong>Occupied since (years)</strong></td>
        </tr>
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.marketValue?.marketValue || ""}</td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">${verificationData.marketValue?.ownedBy || ""}</td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.marketValue?.areaInSqFt || ""}</td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">${verificationData.marketValue?.occupiedSinceYears || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Phone Number</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.marketValue?.phoneNumber || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Appointment Fixed</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.marketValue?.appointmentFixed || ""}</td>
          <td colspan="13" style="border:1px solid #ccc;padding:8px"><strong>Date of Visit</strong>: ${verificationData.pdDetails?.dateOfVisit || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Structure of Loan</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.loanStructure?.structureOfLoan || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>No. of Visit</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.noOfVisit?.noOfVisit || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Person Met</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.noOfVisit?.personMet || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>About the Applicant</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.noOfVisit?.aboutTheApplicant || ""}</td>
        </tr>
        <tr>
          <td rowspan="${Array.isArray(verificationData.familyDetails?.familyDetails) && verificationData.familyDetails?.familyDetails.length > 0 ? verificationData.familyDetails?.familyDetails.length + 1 : 2}" style="border:1px solid #ccc;padding:8px"><strong>Family details</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Name</strong></td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px"><strong>Relationship</strong></td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px"><strong>Age</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px"><strong>Education</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Occupation</strong></td>
        </tr>
        ${
          Array.isArray(verificationData.familyDetails?.familyDetails) &&
          verificationData.familyDetails?.familyDetails.length > 0
            ? verificationData.familyDetails.familyDetails
                .map(
                  (family) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px">${family.name || ""}</td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">${family.relationship || ""}</td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">${family.age || ""}</td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${family.education || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${family.occupation || ""}</td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="18" style="border:1px solid #ccc;padding:8px;text-align:center;">No family details available</td></tr>'
        }
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>About the Business</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.businessDetails?.aboutTheBusiness || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Other observations</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.businessDetails?.otherObservations || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Concerns</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.businessDetails?.concerns || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Purpose of Loan</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.loanDetails?.purposeOfLoan || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>As per Audited individual ITR's</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.businessDetails?.asPerAuditedIndividualITRs || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Whether registered under MSME</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.businessDetails?.whetherRegisteredUnderMSME || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Whether registered under GST</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.businessDetails?.whetherRegisteredUnderGST || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Documents Observed</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.businessDetails?.documentsObserved || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Automation Level</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.businessDetails?.automationLevel || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Receipts</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.receiptsPayments?.receipts || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Payments</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.receiptsPayments?.payments || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Name and Contact number of Regular Customers</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.receiptsPayments?.nameAndContactNumberOfRegularCustomers || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Name and Contact number of Regular Suppliers</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.receiptsPayments?.nameAndContactNumberOfRegularSuppliers || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Net Margin</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.receiptsPayments?.netMargin || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Expenditure</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.receiptsPayments?.expenditure || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Employees</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.receiptsPayments?.employees || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Assets</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.assetsDetails?.assets || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>LIC/Mutual funds</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.assetsDetails?.licMutualFunds || ""}</td>
        </tr>
        <tr>
          <td rowspan="${Array.isArray(verificationData.bankingDetails?.bankingDetails) && verificationData.bankingDetails?.bankingDetails.length > 0 ? verificationData.bankingDetails?.bankingDetails.length + 1 : 2}" style="border:1px solid #ccc;padding:8px"><strong>Banking details</strong></td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px"><strong>BANKNAME</strong></td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"><strong>ACCOUNTTYPE</strong></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px"><strong>AVGBAL</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px"><strong>NO:OFYEARSMAINTAINED</strong></td>
        </tr>
        ${
          Array.isArray(verificationData.bankingDetails?.bankingDetails) &&
          verificationData.bankingDetails?.bankingDetails.length > 0
            ? verificationData.bankingDetails.bankingDetails
                .map(
                  (banking) => `
        <tr>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">${banking.bankName || ""}</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${banking.accountType || ""}</td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px">${banking.avgBalance || ""}</td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${banking.noOfYearsMaintained || ""}</td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="18" style="border:1px solid #ccc;padding:8px;text-align:center;">No banking details available</td></tr>'
        }
        <tr>
          <td rowspan="${Array.isArray(verificationData.loansDetails?.loans) && verificationData.loansDetails?.loans.length > 0 ? verificationData.loansDetails?.loans.length + 1 : 2}" style="border:1px solid #ccc;padding:8px"><strong>No. of Loans</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>BANK</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px"><strong>TYPE</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px"><strong>LOAN</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px"><strong>EMI</strong></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>OPEN/CLOSE</strong></td>
        </tr>
        ${
          Array.isArray(verificationData.loansDetails?.loans) &&
          verificationData.loansDetails?.loans.length > 0
            ? verificationData.loansDetails.loans
                .map(
                  (loan) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px">${loan.bank || ""}</td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${loan.type || ""}</td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${loan.loanAmount || ""}</td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${loan.emi || ""}</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${loan.openClose || ""}</td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="18" style="border:1px solid #ccc;padding:8px;text-align:center;">No loans available</td></tr>'
        }
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>End Use</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.loanDetails?.endUse || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Security Offered</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.securityDetails?.securityOffered || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Address</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.securityDetails?.address || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Other Business/Income</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.otherIncomeDetails?.otherBusinessIncome || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Neighbor Check</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.neighborCheck?.neighborCheck || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Status</strong></td>
          <td colspan="18" style="border:1px solid #ccc;padding:8px">${verificationData.finalStatus?.status || ""}</td>
        </tr>
    </table>
    </div>
    
    <p style="margin:20px;"><strong>Disclaimer Clause:</strong></p>
    <p style="margin:20px;">This report (including any attachments) has been prepared based on verbal information provided by the person contacted. Ambit Finvest Pvt. Ltd. will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. M/s. KOWTHA & CO will not be held liable in any case.</p>

    <p style="margin:20px;"><strong>Residence photos:</strong></p>
    <p style="margin:20px;"><strong>Property Photos:</strong></p>
    <p style="margin:20px;"><strong>Business photos:</strong></p>

    <footer class="pdf-footer">
      <span style="color:rgb(8, 136, 36);">${html_data.bankName || "AMBIT"}</span><br>
      Generated on ${istDate}
    </footer>
    ${html_data.imagesData || ""}
  `;
};
