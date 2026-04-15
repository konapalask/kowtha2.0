import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:16px 0";
const labelCellStyle =
  "border:1px solid #c7cdd1;padding:8px;font-weight:bold;color:#222;vertical-align:top;width:32%";
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

const ensureArray = <T>(value: T | T[] | null | undefined): T[] => {
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
  const content = formatter ? formatter(value) : formatMultiline(value);
  return `
    <tr>
      <td style="${labelCellStyle}">${label}</td>
      <td style="${valueCellStyle}" colspan="${options?.colspan || 1}">
        ${content}
      </td>
    </tr>
  `;
};

const renderArrayTable = (headers: string[], rows: string[][]) => {
  if (!rows.length) {
    return `<table style="${tableStyle}"><tr><td style="${valueCellStyle}">Not provided</td></tr></table>`;
  }
  const headerRow = headers
    .map(
      (header) =>
        `<th style="border:1px solid #c7cdd1;padding:8px;text-align:left;font-weight:600;color:#222;">${header}</th>`
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

export const herohousingSalariedTemplate = (
  verificationData: any,
  html_data: any
) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  const general = verificationData?.generalInfo || {};
  const borrowerDetails = verificationData?.borrowerProfile || {};
  const familyDetails = verificationData?.familyDetails || {};
  const currentJobProfile = verificationData?.employmentProfile || {};
  const detailsOfEmployer = verificationData?.employerDetails || {};
  const propertyDetails = verificationData?.propertyDetails || {};
  const investmentAndProperties =
    verificationData?.investmentAndProperties || {};
  const endUseOfPropertyFund = verificationData?.endUseOfPropertyFund || {};
  const loanDetails = verificationData?.detailsOfLoans || {};
  const bankingDetails = verificationData?.bankingDetails || {};
  const doc = verificationData?.documentVerificationAndOtherChecks || {};

  return `
    ${pdBaseTemplate()}

    <div class="template-content">
      <p style="margin:8px 0;line-height:1.5"><strong>PD REPORT – CASH SALARIED/SALARIED</strong></p>
      
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px;width:32%"><p style="margin:8px 0;line-height:1.5"><strong>Loan account No.</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${general.loanAccountNo || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px;width:32%"><p style="margin:8px 0;line-height:1.5"><strong>Name of customer</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${general?.applicantName || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px;width:32%">
            <p style="margin:8px 0;line-height:1.5"><strong>Person met in PD and relationship with customer</strong></p>
          </td>
          <td style="border:1px solid #ccc;padding:8px;width:32%">
            <p style="margin:8px 0;line-height:1.5">${general.personMet || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px;width:32%">
            <p style="margin:8px 0;line-height:1.5"><strong>Mention the reason if customer was not available during the visit</strong></p>
          </td>
          <td style="border:1px solid #ccc;padding:8px;width:32%">
            <p style="margin:8px 0;line-height:1.5">${general.reasonIfCustomerNotAvailable || ""}</p>
          </td>
        </tr>

        <tr>
          <td style="border:1px solid #ccc;padding:8px;width:32%"><p style="margin:8px 0;line-height:1.5"><strong>PD Visit date and time</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${general.pdVisitDateAndTimepd || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px;width:32%"><p style="margin:8px 0;line-height:1.5"><strong>PD address</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${general.pdAddress || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px;width:32%"><p style="margin:8px 0;line-height:1.5"><strong>Lat log of office address</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${general.latitudeLongitude || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px;width:32%"><p style="margin:8px 0;line-height:1.5"><strong>Requested loan amount</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${general.requestedLoanAmount || ""}</p></td>
        </tr>
      </table>

      <div style="page-break-after: always;"></div>
      <p style="margin:8px 0;line-height:1.5"><strong>Profile of customer</strong></p>
      
      <table style="border-collapse:collapse;border:1px solid #ccc;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border-right:1px solid #ccc;border-bottom:none;padding:8px;width:40%;vertical-align:top">
            <p style="margin:8px 0;line-height:1.5"><strong>Borrower details ---</strong></p>
            <p style="margin:8px 0;line-height:1.5"><strong>It should include the</strong></p>
          </td>
          <td style="padding:8px;width:60%;vertical-align:top"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Qualification of customer</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${borrowerDetails.qualificationOfCustomer || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Complete professional journey (service/ business details of each activity post qualification to till date)</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${borrowerDetails.professionalJourney || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;padding:8px;width:40%;vertical-align:top">
            <p style="margin:8px 0;line-height:1.5"><strong>Family details</strong></p>
            <ul style="margin:8px 0;padding-left:20px">
              <li><strong>Family details – Including dependents</strong></li>
              <li><strong>Family background (Parents and siblings including all dependents)</strong></li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px;width:60%;vertical-align:top">
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
              <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name</strong></p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Relationship with applicant</strong></p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Age</strong></p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Qualification</strong></p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Occupation (Job/Business)</strong> <br></p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Income Details/dependent</strong></p></td>
              </tr>
              ${ensureArray(familyDetails.members)
                .map(
                  (member) => `
                <tr>
                  <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.name || ""}</p></td>
                  <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.relationship || ""}</p></td>
                  <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.age || ""}</p></td>
                  <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.qualification || ""}</p></td>
                  <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.occupation || ""}</p></td>
                  <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.incomeDetails || ""}</p></td>
                </tr>
              `
                )
                .join("")}
            </table>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-bottom:none;padding:8px;width:40%;vertical-align:top">
            <p style="margin:8px 0;line-height:1.5"><strong>Current Job profile</strong></p>
          </td>
          <td style="border:1px solid #ccc;border-bottom:none;padding:8px;width:60%;vertical-align:top"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Name of Employer</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${currentJobProfile.nameOfEmployer || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Working since</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;padding:8px;border-top:none;border-bottom:none;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${currentJobProfile.workingSince || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Type of employment (permanent/Contractual)</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${currentJobProfile.typeOfEmployment || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Designation</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${currentJobProfile.designation || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Job profile</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${formatMultiline(currentJobProfile.jobProfile || "Not provided")}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Reporting to (Name/Designation)</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${currentJobProfile.reportingTo || "Not provided"}</li></ul>
          </td>
        </tr>
        </table>
        <div style="page-break-after: always;"></div>
        <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
       
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-bottom:none;padding:8px;width:40%;vertical-align:top">
            <p style="margin:8px 0;line-height:1.5"><strong>Details of employer</strong></p>
          </td>
          <td style="border:1px solid #ccc;padding:8px;border-bottom:none;width:60%;vertical-align:top"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Current business Name</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${detailsOfEmployer.businessName || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Constitution</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${detailsOfEmployer.constitution || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Nature of business/product or services details</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${detailsOfEmployer.natureOfBusiness || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Running since</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${detailsOfEmployer.runningSince || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Details of partners, director, shareholders with family background and other details</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${detailsOfEmployer.partnersDetails || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>No. of employee and set up of business</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${detailsOfEmployer.setupDetails || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Quantum of stock</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${detailsOfEmployer.stockQuantum || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>No of Machinery and assets seen</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${detailsOfEmployer.machineryAssets || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:1px solid #ccc;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Brief details about the locality of business, surrounding competitors, overall prospect of location etc and any negative feedback</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:1px solid #ccc;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${detailsOfEmployer.localityFeedback || "Not provided"}</li></ul>
          </td>
        </tr>
        </table>
        <div style="page-break-after: always;"></div>
        <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-bottom:none;padding:8px;width:40%;vertical-align:top">
            <p style="margin:8px 0;line-height:1.5"><strong>Details of Property –</strong></p>
          </td>
          <td style="border:1px solid #ccc;padding:8px;border-bottom:none;width:60%;vertical-align:top"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Whether customer visited the property</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${propertyDetails.customerVisitedProperty || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Type of property (Ready build/Plot/Self Construction/under construction/vacant etc)</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${propertyDetails.propertyType || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Property is occupied by whom and reason if not self-occupied (Also mention stage in case self-construction/under construction and expected completion date, also mention rent amount and period of tenancy if the property is given on rent)</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${propertyDetails.propertyOccupancy || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Source of property purchase (through dealer, builder/reference/relative)</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${propertyDetails.sourceOfPropertyPurchase || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Name of seller and any relationship with customer</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${propertyDetails.sellerDetails || "Not provided"} ${propertyDetails.relationshipWithCustomer ? " - Relationship: " + propertyDetails.relationshipWithCustomer : ""}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Type of property/structure and area</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${propertyDetails.typeOfProperty || "Not provided"} ${propertyDetails.areaOfProperty ? " - Area: " + propertyDetails.areaOfProperty : ""}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>What is actual deal value and sale deed value, OCR source</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${propertyDetails.dealValue || "Not provided"} ${propertyDetails.saleDeedValue ? " - Sale Deed Value: " + propertyDetails.saleDeedValue : ""} ${propertyDetails.ocrSource ? " - OCR Source: " + propertyDetails.ocrSource : ""}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Whether seller is having any loan on the property</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${propertyDetails.sellerLoanOnProperty || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>When seller bought the property</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${propertyDetails.whenSellerBoughtTheProperty || "Not provided"}</li></ul>
          </td>
        </tr>
        </table>
        <div style="page-break-after: always;"></div>
        <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-bottom:none;padding:8px;width:40%;vertical-align:top">
            <p style="margin:8px 0;line-height:1.5"><strong>Investment and properties -</strong></p>
          </td>
          <td style="border:1px solid #ccc;padding:8px;border-bottom:none;width:60%;vertical-align:top"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>What is customer investment habits and he is doing any monthly saving in any of saving scheme, investment in properties, FD or any other nature of saving</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${investmentAndProperties.investmentHabits || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Whether current residence is owned or rented and rent amount if any</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${investmentAndProperties.currentResidenceOwnership || "Not provided"} ${investmentAndProperties.rentedAmountIfAny ? " - Rent amount: " + investmentAndProperties.rentedAmountIfAny : ""}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Details of assets built till date (Including immovable properties, movable property, gold, FD, Equity investment, other savings)</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${investmentAndProperties.detailsOfAssetsBuiltTillDate || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-bottom:none;padding:8px;width:40%;vertical-align:top">
            <p style="margin:8px 0;line-height:1.5"><strong>End use of property/fund –</strong></p>
          </td>
          <td style="border:1px solid #ccc;padding:8px;border-bottom:none;width:60%;vertical-align:top"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Proposed End use of property (self-occupation/investment etc) for HL/P+C/Self construction cases</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${endUseOfPropertyFund?.proposedEndUseOfProperty || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:1px solid #ccc;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Clear and detailed end use of fund in LAP cases</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:1px solid #ccc;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${endUseOfPropertyFund?.detailedEndUseOfFundInLapCases || "Not provided"}</li></ul>
          </td>
        </tr>
        </table>
        <div style="page-break-after: always;"></div>
        <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-bottom:none;padding:8px;width:40%;vertical-align:top">
            <p style="margin:8px 0;line-height:1.5"><strong>Details of loans –</strong></p>
          </td>
          <td style="border:1px solid #ccc;padding:8px;border-bottom:none;width:60%;vertical-align:top"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Please check and provide the details of loan presently servicing and whether he will be closing such loans or going to continue</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${loanDetails?.detailsOfLoansPresentlyServicing || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Repayment account from which all these EMI are getting paid</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${loanDetails?.repaymentAccount || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>What was the end use of fund of these loans (All BL/PL/LAP loan taken in last 3 years), also please check if there is any exceptional borrowing in last 12 months than exact use</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${loanDetails?.pastLoanEndUse || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Also check if any home loan/LAP than what is address of mortgage property, usage of such property, any OD limit or any other facility in the name of customer</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${loanDetails?.checkIfAnyHomeLoanLap || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Comment whether there is any bouncing in loans and if yes, period and reason of such bounces</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${loanDetails?.anyBouncingInLoans || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-bottom:none;padding:8px;width:40%;vertical-align:top">
            <p style="margin:8px 0;line-height:1.5"><strong>Banking –</strong></p>
          </td>
          <td style="border:1px solid #ccc;padding:8px;border-bottom:none;width:60%;vertical-align:top"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Please check and mention details of all his bank account, account open date, Name of bank account where salary is getting credited (if bank salary)</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            ${
              bankingDetails?.bankAccounts &&
              Array.isArray(bankingDetails.bankAccounts) &&
              bankingDetails.bankAccounts.length > 0
                ? `
            <p style="margin:8px 0;line-height:1.5"><strong>Bank Accounts:</strong></p>
            ${ensureArray(bankingDetails.bankAccounts)
              .map(
                (account: any) => `
              <ul><li style="margin:8px 0;line-height:1.5">${account.bankDetails || ""}${account.accountOpenDate ? " - " + account.accountOpenDate : ""}${account.nameOfBankAccount ? " - " + account.nameOfBankAccount : ""}</li></ul>
            `
              )
              .join("")}
            `
                : '<p style="margin:8px 0;line-height:1.5">Not provided</p>'
            }
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:1px solid #ccc;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Please check any saving account of applicant and co applicant and provide the details of these accounts</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:1px solid #ccc;padding:8px;width:60%;vertical-align:middle">
            ${
              bankingDetails?.savingAccounts &&
              Array.isArray(bankingDetails.savingAccounts) &&
              bankingDetails.savingAccounts.length > 0
                ? `
            <p style="margin:8px 0;line-height:1.5"><strong>Savings Accounts:</strong></p>
            ${ensureArray(bankingDetails.savingAccounts)
              .map(
                (account: any) => `
              <ul><li style="margin:8px 0;line-height:1.5">${account.savingsAccountDetails || ""}</li></ul>
            `
              )
              .join("")}
            `
                : '<p style="margin:8px 0;line-height:1.5">Not provided</p>'
            }
          </td>
        </tr>
        </table>
        <div style="page-break-after: always;"></div>
        <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-bottom:none;padding:8px;width:40%;vertical-align:top">
            <p style="margin:8px 0;line-height:1.5"><strong>Document verification and other checks</strong></p>
          </td>
          <td style="border:1px solid #ccc;padding:8px;border-bottom:none;width:60%;vertical-align:top"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Please check all Payroll register, attendance register to check employment and salary details of applicant and share observations</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${doc.checkPayrollRegisterAndAttendanceRegister || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>TPC from minimum 1 neighbour and 1 local independent party to be done (It should be done by showing the photo of customer and employment to be confirmed in the name of customer with existence period</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${doc.thirdPartyCheck || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Additional check to be done from reference if there is any family relationship with employer and employee</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${doc.familyRelationshipCheckWithEmployer || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Please check all QR code, license, permits, name board, contact number etc and all these belongs to employer and share observations</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:none;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${doc.checkQrCodesLicensesPermitsNameBoardContactNumberBelongingToEmployer || "Not provided"}</li></ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;border-right:1px solid #ccc;border-top:none;border-bottom:1px solid #ccc;padding:8px;width:40%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5"><strong>Google check and any negative observation/feedback/dedupe match or any other feedback</strong></li></ul>
          </td>
          <td style="border:1px solid #ccc;border-top:none;border-bottom:1px solid #ccc;padding:8px;width:60%;vertical-align:middle">
            <ul><li style="margin:8px 0;line-height:1.5">${doc.googleCheckAnyNegativeObservationsFeedbackDedupeMatch || "Not provided"}</li></ul>
          </td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>PD Status:</strong> ${html_data.approvedStatus || "Not provided"}</p>

      <p style="margin:8px 0;line-height:1.5"><strong>Disclaimer Clause:</strong></p>
      <p style="margin:8px 0;line-height:1.5">This report (including any attachments) has been prepared based on verbal information provided by the person contacted. HERO HOUSING FINANCE LTD will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. <strong>M/s. KOWTHA & CO </strong>will not be held liable in any case.</p>

      ${pdBaseTemplateFooter(html_data)}
    </div>
  `;
};
