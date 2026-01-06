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

export const ambitTemplate = (verificationData: any, html_data: any) => {
  const general = verificationData.general || {};
  const residentialDetails = verificationData.residentialDetails || {};
  const propertyDetails = verificationData.propertyDetails || {};
  const contactDetails = verificationData.contactDetails || {};
  const structureOfLoan = verificationData.structureOfLoan || {};
  const visitDetails = verificationData.visitDetails || {};
  const familyDetails = verificationData.familyDetails || {};
  const aboutTheBusiness = verificationData.aboutTheBusiness || {};
  const otherObservations = verificationData.otherObservations || {};
  const purposeOfLoan = verificationData.purposeOfLoan || {};
  const documentsObserved = verificationData.documentsObserved || {};
  const regularCustomersAndSuppliersActivity = verificationData.regularCustomersAndSuppliersActivity || {};
  const regularCustomer = regularCustomersAndSuppliersActivity?.nameAndContactNumberOfRegularCustomers || {};
  const regularSupplier = regularCustomersAndSuppliersActivity?.nameAndContactNumberOfRegularSuppliers || {};
  const businessActivityAndStockLevelObserved = verificationData.businessActivityAndStockLevelObserved || {};
  const bankingDetails = verificationData.bankingDetails || {};
  const existingLoans = verificationData.existingLoans || {};
  const otherBusinessIncome = verificationData.otherBusinessIncome || {};
  const status = verificationData.status || {};


  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content ambit-template">
      <h1 style="margin:0 0 16px;color:#1f2a37;font-size:24px; text-align:center">AMBIT</h1>
      <table style="${tableStyle}">
        ${renderKeyValue("Name of Applicant", general.nameOfApplicant)}
        ${renderKeyValue("Name of Co-Applicant", general.nameOfCoApplicant)}
        ${renderKeyValue("Application No.", general.applicationNo)}
        ${renderKeyValue("Name of Concern", general.nameOfConcern)}
        ${renderKeyValue("Name of the Proprietor as per License", general.nameOfTheProprietorAsPerLicense)}
        ${renderKeyValue("PD Initiated Address", general.pdinitiatedAddress)}
        ${renderKeyValue("Visited Address", general.visitedAddress)}
        ${renderKeyValue("Business License Address", general.businessLicenseAddress)}

        <tr>
          <td style="${labelCellStyle}">Residential Details</td>
          <td style="border:1px solid #ccc;padding:8px">
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}" colspan="4"><strong>Address:</strong> ${residentialDetails.address}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">Rented/Owned</td>
                <td style="${labelCellStyle}">Owned by</td>
                <td style="${labelCellStyle}">Area (In Sq. Ft.)</td>
                <td style="${labelCellStyle}">Occupied since (years)</td>
              </tr>
              <tr>
                <td style="${valueCellStyle}">${residentialDetails.rentedOwned}</td>
                <td style="${valueCellStyle}">${residentialDetails.ownedBy}</td>
                <td style="${valueCellStyle}">${residentialDetails.areaInSqFt}</td>
                <td style="${valueCellStyle}">${residentialDetails.occupiedSinceYears}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Property Details</td>
          <td style="border:1px solid #ccc;padding:8px">
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}" colspan="4"><strong>Address:</strong> ${propertyDetails.propertyAddress}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">Market Value</td>
                <td style="${labelCellStyle}">Owned by</td>
                <td style="${labelCellStyle}">Area (In Sq. Ft.)</td>
                <td style="${labelCellStyle}">Occupied since (years)</td>
              </tr>
              <tr>
                <td style="${valueCellStyle}">${formatCurrency(propertyDetails.marketValue)}</td>
                <td style="${valueCellStyle}">${propertyDetails.ownedBy}</td>
                <td style="${valueCellStyle}">${propertyDetails.areaInSqFt}</td>
                <td style="${valueCellStyle}">${propertyDetails.occupiedSinceYears}</td>
              </tr>
            </table>
          </td>

        ${renderKeyValue("Phone Number", contactDetails.phoneNumber)}
        ${renderKeyValue("Appointment Fixed", contactDetails.appointmentFixed)}
        ${renderKeyValue("Date of Visit", contactDetails.dateOfVisit)}

        ${renderKeyValue("Structure of Loan", formatMultiline(structureOfLoan.structureOfLoan))}

        ${renderKeyValue("No. of Visit", visitDetails.noOfVisit)}
        ${renderKeyValue("Person Met", visitDetails.personMet)}
        ${renderKeyValue("About the Applicant", visitDetails.aboutTheApplicant)}

        <tr>
          <td style="${labelCellStyle}">Family Details</td>
          <td style="border:1px solid #ccc;padding:8px">
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}">Name</td>
                <td style="${labelCellStyle}">Relationship</td>
                <td style="${labelCellStyle}">Age</td>
                <td style="${labelCellStyle}">Education</td>
                <td style="${labelCellStyle}">Occupation</td>
              </tr>
              ${ensureArray(familyDetails.familyDetails).map((family) => `
                <tr>
                  <td style="${valueCellStyle}">${family.name}</td>
                  <td style="${valueCellStyle}">${family.relationship}</td>
                  <td style="${valueCellStyle}">${family.age}</td>
                  <td style="${valueCellStyle}">${family.education}</td>
                  <td style="${valueCellStyle}">${family.occupation}</td>
                </tr>
              `).join("")}
            </table>
          </td>
        </tr>

        ${renderKeyValue("About the Business", aboutTheBusiness.aboutTheBusiness ? `<ul style="margin: 0; padding-left: 8px;">${aboutTheBusiness.aboutTheBusiness.split("\n").map((line: string) => line.trim()).map((line: string) => `<li style="margin-left: 8px;">${line}</li>`).join("")}</ul>` : "Not provided")}
        ${renderKeyValue("Other Observations", otherObservations.observations ? `<ul style="margin: 0; padding-left: 8px;">${otherObservations.observations.split("\n").map((line: string) => line.trim()).map((line: string) => `<li style="margin-left: 8px;">${line}</li>`).join("")}</ul>` : "Not provided")}
        ${renderKeyValue("Concerns", otherObservations.concerns ? `<ul style="margin: 0; padding-left: 8px;">${otherObservations.concerns.split("\n").map((line: string) => line.trim()).map((line: string) => `<li style="margin-left: 8px;">${line}</li>`).join("")}</ul>` : "Not provided")}
        ${renderKeyValue("Purpose of Loan", formatMultiline(purposeOfLoan.purposeOfLoan))}
        ${renderKeyValue("As per Audited individual ITR's", purposeOfLoan.asPerAuditedIndividualItrS)}
        ${renderKeyValue("Whether registered under MSME", purposeOfLoan.whetherRegisteredUnderMsme)}
        ${renderKeyValue("Whether registered under GST", purposeOfLoan.whetherRegisteredUnderGst)}
        ${renderKeyValue("Documents Observed", documentsObserved.documentsObserved ? `<ul style="margin: 0; padding-left: 8px;">${documentsObserved.documentsObserved.split("\n").map((line: string) => line.trim()).map((line: string) => `<li style="margin-left: 8px;">${line}</li>`).join("")}</ul>` : "Not provided")}
        ${renderKeyValue("Automation Level", documentsObserved.automationLevel)}
        ${renderKeyValue("Receipts", formatCurrency(documentsObserved.receipts))}
        ${renderKeyValue("Payments", formatCurrency(documentsObserved.payments))}
        

        
        <tr>
          <td style="${labelCellStyle}">Name and Contact number of Regular Customers</td>
          <td style="border:1px solid #ccc;padding:8px">
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}">Name</td>
                <td style="${labelCellStyle}">Contact Number</td>
              </tr>
              ${ensureArray(regularCustomer).map((customer) => `
                <tr>
                  <td style="${valueCellStyle}">${customer.name}</td>
                  <td style="${valueCellStyle}">${customer.contactNumber}</td>
                </tr>
              `).join("")}
            </table>
          </td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Name and Contact number of Regular Suppliers</td>
          <td style="border:1px solid #ccc;padding:8px">
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}">Name</td>
                <td style="${labelCellStyle}">Contact Number</td>
              </tr>
              ${ensureArray(regularSupplier).map((supplier) => `
                <tr>
                  <td style="${valueCellStyle}">${supplier.name}</td>
                  <td style="${valueCellStyle}">${supplier.contactNumber}</td>
                </tr>
              `).join("")}
            </table>
          </td>
        </tr>
        ${renderKeyValue("Net Margin", businessActivityAndStockLevelObserved.netMargin + "%" || "Not provided")}
        ${renderKeyValue("Expenditure", formatCurrency(businessActivityAndStockLevelObserved.expenditure))}
        ${renderKeyValue("Employees", businessActivityAndStockLevelObserved.employees)}
        ${renderKeyValue("Assets", businessActivityAndStockLevelObserved.assets ? businessActivityAndStockLevelObserved.assets.split("\n").map((line: string) => `<ul><li>${line}</li></ul>`).join("") : "Not provided")}
        ${renderKeyValue("LIC/Mutual funds", formatMultiline(businessActivityAndStockLevelObserved.licMutualFunds))}
        
        <tr>
          <td style="${labelCellStyle}">Banking Details</td>
          <td style="border:1px solid #ccc;padding:8px">
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}">Bank Name</td>
                <td style="${labelCellStyle}">Account Type</td>
                <td style="${labelCellStyle}">Avg Balance</td>
                <td style="${labelCellStyle}">No. of Years Maintained</td>
              </tr>
              ${ensureArray(bankingDetails.bankingDetails).map((banking) => `
                <tr>
                  <td style="${valueCellStyle}">${banking.bankName}</td>
                  <td style="${valueCellStyle}">${banking.accountType}</td>
                  <td style="${valueCellStyle}">${formatCurrency(banking.averageBalance)}</td>
                  <td style="${valueCellStyle}">${banking.noOfYearsMaintained}</td>
                </tr>
              `).join("")}  
            </table>
          </td>
        </tr>

        <tr>
          <td style="${labelCellStyle}">No. of Loans</td>
          <td>
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}">Bank</td>
                <td style="${labelCellStyle}">Type</td>
                <td style="${labelCellStyle}">Loan Amount</td>
                <td style="${labelCellStyle}">EMI</td>
                <td style="${labelCellStyle}">Open/Close</td>
              </tr>
              ${ensureArray(existingLoans.loanDetails).map((existingLoan) => `
                <tr>
                  <td style="${valueCellStyle}">${existingLoan.bankName}</td>
                  <td style="${valueCellStyle}">${existingLoan.type}</td>
                  <td style="${valueCellStyle}">${formatCurrency(existingLoan.loanAmount)}</td>
                  <td style="${valueCellStyle}">${formatCurrency(existingLoan.emi)}</td>
                  <td style="${valueCellStyle}">${existingLoan.openClose}</td>
                </tr>
              `).join("")}  
            </table>
          </td>
        </tr>

        ${renderKeyValue("End Use", formatMultiline(otherBusinessIncome.endUse))}
        ${renderKeyValue("Security Offered", formatMultiline(otherBusinessIncome.securityOffered))}
        ${renderKeyValue("Address", otherBusinessIncome.address_3)}
        ${renderKeyValue("Other Business/Income", formatMultiline(otherBusinessIncome.otherBusinessInterestSourceOfIncomeFamilyIncome))}
        ${renderKeyValue("Neighbor Check", formatMultiline(otherBusinessIncome.neighborCheck))}
        ${renderKeyValue("Status", html_data.approvedStatus|| "Not provided")}
      </table>

      <h3 style="margin:0 0 16px;color:#1f2a37;font-size:14px;">Disclaimer Clause:</h3>
      <p style="margin:0 0 24px;color:#333;"> This report (including any attachments) has been prepared based on verbal information provided by the person contacted. Ambit Finvest Pvt. Ltd. will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. <strong>M/s. KOWTHA & CO</strong> will not be held liable in any case.

    </div>
    ${pdBaseTemplateFooter(html_data)}

  `;
};
