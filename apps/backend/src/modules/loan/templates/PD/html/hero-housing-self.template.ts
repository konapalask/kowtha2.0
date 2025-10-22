import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.tempate";

export const heroHousingSelfTemplate = (
  verificationData: any,
  html_data: any
) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    if (!amount) return "";
    return `Rs. ${amount.toLocaleString("en-IN")}/-`;
  };

  // Helper function to render family members
  const renderFamilyMembers = () => {
    const familyMembers = verificationData.familyDetails?.familyMembers || [];
    if (familyMembers.length === 0) {
      return `<ul><li>No family members available</li></ul>`;
    }
    return `<ul>${familyMembers.map((member: any) => `<li>${member.relation || ""} - ${member.name || ""} – ${member.age || ""}yrs</li>`).join("")}</ul>`;
  };

  // Helper function to render existing loans
  const renderExistingLoans = () => {
    const loans = verificationData.existingLoanDetails?.loans || [];
    if (loans.length === 0) {
      return '<tr><td colspan="2" style="border:1px solid #ccc;padding:8px"></td><td style="border:1px solid #ccc;padding:8px"></td><td style="border:1px solid #ccc;padding:8px"></td><td style="border:1px solid #ccc;padding:8px"></td><td style="border:1px solid #ccc;padding:8px"></td><td style="border:1px solid #ccc;padding:8px"></td></tr>';
    }
    return loans
      .map(
        (loan: any) => `
      <tr>
        <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${loan.typeOfLoan || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(loan.loanAmount) || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${loan.tenure || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(loan.emi) || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${loan.balanceTenure || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${loan.bankName || ""}</p></td>
      </tr>
    `
      )
      .join("");
  };

  return `
    ${pdBaseTemplate(html_data)}
    
    <div class="template-content">
            <p style="margin:8px 0;line-height:1.5"></p>
            <p style="margin:8px 0;line-height:1.5"><strong>PERSONAL DISCUSSION REPORT</strong></p>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Application ID: - </strong>${verificationData.basicInformation?.applicationId || ""}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">PD Date: ${verificationData.basicInformation?.pdDate || istDate.split(" ")[0]}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Product (HL / LAP / Asha HL)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.product || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Loan Amount</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.basicInformation?.loanAmount) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Customer Name</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.customerName || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>PD address: - (Residence/Office/Factory/Godown)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.pdAddress || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Contact Number (Mobile / Landline)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.contactNumber || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Person Met: </strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Relationship with Borrower: ${verificationData.basicInformation?.personMet || ""}</p></td>
                </tr>
            </table>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Borrower Details</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Family Background (Details of family members, major income earning member, dependents details etc.)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px">${renderFamilyMembers()}</td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Total Family members (Nos)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><ul><li>${verificationData.familyDetails?.totalFamilyMembers || ""}</li></ul></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>No. of Earning members (Nos)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><ul><li>${verificationData.familyDetails?.earningMembers || ""}</li></ul></td>
                </tr>
            </table>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Business place and vintage details</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of firm:</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.aboutTheBusiness?.businessName || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Constitution (proprietorship / Partnership / Company / LLP)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.aboutTheBusiness?.constitution || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Who started the business?<br />(self / acquired / second gen)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.aboutTheBusiness?.businessStartedBy || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Ownership of business place (self-owned / rented)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.aboutTheBusiness?.businessPlaceOwnership || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Years in current office</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.aboutTheBusiness?.yearsInCurrentOffice || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Years in current city</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.aboutTheBusiness?.yearsInCurrentCity || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Years in current business</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.aboutTheBusiness?.businessVintage || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Previous employment (if any)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.aboutTheBusiness?.previousEmployment || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Is Resi Cum office? If yes details of separate office set up.</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.aboutTheBusiness?.resiCumOffice || ""}</p></td>
                </tr>
            </table>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td colspan="9" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Business/Financial Profile</strong></p></td>
                </tr>
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Nature of business Trading / manufacturing /<br />services / others: please specify)</strong></p></td>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.aboutTheBusiness?.natureOfBusiness || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Product / services offered.</strong></p></td>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.aboutTheBusiness?.productsServices || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Business Model & background of business.</strong></p></td>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px">
                        <ul>
                            ${
                              verificationData.aboutTheBusiness?.businessModelDetails
                                ?.map((detail: any) => `<li>${detail}</li>`)
                                .join("") ||
                              `<li>There is no business activity and there is no stock at visited premises.</li>
                             <li>He is not provided Business license, Bills, Bank Statement regarding to this business.</li>
                             <li>He is not properly identified as proprietor for this business</li>
                             <li>Due to above reasons we are unable to assess income for this business</li>
                             <li>Hence we are issuing the status of the case is Negative.</li>`
                            }
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Other details business observed during the visit:</strong></p></td>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px">
                        <ul>
                            <li>Business name board seen: ${verificationData.aboutTheBusiness?.nameBoardSeen || ""}</li>
                            <li>No of employees seen: ${verificationData.aboutTheBusiness?.employeesSeen || ""}</li>
                            <li>Business activity seen: ${verificationData.aboutTheBusiness?.businessActivitySeen || ""}</li>
                            <li>Stock seen: ${verificationData.aboutTheBusiness?.stockSeen || ""}</li>
                            <li>No. of machines seen: ${verificationData.aboutTheBusiness?.machinesSeen || ""}</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Top 3 clients (customers) (Average debtor days).</strong></p></td>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px">
                        <ul>
                            ${verificationData.customers?.topCustomers?.map((customer: any) => `<li>${customer.name || ""} - ${customer.debtorDays || ""} days</li>`).join("") || ""}
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Top 3 clients (suppliers) (Average creditor days).</strong></p></td>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px">
                        <ul>
                            ${verificationData.suppliers?.topSuppliers?.map((supplier: any) => `<li>${supplier.name || ""} - ${supplier.creditorDays || ""} days</li>`).join("") || ""}
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Any other business or alternate source of income such as rentals, commission etc. (Provide details)</strong></p></td>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px">
                        <ul>
                            <li>Other business interest / source of income / family income: ${verificationData.otherIncomes?.otherIncomeDetails || ""}</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Any other observations / remarks during visit:</strong></p></td>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px">
                        <ul>
                            <li><strong>${verificationData.observations?.remarks || ""}</strong></li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Details of neighbor check /<br />Third party check done and status:</strong></p></td>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.thirdPartyCheck?.status || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Common Points applicable for all cases.</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Turnover and Margin</strong></p></td>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.financialSummary?.turnoverAndMargin || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Sales fluctuations (Seasonal business)</strong></p></td>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px">
                        <p style="margin:8px 0;line-height:1.5">Peak sales months: ${verificationData.financialSummary?.peakSalesMonths || ""}</p>
                        <p style="margin:8px 0;line-height:1.5">Low sales months: ${verificationData.financialSummary?.lowSalesMonths || ""}</p>
                    </td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Customer Identity established during PD</strong></p></td>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.identityVerification?.established || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Chartered A/c details</strong></p></td>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.charteredAccountant?.details || ""}</p></td>
                </tr>
                <tr>
                    <td rowspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Details of existing loans confirmed during PD.</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Loan type</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Loan Amt</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Tenure</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>EMI</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Bal tenure</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Bank Name</strong></p></td>
                </tr>
                ${renderExistingLoans()}
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Loans taken from<br />family, friends business associates etc.</strong></p></td>
                    <td colspan="7" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.existingLoanDetails?.familyLoans || ""}</p></td>
                </tr>
            </table>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Details of Working capital (OD/CC) if any</strong></p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px">
                        <p style="margin:8px 0;line-height:1.5">Bank Name: ${verificationData.workingCapital?.bankName || ""}</p>
                        <p style="margin:8px 0;line-height:1.5">Limit: ${formatCurrency(verificationData.workingCapital?.limit) || ""}</p>
                        <p style="margin:8px 0;line-height:1.5">Utilisation: ${verificationData.workingCapital?.utilisation || ""}</p>
                        <p style="margin:8px 0;line-height:1.5">Collateral: ${verificationData.workingCapital?.collateral || ""}</p>
                        <p style="margin:8px 0;line-height:1.5">Details of linked loans (if any): ${verificationData.workingCapital?.linkedLoans || ""}</p>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>End Use of proposed Loan in detail.<br />(Basis purpose of loan, in case cash out end<br />use must be detailed)</strong></p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.endUse || ""}</p></td>
                </tr>
                <tr>
                    <td colspan="5" style="border:1px solid #ccc;padding:8px"></td>
                </tr>
                <tr>
                    <td rowspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Banking details:</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Bank Name</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>A/c type</strong></p></td>
                    <td rowspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Average Balances</p></td>
                </tr>
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.bankingDetails?.bankName || ""}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.bankingDetails?.accountType || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Banking<br />performance</strong></p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Any cheque bounces seen (Y/N): ${verificationData.bankingDetails?.chequeBounces || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Details of collateral</strong></p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Address of property</strong>: ${verificationData.collateral?.propertyAddress || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Status of PD (Positive, Negative, Credit Manager visit<br />needed)</strong></p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>${verificationData.finalStatus?.status || ""}</strong></p></td>
                </tr>
            </table>
            
            <p style="margin:8px 0;line-height:1.5"><strong>PD Officer Name: ${verificationData.pdOfficer?.name || ""}</strong></p>
            <p style="margin:8px 0;line-height:1.5"><strong>PD Officer Signature: ${verificationData.pdOfficer?.signature || ""}</strong></p>
            <p style="margin:8px 0;line-height:1.5"><strong>Agency Name & Seal: ${verificationData.pdOfficer?.agencyName || ""}</strong></p>
            <p style="margin:8px 0;line-height:1.5"><strong></strong></p>
            <p style="margin:8px 0;line-height:1.5"><strong>Geo Tagging & Photographs of business premises: -</strong></p>
            
            <p style="margin:8px 0;line-height:1.5"><strong>ANNEXURE1: Income assessment for Asha Home Loans</strong></p>
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Product Specific PD (Applicable for Assessed income cases)</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Monthly Turnover (Total monthly billing)</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px">
                        <p style="margin:8px 0;line-height:1.5">Rs. ${formatCurrency(verificationData.incomeAssessment?.monthlyTurnover) || ""}</p>
                        <p style="margin:8px 0;line-height:1.5">(As assessed during the PD through records maintained at business place).</p>
                    </td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Total Purchases<br />(Monthly purchases, cost of acquisition etc.)</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px">
                        <p style="margin:8px 0;line-height:1.5">Rs. ${formatCurrency(verificationData.incomeAssessment?.totalPurchases) || ""}</p>
                        <p style="margin:8px 0;line-height:1.5">(As assessed during the PD through records maintained at business place).</p>
                    </td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Gross and Net margin of business.</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.incomeAssessment?.grossNetMargin || ""}</p></td>
                </tr>
                <tr>
                    <td rowspan="22" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Estimated income.</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Cash flow analysis during PD.</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Particulars</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Amount in INR.</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Monthly TO/Gross Receipts (estimated)</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.cashFlowAnalysis?.monthlyTurnover) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Any other income (monthly) (commission rental etc.)</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.cashFlowAnalysis?.otherIncome) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Gross monthly income (total).</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.cashFlowAnalysis?.grossMonthlyIncome) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Less: Direct expenses. (Purchase cost, cost of goods<br />sold, selling expenses)</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.cashFlowAnalysis?.directExpenses) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Less: Rental expenses.</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.cashFlowAnalysis?.rentalExpenses) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Less: Staff Salary</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.cashFlowAnalysis?.staffSalary) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Less: Electricity/mobile/travel expenses.</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.cashFlowAnalysis?.utilityExpenses) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Less: Any other expenses than mentioned above.</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.cashFlowAnalysis?.otherExpenses) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Income left for domestic expenses</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.cashFlowAnalysis?.incomeForDomesticExpenses) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Less: Monthly household expenses</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.cashFlowAnalysis?.householdExpenses) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">a) Food expenses</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.cashFlowAnalysis?.foodExpenses) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">b) Children education</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.cashFlowAnalysis?.educationExpenses) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">c) House rent (in any)</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.cashFlowAnalysis?.houseRent) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">d) Medical expenses</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.cashFlowAnalysis?.medicalExpenses) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">e) Any other household expenses.</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.cashFlowAnalysis?.otherHouseholdExpenses) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Net monthly income post all expenses</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.cashFlowAnalysis?.netMonthlyIncome) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Less: a) Savings/investments/insurance premium etc.</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.cashFlowAnalysis?.savingsInvestments) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">b) Existing EMIs (obligations)</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.cashFlowAnalysis?.existingEMIs) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">c) EMI allocated for the proposed loan</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.cashFlowAnalysis?.proposedLoanEMI) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Net surplus income post all expenses & obligations</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.cashFlowAnalysis?.netSurplusIncome) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Loans taken from family, friends business associates<br />etc</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.cashFlowAnalysis?.familyLoans || ""}</p></td>
                </tr>
            </table>
            
            <p style="margin:8px 0;line-height:1.5"><strong>PHOTOS:</strong></p>
        </div>
    
    ${pdBaseTemplateFooter(html_data)}
  `;
};
