import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:16px 0";
const labelCellStyle =
  "border:1px solid #c7cdd1;padding:8px;font-weight:600;color:#222;background:#f4f6fb;vertical-align:top;width:32%";
const valueCellStyle =
  "border:1px solid #c7cdd1;padding:8px;color:#333;vertical-align:top";

export const axisBankTemplate = (verificationData: any, html_data: any) => {
  console.log("=== AXIS BANK TEMPLATE FUNCTION CALLED ===");
  console.log("Verification data sections:", Object.keys(verificationData));
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    if (!amount) return "Rs. 0/-";
    return `Rs. ${amount.toLocaleString("en-IN")}/-`;
  };

  const familyMembersList =
    verificationData.familyBackground?.familyMembers || [];

  console.log(
    "In axis-bank template - familyBackground:",
    verificationData.familyBackground
  );
  console.log("familyMembersList length:", familyMembersList.length);
  console.log("familyMembersList contents:", familyMembersList);

  const formatSummaryValue = (value: any) => {
    if (value === null || value === undefined || value === "") {
      return "Not Provided";
    }
    return String(value);
  };

  const computedTotalFamilyMembers =
    verificationData.familyBackground?.totalFamilyMembers ||
    familyMembersList.length;

  console.log("computedTotalFamilyMembers:", computedTotalFamilyMembers);

  const computedEarningMembers =
    verificationData.familyBackground?.noOfEarningMembers ||
    familyMembersList.filter((member: any) => {
      const occupation = (member.occupation || "").toString().toLowerCase();
      if (!occupation) return false;
      const nonEarningKeywords = [
        "student",
        "dependent",
        "unemployed",
        "home",
        "house",
        "homemaker",
        "housewife",
        "house wife",
        "home maker",
      ];
      return !nonEarningKeywords.some((keyword) =>
        occupation.includes(keyword)
      );
    }).length;

  console.log("computedEarningMembers:", computedEarningMembers);

  // Helper function to render family members
  const renderFamilyMembers = () => {
    if (!familyMembersList.length) {
      return `<ul><li>Not Provided</li></ul>`;
    }

    return `<ul>${familyMembersList
      .map((member: any) => {
        const relation = member.relationToApplicant || member.relation || "";
        const name = member.name || "";
        const age = member.age || "";
        const ageText =
          age !== ""
            ? ` – ${String(age).includes("yr") ? age : `${age}yrs`}`
            : "";
        return `<li>${relation} - ${name}${ageText}</li>`;
      })
      .join("")}</ul>`;
  };

  const renderBusinessModelDetails = () => {
    const businessModel =
      verificationData.businessFinancialProfile?.businessModelBackground || "";
    const modelLines = businessModel
      .split("\n")
      .filter((line: string) => line.trim().length > 0);
    if (modelLines.length > 0) {
      return modelLines
        .map((line: string) => `<li>${line.trim()}</li>`)
        .join("");
    }
    return "<li>Not Provided</li>";
  };

  

  const ensureArray = <T>(value: T | T[] | undefined | null): T[] => {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined) return [];
    return [value];
  };

  return `
    ${pdBaseTemplate(html_data)}

    <div class="template-content">
        <h2 style="margin:8px 0;line-height:1.5;text-align:center;">AXIS BANK</h2>
        <p style="margin:8px 0;line-height:1.5"></p>
        <p style="margin:8px 0;line-height:1.5"><strong>PERSONAL DISCUSSION REPORT</strong></p>
            
        <table style="${tableStyle}">
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Application ID: - </strong>${verificationData.applicantDetails?.applicationNumber || ""}</p></td>
                <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">PD Date: ${verificationData.applicantDetails?.pdDate || istDate.split(" ")[0]}</p></td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Product (HL / LAP / Asha HL)</strong></p></td>
                <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.product || ""}</p></td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Loan Amount</strong></p></td>
                <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.applicantDetails?.loanAmount || 0)}</p></td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Customer Name</strong></p></td>
                <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.applicantName || ""}</p></td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>PD address: - (Residence/Office/Factory/Godown)</strong></p></td>
                <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.pdAddress || ""}</p></td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Contact Number (Mobile / Landline)</strong></p></td>
                <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.applicantContactNumber || ""}</p></td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Person Met: </strong></p></td>
                <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.applicantDetails?.personMet || ""} - ${verificationData.applicantDetails?.relationshipWithBorrower || ""}</p></td>
            </tr>
        </table>
        
        <table style="${tableStyle}">
            <tr>
                <td colspan="2" style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Borrower Details</strong></p></td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Family Background (Details of family members, major income earning member, dependents details etc.)</strong></p></td>
                <td style="${valueCellStyle}">${renderFamilyMembers()}</td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Total Family members (Nos)</strong></p></td>
                <td style="${valueCellStyle}">${formatSummaryValue(computedTotalFamilyMembers)}</td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>No. of Earning members (Nos)</strong></p></td>
                <td style="${valueCellStyle}">${formatSummaryValue(computedEarningMembers)}</td>
            </tr>
        </table>
        
        <table style="${tableStyle}">
            <tr>
                <td colspan="2" style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Business place and vintage details</strong></p></td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Name of firm:</strong></p></td>
                <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.businessPlaceVintage?.businessName || verificationData.businessDetails?.businessName || ""}</p></td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Constitution (proprietorship / Partnership / Company / LLP)</strong></p></td>
                <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.businessPlaceVintage?.constitution || verificationData.businessDetails?.typeOfBusiness || ""}</p></td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Who started the business?<br />(self / acquired / second gen)</strong></p></td>
                <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.businessPlaceVintage?.whoStartedBusiness || ""}</p></td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Ownership of business place (self-owned / rented)</strong></p></td>
                <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.businessPlaceVintage?.ownershipOfBusinessPlace || verificationData.businessDetails?.businessPremisesOwnership || ""}</p></td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Years in current office</strong></p></td>
                <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.businessPlaceVintage?.yearsInCurrentOffice || ""}</p></td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Years in current city</strong></p></td>
                <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.businessPlaceVintage?.yearsInCurrentCity || ""}</p></td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Years in current business</strong></p></td>
                <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.businessPlaceVintage?.yearsInCurrentBusiness || ""}</p></td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Previous employment (if any)</strong></p></td>
                <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.businessPlaceVintage?.previousEmployment || ""}</p></td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Is Resi Cum office? If yes details of separate office set up.</strong></p></td>
                <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.businessPlaceVintage?.isResiCumOffice || ""}</p></td>
            </tr>
        </table>
        
        <table style="${tableStyle}">
            <tr>
                <td colspan="9" style="${labelCellStyle}"><strong>Business/Financial Profile</strong></p></td>
            </tr>
            <tr>
                <td colspan="2" style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Nature of business Trading / manufacturing /<br />services / others: please specify)</strong></p></td>
                <td colspan="7" style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.businessFinancialProfile?.natureOfBusiness || verificationData.businessDetails?.natureOfBusiness || ""}</p></td>
            </tr>
            <tr>
                <td colspan="2" style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Product / services offered.</strong></p></td>
                <td colspan="7" style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.businessFinancialProfile?.productServicesOffered || verificationData.businessDetails?.aboutTheBusiness || ""}</p></td>
            </tr>
            <tr>
                <td colspan="2" style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Business Model & background of business.</strong></p></td>
                <td colspan="7" style="${valueCellStyle}">
                    <ul>
                        ${renderBusinessModelDetails()}
                    </ul>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Other details business observed during the visit:</strong></p></td>
                <td colspan="7" style="${valueCellStyle}">
                    <ul>
                        <li>Business name board seen: ${verificationData.otherDetailsObserved?.businessNameBoardSeen === true ? "Yes" : "No"}</li>
                        <li>No of employees seen: ${verificationData.otherDetailsObserved?.noOfEmployeesSeen || verificationData.businessDetails?.numberOfWorkers || ""}</li>
                        <li>Business activity seen: ${verificationData.otherDetailsObserved?.businessActivitySeen === true ? "Yes" : verificationData.businessDetails?.businessActivityObserved || ""}</li>
                        <li>Stock seen: ${verificationData.otherDetailsObserved?.stockSeen === true ? "Yes" : verificationData.businessDetails?.stockLevelObserved || ""}</li>
                        <li>No. of machines seen: ${verificationData.otherDetailsObserved?.noOfMachinesSeen || ""}</li>
                    </ul>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Top 3 clients (customers) (Average debtor days).</strong></p></td>
                <td colspan="7" style="${valueCellStyle}">
                    <ul>
                        ${(verificationData.otherDetailsObserved?.top3ClientsCustomers || verificationData.businessDetails?.regularCustomers || []).map((customer: any) => `<li>${customer.nameOfRegularCustomers || customer.name || ""} - ${customer.contactNumberOfRegularCustomers || customer.contactDetails || ""} - ${customer.averageDebtorDays || ""} days</li>`).join("") || ""}
                    </ul>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Top 3 clients (suppliers) (Average creditor days).</strong></p></td>
                <td colspan="7" style="${valueCellStyle}">
                    <ul>
                        ${(verificationData.otherDetailsObserved?.top3ClientsSuppliers || verificationData.businessDetails?.regularSuppliers || []).map((supplier: any) => `<li>${supplier.nameOfRegularSuppliers || supplier.name || ""} - ${supplier.contactNumberOfRegularSuppliers || supplier.contactDetails || ""} - ${supplier.averageCreditorDays || ""} days</li>`).join("") || ""}
                    </ul>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Any other business or alternate source of income such as rentals, commission etc. (Provide details)</strong></p></td>
                <td colspan="7" style="${valueCellStyle}">
                    <ul>
                        <li>Other business interest / source of income / family income: ${verificationData.commonPoints?.otherIncomes || verificationData.otherDetailsObserved?.otherBusinessIncomeSource || ""}</li>
                    </ul>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Any other observations / remarks during visit:</strong></p></td>
                <td colspan="7" style="${valueCellStyle}">
                    <ul>
                        <li><strong>${verificationData.otherDetailsObserved?.otherObservationsRemarks || ""}</strong></li>
                    </ul>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Details of neighbor check /<br />Third party check done and status:</strong></p></td>
                <td colspan="7" style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.otherDetailsObserved?.neighborCheckThirdParty || ""}</p></td>
            </tr>
            <tr>
                <td colspan="9" style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Common Points applicable for all cases</strong></p></td>
            </tr>
            <tr>
                <td colspan="2" style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>1) Turnover and Margin</strong></p></td>
                <td colspan="7" style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.commonPoints?.turnOverAndMargin || formatCurrency(verificationData.commonPoints?.monthlyGrossReceipts || 0)} with ${verificationData.commonPoints?.netMargin || 0}% margin</p></td>
            </tr>
            <tr>
                <td colspan="2" style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>2) Sales fluctuations (Seasonal business)</strong></p></td>
                <td colspan="7" style="${valueCellStyle}">
                    <p style="margin:8px 0;line-height:1.5">Peak sales months: ${verificationData.commonPoints?.peakSalesMonths || "Not assessed"}</p>
                    <p style="margin:8px 0;line-height:1.5">Low sales months: ${verificationData.commonPoints?.lowSalesMonths || "Not assessed"}</p>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>3) Customer Identity established during PD</strong></p></td>
                <td colspan="7" style="${valueCellStyle}">
                    <p style="margin:8px 0;line-height:1.5">${verificationData.commonPoints?.customerIdentityEstablished || "Not assessed"}</p>
                    ${verificationData.commonPoints?.customerIdentityEstablished === "Yes" && verificationData.commonPoints?.customerIdentityDetails ? `<p style="margin:8px 0;line-height:1.5">If yes, established through document: ${verificationData.commonPoints.customerIdentityDetails}</p>` : ""}
                </td>
            </tr>
            <tr>
                <td colspan="2" style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>4) Chartered A/c details</strong></p></td>
                <td colspan="7" style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.commonPoints?.charteredACDetails || "N/A"}</p></td>
            </tr>
            <tr>
                <td  colspan="2" style="${labelCellStyle}"><strong>5) Details of existing loans confirmed during PD</strong></td>
            <td> 
             <table style="${tableStyle}">
                <tr>
                    <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Loan type</strong></p></td>
                    <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Loan Amt</strong></p></td>
                    <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Tenure</strong></p></td>
                    <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>EMI</strong></p></td>
                    <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Bal tenure</strong></p></td>
                    <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Bank Name</strong></p></td>
                </tr>
          
            ${ensureArray(verificationData.commonPoints.detailsOfExistingLoans).map((loan: any) => `
                <tr>
                    <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${loan.loanType || ""}</p></td>
                    <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${formatCurrency(loan.loanAmount || 0)}</p></td>
                    <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${loan.tenure || ""}</p></td>
                    <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${formatCurrency(loan.emi || 0)}</p></td>
                    <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${loan.balTenure || ""}</p></td>
                    <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${loan.bankName || ""}</p></td>
                </tr>
            `).join("")}
            </table>
            </td>
            <tr>
                <td colspan="2" style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>6) Loans taken from<br />family, friends business associates etc.</strong></p></td>
                <td colspan="6" style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.commonPoints?.loansFromFamilyFriends || "N/A"}</p></td>
            </tr>
            <tr>
                <td colspan="2" style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>7) Details of Working capital (OD/CC) if any</strong></p></td>
                <td colspan="7" style="${valueCellStyle}">
                    <p style="margin:8px 0;line-height:1.5">Bank Name: ${verificationData.commonPoints?.workingCapitalBankName || ""}</p>
                    <p style="margin:8px 0;line-height:1.5">Limit: ${verificationData.commonPoints?.workingCapitalLimit || ""}</p>
                    <p style="margin:8px 0;line-height:1.5">Utilisation: ${verificationData.commonPoints?.workingCapitalUtilisation || ""}</p>
                    <p style="margin:8px 0;line-height:1.5">Collateral: ${verificationData.commonPoints?.workingCapitalCollateral || ""}</p>
                    <p style="margin:8px 0;line-height:1.5">Details of linked loans (if any): ${verificationData.commonPoints?.workingCapitalLinkedLoans || ""}</p>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>8) End Use of proposed Loan in detail.<br />(Basis purpose of loan, in case cash out end<br />use must be detailed)</strong></p></td>
                <td colspan="7" style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${verificationData.commonPoints?.endUseOfProposedLoan || ""}</p></td>
            </tr>
        </table>
        
        <table style="${tableStyle}">
            <tr>
                <td colspan="5" style="${labelCellStyle}"></td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Banking details:</strong></p></td>
               <td>
               <table style="${tableStyle}">
                <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Bank Name</strong></p></td>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>A/c type</strong></p></td>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Average Balances</strong></p></td>
              </tr>
            ${ensureArray(verificationData.bankingDetails.bankingDetails).map((bank: any) => `
                <tr>
                    <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${bank.bankName || ""}</p></td>
                    <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${bank.accountType || ""}</p></td>
                    <td style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">${formatCurrency(bank.averageBalance) || ""}</p></td>
                </tr>
            `).join("")}
            </table>
            </td>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Banking performance</strong></p></td>
                <td colspan="3" style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5">Any cheque bounces seen (Y/N): ${verificationData.bankingDetails?.anyChequeBounces || ""}</p></td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Details of collateral</strong></p></td>
                <td colspan="3" style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Address of property: ${verificationData.bankingDetails?.addressOfProperty || ""}</strong></p></td>
            </tr>
            <tr>
                <td style="${labelCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>Status of PD (Positive, Negative, Credit Manager visit<br />needed)</strong></p></td>
                <td colspan="3" style="${valueCellStyle}"><p style="margin:8px 0;line-height:1.5"><strong>${verificationData.bankingDetails?.statusOfPD || ""}</strong></p></td>
            </tr>
        </table>
    </div>
    ${pdBaseTemplateFooter(html_data)}


    
  `;
};
