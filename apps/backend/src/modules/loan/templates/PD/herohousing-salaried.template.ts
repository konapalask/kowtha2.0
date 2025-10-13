import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate } from "./pd-base.tempate";

export const herohousingSalariedTemplate = (
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
      <p style="margin:8px 0;line-height:1.5"><strong>PD REPORT – CASH SALARIED/SALARIED</strong></p>
      
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Loan account No.</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${html_data.applicationNumber || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of customer</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.general?.nameOfCustomer || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Person met in PD and relationship with customer</strong></p>
            <p style="margin:8px 0;line-height:1.5"><strong>Mention the reason if customer was not available during the visit</strong></p>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.general?.personMetInPdAndRelationshipWithCustomer || ""}</p>
            <p style="margin:8px 0;line-height:1.5">${verificationData.general?.reasonIfCustomerNotAvailableDuringVisit || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>PD Visit date and time</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.general?.pdVisitDateAndTime || html_data.dateOfReport || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>PD address</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.general?.pdAddress || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Lat log of office address</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.general?.latLongOfOfficeAddress || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Requested loan amount</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.requestedLoanAmount?.requestedLoanAmount || ""}</p></td>
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
            <p style="margin:8px 0;line-height:1.5">${verificationData.profileOfCustomerBorrowerDetails?.borrowerDetails || ""}</p>
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
                Array.isArray(verificationData.familyDetails?.familyDetails) &&
                verificationData.familyDetails?.familyDetails.length > 0
                  ? verificationData.familyDetails?.familyDetails
                      .map(
                        (member) => `
              <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.name || ""}</p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.relationshipWithApplicant || ""}</p></td>
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
            <p style="margin:8px 0;line-height:1.5"><strong>Current Job profile</strong></p>
            <ul>
              <li>Name of Employer</li>
              <li>Working since</li>
              <li>Type of employment (permanent/Contractual)</li>
              <li>Designation</li>
              <li>Job profile</li>
              <li>Reporting to (Name/Designation)</li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.currentJobProfile?.nameOfEmployer || ""}</p>
            <p style="margin:8px 0;line-height:1.5">${verificationData.totalExperience?.grossSalaryAndNetSalary || ""}</p>
            <p style="margin:8px 0;line-height:1.5">${verificationData.totalExperience?.typeOfEmploymentPermanentContractual || ""}</p>
            <p style="margin:8px 0;line-height:1.5">${verificationData.totalExperience?.designation || ""}</p>
            <p style="margin:8px 0;line-height:1.5">${verificationData.totalExperience?.jobProfile || ""}</p>
            <p style="margin:8px 0;line-height:1.5">${verificationData.totalExperience?.reportingToNameDesignation || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Details of employer</strong></p>
            <ul>
              <li>Current business Name</li>
              <li>Constitution</li>
              <li>Nature of business/product or services details</li>
              <li>Running since</li>
              <li>Details of partners, director, shareholders with family background and other details</li>
              <li>No. of employee and set up of business</li>
              <li>Quantum of stock</li>
              <li>No of Machinery and assets seen</li>
              <li>Brief details about the locality of business, surrounding competitors, overall prospect of location etc and any negative feedback</li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.detailsOfEmployer?.detailsOfEmployerDescription || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Details of Property –</strong></p>
            <ul>
              <li>Whether customer visited the property</li>
              <li>Type of property (Ready build/Plot/Self Construction/under construction/vacant etc)</li>
              <li>Property is occupied by whom and reason if not self-occupied</li>
              <li>Source of property purchase (through dealer, builder/reference/relative)</li>
              <li>Name of seller and any relationship with customer</li>
              <li>Type of property/structure and area,</li>
              <li>What is actual deal value and sale deed value, OCR source</li>
              <li>Whether seller is having any loan on the property</li>
              <li>When seller bought the property,</li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.detailsOfProperty?.detailsOfPropertyDescription || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Investment and properties -</strong></p>
            <ul>
              <li>What is customer investment habits and he is doing any monthly saving in any of saving scheme, investment in properties, FD or any other nature of saving</li>
              <li>Whether current residence is owned or rented and rent amount if any</li>
              <li>Details of assets built till date (Including immovable properties, movable property, gold, FD, Equity investment, other savings)</li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.investmentAndProperties?.investmentAndPropertiesDescription || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>End use of property/fund –</strong></p>
            <ul>
              <li>Proposed End use of property (self-occupation/investment etc) for HL/P+C/Self construction cases</li>
              <li>Clear and detailed end use of fund in LAP cases</li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.endUseOfPropertyFund?.endUseOfPropertyFundDescription || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Details of loans –</strong></p>
            <ul>
              <li>Please check and provide the details of loan presently servicing and whether he will be closing such loans or going to continue,</li>
              <li>Repayment account from which all these EMI are getting paid</li>
              <li>What was the end use of fund of these loans (All BL/PL/LAP loan taken in last 3 years), also please check if there is any exceptional borrowing in last 12 months than exact use</li>
              <li>Also check if any home loan/LAP than what is address of mortgage property, usage of such property, any OD limit or any other facility in the name of customer</li>
              <li>Comment whether there is any bouncing in loans and if yes, period and reason of such bounces</li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.detailsOfLoans?.detailsOfLoansDescription || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Banking –</strong></p>
            <ul>
              <li>Please check and mention details of all his bank account, account open date, Name of bank account where salary is getting credited (if bank salary)</li>
              <li>Please check any saving account of applicant and co applicant and provide the details of these accounts</li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.banking?.bankingDescription || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Document verification and other checks</strong></p>
            <ul>
              <li>Please check all Payroll register, attendance register to check employment and salary details of applicant and share observations</li>
              <li>TPC from minimum 1 neighbour and 1 local independent party to be done (It should be done by showing the photo of customer and employment to be confirmed in the name of customer with existence period</li>
              <li>Additional check to be done from reference if there is any family relationship with employer and employee</li>
              <li>Please check all QR code, license, permits, name board, contact number etc and all these belongs to employer and share observations</li>
              <li>Google check and any negative observation/feedback/dedupe match or any other feedback</li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${verificationData.documentVerificationAndOtherChecks?.documentVerificationAndOtherChecksDescription || ""}</p>
          </td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>Disclaimer Clause:</strong></p>
      <p style="margin:8px 0;line-height:1.5">This report (including any attachments) has been prepared based on verbal information provided by the person contacted. HERO HOUSING FINANCE LTD will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. <strong>M/s. KOWTHA & CO </strong>will not be held liable in any case.</p>

      <p style="margin:8px 0;line-height:1.5"><strong>Photos with Geo coordinates of location</strong></p>
    </div>

    <footer class="pdf-footer">
      <span style="color:rgb(8, 136, 36);">${html_data.bankName || "Hero Housing Salaried"}</span><br>
      Generated on ${istDate}
    </footer>
    ${html_data.imagesData || ""}
  `;
};
