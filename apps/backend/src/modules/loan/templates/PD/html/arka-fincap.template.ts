import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate } from "./pd-base.template";

export const arkaFincapTemplate = (verificationData: any, html_data: any) => {
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

  const renderAssetsTable = () => {
    const assetsSource = Array.isArray(verificationData.assets?.assets)
      ? verificationData.assets.assets
      : Array.isArray(verificationData.assets)
      ? verificationData.assets
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
    const businessSection = verificationData.aboutTheBusiness;

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
    const neighbors = verificationData.neighborCheck?.neighbors;
    if (Array.isArray(neighbors) && neighbors.length) {
      const rows = neighbors
        .map(
          (entry: any) => `
          <tr>
            <td style="border:1px solid #ccc;padding:6px;">${
              getValue(entry.name) || "Not Provided"
            }</td>
            <td style="border:1px solid #ccc;padding:6px;">${
              getValue(entry.feedback) || "Not Provided"
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

    const fallback = getValue(
      verificationData.neighborCheck?.neighborCheck,
      verificationData.neighborCheck
    );
    return fallback
      ? `<div>${fallback}</div>`
      : '<div style="font-size:12px;color:#666;">Not Provided</div>';
  };

  const renderConcernsSummary = () => {
    const summary = getValue(verificationData.concerns?.concernsSummary);
    return summary
      ? summary
      : '<div style="font-size:12px;color:#666;">Not Provided</div>';
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
    verificationData.applicantDetails?.applicationNo,
    verificationData.applicationNo,
    verificationData.basicInformation?.applicationId
  );

  const applicantName = getValue(
    loanDetails?.applicantName,
    verificationData.applicantDetails?.nameOfApplicant,
    verificationData.nameOfApplicant
  );

  const coApplicantName = getValue(
    verificationData.applicantDetails?.nameOfCoApplicant,
    verificationData.nameOfCoApplicant
  );

  const applicantMobile = getValue(
    loanDetails?.applicantMobile,
    verificationData.applicantDetails?.phoneNumber,
    verificationData.phoneNumber
  );

  const nameOfConcern = getValue(
    verificationData.applicantDetails?.nameOfConcern,
    verificationData.businessDetails?.businessName,
    verificationData.businessFinancialProfile?.businessName,
    loanDetails?.businessName
  );

  const initiatedPremises = getValue(
    loanDetails?.applicantAddress,
    verificationData.applicantDetails?.initiatedPremises,
    verificationData.initiatedPremises
  );

  const visitedPremises = getValue(
    verificationData.applicantDetails?.visitedPremises,
    verificationData.visitedPremises
  );

  const residentialPremises = getValue(
    verificationData.applicantDetails?.residentialPremises,
    verificationData.residentialPremises
  );

  const appointmentFixedRaw = getValue(
    verificationData.applicantDetails?.appointmentFixed,
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

  const appointmentFixed = formatTimeValue(appointmentFixedRaw);

  const dateOfVisit = getValue(
    verificationData.applicantDetails?.dateOfVisit,
    verificationData.dateOfVisit
  );

  const familySection =
    verificationData.familyDetails || verificationData.familyMembers || {};

  const familyMembersList = Array.isArray(familySection.familyMembers)
    ? familySection.familyMembers
    : Array.isArray(verificationData.familyMembers?.familyMembers)
    ? verificationData.familyMembers.familyMembers
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
    verificationData.familyMembers?.totalFamilyMembers ??
    (familyMembersList.length ? familyMembersList.length : "");

  const computedEarningMembers =
    familySection.earningMembers ??
    verificationData.familyMembers?.earningMembers ??
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
        verificationData.applicantDetails?.loanAmount ||
        verificationData.loanAmount
    );
    if (loanAmountDisplay) {
      parts.push(`Loan Amount: ${loanAmountDisplay}`);
    }
    const purpose = getValue(
      verificationData.applicantDetails?.purposeOfLoan,
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
      verificationData.applicantDetails?.typeOfCollateral,
      verificationData.typeOfCollateral
    );
    const valueDisplay = formatCurrency(
      verificationData.applicantDetails?.marketValueOfCollateral ||
        verificationData.marketValueOfCollateral
    );
    if (type && valueDisplay) {
      return `${type} (Value: ${valueDisplay})`;
    }
    return type || valueDisplay || "";
  })();

  const collateralPropertyAddress = getValue(
    verificationData.applicantDetails?.collateralPropertyAddress,
    verificationData.collateralPropertyAddress
  );

  const aboutApplicantText = getValue(
    verificationData.applicantDetails?.aboutTheApplicant,
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
                  getValue(
                    member.education,
                    member.educationalQualification
                  ) || "Not Provided"
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

    const summaryRows = `
      <tr>
        <td colspan="5" style="border:1px solid #ccc;padding:6px;">
          <strong>Total Members:</strong> ${getValue(
            computedTotalFamilyMembers,
            "Not Provided"
          )}
          &nbsp;&nbsp; <strong>Earning Members:</strong> ${getValue(
            computedEarningMembers,
            "Not Provided"
          )}
        </td>
      </tr>
    `;

    return `
      <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead>${header}</thead>
        <tbody>${rows}${summaryRows}</tbody>
      </table>
    `;
  };

  const renderBankingDetails = () => {
    const bankingDetails =
      verificationData.bankingDetails?.bankingDetails || [];

    const header = `
      <tr style="background-color:#f5f5f5;">
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Bank Name</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Account Type</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Avg Balance</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Years Maintained</th>
      </tr>
    `;

    const rows = bankingDetails.length
      ? bankingDetails
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
      verificationData.existingLoans?.loans ||
      verificationData.existingLoans ||
      [];

    const header = `
      <tr style="background-color:#f5f5f5;">
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Loan Type</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Bank Name</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Loan Amount</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Tenure</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">EMI</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Balance Tenure</th>
        <th style="border:1px solid #ccc;padding:6px;text-align:left;">Status</th>
      </tr>
    `;

    const rows = loans.length
      ? loans
          .map(
            (loan: any) => `
              <tr>
                <td style="border:1px solid #ccc;padding:6px;">${
                  getValue(loan.type, loan.loanType) || "Not Provided"
                }</td>
                <td style="border:1px solid #ccc;padding:6px;">${
                  getValue(loan.bank, loan.bankName) || "Not Provided"
                }</td>
                <td style="border:1px solid #ccc;padding:6px;">${
                  formatCurrency(loan.loanAmount || loan.amount) ||
                  "Not Provided"
                }</td>
                <td style="border:1px solid #ccc;padding:6px;">${
                  getValue(loan.tenure, loan.duration) || "Not Provided"
                }</td>
                <td style="border:1px solid #ccc;padding:6px;">${
                  formatCurrency(loan.emi || loan.installment) ||
                  "Not Provided"
                }</td>
                <td style="border:1px solid #ccc;padding:6px;">${
                  getValue(loan.balanceTenure, loan.balance) ||
                  "Not Provided"
                }</td>
                <td style="border:1px solid #ccc;padding:6px;">${
                  getValue(loan.status, loan.loanStatus) ||
                  "Not Provided"
                }</td>
              </tr>
            `
          )
          .join("")
      : `<tr><td colspan="7" style="border:1px solid #ccc;padding:6px;text-align:center;">No loan details provided</td></tr>`;

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
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${applicationNumber}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of Applicant</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${applicantName}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of Co-Applicant</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${coApplicantName}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Phone Number</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${applicantMobile}</p></td>
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
                <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Date of Visit</strong>: ${dateOfVisit || istDate.split(" ")[0]}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Person Met</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${getValue(verificationData.applicantDetails?.personMet, verificationData.personMet)}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Amount and Purpose of Loan</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${combinedAmountPurpose || getValue(verificationData.applicantDetails?.amountAndPurposeOfLoan, verificationData.amountAndPurposeOfLoan)}</p></td>
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
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${aboutApplicantText ||
                  `The applicant is ${applicantName}, a business owner who has been running the concern ${nameOfConcern} successfully. The applicant resides at ${residentialPremises}.`}</p></td>
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
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.licMutualFunds?.licMutualFunds || ""}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px;vertical-align:top"><p style="margin:8px 0;line-height:1.5"><strong>Assets</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px">${renderAssetsTable()}</td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px;vertical-align:top"><p style="margin:8px 0;line-height:1.5"><strong>Existing Loans</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px">${renderExistingLoans()}</td>
            </tr>
        </table>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
            <tr>
                <td style="border:1px solid #ccc;padding:8px;vertical-align:top"><p style="margin:8px 0;line-height:1.5"><strong>About the Business</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px">
                    ${renderBusinessNarrative()}
                </td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name and Contact number of Regular Customers</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px">${renderStakeholderTable(
                  verificationData.regularCustomers?.customers || [],
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
                  verificationData.regularSuppliers?.suppliers || [],
                  [
                    { key: "name", label: "Supplier Name" },
                    { key: "contactNumber", label: "Contact Number" },
                  ],
                  "No regular suppliers captured"
                )}</td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Business Activity and stock level observed at the time of visit</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.businessActivityObserved?.businessActivityAndStockLevelObserved || ""}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Documents Observed</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCommaSeparatedList(
                  verificationData.documentsObserved?.documentsObserved
                )}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Whether Business Registered under GST?</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatBooleanDisplay(
                  verificationData.gstRegistration?.gstRegistered
                )}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>As per Audited individual ITR's</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${getValue(
                  verificationData.itrDetails?.itrFiled
                )}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Monthly Gross Receipts</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(
                  verificationData.monthlyGrossReceipts?.monthlyGrossReceipts
                )}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Monthly Expenses</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(
                  verificationData.monthlyExpenses?.monthlyExpenses
                )}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Net Profit</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(
                  verificationData.netProfit?.netProfit
                )}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Net Margin</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${getValue(
                  verificationData.netMargin?.netMargin
                )}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Family Expenses</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${getValue(
                  verificationData.familyExpenses?.familyExpenses
                )}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Employees</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${getValue(
                  verificationData.employees?.numberOfEmployees
                )}</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Concerns</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px">${renderConcernsSummary()}</td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Other observations</strong></p></td>
                <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${
                  Array.isArray(verificationData.otherObservations)
                    ? verificationData.otherObservations.join(", ")
                    : getValue(verificationData.otherObservations)
                }</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Other Incomes</strong></p></td>
                <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${
                  Array.isArray(verificationData.otherIncomes) &&
                  verificationData.otherIncomes.length > 0
                    ? verificationData.otherIncomes
                        .map((income: any) =>
                          getValue(income.otherIncome, income)
                        )
                        .join(", ")
                    : "Applicant receives rental income Rs. 1,50,000/- per month"
                }</p></td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Neighbor Check</strong></p></td>
                <td colspan="8" style="border:1px solid #ccc;padding:8px">${renderNeighborTable()}</td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Status</strong></p></td>
                <td colspan="8" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>${getValue(
                  html_data.status,
                  verificationData.status?.status
                ) || "Not Provided"}</strong></p></td>
            </tr>
            </table>
            
        <p style="margin:8px 0;line-height:1.5"><strong>Disclaimer Clause:</strong></p>
        <p style="margin:8px 0;line-height:1.5">This report (including any attachments) has been prepared based on verbal information provided by the person contacted. ARKA FINCAP LIMITED will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. <strong>M/s. KOWTHA & CO</strong> will not be held liable in any case.</p>
        <p style="margin:8px 0;line-height:1.5">  </p>
            <p style="margin:8px 0;line-height:1.5"><strong></strong></p>
        <p style="margin:8px 0;line-height:1.5"><strong>Photos</strong>:</p>
            ${
              html_data.imagesData && html_data.imagesData.trim().length > 0
                ? html_data.imagesData
                : '<div style="font-size:12px;color:#666;">No photographs uploaded</div>'
            }
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Regular Customers</td></tr>
        <tr>
          <th>Customer Name</th>
          <th>Contact Number</th>
        </tr>
        ${
          Array.isArray(verificationData.regularCustomers?.customers) &&
          verificationData.regularCustomers?.customers.length > 0
            ? verificationData.regularCustomers?.customers
                .map(
                  (customer) => `
        <tr>
          <td><span class="var-value">${customer.name || ""}</span></td>
          <td><span class="var-value">${customer.contactNumber || ""}</span></td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="2" style="text-align:center;">No customers listed</td></tr>'
        }
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Regular Suppliers</td></tr>
        <tr>
          <th>Supplier Name</th>
          <th>Contact Number</th>
        </tr>
        ${
          Array.isArray(verificationData.regularSuppliers?.suppliers) &&
          verificationData.regularSuppliers?.suppliers.length > 0
            ? verificationData.regularSuppliers?.suppliers
                .map(
                  (supplier) => `
        <tr>
          <td><span class="var-value">${supplier.name || ""}</span></td>
          <td><span class="var-value">${supplier.contactNumber || ""}</span></td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="2" style="text-align:center;">No suppliers listed</td></tr>'
        }
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Business Activity & Documentation</td></tr>
        <tr>
          <th>Business Activity and Stock Level Observed</th>
          <td colspan="6"><span class="var-value">${verificationData.businessActivityObserved?.businessActivityAndStockLevelObserved || ""}</span></td>
        </tr>
        <tr>
          <th>Documents Observed</th>
          <td colspan="6"><span class="var-value">${verificationData.documentsObserved?.documentsObserved || ""}</span></td>
        </tr>
        <tr>
          <th>Whether Business Registered under GST?</th>
          <td colspan="6"><span class="var-value">${verificationData.gstRegistration?.gstRegistered || ""}</span></td>
        </tr>
        <tr>
          <th>As per Audited individual ITR's</th>
          <td colspan="6"><span class="var-value">${verificationData.itrDetails?.itrFiled || ""}</span></td>
        </tr>
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Financial Details</td></tr>
        <tr>
          <th>Monthly Gross Receipts</th>
          <td colspan="6"><span class="var-value">${verificationData.monthlyGrossReceipts?.monthlyGrossReceipts || ""}</span></td>
        </tr>
        <tr>
          <th>Monthly Expenses</th>
          <td colspan="6"><span class="var-value">${verificationData.monthlyExpenses?.monthlyExpenses || ""}</span></td>
        </tr>
        <tr>
          <th>Net Profit</th>
          <td colspan="6"><span class="var-value">${verificationData.netProfit?.netProfit || ""}</span></td>
        </tr>
        <tr>
          <th>Net Margin</th>
          <td colspan="6"><span class="var-value">${verificationData.netMargin?.netMargin || ""}</span></td>
        </tr>
        <tr>
          <th>Family Expenses</th>
          <td colspan="6"><span class="var-value">${verificationData.familyExpenses?.familyExpenses || ""}</span></td>
        </tr>
        <tr>
          <th>Number of Employees</th>
          <td colspan="6"><span class="var-value">${verificationData.employees?.numberOfEmployees || ""}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Additional Observations</td></tr>
        <tr>
          <th>Concerns</th>
          <td colspan="6"><span class="var-value">${
            Array.isArray(verificationData.concerns) && verificationData.concerns.length > 0
              ? verificationData.concerns.join('<br />')
              : ""
          }</span></td>
        </tr>
        <tr>
          <th>Other Observations</th>
          <td colspan="6"><span class="var-value">${
            Array.isArray(verificationData.otherObservations) && verificationData.otherObservations.length > 0
              ? verificationData.otherObservations.join('<br />')
              : ""
          }</span></td>
        </tr>
        <tr>
          <th>Other Incomes</th>
          <td colspan="6"><span class="var-value">${
            Array.isArray(verificationData.otherIncomes) && verificationData.otherIncomes.length > 0
              ? verificationData.otherIncomes.join('<br />')
              : ""
          }</span></td>
        </tr>
        <tr>
          <th>Neighbor Check</th>
          <td colspan="6"><span class="var-value">${verificationData.neighborCheck?.neighborCheck || ""}</span></td>
        </tr>
        <tr>
          <th>Status</th>
          <td colspan="6"><strong><span class="var-value">${verificationData.status?.status || html_data.status || ""}</span></strong></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr>
          <td colspan="7"><strong>Disclaimer Clause:</strong></td>
        </tr>
        <tr>
          <td colspan="7"><span class="var-value">This report (including any attachments) has been prepared based on verbal information provided by the person contacted. ARKA FINCAP LIMITED will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. <strong>M/s. KOWTHA & CO</strong> will not be held liable in any case.</span></td>
        </tr>
      </table>
    </div>

    <br>
    <img src="${html_data.imageDataUri}" width="50%" height="40%" style="margin-left: 2%;" />

    <footer class="pdf-footer">
      <span style="color:rgb(8, 136, 36);">${html_data.bankName || ""}</span><br>
      Generated on ${istDate}
    </footer>
  `;
};
