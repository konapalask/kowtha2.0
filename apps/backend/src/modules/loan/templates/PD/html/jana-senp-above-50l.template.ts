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

const formatObservations = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  return String(value).replace(/\n+/g, "<br>");
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


export const janaSenpAbove50lTemplate = (verificationData: any, html_data: any) => {
  const general = verificationData.general || {};
  const aboutTheApplicant = verificationData.aboutTheApplicant || {};
  const residentialDetails = verificationData.residentialDetails || {};
  const coApplicantDetails = verificationData.coApplicantDetails || {};
  const familyDetails = verificationData.familyDetails || {};
  const constitution = verificationData.constitution || {};
  const shareholdingDetails = verificationData.shareholdingDetails || {};
  const aboutTheBusiness = verificationData.aboutTheBusiness || {};
  const productOrServiceDetails = verificationData.productOrServiceDetails || {};
  const financialDetails = verificationData.financialDetails || {};
  const documentsObserved = verificationData.documentsObserved || {};
  const suppleirsOrCreditors = verificationData.suppleirsOrCreditors || {};
  const clientsOrDebtors = verificationData.clientsDebtors || {};
  const averageStockMaintained = verificationData.averageStockMaintained || {};
  const turnoverAndMargins = verificationData.turnoverAndMargins || {};
  const expenditureDetails = verificationData.expenditureDetails || {};
  const workingHours = verificationData.workingHours || {};
  const otherMajorExpensesAndBasis = verificationData.otherMajorExpensesAndBasis || {};
  const assetDetails = verificationData.assetDetails || {};
  const existingLoans = verificationData.existingLoans || {};
  const bankingDetails = verificationData.bankingDetails || {};
  const endUseOfLoan = verificationData.endUseOfLoan || {};
  const detailsOfSecurityOffered = verificationData.detailsOfSecurityOffered || {};
  const thirdPartyConfirmation = verificationData.thirdPartyConfirmation || {};
  const observations = verificationData.observations || {};
  const otherIncome = verificationData.otherIncome || {};
  const remarks = verificationData.remarks || {};
  const status = verificationData.status || {};

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content">
      <h1 class="report-title">Jana Senp Above 50l</h1>
      <table style="${tableStyle}">
        ${renderKeyValue("Name of Applicant", general.applicantName)}
        ${renderKeyValue("Date of Report", general.dateOfReport)}
        ${renderKeyValue("Application ID", general.applicationNumber)}
        ${renderKeyValue("Name of Concern", general.nameOfConcern)}
        ${renderKeyValue("Initiated Address", general.initiatedAddress)}
        ${renderKeyValue("Visited Address", general.visitedAddress)}
        ${renderKeyValue("Phone", general.phoneNumber)}
        ${renderKeyValue("Appointment Fixed", general.appointmentFixedTime)}
        ${renderKeyValue("Date of Visit", general.dateOfVisit)}
        ${renderKeyValue("Structure of Loan", general.structureOfLoan)}
        ${renderKeyValue("No. of Visit", general.numberOfVisits)}
        ${renderKeyValue("Person Met", general.personMet)}
        ${renderKeyValue("Visited By", general.visitedBy)}
        ${renderKeyValue("Checked By", general.checkedBy)}
       </table>

       <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}">About the Applicant</td>
        </tr>
        <tr>
        <td style="${valueCellStyle}">${aboutTheApplicant.aboutTheApplicant}</td>
       </tr>
       <tr>
        <td style="text-align: center;${labelCellStyle}">Residential Details</td>
        </tr>
        <tr>
        <td style="${valueCellStyle}">${residentialDetails.residentialDetails}</td>
       </tr>
       <tr>
        <td style="text-align: center;${labelCellStyle}">Co-Applicant Details</td>
        </tr>
        <tr>
        <td style="${valueCellStyle}">${coApplicantDetails.coApplicantDetails}</td>
       </tr>
       </table>

       <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}" colspan="7">Family Details</td>
       </tr>
       <tr>
        <td style="${labelCellStyle}">Name</td>
        <td style="${labelCellStyle}">Relation with Applicant</td>
        <td style="${labelCellStyle}">Age (Yrs)</td>
        <td style="${labelCellStyle}">Qualification</td>
        <td style="${labelCellStyle}">Occupation</td>
        <td style="${labelCellStyle}">Income per month (approx.)</td>
        <td style="${labelCellStyle}">Dependent</td>
       </tr>
        ${ensureArray(familyDetails.familyMembers).map((family: any) => `
            <tr>
            <td style="${valueCellStyle}">${family.name}</td>
            <td style="${valueCellStyle}">${family.relationship}</td>
            <td style="${valueCellStyle}">${family.age}</td>
            <td style="${valueCellStyle}">${family.qualification}</td>
            <td style="${valueCellStyle}">${family.occupation}</td>
            <td style="${valueCellStyle}">${formatCurrency(family.incomePerMonth)}</td>
            <td style="${valueCellStyle}">${family.dependent}</td>
            </tr>
        `).join("")} 
       </tr>
       </table>

       <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}">Constitution</td>
        <td style="${valueCellStyle}">${formatMultiline(constitution.constitution)}</td>
       </tr>
       </table>



       <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}" colspan="6">Shareholding Details</td>
       </tr>
       <tr>
        <td style="${labelCellStyle}">Name of the Shareholder</td>
        <td style="${labelCellStyle}">Relation with Main Applicant</td>
        <td style="${labelCellStyle}">Designation</td>
        <td style="${labelCellStyle}">% of Shareholding</td>
        <td style="${labelCellStyle}">Coming into Loan Structure</td>
        <td style="${labelCellStyle}">Functional role of partner / director</td>
       </tr>
       ${ensureArray(shareholdingDetails.shareholdingDetails).map((shareholder: any) => `
        <tr>
        <td style="${valueCellStyle}">${shareholder.shareholderName}</td>
        <td style="${valueCellStyle}">${shareholder.relationship}</td>
        <td style="${valueCellStyle}">${shareholder.designation}</td>
        <td style="${valueCellStyle}">${shareholder.shareholdingPercentage}</td>
        <td style="${valueCellStyle}">${shareholder.comingIntoLoanStructure}</td>
        <td style="${valueCellStyle}">${shareholder.functionalRole}</td>
       </tr>
       `).join("")}
       </table>

       <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}" colspan="2">About the Business</td>
       </tr>
       <tr>
        <td style="${valueCellStyle}" colspan="2">${formatMultiline(aboutTheBusiness.aboutTheBusiness)}</td>
       </tr>

       <tr>
        <td style="${labelCellStyle}">Details of Some Products / Services</td>
        <td style="${labelCellStyle}">Product/Service Price Range approx.</td>
       </tr>
       ${ensureArray(productOrServiceDetails.productOrServiceDetails).map((product: any) => `
        <tr>
        <td style="${valueCellStyle}">${product.productOrServiceDetail}</td>
        <td style="${valueCellStyle}">${product.productOrServicePriceRange}</td>
       </tr>
       `).join("")}
       </table>


       <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}" colspan="4">Financial Comparison & Status</td>
       </tr>
       <tr>
        <td style="${labelCellStyle}">Particulars</td>
        <td style="${labelCellStyle}">AY 2024-25</td>
        <td style="${labelCellStyle}">AY 2023-24</td>
        <td style="${labelCellStyle}">Remarks</td>
       </tr>
        <tr>
        <td style="${labelCellStyle}">Annual Receipts</td>
        <td style="${valueCellStyle}">${formatCurrency(financialDetails?.annualReceipts?.ay202425)}</td>
        <td style="${valueCellStyle}">${formatCurrency(financialDetails?.annualReceipts?.ay202324)}</td>
        <td style="${valueCellStyle}">${formatMultiline(financialDetails?.annualReceipts?.remarks)}</td>
       </tr>
       <tr>
        <td style="${labelCellStyle}">Gross Profit</td>
        <td style="${valueCellStyle}">${formatCurrency(financialDetails?.grossProfit?.ay202425)}</td>
        <td style="${valueCellStyle}">${formatCurrency(financialDetails?.grossProfit?.ay202324)}</td>
        <td style="${valueCellStyle}">${formatMultiline(financialDetails?.grossProfit?.remarks)}</td>
       </tr>
       <tr>
        <td style="${labelCellStyle}">Gross Profit Margin</td>
        <td style="${valueCellStyle}">${financialDetails?.grossProfitMargin?.ay202425 ? `${financialDetails.grossProfitMargin.ay202425}%` : "Not provided"}</td>
        <td style="${valueCellStyle}">${financialDetails?.grossProfitMargin?.ay202324 ? `${financialDetails.grossProfitMargin.ay202324}%` : "Not provided"}</td>
        <td style="${valueCellStyle}">${formatMultiline(financialDetails?.grossProfitMargin?.remarks)}</td>
       </tr>
       <tr>
        <td style="${labelCellStyle}">Net Profit</td>
        <td style="${valueCellStyle}">${formatCurrency(financialDetails?.netProfit?.ay202425)}</td>
        <td style="${valueCellStyle}">${formatCurrency(financialDetails?.netProfit?.ay202324)}</td>
        <td style="${valueCellStyle}">${formatMultiline(financialDetails?.netProfit?.remarks)}</td>
       </tr>
       <tr>
        <td style="${labelCellStyle}">Net Profit Margin</td>
        <td style="${valueCellStyle}">${financialDetails?.netProfitMargin?.ay202425 ? `${financialDetails.netProfitMargin.ay202425}%` : "Not provided"}</td>
        <td style="${valueCellStyle}">${financialDetails?.netProfitMargin?.ay202324 ? `${financialDetails.netProfitMargin.ay202324}%` : "Not provided"}</td>
        <td style="${valueCellStyle}">${formatMultiline(financialDetails?.netProfitMargin?.remarks)}</td>
       </tr>
       <tr>
        <td style="${labelCellStyle}">Filled Date</td>
        <td style="${valueCellStyle}">${formatMultiline(financialDetails?.filledDate?.ay202425)}</td>
        <td style="${valueCellStyle}">${formatMultiline(financialDetails?.filledDate?.ay202324)}</td>
        <td style="${valueCellStyle}">${formatMultiline(financialDetails?.filledDate?.remarks)}</td>
       </tr>
       </table>



       <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}" colspan="4">Documents Observed</td>
       </tr>
       <tr>
        <td style="${labelCellStyle}">Document Category</td>
        <td style="${labelCellStyle}">Document Name</td>
        <td style="${labelCellStyle}">Document Type</td>
        <td style="${labelCellStyle}">Remarks</td>
       </tr>
       ${ensureArray(documentsObserved.documents).map((document: any) => `
        <tr>
        <td style="${valueCellStyle}">${document.documentCategory}</td>
        <td style="${valueCellStyle}">${document.documentName}</td>
        <td style="${valueCellStyle}">${document.documentType}</td>
        <td style="${valueCellStyle}">${formatMultiline(document.documentRemarks)}</td>
       </tr>
       `).join("")}
       </table>


       <table style="${tableStyle}">
        <tr>
            <td style="text-align: center;${labelCellStyle}" colspan="4">Suppleirs or Creditors</td>
        </tr>
        <tr>
            <td style="${labelCellStyle}">No of Fixed Suppliers</td>
            <td style="${valueCellStyle}" colspan="3">${suppleirsOrCreditors.noOfFixedSuppliers}</td>
            </tr>
            <tr>
            <td style="${labelCellStyle}">Credit Period</td>
            <td style="${valueCellStyle}" colspan="3">${suppleirsOrCreditors.creditPeriod}</td>
            </tr>
            <tr>
            <td style="${labelCellStyle}">Cash - Cheque proportion</td>
            <td style="${valueCellStyle}" colspan="3">${suppleirsOrCreditors.cashChequeProportion}</td>
            </tr>
            <tr>
            <td style="${labelCellStyle}">Name (top 3 Suppliers)</td>
            <td style="${labelCellStyle}">Contact Details</td>
            <td style="${labelCellStyle}">Location</td>
            <td style="${labelCellStyle}">Ref. Check</td>
        </tr>
        ${ensureArray(suppleirsOrCreditors.top3suppliers).map((supplier: any) => `
            <tr>
            <td style="${valueCellStyle}">${supplier.nameOfSupplier}</td>
            <td style="${valueCellStyle}">${supplier.contactDetails}</td>
            <td style="${valueCellStyle}">${supplier.location}</td>
            <td style="${valueCellStyle}">${supplier.referenceCheck}</td>
        </tr>
        `).join("")}
       </table>




       <table style="${tableStyle}">
            <tr>
                <td style="text-align: center;${labelCellStyle}" colspan="4">Clients or Debtors</td>
            </tr>
            <tr>
                <td style="${labelCellStyle}">No of Fixed Customers</td>
                <td style="${valueCellStyle}" colspan="3">${clientsOrDebtors.noOfFixedCustomers}</td>
                </tr>
                <tr>
                <td style="${labelCellStyle}">Credit Period</td>
                <td style="${valueCellStyle}" colspan="3">${clientsOrDebtors.creditPeriod}</td>
                </tr>
                <tr>
                <td style="${labelCellStyle}">Cash - Cheque proportion</td>
                <td style="${valueCellStyle}" colspan="3">${clientsOrDebtors.cashChequeProportion}</td>
                </tr>
                <tr>
                <td style="${labelCellStyle}">Name (top 3 Customers)</td>
                <td style="${labelCellStyle}">Contact Details</td>
                <td style="${labelCellStyle}">Location</td>
                <td style="${labelCellStyle}">Ref. Check</td>
            </tr>
            ${ensureArray(clientsOrDebtors.top3customers).map((customer: any) => `
                <tr>
                <td style="${valueCellStyle}">${customer.nameOfClient}</td>
                <td style="${valueCellStyle}">${customer.contactDetails}</td>
                <td style="${valueCellStyle}">${customer.location}</td>
                <td style="${valueCellStyle}">${customer.referenceCheck}</td>
            </tr>
            `).join("")}
       </table>


       <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}">Average Stock Maintained</td>
       </tr>
       <tr>
        <td style="${valueCellStyle}">${formatMultiline(averageStockMaintained.averageStockMaintained)}</td>
       </tr>
       </table>

       <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}">Turnover and Margins</td>
       </tr>
       <tr>
        <td style="${valueCellStyle}"><strong>Turnover:</strong> ${formatCurrency(turnoverAndMargins.turnover)} <br> <strong>Margins:</strong> ${turnoverAndMargins.margins}%</td>
       </tr>
       </table>

        <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}" colspan="6">Expenditure Details <br> (Salaries & Wages)</td>
       </tr>
       <tr>
        <td style="${labelCellStyle}">No of Employees</td>
        <td style="${labelCellStyle}">Salary per month per employee</td>
        <td style="${labelCellStyle}">Status of Employee</td>
        <td style="${labelCellStyle}">No of Labours</td>
        <td style="${labelCellStyle}">Wages per month/per day</td>
        <td style="${labelCellStyle}">Status of Labour</td>
       </tr>
        <tr>
        <td style="${valueCellStyle}">${expenditureDetails.noOfEmployees}</td>
        <td style="${valueCellStyle}">${formatCurrency(expenditureDetails.salaryPerMonthPerEmployee)}</td>
        <td style="${valueCellStyle}">${expenditureDetails.statusOfEmployee}</td>
        <td style="${valueCellStyle}">${expenditureDetails.noOfLabours}</td>
        <td style="${valueCellStyle}">${formatCurrency(expenditureDetails.wagesPerMonthOrDay)}</td>
        <td style="${valueCellStyle}">${expenditureDetails.statusOfLabour}</td>
       </tr>
       <tr>
        <td style="${valueCellStyle}" colspan="6"><i>Note: Amounts mentioned above are approx.</i></td>
       </tr>
       </table>

        <table style="${tableStyle}">
        <tr>
            <td style="text-align: center;${labelCellStyle}">Working Hours</td>
            <td style="${valueCellStyle}">${workingHours.workingHours}</td>
        </tr>
       </table>


        <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}">Other Major Expenses & Basis</td>
        <td style="${valueCellStyle}">${formatMultiline(otherMajorExpensesAndBasis.otherMajorExpensesAndBasis)}</td>
       </tr>
       </table>




        <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}" colspan="7">Asset Details</td>
       </tr>
       <tr>
        <td style="${valueCellStyle}" colspan="7"><i>All Immovable properties held that is Residential, Commercial, Land, Plot and any fixed structure:</i></td>
       </tr>
       <tr>
        <td style="${labelCellStyle}">Address</td>
        <td style="${labelCellStyle}">Area measured (Sq.ft)</td>
        <td style="${labelCellStyle}">Purchase cost (in Lakhs)</td>
        <td style="${labelCellStyle}">Purchase Year</td>
        <td style="${labelCellStyle}">Market value (in Lakhs)</td>
        <td style="${labelCellStyle}">Owner Name</td>
        <td style="${labelCellStyle}">Mortgaged (Yes/No)</td>
       </tr>
       ${ensureArray(assetDetails.assets).map((property: any) => `
        <tr>
        <td style="${valueCellStyle}">${property.assetAddress}</td>
        <td style="${valueCellStyle}">${property.assetAreaMeasured}</td>
        <td style="${valueCellStyle}">${property.assetPurchaseCost}</td>
        <td style="${valueCellStyle}">${property.purchaseYear}</td>
        <td style="${valueCellStyle}">${property.marketValue}</td>
        <td style="${valueCellStyle}">${property.ownerName}</td>
        <td style="${valueCellStyle}">${property.mortgaged}</td>
       </tr>
       `).join("")}
       <tr>
        <td style="${labelCellStyle}" colspan="3">Any Liquid, Moveable & Monetary items such as Cash, Gold, FD, RD, Mutual Funds, Shares, Bonds, Securities</td>
        <td style="${valueCellStyle}" colspan="4">${formatMultiline(assetDetails.liquidMoveableAssets)}</td>
       </tr>
       <tr>
        <td style="${labelCellStyle}" colspan="3">Life insurance, mediclaim, property/asset insurance (premium & sum assured)</td>
        <td style="${valueCellStyle}" colspan="4">${formatMultiline(assetDetails.insurances)}</td>
       </tr>
       <tr>
        <td style="${labelCellStyle}" colspan="3">Capital Invested in any Business, Loans & Advances given</td>
        <td style="${valueCellStyle}" colspan="4">${formatMultiline(assetDetails.capitalInvestedBusiness)}</td>
       </tr>
       <tr>
        <td style="${labelCellStyle}" colspan="3">Car, Bike and Other Vehicles (Company Name and Model)</td>
        <td style="${valueCellStyle}" colspan="4">${formatMultiline(assetDetails.vehicles)}</td>
       </tr>
       <tr>
        <td style="${valueCellStyle}" colspan="7"><i>Note: Amounts mentioned above are approx.</i></td>
       </tr>
       </table>



        <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}" colspan="9">Loan Details</td>
       </tr>
       <tr>
        <td style="${labelCellStyle}">Name of Bank / NBFC</td>
        <td style="${labelCellStyle}">Type of Loan</td>
        <td style="${labelCellStyle}">Sanctioned Amount (in Lakhs)</td>
        <td style="${labelCellStyle}">O/S Balance (in Lakhs)</td>
        <td style="${labelCellStyle}">EMI (in Rs.)</td>
        <td style="${labelCellStyle}">Tenure (months)</td>
        <td style="${labelCellStyle}">Month on Books (MOB)</td>
        <td style="${labelCellStyle}">EMI Paid Bank</td>
        <td style="${labelCellStyle}">Secured against which asset</td>
       </tr>
       ${ensureArray(existingLoans.existingLoans).map((loan: any) => `
        <tr>
        <td style="${valueCellStyle}">${loan.bankOrNbfcName}</td>
        <td style="${valueCellStyle}">${loan.typeOfLoan}</td>
        <td style="${valueCellStyle}">${formatCurrency(loan.sanctionedAmount)}</td>
        <td style="${valueCellStyle}">${formatCurrency(loan.outstandingBalance)}</td>
        <td style="${valueCellStyle}">${formatCurrency(loan.emi)}</td>
        <td style="${valueCellStyle}">${loan.tenureRemaining}</td>
        <td style="${valueCellStyle}">${loan.monthOnBooks}</td>
        <td style="${valueCellStyle}">${loan.emiPaidBank}</td>
        <td style="${valueCellStyle}">${loan.securedAgainstAsset}</td>
       </tr>
       `).join("")}
       <tr>
        <td style="${valueCellStyle}" colspan="9"><i>Note: Amounts mentioned above are approx.</i></td>
       </tr>
       </table>


        <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}" colspan="4">Banking Details</td>
       </tr>
        <tr>
          <td style="${labelCellStyle}">Bank Name</td>
          <td style="${labelCellStyle}">Branch Name</td>
          <td style="${labelCellStyle}">Account Type</td>
          <td style="${labelCellStyle}">Open Since (Year)</td>
        </tr>
        ${ensureArray(bankingDetails.details).map((bank: any) => `
          <tr>
          <td style="${valueCellStyle}">${bank.bankName}</td>
          <td style="${valueCellStyle}">${bank.branchName}</td>
          <td style="${valueCellStyle}">${bank.accountType}</td>
          <td style="${valueCellStyle}">${bank.openSinceYear}</td>
        </tr>
        `).join("")}
       </table>


        <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}">End Use of Loan</td>
        <td style="${valueCellStyle}">${formatMultiline(endUseOfLoan.endUseOfLoan)}</td>
       </tr>
       </table>

        <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}" colspan="7">Details of Security Offered</td>
       </tr>
       <tr>
        <td style="${labelCellStyle}">Address</td>
        <td style="${valueCellStyle}" colspan="6">${detailsOfSecurityOffered.addressofSecurity}</td>
       </tr>
       <tr>
        <td style="${labelCellStyle}">Area in Sq Ft</td>
        <td style="${labelCellStyle}">Agreement Value (in Lakhs)</td>
        <td style="${labelCellStyle}">Actual Purchase Cost (in Lakhs)</td>
        <td style="${labelCellStyle}">Market Value (in Lakhs)</td>
        <td style="${labelCellStyle}">OCR (in Lakhs)</td>
        <td style="${labelCellStyle}">OCR paid till date (in Lakhs)</td>
        <td style="${labelCellStyle}">OCR Source</td>
       </tr>
       ${ensureArray(detailsOfSecurityOffered.detailsOfSecurity).map((security: any) => `
        <tr>
        <td style="${valueCellStyle}">${security.areaInSqFt}</td>
        <td style="${valueCellStyle}">${formatCurrency(security.agreementValue)}</td>
        <td style="${valueCellStyle}">${formatCurrency(security.purchaseCost)}</td>
        <td style="${valueCellStyle}">${formatCurrency(security.marketValue)}</td>
        <td style="${valueCellStyle}">${formatCurrency(security.ocrValue)}</td>
        <td style="${valueCellStyle}">${security.ocrPaidTillDate}</td>
        <td style="${valueCellStyle}">${security.ocrSource}</td>
       </tr>
       `).join("")}
        </table>



        <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}" colspan="7">Third Party Confirmation</td>
       </tr>
       <tr>
        <td style="${labelCellStyle}">Individual / Business Name</td>
        <td style="${labelCellStyle}">Address</td>
        <td style="${labelCellStyle}">Contact No.</td>
        <td style="${labelCellStyle}">Knowing Since</td>
        <td style="${labelCellStyle}">Feedback on Borrower</td>
        <td style="${labelCellStyle}">Feedback on Business</td>
       </tr>
       ${ensureArray(thirdPartyConfirmation.thirdPartyConfirmation).map((confirmation: any) => `
        <tr>
        <td style="${valueCellStyle}">${confirmation.individualOrBusinessName}</td>
        <td style="${valueCellStyle}">${confirmation.address}</td>
        <td style="${valueCellStyle}">${confirmation.contactNo}</td>
        <td style="${valueCellStyle}">${confirmation.knowingSince}</td>
        <td style="${valueCellStyle}">${confirmation.feedbackOnBorrower}</td>
        <td style="${valueCellStyle}">${confirmation.feedbackOnBusiness}</td>
       </tr>
       `).join("")}
       </table>


        <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}">Observations</td>
       </tr>
       <tr>
        <td style="${valueCellStyle}">${formatObservations(observations.observations)}</td>
       </tr>
       </table>


        <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}" colspan="3">Other Income <i>(Income from other than initiated business)</i></td>
       </tr>
       <tr>
        <td style="${labelCellStyle}">Income</td>
        <td style="${labelCellStyle}">Details</td>
        <td style="${labelCellStyle}">Reference</td>
       </tr>
       ${ensureArray(otherIncome.otherIncome).map((income: any) => `
        <tr>
        <td style="${valueCellStyle}">${formatCurrency(income.incomeAmount)}</td>
        <td style="${valueCellStyle}">${income.details}</td>
        <td style="${valueCellStyle}">${income.reference}</td>
       </tr>
       `).join("")}
       </table>

        <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}">Remarks</td>
       </tr>
       <tr>
        <td style="${valueCellStyle}">${formatObservations(remarks.remarks)}</td>
       </tr>
       </table>

        <table style="${tableStyle}">
       <tr>
        <td style="text-align: center;${labelCellStyle}">Status</td>
       </tr>
       <tr>
        <td style="${valueCellStyle}">${status.status}</td>
       </tr>
       </table>



       
    </div>
    ${pdBaseTemplateFooter(html_data)}

    <p style="margin:20px 0 8px;font-weight:600;color:#222;"> <strong><u>Disclaimer:</u></strong></p>
       <p style="margin:0 0 24px;color:#333;">This report (including any attachments) has been prepared on the basis of information provided by the person contacted. Jana Small Finance Bank Ltd. will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. Veeraraghavan & Co. will not be held liable in any case.</P>


  `;
};