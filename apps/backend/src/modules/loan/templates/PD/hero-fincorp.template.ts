import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate } from "./pd-base.tempate";

export const heroFincorpTemplate = (verificationData: any, html_data: any) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  return `
    ${pdBaseTemplate()}

    <div class="template-content">
      <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Name of Applicant</h1>
      <p style="margin:8px 0;line-height:1.5"><strong>/Contact person : </strong>${verificationData.general?.nameOfApplicantContactPerson || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong> Name of Concern : </strong>${verificationData.general?.nameOfConcern || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Office Address : </strong>${verificationData.general?.officeAddress || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Phone : </strong>${verificationData.phoneDetails?.phone || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Appointment Fixed : </strong>${verificationData.appointmentFixed?.appointmentFixed || ""}, <strong>Date of Visit</strong>: ${verificationData.appointmentFixed?.dateOfVisit || html_data.dateOfReport || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Structure of Loan : </strong>${verificationData.appointmentFixed?.structureOfLoan || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Loan Amount : </strong>${verificationData.loanAmount?.loanAmount || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>No. of Visit : </strong>${verificationData.loanAmount?.noOfVisit || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Person Met : </strong>${verificationData.loanAmount?.personMet || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>The following data and explanation are based on the verbal information provided to us during the course of the visit.</strong></p>

      <p style="margin:8px 0;line-height:1.5"><strong>About the Applicant:</strong></p>
      <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">${verificationData.loanAmount?.aboutTheApplicant || ""}</h1>
      <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">${verificationData.applicantFamilyDetailsNumberOfMembersEtc?.applicantFamilyDetails || ""}</h1>

      <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">About the Business:</h1>
      <p style="margin:8px 0;line-height:1.5">${verificationData.aboutTheBusiness?.aboutTheBusinessDescription || ""}</p>

      <p style="margin:8px 0;line-height:1.5">Turnover and net profit details for last one year audited financials.</p>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>AY</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Turnover</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Net Profit</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Net margin (%)</strong></p></td>
        </tr>
        ${
          Array.isArray(
            verificationData.turnoverAndNetProfit?.turnoverAndNetProfit
          ) &&
          verificationData.turnoverAndNetProfit?.turnoverAndNetProfit.length > 0
            ? verificationData.turnoverAndNetProfit?.turnoverAndNetProfit
                .map(
                  (row) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${row.ay || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${row.turnover || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${row.netProfit || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${row.netMargin || ""}</p></td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="4" style="border:1px solid #ccc;padding:8px;text-align:center;">No turnover details available</td></tr>'
        }
      </table>

      <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Documents Observed:</h1>
      <p style="margin:8px 0;line-height:1.5">${verificationData.documentsObserved?.documentsObservedDescription || ""}</p>

      <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Automation Level:</h1>
      <p style="margin:8px 0;line-height:1.5">${verificationData.automationLevel?.automationLevelDescription || ""}</p>

      <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Customers:</h1>
      <p style="margin:8px 0;line-height:1.5">${verificationData.customers?.customersDetails || ""}</p>

      <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Purchase:</h1>
      <p style="margin:8px 0;line-height:1.5">${verificationData.purchase?.purchaseDetails || ""}</p>

      <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Margins:</h1>
      <p style="margin:8px 0;line-height:1.5">${verificationData.margins?.marginsDescription || ""}</p>

      <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Employees:</h1>
      <p style="margin:8px 0;line-height:1.5">${verificationData.employees?.employeesDescription || ""}</p>

      <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">ASSETS:</h1>
      <p style="margin:8px 0;line-height:1.5">${verificationData.assets?.assetsDetails || ""}</p>

      <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">LOANS:</h1>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Financial Institution</h1></td>
          <td style="border:1px solid #ccc;padding:8px"><h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Loan Amount</h1></td>
          <td style="border:1px solid #ccc;padding:8px"><h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Nature of Loan</h1></td>
          <td style="border:1px solid #ccc;padding:8px"><h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">EMI</h1></td>
        </tr>
        ${
          Array.isArray(verificationData.loans?.loans) &&
          verificationData.loans?.loans.length > 0
            ? verificationData.loans?.loans
                .map(
                  (loan) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${loan.financialInstitution || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${loan.loanAmount || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${loan.natureOfLoan || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${loan.emi || ""}</p></td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="4" style="border:1px solid #ccc;padding:8px;text-align:center;">No loans listed</td></tr>'
        }
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>END USE:</strong></p>
      <p style="margin:8px 0;line-height:1.5">${verificationData.endUse?.endUseDescription || ""}</p>

      <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">SECURITY OFFERED</h1>
      <p style="margin:8px 0;line-height:1.5">${verificationData.securityOffered?.securityOfferedDescription || ""}</p>

      <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">ADDRESS:</h1>
      <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">${verificationData.securityOffered?.address || ""}</h1>

      <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">OBSERVATION:</h1>
      <p style="margin:8px 0;line-height:1.5">${verificationData.observation?.observationDescription || ""}</p>

      <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Concerns:</h1>
      <p style="margin:8px 0;line-height:1.5">${verificationData.concerns?.concernsDescription || ""}</p>

      <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">OTHER BUSINESS/INCOME:</h1>
      <p style="margin:8px 0;line-height:1.5">${verificationData.otherBusinessIncome?.otherBusinessIncomeDescription || ""}</p>

      <p style="margin:8px 0;line-height:1.5"><strong>Disclaimer Clause</strong>:</p>
      <p style="margin:8px 0;line-height:1.5">This report (including any attachments) has been prepared on the basis of verbal information and documents provided by the person contacted. Hero Fincorp will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. Efficient Services will not be held liable in any case.</p>

      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Place: ${verificationData.placeAndDate?.place || ""}</p><p style="margin:8px 0;line-height:1.5">Date: ${verificationData.placeAndDate?.date || html_data.dateOfReport || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5">Photos:</p>
    </div>

    <footer class="pdf-footer">
      <span style="color:rgb(8, 136, 36);">${html_data.bankName || "Hero Fincorp"}</span><br>
      Generated on ${istDate}
    </footer>
    ${html_data.imagesData || ""}
  `;
};
