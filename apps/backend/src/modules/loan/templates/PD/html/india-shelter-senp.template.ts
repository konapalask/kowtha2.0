import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:18px 0";
const headerStyle =
  "background:#2e7d32;color:#fff;font-weight:700;text-transform:uppercase;font-size:14px;letter-spacing:0.6px;padding:10px;border:1px solid #ccc;text-align:center";
const subHeaderStyle =
  "background:#f7d8c7;color:#4a3426;font-weight:600;font-size:12px;padding:8px;border:1px solid #ccc;text-transform:uppercase";
const labelCellStyle =
  "background:#f4f6fb;font-weight:600;color:#1f2d3d;padding:8px;border:1px solid #d0d7de;vertical-align:top;width:26%";
const valueCellStyle =
  "padding:8px;border:1px solid #d0d7de;color:#2f3b52;vertical-align:top";

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

const ensureArray = <T,>(value: T | T[] | null | undefined): T[] => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
};

const renderKeyValueRow = (
  label: string,
  value: any,
  formatter?: (value: any) => string,
  options?: { colSpan?: number }
) => {
  const rendered = formatter ? formatter(value) : formatMultiline(value);
  return `
    <tr>
      <td style="${labelCellStyle}">${label}</td>
      <td style="${valueCellStyle}" colspan="${options?.colSpan || 1}">
        ${rendered}
      </td>
    </tr>
  `;
};

const renderBooleanGrid = (items: Array<{ label: string; value: any }>) => {
  const rows: string[] = [];
  for (let i = 0; i < items.length; i += 2) {
    const current = items[i];
    const next = items[i + 1];
    rows.push(`
      <tr>
        <td style="${labelCellStyle}">${current.label}</td>
        <td style="${valueCellStyle}">${formatMultiline(current.value)}</td>
        ${
          next
            ? `<td style="${labelCellStyle}">${next.label}</td><td style="${valueCellStyle}">${formatMultiline(
                next.value
              )}</td>`
            : `<td style="${labelCellStyle}"></td><td style="${valueCellStyle}"></td>`
        }
      </tr>
    `);
  }
  return rows.join("");
};

const renderSimpleList = (values: string[]) =>
  values.length
    ? `<ul style="margin:6px 0 6px 18px;padding:0;">${values
        .map(
          (entry) =>
            `<li style="margin-bottom:4px;color:#2f3b52;">${formatMultiline(
              entry
            )}</li>`
        )
        .join("")}</ul>`
    : "Not provided";

const renderArrayTable = (
  headers: string[],
  rows: string[][]
): string => {
  if (!rows.length) {
    return `<tr><td style="${valueCellStyle}" colspan="${headers.length}">Not provided</td></tr>`;
  }
  const headerRow = headers
    .map(
      (header) =>
        `<th style="background:#f4f6fb;border:1px solid #d0d7de;padding:8px;font-weight:600;color:#1f2d3d;">${header}</th>`
    )
    .join("");
  const body = rows
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
  return `<tr><td colspan="${headers.length}"><table style="width:100%;border-collapse:collapse;">${headerRow ? `<tr>${headerRow}</tr>` : ""}${body}</table></td></tr>`;
};

export const indiaShelterSenpTemplate = (
  verificationData: any,
  html_data: any
) => {
  const general = verificationData.generalInfo || {};
  const basic = verificationData.basicDetails || {};
  const residence = verificationData.residenceDetails || {};
  const checklist = verificationData.assetChecklist || {};
  const financialAssets = verificationData.financialAssets || {};
  const land = ensureArray(verificationData.landAssets?.plots);
  const houses = ensureArray(verificationData.houseAssets?.houses);
  const shops = ensureArray(verificationData.shopAssets?.shops);
  const vehicles = ensureArray(verificationData.vehicleAssets?.vehicles);
  const precious = ensureArray(verificationData.preciousMetals?.holdings);
  const livestock = ensureArray(verificationData.livestockAssets?.livestock);
  const business = verificationData.businessDetails || {};
  const businessIncome = verificationData.businessIncome || {};
  const otherMonthlyIncome = verificationData.otherMonthlyIncome || {};
  const loanPurpose = verificationData.loanPurpose || {};
  const collateral = verificationData.collateralDetails || {};
  const currentLoans = ensureArray(
    verificationData.currentLoanDetails?.currentLoans
  );
  const costFunds = verificationData.costAndFunds || {};
  const banking = ensureArray(
    verificationData.bankingDetails?.bankingAccounts
  );
  const otherFamilyMembers = ensureArray(
    verificationData.otherFamilyMembers?.familyMembers
  );
  const references = ensureArray(verificationData.references?.references);
  const tpcRefs = ensureArray(verificationData.tpcDetails?.businessReferences);
  const pdReview = verificationData.pdOfficerReview || {};

  const generalTable = `
    <table style="${tableStyle}">
      <tr><th style="${headerStyle}" colspan="4">PD SHEET - SENP</th></tr>
      ${renderKeyValueRow(
        "Loan Number",
        general.loanNumber,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Branch",
        general.branch,
        undefined,
        { colSpan: 3 }
      )}
    </table>
  `;

  const basicTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Basic Details</th></tr>
      ${renderKeyValueRow(
        "Name of the Person Met",
        basic.personMet,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Loan Product",
        basic.loanProduct,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Name of the Applicant",
        basic.applicantName,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Marital Status",
        basic.maritalStatus,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Educational Qualification",
        basic.educationalQualification,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Category",
        basic.category,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Total No. of Family Members",
        basic.totalFamilyMembers,
        undefined,
        { colSpan: 3 }
      )}
      <tr colspan="3">
      <td style="${labelCellStyle}">Number of Dependents</td>
        <td style="${valueCellStyle}">Children: ${formatMultiline(
          basic.dependentsChildren
        )}</td>
        <td style="${valueCellStyle}">Adults: ${formatMultiline(
          basic.dependentsAdults
        )}</td>
        <td style="${valueCellStyle}">Others: ${formatMultiline(
          basic.dependentsOthers
        )}</td>
      </tr>
    </table>
  `;

  const residenceTable = `
    <table style="${tableStyle}">
      <tr>
      <td style="${subHeaderStyle}" colspan="3">Residence Address & Details</td>
      ${renderKeyValueRow(
        "Residence Address",
        residence.residenceAddress,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "No. of Years at Current Residence",
        residence.yearsAtCurrentResidence,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Area (in Sq ft)",
        residence.areaSqft,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Monthly Rent & Security Deposit (if rented)",
        residence.monthlyRentDeposit,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Purchase price & MV (if owned)",
        residence.purchasePriceMv,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Number of Years in Current City",
        residence.yearsInCurrentCity,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Parents Staying with?",
        residence.parentsStayingWith,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Native Place",
        residence.nativePlace,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "If LAP—Electricity bill in customer name availability?",
        residence.electricityBillInCustomerName,
        undefined,
        { colSpan: 3 }
      )}
    </table>
  `;

  const assetChecklistRows = renderBooleanGrid([
    { label: "Smartphone", value: checklist.smartphone },
    { label: "Washing Machine", value: checklist.washingMachine },
    { label: "Car", value: checklist.car },
    { label: "Two Wheeler", value: checklist.twoWheeler },
    { label: "Computer / Laptop", value: checklist.computerLaptop },
    { label: "AC", value: checklist.ac },
    { label: "Fridge", value: checklist.fridge },
    { label: "Induction", value: checklist.induction },
  ]);

  const assetsTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Assets and Investment Details</th></tr>
      ${renderKeyValueRow(
        "Assets Owned (Summary)",
        checklist.assetsOwned,
        undefined,
        { colSpan: 3 }
      )}
      ${assetChecklistRows}
      <tr><th style="${subHeaderStyle}" colspan="4">Financial Assets</th></tr>
      ${renderKeyValueRow(
        "Fixed Deposits (amount/maturity)",
        financialAssets.fixedDeposits,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Mutual Funds (type/value)",
        financialAssets.mutualFunds,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Shares / Stocks (companies/value)",
        financialAssets.sharesStocks,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Insurance (type/sum assured)",
        financialAssets.insurance,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Other investments",
        financialAssets.otherInvestments,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Post Office savings monthly?</td>
        <td style="${valueCellStyle}">${formatMultiline(
          financialAssets.postOfficeSavings
        )}</td>
        <td style="${labelCellStyle}">Any Recurring Deposit?</td>
        <td style="${valueCellStyle}">${formatMultiline(
          financialAssets.recurringDeposit
        )}</td>
      </tr>
    </table>
  `;

  const landRows = land.map((plot: any) => [
    plot.totalArea,
    plot.location,
    plot.landType,
    formatCurrency(plot.marketValue),
  ]);

  const houseRows = houses.map((house: any) => [
    house.builtUpArea,
    house.location,
    house.occupancyStatus,
    formatCurrency(house.monthlyIncomeIfRented),
    formatCurrency(house.marketValue),
  ]);

  const shopRows = shops.map((shop: any) => [
    shop.area,
    shop.location,
    shop.occupancyStatus,
    formatCurrency(shop.monthlyIncomeIfRented),
    formatCurrency(shop.marketValue),
  ]);

  const vehicleRows = vehicles.map((vehicle: any) => [
    vehicle.makeModel,
    vehicle.purpose,
    formatCurrency(vehicle.marketValue),
  ]);

  const preciousRows = precious.map((item: any) => [
    item.totalQuantity,
    item.form,
    formatCurrency(item.marketValue),
  ]);

  const livestockRows = livestock.map((item: any) => [
    item.typeOfAnimals,
    item.quantity,
    item.purpose,
    formatCurrency(item.totalValue),
    formatCurrency(item.monthlyIncome),
    formatCurrency(item.maintenanceCosts),
  ]);

  const tangibleAssetsTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Land</th></tr>
      ${renderArrayTable(
        ["Total area of plot", "Location", "Type", "Market value"],
        landRows
      )}
      <tr><th style="${subHeaderStyle}" colspan="5">House</th></tr>
      ${renderArrayTable(
        [
          "Built-up area",
          "Location",
          "Occupancy Status",
          "Monthly income (if rented)",
          "Market value",
        ],
        houseRows
      )}
      <tr><th style="${subHeaderStyle}" colspan="5">Shop / Commercial Space</th></tr>
      ${renderArrayTable(
        [
          "Area",
          "Location",
          "Occupancy Status",
          "Monthly income (if rented)",
          "Market value",
        ],
        shopRows
      )}
      <tr><th style="${subHeaderStyle}" colspan="3">Vehicles (4-Wheelers)</th></tr>
      ${renderArrayTable(
        ["Make and model", "Purpose", "Market value"],
        vehicleRows
      )}
      <tr><th style="${subHeaderStyle}" colspan="3">Precious Metals - Gold & Jewellery</th></tr>
      ${renderArrayTable(
        ["Total quantity (grams)", "Form", "Market value"],
        preciousRows
      )}
      <tr><th style="${subHeaderStyle}" colspan="6">Livestock</th></tr>
      ${renderArrayTable(
        [
          "Types of animals",
          "Quantity of each type",
          "Purpose",
          "Total value",
          "Monthly income",
          "Maintenance costs",
        ],
        livestockRows
      )}
    </table>
  `;

  const businessTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Business Details</th></tr>
      <tr>
        <td style="${labelCellStyle}">Name of Current Business Firm</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.businessName
        )}</td>
        <td style="${labelCellStyle}">Type of Business Firm</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.businessFirmType
        )}</td>
      </tr>
      ${renderKeyValueRow(
        "If Partnership, % shareholding",
        business.shareholding,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Partners",
        renderSimpleList(ensureArray(business.partners)),
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Date of commencement of Business</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.commencementDate
        )}</td>
        <td style="${labelCellStyle}">Place of Incorporation (Address)</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.placeOfIncorporation
        )}</td>
      </tr>
      ${renderKeyValueRow(
        "Address of the PD",
        business.pdAddress,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Total Work Experience (Years)</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.totalWorkExperienceYears
        )}</td>
        <td style="${labelCellStyle}">Mobile No.</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.mobileNumber
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Nature of Business</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.natureOfBusiness
        )}</td>
        <td style="${labelCellStyle}">Type of Industry</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.industryType
        )}</td>
      </tr>
      ${renderKeyValueRow(
        "Business Profile",
        business.businessProfile,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Business Premises ownership</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.premisesOwnership
        )}</td>
        <td style="${labelCellStyle}">Stocks/Assets Seen in Business Premises</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.stocksAssetsSeen
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Locality of Business Premises</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.businessLocality
        )}</td>
        <td style="${labelCellStyle}">Annual Turnover</td>
        <td style="${valueCellStyle}">${formatCurrency(
          business.annualTurnover
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Net Profit Margin</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.netProfitMargin
        )}</td>
        <td style="${labelCellStyle}">Is Business seasonal?</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.businessSeasonal
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Number of Employees</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.numberOfEmployees
        )}</td>
        <td style="${labelCellStyle}">No. of Years Business Running in this Premises</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.yearsAtCurrentPremises
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">No. of Competitors in Nearby Market</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.competitorsNearby
        )}</td>
        <td style="${labelCellStyle}">Business started by</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.businessStartedBy
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Source of initial funds</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.initialFundingSource
        )}</td>
        <td style="${labelCellStyle}">Customer Location (Office / Business GEO Tag)</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.customerGeoTag
        )}</td>
      </tr>
    </table>
  `;

  const businessIncomeTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Business Income Computation</th></tr>
      <tr>
        <th style="${labelCellStyle};font-weight:bold;background:#f5f5f5;">Revenue</th>
        <th style="${valueCellStyle};font-weight:bold;background:#f5f5f5;">Amount (in Rs)</th>
        <th style="${labelCellStyle};font-weight:bold;background:#f5f5f5;">Expenditure</th>
        <th style="${valueCellStyle};font-weight:bold;background:#f5f5f5;">Amount (in Rs)</th>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Sales</td>
        <td style="${valueCellStyle}">${formatCurrency(businessIncome.sales)}</td>
        <td style="${labelCellStyle}">Purchases</td>
        <td style="${valueCellStyle}">${formatCurrency(
          businessIncome.purchases
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Receipts</td>
        <td style="${valueCellStyle}">${formatCurrency(
          businessIncome.receipts
        )}</td>
        <td style="${labelCellStyle}">Rent</td>
        <td style="${valueCellStyle}">${formatCurrency(businessIncome.rent)}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}"></td>
        <td style="${valueCellStyle}"></td>
        <td style="${labelCellStyle}">Electricity</td>
        <td style="${valueCellStyle}">${formatCurrency(
          businessIncome.electricity
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}"></td>
        <td style="${valueCellStyle}"></td>
        <td style="${labelCellStyle}">Transportation</td>
        <td style="${valueCellStyle}">${formatCurrency(
          businessIncome.transportation
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}"></td>
        <td style="${valueCellStyle}"></td>
        <td style="${labelCellStyle}">Other Expenses</td>
        <td style="${valueCellStyle}">${formatCurrency(businessIncome.otherExpenses)}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle};font-weight:bold;">Total Monthly Revenue (A)</td>
        <td style="${valueCellStyle};font-weight:bold;">${formatCurrency(
          businessIncome.totalMonthlyRevenue
        )}</td>
        <td style="${labelCellStyle};font-weight:bold;">Total Monthly Expenses (B)</td>
        <td style="${valueCellStyle};font-weight:bold;">${formatCurrency(
          businessIncome.totalMonthlyExpenses
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle};font-weight:bold;" colspan="1">Net Monthly Profit (= A - B)</td>
        <td style="${valueCellStyle};font-weight:bold;" colspan="3">${formatCurrency(businessIncome.netMonthlyProfit)}</td>
      </tr>
      ${renderKeyValueRow(
        "Other Monthly Income",
        otherMonthlyIncome.otherMonthlyIncome,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Rental Income - Cash</td>
        <td style="${valueCellStyle}">${formatCurrency(
          otherMonthlyIncome.rentalIncomeCash
        )}</td>
        <td style="${labelCellStyle}">Rental Income - Cheque</td>
        <td style="${valueCellStyle}">${formatCurrency(
          otherMonthlyIncome.rentalIncomeCheque
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Incentives / Perks - Cash</td>
        <td style="${valueCellStyle}">${formatCurrency(
          otherMonthlyIncome.incentivesCash
        )}</td>
        <td style="${labelCellStyle}">Incentives / Perks - Cheque</td>
        <td style="${valueCellStyle}">${formatCurrency(
          otherMonthlyIncome.incentivesCheque
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Monthly Bonus - Cash</td>
        <td style="${valueCellStyle}">${formatCurrency(
          otherMonthlyIncome.monthlyBonusCash
        )}</td>
        <td style="${labelCellStyle}">Monthly Bonus - Cheque</td>
        <td style="${valueCellStyle}">${formatCurrency(
          otherMonthlyIncome.monthlyBonusCheque
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Any Other Income - Cash</td>
        <td style="${valueCellStyle}">${formatCurrency(
          otherMonthlyIncome.otherIncomeCash
        )}</td>
        <td style="${labelCellStyle}">Any Other Income - Cheque</td>
        <td style="${valueCellStyle}">${formatCurrency(
          otherMonthlyIncome.otherIncomeCheque
        )}</td>
      </tr>
    </table>
  `;

  const otherIncomeTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Other Monthly Income</th></tr>
      
    </table>
  `;

  const loanPurposeTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Loan Details & Purpose</th></tr>
      ${renderKeyValueRow(
        "Purpose of Loan",
        renderSimpleList(loanPurpose.purposes),
        undefined,
        { colSpan: 3 }
      )}

      ${renderKeyValueRow(
        "Minimum Loan Amount Required",
        formatCurrency(loanPurpose.minimumLoanAmount),
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Tenure Required (years)",
        formatMultiline(loanPurpose.tenureRequired),
        undefined,
        { colSpan: 3 }
      )}

      ${renderKeyValueRow(
        "Monthly Household Expenses",
        formatCurrency(loanPurpose.monthlyHouseholdExpenses),
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Comfortable EMI",
        formatCurrency(loanPurpose.comfortableEmi),
        undefined,
        { colSpan: 3 }
      )}
    </table>
  `;

  const usageList = renderSimpleList(
    ensureArray(collateral.usageAfterPurchase)
  );

  const collateralTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Collateral Details</th></tr>
      <tr>
        <td style="${labelCellStyle}">Status of Property to be Purchased</td>
        <td style="${valueCellStyle}">${formatMultiline(
          collateral.propertyStatus
        )}</td>
        <td style="${labelCellStyle}">Usage of Property after Purchase</td>
        <td style="${valueCellStyle}">${usageList}</td>
      </tr>
      ${renderKeyValueRow(
        "If Others, specify usage",
        collateral.usageOtherNotes,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Property Address",
        collateral.propertyAddress,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Area (in Sq. ft.)</td>
        <td style="${valueCellStyle}">${formatMultiline(
          collateral.propertyArea
        )}</td>
        <td style="${labelCellStyle}">Ownership of the property from how many years?</td>
        <td style="${valueCellStyle}">${formatMultiline(
          collateral.ownershipDuration
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Agreement value</td>
        <td style="${valueCellStyle}">${formatCurrency(
          collateral.agreementValue
        )}</td>
        <td style="${labelCellStyle}">Own Contribution</td>
        <td style="${valueCellStyle}">${formatCurrency(
          collateral.ownContribution
        )}</td>
      </tr>
    </table>
  `;

  const currentLoansTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="6">Current Loan Details</th></tr>
      <tr>
        <td style="${labelCellStyle}">Bank / FI Name</td>
        <td style="${labelCellStyle}">Loan Type</td>
        <td style="${labelCellStyle}">Sanction Amount</td>
        <td style="${labelCellStyle}">EMI</td>
        <td style="${labelCellStyle}">No. of EMI Paid</td>
        <td style="${labelCellStyle}">Balance Tenor</td>
      </tr>
      ${
        currentLoans.length
          ? currentLoans
              .map(
                (loan: any) => `
          <tr>
            <td style="${valueCellStyle}">${formatMultiline(loan.bankName)}</td>
            <td style="${valueCellStyle}">${formatMultiline(loan.loanType)}</td>
            <td style="${valueCellStyle}">${formatCurrency(
              loan.sanctionAmount
            )}</td>
            <td style="${valueCellStyle}">${formatCurrency(loan.emi)}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              loan.emisPaid
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              loan.balanceTenor
            )}</td>
          </tr>
        `
              )
              .join("")
          : `<tr><td style="${valueCellStyle}" colspan="6">Not provided</td></tr>`
      }
    </table>
  `;

  const costFundsTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Cost and Funds Information</th></tr>
      <tr>
        <td style="${labelCellStyle}">Funds Required</td>
        <td style="${valueCellStyle}">${formatCurrency(
          costFunds.fundsRequired
        )}</td>
        <td style="${labelCellStyle}">Source of Own Funds (OCR)</td>
        <td style="${valueCellStyle}">${formatMultiline(
          costFunds.ownFundsSource
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Purchase Cost</td>
        <td style="${valueCellStyle}">${formatCurrency(
          costFunds.purchaseCost
        )}</td>
        <td style="${labelCellStyle}">Savings</td>
        <td style="${valueCellStyle}">${formatCurrency(costFunds.savings)}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Construction Estimate</td>
        <td style="${valueCellStyle}">${formatCurrency(
          costFunds.constructionEstimate
        )}</td>
        <td style="${labelCellStyle}">Total Transaction Cost</td>
        <td style="${valueCellStyle}">${formatCurrency(
          costFunds.totalTransactionCost
        )}</td>
      </tr>
    </table>
  `;

  const bankingTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="5">Banking Details</th></tr>
      <tr>
        <td style="${labelCellStyle}">Bank Name</td>
        <td style="${labelCellStyle}">Account Number</td>
        <td style="${labelCellStyle}">Branch</td>
        <td style="${labelCellStyle}">Account Type</td>
        <td style="${labelCellStyle}">Operation since (Years)</td>
      </tr>
      ${
        banking.length
          ? banking
              .map(
                (account: any) => `
          <tr>
            <td style="${valueCellStyle}">${formatMultiline(
              account.bankName
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              account.accountNumber
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(account.branch)}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              account.accountType
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              account.operatingSinceYears
            )}</td>
          </tr>
        `
              )
              .join("")
          : `<tr><td style="${valueCellStyle}" colspan="5">Not provided</td></tr>`
      }
    </table>
  `;

  const otherFamilyTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="7">Other Family Member Details</th></tr>
      <tr>
        <td style="${labelCellStyle}">Name</td>
        <td style="${labelCellStyle}">Relation with Applicant</td>
        <td style="${labelCellStyle}">Age (years)</td>
        <td style="${labelCellStyle}">Occupation (Job / Business)</td>
        <td style="${labelCellStyle}">Educational Qualification (Also mention if Govt. or Private institution)</td>
        <td style="${labelCellStyle}">Contact No.</td>
        <td style="${labelCellStyle}">Staying with Applicant (Yes/No)</td>
      </tr>
      ${
        otherFamilyMembers.length
          ? otherFamilyMembers
              .map(
                (member: any) => `
          <tr>
            <td style="${valueCellStyle}">${formatMultiline(member.name)}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              member.relationWithApplicant
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(member.age)}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              member.occupation
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              member.educationalQualification
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              member.contactNumber
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              member.stayingWithApplicant
            )}</td>
          </tr>
        `
              )
              .join("")
          : `<tr><td style="${valueCellStyle}" colspan="7">Not provided</td></tr>`
      }
    </table>
  `;

  const referencesTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="7">References (Business Parties)</th></tr>
      <tr>
        <td style="${labelCellStyle}">Name</td>
        <td style="${labelCellStyle}">Address</td>
        <td style="${labelCellStyle}">Relationship</td>
        <td style="${labelCellStyle}">Contact Number</td>
        <td style="${labelCellStyle}">Email</td>
        <td style="${labelCellStyle}">Years Known</td>
        <td style="${labelCellStyle}">Photo with Applicant</td>
      </tr>
      ${
        references.length
          ? references
              .map(
                (reference: any) => `
          <tr>
            <td style="${valueCellStyle}">${formatMultiline(
              reference.referenceName
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              reference.address
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              reference.relationship
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              reference.contactNumber
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              reference.email
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              reference.yearsKnown
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              reference.photoWithApplicant
            )}</td>
          </tr>
        `
              )
              .join("")
          : `<tr><td style="${valueCellStyle}" colspan="7">Not provided</td></tr>`
      }
    </table>
  `;

  const tpcTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="6">TPC (Third Party Check) Details</th></tr>
      <tr>
        <td style="${labelCellStyle}">Name</td>
        <td style="${labelCellStyle}">Address</td>
        <td style="${labelCellStyle}">Mobile NO.</td>
        <td style="${labelCellStyle}">Knowing Since (Months / Years)</td>
        <td style="${labelCellStyle}">Feedback</td>
      </tr>
      ${
        tpcRefs.length
          ? tpcRefs
              .map(
                (ref: any) => `
          <tr>
            <td style="${valueCellStyle}">${formatMultiline(ref.name)}</td>
            <td style="${valueCellStyle}">${formatMultiline(ref.address)}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              ref.mobileNumber
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              ref.knowingSince
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              ref.feedback
            )}</td>
          </tr>
        `
              )
              .join("")
          : `<tr><td style="${valueCellStyle}" colspan="4">Not provided</td></tr>`
      }
    </table>
  `;

  const pdReviewTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="5">To be filled by PD Officer</th></tr>
      <tr>
        <td style="${labelCellStyle}">Major Observations / Comments / Concerns During PD</td>
        <td style="${labelCellStyle}">Case Strengths</td>
        <td style="${valueCellStyle}">${formatMultiline(pdReview.caseStrengths)}</td>
        <td style="${labelCellStyle}">Case Weakness</td>
        <td style="${valueCellStyle}">${formatMultiline(pdReview.caseWeakness)}</td>
      </tr>
      ${renderKeyValueRow(
        "Name of PD Officer",
        pdReview.pdOfficerName,
        undefined,
        { colSpan: 5 }
      )}
      ${renderKeyValueRow(
        "Date of Visit",
        pdReview.visitDate,
        undefined,
        { colSpan: 5 }
      )}
      ${renderKeyValueRow(
        "Time of Visit",
        pdReview.visitTime,
        undefined,
        { colSpan: 5 }
      )}
      ${renderKeyValueRow(
        "Signature of the PD Officer",
        pdReview.officerSignature,
        undefined,
        { colSpan: 5 }
      )}
      ${renderKeyValueRow(
        "PD Status",
        pdReview.pdStatus,
        undefined,
        { colSpan: 5 }
      )}
    </table>
  `;

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content india-shelter-senp">
      ${generalTable}
      ${basicTable}
      ${residenceTable}
      ${assetsTable}
      ${tangibleAssetsTable}
      ${businessTable}
      ${businessIncomeTable}
      ${loanPurposeTable}
      ${collateralTable}
      ${currentLoansTable}
      ${costFundsTable}
      ${bankingTable}
      ${otherFamilyTable}
      ${referencesTable}
      ${tpcTable}
      ${pdReviewTable}
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};
