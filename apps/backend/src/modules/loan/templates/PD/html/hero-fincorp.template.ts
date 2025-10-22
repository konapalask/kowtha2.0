import { format, toZonedTime } from "date-fns-tz";

export const heroFincorpTemplate = (verificationData: any, html_data: any) => {
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
    const loans = verificationData.existingLoanDetails?.loans || [];
    if (loans.length === 0) {
      return '<tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">-</p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">-</p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">-</p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">-</p></td></tr>';
    }

    return loans
      .map(
        (loan: any) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${loan.lender || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(loan.loanAmount) || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${loan.typeOfLoan || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(loan.emi) || ""}</p></td>
        </tr>`
      )
      .join("");
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="bank" content="HERO FINCORP">
        <meta name="template-type" content="HERO FINCORP">
        <meta name="generated-from" content="HERO FINCORP.docx">
        <meta name="generated-date" content="${new Date().toISOString()}">
        <title>HERO FINCORP - HERO FINCORP Template</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                color: #333;
            }
            .template-header {
                border-bottom: 2px solid #333;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .template-header h1 {
                margin: 0;
                font-size: 28px;
            }
            .template-header p {
                margin: 5px 0 0 0;
                color: #666;
                font-size: 14px;
            }
            .template-content {
                margin-top: 20px;
            }
            @media print {
                body {
                    padding: 0;
                }
                .template-header {
                    display: none;
                }
            }
        </style>
    </head>
    <body>
        <div class="template-header">
            <h1>HERO FINCORP</h1>
            <p>HERO FINCORP Template | Generated on ${istDate}</p>
        </div>
        <div class="template-content">
            <p style="margin:8px 0;line-height:1.5"><strong><em></em></strong></p>
            <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Name of Applicant</h1>
            <p style="margin:8px 0;line-height:1.5"><strong>/Contact person: </strong>${verificationData.basicInformation?.applicantName || "XXXX"}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Name of Concern: </strong>${verificationData.basicInformation?.businessName || "XXX"}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Office Address: </strong>${verificationData.basicInformation?.officeAddress || "XXXX"}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Phone: </strong>- ${verificationData.basicInformation?.phoneNumber || "XXXX"}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Appointment Fixed: </strong>${verificationData.basicInformation?.appointmentTime || "3:30"} PM, <strong>Date of Visit</strong>: ${verificationData.basicInformation?.dateOfVisit || istDate.split(" ")[0]}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Structure of Loan: </strong>Purpose of the Loan is ${verificationData.basicInformation?.purposeOfLoan || "Business Expansion"}.</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Loan Amount: </strong>${formatCurrency(verificationData.basicInformation?.loanAmount) || "Rs. 80,00,000/-"}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>No. of Visit: </strong>This is the first visit to the applicant.</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Person Met</strong>: ${verificationData.basicInformation?.personMet || "Mr. K. Chandra Sekhar"}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>The following data and explanation are based on the verbal information provided to us during the course of the visit.</strong></p>
            
            <p style="margin:8px 0;line-height:1.5"><strong>About the Applicant:</strong></p>
            <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Applicant family consists of ${verificationData.familyDetails?.totalFamilyMembers || "03"} members including Him.</h1>
            
            <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">About the Business:</h1>
            <ul>
                ${
                  verificationData.aboutTheBusiness?.businessDetails
                    ?.map((detail: any) => `<li>${detail}</li>`)
                    .join("") ||
                  `<li>In the year ${verificationData.aboutTheBusiness?.businessStartYear || "1995"}, applicant started business with the name of ${verificationData.basicInformation?.businessName || "M/s. XXXX"} at ${verificationData.basicInformation?.businessLocation || "Hyderabad"}.</li>
                 <li>It is a Sole Proprietorship Concern and the applicant is the proprietor.</li>
                 <li>All the business activities are managed by applicant only.</li>
                 <li>Nature of business is ${verificationData.aboutTheBusiness?.natureOfBusiness || "Sale and Service of Refrigerators and Air Conditioners"}.</li>
                 <li>He sells all ranges of ${verificationData.aboutTheBusiness?.productsSold || "Refrigerators and Air Conditioners"} in this Premise.</li>
                 <li>And he has providing services for these goods.</li>
                 <li>He purchases stock from local distributors.</li>
                 <li>His customers are general public and schools and colleges, restaurants, industries.</li>
                 <li>He charges Rs. 300/- to Rs. 1,000/- repair amount depends upon work.</li>
                 <li>He has maintaining around ${formatCurrency(verificationData.aboutTheBusiness?.stockValue) || "Rs. 5,00,000/-"} worth of stock in this Premise.</li>
                 <li>He is running this business in rented premise and he pays rent amount of ${formatCurrency(verificationData.aboutTheBusiness?.rentAmount) || "Rs. 30,000/-"} per month.</li>
                 <li>Applicant is mostly depends on service oriented only during summer seasons he also does sales.</li>
                 <li>Applicant is authorized service provider for LG products apart from that he also does the other company products too.</li>
                 <li>There are ${verificationData.aboutTheBusiness?.numberOfEmployees || "10"} workers working in this Business under him and he pays salaries amount of ${formatCurrency(verificationData.aboutTheBusiness?.totalSalaryExpense) || "Rs. 2,00,000/-"} per month.</li>
                 <li>Both cash and bank transactions are noticed.</li>
                 <li>Good level of stock seen at premise.</li>`
                }
            </ul>
            
            <p style="margin:8px 0;line-height:1.5">He wants to avail this loan for the purpose of Business Development.</p>
            <p style="margin:8px 0;line-height:1.5">Turnover and net profit details for last one year audited financials.</p>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>AY</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Turnover</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Net Profit</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Net margin (%)</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.financialSummary?.assessmentYear || "-"}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.financialSummary?.turnover) || ""}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.financialSummary?.netProfit) || ""}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.financialSummary?.netMargin || ""}</p></td>
                </tr>
            </table>
            
            <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Documents Observed:</h1>
            <ul>
                ${
                  verificationData.documentsObserved?.documents
                    ?.map((doc: any) => `<li>${doc}</li>`)
                    .join("") ||
                  `<li>GST Registration Certificate</li>
                 <li>IT Returns</li>
                 <li>Bank Statements</li>`
                }
            </ul>
            
            <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Automation Level:</h1>
            <ul>
                <li>Good level of stock Business activity seen at time of visit.</li>
            </ul>
            
            <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Customers:</h1>
            <ul>
                ${verificationData.customers?.customerReferences?.map((customer: any) => `<li>${customer.name || "Mr. Name"} – ${customer.contactNumber || "Number"}</li>`).join("") || "<li>Mr. Name – Number</li>"}
            </ul>
            
            <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Purchase:</h1>
            <ul>
                ${verificationData.purchase?.supplierReferences?.map((supplier: any) => `<li>${supplier.name || "Mr. Name"} – ${supplier.contactNumber || "Number"}</li>`).join("") || "<li>Mr. Name – Number</li>"}
            </ul>
            
            <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Margins:</h1>
            <ul>
                <li>As per applicant, they get around ${verificationData.financialSummary?.netMargin || "15.37"}% as a net margin in this business.</li>
            </ul>
            
            <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Employees:</h1>
            <ul>
                <li>${verificationData.aboutTheBusiness?.numberOfEmployees || "10"} workers are working under the applicant.</li>
            </ul>
            
            <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">ASSETS:</h1>
            <ul>
                <li>${verificationData.assets?.assetsDetails || "-"}</li>
            </ul>
            
            <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">LOANS:</h1>
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Financial Institution</h1></td>
                    <td style="border:1px solid #ccc;padding:8px"><h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Loan Amount</h1></td>
                    <td style="border:1px solid #ccc;padding:8px"><h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Nature of Loan</h1></td>
                    <td style="border:1px solid #ccc;padding:8px"><h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">EMI</h1></td>
                </tr>
                ${renderExistingLoans()}
            </table>
            
            <p style="margin:8px 0;line-height:1.5"><strong>END USE:</strong></p>
            <ul>
                <li>Applicant wants to avail this loan for the purpose of Business Development.</li>
            </ul>
            
            <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">SECURITY OFFERED</h1>
            <ul>
                <li>${verificationData.securityOffered?.securityDetails || "Own House Property at Hyderabad."}</li>
            </ul>
            
            <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">ADDRESS: -</h1>
            <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">${verificationData.basicInformation?.securityAddress || "Balanagar, Hyderabad."}</h1>
            
            <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">OBSERVATION:</h1>
            <ul>
                ${
                  verificationData.observation?.observations
                    ?.map((obs: any) => `<li>${obs}</li>`)
                    .join("") ||
                  `<li>Both cash and bank transactions are noticed.</li>
                 <li>He has around ${verificationData.aboutTheBusiness?.businessVintage || "35"} years of experience in this field.</li>`
                }
            </ul>
            
            <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">Concerns:</h1>
            <ul>
                ${
                  verificationData.concerns?.concernsList
                    ?.map((concern: any) => `<li>${concern}</li>`)
                    .join("") ||
                  `<li>Dealership certificate was not provided</li>
                 <li>GST returns are not provided.</li>`
                }
            </ul>
            
            <h1 style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333">OTHER BUSINESS/INCOME: -</h1>
            <ul>
                <li>${verificationData.otherBusinessIncome?.otherIncomeDetails || "-"}</li>
            </ul>
            
            <p style="margin:8px 0;line-height:1.5"><strong>Disclaimer Clause</strong>:</p>
            <p style="margin:8px 0;line-height:1.5">This report (including any attachments) has been prepared on the basis of verbal information and documents provided by the person contacted. Hero Fincorp will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. Efficient Services will not be held liable in any case.</p>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr><td style="border:1px solid #ccc;padding:8px"></td><td style="border:1px solid #ccc;padding:8px"></td></tr>
                <tr><td style="border:1px solid #ccc;padding:8px"></td><td style="border:1px solid #ccc;padding:8px"></td></tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Place: - ${verificationData.basicInformation?.place || "Hyderabad"}. <br />Date: - ${verificationData.basicInformation?.dateOfVisit || istDate.split(" ")[0]}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"></td>
                </tr>
            </table>
            
            <p style="margin:8px 0;line-height:1.5"></p>
            <p style="margin:8px 0;line-height:1.5">Photos: </p>
            ${html_data.imagesData || ""}
        </div>
    </body>
    </html>
  `;
};
