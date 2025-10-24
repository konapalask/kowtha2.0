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

const renderKeyValue = (
  label: string,
  value: any,
  formatter?: (value: any) => string,
  options?: { colspan?: number }
) => {
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
  if (!rows.length) {
    return `<table style="${tableStyle}"><tr><td style="${valueCellStyle}">Not provided</td></tr></table>`;
  }
  const headerRow = headers
    .map(
      (header) =>
        `<th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">${header}</th>`
    )
    .join("");
  const bodyRows = rows
    .map(
      (row) =>
        `<tr>${row
          .map(
            (cell) =>
              `<td style="${valueCellStyle}">${formatMultiline(cell)}</td>`
          )
          .join("")}</tr>`
    )
    .join("");
  return `<table style="${tableStyle}"><tr>${headerRow}</tr>${bodyRows}</table>`;
};

export const iiflTemplate = (verificationData: any, html_data: any) => {
  const basic = verificationData.basicDetails || {};
  const caseDetails = verificationData.caseDetails || {};
  const familyMembers = ensureArray(
    verificationData.familyDetails?.familyMembers
  );
  const profile = verificationData.applicantProfile || {};
  const observations = verificationData.observations || {};
  const incomeReferences = verificationData.incomeReferences || {};
  const assets = ensureArray(verificationData.assetsDetails?.assets);
  const existingLoans = ensureArray(
    verificationData.existingLoans?.existingLoans
  );
  const bankingDetails = ensureArray(
    verificationData.bankingDetails?.bankingDetails
  );
  const pdOfficer = verificationData.pdOfficerDetails || {};

  const familyRows = familyMembers.map((member: any) => [
    member.name || "",
    member.relationship || "",
    member.age || "",
    member.qualification || "",
    member.occupation || "",
  ]);

  const assetRows = assets.map((asset: any) => [
    asset.assetType || "",
    asset.description || "",
    asset.marketValue || "",
    asset.ownerName || "",
  ]);

  const existingLoanRows = existingLoans.map((loan: any) => [
    loan.bankName || "",
    loan.typeOfLoan || "",
    formatMultiline(loan.loanAmount),
    formatMultiline(loan.emi),
    loan.status || "",
  ]);

  const bankingRows = bankingDetails.map((item: any) => [
    item.bankName || "",
    item.accountType || "",
    item.relationshipSinceYears || "",
  ]);

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content iifl-template">
      <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Basic Details</h2>
      <table style="${tableStyle}">
        ${renderKeyValue("Prospect No.", basic.prospectNo)}
        ${renderKeyValue("Name of Applicant", basic.nameOfApplicant)}
        ${renderKeyValue("Marital Status", basic.maritalStatus)}
        ${renderKeyValue(
          "Educational Qualification",
          basic.educationalQualification
        )}
        ${renderKeyValue("Category", basic.category)}
        ${renderKeyValue(
          "Dependents - Children",
          basic.dependentsChildren
        )}
        ${renderKeyValue("Dependents - Adults", basic.dependentsAdults)}
        ${renderKeyValue("Dependents - Others", basic.dependentsOthers)}
        ${renderKeyValue(
          "Years in Current Residence",
          basic.yearsInCurrentResidence
        )}
        ${renderKeyValue(
          "Current Residence House Size",
          basic.currentResidenceHouseSize
        )}
        ${renderKeyValue("Previous Address", basic.previousAddress)}
        ${renderKeyValue(
          "Years Stayed at Previous Address",
          basic.yearsStayedPreviousAddress
        )}
        ${renderKeyValue(
          "Years in Current City",
          basic.yearsInCurrentCity
        )}
        ${renderKeyValue("Previous City", basic.previousCity)}
        ${renderKeyValue(
          "Years in Previous City",
          basic.yearsInPreviousCity
        )}
        ${renderKeyValue("Reason for Change", basic.reasonForChange)}
        ${renderKeyValue(
          "Parents Staying With",
          basic.parentsStayingWith
        )}
        ${renderKeyValue("Property Usage", basic.propertyUsage)}
        ${renderKeyValue("Comments / Observations", basic.comments)}
      </table>

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">Case Details</h2>
      <table style="${tableStyle}">
        ${renderKeyValue(
          "Date of Case Initiated",
          caseDetails.dateOfCaseInitiated
        )}
        ${renderKeyValue(
          "Date of Appointment Provided",
          caseDetails.dateOfAppointmentProvided
        )}
        ${renderKeyValue(
          "Initiated Address",
          caseDetails.initiatedAddress
        )}
        ${renderKeyValue("Visited Address", caseDetails.visitedAddress)}
        ${renderKeyValue(
          "Residential Address",
          caseDetails.residentialAddress
        )}
        ${renderKeyValue(
          "Contact Information",
          caseDetails.contactInformation
        )}
        ${renderKeyValue(
          "Loan Amount Required",
          caseDetails.loanAmountRequired,
          formatCurrency
        )}
        ${renderKeyValue("Purpose of Loan", caseDetails.purposeOfLoan)}
        ${renderKeyValue("Profile Initiated", caseDetails.profileInitiated)}
        ${renderKeyValue("Security Offered", caseDetails.securityOffered)}
        ${renderKeyValue(
          "Family Members (Narrative)",
          caseDetails.familyMembersDescription
        )}
        ${renderKeyValue("Latitude", caseDetails.latitude)}
        ${renderKeyValue("Longitude", caseDetails.longitude)}
        ${renderKeyValue("Region", caseDetails.region)}
        ${renderKeyValue("Location", caseDetails.location)}
        ${renderKeyValue("Branch", caseDetails.branch)}
      </table>

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">Family Details</h2>
      ${renderArrayTable(
        ["Name", "Relationship", "Age", "Qualification", "Occupation"],
        familyRows
      )}

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">Applicant Profile</h2>
      <table style="${tableStyle}">
        ${renderKeyValue(
          "Applicant’s Education",
          profile.applicantEducation
        )}
        ${renderKeyValue("Native Place", profile.nativePlace)}
        ${renderKeyValue("Business / Employer Name", profile.businessName)}
        ${renderKeyValue("Business Type / Constitution", profile.businessType)}
        ${renderKeyValue(
          "Years of Experience",
          profile.yearsOfExperience
        )}
        ${renderKeyValue(
          "Machinery / Equipment Used",
          profile.machineryUsed
        )}
        ${renderKeyValue(
          "Nature of Business / Services",
          profile.natureOfBusiness
        )}
        ${renderKeyValue(
          "Daily Output & Rates",
          profile.dailyOutputRates
        )}
        ${renderKeyValue(
          "Materials Purchased",
          profile.materialsPurchased
        )}
        ${renderKeyValue(
          "Number of Workers & Salaries",
          profile.workersAndSalaries
        )}
        ${renderKeyValue("Customers", profile.customers)}
        ${renderKeyValue("Business Premises", profile.businessPremises)}
        ${renderKeyValue("Rent Paid (if any)", profile.rentPaid)}
        ${renderKeyValue(
          "Neighbour Enquiry Result",
          profile.neighborEnquiryResult
        )}
      </table>

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">Observations &amp; Concerns</h2>
      <table style="${tableStyle}">
        ${renderKeyValue(
          "Business Vintage Documents Provided",
          observations.businessVintageDocumentsProvided
        )}
        ${renderKeyValue(
          "Business Name Board",
          observations.businessNameBoard
        )}
        ${renderKeyValue(
          "Workers Present at Time of Visit",
          observations.workersPresentAtVisit
        )}
        ${renderKeyValue(
          "Kacha Records Provided",
          observations.kachaRecordsProvided
        )}
        ${renderKeyValue(
          "UPI Payments Provided",
          observations.upiPaymentsProvided
        )}
        ${renderKeyValue("Address Match", observations.addressMatch)}
        ${renderKeyValue(
          "Other Observations",
          observations.otherObservations
        )}
      </table>

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">Income &amp; References</h2>
      <table style="${tableStyle}">
        ${renderKeyValue(
          "Net Margin %",
          incomeReferences.netMarginPercent
        )}
        ${renderKeyValue("Other Incomes", incomeReferences.otherIncomes)}
        ${renderKeyValue("Spouse Income", incomeReferences.spouseIncome)}
        ${renderKeyValue(
          "Reference Details",
          incomeReferences.referencesSummary
        )}
        ${renderKeyValue(
          "References (Name & Contact No.)",
          incomeReferences.referenceContacts
        )}
      </table>

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">Assets Details</h2>
      ${renderArrayTable(
        ["Asset Type", "Description", "Market Value", "Owner Name"],
        assetRows
      )}

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">Existing Loans</h2>
      ${renderArrayTable(
        ["Bank Name", "Type of Loan", "Loan Amount", "EMI", "Status"],
        existingLoanRows
      )}

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">Banking Details</h2>
      ${renderArrayTable(
        ["Bank Name", "Account Type", "No. of Years"],
        bankingRows
      )}

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">PD Officer Details</h2>
      <table style="${tableStyle}">
        ${renderKeyValue("Name of PD Officer", pdOfficer.pdOfficerName)}
        ${renderKeyValue(
          "Date of Discussion",
          pdOfficer.dateOfDiscussion
        )}
        ${renderKeyValue(
          "Signature of PD Officer",
          pdOfficer.pdOfficerSignature
        )}
      </table>
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};

export default iiflTemplate;
