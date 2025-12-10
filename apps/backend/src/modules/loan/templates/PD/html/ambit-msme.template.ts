import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:16px 0";
const labelCellStyle =
  "border:1px solid #c7cdd1;padding:8px;font-weight:600;color:#222;background:#f4f6fb;vertical-align:top;width:32%;font-size:12px";
const valueCellStyle =
  "border:1px solid #c7cdd1;padding:8px;color:#333;vertical-align:top;font-size:12px";

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
  return `
    <table style="${tableStyle}">
      <tr>
        ${headers.map((header) => `<th style="${labelCellStyle}">${header}</th>`).join("")}
      </tr>
      ${rows
        .map(
          (row) => `
        <tr>
          ${row.map((cell) => `<td style="${valueCellStyle}">${cell}</td>`).join("")}
        </tr>
      `
        )
        .join("")}
    </table>
  `;
};

export const ambitMsmeTemplate = (verificationData: any, html_data: any) => {
  const general = verificationData.general || {};
  const initiatedAddress =
    verificationData.addressDetails.initiatedAddress || {};
  const visitedAddress = verificationData.addressDetails.visitedAddress || {};
  const businessLicenseAddress =
    verificationData.addressDetails.businessLicenseAddress || {};
  const residentialDetails = verificationData.residentialDetails || {};
  const propertyDetails = verificationData.propertyDetails || {};
  const generalInfo = verificationData.generalInfo || {};
  const applicantDetails = verificationData.applicantDetails || {};
  const familyDetails = verificationData.familyDetails || {};
  const businessDetails = verificationData.businessDetails || {};
  const incomeAssessment = verificationData.incomeAssessment || {};
  const suppliersDetails = verificationData.suppliersDetails || {};
  const customersDetails = verificationData.customersDetails || {};
  const neighbourChecks = verificationData.NeighbourChecks || {};
  const otherChecks = verificationData.otherChecks || {};
  const stockMaintained = verificationData.averageStockMaintained || {};
  const businessOrIncomeDetails =
    verificationData.businessOrIncomeDetails || {};
  const assetsDetails = verificationData.assetsDetails || {};
  const endUseOfLoan = verificationData.endUseOfLoan || {};
  const loanDetails = verificationData.loanDetails || {};
  const strengthsAndWeaknesses = verificationData.strenghtsAndWeaknesses || {};
  const documentsSeen = verificationData.documentsSeen || {};
  const bankingDetails = verificationData.bankingDetails || {};
  const otherObservations = verificationData.otherObservations || {};

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content ambit-msme-template">
        <h1 style="margin:0 0 16px;color:#1f2a37;font-size:24px; text-align:center">Personal Discussion sheet cum income assessment</h1>
        <h1 style="margin:0 0 16px;color:#1f2a37;font-size:24px; text-align:center">Ambit Finvest Pvt. Ltd.</h1>

        <table class="section-table">
        ${renderKeyValue("Name of the Applicant", general?.nameOfApplicant)}
        ${renderKeyValue("Name of the Co-Applicant", general?.nameOfCoApplicant)}
        ${renderKeyValue("Date of Report", general?.dateOfReport)}
        ${renderKeyValue("Ambit Application ID", general?.applicationNo)}
        ${renderKeyValue("Requested Loan Amount", general?.loanAmount, formatCurrency)}
        ${renderKeyValue("Maximum Comfortable EMI", general?.emi, formatCurrency)}
        ${renderKeyValue("Business Name", general?.businessName)}
        ${renderKeyValue("Name of the proprietor as per Business license", general?.nameOfTheProprietor)}
        <tr>
          <td style="${labelCellStyle}">Initiated Address</td>
          <td style="${valueCellStyle}">${initiatedAddress}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Visited Address</td>
          <td style="${valueCellStyle}">${visitedAddress?.address || ""}${visitedAddress?.latitude ? `<br><strong>Latitude:</strong> ${visitedAddress.latitude}` : ""}${visitedAddress?.longitude ? `<br><strong>Longitude:</strong> ${visitedAddress.longitude}` : ""}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Business License Address</td>
          <td style="${valueCellStyle}">${businessLicenseAddress}</td>
        </tr>
        
        <tr>
          <td style="${labelCellStyle}">Residential Details</td>
          <td style="border:1px solid #ccc;padding:8px">
            <table style="${tableStyle}">
              <tr>
                <td style="${valueCellStyle}" colspan="4"><strong><u>Address with Lattitude and Longitude:</u></strong> ${residentialDetails.address + "<br><strong>Latitude:</strong> " + residentialDetails.addressLatitude + "<br><strong>Longitude:</strong> " + residentialDetails.addressLongitude}</td>
                
              </tr>
              <tr>
              <td style="${labelCellStyle}">Rented/Owned:</td>
              <td style="${labelCellStyle}">Owned by:</td>
              <td style="${labelCellStyle}">Area (In Sq. Ft.):</td>
              <td style="${labelCellStyle}">Occupied since (years):</td>
              </tr>
              <tr>
              <td style="${valueCellStyle}">${residentialDetails.rentedOrOwned}</td>
              <td style="${valueCellStyle}">${residentialDetails.ownedBy}</td>
              <td style="${valueCellStyle}">${residentialDetails.areaInSqFt}</td>
              <td style="${valueCellStyle}">${residentialDetails.occupiedSinceYears}</td>
              </tr>
            </table>
          </td>
        </tr>




        <tr>
            <td style="${labelCellStyle}">Property Details (with Latitude and Longitude)</td>
            <td style="border:1px solid #ccc;padding:8px">
                <table style="${tableStyle}">
                    <tr>
                        <td style="${valueCellStyle}" colspan="4"><strong><u>Address with Lattitude and Longitude:</u></strong> ${propertyDetails.address + "<br><strong>Latitude:</strong> " + propertyDetails.addressLatitude + "<br><strong>Longitude:</strong> " + propertyDetails.addressLongitude}</td>
                      ${renderKeyValue("Type of Property", propertyDetails.typeOfProperty)}
                        ${renderKeyValue("Property owner name", propertyDetails.ownerName)}
                        ${renderKeyValue("Nature of Uses", propertyDetails.natureOfUses)}
                        ${renderKeyValue("Market Value", propertyDetails.marketValue)}
                        ${renderKeyValue("Area (In Sq. Ft.)", propertyDetails.areaInSqft)}
                        ${renderKeyValue("Occupied since (years)", propertyDetails.occupiedSinceYears)}
                    </tr>
                    
                </table>
            </td>
        </tr>


        ${renderKeyValue("Mob no. of App and Co app", "Applicant: " + generalInfo.phoneNumberOfApplicant + "<br>" + "Co-Applicant: " + generalInfo.phoneNumberOfCoApplicant)}
        ${renderKeyValue("App & Co app KYC details and Utility bills/license", "Applicant: " + generalInfo.kycDetailsOfApplicant + "<br>" + "Co-Applicant: " + generalInfo.kycDetailsOfCoApplicant)}
        ${renderKeyValue("PD Done Date and Time", generalInfo.pdDoneDateAndTime)}
        ${renderKeyValue("Type of Loan", generalInfo.typeOfLoan)}
        ${renderKeyValue("No. of Visit", generalInfo.noOfVisit)}
        ${renderKeyValue("Person Met (With name and Relation)", generalInfo.personMet)}
        ${renderKeyValue("PD Done Person name", generalInfo.pdDoneBy)}
        </table>

        <table class="section-table">
            <tr>
                <td style="${labelCellStyle}"> Sr. No.</td>
                <td style="${labelCellStyle}"> Particular </td>
                <td style="${labelCellStyle}"> Description </td>
            </tr>
            <tr>
                <td style="${labelCellStyle}">1</td>
                <td style="${labelCellStyle}">Applicant Profile</td>
                <td style="${valueCellStyle}">${
                  applicantDetails.applicantProfile
                    ? `<ul style="margin: 0; padding-left:8px;">${applicantDetails.applicantProfile
                        .split("\n")
                        .map((line: string) => line.trim())
                        .map(
                          (line: string) =>
                            `<li style="margin-left: 8px;">${line}</li>`
                        )
                        .join("")}</ul>`
                    : "Not provided"
                }</td>
            </tr>
            <tr>
                <td style="${labelCellStyle}">2</td>
                <td style="${labelCellStyle}">Details of all Co-Applicant</td>
                <td style="${valueCellStyle}">${
                  applicantDetails.detailsOfCoApplicant
                    ? `<ul style="margin: 0; padding-left:8px;">${applicantDetails.detailsOfCoApplicant
                        .split("\n")
                        .map((line: string) => line.trim())
                        .map(
                          (line: string) =>
                            `<li style="margin-left: 8px;">${line}</li>`
                        )
                        .join("")}</ul>`
                    : "Not provided"
                }</td>
            </tr>
            <tr>
                <td style="${labelCellStyle}">3</td>
                <td style="${labelCellStyle}">Family Details/Background </td>
                <td style="border:1px solid #ccc;padding:8px">
                    <table style="${tableStyle}">
                    <tr>
                        <td style="${labelCellStyle}">Name of Family Member</td>
                        <td style="${labelCellStyle}">Relation with Applicant</td>
                        <td style="${labelCellStyle}">Age (Yrs)</td>
                        <td style="${labelCellStyle}">Qualification</td>
                        <td style="${labelCellStyle}">Occupation</td>
                        <td style="${labelCellStyle}">Income per month (approx.)</td>
                        <td style="${labelCellStyle}">Dependent</td>
                    </tr>
                ${ensureArray(familyDetails.details)
                  .map(
                    (family) => `
                    <tr>
                        <td style="${valueCellStyle}">${family.name}</td>
                        <td style="${valueCellStyle}">${family.relation}</td>
                        <td style="${valueCellStyle}">${family.age}</td>
                        <td style="${valueCellStyle}">${family.qualification}</td>
                        <td style="${valueCellStyle}">${family.occupation}</td>
                        <td style="${valueCellStyle}">${family.incomePerMonth}</td>
                        <td style="${valueCellStyle}">${family.dependent}</td>
                    </tr>
                `
                  )
                  .join("")}
                </table>
                </td>
            </tr>

            <tr>
                <td style="${labelCellStyle}">4</td>
                <td style="${labelCellStyle}">Business/Employment Details</td>
                <td style="${valueCellStyle}">${
                  businessDetails.businessDetails
                    ? `<ul style="margin: 0; padding-left: 8px;">${businessDetails.businessDetails
                        .split("\n")
                        .map((line: string) => line.trim())
                        .map(
                          (line: string) =>
                            `<li style="margin-left: 8px;">${line}</li>`
                        )
                        .join("")}</ul>`
                    : "Not provided"
                }</td>
            </tr>
            <tr>
                <td style="${labelCellStyle}">5</td>
                <td style="${labelCellStyle}">Income Assessment details</td>
                <td style="${valueCellStyle}">${
                  incomeAssessment.incomeAssessment
                    ? `<ul style="margin: 0; padding-left:8px;">${incomeAssessment.incomeAssessment
                        .split("\n")
                        .map((line: string) => line.trim())
                        .map(
                          (line: string) =>
                            `<li style="margin-left: 8px;">${line}</li>`
                        )
                        .join("")}</ul>`
                    : "Not provided"
                }</td>
            </tr>
            <tr>
                <td style="${labelCellStyle}">6</td>
                <td style="${labelCellStyle}">Suppliers/ Customer/ Neighbour (TPC) (Minimum 2 required)</td>
                <td style="border:1px solid #ccc;padding:8px">
                    <table style="${tableStyle}">
                    <tr>
                    <td style="${labelCellStyle}" colspan="4">Supplier Details:-</td>
                    <tr>
                        <td style="${labelCellStyle}">Name of Suppliers</td>
                        <td style="${labelCellStyle}">Mob Number</td>
                        <td style="${labelCellStyle}">Location</td>
                        <td style="${labelCellStyle}">Feedback</td>
                    </tr>
                    ${ensureArray(suppliersDetails.suppliersDetails)
                      .map(
                        (supplier) => `
                        <tr>
                            <td style="${valueCellStyle}">${supplier.name}</td>
                            <td style="${valueCellStyle}">${supplier.contactNumber}</td>
                            <td style="${valueCellStyle}">${supplier.location}</td>
                            <td style="${valueCellStyle}">${supplier.feedback}</td>
                        </tr>
                    `
                      )
                      .join("")}
                    
                    <tr>
                    <td style="${labelCellStyle}" colspan="4">Customer Details:-</td>
                    <tr>
                        <td style="${labelCellStyle}">Name of Customers</td>
                        <td style="${labelCellStyle}">Mob Number</td>
                        <td style="${labelCellStyle}">Location</td>
                        <td style="${labelCellStyle}">Feedback</td>
                    </tr>
                    ${ensureArray(customersDetails.customersDetails)
                      .map(
                        (customer) => `
                        <tr>
                            <td style="${valueCellStyle}">${customer.name}</td>
                            <td style="${valueCellStyle}">${customer.contactNumber}</td>
                            <td style="${valueCellStyle}">${customer.location}</td>
                            <td style="${valueCellStyle}">${customer.feedback}</td>
                        </tr>
                    `
                      )
                      .join("")}

                    <tr>
                    <td style="${labelCellStyle}" colspan="4">Neighbour Details:-</td>
                    <tr>
                        <td style="${labelCellStyle}">Name of Neighbour</td>
                        <td style="${labelCellStyle}">Mob Number</td>
                        <td style="${labelCellStyle}">Location</td>
                        <td style="${labelCellStyle}">Feedback</td>
                    </tr>
                    ${ensureArray(neighbourChecks.neighbourChecks)
                      .map(
                        (neighbour) => `
                        <tr>
                            <td style="${valueCellStyle}">${neighbour.neighbourName}</td>
                            <td style="${valueCellStyle}">${neighbour.contactNumber}</td>
                            <td style="${valueCellStyle}">${neighbour.location}</td>
                            <td style="${valueCellStyle}">${neighbour.feedback}</td>
                        </tr>
                    `
                      )
                      .join("")}
                        <tr>
                            <td style="${labelCellStyle}" colspan="4"></td>
                        </tr>
                    <tr>
                        <td style="${labelCellStyle}"colspan="2">Other Checks from Neighbour</td>
                        <td style="${labelCellStyle}" colspan="2">Remarks</td>
                    </tr>
                    ${ensureArray(otherChecks.otherChecks)
                      .map(
                        (check) => `
                        <tr>
                            <td style="${valueCellStyle}" colspan="2">${check.otherChecks}</td>
                            <td style="${valueCellStyle}" colspan="2">${check.remarks}</td>
                        </tr>
                    `
                      )
                      .join("")}
                    </table>
                </td>
            </tr>

            
            <tr>
                <td style="${labelCellStyle}">7</td>
                <td style="${labelCellStyle}">Average Stock Maintained</td>
                <td style="${valueCellStyle}">${formatMultiline(stockMaintained.averageStockMaintained)}</td>
            </tr>
            <tr>
                <td style="${labelCellStyle}">9</td>
                <td style="${labelCellStyle}">Other Business / Income Details (if any)</td>
                <td style="${valueCellStyle}">${formatMultiline(businessOrIncomeDetails.details)}</td>
            </tr>
           

            <tr>
                <td style="${labelCellStyle}">9</td>
                <td style="${labelCellStyle}">Assets Details</td>
                <td style="border:1px solid #ccc;padding:8px">
                    <table style="${tableStyle}">
                    <tr>
                        <td style="${labelCellStyle}">Asset Type</td>
                        <td style="${labelCellStyle}">Ownership Hold By</td>
                        <td style="${labelCellStyle}">Value of Asset</td>
                        <td style="${labelCellStyle}">Current Status</td>
                        <td style="${labelCellStyle}">Pledge/Free</td>
                    </tr>
                    ${ensureArray(assetsDetails.assetsDetails)
                      .map(
                        (asset) => `
                    <tr>
                        <td style="${valueCellStyle}">${asset.assetType}</td>
                        <td style="${valueCellStyle}">${asset.ownerName}</td>
                        <td style="${valueCellStyle}">${asset.valueOfAsset}</td>
                        <td style="${valueCellStyle}">${asset.currentSratus}</td>
                        <td style="${valueCellStyle}">${asset.pledgeOrFree}</td>
                    </tr>
                    `
                      )
                      .join("")}
                    </table>
                </td>
            </tr>

            <tr>
                <td style="${labelCellStyle}">10</td>
                <td style="${labelCellStyle}">End Use of Loan Purppose</td>
                <td style="${valueCellStyle}">${formatMultiline(endUseOfLoan.endUse)}</td>
            </tr>
       </table>

       <table class="section-table">
        <tr>
            <td style="${labelCellStyle}">11</td>
            <td style="${labelCellStyle}">Current live loans Details: </td>
            <td style="border:1px solid #ccc;padding:8px">
                <table style="${tableStyle}">.
                <tr>
                    <td style="${labelCellStyle}">Name of Bank / NBFC</td>
                    <td style="${labelCellStyle}">Type of Loan</td>
                    <td style="${labelCellStyle}">Sanctioned Amount (in Lakhs)</td>
                    <td style="${labelCellStyle}">O/S Balance</td>
                    <td style="${labelCellStyle}">EMI Amount (in Rs.)</td>
                    <td style="${labelCellStyle}">Tenure</td>
                    <td style="${labelCellStyle}">Emi Clearance Bank Name</td>
                </tr>
                ${ensureArray(loanDetails.loanDetails)
                  .map(
                    (loan) => `
                    <tr>
                        <td style="${valueCellStyle}">${loan.bankName}</td>
                        <td style="${valueCellStyle}">${loan.typeOfLoan}</td>
                        <td style="${valueCellStyle}">${loan.sanctionedAmount}</td>
                        <td style="${valueCellStyle}">${loan.osBalance}</td>
                        <td style="${valueCellStyle}">${loan.emi}</td>
                        <td style="${valueCellStyle}">${loan.tenure}</td>
                        <td style="${valueCellStyle}">${loan.emiClearanceBankName}</td>
                    </tr>
                `
                  )
                  .join("")}
                </table>
            </td>
        </tr>

        <tr>
            <td style="${labelCellStyle}">12</td>
            <td style="${labelCellStyle}">Stregths</td>
            <td style="${valueCellStyle}">${(() => {
              const text = strengthsAndWeaknesses.strengths;
              if (!text) return "Not provided";
              const lines = String(text)
                .split(/\n+/)
                .filter((line: string) => line.trim().length > 0);
              if (lines.length === 0) return "Not provided";
              return `<ul style="margin: 0; padding-left: 20px; list-style-type: disc;">${lines.map((line: string) => `<li style="margin-left: 8px;">${line.trim()}</li>`).join("")}</ul>`;
            })()}</td>
        </tr>
        <tr>
            <td style="${labelCellStyle}">13</td>
            <td style="${labelCellStyle}">Weaknesses</td>
            <td style="${valueCellStyle}">${(() => {
              const text = strengthsAndWeaknesses.weaknesses;
              if (!text) return "Not provided";
              const lines = String(text)
                .split(/\n+/)
                .filter((line: string) => line.trim().length > 0);
              if (lines.length === 0) return "Not provided";
              return `<ul style="margin: 0; padding-left: 20px; list-style-type: disc;">${lines.map((line: string) => `<li style="margin-left: 8px;">${line.trim()}</li>`).join("")}</ul>`;
            })()}</td>
        </tr>
        
        <tr>
            <td style="${labelCellStyle}">14</td>
            <td style="${labelCellStyle}">List of Documents Seen during visit</td>
            <td style="${valueCellStyle}">${(() => {
              const text = documentsSeen.documents;
              if (!text) return "Not provided";
              const lines = String(text)
                .split(/\n+/)
                .filter((line: string) => line.trim().length > 0);
              if (lines.length === 0) return "Not provided";
              return `<ul style="margin: 0; padding-left: 20px; list-style-type: disc;">${lines.map((line: string) => `<li style="margin-left: 8px;">${line.trim()}</li>`).join("")}</ul>`;
            })()}</td>
        </tr>
        

        <tr>
            <td style="${labelCellStyle}">15</td>
            <td style="${labelCellStyle}">Banking Details</td>
            <td style="border:1px solid #ccc;padding:8px">
                <table style="${tableStyle}">
                <tr>
                    <td style="${labelCellStyle}">Bank Name</td>
                    <td style="${labelCellStyle}">Account Type</td>
                    <td style="${labelCellStyle}">Open Since (Year)</td>
                    <td style="${labelCellStyle}">OD/CC Limit</td>
                </tr>
                ${ensureArray(bankingDetails.bankingDetails)
                  .map(
                    (bank) => `
                    <tr>
                        <td style="${valueCellStyle}">${bank.bankName}</td>
                        <td style="${valueCellStyle}">${bank.accountType}</td>
                        <td style="${valueCellStyle}">${bank.openSinceYear}</td>
                        <td style="${valueCellStyle}">${bank.odOrCcLimit}</td>
                    </tr>
                `
                  )
                  .join("")}
                </table>
            </td>
        </tr>
        <tr>
            <td style="${labelCellStyle}">16</td>
            <td style="${labelCellStyle}">Level of Activity & Stocks along with other Observation</td>
            <td style="${valueCellStyle}">${formatMultiline(otherObservations.observations)}</td>
        </tr>
        <tr>
            <td style="${labelCellStyle}">17</td>
            <td style="${labelCellStyle}">Overall PD Status</td>
            <td style="${valueCellStyle}">${html_data.approvedStatus || "Not provided"}</td>
       </table>
        
    </div>
    ${pdBaseTemplateFooter(html_data)}
    `;
};
