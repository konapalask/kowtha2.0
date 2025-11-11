import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate } from "./pd-base.template";

export const herohousingSelfTemplate = (
  verificationData: any,
  html_data: any
) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  return `
    ${pdBaseTemplate()}

    <div class="template-content">
      <p style="margin:8px 0;line-height:1.5"><strong>PD REPORT – SELF-EMPLOYED</strong></p>
      
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Loan account No.</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${html_data.applicationNumber || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of customer</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicDetails?.nameOfCustomer || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Person met in PD and relationship with Applicant</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicDetails?.personMetInPd || ""} - ${verificationData.basicDetails?.relationshipWithApplicant || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>PD Visit date and time</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicDetails?.pdVisitDate || verificationData.generalInfo?.pdVisitDate || html_data?.pdVerifiedDate || html_data?.dateOfReport || ""}${verificationData.basicDetails?.pdVisitTime || verificationData.generalInfo?.pdVisitTime ? `, ${verificationData.basicDetails?.pdVisitTime || verificationData.generalInfo?.pdVisitTime}` : ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>PD address & location</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicDetails?.pdAddress || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Lat log of business address</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.basicDetails?.latitude || ""}${verificationData.basicDetails?.latitude ? "N" : ""}</p>
            <p style="margin:8px 0;line-height:1.5">${verificationData.basicDetails?.longitude || ""}${verificationData.basicDetails?.longitude ? "E" : ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Requested loan amount</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicDetails?.requestedLoanAmount || ""}</p></td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>Profile of customer</strong></p>
      
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Borrower details ---</strong></p>
            <p style="margin:8px 0;line-height:1.5">It should include the</p>
            <ul>
              <li>Qualification of customer,</li>
              <li>Complete professional journey (service/ business details of each activity post qualification to till date</li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.borrowerProfile?.borrowerDetails || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Family details</strong></p>
            <ul>
              <li>Family details – Including dependents</li>
              <li>Family background (Parents and siblings including all dependents)</li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
              <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Name</p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Relationship with applicant</p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Age</p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Qualification</p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Occupation (Job/Business)</p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Income Details/dependent</p></td>
              </tr>
              ${
                Array.isArray(verificationData.familyDetails?.familyMembers) &&
                verificationData.familyDetails?.familyMembers.length > 0
                  ? verificationData.familyDetails?.familyMembers
                      .map(
                        (member) => `
              <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.name || ""}</p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.relationship || ""}</p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.age || ""}</p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.qualification || ""}</p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.occupation || ""}</p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.incomeDetailsDependent || ""}</p></td>
              </tr>
              `
                      )
                      .join("")
                  : '<tr><td colspan="6" style="border:1px solid #ccc;padding:8px;text-align:center;">No family details available</td></tr>'
              }
            </table>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Current business details:</strong></p>
            <ul>
              <li>Current business Name</li>
              <li>Constitution</li>
              <li>Nature of business/product or services details</li>
              <li>Running since</li>
              <li>Details of partners, director, shareholders with family background and other details</li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.currentBusinessDetails?.currentBusinessDetails || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Details of business premises</strong></p>
            <ul>
              <li>Address of business premises and additional places of business</li>
              <li>Ownership of all above business premises</li>
              <li>Size/area of business premises</li>
              <li>Comment on the business operations/footfall of customer/stock etc</li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.detailsOfBusinessPremises?.detailsOfBusinessPremises || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Details about business details</strong></p>
            <ul>
              <li>Brief about the product/services dealing</li>
              <li>No. of employee and salary details</li>
              <li>Quantum of stock</li>
              <li>No of Machinery and assets seen</li>
              <li>Turnover of last three years</li>
              <li>Product/service margins</li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.detailsAboutBusinessDetails?.detailsAboutBusinessDetails || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Details of supplier and customer</strong></p>
            <ul>
              <li>Brief about supplier and customer</li>
              <li>No of total suppliers and customers</li>
              <li>Credit period details</li>
              <li>Reference of min 2 suppliers and 2 customers</li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.detailsOfSupplierAndCustomer?.detailsOfSupplierAndCustomer || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Details of Property –</strong></p>
            <ul>
              <li>Whether customer visited the property</li>
              <li>Type of property</li>
              <li>Property is occupied by whom</li>
              <li>Source of property purchase</li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.detailsOfProperty?.detailsOfProperty || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Investment and properties -</strong></p>
            <ul>
              <li>Customer investment habits</li>
              <li>Whether current residence is owned or rented</li>
              <li>Details of assets built till date</li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.investmentAndProperties?.investmentAndProperties || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>End use of property/fund –</strong></p>
            <ul>
              <li>Proposed End use of property</li>
              <li>Clear and detailed end use of fund in LAP cases</li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.endUseOfPropertyFund?.endUseOfPropertyFund || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Details of loans –</strong></p>
            <ul>
              <li>Details of loan presently servicing</li>
              <li>Repayment account details</li>
              <li>End use of fund of loans</li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.detailsOfLoans?.detailsOfLoans || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Banking –</strong></p>
            <ul>
              <li>Details of all bank accounts</li>
              <li>Account open date</li>
              <li>% of total receipt routed through banking</li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.banking?.banking || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Document verification and other checks</strong></p>
            <ul>
              <li>Check all relevant sale/purchase register</li>
              <li>TPC from minimum 1 neighbour</li>
              <li>Check QR code, license, permits</li>
              <li>Google check and negative observation</li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.documentVerificationAndOtherChecks?.documentVerificationAndOtherChecks || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Final PD status (Positive/Negative) with comment</strong></p>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>${html_data.status || ""}</strong></p>
          </td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>Income assessment details</strong></p>
      <p style="margin:8px 0;line-height:1.5">(Please provide the monthly net income of applicant and also mention comment/mode of validation under the column "Comments"</p>

      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Particular</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Amount (Rs.) Monthly</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Comments</strong></p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Sales/receipt (Monthly average)</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.incomeAssessment?.salesReceiptMonthlyAverage || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.incomeAssessment?.salesComments || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Other income</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.incomeAssessment?.otherIncome || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.incomeAssessment?.otherIncomeComments || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Total Monthly income</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.incomeAssessment?.totalMonthlyIncome || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.incomeAssessment?.totalIncomeComments || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Cost of material/cost of Service</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.incomeAssessment?.costOfMaterial || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.incomeAssessment?.costComments || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Direct expenses</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.incomeAssessment?.directExpenses || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Salary</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.incomeAssessment?.salary || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Rent</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.incomeAssessment?.rent || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Electricity expenses</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.incomeAssessment?.electricityExpenses || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Other miscellaneous expenses</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.incomeAssessment?.otherMiscellaneousExpenses || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Other family expenses</p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.incomeAssessment?.otherFamilyExpenses || ""}</p></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Net monthly Appraisal income</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>${verificationData.incomeAssessment?.netMonthlyAppraisalIncome || ""}</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Less : - Monthly obligations/EMI which are not getting closed</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>${verificationData.incomeAssessment?.monthlyObligationsEmi || ""}</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Net residual income (monthly)</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>${verificationData.incomeAssessment?.netResidualIncome || ""}</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>Disclaimer Clause:</strong></p>
      <p style="margin:8px 0;line-height:1.5">This report (including any attachments) has been prepared based on verbal information provided by the person contacted. HERO HOUSING FINANCE LTD will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. <strong>M/s. KOWTHA & CO </strong>will not be held liable in any case.</p>

      <p style="margin:8px 0;line-height:1.5"><strong>Photos with Geo coordinates of location</strong></p>
    </div>

    <footer class="pdf-footer">
      <span style="color:rgb(8, 136, 36);">${html_data.bankName || "Hero Housing Self-Employed"}</span><br>
      Generated on ${istDate}
    </footer>
    ${html_data.imagesData || ""}
  `;
};
