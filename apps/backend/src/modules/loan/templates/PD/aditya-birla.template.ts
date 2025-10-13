import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate } from "./pd-base.tempate";

export const adityaBirlaTemplate = (verificationData: any, html_data: any) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  return `
    ${pdBaseTemplate()}

    <div class="template-content">
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">PROPOSAL NO.</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${html_data.applicationNumber || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">DATE OF VISIT & TIME</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${html_data.dateOfReport || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>APPLICANT'S DETAIL:</strong></p>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Name of Applicant</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.nameOfApplicant || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Name of Co-applicant</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.nameOfCoApplicant || ""}</p></td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>About Business</strong></p>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Name of Business</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.nameOfBusiness || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Business Address</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.businessAddress || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">No. of years in the current address</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.noOfYearsInTheCurrentAddress?.noOfYearsInTheCurrentAddress || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Constitution of Business</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.noOfYearsInTheCurrentAddress?.constitutionOfBusiness || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Name of other Partners(if it is a partnership concern)</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.nameOfOtherPartnersIfItIsAPartnershipConcern?.nameOfOtherPartners || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Management </p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.nameOfOtherPartnersIfItIsAPartnershipConcern?.management || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Contact Number</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.nameOfOtherPartnersIfItIsAPartnershipConcern?.contactNumber || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">TIN  </p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.nameOfOtherPartnersIfItIsAPartnershipConcern?.tin || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">PAN</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.nameOfOtherPartnersIfItIsAPartnershipConcern?.pan || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Certificate of Incorporation</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.nameOfOtherPartnersIfItIsAPartnershipConcern?.certificateOfIncorporation || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Documents verified</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.documentsVerified?.documentsVerified || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Nature of Business</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.documentsVerified?.natureOfBusiness || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Main product</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.documentsVerified?.mainProduct || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Main Raw material</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.documentsVerified?.mainRawMaterial || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Vendors / suppliers to applicant</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.vendorsSuppliersToApplicant?.vendorsSuppliersToApplicant || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Business transaction</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.vendorsSuppliersToApplicant?.businessTransaction || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Stock observed</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.vendorsSuppliersToApplicant?.stockObserved || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">If no stocks observed, reason for the same</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.vendorsSuppliersToApplicant?.ifNoStocksObservedReasonForTheSame || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Business activity observed </p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.vendorsSuppliersToApplicant?.businessActivityObserved || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Main Customers in the business</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.mainCustomersInTheBusiness?.mainCustomersInTheBusiness || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Sales payment terms </p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.mainCustomersInTheBusiness?.salesPaymentTerms || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">GST Registration</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.salesPaymentTerms?.gstRegistration || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">ITRs filing</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.salesPaymentTerms?.itrsFiling || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">No. of Employees  (Co- applicant)</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">Declared by customer: ${verificationData.noOfEmployees?.noOfEmployees || ""}</p>
            <p style="margin:8px 0;line-height:1.5">Salaries: ${verificationData.noOfEmployees?.salaries || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Go down address (if any)</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.goDownAddress?.goDownAddress || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Other business details (if any)</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">:</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.otherBusinessDetails?.otherBusinessDetails || ""}</p></td>
        </tr>
      </table>

      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>BUSINESS PROFILE :</strong></p>
            <p style="margin:8px 0;line-height:1.5"><strong>APPLICANT :</strong></p>
            <p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.aboutTheBusiness || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Native Place:</strong> ${verificationData.businessProfile?.nativePlace || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Business since:</strong> ${verificationData.businessProfile?.businessSince || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Previous Experience:</strong> ${verificationData.businessProfile?.previousExperience || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Business Premises :</strong> ${verificationData.businessPremises?.businessPremisesAddress || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>If Rented:</strong> ${verificationData.businessOwnership?.ifRentedThenMentionRentAmount || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Business Premises in Sq. ft. :</strong> ${verificationData.businessOwnership?.businessPremisesAreaSqFt || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Market References from:</strong> ${verificationData.marketReferencesFrom?.marketReferencesFrom || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Vendors contact details:</strong> ${verificationData.vendorsContactDetails?.vendorsContactDetails || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Daily Sales / Monthly Sales:</strong> Daily Sales: ${verificationData.dailySalesMonthlySales?.dailySales || ""}, Monthly Sales: ${verificationData.dailySalesMonthlySales?.monthlySales || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>ABOUT PERSONAL DETAILS:-</strong> Current Residence: ${verificationData.currentResidence?.currentResidenceAddress || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">Family members:</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Name | Relation | Age | Business | Education</strong></p>
            ${
              Array.isArray(verificationData.familyMembers?.familyMembers) &&
              verificationData.familyMembers?.familyMembers.length > 0
                ? verificationData.familyMembers?.familyMembers
                    .map(
                      (member, index) =>
                        `<p style="margin:8px 0;line-height:1.5">${index + 1}. ${member.name || ""} | ${member.relation || ""} | ${member.age || ""} | ${member.business || ""} | ${member.education || ""}</p>`
                    )
                    .join("")
                : "<p style='margin:8px 0;line-height:1.5'>No family members listed</p>"
            }
          </td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>Sales Bills:</strong> ${verificationData.salesBillsProvided?.salesBillsProvided || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Purchase Bills:</strong> ${verificationData.salesBillsProvided?.purchaseBillsProvided || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Neighbour check with name:</strong> ${verificationData.salesBillsProvided?.neighbourCheckWithName || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>CIBIL Details:</strong> ${verificationData.cibilDetails?.cibilDetails || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Previous Loans:</strong> ${verificationData.previousLoans?.previousLoans || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Banking Details:</strong> ${verificationData.bankingDetails?.bankingDetails || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Firm Account:</strong> ${verificationData.bankingDetails?.firmAccount || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Savings Account:</strong> ${verificationData.bankingDetails?.savingsAccount || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Assets Details:</strong> ${verificationData.assetsDetails?.assetsDetails || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Other income:</strong> ${verificationData.otherIncome?.otherIncome || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Business Machinery:</strong> ${verificationData.otherIncome?.businessMachinery || ""}</p>

      <p style="margin:8px 0;line-height:1.5">Observation :</p>
      <p style="margin:8px 0;line-height:1.5">${verificationData.observations?.concernsDeviations || ""}</p>

      <p style="margin:8px 0;line-height:1.5"><strong>Status:</strong> ${html_data.status || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Loan Details</strong></p>
      <p style="margin:8px 0;line-height:1.5">Loan Amount Applied: ${verificationData.loanDetails?.loanAmountApplied || ""}</p>
      <p style="margin:8px 0;line-height:1.5">Purpose of loan: ${verificationData.loanDetails?.purposeOfLoan || ""}</p>

      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Particulars</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Units</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Charge</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Total</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Daily Gross Income</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.particularsUnitsChargeTotal?.dailyGrossIncome || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Labour & Material (Everyday)</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.particularsUnitsChargeTotal?.labourMaterialEveryday || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Net Income / Day</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.particularsUnitsChargeTotal?.netIncome || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>Applicant's Monthly Expenses of the business:</strong></p>
      <p style="margin:8px 0;line-height:1.5">Sales : ${verificationData.sales?.sales || ""}</p>
      <p style="margin:8px 0;line-height:1.5">Purchase : ${verificationData.sales?.purchase || ""}</p>
      <p style="margin:8px 0;line-height:1.5">Rent : ${verificationData.sales?.rent || ""}</p>
      <p style="margin:8px 0;line-height:1.5">Salaries/Wages : ${verificationData.sales?.salariesWages || ""}</p>
      <p style="margin:8px 0;line-height:1.5">Transport Charges : ${verificationData.sales?.transportCharges || ""}</p>
      <p style="margin:8px 0;line-height:1.5">Electricity Bill : ${verificationData.sales?.electricityBill || ""}</p>
      <p style="margin:8px 0;line-height:1.5">Other Exp : ${verificationData.otherExp?.otherExpenses || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Total Expenses : ${verificationData.otherExp?.totalExpenses || ""}</strong></p>
      <p style="margin:8px 0;line-height:1.5"><strong>Net Profit : ${verificationData.netProfit?.netProfit || ""}</strong></p>
      <p style="margin:8px 0;line-height:1.5"><strong>Net Margin : ${verificationData.netProfit?.netMargin || ""}%</strong></p>

      <p style="margin:8px 0;line-height:1.5">We taken the estimated figures based on customer feedback and the gross profit has been calculated taking into consideration market information gathered on our experience.</p>
      <p style="margin:8px 0;line-height:1.5">Disclaimer clause: - The Report (Including any attachments) has been prepared on the basis of verbal information provided by the person contacted.</p>
      <p style="margin:8px 0;line-height:1.5">ADITYA BIRLA CAPITAL (Aditya Birla Housing Finance Ltd., will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions, our efficient services will not be liable in any case.</p>
    </div>

    <footer class="pdf-footer">
      <span style="color:rgb(8, 136, 36);">${html_data.bankName || "Aditya Birla"}</span><br>
      Generated on ${istDate}
    </footer>
    ${html_data.imagesData || ""}
  `;
};
