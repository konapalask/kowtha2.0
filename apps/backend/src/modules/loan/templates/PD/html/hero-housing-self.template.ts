import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0";
const cellStyle =
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
  if (!hasValue(value)) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toLocaleString("en-IN");
  return String(value);
};

const formatMultiline = (value: any): string => {
  const rendered = displayValue(value);
  if (!rendered) return "";
  return rendered.replace(/\n+/g, "<br>");
};

const formatCurrency = (value: any): string => {
  if (!hasValue(value)) return "";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return formatMultiline(value);
  }
  return `Rs. ${numeric.toLocaleString("en-IN")}/-`;
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
    ? `<ul style="margin:4px 0 0 18px; font-weight:bold; padding-left:18px;">${items
        .map((item) => `<li>${item}</li>`)
        .join("")}</ul>`
    : "";

const optionalParagraph = (value: any, formatter?: (input: any) => string) =>
  hasValue(value)
    ? wrapParagraph(formatter ? formatter(value) : formatMultiline(value))
    : "";

const renderInstructionTable = (
  rows: Array<{ left: string; right: string }>
) => {
  if (!rows.length) return "";
  return `
    <table style="${tableStyle}">
      ${rows
        .map(
          ({ left, right }) => `
        <tr>
          <td style="${cellStyle}">${left}</td>
          <td style="${cellStyle}">${right}</td>
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

  const headerHtml = headers
    .map(
      (header) => `<td style="${cellStyle};font-weight:bold;">${header}</td>`
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
      <tr>${headerHtml}</tr>
      ${rowsHtml}
    </table>
  `;
};

const joinDetails = (
  pairs: Array<[string, any, ((value: any) => string)?]>
) => {
  const items = pairs
    .map(([label, value, formatter]) => {
      if (!hasValue(value)) return null;
      const rendered = formatter ? formatter(value) : formatMultiline(value);
      return `&nbsp; ${rendered}`;
    })
    .filter(Boolean);
  return items.length
    ? wrapParagraph(items.join("<br>"))
    : wrapParagraph("Not provided");
};

const multiParagraph = (value: any) =>
  hasValue(value)
    ? wrapParagraph(formatMultiline(value))
    : wrapParagraph("Not provided");

export const heroHousingSelfTemplate = (
  verificationData: any,
  html_data: any
) => {
  const summary =
    verificationData.loanSummary ||
    verificationData.generalLoanVisitDetails ||
    verificationData.basicDetails ||
    {};

  const borrowerProfile =
    verificationData.borrowerProfile || verificationData.borrowerDetails || {};

  const currentBusiness =
    verificationData.currentBusinessDetails ||
    verificationData.businessDetails ||
    verificationData.currentBusiness ||
    {};

  const businessPremises =
    verificationData.businessPremises ||
    verificationData.detailsOfBusinessPremises ||
    {};

  const businessOperations =
    verificationData.businessOperations ||
    verificationData.detailsAboutBusinessDetails ||
    {};

  const supplierCustomer =
    verificationData.supplierCustomerDetails ||
    verificationData.detailsOfSupplierAndCustomer ||
    {};

  const propertyDetails =
    verificationData.propertyDetails ||
    verificationData.detailsOfProperty ||
    {};

  const investmentAssets =
    verificationData.investmentAndAssets ||
    verificationData.investmentAndProperties ||
    {};

  const endUse =
    verificationData.endUseDetails ||
    verificationData.endUseOfPropertyFund ||
    {};

  const loanObligations =
    verificationData.loanObligations || verificationData.detailsOfLoans || {};

  const banking =
    verificationData.bankingDetails || verificationData.banking || {};

  const documentChecks =
    verificationData.documentVerificationChecks ||
    verificationData.documentVerificationAndOtherChecks ||
    {};

  const finalStatus =
    verificationData.finalStatus || verificationData.finalPdStatus || {};

  const incomeAssessment =
    verificationData.incomeAssessment ||
    verificationData.incomeAssessmentDetails ||
    {};

  const familyMembers = ensureArray(
    borrowerProfile.familyMembers ||
      borrowerProfile.familyDetails ||
      verificationData.familyDetails?.familyMembers
  ).filter((member) => hasValue(member));

  const latitude =
    summary.latitude ||
    summary.latOfOfficeAddress ||
    summary.latLongOfOfficeAddress;

  const longitude =
    summary.longitude ||
    summary.longOfOfficeAddress ||
    summary.latLongOfOfficeAddress;

  const loanSummaryTable = renderInstructionTable([
    {
      left: `<p style="${paragraphStyle}"><strong>Loan account No.</strong></p>`,
      right: wrapParagraph(
        formatMultiline(
          summary.loanAccountNo || html_data.applicationNumber || ""
        )
      ),
    },
    {
      left: `<p style="${paragraphStyle}"><strong>Name of customer</strong></p>`,
      right: wrapParagraph(formatMultiline(summary.applicantName || "")),
    },
    {
      left: `<p style="${paragraphStyle}"><strong>Person met in PD and relationship with Applicant</strong></p>`,
      right: wrapParagraph(
        formatMultiline(
          [summary.personMetInPd, summary.relationshipWithCustomer]
            .filter(hasValue)
            .join(" - ")
        )
      ),
    },
    {
      left: `<p style="${paragraphStyle}"><strong>PD Visit date and time</strong></p>`,
      right: wrapParagraph(
        formatMultiline(
          [
            summary.pdVisitDateAndTime,
          ]
            .filter(hasValue)
            .join(" ")
        )
      ),
    },
    {
      left: `<p style="${paragraphStyle}"><strong>PD address & location</strong></p>`,
      right: wrapParagraph(formatMultiline(summary.pdAddress || "")),
    },
    {
      left: `<p style="${paragraphStyle}"><strong>Lat log of business address</strong></p>`,
      right:
        hasValue(latitude) || hasValue(longitude)
          ? [
              latitude && wrapParagraph(formatMultiline(latitude)),
              longitude && wrapParagraph(formatMultiline(longitude)),
            ]
              .filter(Boolean)
              .join("")
          : wrapParagraph("Not provided"),
    },
    {
      left: `<p style="${paragraphStyle}"><strong>Requested loan amount</strong></p>`,
      right: wrapParagraph(formatCurrency(summary.requestedLoanAmount)),
    },
  ]);

  const familyTableHtml = familyMembers.length
    ? renderInnerTable(
        [
          "Name",
          "Relationship with applicant",
          "Age",
          "Qualification",
          "Occupation (Job/Business)",
          "Income details / dependent",
        ],
        familyMembers.map((member) => [
          formatMultiline(member.name || ""),
          formatMultiline(
            member.relationshipWithApplicant || member.relation || ""
          ),
          formatMultiline(member.age || ""),
          formatMultiline(member.qualification || ""),
          formatMultiline(member.occupation || ""),
          formatMultiline(
            member.incomeDetails ||
              member.incomeDetailsDependent ||
              member.dependentStatus ||
              ""
          ),
        ])
      )
    : "";

  const familyAdditionalInfo = [
    hasValue(borrowerProfile.totalDependants)
      ? wrapParagraph(
          `No. of dependants: ${formatMultiline(
            borrowerProfile.totalDependants
          )}`
        )
      : "",
    hasValue(borrowerProfile.familyBackgroundNotes)
      ? wrapParagraph(formatMultiline(borrowerProfile.familyBackgroundNotes))
      : "",
  ].join("");

  const familyValue = familyTableHtml;

  const borrowerValue = joinDetails([
    ["Qualification of customer", borrowerProfile.qualificationOfCustomer],
    ["Professional journey", borrowerProfile.professionalJourney],
  ]);

  const currentBusinessValue = joinDetails([
    [
      "Current business name",
      currentBusiness.currentBusinessName || currentBusiness.businessName,
    ],
    ["Constitution", currentBusiness.constitution],
    ["Nature of business / services", currentBusiness.natureOfBusiness],
    ["Running since", currentBusiness.runningSince],
    [
      "Experience in same line",
      currentBusiness.industryExperienceYears,
      (value) => `${value} years`,
    ],
    [
      "Partners / directors / shareholders",
      currentBusiness.detailspartnersDirectorsShareholdersWithFamilyBackground,
    ],
  ]);

  const businessPremisesValue = joinDetails([
    [
      "Address of business premises",
      businessPremises.addressOfBusinessPremises,
    ],
    [
      "Ownership details",
      businessPremises.ownershipDetails ||
        businessPremises.ownershipOfAllAboveBusinessPremises,
    ],
    [
      "Size / area of business premises",
      businessPremises.businessPremisesSize ||
        businessPremises.sizeAreaOfBusinessPremises ||
        businessPremises.sizeOfBusinessPremises,
    ],
    [
      "Business operations / footfall / stock",
      businessPremises.operationsAndFootfallObservation ||
        businessPremises.commentOnBusinessOperationsFootfallOfCustomerStock,
    ],
  ]);

  const businessOperationsValue = joinDetails([
    ["Products / services dealing", businessOperations.productServiceDetails],
    [
      "No. of employees and salary details",
      businessOperations.employeesAndSalaries ||
        businessOperations.noOfEmployeeAndSalaryDetails,
    ],
    [
      "Quantum of stock",
      businessOperations.stockQuantum || businessOperations.quantumOfStock,
    ],
    [
      "Machinery and assets seen",
      businessOperations.machineryAndAssets ||
        businessOperations.noOfMachineryAndAssetsSeen,
    ],
    [
      "Turnover of last three years & current year till date",
      businessOperations.turnoverHistory ||
        businessOperations.turnoverOfLastThreeYears,
    ],
    [
      "Product / service gross margin ratio",
      businessOperations.productServiceGrossMarginRatio,
    ],
    [
      "Product / service net margin ratio",
      businessOperations.productServiceNetMarginRatio,
    ],
    [
      "Expansion or new products/services introduced",
      businessOperations.expansionOrChanges ||
        businessOperations.anyExpansionOrNewProductServices,
    ],
    [
      "Locality / competitors / prospects feedback",
      businessOperations.localityFeedback ||
        businessOperations.briefAboutTheLocalityOfBusiness,
    ],
  ]);

  const supplierCustomerList = joinDetails([
    [
      "Supplier and customer overview",
      supplierCustomer.supplierCustomerOverview ||
        supplierCustomer.briefAboutSupplierAndCustomer,
    ],
    [
      "No. of suppliers",
      supplierCustomer.totalSuppliers ||
        supplierCustomer.noOfTotalSuppliersAndCustomers,
    ],
    ["Supplier credit terms", supplierCustomer.supplierCreditTerms],
    [
      "No. of customers",
      supplierCustomer.totalCustomers || supplierCustomer.noOfTotalCustomers,
    ],
    ["Customer credit terms", supplierCustomer.customerCreditTerms],
    [
      "Billing cycle / receipt mode",
      supplierCustomer.billingCycleAndReceiptMode ||
        supplierCustomer.billingPeriodAndReceiptMode,
    ],
    ["Total debtors & creditors", supplierCustomer.totalDebtorsAndCreditors],
  ]);

  const tradeReferences = ensureArray(
    supplierCustomer.tradeReferences || verificationData.tradeReferences
  );

  const tradeReferenceValue = tradeReferences.length
    ? renderInnerTable(
        ["Name", "Business name", "Relation", "Contact number"],
        tradeReferences.map((ref: any) => [
          formatMultiline(ref.name || ""),
          formatMultiline(ref.businessName || ""),
          formatMultiline(ref.relation || ""),
          formatMultiline(ref.contactNumber || ""),
        ])
      )
    : "";

  const propertyDetailsValue = joinDetails([
    [
      "Whether customer visited the property",
      propertyDetails.customerVisitedProperty,
    ],
    ["Type of property", propertyDetails.propertyType],
    ["Property occupancy / usage", propertyDetails.propertyOccupancy],
    ["Source of property purchase", propertyDetails.propertyPurchaseSource],
    ["Seller details", propertyDetails.sellerDetails],
    ["Property structure & area", propertyDetails.structureAndArea],
    ["Deal value vs sale deed value", propertyDetails.dealAndSaleDeedValue],
    ["Existing loan on property (seller)", propertyDetails.sellerExistingLoan],
    ["Seller purchase timeline", propertyDetails.sellerPurchaseTimeline],
  ]);

  const investmentAssetsValue = joinDetails([
    ["Investment habits & monthly savings", investmentAssets.investmentHabits],
    ["Current residence ownership / rent", investmentAssets.residenceOwnership],
    [
      "Assets built till date",
      investmentAssets.assetsBuilt ||
        investmentAssets.detailsOfAssetsBuiltTillDate,
    ],
  ]);

  const endUseValue = joinDetails([
    ["Proposed end use of property", endUse.propertyEndUse],
    ["Detailed end use of funds", endUse.fundUtilisation],
  ]);

  const loanObligationsValue = joinDetails([
    ["Loans presently servicing", loanObligations.currentLoansServiced],
    ["Repayment account details", loanObligations.repaymentAccount],
    ["Past loan utilisation", loanObligations.pastLoanEndUse],
    ["Mortgage property / facilities", loanObligations.mortgageOrFacilities],
    ["Repayment behaviour", loanObligations.repaymentBehaviour],
  ]);

  const bankingValue = joinDetails([
    ["Business banking details", banking.businessBanking],
    ["Savings accounts", banking.savingsAccounts],
    [
      "% of receipts routed through banking",
      hasValue(banking.receiptsRoutedThroughBanking)
        ? `${banking.receiptsRoutedThroughBanking}%`
        : "",
    ],
  ]);

  const documentChecksValue = joinDetails([
    [
      "Sale / purchase registers, kutcha records, inventory observations",
      documentChecks.recordsAndInventoryObservation,
    ],
    ["Neighbour / independent checks", documentChecks.thirdPartyChecks],
    [
      "Additional involvement checks",
      documentChecks.additionalInvolvementCheck,
    ],
    [
      "Compliance & branding verification",
      documentChecks.complianceAndBranding,
    ],
    ["External / Google feedback", documentChecks.externalFeedback],
  ]);

  const finalStatusValue = joinDetails([
    ["Final PD status", html_data.approvedStatus|| "Not provided"],
  ]);

  const incomeItems = ensureArray(incomeAssessment.lineItems).map(
    (item: any) => []
  );

  if (hasValue(incomeAssessment.salesReceiptsMonthlyAverage)) {
    incomeItems.push([
      "<strong>Sales/receipt (Monthly average)</strong>",
      formatCurrency(incomeAssessment.salesReceiptsMonthlyAverage),
      formatMultiline(
        incomeAssessment.salesReceiptsMonthlyAverageComments || ""
      ),
    ]);
  }
  if (hasValue(incomeAssessment.otherIncome)) {
    incomeItems.push([
      "<strong>Other income</strong>",
      formatCurrency(incomeAssessment.otherIncome),
      formatMultiline(incomeAssessment.otherIncomeComments || ""),
    ]);
  }
  if (hasValue(incomeAssessment.totalMonthlyIncome)) {
    incomeItems.push([
      "<strong>Total monthly income</strong>",
      formatCurrency(incomeAssessment.totalMonthlyIncome),
      formatMultiline(incomeAssessment.totalMonthlyIncomeComments || ""),
    ]);
  }
  if (hasValue(incomeAssessment.costOfMaterialService)) {
    incomeItems.push([
      "<strong>Cost of material/service</strong>",
      formatCurrency(incomeAssessment.costOfMaterialService),
      formatMultiline(incomeAssessment.costOfMaterialServiceComments || ""),
    ]);
  }
  if (hasValue(incomeAssessment.directExpenses)) {
    incomeItems.push([
      "<strong>Direct expenses</strong>",
      formatCurrency(incomeAssessment.directExpenses),
      formatMultiline(incomeAssessment.directExpensesComments || ""),
    ]);
  }
  if (hasValue(incomeAssessment.salary)) {
    incomeItems.push([
      "<strong>Salary</strong>",
      formatCurrency(incomeAssessment.salary),
      formatMultiline(incomeAssessment.salaryComments || ""),
    ]);
  }
  if (hasValue(incomeAssessment.rent)) {
    incomeItems.push([
      "<strong>Rent</strong>",
      formatCurrency(incomeAssessment.rent),
      formatMultiline(incomeAssessment.rentComments || ""),
    ]);
  }
  if (hasValue(incomeAssessment.electricityExpenses)) {
    incomeItems.push([
      "<strong>Electricity expenses</strong>",
      formatCurrency(incomeAssessment.electricityExpenses),
      formatMultiline(incomeAssessment.electricityExpensesComments || ""),
    ]);
  }
  if (hasValue(incomeAssessment.travelAndTransportationExpenses)) {
    incomeItems.push([
      "<strong>Travel and transportation expenses</strong>",
      formatCurrency(incomeAssessment.travelAndTransportationExpenses),
      formatMultiline(
        incomeAssessment.travelAndTransportationExpensesComments || ""
      ),
    ]);
  }
  if (hasValue(incomeAssessment.RepairsAndMaintenanceExpenses)) {
    incomeItems.push([
      "<strong>Repairs and maintenance expenses</strong>",
      formatCurrency(incomeAssessment.RepairsAndMaintenanceExpenses),
      formatMultiline(
        incomeAssessment.RepairsAndMaintenanceExpensesComments || ""
      ),
    ]);
  }
  if (hasValue(incomeAssessment.otherMiscellaneousExpenses)) {
    incomeItems.push([
      "<strong>Other miscellaneous expenses</strong>",
      formatCurrency(incomeAssessment.otherMiscellaneousExpenses),
      formatMultiline(
        incomeAssessment.otherMiscellaneousExpensesComments || ""
      ),
    ]);
  }
  if (hasValue(incomeAssessment.otherFamilyExpenses)) {
    incomeItems.push([
      "<strong>Other family expenses like school fees/house rent, household expenses etc</strong>",
      formatCurrency(incomeAssessment.otherFamilyExpenses),
      formatMultiline(incomeAssessment.otherFamilyExpensesComments || ""),
    ]);
  }
  if (hasValue(incomeAssessment.netMonthlyAppraisalIncome)) {
    incomeItems.push([
      "<strong>Net monthly appraisal income</strong>",
      formatCurrency(incomeAssessment.netMonthlyAppraisalIncome),
      formatMultiline(incomeAssessment.monthlyNetIncomeComments || ""),
    ]);
  }

  if (hasValue(incomeAssessment.monthlyObligations)) {
    incomeItems.push([
      "<strong>Less : - Monthly obligations/EMI which are not getting closed</strong>",
      formatCurrency(incomeAssessment.monthlyObligations),
      formatMultiline(incomeAssessment.monthlyObligationsComments || ""),
    ]);
  }

  if (hasValue(incomeAssessment.netResidualIncome)) {
    incomeItems.push([
      "<strong>Net residual income (monthly)</strong>",
      formatCurrency(incomeAssessment.netResidualIncome),
      formatMultiline(incomeAssessment.netResidualIncomeComments || ""),
    ]);
  }

  const incomeTable = renderInnerTable(
    ["Particular", "Amount (Rs.) Monthly", "Comments"],
    incomeItems
  );

  const profileRows = [
    {
      left: `<p style="${paragraphStyle}"><strong>Borrower details ---</strong></p>${wrapParagraph(
        "<strong>It should include the</strong>"
      )}${bulletList([
        "Qualification of customer,",
        "Complete professional journey (service/ business details of each activity post qualification to till date)",
      ])}`,
      right: borrowerValue,
    },
    {
      left: `<p style="${paragraphStyle}"><strong>Family details</strong></p>${bulletList(
        [
          "Family details – Including dependents",
          "Family background (Parents and siblings including all dependents)",
        ]
      )}`,
      right: familyValue,
    },
    {
      left: `<p style="${paragraphStyle}"><strong>Current business details: --</strong></p>${bulletList(
        [
          "Current business name",
          "Constitution",
          "Nature of business/product or services details",
          "Running since",
          "Details of partners, director, shareholders with family background and other details (For each partner if constitution is other than proprietorship firm)",
        ]
      )}`,
      right: currentBusinessValue,
    },
    {
      left: `<p style="${paragraphStyle}"><strong>Details of business premises</strong></p>${bulletList(
        [
          "Address of business premises and additional places of business",
          "Ownership of all above business premises (Also mention rent amount and landlord name in case rented)",
          "Size/area of business premises",
          "Comment on the business operations/footfall of customer/stock etc and share observation if any",
        ]
      )}`,
      right: businessPremisesValue,
    },
    {
      left: `<p style="${paragraphStyle}"><strong>Details about business details</strong></p>${bulletList(
        [
          "Brief about the product/services dealing",
          "No. of employee and salary details",
          "Quantum of stock",
          "No of Machinery and assets seen",
          "Turnover of last three years and current year till date (Total actual turnover of customer)",
          "Product/service Gross Margins ratio ",
          "Product/service Net Margins ratio",
          "Any expansion or new product or change in business line in last 2 Years including change in business premises and any expected impact on the current revenue",
          "Brief details about the locality of business, surrounding competitors, overall prospect of location etc and any negative feedback",
        ]
      )}`,
      right: businessOperationsValue,
    },
    {
      left: `<p style="${paragraphStyle}"><strong>Details of supplier and customer</strong></p>${bulletList(
        [
          "Brief about supplier and customer and geographic reach/presence",
          "No of total suppliers and details of terms for credit period",
          "No of total customers and details of terms for credit period",
          "Billing period/cycle and receipt mode (Billing on consignment basis/ monthly basis/ progress of work basis) also comment if any advance is received",
          "Total debtors and creditors as on date and any default/write off in past",
          "Please collect reference of min 2 suppliers and 2 customers with their phone no. and business name",
        ]
      )}`,
      right: `${supplierCustomerList}${tradeReferenceValue}`,
    },
    {
      left: `<p style="${paragraphStyle}"><strong>Details of Property –</strong></p>${bulletList(
        [
          "Whether customer visited the property",
          "Type of property (Ready build/Plot/Self Construction/under construction/vacant etc)",
          "Property is occupied by whom and reason if not self-occupied (Also mention stage in case self-construction/under construction and expected completion date, also mention rent amount and period of tenancy if the property is given on rent) ",
          "Source of property purchase (through dealer, builder/reference/relative)",
          "Name of seller and any relationship with customer",
          "Type of property/structure and area",
          "What is actual deal value and sale deed value, OCR source ",
          "Whether seller is having any loan on the property",
          "When seller bought the property",
        ]
      )}`,
      right: propertyDetailsValue,
    },
    {
      left: `<p style="${paragraphStyle}"><strong>Investment and properties -</strong></p>${bulletList(
        [
          "What is customer investment habits and he is doing any monthly saving in any of saving scheme, investment in properties, FD or any other nature of saving",
          "Whether current residence is owned or rented and rent amount if any",
          "Details of assets built till date (Including immovable properties, movable property, gold, FD, Equity investment, other savings)",
        ]
      )}`,
      right: investmentAssetsValue,
    },
    {
      left: `<p style="${paragraphStyle}"><strong>End use of property/fund –</strong></p>${bulletList(
        [
          "Proposed End use of property (self-occupation/investment etc) for HL/P+C/Self construction cases ",
          "Clear and detailed end use of fund in LAP cases",
        ]
      )}`,
      right: endUseValue,
    },
    {
      left: `<p style="${paragraphStyle}"><strong>Details of loans –</strong></p>${bulletList(
        [
          "Please check and provide the details of loan presently servicing and whether he will be closing such loans or going to continue",
          "Repayment account from which all these EMI are getting paid",
          "What was the end use of fund of these loans (All BL/PL/LAP loan taken in last 3 years), also please check if there is any exceptional borrowing in last 12 months than exact use and impact on the business revenue",
          "Also check if any home loan/LAP than what is address of mortgage property, usage of such property, any CC/OD limit or any other facility in the name of customer",
          "Comment whether there is any bouncing in loans and if yes, period and reason of such bounces",
        ]
      )}`,
      right: loanObligationsValue,
    },
    {
      left: `<p style="${paragraphStyle}"><strong>Banking –</strong></p>${bulletList(
        [
          "Please check and mention details of all his bank account, account open date, Name of bank account in which major business transactions are happening ",
          "Please check any saving account of applicant and co applicant and provide the details of these accounts",
          "% of total receipt routed through banking",
        ]
      )}`,
      right: bankingValue,
    },
    {
      left: `<p style="${paragraphStyle}"><strong>Document verification and other checks</strong></p>${bulletList(
        [
          "Please check all relevant sale/purchase register/bills/Kutcha records, Inventory in line with those record, Payroll register and share observations",
          "TPC from minimum 1 neighbour and 1 local independent party to be done (It should be done by showing the photo of customer and ownership to be confirmed in the name of customer with existence period",
          "Additional check to be done from reference that any other person or family member involved in the business/manage the business",
          "Please check all QR code, license, permits, name board, contact number etc and all these belongs to customer and share observations",
          "Google check and any negative observation/feedback/dedupe match or any other feedback",
        ]
      )}`,
      right: documentChecksValue,
    },
    {
      left: `<p style="${paragraphStyle}"><strong>Final PD status (Positive/Negative) with comment for reason of status</strong></p>`,
      right: `${html_data.approvedStatus|| "Not provided"}`,
    },
  ];

  const profileTable = renderInstructionTable(profileRows);

  const noteBlock = `
    <div style="font-size:12px;line-height:1.6;margin-top:16px;">
      <p style="margin:8px 0;">
        <strong>Disclaimer Clause:</strong>
      </p>
      <p style="margin:8px 0;">
        This report (including any attachments) has been prepared based on verbal information provided by the person contacted. HERO HOUSING FINANCE LTD will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. <strong>M/s. KOWTHA &amp; CO</strong> will not be held liable in any case.
      </p>
    </div>
  `;

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content hero-housing-self">
      <p style="${paragraphStyle}"><strong>PD REPORT – SELF-EMPLOYED</strong></p>
      ${loanSummaryTable}
      <p style="${paragraphStyle}"><strong>Profile of customer</strong></p>
      ${profileTable}
      <p style="${paragraphStyle}"><strong>Income assessment details</strong></p>
      <p style="font-size:12px;">(Please provide the monthly net income of applicant and also mention comment/mode of validation under the column “Comments”)</p>
      ${incomeTable}
      ${noteBlock}
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};
