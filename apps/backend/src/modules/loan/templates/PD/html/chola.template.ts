import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.tempate";

export const cholaTemplate = (verificationData: any, html_data: any) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    if (!amount) return "";
    return `Rs. ${amount.toLocaleString("en-IN")}/-`;
  };

  // Helper function to render existing loans table rows
  const renderExistingLoans = () => {
    const loans = verificationData.existingLoanDetails || [];
    if (loans.length === 0) {
      return '<tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">-</p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">-</p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">-</p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">-</p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">-</p></td></tr>';
    }

    return loans
      .map(
        (loan: any) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${loan.bankName || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${loan.typeOfLoan || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(loan.loanAmount) || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(loan.emiInterest) || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${loan.tenureTotalCompleted || ""}</p></td>
        </tr>`
      )
      .join("");
  };

  // Helper function to render banking details table rows
  const renderBankingDetails = () => {
    const bankDetails = verificationData.bankingDetails?.bankingDetails || [];
    if (bankDetails.length === 0) {
      return '<tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">-</p></td><td style="border:1px solid #ccc;padding:8px"></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">-</p></td></tr>';
    }

    return bankDetails
      .map(
        (bank: any) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${bank.bankName || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${bank.accountNo || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${bank.accountType || ""}</p></td>
        </tr>`
      )
      .join("");
  };

  // Render business details list
  const renderBusinessDetails = () => {
    return (
      verificationData.aboutTheApplicantAndItsBusiness
        ?.map((item: any) => `<li>${item.aboutTheApplicant || ""}</li>`)
        .join("") ||
      `<li>MR. ${verificationData.basicInformation?.applicantName || ""} is applicant aged ${verificationData.basicInformation?.age || ""} years, ${verificationData.basicInformation?.education || ""} and native is ${verificationData.basicInformation?.nativePlace || ""}.</li>
       <li>Applicant started business under the name of ${verificationData.basicInformation?.businessName || ""} since ${verificationData.aboutTheBusiness?.businessVintage || ""}.</li>
       <li>It is a sole proprietorship business concern, applicant is proprietor of the business and applicant manages all the business activities.</li>`
    );
  };

  return `
    ${pdBaseTemplate(html_data)}
    
    <div class="template-content">
            <p style="margin:8px 0;line-height:1.5"></p>
            <p style="margin:8px 0;line-height:1.5"><strong>LIQUID INCOME PROGRAM REPORT</strong></p>
            <p style="margin:8px 0;line-height:1.5"><strong>Name of the applicant: </strong>${verificationData.basicInformation?.nameOfTheApplicant || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Name of the co-applicant: </strong>${verificationData.basicInformation?.nameOfTheCoApplicant || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Business name: </strong>${verificationData.basicInformation?.businessName || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Constitution: </strong>${verificationData.basicInformation?.constitution || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Visited Address: </strong>${verificationData.basicInformation?.visitedAddress || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Loan Requested:</strong> ${formatCurrency(verificationData.basicInformation?.loanRequested) || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Purpose of loan: </strong>${verificationData.basicInformation?.purposeOfLoan || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Date of Visit: </strong>${verificationData.basicInformation?.dateOfVisit || istDate.split(" ")[0]}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Person Met</strong>: ${verificationData.basicInformation?.personMet || ""}</p>
            
            <p style="margin:8px 0;line-height:1.5"><strong>About the applicant and its business:</strong></p>
            <ul>${renderBusinessDetails()}</ul>
            
            <p style="margin:8px 0;line-height:1.5"><strong>Applicant's family details: </strong></p>
            <p style="margin:8px 0;line-height:1.5">Co Applicant Name: ${verificationData.applicantsFamilyDetails?.familyMembers?.[0]?.name || ""} - Age - ${verificationData.applicantsFamilyDetails?.familyMembers?.[0]?.age || ""} years Relation – ${verificationData.applicantsFamilyDetails?.familyMembers?.[0]?.relation || ""}.</p>
            
            <p style="margin:8px 0;line-height:1.5"><strong>Assets:</strong></p>
            <p style="margin:8px 0;line-height:1.5">${verificationData.assets?.map((asset) => asset.assetDetails).join(", ") || ""}</p>
            
            <p style="margin:8px 0;line-height:1.5"><strong>Customers – Reference numbers- </strong></p>
            <p style="margin:8px 0;line-height:1.5"><strong>Other Incomes</strong>: ${verificationData.otherIncomes?.map((income) => income.otherIncome).join(", ") || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Existing Loan details: </strong></p>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Bank name </strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Type of Loan</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Loan amount <br />(In Rs.)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>EMI/Interest <br />(In Rs.)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Total Tenure<br />/completed <br />[in months]</strong></p></td>
                </tr>
                ${renderExistingLoans()}
            </table>
            
            <p style="margin:8px 0;line-height:1.5"><strong>Banking Details: </strong></p>
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Bank name </strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>A/c No</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>A/c Type</strong></p></td>
                </tr>
                ${renderBankingDetails()}
            </table>
            
            <p style="margin:8px 0;line-height:1.5"><strong>ITR, Receipts, Verification, GP Margin & Expenses details:</strong></p>
            <ul>
              <li>${verificationData.itrFinancialDetails?.itr || ""}</li>
              <li>${verificationData.itrFinancialDetails?.receipts || ""}</li>
              <li>${verificationData.itrFinancialDetails?.verification || ""}</li>
              <li>${verificationData.itrFinancialDetails?.gpMarginAndExpenses || ""}</li>
            </ul>
            
            <p style="margin:8px 0;line-height:1.5"><strong>Comfort Factor: - </strong></p>
            <ul>
                ${
                  verificationData.comfortFactor
                    ?.map((factor: any) => `<li>${factor.comfortFactor}</li>`)
                    .join("") ||
                  `<li>Business name board seen.</li>
                 <li>Verified Rental agreement, trade license, Bank statements, kacha records.</li>
                 <li>He has ${verificationData.aboutTheBusiness?.businessVintage || ""} years of experience in this field.</li>`
                }
            </ul>
            
            <p style="margin:8px 0;line-height:1.5"><strong>Discomfort Factor: -</strong></p>
            <ul>
                ${
                  verificationData.discomfortFactor
                    ?.map(
                      (factor: any) => `<li>${factor.discomfortFactor}</li>`
                    )
                    .join("") ||
                  `<li>Not provided IT, Bank Statement and Bills.</li>
                 <li>During the observation, UPI scanner was in the name of different person.</li>`
                }
            </ul>
            
            <p style="margin:8px 0;line-height:1.5"><strong>Recommendations: </strong>${verificationData.Recommendations?.[0]?.recommendations || html_data.status || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Disclaimer if any: </strong>We estimated financials, purely based on the valid documents provided by the applicant.</p>
            
            ${
              verificationData.financialAnalysis
                ? `
            <ul>
                <li>Total Gross disposable Income (A) ${formatCurrency(verificationData.financialAnalysis.totalGrossDisposableIncome) || ""} per month</li>
                <li>Total Obligations (B) ${formatCurrency(verificationData.financialAnalysis.totalObligations) || ""} per month.</li>
                <li>Net Disposable Income (C = A – B) ${formatCurrency(verificationData.financialAnalysis.netDisposableIncome) || ""} per month</li>
            </ul>`
                : `<ul>
                <li>Total Gross disposable Income (A) Rs. 3, 00, 000/- per month</li>
                <li>Total Obligations (B) Rs. 2, 14,000/- per month.</li>
                <li>Net Disposable Income (C = A – B) Rs. 86,000/- per month</li>
            </ul>`
            }
            
            <p style="margin:8px 0;line-height:1.5">Gross disposable income is sum of Net profit & interest depreciations</p>
            <ul><li>Business premises photo with customer& Vendor's Self to be attached in this report.</li></ul>
            <p style="margin:8px 0;line-height:1.5"><strong>Business Photos:</strong></p>
        </div>
    
    ${pdBaseTemplateFooter(html_data)}
  `;
};
