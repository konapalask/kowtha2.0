import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:16px 0";
const cellStyle =
  "border:1px solid #ddd;padding:8px;vertical-align:top;line-height:1.5";
const paragraphStyle = "margin:8px 0;line-height:1.5;font-size:12px;color:#333";

const hasValue = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.some((entry) => hasValue(entry));
  if (typeof value === "object") {
    return Object.values(value).some((entry) => hasValue(entry));
  }
  return false;
};

const formatMultiline = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  return String(value).replace(/\n+/g, "<br>");
};

const formatCurrency = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return formatMultiline(value);
  }
  return `Rs. ${numeric.toLocaleString("en-IN")}/-`;
};

const ensureArray = <T>(value: T | T[] | undefined | null): T[] => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
};

const wrapParagraph = (content: string) =>
  `<p style="${paragraphStyle}">${content}</p>`;

const renderTwoColumnTable = (
  rows: Array<[string, any, ((value: any) => string)?]>
) => {
  const items = rows.filter(([_, value]) => hasValue(value));
  if (items.length === 0) return "";
  return `
    <table style="${tableStyle}">
      ${items
        .map(([label, value, formatter]) => {
          const rendered = formatter
            ? formatter(value)
            : formatMultiline(value);
          return `
          <tr>
            <td style="${cellStyle};width:32%;font-weight:bold;background:#f7f8fa;">${label}</td>
            <td style="${cellStyle}">${wrapParagraph(rendered)}</td>
          </tr>`;
        })
        .join("")}
    </table>
  `;
};

const renderList = (items: string[]) =>
  items.length
    ? `<ul style="margin:8px 0;padding-left:18px;">${items
        .map((item) => `<li>${item}</li>`)
        .join("")}</ul>`
    : `<p style="${paragraphStyle}">Not provided</p>`;

const renderInnerTable = (headers: string[], rows: string[][]) => {
  if (!rows.length) {
    return wrapParagraph("Not provided");
  }
  const headerRow = headers
    .map(
      (header) =>
        `<td style="${cellStyle};font-weight:bold;background:#f1f3f6;">${header}</td>`
    )
    .join("");
  const rowsHtml = rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => `<td style="${cellStyle}">${cell}</td>`)
          .join("")}</tr>`
    )
    .join("");
  return `
    <table style="${tableStyle}">
      <tr>${headerRow}</tr>
      ${rowsHtml}
    </table>
  `;
};

const sectionTitle = (text: string) =>
  `<h2 style="margin:18px 0 6px 0;font-size:14px;font-weight:600;color:#1f2d3d;text-transform:uppercase;">${text}</h2>`;

export const heroFincorpTemplate = (verificationData: any, html_data: any) => {
  const basic = verificationData.basicDetails || {};
  const applicantProfile = verificationData.applicantProfile || {};
  // Handle nested structures for business profile
  const businessProfileData = verificationData.businessProfile || {};
  const turnoverAndNetProfitDetails =
    verificationData.turnoverAndNetProfitDetails || {};
  const documentsObserved = verificationData.documentsObserved || {};
  const automationLevel = verificationData.automationLevel || {};
  const relationships = verificationData.relationships || {};
  // Handle nested structures for existing loans
  const existingLoansData = verificationData.existingLoanDetails || {};

  const loanAnalysis = verificationData.loanAnalysis || {};
  const generatedDate =
    html_data?.pdVerifiedDate ||
    html_data?.generatedDate ||
    new Date().toISOString().split("T")[0];

  const generalTable = renderTwoColumnTable([
    [
      "Name of Applicant / Contact person",
      basic.applicantName || "Not provided",
    ],
    ["Name of Concern", basic.concernName || "Not provided"],
    ["Office Address", basic.officeAddress || "Not provided"],
    ["Phone", basic.applicantPhoneNumber || "Not provided"],
    ["Appointment Fixed", basic.appointmentFixed || "Not provided"],
    ["Date of Visit", basic.dateOfVisit || "Not provided"],
    ["Structure of Loan", basic.structureOfLoan || "Not provided"],
    ["Loan Amount", basic.loanAmount || "Not provided", formatCurrency],
    ["No. of Visit", basic.numberOfVisits || "Not provided"],
    ["Person Met", basic.personMet || "Not provided"],
  ]);

  const applicantSummary = wrapParagraph(
    formatMultiline(applicantProfile.applicantSummary || "")
  );

  // Handle nested structures for family members
  const familyMembersData =
    applicantProfile.familyMembers || verificationData.familyDetails || {};
  const familyMembersArray = Array.isArray(familyMembersData)
    ? familyMembersData
    : Array.isArray(familyMembersData.familyMembers)
      ? familyMembersData.familyMembers
      : Array.isArray(familyMembersData.members)
        ? familyMembersData.members
        : [];
  const familyRows = ensureArray(familyMembersArray).map((member: any) => [
    formatMultiline(member?.name || ""),
    formatMultiline(member?.relation || ""),
    formatMultiline(member?.age || ""),
    formatMultiline(member?.qualification || ""),
    formatMultiline(member?.occupation || ""),
    formatMultiline(member?.income || ""),
  ]);

  const familyTable = renderInnerTable(
    [
      "Name",
      "Relationship",
      "Age",
      "Qualification",
      "Occupation",
      "Income / Dependent",
    ],
    familyRows
  );

  const documentsList = documentsObserved?.documentsObserved
    ? `<ul style="margin: 0; padding-left: 20px;">${
        documentsObserved?.documentsObserved
          .split("\n")
          .map((line: string) => line.trim())
          .map((line: string) => `<li style="margin-left: 8px;">${line}</li>`)
          .join("") || "Not provided"
      }
    </ul>`
    : "Not provided";

  // Handle nested structures for customers
  const customersData =
    relationships.customers || verificationData.customers || {};
  const customersArray = Array.isArray(customersData)
    ? customersData
    : Array.isArray(customersData.topCustomers)
      ? customersData.topCustomers
      : [];
  const customersList = ensureArray(customersArray).map(
    (customer: any) =>
      `<li>${formatMultiline(customer?.name || customer?.customerName || "Mr. Name")} – ${formatMultiline(
        customer?.contactNumber || customer?.contactDetails || "Number"
      )}</li>`
  );

  // Handle nested structures for suppliers
  const suppliersData =
    relationships.purchaseReferences ||
    relationships.suppliers ||
    verificationData.suppliers ||
    {};
  const suppliersArray = Array.isArray(suppliersData)
    ? suppliersData
    : Array.isArray(suppliersData.topSuppliers)
      ? suppliersData.topSuppliers
      : [];
  const purchaseReferencesList = ensureArray(suppliersArray).map(
    (supplier: any) =>
      `<li>${formatMultiline(supplier?.name || supplier?.supplierName || "Mr. Name")} – ${formatMultiline(
        supplier?.contactNumber || supplier?.contactDetails || "Number"
      )}</li>`
  );

  const existingLoansRows = ensureArray(existingLoansData?.existingLoans).map(
    (loan: any) => [
      formatMultiline(loan?.financialInstitution || ""),
      formatCurrency(loan?.loanAmount),
      formatMultiline(loan?.natureOfLoan || ""),
      formatCurrency(loan?.emi),
    ]
  );

  const financialSummaryTable = renderInnerTable(
    ["AY", "Turnover", "Net Profit", "Net margin (%)"],
    [
      [
        formatMultiline(turnoverAndNetProfitDetails.assessmentYear || ""),
        formatCurrency(turnoverAndNetProfitDetails.turnover),
        formatCurrency(turnoverAndNetProfitDetails.netProfit),
        formatMultiline(
          turnoverAndNetProfitDetails.netMarginPercent + "%" || ""
        ),
      ],
    ]
  );

  const endUseList = renderList(
    ensureArray(loanAnalysis.endUse).map((item: any) => formatMultiline(item))
  );

  const securityList =
    loanAnalysis?.securityOffered?.length > 0
      ? `<ul style="margin: 0; padding-left: 20px;">${ensureArray(
          loanAnalysis?.securityOffered
        )
          .map((line: string) => line.trim())
          .map((line: string) => `<li style="margin-left: 8px;">${line}</li>`)
          .join("")}</ul>`
      : "Not provided";

  // Handle observations - can be string or array
  const observationsData = loanAnalysis.observations;
  const observationsArray = Array.isArray(observationsData)
    ? observationsData
    : typeof observationsData === "string"
      ? observationsData
          .split(/\n+/)
          .filter((line: string) => line.trim().length > 0)
      : [];
  const observationList = renderList(
    observationsArray.map((item: any) => formatMultiline(item))
  );

  // Handle concerns - can be string or array
  const concernsData = loanAnalysis.concerns;
  const concernsArray = Array.isArray(concernsData)
    ? concernsData
    : typeof concernsData === "string"
      ? concernsData
          .split(/\n+/)
          .filter((line: string) => line.trim().length > 0)
      : [];
  const concernsList = renderList(
    concernsArray.map((item: any) => formatMultiline(item))
  );

  const otherBusinessList = loanAnalysis.otherBusinessIncome
    ? `<ul style="margin: 0; padding-left: 20px;">${
        loanAnalysis?.otherBusinessIncome
          ?.split("\n")
          .map((line: string) => line.trim())
          .map((line: string) => `<li style="margin-left: 8px;">${line}</li>`)
          .join("") || "Not provided"
      }
    </ul>`
    : "Not provided";

  const statusTable = renderTwoColumnTable([
    ["Status of this case", html_data.approvedStatus || "Not provided"],
  ]);

  const dateRow = wrapParagraph(
    `<strong>Date:</strong> ${formatMultiline(generatedDate)}`
  );

  return `
    ${pdBaseTemplate(html_data)}
    <style>
      .hero-fincorp-section p { margin: 6px 0; }
      .hero-fincorp-section ul li { margin-bottom: 4px; }
    </style>
    <div class="template-content hero-fincorp-section">
      ${generalTable}

      ${sectionTitle("About the Applicant")}
      ${
        applicantProfile.applicantSummary
          ? `<ul style="margin: 0; padding-left: 20px;">${
              applicantProfile?.applicantSummary
                ?.split("\n")
                .map((line: string) => line.trim())
                .map(
                  (line: string) => `<li style="margin-left: 8px;">${line}</li>`
                )
                .join("") || "Not provided"
            }</ul>`
          : "Not provided"
      }

      <h3 style="margin:12px 0 6px;font-size:16px;font-weight:600;color:#1f2d3d;">Family Details</h3>
      ${familyTable}

      ${sectionTitle("About the Business")}
      ${
        businessProfileData?.aboutTheBusiness
          ? `${businessProfileData?.aboutTheBusiness
              ?.split("\n")
              .map((line: string) => line.trim())
              .map(
                (line: string) =>
                  `<ul><li style="margin-left: 8px;">${line}</li></ul>`
              )
              .join("")}`
          : "Not provided"
      }

      ${sectionTitle("Turnover and net profit details for last one year audited financials.")}
      ${financialSummaryTable}

      <h3 style="margin:12px 0 6px;font-size:16px;font-weight:600;color:#1f2d3d;">Documents Observed</h3>
      ${documentsList}

      <h3 style="margin:12px 0 6px;font-size:16px;font-weight:600;color:#1f2d3d;">Automation Level</h3>
      ${
        automationLevel?.automationLevel
          ? `<ul style="margin: 0; padding-left: 20px;">${
              automationLevel?.automationLevel
                ?.split("\n")
                .map((line: string) => line.trim())
                .map(
                  (line: string) => `<li style="margin-left: 8px;">${line}</li>`
                )
                .join("") || "Not provided"
            }</ul>`
          : "Not provided"
      }

      ${sectionTitle("Customers")}
      <ul>
        ${customersList.length ? customersList.join("") : "<li>Not provided</li>"}
      </ul>

      ${sectionTitle("Purchase")}
      <ul>
        ${
          purchaseReferencesList.length
            ? purchaseReferencesList.join("")
            : "<li>Not provided</li>"
        }
      </ul>

      ${sectionTitle("Margins")}
      ${
        relationships.margins
          ? `<ul style="margin: 0; padding-left: 20px;">${
              String(relationships.margins)
                .split("\n")
                .map((line: string) => line.trim())
                .filter((line: string) => line.length > 0)
                .map(
                  (line: string) =>
                    `<li style="margin-left: 8px;">${formatMultiline(line)}</li>`
                )
                .join("") || "Not provided"
            }</ul>`
          : "Not provided"
      }

      ${sectionTitle("Employees")}
      ${
        relationships.employeesCount
          ? `<ul style="margin: 0; padding-left: 20px;">${
              String(relationships.employeesCount)
                .split("\n")
                .map((line: string) => line.trim())
                .filter((line: string) => line.length > 0)
                .map(
                  (line: string) =>
                    `<li style="margin-left: 8px;">${formatMultiline(line)}</li>`
                )
                .join("") || "Not provided"
            }</ul>`
          : "Not provided"
      }

      ${sectionTitle("Assets")}
      ${
        relationships.assets
          ? `<ul style="margin: 0; padding-left: 20px;">${
              String(relationships.assets)
                .split("\n")
                .map((line: string) => line.trim())
                .filter((line: string) => line.length > 0)
                .map(
                  (line: string) =>
                    `<li style="margin-left: 8px;">${formatMultiline(line)}</li>`
                )
                .join("") || "Not provided"
            }</ul>`
          : "Not provided"
      }

      ${sectionTitle("Loans")}
      ${renderInnerTable(
        ["Financial Institution", "Loan Amount", "Nature of Loan", "EMI"],
        existingLoansRows
      )}

      ${sectionTitle("End Use")}
      ${endUseList}

      ${sectionTitle("Security Offered")}
      ${securityList}

      ${sectionTitle("Address")}
      ${loanAnalysis.address ? `<p style="margin: 0; padding-left: 8px;">${loanAnalysis.address}</p>` : "Not provided"}

      ${sectionTitle("Observation")}
      ${observationList}

      ${sectionTitle("Concerns")}
      ${concernsList}

      ${sectionTitle("Other Business / Income")}
      ${otherBusinessList}

      ${statusTable}
      ${dateRow}

      ${sectionTitle("Disclaimer Clause")}
      <p style="${paragraphStyle}">
        This report (including any attachments) has been prepared on the basis of verbal
        information provided by the person contacted. Hero Fincorp will be solely responsible
        for any actions taken on this report and any liabilities directly or indirectly accruing
        from such actions. Kowtha &amp; Co. will not be held liable in any case.
      </p>
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};
