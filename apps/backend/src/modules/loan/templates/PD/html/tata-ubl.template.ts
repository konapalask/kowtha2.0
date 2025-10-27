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
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(liability.amount)}</p></td>
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
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">1</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Name of Applicant</p></td>
                    <td colspan="9" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicDetails?.nameOfApplicant || ""} </p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">2</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Name of Entity</p></td>
                    <td colspan="9" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicDetails?.nameOfEntity || ""} </p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">3</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Name of<br />Co-Applicant(s)</p></td>
                    <td colspan="9" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicDetails?.nameOfCoApplicants || ""} (Wife)</p></td>
                </tr>
                <tr>
                    <td rowspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">4</p></td>
                    <td rowspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Proposed Loan Details</p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Product</strong></p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Amount</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Tenure</strong></p></td>
                </tr>
                <tr>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.proposedLoanDetails?.product || ""}</p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.proposedLoanDetails?.amount)}</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.proposedLoanDetails?.tenure || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Repayment from</strong></p></td>
                    <td colspan="5" style="border:1px solid #ccc;padding:8px">
                        <p style="margin:8px 0;line-height:1.5">Bank name – ${verificationData.proposedLoanDetails?.bankName || ""}</p>
                        <p style="margin:8px 0;line-height:1.5">Type - ${verificationData.proposedLoanDetails?.typeSAAccount || ""}</p>
                        <p style="margin:8px 0;line-height:1.5">Account No. - ${verificationData.proposedLoanDetails?.accountNo || ""}</p>
                    </td>
                </tr>
                <tr>
                    <td rowspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">5</p></td>
                    <td rowspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Office Address</p></td>
                    <td colspan="9" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Add –</strong> ${verificationData.officeAddress?.add || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Rented/ Owned</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Owned by</strong></p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Area(In Sq. Ft.)</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Occupied since(years)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>CMV /<br />Rent p.m.</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.officeAddress?.rentedOwned || ""}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.officeAddress?.ownedBy || ""}</p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.officeAddress?.areaSqFt || ""}</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.officeAddress?.occupiedSinceYears || ""}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.officeAddress?.cmvRentPerMonth) || ""}</p></td>
                </tr>
                <tr>
                    <td rowspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">6</p></td>
                    <td rowspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Residential Address</p></td>
                    <td colspan="9" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Add –</strong> ${verificationData.residentialAddress?.add || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Rented/ Owned</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Owned by</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Area(In Sq. Ft.)</strong></p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Occupied since(years)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>CMV /<br />Rent p.m.</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.residentialAddress?.rentedOwned || ""}</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.residentialAddress?.ownedBy || ""}</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.residentialAddress?.areaSqFt || ""}</p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.residentialAddress?.occupiedSinceYears || ""}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.residentialAddress?.cmvRentPerMonth || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">7</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Address of PD</p></td>
                    <td colspan="9" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">PD done in office & met: ${verificationData.basicDetails?.addressOfPDAndPersonMet || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">8</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Family Details</p></td>
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
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">9</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Current Business Details</p></td>
                    <td style="border:1px solid #ccc;padding:8px">
                        <ul>
                            ${
                              verificationData.businessDetails?.currentBusinessDetails
                                ?.split("\n")
                                .map((detail: string) => `<li>${detail}</li>`)
                                .join("") ||
                              `<li>He is started this business under the name ${verificationData.basicDetails?.nameOfEntity || ""} since ${verificationData.aboutTheBusiness?.businessStartYear || ""}.</li>
                             <li>It is a Sole Proprietorship.</li>
                             <li>He has ${verificationData.aboutTheBusiness?.businessVintage || ""} years total experience in this field.</li>
                             <li>Nature of business is ${verificationData.aboutTheBusiness?.natureOfBusiness || ""}.</li>
                             <li>He does Interior and Exterior Works to houses, apartments, offices etc.</li>
                             <li>He does aluminum profile cupboards, UPVC windows & partition, modular kitchen, TV unit, false ceiling, wall designers etc.</li>
                             <li>He charges Rs. 250-600 per sq feet.</li>
                             <li>At present he has doing 1 contract in Mallapur and contract value is Rs. 5 lakhs.</li>
                             <li>He does monthly 4-5 contracts.</li>
                             <li>He purchases stock from local wholesale markets in Hyderabad.</li>
                             <li>Major customers are General public.</li>
                             <li>There are no workers working under him in this business and he maintains workers depend on work.</li>
                             <li>He is running business in rental premises which cost Rs. 7000 per month.</li>
                             <li>Good business activity is seen.</li>
                             <li>The business transactions are cash and bank mode.</li>
                             <li>Neighbor gave positive feedback about applicant.</li>
                             <li>Hence status of the case is Positive.</li>`
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
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">10</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Stock as on date</p></td>
                    <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.businessDetails?.stockAsOnDate || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">11</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Employees Details</p></td>
                    <td colspan="8" style="border:1px solid #ccc;padding:8px">
                        <p style="margin:8px 0;line-height:1.5"><strong>Current Employees:</strong> ${verificationData.employeesDetails?.currentEmployees || ""}</p>
                        <p style="margin:8px 0;line-height:1.5"><strong>Salary Range:</strong> ${verificationData.employeesDetails?.salaryRange || ""}</p>
                        <p style="margin:8px 0;line-height:1.5"><strong>Key Employee Name -</strong> ${verificationData.employeesDetails?.keyEmployeeName || ""}</p>
                    </td>
                </tr>
                <tr>
                    <td rowspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">12</p></td>
                    <td rowspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Bank Details</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Primary Banker</strong></p></td>
                    <td colspan="5" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Nature of Account</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Avg. Bal</strong></p></td>
                </tr>
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.bankDetails?.primaryBanker || ""}</p></td>
                    <td colspan="5" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.bankDetails?.natureOfAccount || ""}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.bankDetails?.avgBal || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"></td>
                    <td style="border:1px solid #ccc;padding:8px"></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"></td>
                    <td colspan="5" style="border:1px solid #ccc;padding:8px"></td>
                    <td style="border:1px solid #ccc;padding:8px"></td>
                </tr>
                <tr>
                    <td rowspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">13</p></td>
                    <td rowspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Sales and Profit Details</p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Turnover (FY 2024-25)</p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.salesAndProfitDetails?.turnoverFY202425 || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Exp. Turnover (FY 2024-25)</p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.salesAndProfitDetails?.expTurnoverFY202526 || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Monthly Turnover / Sales</p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.salesAndProfitDetails?.monthlyTurnoverSales) || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Net Monthly Income</p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.salesAndProfitDetails?.netMonthlyIncome) || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Profit Margin</p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.salesAndProfitDetails?.profitMargin || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Is there any effect on turnover due to Covid</p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.salesAndProfitDetails?.covidEffectOnTurnover || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">After lockdown, is business running on same speed?</p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.salesAndProfitDetails?.postLockdownBusinessSpeed || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Cash Sales (% of total turnover)</p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.salesAndProfitDetails?.cashSalesPercentage || ""}</p></td>
                </tr>
                <tr>
                    <td rowspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">14</p></td>
                    <td rowspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Customer Details</p></td>
                    <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Total Debtors as on date</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.customerDetails?.totalDebtorsAsOnDate || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Total Customers (No.)</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.customerDetails?.totalCustomersNo || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of Customer</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>% of Total Sales</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Debtor Days</strong></p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Relationship since (years)</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.customerDetails?.nameOfCustomer || ""}</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.customerDetails?.percentageOfTotalSales || ""}</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.customerDetails?.debtorDays || ""}</p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.customerDetails?.relationshipSinceYears || ""}</p></td>
                </tr>
            </table>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td rowspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">15</p></td>
                    <td rowspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Supplier Details</p></td>
                    <td colspan="9" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Total Creditors as on date</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.suppliers?.totalCreditors || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="9" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Total Suppliers (No.)</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.suppliers?.totalSuppliers || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of Supplier</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>% of Total Purchases</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Creditor Days</strong></p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Relationship since(years)</strong></p></td>
                </tr>
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.suppliers?.supplierName || ""}</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.suppliers?.purchasePercentage || ""}</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.suppliers?.creditorDays || ""}</p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.suppliers?.relationshipSinceYears || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">16</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Other Business/ Income Details (if any)</p></td>
                    <td colspan="10" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.otherDetails?.otherBusinessIncomeDetails || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">17</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Assets</p></td>
                    <td colspan="10" style="border:1px solid #ccc;padding:8px">
                        <ul>
                            ${verificationData.otherDetails?.assets ? `<li>${verificationData.otherDetails.assets}</li>` : "<li>Own House</li>"}
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">18</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Liabilities</p></td>
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
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">19</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">End Use of<br />proposed Loan</p></td>
                    <td colspan="10" style="border:1px solid #ccc;padding:8px">
                        <ul>
                            <li>${verificationData.otherDetails?.endUseOfProposedLoan || ""}</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">20</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Political Connection</p></td>
                    <td colspan="10" style="border:1px solid #ccc;padding:8px">
                        <ul>
                            <li>${verificationData.otherDetails?.politicalConnection || ""}</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">21</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Any Court Cases</p></td>
                    <td colspan="10" style="border:1px solid #ccc;padding:8px">
                        <ul>
                            <li>${verificationData.otherDetails?.anyCourtCases || ""}</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">22</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Business belongs to which industry</p></td>
                    <td colspan="10" style="border:1px solid #ccc;padding:8px">
                        <ul>
                            <li>${verificationData.otherDetails?.businessIndustry || ""}</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td rowspan="5" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">23</p></td>
                    <td rowspan="5" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Value Added Information</p></td>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Customer Behavior?</p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.valueAddedInformation?.customerBehavior || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Salaries paid during covid to employees?</p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.valueAddedInformation?.salariesPaidDuringCovid || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">If partly paid, % of deduction on salary?</p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.valueAddedInformation?.salaryDeductionPercentage || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Nature/Types of Neighborhood Shops (E.g. General Store, Jewelry Store, Hardware Store, etc.)</p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.valueAddedInformation?.neighborhoodShopsNature || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Digital wallet used in the business? (E.g. PhonePe, Paytm, GooglePay, AmazonPay, JIO Money, Yono SBI, Airtel Money, Etc.)</p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.valueAddedInformation?.digitalWalletUsed || ""}</p></td>
                </tr>
            </table>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td rowspan="4" style="border:1px solid #ccc;padding:8px"></td>
                    <td rowspan="4" style="border:1px solid #ccc;padding:8px"></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Customer Shop/Office Locality (Slum/Market Road/ Main Road/ Highway)</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.valueAddedInformation?.customerShopLocality || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Nearby Bus Stop /Taxi Stand/Rickshaw Stand/Metro Station Name.</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.valueAddedInformation?.nearbyTransportStand || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Utility bill (Clear Photo to be Taken) last 2 months & present month units consumption to be written</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.valueAddedInformation?.utilityBillDetails || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Loss Suffered In Business, If yes, the reason?</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.valueAddedInformation?.lossSufferedInBusiness || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">24</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Strengths</p></td>
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
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">25</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Weaknesses</p></td>
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
                    <td rowspan="11" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">26</p></td>
                    <td rowspan="11" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Site Visit Observations</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Name Plate Displayed</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.namePlateDisplayed || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Office Well Furnished?</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.officeWellFurnished || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Business Activity Seen</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.businessActivitySeen || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Difficulty in locating premises?</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.difficultyInLocatingPremises || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Neighborhood:</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.neighborhood || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Landmark</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.landmark || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Abnormal Increase / Decrease in Turnover</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.abnormalIncreaseDecreaseInTurnover || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Any Decrease in Net worth</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.anyDecreaseInNetWorth || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Stock Seen During PD?</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.stockSeenDuringPD || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">No. of employees seen during PD?</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.noOfEmployeesSeenDuringPD || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">No. of customers seen during PD?</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.noOfCustomersSeenDuringPD || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">27</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Third Party Confirmation</p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px">
                        <p style="margin:8px 0;line-height:1.5">Got ${verificationData.siteVisitObservations?.thirdPartyConfirmationYears || ""} years positive response about the applicant -</p>
                        <p style="margin:8px 0;line-height:1.5">${verificationData.siteVisitObservations?.thirdPartyConfirmationDetails || ""}</p>
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
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">28</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Pan Card</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.documents?.panCard || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">29</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Document Seen</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.documents?.otherDocumentSeen || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">30</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Final Status</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>${html_data.status || ""}</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">31</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Date of PD:</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicDetails?.pdDate || istDate.split(" ")[0]}, ${verificationData.basicDetails?.pdTime || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">32</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Person met at the<br />time of PD:</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicDetails?.personMet || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">33</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Phone No. of<br />Applicant:</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicDetails?.phoneNo || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">34</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">PD done by:</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${html_data.fieldExecutive || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">35</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Latitude and Longitude</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicDetails?.latitudeLongitude || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Video Link:</strong></p></td>
                </tr>
            </table>
            
            <p style="margin:8px 0;line-height:1.5"><strong>Acknowledgment of Site Visit</strong></p>
            <p style="margin:8px 0;line-height:1.5">(For Tata Capital Limited)</p>
            <p style="margin:8px 0;line-height:1.5">I, the undersigned, have applied for Micro Business Loan with Tata Capital Limited. In this regard, I have met ${verificationData.basicDetails?.personMet || ""} from (Name of the Agency) on ${verificationData.basicDetails?.pdDate || istDate.split(" ")[0]} at ${verificationData.basicDetails?.pdTime || ""} AM/PM for Personal Discussion.</p>
            <p style="margin:8px 0;line-height:1.5"><b>I am informed that Executive is not authorized to collect any money. </b></p>
            <p style="margin:8px 0;line-height:1.5">Person Interviewed / Met: ${verificationData.basicDetails?.personMet || ""}</p>
            <p style="margin:8px 0;line-height:1.5">Designation ${verificationData.basicDetails?.personDesignation || ""}</p>
            <p style="margin:8px 0;line-height:1.5">Sign: ${verificationData.basicDetails?.signature || ""}</p>

            <div style="page-break-before: always;"></div>
            <p style="margin:8px 0;line-height:1.5">Pan Card Photo: ${verificationData.documents?.panCard || ""}</p>
            <p style="page-break-before: always;"></p>
            <p style="margin:8px 0;line-height:1.5">Customer's Photo & Selfie: ${verificationData.documents?.customerPhoto || ""}</p>


            <p style="margin:8px 0;line-height:1.5"><strong>Disclaimer Clause:</strong></p>
            <p style="margin:8px 0;line-height:1.5">This report (including any attachments) has been prepared based on verbal information provided by the person contacted. Tata Capital Limited will be absolutely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. <strong>M/s. KOWTHA &amp; CO</strong> will not be held liable in any cases</p>
            
            <P>PHOTOS:</P><br />
            <img style="max-width: 240px; height: auto; margin-top: 6px;" src="${html_data.imageDataUri}" alt="Kowtha Signature" />
        </div>
    </div>
    
  `;
};
