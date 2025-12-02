import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

export const arkaFincapTemplate = (verificationData: any, html_data: any) => {
  // Extract sections using constants
  const applicantDetails = verificationData.applicantDetails || {};
  const familyMembers = verificationData.familyMembers || {};
  const bankingDetails = verificationData.bankingDetails || {};
  const licMutualFunds = verificationData.licMutualFunds || {};
  const assets = verificationData.assets || {};
  const existingLoans = verificationData.existingLoans || {};
  const aboutTheBusiness = verificationData.aboutTheBusiness || {};
  const regularCustomers = verificationData.regularCustomers || {};
  const regularSuppliers = verificationData.regularSuppliers || {};
  const businessActivityObserved = verificationData.businessActivityObserved || {};
  const documentsObserved = verificationData.documentsObserved || {};
  const gstRegistration = verificationData.gstRegistration || {};
  const itrDetails = verificationData.itrDetails || {};
  const monthlyGrossReceipts = verificationData.monthlyGrossReceipts || {};
  const monthlyExpenses = verificationData.monthlyExpenses || {};
  const netProfit = verificationData.netProfit || {};
  const netMargin = verificationData.netMargin || {};
  const familyExpenses = verificationData.familyExpenses || {};
  const employees = verificationData.employees || {};
  const concerns = verificationData.concerns || {};
  const otherObservations = verificationData.otherObservations?.otherObservations || [];
  const otherIncomes = verificationData.otherIncomes || []; 
  const neighborCheck = verificationData.neighborCheck || {};
  const status = verificationData.status || {};

  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  // Helper function to format currency
  const formatCurrency = (amount: number | string | null | undefined) => {
    if (amount === null || amount === undefined || amount === "") return "";
    const numericAmount =
      typeof amount === "string"
        ? Number(
            amount
              .toString()
              .replace(/[^0-9.-]/g, "")
              .replace(/(\..*)\./g, "$1")
          )
        : amount;

    if (Number.isNaN(numericAmount)) {
      return typeof amount === "string" ? amount : "";
    }

    return `Rs. ${numericAmount.toLocaleString("en-IN")}/-`;
  };


  const ensureArray = <T>(value: T | T[] | undefined | null): T[] => {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined) return [];
    return [value];
  };

  const renderAssetsTable = () => {
    const assetsSource = Array.isArray(assets.assets)
      ? assets.assets
      : Array.isArray(assets)
        ? assets
        : [];

    if (!assetsSource.length) {
      return `<div style="font-size:12px;color:#666;">No asset details provided</div>`;
    }

    const header = `
      <tr style="background-color:#f5f5f5;">
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Description</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Area</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Market Value</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Asset Holder</th>
      </tr>
    `;

    const rows = assetsSource
      .map(
        (asset: any) => `
          <tr>
            <td style="border:1px solid #ccc;padding:6px;">${getValue(
              asset.description,
              asset.assetDescription
            )}</td>
            <td style="border:1px solid #ccc;padding:6px;">${getValue(
              asset.area,
              asset.areaMeasured
            )}</td>
            <td style="border:1px solid #ccc;padding:6px;">${formatCurrency(
              asset.marketValue
            )}</td>
            <td style="border:1px solid #ccc;padding:6px;">${getValue(
              asset.nameOfAssetHolder,
              asset.ownerName
            )}</td>
          </tr>
        `
      )
      .join("");

    return `
      <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead>${header}</thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  };

  const renderBusinessNarrative = () => {
    const businessSection = aboutTheBusiness;

    if (typeof businessSection === "string" && businessSection.trim().length) {
      return `<div>${businessSection}</div>`;
    }

    if (
      businessSection &&
      typeof businessSection.businessSummary === "string" &&
      businessSection.businessSummary.trim().length
    ) {
      return `<div>${businessSection.businessSummary}</div>`;
    }

    if (
      businessSection &&
      typeof businessSection.summary === "string" &&
      businessSection.summary.trim().length
    ) {
      return `<div>${businessSection.summary}</div>`;
    }

    if (
      businessSection &&
      typeof businessSection.details === "string" &&
      businessSection.details.trim().length
    ) {
      return `<div>${businessSection.details}</div>`;
    }

    if (
      businessSection &&
      Array.isArray(businessSection.details) &&
      businessSection.details.length
    ) {
      return `<ul>${businessSection.details
        .map((detail: any) => `<li>${detail}</li>`)
        .join("")}</ul>`;
    }

    if (Array.isArray(businessSection) && businessSection.length) {
      return `<ul>${businessSection
        .map((detail: any) => `<li>${detail}</li>`)
        .join("")}</ul>`;
    }

    return `<div style="font-size:12px;color:#666;">Not Provided</div>`;
  };

  const renderStakeholderTable = (
    entries: any[],
    columnLabels: { key: string; label: string }[],
    emptyMessage: string
  ) => {
    if (!Array.isArray(entries) || entries.length === 0) {
      return `<div style="font-size:12px;color:#666;">${emptyMessage}</div>`;
    }

    const headerRow = columnLabels
      .map(
        (column) =>
          `<th style="border:1px solid #ccc;padding:6px;text-align:left;background-color:#f5f5f5;">${column.label}</th>`
      )
      .join("");

    const rows = entries
      .map((entry: any) => {
        const columns = columnLabels
          .map((column) => {
            if (column.key === "contactNumber") {
              return `<td style="border:1px solid #ccc;padding:6px;">${getValue(
                entry[column.key],
                entry.phone
              )}</td>`;
            }
            return `<td style="border:1px solid #ccc;padding:6px;">${getValue(
              entry[column.key]
            )}</td>`;
          })
          .join("");
        return `<tr>${columns}</tr>`;
      })
      .join("");

    return `
      <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead><tr>${headerRow}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  };

  const formatCommaSeparatedList = (...values: any[]) => {
    const text = getValue(...values);
    if (!text) return "";
    return text
      .split(/[,;]/)
      .map((entry: string) => entry.trim())
      .filter(Boolean)
      .join(", ");
  };

  const formatBooleanDisplay = (...values: any[]) => {
    const raw = getValue(...values);
    if (raw === "") return "Not Provided";
    if (typeof raw === "boolean") {
      return raw ? "Yes" : "No";
    }
    const normalized = raw.toLowerCase();
    if (["yes", "true", "y", "1"].includes(normalized)) return "Yes";
    if (["no", "false", "n", "0"].includes(normalized)) return "No";
    return raw;
  };

  const renderNeighborTable = () => {
    const neighbors = neighborCheck?.neighbors || [];
    if (Array.isArray(neighbors)) {
      const rows = neighbors
        .map(
          (entry: any) => `
          <tr>
            <td style="border:1px solid #ccc;padding:6px;">${
              getValue(entry?.name) || "Not Provided"
            }</td>
            <td style="border:1px solid #ccc;padding:6px;">${
              getValue(entry?.feedback) || "Not Provided"
            }</td>
          </tr>
        `
        )
        .join("");

      return `
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <thead>
            <tr style="background-color:#f5f5f5;">
              <th style="border:1px solid #ccc;padding:6px;text-align:left;">Neighbor Name</th>
              <th style="border:1px solid #ccc;padding:6px;text-align:left;">Feedback</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }

    const fallback = getValue(neighborCheck.neighborCheck, neighborCheck);
    return fallback
      ? `<div>${fallback}</div>`
      : '<div style="font-size:12px;color:#666;">Not Provided</div>';
  };

  const renderConcernsSummary = () => {
    const summary = getValue(concerns.concernsSummary);
    return summary
      ? summary.split("\n").map((line: string) => `<li style="margin-left:8px;line-height:1.5">${line}</li>`).join("")
       : '<div>Not Provided</div>';
  };

  const getValue = (...candidates: any[]) => {
    for (const candidate of candidates) {
      if (candidate === null || candidate === undefined) continue;
      const text = String(candidate).trim();
      if (text.length) return text;
    }
    return "";
  };

  const loanDetails =
    html_data?.loanDetails ||
    html_data?.loan ||
    (html_data?.applicationNumber
      ? { applicationNumber: html_data.applicationNumber }
      : {});

  const applicationNumber = getValue(
    loanDetails?.applicationNumber,
    applicantDetails.applicationNo,
    verificationData.applicationNo,
    verificationData.basicInformation?.applicationId
  );

  const applicantName = getValue(
    loanDetails?.applicantName,
    applicantDetails.nameOfApplicant,
    verificationData.nameOfApplicant
  );

  const coApplicantName = getValue(
    applicantDetails.nameOfCoApplicant,
    verificationData.nameOfCoApplicant
  );

  const applicantMobile = getValue(
    loanDetails?.applicantMobile,
    applicantDetails.applicantPhoneNumber,
    verificationData.phoneNumber
  );

  const nameOfConcern = getValue(
    applicantDetails.nameOfConcern,
    verificationData.businessDetails?.businessName,
    verificationData.businessFinancialProfile?.businessName,
    loanDetails?.businessName
  );

  const initiatedPremises = getValue(
    loanDetails?.applicantAddress,
    applicantDetails.initiatedPremises,
    verificationData.initiatedPremises
  );

  const visitedPremises = getValue(
    applicantDetails.visitedPremises,
    verificationData.visitedPremises
  );

  const residentialPremises = getValue(
    applicantDetails.residentialPremises,
    verificationData.residentialPremises
  );

  const appointmentFixedRaw = getValue(
    applicantDetails.appointmentFixed,
    verificationData.appointmentFixed
  );

  const formatTimeValue = (value: string) => {
    if (!value) return "";
    const numericTimeMatch = value.match(/^(\d{1,2}:\d{2})(:\d{2})?$/);
    if (numericTimeMatch) {
      return numericTimeMatch[1];
    }
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return value;
  };

  const appointmentFixed = applicantDetails?.appointmentFixed;

  const dateOfVisit = getValue(
    applicantDetails.dateOfVisit,
    verificationData.dateOfVisit
  );

  const familySection = verificationData.familyDetails || familyMembers || {};

  const familyMembersList = Array.isArray(familySection.familyMembers)
    ? familySection.familyMembers
    : Array.isArray(familyMembers.familyMembers)
      ? familyMembers.familyMembers
      : [];

  const nonEarningKeywords = [
    "student",
    "dependent",
    "unemployed",
    "home",
    "house",
    "homemaker",
    "housewife",
    "house wife",
    "home maker",
  ];

  const computedTotalFamilyMembers =
    familySection.totalFamilyMembers ??
    familyMembers.totalFamilyMembers ??
    (familyMembersList.length ? familyMembersList.length : "");

  const computedEarningMembers =
    familySection.earningMembers ??
    familyMembers.earningMembers ??
    (familyMembersList.length
      ? familyMembersList.filter((member: any) => {
          const occupation = getValue(
            member.occupation,
            member.employmentType,
            member.workType
          ).toLowerCase();

          if (!occupation) {
            return false;
          }

          return !nonEarningKeywords.some((keyword) =>
            occupation.includes(keyword)
          );
        }).length
      : "");

  const combinedAmountPurpose = (() => {
    const parts: string[] = [];
    const loanAmountDisplay = formatCurrency(
      loanDetails?.loanAmount ||
        applicantDetails.loanAmount ||
        verificationData.loanAmount
    );
    if (loanAmountDisplay) {
      parts.push(`Loan Amount: ${loanAmountDisplay}`);
    }
    const purpose = getValue(
      applicantDetails.purposeOfLoan,
      verificationData.purposeOfLoan,
      loanDetails?.purposeOfLoan
    );
    if (purpose) {
      parts.push(`Purpose: ${purpose}`);
    }
    return parts.join(" | ") || purpose || loanAmountDisplay || "";
  })();

  const typeOfCollateralDisplay = (() => {
    const type = getValue(
      applicantDetails.typeOfCollateral,
      verificationData.typeOfCollateral
    );
    const valueDisplay = formatCurrency(
      applicantDetails.marketValueOfCollateral ||
        verificationData.marketValueOfCollateral
    );
    if (type && valueDisplay) {
      return `${type} (Value: ${valueDisplay})`;
    }
    return type || valueDisplay || "";
  })();

  const collateralPropertyAddress = getValue(
    applicantDetails.collateralPropertyAddress,
    verificationData.collateralPropertyAddress
  );

  const aboutApplicantText = getValue(
    applicantDetails.aboutTheApplicant,
    verificationData.aboutTheApplicant
  );

  const renderFamilyMembers = () => {
    const header = `
      <tr style="background-color:#f5f5f5;">
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Name</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Relationship</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Age</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Education</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Occupation</th>
      </tr>
    `;

    const rows = familyMembersList.length
      ? familyMembersList
          .map(
            (member: any) => `
              <tr>
                <td style="border:1px solid #ccc;padding:6px;">${
                  getValue(member.name, member.personMet) || "Not Provided"
                }</td>
                <td style="border:1px solid #ccc;padding:6px;">${
                  getValue(
                    member.relationship,
                    member.relation,
                    member.relationshipToApplicant
                  ) || "Not Provided"
                }</td>
                <td style="border:1px solid #ccc;padding:6px;">${
                  getValue(
                    member.age ? `${member.age} years` : "",
                    member.ageYears ? `${member.ageYears} years` : ""
                  ) || "Not Provided"
                }</td>
                <td style="border:1px solid #ccc;padding:6px;">${
                  getValue(member.education, member.educationalQualification) ||
                  "Not Provided"
                }</td>
                <td style="border:1px solid #ccc;padding:6px;">${
                  getValue(
                    member.occupation,
                    member.employmentType,
                    member.workType
                  ) || "Not Provided"
                }</td>
              </tr>
            `
          )
          .join("")
      : `<tr><td colspan="5" style="border:1px solid #ccc;padding:6px;text-align:center;">No family member information provided</td></tr>`;

    return `
      <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead>${header}</thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  };

  const renderBankingDetails = () => {
    const bankingDetailsArray = bankingDetails.bankingDetails || [];

    const header = `
      <tr style="background-color:#f5f5f5;">
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Bank Name</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Account Type</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Avg Balance</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Years Maintained</th>
      </tr>
    `;

    const rows = bankingDetailsArray.length
      ? bankingDetailsArray
          .map(
            (bank: any) => `
              <tr>
                <td style="border:1px solid #ccc;padding:6px;">${
                  getValue(bank.bankName) || "Not Provided"
                }</td>
                <td style="border:1px solid #ccc;padding:6px;">${
                  getValue(bank.accountType) || "Not Provided"
                }</td>
                <td style="border:1px solid #ccc;padding:6px;">${
                  formatCurrency(bank.avgBalance) || "Not Provided"
                }</td>
                <td style="border:1px solid #ccc;padding:6px;">${
                  bank.noOfYearsMaintained
                    ? `${bank.noOfYearsMaintained} years`
                    : "Not Provided"
                }</td>
              </tr>
            `
          )
          .join("")
      : `<tr><td colspan="4" style="border:1px solid #ccc;padding:6px;text-align:center;">No banking details provided</td></tr>`;

    return `
      <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead>${header}</thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  };

  const renderExistingLoans = () => {
    const loans =
      verificationData.existingLoanDetails?.loans ||
      existingLoans.loans ||
      existingLoans ||
      [];

    const header = `
      <tr style="background-color:#f5f5f5;">
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">BANK</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">TYPE</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">LOAN</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">EMI</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">OPEN/CLOSE</th>
      </tr>
    `;

    const rows = loans.length
      ? loans
          .map(
            (loan: any) => `
              <tr>
                <td style="border:1px solid #ccc;padding:6px;">${
                  getValue(loan.bank, loan.bankName) || "Not Provided"
                }</td>
                <td style="border:1px solid #ccc;padding:6px;">${
                  getValue(loan.type, loan.loanType) || "Not Provided"
                }</td>
                <td style="border:1px solid #ccc;padding:6px;">${
                  formatCurrency(loan.loanAmount || loan.amount) ||
                  "Not Provided"
                }</td>
                <td style="border:1px solid #ccc;padding:6px;">${
                  formatCurrency(loan.emi || loan.installment) || "Not Provided"
                }</td>
                <td style="border:1px solid #ccc;padding:6px;">${
                  loan.status || "Not Provided"
                }</td>
              </tr>
            `
          )
          .join("")
      : `<tr><td colspan="5" style="border:1px solid #ccc;padding:6px;text-align:center;">No loan details provided</td></tr>`;

    return `
      <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead>${header}</thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  };

  return `
    ${pdBaseTemplate()}

    <div class="template-content">
        <p style="margin:8px 0;line-height:1.5"><strong><em></em></strong></p>
        
        <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Application No</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${applicantDetails?.applicationNo}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of Applicant</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${applicantDetails?.nameOfApplicant}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of Co-Applicant</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${applicantDetails?.nameOfCoApplicant}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Phone Number</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${applicantDetails?.applicantPhoneNumber}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of Concern</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${nameOfConcern}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Initiated Premises</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${initiatedPremises}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Visited Premises</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${visitedPremises}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Residential Premises</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${residentialPremises}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Appointment Fixed</strong></p></td>
                <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${appointmentFixed}</p></td>
                <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Date of Visit</strong>: ${applicantDetails?.dateOfVisit || istDate.split(" ")[0]}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Person Met</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${applicantDetails?.personMet}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Amount and Purpose of Loan</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Amount:</strong> ${formatCurrency(applicantDetails?.loanAmount)} <br> <strong>Purpose:</strong> ${applicantDetails?.purposeOfLoan || "Not Provided"}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Type of collateral</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${typeOfCollateralDisplay || getValue(verificationData.collateralArea)}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Collateral Property Address</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${collateralPropertyAddress}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>About the Applicant</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${
                  applicantDetails?.aboutTheApplicant?.split("\n").map((line: string) => `<ul><li>${line}</li></ul>`).join("") || "Not Provided"}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px;vertical-align:top;width:25%"><p style="margin:8px 0;line-height:1.5"><strong>Family Details</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px">${renderFamilyMembers()}</td>
            </tr>
        </table>
        
        <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
            <tr>
                <td style="border:1px solid #ccc;padding:8px;vertical-align:top"><p style="margin:8px 0;line-height:1.5"><strong>Banking Details</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px">${renderBankingDetails()}</td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px;vertical-align:top"><p style="margin:8px 0;line-height:1.5"><strong>LIC/Mutual funds</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${getValue(licMutualFunds.licMutualFunds) || ""}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px;vertical-align:top"><p style="margin:8px 0;line-height:1.5"><strong>Assets</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px;margin-bottom: 20px;">${renderAssetsTable()}</td>
            </tr>
        </table>
        
        <div style="margin-bottom: 40px;"></div>
        
        <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
            <tr>
                <td style="border:1px solid #ccc;padding:8px;vertical-align:top"><p style="margin:8px 0;line-height:1.5"><strong>No. of Loans</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px">${renderExistingLoans()}</td>
            </tr>
        </table>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
            <tr>
                <td style="border:1px solid #ccc;padding:8px;vertical-align:top"><p style="margin:8px 0;line-height:1.5"><strong>About the Business</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px">
                    ${aboutTheBusiness?.businessSummary?.split("\n").map((line: string) => `<ul><li>${line}</li></ul>`).join("") || "Not Provided"}
                </td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name and Contact number of Regular Customers</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px">${renderStakeholderTable(
                  regularCustomers.customers || [],
                  [
                    { key: "name", label: "Customer Name" },
                    { key: "contactNumber", label: "Contact Number" },
                  ],
                  "No regular customers captured"
                )}</td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name and Contact number of Regular Suppliers</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px">${renderStakeholderTable(
                  regularSuppliers.suppliers || [],
                  [
                    { key: "name", label: "Supplier Name" },
                    { key: "contactNumber", label: "Contact Number" },
                  ],
                  "No regular suppliers captured"
                )}</td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Business Activity and stock level observed at the time of visit</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${
                  getValue(
                    businessActivityObserved.businessActivityAndStockLevelObserved
                  ) || ""
                }</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Documents Observed</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCommaSeparatedList(
                  documentsObserved.documentsObserved
                )}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Whether Business Registered under GST?</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${
                  gstRegistration?.gstRegistered}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>As per Audited individual ITR's</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${getValue(
                  itrDetails.itrFiled
                )}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Monthly Gross Receipts</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(
                  monthlyGrossReceipts.monthlyGrossReceipts
                )}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Monthly Expenses</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(
                  monthlyExpenses.monthlyExpenses
                )}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Net Profit</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(
                  netProfit.netProfit
                )}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Net Margin</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${getValue(
                  netMargin.netMargin
                )}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Family Expenses</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${getValue(
                  familyExpenses.familyExpenses
                )}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Employees</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${getValue(
                  employees.numberOfEmployees
                )}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Concerns</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px">${renderConcernsSummary()}</td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Other observations</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px">
                ${ensureArray(otherObservations).map(
                  (item: any) => `<li style="margin-left:8px;line-height:1.5">${ item?.observation || ""}</li>`
                ).join("<br>")}
                </td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Other Incomes</strong></p></td>
                <td colspan="8" style="border:1px solid #ccc;padding:8px">
                ${ensureArray(otherIncomes.otherIncomes).map((income: any) => `<li style="margin-left:8px;line-height:1.5">${income?.otherIncome || ""}</li>`).join("<br>")}
                </td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Neighbor Check</strong></p></td>
                <td colspan="8" style="border:1px solid #ccc;padding:8px">${renderNeighborTable()}</td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Status</strong></p></td>
                <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>${html_data.approvedStatus|| "Not provided"}</strong></p></td>
            </tr>
            </table>
        
        <div style="margin-bottom: 40px; margin-top: 20px;"></div>
            
        <p style="margin:8px 0;line-height:1.5"><strong>Disclaimer Clause:</strong></p>
        <p style="margin:8px 0;line-height:1.5">This report (including any attachments) has been prepared based on verbal information provided by the person contacted. ARKA FINCAP LIMITED will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. <strong>M/s. KOWTHA & CO</strong> will not be held liable in any case.</p>
     ${pdBaseTemplateFooter(html_data)}
  `;
};
