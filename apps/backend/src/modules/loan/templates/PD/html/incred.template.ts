import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:16px 0";
const labelCellStyle =
  "border:1px solid #c7cdd1;padding:8px;font-weight:600;color:#222;background:#f4f6fb;vertical-align:top;width:32%";
const valueCellStyle =
  "border:1px solid #c7cdd1;padding:8px;color:#333;vertical-align:top";

const hasValue = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.some((entry) => hasValue(entry));
  if (typeof value === "object")
    return Object.values(value).some((entry) => hasValue(entry));
  return false;
};

const formatMultiline = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  return String(value).replace(/\n+/g, "<br>");
};

const formatCurrency = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return formatMultiline(value);
  return `Rs. ${numeric.toLocaleString("en-IN")}/-`;
};

const ensureArray = <T,>(value: T | T[] | null | undefined): T[] => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
};

const renderKeyValue = (label: string, value: any, formatter?: (value: any) => string, options?: { colspan?: number }) => {
  const rendered = formatter ? formatter(value) : formatMultiline(value);
  return `
    <tr>
      <td style="${labelCellStyle}">${label}</td>
      <td style="${valueCellStyle}" colspan="${options?.colspan || 1}">
        ${rendered}
      </td>
    </tr>
  `;
};

const renderArrayTable = (headers: string[], rows: string[][]): string => {
  return `
    <table style="${tableStyle}">
      <tr>
        ${headers.map((header) => `<th style="${labelCellStyle}">${header}</th>`).join("")}
      </tr>
      ${rows.map((row) => `
        <tr>
          ${row.map((cell) => `<td style="${valueCellStyle}">${cell}</td>`).join("")}
        </tr>
      `).join("")}
    </table>
  `;
};

export const incredTemplate = (verificationData: any, html_data: any) => {

    const general = verificationData.general || {};
    const applicantAndBusinessDetails = verificationData.applicantAndBusinessDetails || {};
    const asPerAssessment = verificationData.asPerAssessment || {};
    const noOfEmployees = verificationData.noOfEmployees || {};
    const debtorsCreditorsStock = verificationData.debtorsCreditorsStock || {};
    const capitalInvestmentTillDate = verificationData.capitalInvestmentTillDate || {};
    const documentsObserved = verificationData.documentsObserved || {};
    const familyMembers = verificationData.personalDetailsFamilyBackground?.familyMembers || [];
    const noOfDependents = verificationData.noOfDependents || {};
    const residenceOfficeCollateralDetails = verificationData.residenceOfficeCollateralDetails || {};
    const liabilities = verificationData.otherLiabilitiesLoansApplicantCoApplicants?.details || [];
    const chitFundetc = verificationData.chitFundetc || {};
    const assets = verificationData.otherAssets || {};
    const otherSourcesOfIncome = verificationData.otherSourcesOfIncome || {};
    const references = verificationData.references?.details || [];
    const observationsRemarksDuringPd = verificationData.observationsRemarksDuringPd || {};
    const estimatedIncome = verificationData.estimatedIncome || {};
    const overallPositivesOrNegatives = verificationData.overallPositivesOrNegatives || {};

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content incred-template">
      <h1 style="margin:0 0 16px;color:#1f2a37;font-size:24px; text-align:center">INCRED</h1>
      <table style="${tableStyle}">
        ${renderKeyValue("Application No:", general.applicationNo)}
        ${renderKeyValue("Name of Applicant/Concern", general.nameOfApplicant)}
        ${renderKeyValue("Name of Co-Applicant / Co-applicant's", general.nameOfCoApplicant)}
        ${renderKeyValue("Visited Premise / Business Address", general.visitedPremiseBusinessAddress)}
        ${renderKeyValue("Person Meet/owner of the business with Contact No", general.personMeetOwnerOfTheBusinessWithContactNo)}
        ${renderKeyValue("Date & time of Visit", general.dateTimeOfVisit)}
        ${renderKeyValue("PD Done by with Designation", general.pdDoneByWithDesignation)}
        ${renderKeyValue("Loan Amt. Applied and Purpose", general.loanAmtAppliedAndPurpose)}

        ${renderKeyValue("About the Applicant/Business", formatMultiline(applicantAndBusinessDetails.aboutTheApplicantOrBusiness))}
        ${renderKeyValue("About the Co-Applicant", formatMultiline(applicantAndBusinessDetails.aboutTheCoApplicant))}

        <tr>
            <td style="${labelCellStyle}">As Per Audited ITR's</td>
            <td style="${valueCellStyle}">Turnover: ${formatCurrency(applicantAndBusinessDetails.asPerAuditedItrsTurnover)} <br> Net Profit: ${formatCurrency(applicantAndBusinessDetails.asPerAuditedItrsNetProfit)} </td>
        </tr>

        <tr>
            <td style="${labelCellStyle}">As Per Assessment</td>
            <td style="border:1px solid #ccc;padding:8px">
                <table style="${tableStyle}">
                    <tr>
                        <td style="${labelCellStyle}">Receipts Per Month</td>
                        <td style="${valueCellStyle}">${formatCurrency(asPerAssessment.receiptsPerMonth)}</td>
                    </tr>
                    <tr>
                        <td style="${labelCellStyle}">Purchases Per Month</td>
                        <td style="${valueCellStyle}">${formatCurrency(asPerAssessment.purchasesPerMonth)}</td>
                    </tr>
                    <tr>
                        <td style="${labelCellStyle}">Expenses Per Month</td>
                        <td style="${valueCellStyle}">${formatCurrency(asPerAssessment.expensesPerMonth)}</td>
                    </tr>
                </table>
            </td>
        </tr>

        ${renderKeyValue("No. of Employees", noOfEmployees.noOfEmployees)}

        <tr>
            <td style="${labelCellStyle}">Debtors/Creditors/Stock</td>
            <td style="border:1px solid #ccc;padding:8px">
                <table style="${tableStyle}">
                    <tr>
                        <td style="${labelCellStyle}"></td>
                        <td style="${labelCellStyle}">FY 2020-21</td>
                        <td style="${labelCellStyle}">Current Period / At Time of PD</td>
                        <td style="${labelCellStyle}"></td>
                        <td style="${labelCellStyle}">No. of Days</td>
                    </tr>
                    <tr>
                        <td style="${labelCellStyle}">Debtors</td>
                        <td style="${valueCellStyle}">${formatCurrency(debtorsCreditorsStock.debtors.fy2020to2021)}</td>
                        <td style="${valueCellStyle}">${formatMultiline(debtorsCreditorsStock.debtors.currentPeriodOrAtTimeOfPd)}</td>
                        <td style="${valueCellStyle}">Credit Period allowed to Debtors</td>
                        <td style="${valueCellStyle}">${debtorsCreditorsStock.debtors.noOfDays}</td>
                    </tr>
                    <tr>
                        <td style="${labelCellStyle}">Creditors</td>
                        <td style="${valueCellStyle}">${formatCurrency(debtorsCreditorsStock.creditors.fy2020to2021)}</td>
                        <td style="${valueCellStyle}">${formatMultiline(debtorsCreditorsStock.creditors.currentPeriodOrAtTimeOfPd)}</td>
                        <td style="${valueCellStyle}">Credit Period allowed by Creditors/Supplies</td>
                        <td style="${valueCellStyle}">${debtorsCreditorsStock.creditors.noOfDays}</td>
                    </tr>
                    <tr>
                        <td style="${labelCellStyle}">Stock</td>
                        <td style="${valueCellStyle}">${formatCurrency(debtorsCreditorsStock.stock.fy2020to2021)}</td>
                        <td style="${valueCellStyle}">${formatMultiline(debtorsCreditorsStock.stock.currentPeriodOrAtTimeOfPd)}</td>
                        <td style="${valueCellStyle}">Credit Period allowed by Creditors/Supplies</td>
                        <td style="${valueCellStyle}">${debtorsCreditorsStock.stock.noOfDays}</td>
                    </tr>
                </table>
            </td>
        </tr>

        ${renderKeyValue("Capital Investment till date", capitalInvestmentTillDate.tillDate)}

        ${renderKeyValue("Documents observed/Statutory requirement docs", documentsObserved.documentsObserved)}
        ${renderKeyValue("Docs Verified for P&L", documentsObserved.docsVerified)}


      </table>

      <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Personal Details - Family Background</h2>
      <table style="${tableStyle}">
        <tr>
            <td style="${labelCellStyle}">Name</td>
            <td style="${labelCellStyle}">Relation</td>
            <td style="${labelCellStyle}">Age(Yrs)</td>
            <td style="${labelCellStyle}">Qualification</td>
            <td style="${labelCellStyle}">Occupation</td>
        </tr>
        ${familyMembers?.map((member) => `
            <tr>
                <td style="${valueCellStyle}">${member.name || ""}</td>
                <td style="${valueCellStyle}">${member.relation || ""}</td>
                <td style="${valueCellStyle}">${member.age || ""} yrs</td>
                <td style="${valueCellStyle}">${member.qualification || ""}</td>
                <td style="${valueCellStyle}">${member.occupation || ""}</td>
            </tr>
        `).join("")}

        ${renderKeyValue("No. of Dependents", noOfDependents.noOfDependents, undefined, { colspan: 5 })}
        ${renderKeyValue("General Lifestyle/Personality", noOfDependents.generalLifestylePersonality, undefined, { colspan: 5 })}
      </table>

      <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">RESIDENCE/OFFICE/Collateral Details:</h2>
      <table style="${tableStyle}">
        ${renderKeyValue("Ownership and Name of Owners", residenceOfficeCollateralDetails.ownershipAndNameOfOwners)}
        ${renderKeyValue("Office Premises Details", residenceOfficeCollateralDetails.officePremisesDetails)}
        ${renderKeyValue("Residence/Current Address Details", residenceOfficeCollateralDetails.residenceCurrentAddressDetails)}
        ${renderKeyValue("Collateral Description and Type & Approx Value", residenceOfficeCollateralDetails.collateralDescriptionAndTypeApproxValue)}
      </table>

      <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Other Liabilities / Loans (Applicant/Co-Applicants):</h2>
      <table style="${tableStyle}">
        <tr>
            <td style="${labelCellStyle}">Financier</td>
            <td style="${labelCellStyle}">Nature of Loan / Account No.</td>
            <td style="${labelCellStyle}">Loan Amount</td>
            <td style="${labelCellStyle}">EMI</td>
            <td style="${labelCellStyle}">Will Close / Continue</td>
        </tr>
        ${liabilities.map((liability) => `
            <tr>
                <td style="${valueCellStyle}">${liability.financier}</td>
                <td style="${valueCellStyle}">${liability.natureOfLoan}</td>
                <td style="${valueCellStyle}">${formatCurrency(liability.loanAmount)}</td>
                <td style="${valueCellStyle}">${formatCurrency(liability.emi)}</td>
                <td style="${valueCellStyle}">${liability.willCloseContinue}</td>
            </tr>
        `).join("")}
        <tr>
            ${renderKeyValue("Chit fund, Private Finance and Hand loans etc", chitFundetc.chitFundetc, undefined, { colspan: 5 })}
        </tr>
      </table>

      <table style="${tableStyle}">
        ${renderKeyValue("Other Assets", formatMultiline(assets.otherAssets))}

        ${renderKeyValue("Other Sources of Income", formatMultiline(otherSourcesOfIncome.otherSourcesOfIncome))}
      </table>

      <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">References:</h2>
      <table style="${tableStyle}">
      <tr>
            <td style="${labelCellStyle}">Name of the Person</td>
            <td style="${labelCellStyle}">Telephone No. / Address for Communication</td>
            <td style="${labelCellStyle}">Supplier / Buyer / Market Reference</td>
        </tr>
        ${references?.map((reference) => `
            <tr>
                <td style="${valueCellStyle}">${reference.nameOfThePerson}</td>
                <td style="${valueCellStyle}">${reference.telephoneNoAddressForCommunication}</td>
                <td style="${valueCellStyle}">${reference.supplierOrBuyerOrMarketReference}</td>
            </tr>
        `).join("")}
      </table>

      <table style="${tableStyle}">
        ${renderKeyValue("Observations/Remarks During PD", formatMultiline(observationsRemarksDuringPd.observationsRemarksDuringPd))}
      </table>

      <p style="font-size:18px;font-weight:bold;text-align:center;"><u>Estimated Income</u></p>
      <p style="margin:8px 0;line-height:1.5">${formatMultiline(estimatedIncome?.estimatedIncomeDetails)}</p> 
      <p style="margin:8px 0;line-height:1.5"><strong>Gross Sales as per our assumptions</strong> ${formatCurrency(estimatedIncome.grossSalesAsPerOurAssumptions)}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>PBDIT Margin</strong> ${estimatedIncome?.pbditMargin + "%" || "Not provided"}</p>
      <p style="margin:8px 0;line-height:1.5"><strong>PAT of the Business Concern (Rs.)</strong> ${formatCurrency(estimatedIncome.patOfTheBusinessConcern)}</p>

      <p style="font-size:18px;"><strong>Overall Positives or Negatives:</strong>  ${formatMultiline(overallPositivesOrNegatives.overallPositivesOrNegatives)}</p>

      <p style="font-size:18px;"><strong>Note:</strong> We have taken the estimated figures based on customer feedback and the gross profit has been arrived taking into consideration market information gathered on our experience.</p>
      <p style="font-size:18px;"><strong>Disclaimer:</strong> The Report (Including any attachments) has been prepared based on verbal information provided by the person contacted. Incred Financial Services will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. Our efficient services will not be liable in any case</p>

    </div>
    ${pdBaseTemplateFooter(html_data)}

  `;
};