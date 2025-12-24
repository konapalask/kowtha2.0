import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:18px 0";
const headerStyle =
  "background:#2e7d32;color:#fff;font-weight:700;text-transform:uppercase;font-size:14px;letter-spacing:0.6px;padding:10px;border:1px solid #ccc;text-align:center";
const subHeaderStyle =
  "background:#f7d8c7;color:#4a3426;font-weight:600;font-size:12px;padding:8px;border:1px solid #ccc;text-transform:uppercase";
const labelCellStyle =
  "background:#f4f6fb;font-weight:600;color:#1f2d3d;padding:8px;border:1px solid #d0d7de;vertical-align:top;";
const valueCellStyle =
  "padding:8px;border:1px solid #d0d7de;color:#2f3b52;vertical-align:top;";

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

const ensureArray = <T>(value: T | T[] | null | undefined): T[] => {
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

const renderSimpleList = (values: string[] | undefined | null) => {
  if (!values || !Array.isArray(values) || values.length === 0) {
    return "Not provided";
  }
  return `<ul style="margin:6px 0 6px 18px;padding:0;">${values
    .map(
      (entry) =>
        `<li style="margin-bottom:4px;color:#2f3b52;">${formatMultiline(
          entry
        )}</li>`
    )
    .join("")}</ul>`;
};

const renderArrayTable = (
  headers: string[],
  rows: string[][] | undefined | null
): string => {
  if (!rows || !Array.isArray(rows) || !rows.length) {
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
  const livestock = verificationData.livestockAssets?.livestock || [];
  const business = verificationData.businessDetails || {};
  const businessIncome = verificationData.businessIncome || {};
  const otherMonthlyIncome = verificationData.otherMonthlyIncome || {};
  const loanPurpose = verificationData.loanPurpose || {};
  const collateral = verificationData.collateralDetails || {};
  const currentLoans = ensureArray(
    verificationData.currentLoanDetails?.currentLoans
  );
  const costFunds = verificationData.costAndFunds || {};
  const banking = ensureArray(verificationData.bankingDetails?.bankingAccounts);
  const otherFamilyMembers = ensureArray(
    verificationData.otherFamilyMembers?.familyMembers
  );
  const references = verificationData.references || [];
  const tpcRefs = verificationData.tpcDetails || [];
  const pdReview = verificationData.pdOfficerReview || {};

  const generalTable = `
    <table style="${tableStyle}">
      <tr><th style="${headerStyle}" colspan="4">PD SHEET - SENP</th></tr>
      ${renderKeyValueRow("Loan Number", general.loanNumber, undefined, {
        colSpan: 3,
      })}
      ${renderKeyValueRow("Branch", general.branch, undefined, { colSpan: 3 })}
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
      ${renderKeyValueRow("Loan Product", basic.loanProduct, undefined, {
        colSpan: 3,
      })}
      ${renderKeyValueRow(
        "Name of the Applicant",
        basic.applicantName,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow("Marital Status", basic.maritalStatus, undefined, {
        colSpan: 3,
      })}
      ${renderKeyValueRow(
        "Educational Qualification",
        basic.educationalQualification,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow("Category", basic.category, undefined, {
        colSpan: 3,
      })}
      ${renderKeyValueRow(
        "Total No. of Family Members",
        basic.totalFamilyMembers,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Number of Dependents</td>
        <td style="${valueCellStyle}">Children: ${
            basic.dependentsChildren || "Not provided"
          }</td>
        <td style="${valueCellStyle}">Adults: ${basic.dependentsAdults || "Not provided"}</td>
        <td style="${valueCellStyle}">Others: ${basic.dependentsOthers || "Not provided"}</td>
      </tr>
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
      ${renderKeyValueRow("Area (in Sq ft)", residence.areaSqft, undefined, {
        colSpan: 3,
      })}
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
      ${renderKeyValueRow("Native Place", residence.nativePlace, undefined, {
        colSpan: 3,
      })}
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

  const livestockRows = ensureArray(livestock).map((item: any) => [
    item.typeOfAnimals,
    item.quantity,
    item.purpose,
    formatCurrency(item.totalValue),
    formatCurrency(item.monthlyIncome),
    formatCurrency(item.maintenanceCosts),
  ]);


  const assetsTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Assets and Investment Details</th></tr>
      <tr>
        <td style="${labelCellStyle}">Assets Owned</td>
        <td style="border:1px solid #ccc;padding:8px" colspan="10">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Smartphone</td>
              <td style="${valueCellStyle}">${formatMultiline(checklist.smartphone)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Washing Machine</td>
              <td style="${valueCellStyle}">${formatMultiline(checklist.washingMachine)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Car</td>
              <td style="${valueCellStyle}">${formatMultiline(checklist.car)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Two Wheeler</td>
              <td style="${valueCellStyle}">${formatMultiline(checklist.twoWheeler)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Computer / Laptop</td>
              <td style="${valueCellStyle}">${formatMultiline(checklist.computerLaptop)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">AC</td>
              <td style="${valueCellStyle}">${formatMultiline(checklist.ac)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Fridge</td>
              <td style="${valueCellStyle}">${formatMultiline(checklist.fridge)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Induction</td>
              <td style="${valueCellStyle}">${formatMultiline(checklist.induction)}</td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td style="vertical-align:center;${labelCellStyle}">Financial Assets</td>
        <td style="vertical-align:center;${labelCellStyle}">Investments</td>
        <td style="border:1px solid #ccc;padding:8px" colspan="10">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Fixed Deposits (amount/maturity)</td>
              <td style="${valueCellStyle}">${formatMultiline(financialAssets.fixedDeposits)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Mutual Funds (type/value)</td>
              <td style="${valueCellStyle}">${formatMultiline(financialAssets.mutualFunds)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Shares / Stocks (companies/value)</td>
              <td style="${valueCellStyle}">${formatMultiline(financialAssets.sharesStocks)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Insurance (type/sum assured)</td>
              <td style="${valueCellStyle}">${formatMultiline(financialAssets.insurance)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Other investments?</td>
              <td style="${valueCellStyle}">${formatMultiline(financialAssets.otherInvestments)}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
          <td style="${labelCellStyle}">Is Post Office savings monthly?</td>
          <td style="${valueCellStyle}" colspan="2">${formatMultiline(financialAssets.postOfficeSavings)}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Any Recurring Deposit?</td>
          <td style="${valueCellStyle}" colspan="2">${formatMultiline(financialAssets.recurringDeposit)}</td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Land</td>
        <td style="border:1px solid #ccc;padding:8px" colspan="10">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Total area of plot</td>
              <td style="${valueCellStyle}">${landRows[0][0] || "Not provided"}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Location</td>
              <td style="${valueCellStyle}">${landRows[0][1] || "Not provided"}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Type</td>
              <td style="${valueCellStyle}">${landRows[0][2] || "Not provided"}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Market value</td>
              <td style="${valueCellStyle}">${landRows[0][3] || "Not provided"}</td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">House</td>
        <td style="border:1px solid #ccc;padding:8px" colspan="10">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Built-up area</td>
              <td style="${valueCellStyle}">${houseRows[0][0] || "Not provided"}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Location</td>
              <td style="${valueCellStyle}">${houseRows[0][1] || "Not provided"}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Self-occupied or rented:</td>
              <td style="${valueCellStyle}">${houseRows[0][2] || "Not provided"}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Monthly income (if rented)</td>
              <td style="${valueCellStyle}">${houseRows[0][3] || "Not provided"}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Market value</td>
              <td style="${valueCellStyle}">${houseRows[0][4] || "Not provided"}</td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Shop / Commercial Space</td>
        <td style="border:1px solid #ccc;padding:8px" colspan="10">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Area</td>
              <td style="${valueCellStyle}">${shopRows[0][0] || "Not provided"}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Location</td>
              <td style="${valueCellStyle}">${shopRows[0][1] || "Not provided"}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Self-occupied or rented:</td>
              <td style="${valueCellStyle}">${shopRows[0][2] || "Not provided"}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Monthly income (if rented)</td>
              <td style="${valueCellStyle}">${shopRows[0][3] || "Not provided"}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Market value</td>
              <td style="${valueCellStyle}">${shopRows[0][4] || "Not provided"}</td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Vehicle</td>
        <td style="${labelCellStyle}">4-Wheelers</td>
        <td style="border:1px solid #ccc;padding:8px" colspan="10">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Make and model</td>
              <td style="${valueCellStyle}">${vehicleRows[0][0] || "Not provided"}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Purpose</td>
              <td style="${valueCellStyle}">${vehicleRows[0][1] || "Not provided"}</td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Precious Metals</td>
        <td style="${labelCellStyle}">Gold & Jewellery</td>
        <td style="border:1px solid #ccc;padding:8px" colspan="10">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Total quantity (grams)</td>
              <td style="${valueCellStyle}">${preciousRows[0][0] || "Not provided"}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Form (jewellery/coins/bars)</td>
              <td style="${valueCellStyle}">${preciousRows[0][1] || "Not provided"}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Current market value</td>
              <td style="${valueCellStyle}">${preciousRows[0][2] || "Not provided"}</td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Livestock</td>
        <td style="${labelCellStyle}">Animals</td>
        <td style="border:1px solid #ccc;padding:8px" colspan="10">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Types of animals</td>
              <td style="${valueCellStyle}">${livestockRows[0][0] || "Not provided"}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Quantity of each type</td>
              <td style="${valueCellStyle}">${livestockRows[0][1] || "Not provided"}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Purpose</td>
              <td style="${valueCellStyle}">${livestockRows[0][2] || "Not provided"}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Total value</td>
              <td style="${valueCellStyle}">${livestockRows[0][3] || "Not provided"}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Monthly income</td>
              <td style="${valueCellStyle}">${livestockRows[0][4] || "Not provided"}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Maintenance costs</td>
              <td style="${valueCellStyle}">${livestockRows[0][5] || "Not provided"}</td>
            </tr>
          </table>
        </td>
      </tr>

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
      </tr>
      <tr>
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
     <tr>
      <td style="${labelCellStyle}">Name of the Partners</td>
      <td style="${valueCellStyle}">
        ${ensureArray(business.partners)
          .map((item: any) => item?.partnerName)
          .join("<br>")}
        </td>
     </tr>
      <tr>
        <td style="${labelCellStyle}">Date of commencement of Business</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.commencementDate
        )}</td>
        </tr>
        <tr>
        <td style="${labelCellStyle}">Place of Incorporation (Address)</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.placeOfIncorporation
        )}</td>
      </tr>
      ${renderKeyValueRow("Address of the PD", business.pdAddress, undefined, {
        colSpan: 3,
      })}
      <tr>
        <td style="${labelCellStyle}">Total Work Experience (Years)</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.totalWorkExperienceYears
        )}</td>
        </tr>
        <tr>
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
        </tr>
        <tr>
        <td style="${labelCellStyle}">Type of Industry</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.industryType
        )}</td>
      </tr>
      ${renderKeyValueRow(
        "Business Profile",
        business.businessProfile
          .split("\n")
          .map((line: string) => `<ul><li>${line}</li></ul>`)
          .join(""),
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Business Premises ownership</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.premisesOwnership
        )}</td>
        </tr>
        <tr>
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
        </tr>
        <tr>
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
        </tr>
        <tr>
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
        </tr>
        <tr>
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
        </tr>
        <tr>
        <td style="${labelCellStyle}">Business started by</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.businessStartedBy
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">If Self Started, source of initial funds</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.initialFundingSource
        )}</td>
        </tr>
        <tr>
        <td style="${labelCellStyle}">Customer Location (Office / Business GEO Tag)</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.customerGeoTag
        )}</td>
      </tr>
    </table>
  `;

  const businessIncomeTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Business Income Computation (Monthly Basis)</th></tr>
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
      <tr> 
        <td style="${labelCellStyle};font-weight:bold;" colspan="4">Other Monthly Income</td>
      </tr>
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
      ${renderKeyValueRow("Purpose of Loan", loanPurpose.purposes, undefined, {
        colSpan: 3,
      })}

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

  const collateralTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Collateral Details</th></tr>
      <tr>
        <td style="${labelCellStyle}">Status of Property to be Purchased</td>
        <td style="${valueCellStyle}">${formatMultiline(
          collateral.propertyStatus
        )}</td>
        </tr>
        <tr>
        <td style="${labelCellStyle}">Usage of Property after Purchase</td>
        <td style="${valueCellStyle}">${collateral.usageAfterPurchase === "Others" ? formatMultiline(collateral.usageOtherNotes) : collateral.usageAfterPurchase}</td>
      </tr>
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
        </tr>
        <tr>
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
        </tr>
        <tr>
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
            <td style="${valueCellStyle}">${formatMultiline(loan.emisPaid)}</td>
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
      </tr>
      ${ensureArray(references?.references)
        .map(
          (reference: any) => `
        <tr>
          <td style="${valueCellStyle}">${formatMultiline(reference.referenceName)}</td>
          <td style="${valueCellStyle}">${formatMultiline(reference.address)}</td>
          <td style="${valueCellStyle}">${formatMultiline(reference.relationship)}</td>
          <td style="${valueCellStyle}">${formatMultiline(reference.contactNumber)}</td>
          <td style="${valueCellStyle}">${formatMultiline(reference.email)}</td>
          <td style="${valueCellStyle}">${formatMultiline(reference.yearsKnown)}</td>
        </tr>
      `
        )
        .join("")}
    </table>
  `;

  const tpcTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="6">TPC (Third Party Check) Details</th></tr>
      <tr><td style="text-align:center;${labelCellStyle}" colspan="6">Business Reference</td></tr>
      <tr>
        <td style="${labelCellStyle}">Name</td>
        <td style="${labelCellStyle}">Address</td>
        <td style="${labelCellStyle}">Mobile NO.</td>
        <td style="${labelCellStyle}">Knowing Since (Months / Years)</td>
        <td style="${labelCellStyle}">Feedback</td>
      </tr>
      ${ensureArray(tpcRefs?.businessReferences)
        .map(
          (reference: any) => `
        <tr>
          <td style="${valueCellStyle}">${formatMultiline(reference.name)}</td>
          <td style="${valueCellStyle}">${formatMultiline(reference.address)}</td>
          <td style="${valueCellStyle}">${formatMultiline(reference.mobileNumber)}</td>
          <td style="${valueCellStyle}">${formatMultiline(reference.knowingSince)}</td>
          <td style="${valueCellStyle}">${formatMultiline(reference.feedback)}</td>
        </tr>
      `
        )
        .join("")}
    </table>
  `;

  const pdReviewTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="5">To be filled by PD Officer</th></tr>
      <tr>
        <td style="${labelCellStyle}">Major Observations / Comments / Concerns During PD</td>
         <td style="border:1px solid #ccc;padding:8px" colspan="10">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Case Strengths</td>
              <td style="${valueCellStyle}">${(pdReview.caseStrengths.split("\n").map((line: string) => `<ul><li>${line}</li></ul>`).join(""))}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Case Weakness</td>
              <td style="${valueCellStyle}">${(pdReview.caseWeakness.split("\n").map((line: string) => `<ul><li>${line}</li></ul>`).join(""))}</td>
            </tr>
          </table>
        </td>
      </tr>
      ${renderKeyValueRow(
        "Name of PD Officer",
        html_data.fieldExecutive || "Not provided",
        undefined,
        { colSpan: 5 }
      )}
      ${renderKeyValueRow("Date of Visit", pdReview.visitDate, undefined, {
        colSpan: 5,
      })}
      ${renderKeyValueRow("Time of Visit", pdReview.visitTime, undefined, {
        colSpan: 5,
      })}
      <tr>
        <td style="${labelCellStyle}">Signature of the PD Officer</td>
        <td style="${valueCellStyle}" colspan="5"></td>
      </tr>
      ${renderKeyValueRow(
        "PD Status",
        html_data.approvedStatus || "Not provided",
        undefined,
        {
          colSpan: 5,
        }
      )}
    </table>
  `;
  const disclaimerTable = `
    <p style="margin:24px 0 8px;font-size:14px;"><strong><u>Disclaimer Clause</u></strong> </p>
    <p style="margin:0 0 24px;color:#333;font-size:12px;">
      This report (including any attachments) has been prepared based on verbal information provided by the person contacted. INDIA SHELTER FINANCE CORPORATION LTD will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. M/s. KOWTHA & CO will not be held liable in any case.
    </p>
  `;

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content india-shelter-senp">
      ${generalTable}
      ${basicTable}
      ${assetsTable}
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
      ${disclaimerTable}
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};
