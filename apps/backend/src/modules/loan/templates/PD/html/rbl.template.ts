// import { RBLInterface } from "../interface/rbl.interface";
import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

type KeyValueRow = {
  label: string;
  value: any;
  formatter?: (value: any) => string;
};

type ColumnDefinition = {
  header: string;
  key?: string;
  formatter?: (value: any, item?: any) => string;
  valueGetter?: (item: any) => any;
};

const paragraphStyle = "margin:8px 0;line-height:1.5";
const headingStyle =
  "font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333";
const subHeadingStyle =
  "font-size:20px;font-weight:bold;margin:14px 0 6px 0;color:#333";
const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0";
const labelCellStyle =
  "border:1px solid #ccc;padding:8px;font-weight:bold;vertical-align:top;line-height:1.5;width:32%";
const valueCellStyle =
  "border:1px solid #ccc;padding:8px;vertical-align:top;line-height:1.5";
const headerCellStyle = `${labelCellStyle};font-weight:bold`;

const displayValue = (value: any): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number")
    return Number.isFinite(value) ? String(value) : "";
  if (Array.isArray(value)) {
    return value
      .map((entry) => displayValue(entry))
      .filter((entry) => entry.length > 0)
      .join(", ");
  }
  return String(value);
};

const formatMultiline = (value: any): string => {
  const rendered = displayValue(value);
  return rendered.replace(/\n/g, "<br>");
};

const formatCurrency = (value: any): string => {
  if (value === null || value === undefined || value === "") return "";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return displayValue(value);
  return `Rs. ${numeric.toLocaleString("en-IN")}/-`;
};

const formatDate = (value: any): string => {
  if (!value) return "";
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("en-GB");
  }
  return displayValue(value);
};

const renderParagraph = (content: string) =>
  `<p style="${paragraphStyle}">${content}</p>`;

const renderHeading = (text: string) =>
  `<h1 style="${headingStyle}">${text}</h1>`;

const renderSubHeading = (text: string) =>
  `<p style="${paragraphStyle}"><strong>${text}</strong></p>`;

const renderTwoColumnTable = (rows: KeyValueRow[]) => {
  if (!rows.length) return "";
  return `
    <table style="${tableStyle}">
      ${rows
        .map(({ label, value, formatter }) => {
          const resolved =
            formatter !== undefined ? formatter(value) : formatMultiline(value);
          return `
          <tr>
            <td style="${labelCellStyle}"><p style="${paragraphStyle}">${label}</p></td>
            <td style="${valueCellStyle}"><p style="${paragraphStyle}">${
              resolved || ""
            }</p></td>
          </tr>`;
        })
        .join("")}
    </table>
  `;
};

const renderSingleColumnTable = (values: string[]) => {
  if (!values.length) return "";
  return `
    <table style="${tableStyle}">
      ${values
        .map(
          (value) => `
        <tr>
          <td style="${valueCellStyle}"><p style="${paragraphStyle}">${value}</p></td>
        </tr>`
        )
        .join("")}
    </table>
  `;
};

const renderMultiColumnTable = (
  columns: ColumnDefinition[],
  items: any[] | undefined,
  emptyMessage: string
) => {
  const headerRow = `
    <tr>
      ${columns
        .map(
          ({ header }) =>
            `<td style="${headerCellStyle}"><p style="${paragraphStyle}">${header}</p></td>`
        )
        .join("")}
    </tr>`;

  const bodyRows =
    Array.isArray(items) && items.length > 0
      ? items
          .map((item) => {
            return `
              <tr>
                ${columns
                  .map((column) => {
                    const rawValue = column.valueGetter
                      ? column.valueGetter(item)
                      : column.key
                        ? item?.[column.key]
                        : undefined;
                    const rendered =
                      column.formatter !== undefined
                        ? column.formatter(rawValue, item)
                        : formatMultiline(rawValue);
                    return `<td style="${valueCellStyle}"><p style="${paragraphStyle}">${
                      rendered || ""
                    }</p></td>`;
                  })
                  .join("")}
              </tr>
            `;
          })
          .join("")
      : `<tr><td colspan="${columns.length}" style="${valueCellStyle}"><p style="${paragraphStyle}">${emptyMessage}</p></td></tr>`;

  return `
    <table style="${tableStyle}">
      ${headerRow}
      ${bodyRows}
    </table>
  `;
};
const ensureArray = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
};

const combineTextSegments = (
  segments: Array<{ label?: string; value?: any }>
) => {
  return segments
    .map(({ label, value }) => {
      if (!value) return "";
      const rendered = formatMultiline(value);
      return label ? `${label} ${rendered}` : rendered;
    })
    .filter(Boolean)
    .join(" ");
};

const hasMeaningfulValue = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return true;
  if (typeof value === "boolean") return true;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value))
    return value.some((entry) => hasMeaningfulValue(entry));
  if (typeof value === "object") {
    return Object.values(value).some((entry) => hasMeaningfulValue(entry));
  }
  return false;
};

const hasAnyField = (record: any, fields: string[]): boolean => {
  if (!record || typeof record !== "object") return false;
  return fields.some((field) => hasMeaningfulValue(record[field]));
};

export const rblTemplate = (verificationData: any, html_data: any) => {
  const source = verificationData as any;
  const caseDetails = source.caseDetails ?? {};
  const meetingDetails = source.meetingDetails ?? caseDetails ?? {};
  const businessOwnerEntries =
    source.businessOwnerDetails?.businessOwnerDetails ?? [];
  const familyDetails = source.familyDetails ?? {};
  const businessDetails = source.businessDetails ?? {};
  const inputsPurchases = source.inputsPurchases ?? {};
  const outputsSupply = source.outputsSupply ?? {};
  const employeeDetails = source.employeeDetails ?? {};
  const tradeReferencesSuppliers = source.tradeReferences?.suppliers ?? [];
  const tradeReferencesCustomers = source.tradeReferences?.customers ?? [];
  const otherSources = source.otherSourcesOfIncome?.otherSourcesOfIncome ?? [];
  const loanEntries = source.loansDetails?.loansDetails ?? [];
  const netWorthEntries = ensureArray(source.netWorth?.netWorth);
  const applicantsMainBankingDetails =
    source.applicantsMainBankingDetails ?? {};
  const rawBankingDetails = applicantsMainBankingDetails?.bankingDetails;
  const bankingEntries =
    Array.isArray(rawBankingDetails) && rawBankingDetails.length > 0
      ? rawBankingDetails
      : hasAnyField(applicantsMainBankingDetails, [
            "bankName",
            "accountHolderName",
            "accountHoldername",
            "accountType",
            "noOfYear",
            "limitOfCCOD",
            "limitOfCcOd",
            "remarks",
          ])
        ? [applicantsMainBankingDetails]
        : [];

  const rawOwnContribution = source.ownContributions;
  const ownContributionEntries =
    Array.isArray(rawOwnContribution?.ownContributions) &&
    rawOwnContribution?.ownContributions.length > 0
      ? rawOwnContribution.ownContributions
      : hasAnyField(rawOwnContribution, [
            "particulars",
            "Particulars",
            "remarks",
            "Remarks",
          ])
        ? [rawOwnContribution]
        : [];

  const losId =
    caseDetails.applicationNumber ||
    caseDetails.referenceNumber ||
    html_data?.applicationNumber ||
    html_data?.loanDetails?.applicationNumber ||
    "";

  const dateOfVisit =
    meetingDetails.dateOfVisit ||
    html_data?.pdVerifiedDate ||
    html_data?.loanDetails?.dateOfVisit ||
    "";

  const applicantName =
    caseDetails.applicantName ||
    caseDetails.nameOfApplicant ||
    html_data?.loanDetails?.applicantName ||
    "";

  const clientAddress =
    meetingDetails.addressVisited ||
    caseDetails.addressVisited ||
    businessDetails.shopAddress ||
    html_data?.loanDetails?.applicantAddress ||
    "";

  const amountPurposeText =
    html_data?.loanDetails?.loanAmount && html_data?.loanDetails?.purposeOfLoan
      ? `He wants Loan amount of ${
          formatCurrency(html_data.loanDetails.loanAmount) ||
          formatMultiline(html_data.loanDetails.loanAmount)
        } for purpose of ${formatMultiline(
          html_data.loanDetails.purposeOfLoan
        )}.`
      : formatMultiline(source?.amountAndPurposeOfLoan);

  const geoCoordinates = source.coordinates || {};

  const familySummary = [
    {
      label: "<strong>About Applicant:</strong>",
      value: familyDetails.aboutApplicant
        ? familyDetails.aboutApplicant.split("\n").map((line: string) => `<ul><li>${line}</li></ul>`).join("")
        : "",
    },
    {
      label: "<strong>About Co-applicant:</strong>",
      value: familyDetails.aboutCoApplicant
        ? familyDetails.aboutCoApplicant.split("\n").map((line: string) => `<ul><li>${line}</li></ul>`).join("")
        : "",
    },
    {
      label: "<strong>And their family details:</strong>",
      value: formatMultiline(familyDetails.andTheirFamilyDetails),
    },
  ];

  const ownContributionTable =
    ownContributionEntries.length > 0
      ? renderMultiColumnTable(
          [
            {
              header: "Particulars",
              valueGetter: (item) => item?.particulars || item?.Particulars,
            },
            {
              header: "Remarks",
              valueGetter: (item) => item?.remarks || item?.Remarks,
            },
          ],
          ownContributionEntries,
          "No own contribution details provided"
        )
      : "";

  const applicantBankingTable =
    bankingEntries.length > 0
      ? renderMultiColumnTable(
          [
            { header: "Bank Name", valueGetter: (item) => item?.bankName },
            {
              header: "Account Holder name",
              valueGetter: (item) =>
                item?.accountHolderName || item?.accountHoldername,
            },
            {
              header: "Account type",
              valueGetter: (item) => item?.accountType,
            },
            {
              header: "No of year",
              valueGetter: (item) => item?.noOfYear,
            },
            {
              header: "Limit of CC/OD",
              formatter: (value) => formatCurrency(value),
              valueGetter: (item) => item?.limitOfCCOD || item?.limitOfCcOd,
            },
            {
              header: "Remarks",
              valueGetter: (item) => item?.remarks,
            },
          ],
          bankingEntries,
          "No banking details provided"
        )
      : "";

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content">
      ${renderParagraph(
        `<strong>LOS ID:</strong> ${losId || ""}${
          dateOfVisit ? `&nbsp;&nbsp;<strong>Dated:</strong> ${formatDate(dateOfVisit)}` : ""
        }`
      )}
      ${renderParagraph(`<strong>Client Name:</strong> ${applicantName || ""}`)}
      ${renderParagraph(`<strong>Client Address:</strong> ${clientAddress || ""}`)}

      <h2 style="${subHeadingStyle}">Sub:&nbsp;<u>LIP Visit(s) Report</u></h2>
      ${renderParagraph("Sir,")}
      ${renderParagraph(
        "Please refer to your instructions on the captioned matter. In this connection, we submit our report as under:"
      )}

      ${renderSubHeading("Case Details")}
      ${renderTwoColumnTable([
        {
          label: "Reference Number (LOS ID)",
          value: losId,
        },
        {
          label: "Name of Applicant",
          value: applicantName,
        },
        {
          label: "Co – Applicant",
          value: caseDetails.coApplicant,
        },
        {
          label: "Type of Borrower",
          value: caseDetails.typeOfBorrower,
        },
      ])}

      ${renderSubHeading("Meeting Details")}
      ${renderTwoColumnTable([
        {
          label: "Address Visited",
          value: meetingDetails.addressVisited,
        },
      ])}
      ${renderTwoColumnTable([
        {
          label: "Person Met",
          value: meetingDetails.personMet,
        },
        {
          label: "Contact No",
          value: meetingDetails.applicantContactNumber || caseDetails.contactNo,
        },
        {
          label: "Date of Visit",
          value: formatDate(meetingDetails.dateOfVisit),
        },
      ])}

      ${renderSubHeading("Business owner Details")}
      ${renderMultiColumnTable(
        [
          { header: "Name", key: "name" },
          { header: "Age", key: "age" },
          { header: "Qualification", key: "qualification" },
          { header: "Occupation", key: "occupation" },
          { header: "Relation", key: "relation" },
          { header: "Remarks", key: "remarks" },
        ],
        businessOwnerEntries,
        "No business owner details provided"
      )}

      ${renderSubHeading("Family Details")}
      ${
        familySummary
          ? `<table style="${tableStyle}">
            <tr>
            <td style="${labelCellStyle}"><p style="${paragraphStyle}">${familySummary[0].label}</p></td>
            <td style="${valueCellStyle}"><p style="${paragraphStyle}">${formatMultiline(familySummary[0].value)}</p></td>
            </tr>
            <tr>
            <td style="${labelCellStyle}"><p style="${paragraphStyle}">${familySummary[1].label}</p></td>
            <td style="${valueCellStyle}"><p style="${paragraphStyle}">${formatMultiline(familySummary[1].value)}</p></td>
            </tr>
            <tr>
              <td style="${labelCellStyle}"><p style="${paragraphStyle}">${familySummary[2].label}</p></td>
              <td style="border:1px solid #ccc;padding:8px">
                <table style="${tableStyle}">
                  <tr>
                  <td style="${labelCellStyle}"><p style="${paragraphStyle}">Name</p></td>
                  <td style="${labelCellStyle}"><p style="${paragraphStyle}">Relationship</p></td>
                  <td style="${labelCellStyle}"><p style="${paragraphStyle}">Age</p></td>
                  <td style="${labelCellStyle}"><p style="${paragraphStyle}">Qualification</p></td>
                  <td style="${labelCellStyle}"><p style="${paragraphStyle}">Occupation</p></td>
                  </tr>
                  ${ensureArray(familySummary[2].value)
                    .map(
                      (item: any) => `
                    <tr>
                      <td style="${valueCellStyle}"><p style="${paragraphStyle}">${item.name}</p></td>
                      <td style="${valueCellStyle}"><p style="${paragraphStyle}">${item.relationship}</p></td>
                      <td style="${valueCellStyle}"><p style="${paragraphStyle}">${item.age}</p></td>
                      <td style="${valueCellStyle}"><p style="${paragraphStyle}">${item.qualification}</p></td>
                      <td style="${valueCellStyle}"><p style="${paragraphStyle}">${item.occupation}</p></td>
                    </tr>
                  `
                    )
                    .join("")}
                  </table> 
                </td>
                </tr> `
          : renderSingleColumnTable(["Family details not provided"])
      }

      ${renderSubHeading("Business Details (Separate for additional business)")}
      ${renderTwoColumnTable([
        { label: "Business Name", value: businessDetails.businessName },
        { label: "Type of Entity", value: businessDetails.typeOfEntity },
        { label: "GST Number", value: businessDetails.gstNumber },
        { label: "Legal Name", value: businessDetails.legalName },
        { label: "Trade Name", value: businessDetails.tradeName },
        {
          label: "Last GST Return (As per GST records)",
          value: businessDetails.lastGSTReturn,
        },
        { label: "Establishment", value: businessDetails.establishment },
        { label: "Shop Address", value: businessDetails.shopAddress },
        { label: "Shop Ownership", value: businessDetails.shopOwnership },
        { label: "Godown", value: businessDetails.godownAddress },
        { label: "Godown Ownership", value: businessDetails.godownOwnership },
        {
          label: "Nature of Business",
          value: businessDetails.natureOfBusiness,
        },
        {
          label:
            "Product Details (please also comment on Vintage of the product deals by the firm & Future changes if any)",
          value: businessDetails.productDetails,
        },
        { label: "Business Process", value: businessDetails.businessProcess },
        { label: "Margins", value: businessDetails.margins },
        {
          label: "Documents Observed",
          value: businessDetails.documentsObserved,
        },
        { label: "Activity Observed", value: businessDetails.activityObserved },
      ])}

      ${renderSubHeading("Inputs/Purchases")}
      ${renderTwoColumnTable([
        { label: "Details of Inputs", value: inputsPurchases.detailsOfInputs },
        { label: "Purchase Details", value: inputsPurchases.purchaseDetails },
        { label: "Order Cycle", value: inputsPurchases.orderCycle },
        { label: "Avg Order Qnty", value: inputsPurchases.avgOrderQnty },
        { label: "Credit Terms", value: inputsPurchases.creditTerms },
        { label: "Other Remarks", value: inputsPurchases.otherRemarks },
      ])}

      ${renderSubHeading("Outputs/Supply")}
      ${renderTwoColumnTable([
        { label: "Market for Output", value: outputsSupply.marketForOutput },
        { label: "Mode of Marketing", value: outputsSupply.modeOfMarketing },
        { label: "Type of Customers", value: outputsSupply.typeOfCustomers },
        { label: "Credit Terms", value: outputsSupply.creditTerms },
        {
          label: "Stock of Finished Goods",
          value: outputsSupply.stockOfFinishedGoods,
        },
      ])}

      ${renderSubHeading("Employee Details")}
      ${renderTwoColumnTable([
        { label: "No. of Employees", value: employeeDetails.noOfEmployees },
        { label: "Salary Details", value: employeeDetails.salaryDetails },
        { label: "PF/ESI Applied", value: employeeDetails.pfEsiApplied },
      ])}

      ${renderSubHeading("Trade References - Suppliers")}
      ${renderMultiColumnTable(
        [
          { header: "Name of Suppliers", key: "nameOfSuppliers" },
          { header: "Contact Details", key: "contactDetails" },
        ],
        tradeReferencesSuppliers,
        "No trade references (suppliers) provided"
      )}

      ${renderSubHeading("Trade References - Customers")}
      ${renderMultiColumnTable(
        [
          { header: "Name of Customer", key: "nameOfCustomer" },
          { header: "Contact Details", key: "contactDetails" },
        ],
        tradeReferencesCustomers,
        "No trade references (customers) provided"
      )}

      ${renderSubHeading("Other sources of Income")}
      ${renderMultiColumnTable(
        [
          { header: "Source of Income", key: "sourceOfIncome" },
          { header: "Details", key: "details" },
        ],
        otherSources,
        "No other sources of income provided"
      )}

      ${renderSubHeading("Loans Details")}
      ${renderMultiColumnTable(
        [
          {
            header: "Name of Bank / Institution",
            key: "nameOfBankInstitution",
          },
          { header: "Product", key: "product" },
          {
            header: "Loan amount",
            key: "loanAmount",
            formatter: formatCurrency,
          },
          { header: "EMI", key: "emi", formatter: formatCurrency },
          {
            header: "POS",
            formatter: (value, item) =>
              formatMultiline(value || item?.pos || item?.os),
            valueGetter: (item) => item?.pos || item?.os,
          },
          { header: "Remarks", key: "remarks" },
        ],
        loanEntries,
        "No loan details provided"
      )}

      ${renderSubHeading("Applicant's main Banking Details")}
      ${
        applicantBankingTable ||
        renderSingleColumnTable(["Applicant banking details not provided"])
      }
      ${
        applicantsMainBankingDetails.endUse
          ? renderParagraph(
              `<strong>End Use:</strong> ${formatMultiline(
                applicantsMainBankingDetails.endUse
              )}`
            )
          : ""
      }

      ${amountPurposeText ? renderSingleColumnTable([amountPurposeText]) : ""}

      ${renderSubHeading("Own contribution")}
      ${
        ownContributionTable ||
        renderMultiColumnTable(
          [
            { header: "Particulars", valueGetter: () => "" },
            { header: "Remarks", valueGetter: () => "" },
          ],
          [],
          "No own contribution details provided"
        )
      }

      ${renderSubHeading("Net Worth")}
      ${renderMultiColumnTable(
        [
          { header: "Sr. No", key: "srNo" },
          {
            header:
              "Type of property / Other investments like gold , LIC , FC etc.,",
            key: "typeOfProperty",
          },
          { header: "Owner name", key: "ownerName" },
          {
            header: "Approx. Market value",
            key: "approxMarketValue",
            formatter: formatCurrency,
          },
          { header: "Years of ownership", key: "yearsOfOwnership" },
        ],
        netWorthEntries.map((entry, index) => ({
          ...entry,
          srNo: index + 1,
        })),
        "No net worth details provided"
      )}

      ${renderMultiColumnTable(
        [
          { header: "Particulars", key: "label" },
          { header: "Coordinates", key: "value" },
        ],
        [
          {
            label: "Latitude",
            value: geoCoordinates.latitude || "",
          },
          {
            label: "Longitude",
            value: geoCoordinates.longitude || "",
          },
        ],
        "Geo-coordinates not available"
      )}
      <table style="${tableStyle}">
        <tr>
          <td style="${labelCellStyle}">PD Status</td>
          <td style="${valueCellStyle}">${html_data.approvedStatus|| "Not provided"}</td>
        </tr>
      </table>
      ${renderSubHeading("Disclaimer:")}
      ${renderParagraph(
        "The report contains information provided by the Applicant met. The information is provided verbally and could be verified only to a limited extent. RBL will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions."
      )}

      ${renderSubHeading("Photographs taken during visit")}
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};
