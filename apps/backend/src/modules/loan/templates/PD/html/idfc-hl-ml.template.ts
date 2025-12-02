import { baseTemplate } from "../../FI/base.template";
import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0";
const labelCellStyle =
  "border:1px solid #ccc;padding:8px;font-weight:bold;vertical-align:top;line-height:1.5";
const valueCellStyle =
  "border:1px solid #ccc;padding:8px;vertical-align:top;line-height:1.5";
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

const displayValue = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toLocaleString("en-IN");
  return String(value);
};

const formatMultiline = (value: any): string => {
  const rendered = displayValue(value);
  return rendered.replace(/\n+/g, "<br>");
};

const formatCurrency = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return formatMultiline(value);
  }
  return `${numeric.toLocaleString("en-IN")}`;
};

const formatDate = (value: any): string => {
  if (!hasValue(value)) return "";
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("en-GB");
  }
  return formatMultiline(value);
};

const ensureArray = <T>(value: T | T[] | undefined | null): T[] => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
};

const wrapParagraph = (content: string) =>
  `<p style="${paragraphStyle}">${content}</p>`;

const bulletList = (items: string[]) =>
  items.length
    ? `<ul style="margin:4px 0 0 18px;padding-left:18px;">${items
        .map((item) => `<li>${item}</li>`)
        .join("")}</ul>`
    : "";

const renderKeyValueTable = (
  rows: Array<[string, any, ((value: any) => string)?]>
) => {
  if (!rows.length) return "";
  return `
    <table style="${tableStyle}">
      ${rows
        .map(([label, value, formatter]) => {
          const rendered = formatter
            ? formatter(value)
            : formatMultiline(value);
          return `
          <tr>
            <td style="${labelCellStyle}"><p style="${paragraphStyle}">${label}</p></td>
            <td style="${valueCellStyle}"><p style="${paragraphStyle}">${rendered}</p></td>
          </tr>`;
        })
        .join("")}
    </table>
  `;
};

const renderInstructionTable = (
  rows: Array<{ instruction: string; content: string }>
) => {
  if (!rows.length) return "";
  return `
    <table style="${tableStyle}">
      ${rows
        .map(
          ({ instruction, content }) => `
        <tr>
          <td style="${labelCellStyle}">${instruction}</td>
          <td style="${valueCellStyle}">${content}</td>
        </tr>`
        )
        .join("")}
    </table>
  `;
};

const renderInnerTable = (headers: string[], rows: string[][]) => {
  if (!rows.length) {
    return wrapParagraph("Not provided");
  }

  const headerRow = headers
    .map(
      (header) =>
        `<td style="${labelCellStyle};font-weight:bold;background:#f5f5f5;">${header}</td>`
    )
    .join("");

  const rowsHtml = rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => `<td style="${valueCellStyle}">${cell}</td>`)
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

export const idfcHlMlTemplate = (verificationData: any, html_data: any) => {
  const general =
    verificationData.generalDetails ||
    verificationData.general ||
    verificationData.loanSummary ||
    {};

  const personal =
    verificationData.personalDetails || verificationData.personal || {};

  const businessDetails =
    verificationData.businessDetails ||
    verificationData.businessWorkDetails ||
    {};

  const operational =
    verificationData.operationalDetails ||
    verificationData.businessOperations ||
    {};

  const financial =
    verificationData.financialDetails || verificationData.financial || {};

  const termLoansSection =
    verificationData.termLoans || verificationData.loansAndBankingDetails || {};

  const loanDetails =
    verificationData.loanDetails || verificationData.loanInformation || {};

  const personalDiscussion =
    verificationData.personalDiscussion ||
    verificationData.personalDiscussionDetails ||
    {};
  const detailsConfirmation = verificationData.detailsConfirmation || {};

  const familyMembers = ensureArray(personal.familyMembers).map(
    (member: any) => [
      formatMultiline(member.name || ""),
      formatMultiline(
        member.relationship || member.relationshipWithApplicant || ""
      ),
      formatMultiline(member.age || ""),
      formatMultiline(member.qualification || ""),
      formatMultiline(member.occupation || ""),
    ]
  );

  const generalTable = renderKeyValueTable([
    [
      "Name of the Applicant",
      general.nameOfApplicant ||
        general.nameOfTheApplicant ||
        html_data?.loanDetails?.applicantName,
    ],
    [
      "Name of the Co-Applicant/s",
      general.nameOfCoApplicants || general.nameOfTheCoApplicantS,
    ],
    [
      "Reference Number",
      general.referenceNumber || html_data?.loanDetails?.applicationNumber,
    ],
    ["Product", general.product],
    ["Customer Category", general.customerCategory],
    ["Date of Initiation", formatDate(general.dateOfInitiation)],
    [
      "Date of Customer Availability",
      formatDate(general.dateOfCustomerAvailability),
    ],
    ["Date of PD", formatDate(general.dateOfPd)],
    ["Number of Visits Made", general.numberOfVisitsMade],
    ["Person Met", general.personMet],
    ["Place and Address of Visit", general.placeAndAddressOfVisit],
    ["Owned/ Rental", general.ownershipStatus || general.ownedRental],
    [
      "Whether Name Board Seen",
      general.nameBoardSeen || general.whetherNameBoardSeen,
    ],
  ]);

  const personalRows = [
    {
      instruction: `<p style="${paragraphStyle}"><strong>Name of the Applicant</strong></p>`,
      content: wrapParagraph(
        formatMultiline(personal.applicantName || general.nameOfApplicant || "")
      ),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Phone No. of the applicant</strong></p>`,
      content: wrapParagraph(formatMultiline(personal.phoneNumber || "")),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>PAN No.</strong></p>`,
      content: wrapParagraph(formatMultiline(personal.panNumber || "")),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Educational Qualification</strong></p>`,
      content: wrapParagraph(
        formatMultiline(personal.educationalQualification || "")
      ),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Role in Business</strong></p>`,
      content: wrapParagraph(formatMultiline(personal.roleInBusiness || "")),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Details of Family Members</strong></p>${bulletList(
        [
          "Family details – Including dependents",
          "Family background (Parents and siblings including all dependents)",
        ]
      )}`,
      content: familyMembers.length
        ? renderInnerTable(
            [
              "Name",
              "Relationship with applicant",
              "Age",
              "Qualification",
              "Occupation (Job/Business)",
            ],
            familyMembers
          )
        : "",
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Residence Address</strong></p>`,
      content: wrapParagraph(formatMultiline(personal.residenceAddress || "")),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Nature of Residence</strong></p>`,
      content: wrapParagraph(formatMultiline(personal.natureOfResidence || "")),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>No. of years in the same address</strong></p>`,
      content: wrapParagraph(
        formatMultiline(personal.yearsInSameAddress || "")
      ),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>No of years in the same City</strong></p>`,
      content: wrapParagraph(formatMultiline(personal.yearsInSameCity || "")),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Permanent Address (If different from above)</strong></p>`,
      content: wrapParagraph(formatMultiline(personal.permanentAddress || "")),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Name of the co-applicants and relationship</strong></p>`,
      content: wrapParagraph(
        formatMultiline(
          personal.coApplicantRelationship || general.nameOfCoApplicants || ""
        )
      ),
    },
  ];

  const personalTable = renderInstructionTable(personalRows);

  const businessRows = [
    {
      instruction: `<p style="${paragraphStyle}"><strong>Name of the Entity/ Employer Name</strong></p>`,
      content: wrapParagraph(formatMultiline(businessDetails.entityName || "")),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Constitution</strong></p>`,
      content: wrapParagraph(
        formatMultiline(businessDetails.constitution || "")
      ),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Brief on business model and Nature of Business</strong></p>`,
      content: wrapParagraph(
        formatMultiline(businessDetails.businessModel || "")
      ),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Year of Incorporation</strong></p>`,
      content: wrapParagraph(
        formatMultiline(businessDetails.yearOfIncorporation || "")
      ),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Business actively managed by (Self/Others)</strong></p>`,
      content: wrapParagraph(
        formatMultiline(businessDetails.businessManagedBy || "")
      ),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Number of years in Business/ Service</strong></p>`,
      content: wrapParagraph(
        formatMultiline(businessDetails.numberOfYearsInBusiness || "")
      ),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Total Work Experience</strong></p>`,
      content: wrapParagraph(
        formatMultiline(businessDetails.totalWorkExperience || "")
      ),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Business started by Self Or Family Business</strong></p>`,
      content: wrapParagraph(
        formatMultiline(businessDetails.businessStartedBy || "")
      ),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Previous Work Experience</strong></p>`,
      content: wrapParagraph(
        formatMultiline(businessDetails.previousWorkExperience || "")
      ),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>If the business entity is a Pvt. Ltd. then Name of the directors and their share holding</strong></p>`,
      content: wrapParagraph(
        formatMultiline(businessDetails.directorShareholding || "")
      ),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Registered with Shop & Establishment act? if Yes Regn NO</strong></p>`,
      content: wrapParagraph(
        formatMultiline(businessDetails.shopEstablishmentRegistration || "")
      ),
    },
  ];

  const businessTable = renderInstructionTable(businessRows);

  const operationalRows = [
    {
      instruction: `<p style="${paragraphStyle}"><strong>Nature of Business / Line of activity</strong></p>`,
      content: wrapParagraph(
        formatMultiline(operational.natureOfBusiness || "")
      ),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Relevant Experience/ Qualification</strong></p>`,
      content: wrapParagraph(
        formatMultiline(operational.relevantExperience || "")
      ),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Describe Business Process</strong></p>`,
      content: wrapParagraph(
        operational.businessProcess.split("\n")
          .map((line: string) => `<ul style="margin-left: 8px;"><li>${line}</li></ul>`)
          .join("") || ""
      ),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Activity level at the time of visit</strong></p>`,
      content: wrapParagraph(
        formatMultiline(operational.activityLevelAtVisit || "")
      ),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Details of Product</strong></p>`,
      content: wrapParagraph(formatMultiline(operational.productDetails || "")),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Source of Raw Material</strong></p>`,
      content: wrapParagraph(
        formatMultiline(operational.rawMaterialSource || "")
      ),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Names of Customers with contact No.</strong></p>`,
      content: wrapParagraph(formatMultiline(operational.customerNames || "")),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Names of Suppliers with contact No.</strong></p>`,
      content: wrapParagraph(formatMultiline(operational.supplierNames || "")),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Employee Strength and Actual seen at the time of Visit</strong></p>`,
      content: wrapParagraph(
        formatMultiline(operational.employeeStrength || "")
      ),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Strengths and Weaknesses of Business</strong></p>`,
      content: wrapParagraph(
        formatMultiline(operational.businessStrengthsWeaknesses || "")
      ),
    },
  ];

  const operationalTable = renderInstructionTable(operationalRows);

  const financialTable = renderInnerTable(
    [
      "Particulars",
      "As per the data provided by the applicant up to 31-03-2025",
      "As per our estimation",
    ],
    [
      [
        "Gross Income per year",
        formatCurrency(
          financial.grossIncomePerYearActual || financial.grossIncome || ""
        ),
        formatCurrency(
          financial.grossIncomePerYearEstimated ||
            financial.grossIncomeEstimation ||
            ""
        ),
      ],
      [
        "Net Income per year",
        formatCurrency(
          financial.netIncomePerYearActual || financial.netIncome || ""
        ),
        formatCurrency(
          financial.netIncomePerYearEstimated ||
            financial.netIncomeEstimation ||
            ""
        ),
      ],
      [
        "Net Profit for last 2 years",
        formatCurrency(financial.netProfitLastTwoYears || ""),
        formatCurrency(financial.netProfitLastTwoYearsEstimated || ""),
      ],
      [
        "Gross Business Margin %",
        financial.grossBusinessMarginPercent || "" + "%",
        financial.grossBusinessMarginPercentEstimated || "" + "%",
      ],
      [
        "Net Business Margin %",
        financial.netBusinessMarginPercent || "" + "%",
        financial.netBusinessMarginPercentEstimated || "" + "%",
      ],
      [
        "No. of years filing ITRs",
        financial.yearsFilingItrs || "",
        financial.yearsFilingItrsEstimated || "",
      ],
      [
        "Last 2 years ITRs",
        financial.lastTwoYearsItrs || "",
        financial.lastTwoYearsItrsEstimated || "",
      ],
      [
        "Last 2 years Form 16 (Salaried)",
        formatMultiline(financial.lastTwoYearsForm16 || ""),
        formatMultiline(financial.lastTwoYearsForm16Estimated || ""),
      ],
    ]
  );

  const termLoans = ensureArray(
    termLoansSection.termLoans || termLoansSection.termLoansDetails
  ).map((loan: any) => [
    formatMultiline(loan.institution || loan.institutionName || ""),
    formatMultiline(loan.loanType || ""),
    formatMultiline(loan.monthlyEmi || loan.monthlyPrincipal || ""),
    formatMultiline(loan.monthlyInterest || ""),
    formatMultiline(loan.loanAmount || ""),
    formatMultiline(loan.mob || ""),
    formatMultiline(loan.outstanding || loan.outstandingAmount || ""),
  ]);

  const bankingDetails = ensureArray(
    termLoansSection.bankingDetails || termLoansSection.bankAccounts
  ).map((account: any) => [
    formatMultiline(account.bankName || ""),
    formatMultiline(account.accountType || ""),
    formatMultiline(account.relationshipSince || ""),
    formatMultiline(account.averageBalance || ""),
  ]);

  const rentalProperties = ensureArray(termLoansSection.rentalProperties).map(
    (property: any) => [
      formatMultiline(property.propertyAddress || ""),
      formatMultiline(property.tenantName || ""),
      formatMultiline(property.tenure || ""),
      formatMultiline(property.rentAgreementAvailable || ""),
      formatMultiline(property.monthlyRent || ""),
    ]
  );

  const termLoansTable = renderInnerTable(
    [
      "Institution / Bank / NBFC Name",
      "Type of Loan (LAP / HL / CD / CV / AL etc.)",
      "Monthly Principal / EMI",
      "Monthly Interest (if not in EMI mode)",
      "Loan amount (Rs .Lacs)",
      "MOB",
      "O/s (Rs)",
    ],
    termLoans
  );

  const bankingTable = renderInnerTable(
    ["Bank Name", "Type of Account", "Relationship since", "Avg balance"],
    bankingDetails
  );

  const rentalTable = renderInnerTable(
    [
      "Property address",
      "Tenant Name",
      "Since When (no of years)",
      "Rent agreement available (Y/N)",
      "Monthly Rent amount? (inclusive of maintenance)",
    ],
    rentalProperties
  );

  const loanDetailsTable = renderKeyValueTable([
    ["Amount of Loan Applied", loanDetails.loanAmountApplied],
    ["Purpose of Loan (End Use)", loanDetails.purposeOfLoan],
    ["Collateral Offered", loanDetails.collateralOffered],
    [
      "Address of the Property offered as collateral",
      loanDetails.collateralAddress,
    ],
    ["Owner of the Property", loanDetails.propertyOwner],
    [
      "If the Property is Vacant, reason for the same",
      loanDetails.propertyVacantReason,
    ],
    ["Area of the Property (Sq. yd.)", loanDetails.propertyArea],
    ["Market Value of the Property (Approx)", loanDetails.propertyMarketValue],
    [
      "Is the property presently mortgaged with any Bank / FI?",
      loanDetails.propertyMortgaged,
    ],
    [
      "If yes (provide the name of financier and loan details)",
      loanDetails.existingFinancierDetails,
    ],
    ["End use of loan", loanDetails.loanEndUse],
  ]);

  const personalDiscussionRows = [
    {
      instruction: `<p style="${paragraphStyle}"><strong>Strengths</strong></p>`,
      content: wrapParagraph(
        formatMultiline(personalDiscussion.strengths || "")
      ),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Other observation</strong></p>`,
      content:
        (hasValue(personalDiscussion.otherObservation)
          ? wrapParagraph(formatMultiline(personalDiscussion.otherObservation))
          : "") + wrapParagraph(""),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>PD Status</strong></p>`,
      content: wrapParagraph(html_data.approvedStatus|| "Not provided"),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Overall outcome of the Personal Discussion</strong></p>`,
      content: wrapParagraph(
        formatMultiline(personalDiscussion.overallOutcome || "")
      ),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Remarks</strong></p>`,
      content: wrapParagraph(formatMultiline(personalDiscussion.remarks || "")),
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>PD Conducted by</strong></p>`,
      content:
        wrapParagraph(formatMultiline(personalDiscussion.pdConductedBy || "")) ,
    },
    {
      instruction: `<p style="${paragraphStyle}"><strong>Date</strong></p>`,
      content: wrapParagraph(formatMultiline(personalDiscussion.pdDate || "")),
    },
  ];

  const personalDiscussionTable = renderInstructionTable(
    personalDiscussionRows
  );

  const detailsConfirmationRows = `<p style="${paragraphStyle}"><strong>The details provided in the application form and the details provided by the customer at the time of discussion are same</strong> - ${detailsConfirmation.detailsCheckedSameOrNot || ""}</p>
  ${
    detailsConfirmation.detailsCheckedSameOrNot === "No"
      ? `<p><strong>Details:</strong> ${
          detailsConfirmation?.detailsNotSameReason?.split("\n")
          .map((line: string) => `<p style="margin-left: 8px;">${line}</p>`)
          .join("") || ""
      }</p>`
    : ""
}`;

return `
${pdBaseTemplate(html_data)}
<div class="template-content">
${wrapParagraph("<strong>IDFC Bank LTD – Personal Discussion Report</strong>")}
${wrapParagraph("<strong>I] General Details:-</strong>")}
${generalTable}

${wrapParagraph("<strong>II] Personal Details:-</strong>")}
      ${personalTable}

      ${wrapParagraph("<strong>III] Business/ Work Details:-</strong>")}
      ${businessTable}

      ${wrapParagraph("<strong>IV] Operational Details:-</strong>")}
      ${operationalTable}

      ${wrapParagraph("<strong>V] Financial Details:-</strong>")}
      ${financialTable}

      ${wrapParagraph("<strong>Loans and Banking Details:</strong>")}
      ${wrapParagraph("<strong>Term Loans:</strong>")}
      ${termLoansTable}
      ${wrapParagraph("<strong>Banking Details:</strong>")}
      ${bankingTable}
      ${wrapParagraph("<strong>Other Assets:</strong>")}
      ${wrapParagraph(
        termLoansSection?.otherAssets?.split("\n")
          .map((line: string) => `<li style="margin-left: 20px;">${line}</li>`)
          .join("") || "-"
      )}
      ${wrapParagraph("<strong>Other Business if any:</strong>")}
      ${wrapParagraph(
        termLoansSection?.otherBusiness?.split("\n")
          .map((line: string) => `<li style="margin-left: 20px;">${line}</li>`)
          .join("") || "-"
      )}
      ${wrapParagraph("<strong>Rental Income If any:</strong>")}
      ${rentalTable}

      ${wrapParagraph("<strong>VI] Loan Details:-</strong>")}
      ${loanDetailsTable}

      ${wrapParagraph("<strong>VII] Personal Discussion Details:-</strong>")}
      ${personalDiscussionTable}
      ${detailsConfirmationRows}

      </div>
      ${pdBaseTemplateFooter(html_data)}
  `;
};
