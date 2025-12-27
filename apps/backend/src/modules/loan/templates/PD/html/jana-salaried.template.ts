import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0";
const labelCellStyle =
  "border:1px solid #c7cdd1;padding:8px;font-weight:600;color:#222;background:#f4f6fb;vertical-align:top;width:32%";
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

export const janaSalariedTemplate = (verificationData: any, html_data: any) => {
  const general = verificationData.general;
  const familyDetails = verificationData.familyDetails;
  const residenceDetails = verificationData.residenceDetails;
  const applicantDetails = verificationData.applicantDetails;
  const networthDetails = verificationData.networthDetails;
  const loanDetails = verificationData.loanDetails;
  const existingRelationship = verificationData.existingRelationship;
  const bankingDetails = verificationData.bankingDetails;
  const creditCardDetails = verificationData.creditCardDetails;
  const loanAmountAndPurpose = verificationData.loanAmountAndPurpose;
  const securityOffered = verificationData.securityOffered;
  const otherIncome = verificationData.otherIncome;
  const thirdPartyConfirmation = verificationData.thirdPartyConfirmation;
  const documentsVerified = verificationData.documentsVerified;
  const otherObservations = verificationData.otherObservations;
  const geoTagDetails = verificationData?.geoTagDetails || {};

  return `
    ${pdBaseTemplate()}

    <div class="template-content">
      <h2 style="margin:8px 0;line-height:1.5;text-align:center;"><strong>Jana Small Finance Bank Ltd.</strong></h2>
      <h3 style="margin:8px 0;line-height:1.5;text-align:center;"><strong><u>PD Sheet – Salaried</u></strong></h3>

      <table style="${tableStyle}">
        <tr>
          <td style="${labelCellStyle}">Name of the Applicant with DOB</td>
          <td style="${valueCellStyle}">${general?.applicantName} (${general?.applicationNumber}) <br> ${general?.dateOfBirthOfApplicant}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Name of Spouse with DOB</td>
          <td style="${valueCellStyle}">${general?.spouseName} <br> ${general?.dateOfBirthOfSpouse}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Does Spouse Work? (If yes then give brief)</td>
          <td style="${valueCellStyle}">${general?.doesSpouseWork} <br> ${general?.spouseWorkDetails}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Qualification</td>
          <td style="${valueCellStyle}">${general?.qualification}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Employer Name & Address</td>
          <td style="${valueCellStyle}">${general?.employerName} <br> <br> ${general?.employerAddress}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">PD place</td>
          <td style="${valueCellStyle}">${general?.pdPlace}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Designation</td>
          <td style="${valueCellStyle}">${general?.designation}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Current Monthly Salary (Net)</td>
          <td style="${valueCellStyle}">${general?.currentMonthlySalary}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">No. of yrs in present employment</td>
          <td style="${valueCellStyle}">${general?.yearsInPresentEmployment}</td>
        </tr>  
        <tr>
          <td style="${labelCellStyle}">No.of people in family</td>
          <td style="border:1px solid #ccc;padding:8px">
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}">Name</td>
                <td style="${labelCellStyle}">Relation</td>
                <td style="${labelCellStyle}">Age</td>
                <td style="${labelCellStyle}">Qualification</td>
                <td style="${labelCellStyle}">Occupation</td>
                <td style="${labelCellStyle}">Income per month (approx.)</td>
                <td style="${labelCellStyle}">Dependent</td>
              </tr>
              ${
                familyDetails?.familyMembers &&
                Array.isArray(familyDetails.familyMembers) &&
                familyDetails.familyMembers.length > 0
                  ? familyDetails.familyMembers
                      .map(
                        (member: any) => `
                <tr>
                  <td style="${valueCellStyle}">${formatMultiline(member?.name || "")}</td>
                  <td style="${valueCellStyle}">${formatMultiline(member?.relationship || "")}</td>
                  <td style="${valueCellStyle}">${formatMultiline(member?.age || "")}</td>
                  <td style="${valueCellStyle}">${formatMultiline(member?.qualification || "")}</td>
                  <td style="${valueCellStyle}">${formatMultiline(member?.occupation || "")}</td>
                  <td style="${valueCellStyle}">${formatMultiline(member?.incomePerMonth || "")}</td>
                  <td style="${valueCellStyle}">${formatMultiline(member?.dependent || "")}</td>
                </tr>
              `
                      )
                      .join("")
                  : `<tr><td style="${valueCellStyle}" colspan="7">Not provided</td></tr>`
              }
            </table>
          </td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">No.of non-earning Family Members/dependents</td>
          <td style="${valueCellStyle}">${familyDetails?.nonearningFamilyMembers}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Residence Details</td>
          <td style="border:1px solid #ccc;padding:8px">
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}">Ownership</td>
                <td style="${labelCellStyle}">Area (in Sq ft)</td>
                <td style="${labelCellStyle}">Purchase Year / Rent Agreement Period</td>
                <td style="${labelCellStyle}">Purchase Cost / Rent per month</td>
                <td style="${labelCellStyle}">Current Market Value / Security Deposit</td>
                <td style="${labelCellStyle}">Owner / Landlord (Relationship with Applicant)</td>
                <td style="${labelCellStyle}">Tenant</td>
                <td style="${labelCellStyle}">Mortgaged</td>
              </tr>
              <tr>
                <td style="${valueCellStyle}">${residenceDetails?.ownership}</td>
                <td style="${valueCellStyle}">${residenceDetails?.areaInSqFt}</td>
                <td style="${valueCellStyle}">${residenceDetails?.purchaseYear}</td>
                <td style="${valueCellStyle}">${residenceDetails?.purchaseCost}</td>
                <td style="${valueCellStyle}">${residenceDetails?.currentMarketValue}</td>
                <td style="${valueCellStyle}">${residenceDetails?.ownerRelationship}</td>
                <td style="${valueCellStyle}">${residenceDetails?.tenant}</td>
                <td style="${valueCellStyle}">${residenceDetails?.mortgaged}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Applicant's Job Profile</td>
          <td style="${valueCellStyle}">${(() => {
            const text = applicantDetails?.applicantJobProfile;
            if (!text) return "Not provided";
            const lines = String(text)
              .split(/\n+/)
              .filter((line: string) => line.trim().length > 0);
            if (lines.length === 0) return "Not provided";
            return `<ul style="margin: 0; padding-left: 20px; list-style-type: disc;">${lines.map((line: string) => `<li style="margin-bottom: 4px;">${line.trim()}</li>`).join("")}</ul>`;
          })()}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">About the company</td>
          <td style="${valueCellStyle}">${(() => {
            const text = applicantDetails?.aboutTheCompany;
            if (!text) return "Not provided";
            const lines = String(text)
              .split(/\n+/)
              .filter((line: string) => line.trim().length > 0);
            if (lines.length === 0) return "Not provided";
            return `<ul style="margin: 0; padding-left: 20px; list-style-type: disc;">${lines.map((line: string) => `<li style="margin-bottom: 4px;">${line.trim()}</li>`).join("")}</ul>`;
          })()}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Previous Employment</td>
          <td style="${valueCellStyle}">${applicantDetails?.previousEmploymentDetails}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Spouse's Job Profile</td>
          <td style="${valueCellStyle}">${applicantDetails?.spouseJobProfile}</td>
        </tr>

        <tr>
          <td style="${labelCellStyle}">Net Worth (Car / Property / Investments etc.)</td>
          <td style="border:1px solid #ccc;padding:8px">
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}">Address</td>
                <td style="${labelCellStyle}">Area (in Sq ft)</td>
                <td style="${labelCellStyle}">Purchase Cost (in Lakhs)</td>
                <td style="${labelCellStyle}">Purchase year</td>
                <td style="${labelCellStyle}">Market Value (in Lakhs)</td>
                <td style="${labelCellStyle}">Owner Name</td>
                <td style="${labelCellStyle}">Mortgaged</td>
              </tr>
              ${
                networthDetails?.netWorth &&
                Array.isArray(networthDetails.netWorth) &&
                networthDetails.netWorth.length > 0
                  ? networthDetails.netWorth
                      .map(
                        (item: any) => `
                <tr>
                  <td style="${valueCellStyle}">${formatMultiline(item?.address || "")}</td>
                  <td style="${valueCellStyle}">${formatMultiline(item?.areaInSqFt || "")}</td>
                  <td style="${valueCellStyle}">${formatMultiline(item?.purchaseCostLakhs || "")}</td>
                  <td style="${valueCellStyle}">${formatMultiline(item?.purchaseYear || "")}</td>
                  <td style="${valueCellStyle}">${formatMultiline(item?.marketValueLakhs || "")}</td>
                  <td style="${valueCellStyle}">${formatMultiline(item?.ownerName || "")}</td>
                  <td style="${valueCellStyle}">${formatMultiline(item?.mortgaged || "")}</td>
                </tr>
              `
                      )
                      .join("")
                  : `<tr><td style="${valueCellStyle}" colspan="7">Not provided</td></tr>`
              }

              <tr>
                <td style="${labelCellStyle}" colspan="3">Any Liquid, Moveable & Monetary items such as Cash, Gold, FD, RD, Mutual Fund Holdings, Shares, Bonds, Securities -</td>
                <td style="${valueCellStyle}" colspan="4">${networthDetails?.liquidMoveableAssets}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}" colspan="3">Life Insurance, Mediclaim, Property/Asset Insurance (Premium & Sum Assured) -</td>
                <td style="${valueCellStyle}" colspan="4">${networthDetails?.insurances}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}" colspan="3">Capital Invested in any Business, Loans & Advances given -</td>
                <td style="${valueCellStyle}" colspan="4">${networthDetails?.capitalInvestedBusiness}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}" colspan="3">Car, Bike and any Other Vehicles (Company Name and Model) -</td>
                <td style="${valueCellStyle}" colspan="4">${networthDetails?.vehicles}</td>
              </tr>
            </table>
            <p style="margin-top: 8px; font-size: 12px; color: #666;"><strong>Note: Amounts Mentioned above are approx</strong></p>
          </td>
        </tr>

        <tr>
          <td style="${labelCellStyle}">Loan Details</td>
          <td style="border:1px solid #ccc;padding:8px">
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}">Name of Bank / NBFC</td>
                <td style="${labelCellStyle}">Type of Loan</td>
                <td style="${labelCellStyle}">Sanctioned Amount (in Lakhs)</td>
                <td style="${labelCellStyle}">O/S Balance (in Lakhs)</td>
                <td style="${labelCellStyle}">EMI (in Rs.)</td>
                <td style="${labelCellStyle}">Tenure(months)</td>
                <td style="${labelCellStyle}">Month on Books</td>
                <td style="${labelCellStyle}">EMI Paid Bank</td>
                <td style="${labelCellStyle}">Secured Against which Asset</td>
              </tr>
              ${(loanDetails?.loanDetails || [])
                .map(
                  (item: any) => `
                <tr>
                  <td style="${valueCellStyle}">${item.bankName}</td>
                  <td style="${valueCellStyle}">${item.typeOfLoan}</td>
                  <td style="${valueCellStyle}">${formatCurrency(item.sanctionedAmount)}</td>
                  <td style="${valueCellStyle}">${formatCurrency(item.osBalance)}</td>
                  <td style="${valueCellStyle}">${formatCurrency(item.emi)}</td>
                  <td style="${valueCellStyle}">${item.tenure}</td>
                  <td style="${valueCellStyle}">${item.monthOnBooks}</td>
                  <td style="${valueCellStyle}">${item.emiPaidBank || "Not provided"}</td>
                  <td style="${valueCellStyle}">${item.securedAgainstAsset}</td>
                </tr>
              `
                )
                .join("")}
            </table>
            <p style="margin-top: 8px; font-size: 12px; color: #666;"><strong>Note: Amounts Mentioned above are approx</strong></p>
          </td>
        </tr>

        ${renderKeyValue("Existing Relationship with Jana Small Finance Bank Ltd.", existingRelationship?.existingRelationship || "Not provided")}
          
        <tr>
          <td style="${labelCellStyle}">Banking Habits</td>
          <td style="border:1px solid #ccc;padding:8px">
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}">Bank Name</td>
                <td style="${labelCellStyle}">Branch Name</td>
                <td style="${labelCellStyle}">Account Type</td>
                <td style="${labelCellStyle}">Operating Since (Year)</td>
              </tr>
              ${(bankingDetails?.bankingDetails || [])
                .map(
                  (item: any) => `
                <tr>
                  <td style="${valueCellStyle}">${item.bankName}</td>
                  <td style="${valueCellStyle}">${item.branchName}</td>
                  <td style="${valueCellStyle}">${item.accountType} </td>
                  <td style="${valueCellStyle}">${item.operatingSinceYear}</td>
                </tr>
              `
                )
                .join("")}
            </table>
          </td>
        </tr>

        ${renderKeyValue("Credit Card Details", creditCardDetails?.creditCardDetails || "Not provided")}
        <tr>
          <td style="${labelCellStyle}">Loan Amount and Purpose</td>
          <td style="${valueCellStyle}">${formatCurrency(loanAmountAndPurpose?.loanAmount || "Not provided")} <br> ${loanAmountAndPurpose?.purposeOfLoan || "Not provided"}</td>
        </tr>

        <tr>
          <td style="${labelCellStyle}">Security Offered</td>
          <td style="border:1px solid #ccc;padding:8px">
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}" >Address</td>
                <td style="${valueCellStyle}" colspan="6">${securityOffered?.address || "Not provided"}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">Area in Sq Ft</td>
                <td style="${labelCellStyle}">Agreement Value (in Lakhs)</td>
                <td style="${labelCellStyle}">Actual Purchase Cost (in Lakhs)</td>
                <td style="${labelCellStyle}">Market Value (in Lakhs)</td>
                <td style="${labelCellStyle}">OCR (in Lakhs)</td>
                <td style="${labelCellStyle}">OCR Paid Till Date (in Lakhs)</td>
                <td style="${labelCellStyle}">OCR Source</td>
              </tr>
              ${(securityOffered?.securityDetails || [])
                .map(
                  (item: any) => `
                <tr>
                  <td style="${valueCellStyle}">${item.areaInSqFt}</td>
                  <td style="${valueCellStyle}">${item.agreementValue}</td>
                  <td style="${valueCellStyle}">${item.purchaseCost}</td>
                  <td style="${valueCellStyle}">${item.marketValue}</td>
                  <td style="${valueCellStyle}">${item.ocrValue}</td>
                  <td style="${valueCellStyle}">${item.ocrPaidTillDate}</td>
                  <td style="${valueCellStyle}">${item.ocrSource}</td>
                </tr>
              `
                )
                .join("")}
            </table>
            <p style="margin-top: 8px; font-size: 12px; color: #666;"><strong>Note: Amounts Mentioned above are approx</strong></p>
          </td>
        </tr>

        <tr>
          <td style="${labelCellStyle}">Other Income</td>
          <td style="border:1px solid #ccc;padding:8px">
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}">Income</td>
                <td style="${labelCellStyle}">Details</td>
                <td style="${labelCellStyle}">Reference</td>
              </tr>
              ${(otherIncome?.otherIncomes || [])
                .map(
                  (item: any) => `
                <tr>
                  <td style="${valueCellStyle}">${formatCurrency(item.incomeAmount)}</td>
                  <td style="${valueCellStyle}">${item.details}</td>
                  <td style="${valueCellStyle}">${item.reference}</td>
                </tr>
              `
                )
                .join("")}
            </table>
            <p style="margin-top: 8px; font-size: 12px; color: #666;"><strong>Note: Amounts Mentioned above are approx</strong></p>
          </td>
        </tr>

        <tr>
          <td style="${labelCellStyle}">Third Party Confirmation</td>
          <td style="border:1px solid #ccc;padding:8px">
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}">Individual / Business Name</td>
                <td style="${labelCellStyle}">Address</td>
                <td style="${labelCellStyle}">Contact No.</td>
                <td style="${labelCellStyle}">Knowing Since</td>
                <td style="${labelCellStyle}">Feedback on Borrower</td>
                <td style="${labelCellStyle}">Feedback on Business</td>
              </tr>
              ${
                thirdPartyConfirmation?.thirdPartyConfirmations?.length > 0
                  ? thirdPartyConfirmation.thirdPartyConfirmations
                      .map(
                        (item: any) => `
                <tr>
                  <td style="${valueCellStyle}">${item.individualOrBusinessName || "Not provided"}</td>
                  <td style="${valueCellStyle}">${formatMultiline(item.address || "Not provided")}</td>
                  <td style="${valueCellStyle}">${item.contactNo || "Not provided"}</td>
                  <td style="${valueCellStyle}">${item.knowingSince || "Not provided"}</td>
                  <td style="${valueCellStyle}">${item.feedbackOnBorrower || "Not provided"}</td>
                  <td style="${valueCellStyle}">${item.feedbackOnBusiness || "Not provided"}</td>
                </tr>
              `
                      )
                      .join("")
                  : `<tr><td style="${valueCellStyle}" colspan="6">Not provided</td></tr>`
              }
            </table>
          </td>
        </tr>


        <tr>
          <td style="${labelCellStyle}">Documents Verified</td>
          <td style="border:1px solid #ccc;padding:8px">
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}">Document Category</td>
                <td style="${labelCellStyle}">Document Name</td>
                <td style="${labelCellStyle}">Document Type</td>
                <td style="${labelCellStyle}">Remarks</td>
              </tr>
              ${(documentsVerified?.documentsVerified || [])
                .map(
                  (item: any) => `
                <tr>
                  <td style="${valueCellStyle}">${item.documentCategory}</td>
                  <td style="${valueCellStyle}">${item.documentName}</td>
                  <td style="${valueCellStyle}">${item.documentType}</td>
                  <td style="${valueCellStyle}">${item.remarks}</td>
                </tr>
              `
                )
                .join("")}
            </table>
          </td>
        </tr>

        <tr>
          <td style="${labelCellStyle}">Major Observations / Comments / Concerns during PD</td>
          <td style="border:1px solid #ccc;padding:8px"> 
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}">Case Strengths</td>
                </tr>
                <tr>
                <td style="${valueCellStyle}">${(() => {
                  const text = otherObservations?.caseStrengths;
                  if (!text) return "Not provided";
                  const lines = String(text)
                    .split(/\n+/)
                    .filter((line: string) => line.trim().length > 0);
                  if (lines.length === 0) return "Not provided";
                  return `<ul style="margin: 0; padding-left: 20px; list-style-type: disc;">${lines.map((line: string) => `<li style="margin-left: 8px;">${line.trim()}</li>`).join("")}</ul>`;
                })()}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">Case Weakness</td>
                </tr>
                <tr>
                <td style="${valueCellStyle}">${(() => {
                  const text = otherObservations?.caseWeakness;
                  if (!text) return "Not provided";
                  const lines = String(text)
                    .split(/\n+/)
                    .filter((line: string) => line.trim().length > 0);
                  if (lines.length === 0) return "Not provided";
                  return `<ul style="margin: 0; padding-left: 20px; list-style-type: disc;">${lines.map((line: string) => `<li style="margin-left: 8px;">${line.trim()}</li>`).join("")}</ul>`;
                })()}</td>
              </tr>
            </table> 
          </td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">PD Status</td>
          <td style="${valueCellStyle}">${html_data.approvedStatus || "Not provided"}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Name of Agency Executive</td>
          <td style="${valueCellStyle}">${otherObservations?.nameOfAgencyExecutive || "Not provided"}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Date & Time of Visit</td>
          <td style="${valueCellStyle}">${otherObservations?.dateOfVisit || "Not provided"} At ${otherObservations?.timeOfVisit || "Not provided"}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Checked By</td>
          <td style="${valueCellStyle}">${otherObservations?.checkedBy || "Not provided"}</td>
        </tr>
        <tr>
        <td style="${labelCellStyle}">Site Coordinates</td>
        <td style="border:1px solid #ccc;padding:8px">
          <p>${
            geoTagDetails?.coordinates ||
            geoTagDetails?.Coordinates ||
            verificationData?.geoTagDetails?.coordinates ||
            verificationData?.GeoTagDetails?.coordinates ||
            "Not provided"
          }</p>
        </td>
      </tr>
      </table>
    </div>

    ${pdBaseTemplateFooter(html_data)}

    <p style="margin:0 0 24px;color:#333;"><strong>Disclaimer:</strong> <br>This report (including any attachments) has been prepared on the basis of information provided by the person contacted. Jana Small Finance Bank Ltd. will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. Veeraraghavan & Co. will not be held liable in any case.</p>

  `;
};
