import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate } from "./pd-base.tempate";

export const cholaTemplate = (verificationData: any, html_data: any) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  return `
    ${pdBaseTemplate()}

    <div class="report-title">LIQUID INCOME PROGRAM REPORT</div>

    <div class="align-wrapper">
      <p style="margin:8px 0;line-height:1.5"><strong>Name of the applicant:</strong> ${verificationData.general?.nameOfTheApplicant || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Name of the co-applicant:</strong> ${verificationData.general?.nameOfTheCoApplicant || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Business name:</strong> ${verificationData.general?.businessName || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Constitution:</strong> ${verificationData.general?.constitution || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Visited Address:</strong> ${verificationData.general?.visitedAddress || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Loan Requested:</strong> Rs. ${verificationData.general?.loanRequested || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Purpose of loan:</strong> ${verificationData.general?.purposeOfLoan || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Date of Visit:</strong> ${verificationData.pdDetails?.dateOfVisit || ""}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Person Met:</strong> ${verificationData.pdDetails?.personMet || ""}</p>

      <p style="margin:8px 0;line-height:1.5"><strong>About the applicant and its business:</strong></p>
      <p style="margin:8px 0;line-height:1.5">${verificationData.aboutApplicantAndBusiness?.aboutTheApplicantAndBusiness || ""}</p>

      <p style="margin:8px 0;line-height:1.5"><strong>Applicant's family details:</strong></p>
      <p style="margin:8px 0;line-height:1.5">${verificationData.applicantsFamilyDetails?.applicantsFamilyDetails || ""}</p>

      <p style="margin:8px 0;line-height:1.5"><strong>Assets:</strong></p>
      <p style="margin:8px 0;line-height:1.5">${verificationData.assets?.assets || ""}</p>

      <p style="margin:8px 0;line-height:1.5"><strong>Customers – Reference numbers:</strong></p>
      <p style="margin:8px 0;line-height:1.5">${verificationData.customersReferenceNumbers?.customersReferenceNumbers || ""}</p>

      <p style="margin:8px 0;line-height:1.5"><strong>Other Incomes:</strong> ${verificationData.otherIncomes?.otherIncomes || ""}</p>

      <p style="margin:8px 0;line-height:1.5"><strong>Existing Loan details:</strong></p>
      
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Bank name</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Type of Loan</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Loan amount (In Rs.)</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>EMI/Interest (In Rs.)</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Total Tenure/completed [in months]</strong></td>
        </tr>
        ${
          Array.isArray(
            verificationData.existingLoanDetails?.existingLoanDetails
          ) &&
          verificationData.existingLoanDetails?.existingLoanDetails.length > 0
            ? verificationData.existingLoanDetails.existingLoanDetails
                .map(
                  (loan) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px">${loan.bankName || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.typeOfLoan || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.loanAmount || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.emiInterest || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.totalTenureCompleted || ""}</td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="5" style="border:1px solid #ccc;padding:8px;text-align:center;">No existing loans</td></tr>'
        }
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>Banking Details:</strong></p>

      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Bank name</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>A/c No</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>A/c Type</strong></td>
        </tr>
        ${
          Array.isArray(verificationData.bankingDetails?.bankingDetails) &&
          verificationData.bankingDetails?.bankingDetails.length > 0
            ? verificationData.bankingDetails.bankingDetails
                .map(
                  (banking) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px">${banking.bankName || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${banking.accountNumber || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${banking.accountType || ""}</td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="3" style="border:1px solid #ccc;padding:8px;text-align:center;">No banking details available</td></tr>'
        }
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>ITR, Receipts, Verification, GP Margin & Expenses details:</strong></p>
      <p style="margin:8px 0;line-height:1.5">${verificationData.itrReceiptsVerificationGpMarginExpensesDetails?.itrReceiptsVerificationGpMarginExpensesDetails || ""}</p>

      <p style="margin:8px 0;line-height:1.5"><strong>Comfort Factor:</strong></p>
      <p style="margin:8px 0;line-height:1.5">${verificationData.comfortFactor?.comfortFactor || ""}</p>

      <p style="margin:8px 0;line-height:1.5"><strong>Discomfort Factor:</strong></p>
      <p style="margin:8px 0;line-height:1.5">${verificationData.discomfortFactor?.discomfortFactor || ""}</p>

      <p style="margin:8px 0;line-height:1.5"><strong>Recommendations:</strong> ${verificationData.recommendations?.recommendations || ""}</p>

      <p style="margin:8px 0;line-height:1.5"><strong>Disclaimer if any:</strong> ${verificationData.disclaimerIfAny?.disclaimerIfAny || ""}</p>

      <ul style="margin:8px 0;padding-left:20px;line-height:1.5">
        <li>Total Gross disposable Income (A): ${verificationData.totalGrossDisposableIncome?.totalGrossDisposableIncome || ""}</li>
        <li>Total Obligations (B): ${verificationData.totalObligations?.totalObligations || ""}</li>
        <li>Net Disposable Income (C = A – B): ${verificationData.netDisposableIncome?.netDisposableIncome || ""}</li>
      </ul>

      <p style="margin:8px 0;line-height:1.5">Gross disposable income is sum of Net profit & interest depreciations</p>

      <ul style="margin:8px 0;padding-left:20px;line-height:1.5">
        <li>Business premises photo with customer & Vendor's Self to be attached in this report.</li>
      </ul>

      <p style="margin:8px 0;line-height:1.5"><strong>Business Photos:</strong></p>
    </div>

    <footer class="pdf-footer">
      <span style="color:rgb(8, 136, 36);">${html_data.bankName || "CHOLA"}</span><br>
      Generated on ${istDate}
    </footer>
    ${html_data.imagesData || ""}
  `;
};
