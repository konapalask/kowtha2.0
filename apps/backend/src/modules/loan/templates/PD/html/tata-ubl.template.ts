import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

export const tataUblTemplate = (verificationData: any, html_data: any) => {
  console.log("=== TATA UBL TEMPLATE FUNCTION CALLED ===");
  console.log("verificationData keys:", Object.keys(verificationData));
  console.log("otherDetails:", verificationData.otherDetails);
  console.log("liabilities:", verificationData.otherDetails?.liabilities);

  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    if (!amount) return "NA";
    return `Rs. ${amount.toLocaleString("en-IN")}/-`;
  };

  const ensureArray = <T>(value: T | T[] | undefined | null): T[] => {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined) return [];
    return [value];
  };

  // Helper function to render family details table
  const renderFamilyDetails = () => {
    const familyMembers = verificationData.familyDetails?.familyDetails || [];
    if (familyMembers.length === 0) {
      return '<tr><td colspan="6" style="border:1px solid #ccc;padding:8px;text-align:center">No family details provided</td></tr>';
    }
    return familyMembers
      .map(
        (member: any) => `
      <tr>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.name || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.age || ""} years</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.qualification || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.profession || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.relation || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(member.monthlyIncome)}</p></td>
      </tr>
    `
      )
      .join("");
  };

  // Helper function to render liabilities table
  const renderLiabilities = () => {
    const liabilities = verificationData.otherDetails?.liabilities || [];
    console.log("Tata UBL - renderLiabilities called with:", liabilities);
    if (!liabilities || liabilities.length === 0) {
      console.log("No liabilities found, returning fallback");
      return '<tr><td colspan="6" style="border:1px solid #ccc;padding:8px;text-align:center">No liabilities reported</td></tr>';
    }
    const result = liabilities
      .map(
        (liability: any) => `
      <tr>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${liability.bank || ""}</p></td>
        <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${liability.natureOfLoan || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(liability.loanAmount)}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(liability.emi)}</p></td>
        <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${liability.tenure || ""}</p></td>
        <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(liability.outstandingBalance)}</p></td>
      </tr>
    `
      )
      .join("");
    console.log(
      "Tata UBL - renderLiabilities result:",
      result.substring(0, 200) + "..."
    );
    return result;
  };

  return `
    ${pdBaseTemplate(html_data)}
    
    <div class="template-content">
        <div class="report-title">Personal Discussion Report</div>
        <div class="report-subtitle">(For Tata Capital Limited)</div>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Sr. No.</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Particular Head</strong></p></td>
                    <td colspan="9" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Particular Description</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>1</strong></p></td>    
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of Applicant</strong></p></td>
                    <td colspan="9" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicDetails?.applicantName || ""} </p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>2</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of Entity</strong></p></td>
                    <td colspan="9" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicDetails?.businessName || ""} </p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>3</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of<br />Co-Applicant(s)</strong></p></td>
                    <td colspan="9" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicDetails?.nameOfCoApplicants || ""}</p></td>
                </tr>
                <tr>
                    <td rowspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>4</strong></p></td>
                    <td rowspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Proposed Loan Details</strong></p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Product</strong></p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Amount</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Tenure</strong></p></td>
                </tr>
                <tr>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.proposedLoanDetails?.product || ""}</p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.proposedLoanDetails?.loanAmount)}</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.proposedLoanDetails?.tenure || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Repayment from</strong></p></td>
                    <td colspan="5" style="border:1px solid #ccc;padding:8px">
                        <p style="margin:8px 0;line-height:1.5"><strong>Bank name –</strong> ${verificationData.proposedLoanDetails?.repaymentFrom?.repaymentBankName || ""}</p>
                        <p style="margin:8px 0;line-height:1.5"><strong>Type -</strong> ${verificationData.proposedLoanDetails?.repaymentFrom?.typeSAAccount || ""}</p>
                        <p style="margin:8px 0;line-height:1.5"><strong>Account No. -</strong> ${verificationData.proposedLoanDetails?.repaymentFrom?.accountNo || ""}</p>
                    </td>
                </tr>
                <tr>
                    <td rowspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>5</strong></p></td>
                    <td rowspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Office Address</strong></p></td>
                    <td colspan="9" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Add –</strong> ${verificationData.officeAddress?.officeAddress || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Rented/ Owned</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Owned by</strong></p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Area(In Sq. Ft.)</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Occupied since(years)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>CMV/Rent p.m.</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.officeAddress?.rentedOwned || ""}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.officeAddress?.ownedBy || ""}</p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.officeAddress?.areaSqFt || ""}</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.officeAddress?.occupiedSinceYears || ""}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.officeAddress?.cmvRentPerMonth) || ""}</p></td>
                </tr>
                <tr>
                    <td rowspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>6</strong></p></td>
                    <td rowspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Residential Address</strong></p></td>
                    <td colspan="9" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Add –</strong> ${verificationData.residentialAddress?.address || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Rented/ Owned</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Owned by</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Area(In Sq. Ft.)</strong></p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Occupied since(years)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>CMV/Rent p.m.</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.residentialAddress?.rentedOwned || ""}</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.residentialAddress?.ownedBy || ""}</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.residentialAddress?.areaSqFt || ""}</p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.residentialAddress?.occupiedSinceYears || ""}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.residentialAddress?.cmvRentPerMonth || "")}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>7</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Address of PD</strong></p></td>
                    <td colspan="9" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>PD done in office & met:</strong> ${verificationData.addressOfPDAndPersonMet?.addressOfPDAndPersonMet || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>8</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Family Details</strong></p></td>
                    <td colspan="9" style="border:1px solid #ccc;padding:8px">
                        <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                            <tr>
                                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name</strong></p></td>
                                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Age</strong></p></td>
                                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Qualification</strong></p></td>
                                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Profession</strong></p></td>
                                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Relation</strong></p></td>
                                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Month<br />Income</strong></p></td>
                            </tr>
                            ${renderFamilyDetails()}
                        </table>
                    </td>
                </tr>
            </table>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"></td>
                    <td style="border:1px solid #ccc;padding:8px"></td>
                    <td style="border:1px solid #ccc;padding:8px"></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>9</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Current Business Details</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px">
                        <ul>
                            ${
                              verificationData.businessDetails?.currentBusinessDetails
                                ?.split("\n")
                                .map((detail: string) => `<li>${detail}</li>`)
                                .join("")
                            }
                        </ul>
                    </td>
                </tr>
            </table>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"></td>
                    <td style="border:1px solid #ccc;padding:8px"></td>
                    <td colspan="8" style="border:1px solid #ccc;padding:8px"></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>10</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Stock as on date</strong></p></td>
                    <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.businessDetails?.stockAsOnDate || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>11</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Employees Details</strong></p></td>
                    <td colspan="8" style="border:1px solid #ccc;padding:8px">
                        <p style="margin:8px 0;line-height:1.5"><strong>Current Employees:</strong> ${verificationData.employeesDetails?.currentEmployees || ""}</p>
                        <p style="margin:8px 0;line-height:1.5"><strong>Salary Range:</strong> ${verificationData.employeesDetails?.salaryRange || ""}</p>
                        <p style="margin:8px 0;line-height:1.5"><strong>Key Employee Name -</strong> ${verificationData.employeesDetails?.keyEmployeeName || ""}</p>
                    </td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>12</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Bank Details</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px" colspan="10">
                    <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                        <tr>
                            <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Primary Banker</strong></p></td>
                            <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Nature of Account</strong></p></td>
                            <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Avg. Bal</strong></p></td>
                        </tr>
                        ${ensureArray(verificationData.bankDetails?.bankDetails).map((bank: any) => `
                            <tr>
                                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${bank.primaryBanker || ""}</p></td>
                                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${bank.natureOfAccount || ""}</p></td>
                                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${bank.avgBal || ""}</p></td>
                            </tr>
                        `).join("")}
                    </table>
                    </td>
                </tr>

                <tr>
                    <td style="border:1px solid #ccc;padding:8px"></td>
                    <td style="border:1px solid #ccc;padding:8px"></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"></td>
                    <td colspan="5" style="border:1px solid #ccc;padding:8px"></td>
                    <td style="border:1px solid #ccc;padding:8px"></td>
                </tr>
                <tr>
                    <td rowspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>13</strong></p></td>
                    <td rowspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Sales and Profit Details</strong></p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Turnover (FY ${new Date().getFullYear() - 1}-${new Date().getFullYear()})</strong></p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.salesAndProfitDetails?.turnoverPreviousFinancialYear) || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Exp. Turnover (FY ${new Date().getFullYear()}-${new Date().getFullYear() + 1})</strong></p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.salesAndProfitDetails?.expectedTurnoverCurrentFinancialYear) || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Monthly Turnover / Sales</strong></p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.salesAndProfitDetails?.monthlyTurnoverSales) || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Net Monthly Income</strong></p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.salesAndProfitDetails?.netMonthlyIncome) || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Profit Margin</strong></p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.salesAndProfitDetails?.profitMargin || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Is there any effect on turnover due to Covid</strong></p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.salesAndProfitDetails?.covidEffectOnTurnover || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>After lockdown, is business running on same speed?</strong></p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.salesAndProfitDetails?.postLockdownBusinessSpeed || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Cash Sales (% of total turnover)</strong></p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.salesAndProfitDetails?.cashSalesPercentage || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>14</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Customer Details</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px" colspan="10">
                     <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                        <tr>
                        <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Total Debtors as on date</strong></p></td>
                        <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.customerDetails?.totalDebtorsAsOnDate || ""}</p></td>
                        </tr>
                        <tr>
                        <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Total Customers (No.)</strong></p></td>
                        <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.customerDetails?.totalCustomersNo || ""}</p></td>
                        </tr>
                        <tr>
                        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of Customer</strong></p></td>
                        <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>% of Total Sales</strong></p></td>
                        <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Debtor Days</strong></p></td>
                        <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Relationship since (years)</strong></p></td>
                        </tr>
                        ${ensureArray(verificationData.customerDetails?.customers)
                        .map(customer => `
                            <tr>
                                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${customer.nameOfCustomer || ""}</p></td>
                                <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${customer.percentageOfTotalSales || ""}</p></td>
                                <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${customer.debtorDays || ""}</p></td>
                                <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${customer.relationshipSinceYears || ""}</p></td>
                            </tr>
                        `).join("")}
                     </table>
                    </td>
                </tr>
                 <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>15</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Supplier Details</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px" colspan="10">
                     <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                        <tr>
                            <td colspan="9" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Total Creditors as on date</strong></p></td>
                            <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.supplierDetails?.totalCreditorsAsOnDate || ""}</p></td>
                        </tr>
                        <tr>
                            <td colspan="9" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Total Suppliers (No.)</strong></p></td>
                            <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.supplierDetails?.totalSuppliersNo || ""}</p></td>
                        </tr>
                        <tr>
                            <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of Supplier</strong></p></td>
                            <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>% of Total Purchases</strong></p></td>
                            <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Creditor Days</strong></p></td>
                            <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Relationship since(years)</strong></p></td>
                        </tr>
                        ${ensureArray(verificationData.supplierDetails?.suppliers)
                        ?.map(
                            (supplier: any) => `
                            <tr>
                                <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${supplier.nameOfSupplier || ""}</p></td>
                                <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${supplier.percentageOfTotalPurchases || ""}</p></td>
                                <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${supplier.creditorDays || ""}</p></td>
                                <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${supplier.relationshipSinceYears || ""}</p></td>
                            </tr>
                        `
                        )
                        .join("")}
                    </table>
                    </td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>16</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Other Business/ Income Details (if any)</strong></p></td>
                    <td colspan="10" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.otherDetails?.otherBusinessIncomeDetails?.split("\n").map((line: string) => `<ul><li>${line}</li></ul>`).join("") || "Not Provided"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>17</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Assets</strong></p></td>
                    <td colspan="10" style="border:1px solid #ccc;padding:8px">
                        <ul>
                            ${verificationData.otherDetails?.assets ? `<li>${verificationData.otherDetails.assets}</li>` : "<li>Own House</li>"}
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>18</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Liabilities</strong></p></td>
                    <td colspan="10" style="border:1px solid #ccc;padding:8px">
                        <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                            <tr>
                                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Bank</strong></p></td>
                                <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Nature of Loan</strong></p></td>
                                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Amount</strong></p></td>
                                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>EMI</strong></p></td>
                                <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Tenure</strong></p></td>
                                <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Outstanding Balance</strong></p></td>
                            </tr>
                            ${renderLiabilities()}
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>19</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>End Use of<br />proposed Loan</strong></p></td>
                    <td colspan="10" style="border:1px solid #ccc;padding:8px">
                        <ul>
                            <li>${verificationData.otherDetails?.endUseOfProposedLoan || ""}</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>20</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Political Connection</strong></p></td>
                    <td colspan="10" style="border:1px solid #ccc;padding:8px">
                        <ul>
                            <li>${verificationData.otherDetails?.politicalConnection || ""}</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>21</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Any Court Cases</strong></p></td>
                    <td colspan="10" style="border:1px solid #ccc;padding:8px">
                        <ul>
                            <li>${verificationData.otherDetails?.anyCourtCases || ""}</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>22</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Business belongs to which industry</strong></p></td>
                    <td colspan="10" style="border:1px solid #ccc;padding:8px">
                        <ul>
                            <li>${verificationData.otherDetails?.businessIndustry || ""}</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td rowspan="5" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>23</strong></p></td>
                    <td rowspan="5" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Value Added Information</strong> <br />(If any)</p></td>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Customer Behavior?</strong></p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.valueAddedInformation?.customerBehavior || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Salaries paid during covid to employees?</strong></p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.valueAddedInformation?.salariesPaidDuringCovid || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>If partly paid, % of deduction on salary?</strong></p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.valueAddedInformation?.salaryDeductionPercentage +"%" || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Nature/Types of Neighborhood Shops (E.g. General Store, Jewelry Store, Hardware Store, etc.)</strong></p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.valueAddedInformation?.neighborhoodShopsNature || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Digital wallet used in the business? (E.g. PhonePe, Paytm, GooglePay, AmazonPay, JIO Money, Yono SBI, Airtel Money, Etc.)</strong></p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.valueAddedInformation?.digitalWalletUsed || ""}</p></td>
                </tr>
            </table>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td rowspan="4" style="border:1px solid #ccc;padding:8px"></td>
                    <td rowspan="4" style="border:1px solid #ccc;padding:8px"></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Customer Shop/Office Locality (Slum/Market Road/ Main Road/ Highway)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.valueAddedInformation?.customerShopLocality || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Nearby Bus Stop /Taxi Stand/Rickshaw Stand/Metro Station Name.</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.valueAddedInformation?.nearbyTransportStand || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Utility bill (Clear Photo to be Taken) last 2 months & present month units consumption to be written</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.valueAddedInformation?.utilityBillDetails || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Loss Suffered In Business, If yes, the reason?</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.valueAddedInformation?.lossSufferedInBusiness || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>24</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Strengths</strong></p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px">
                        <ul>
                            ${
                              verificationData.valueAddedInformation?.strengths
                                ?.split("\n")
                                .map(
                                  (strength: string) => `<li>${strength}</li>`
                                )
                                .join("") ||
                              `<li>Name board seen at business premises</li>
                             <li>It is a Sole Proprietorship business.</li>
                             <li>The business transactions are cash and bank.</li>
                             <li>He has ${verificationData.aboutTheBusiness?.businessVintage || ""} years experience in this field.</li>`
                            }
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>25</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Weaknesses</strong></p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px">
                        <ul>
                            ${
                              verificationData.valueAddedInformation?.weaknesses
                                ?.split("\n")
                                .map(
                                  (weakness: string) => `<li>${weakness}</li>`
                                )
                                .join("") ||
                              `<li>He is not provided Business License, Bills, Payment receipts, Daily Records, ITR and Bank Statement regarding to this business.</li>
                             <li>Applicant told it is sole proprietorship business and observed name board and managing directors names was seen.</li>
                             <li>Due to above reasons we are unable to assess income for this business</li>
                             <li><strong>Hence we are issuing the status of this case as negative</strong></li>`
                            }
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td rowspan="11" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>26</strong></p></td>
                    <td rowspan="11" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Site Visit Observations</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name Plate Displayed</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.namePlateDisplayed || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Office Well Furnished?</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.officeWellFurnished || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Business Activity Seen</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.businessActivitySeen || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Difficulty in locating premises?</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.difficultyInLocatingPremises || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Neighborhood:</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.neighborhood || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Landmark</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.landmark || ""}</p></td>
                </tr>
                <tr>
                        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Abnormal Increase / Decrease in Turnover</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.abnormalIncreaseDecreaseInTurnover || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Any Decrease in Net worth</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.anyDecreaseInNetWorth || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Stock Seen During PD?</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.stockSeenDuringPD || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>No. of employees seen during PD?</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.noOfEmployeesSeenDuringPD || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>No. of customers seen during PD?</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.noOfCustomersSeenDuringPD || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>27</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Third Party Confirmation</strong></p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px">
                        <p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.thirdPartyConfirmation || ""}</p>
                    </td>
                </tr>
            </table>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"></td>
                    <td style="border:1px solid #ccc;padding:8px"></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>28</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Pan Card</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.otherObservations?.panCard || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>29</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Document Seen</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.otherObservations?.documentSeen || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>30</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Final Status</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>${html_data.approvedStatus|| "Not provided"}</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>31</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Date of PD:</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.otherObservations?.dateOfPD || istDate.split(" ")[0]}, ${verificationData.otherObservations?.pdTime || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>32</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Person met at the<br />time of PD:</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.otherObservations?.personMet || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>33</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Phone No. of<br />Applicant:</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.otherObservations?.phoneNoOfApplicant || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>34</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>PD done by:</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.otherObservations?.pdDoneBy || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>35</strong>   </p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Latitude and Longitude</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.otherObservations?.latitudeAndLongitude || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Video Link:</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.otherObservations?.videoLink || ""}</p></td>
                </tr>
            </table>
            
            <p style="margin:8px 0;line-height:1.5"><strong>Acknowledgment of Site Visit</strong></p>
            <p style="margin:8px 0;line-height:1.5">(For Tata Capital Limited)</p>
            <p style="margin:8px 0;line-height:1.5">I, the undersigned, have applied for Micro Business Loan with Tata Capital Limited. In this regard, I have met ${verificationData.basicDetails?.personMet || ""} from (Name of the Agency) on ${verificationData.basicDetails?.pdDate || istDate.split(" ")[0]} at ${verificationData.basicDetails?.pdTime || ""} AM/PM for Personal Discussion.</p>
            <p style="margin:8px 0;line-height:1.5">I am informed that Executive is not authorized to collect any money. </p>
            <p style="margin:8px 0;line-height:1.5"><strong>Person Interviewed / Met:</strong> ${verificationData.otherObservations?.personMet || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Designation:</strong> ${verificationData.otherObservations?.personDesignation || ""}</p>
            <p style="margin:8px 0;line-height:1.5"><strong>Sign:</strong> </p>

            <p style="margin:8px 0;line-height:1.5"><strong>Disclaimer Clause:</strong></p>
            <p style="margin:8px 0;line-height:1.5">This report (including any attachments) has been prepared based on verbal information provided by the person contacted. Tata Capital Limited will be absolutely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. <strong>M/s. KOWTHA &amp; CO</strong> will not be held liable in any cases</p>
            
  </div>
    </div>

    ${pdBaseTemplateFooter(html_data)}
    
  `;
};
