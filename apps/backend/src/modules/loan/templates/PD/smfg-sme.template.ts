import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate } from "./pd-base.tempate";

export const smfgSmeTemplate = (verificationData: any, html_data: any) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  return `
    ${pdBaseTemplate()}

    <div class="report-title">PERSONAL DISCUSSION REPORT - SMFG SME</div>
    
      <div class="align-wrapper">
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td colspan="5" style="border:1px solid #ccc;padding:8px"><strong></strong></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Sl</td>
          <td style="border:1px solid #ccc;padding:8px">Branch Name</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.basicDetails?.branch || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">1</td>
          <td style="border:1px solid #ccc;padding:8px">Application Reference No.</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.basicDetails?.applicationReferenceNo || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">2</td>
          <td style="border:1px solid #ccc;padding:8px">Applicant Name</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.basicDetails?.applicantName || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">3</td>
          <td style="border:1px solid #ccc;padding:8px">Applicant Office Address</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.basicDetails?.applicantOfficeAddress || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">4</td>
          <td style="border:1px solid #ccc;padding:8px">Person Met - Name, Designation & Mobile No</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.basicDetails?.personMetName || ""}, ${verificationData.basicDetails?.personMetDesignation || ""}, ${verificationData.basicDetails?.personMetMobileNo || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">5</td>
          <td style="border:1px solid #ccc;padding:8px">Personal Information:</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"> </td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">a</td>
          <td style="border:1px solid #ccc;padding:8px">Details of family members name, age and occupation: (pls tick on dependents)</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">
            ${
              Array.isArray(
                verificationData.personalInformation?.familyMembers
              ) &&
              verificationData.personalInformation?.familyMembers.length > 0
                ? verificationData.personalInformation.familyMembers
                    .map(
                      (member) =>
                        `${member.name || ""} - ${member.age || ""} Yrs, ${member.occupation || ""}${member.isDependent === "Yes" ? " (Dependent)" : ""}`
                    )
                    .join(", ")
                : ""
            }
          </td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">b</td>
          <td style="border:1px solid #ccc;padding:8px">Residence Address</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.personalInformation?.residenceAddress || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">c</td>
          <td style="border:1px solid #ccc;padding:8px">whether self owned/parental/rented</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.personalInformation?.ownershipStatus || ""}</td>
  </tr>
    <tr>
          <td style="border:1px solid #ccc;padding:8px">d</td>
          <td style="border:1px solid #ccc;padding:8px">Area of the house property and estimated market value</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.personalInformation?.areaOfHouseProperty || ""}, ${verificationData.personalInformation?.estimatedMarketValue || ""}</td>
  </tr>
    <tr>
          <td style="border:1px solid #ccc;padding:8px">e</td>
          <td style="border:1px solid #ccc;padding:8px">No. of Years at same Residence</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.residenceAndPropertyDetails?.noOfYearsInSameCity || ""}</td>
  </tr>
    <tr>
          <td style="border:1px solid #ccc;padding:8px">f</td>
          <td style="border:1px solid #ccc;padding:8px">No. of years in same city</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.residenceAndPropertyDetails?.noOfYearsInSameCity || ""}</td>
  </tr>
    <tr>
          <td style="border:1px solid #ccc;padding:8px">g</td>
          <td style="border:1px solid #ccc;padding:8px">Permanent Address</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.residenceAndPropertyDetails?.permanentAddress || ""}</td>
  </tr>
    <tr>
          <td style="border:1px solid #ccc;padding:8px">h</td>
          <td style="border:1px solid #ccc;padding:8px">Details of other owned property in the city</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.residenceAndPropertyDetails?.detailsOfOtherOwnedProperty || ""}</td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px">i</td>
          <td style="border:1px solid #ccc;padding:8px">Any other source of income apart from this business</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.residenceAndPropertyDetails?.anyOtherSourceOfIncome || ""}</td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px">6</td>
          <td style="border:1px solid #ccc;padding:8px">Business Information</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"> </td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px">a</td>
          <td style="border:1px solid #ccc;padding:8px">Name of Business</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.businessInformation?.nameOfBusiness || ""}</td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px">b</td>
          <td style="border:1px solid #ccc;padding:8px">Nature of Business</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.businessInformation?.natureOfBusiness || ""}</td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px">c</td>
          <td style="border:1px solid #ccc;padding:8px">Constitution</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.businessInformation?.constitution || ""}</td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px">d</td>
          <td style="border:1px solid #ccc;padding:8px">Name of Partners/Directors and share %</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">
            ${
              Array.isArray(
                verificationData.businessInformation?.partnersDirectorsDetails
              ) &&
              verificationData.businessInformation?.partnersDirectorsDetails
                .length > 0
                ? verificationData.businessInformation.partnersDirectorsDetails
                    .map(
                      (partner) =>
                        `${partner.name || ""} - ${partner.sharePercentage || ""}%`
                    )
                    .join(", ")
                : ""
            }
          </td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px">e</td>
          <td style="border:1px solid #ccc;padding:8px">Type of Customer</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.businessInformation?.typeOfCustomer || ""}</td>
  </tr> 
  <tr>
          <td style="border:1px solid #ccc;padding:8px">f</td>
          <td style="border:1px solid #ccc;padding:8px">Stability in same business - No of Years</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.businessInformation?.stabilityInSameBusinessYears || ""}</td>
  </tr> 
  <tr>
          <td style="border:1px solid #ccc;padding:8px">g</td>
          <td style="border:1px solid #ccc;padding:8px">Whether the stability was verified by any Registration certificate / distribution / dealership letter displayed in shop / office / Factory</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.businessInformation?.stabilityVerifiedBy || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">h</td>
          <td style="border:1px solid #ccc;padding:8px">Family Structure involved in Business</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.businessInformation?.familyStructureInvolvedInBusiness || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">I</td>
          <td style="border:1px solid #ccc;padding:8px">Business Premises whether owned or rented</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.businessInformation?.businessPremisesOwnership || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">J</td>
          <td style="border:1px solid #ccc;padding:8px">Actual monthly sales/Receipts as per Customer</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.salesAndFinancials?.actualMonthlySales || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">K</td>
          <td style="border:1px solid #ccc;padding:8px">What % sales is done on credit</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.salesAndFinancials?.percentSalesOnCredit || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">L</td>
          <td style="border:1px solid #ccc;padding:8px">Manufacturing process / Trading details</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.businessInformation?.natureOfBusiness || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">M</td>
          <td style="border:1px solid #ccc;padding:8px">Whether sales concentration is &gt;50% on one party. If yes name of Party and contact no</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.salesAndFinancials?.majorCustomers || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">N</td>
          <td style="border:1px solid #ccc;padding:8px">Business Cycle -How many days credit allowed to Debtors and what are actual debtors amount as on date</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">O</td>
          <td style="border:1px solid #ccc;padding:8px">Business Cycle - How many days credit allowed by creditors to CM and what are actual Creditors amount as on date</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">P</td>
          <td style="border:1px solid #ccc;padding:8px">Business Cycle – What is stock valuation as on date</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">Q</td>
          <td style="border:1px solid #ccc;padding:8px">Gross & Net margins % in Business</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">R</td>
          <td style="border:1px solid #ccc;padding:8px">Monthly Net saving after all expenses in Rs</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">S</td>
          <td style="border:1px solid #ccc;padding:8px">Name and contact no of two major suppliers</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">
            ${
              Array.isArray(
                verificationData.customersAndSuppliers?.suppliers
              ) && verificationData.customersAndSuppliers?.suppliers.length > 0
                ? verificationData.customersAndSuppliers.suppliers
                    .map(
                      (supplier) =>
                        `${supplier.name || ""} - ${supplier.contactNo || ""}`
                    )
                    .join(", ")
                : ""
            }
          </td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">T</td>
          <td style="border:1px solid #ccc;padding:8px">Name and contact no of two major buyers</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">
            ${
              Array.isArray(
                verificationData.customersAndSuppliers?.customers
              ) && verificationData.customersAndSuppliers?.customers.length > 0
                ? verificationData.customersAndSuppliers.customers
                    .map(
                      (customer) =>
                        `${customer.name || ""} - ${customer.contactNo || ""}`
                    )
                    .join(", ")
                : ""
            }
          </td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">U</td>
          <td style="border:1px solid #ccc;padding:8px">No of Employees</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">V</td>
          <td style="border:1px solid #ccc;padding:8px">Name board seen if yes what was written</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">W</td>
          <td style="border:1px solid #ccc;padding:8px">Locality of Business/Office</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">X</td>
          <td style="border:1px solid #ccc;padding:8px">Whether Residence cum office set up</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">Y</td>
          <td style="border:1px solid #ccc;padding:8px">Applicability of VAT / Excise / Service tax and rate of same</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">Z</td>
          <td style="border:1px solid #ccc;padding:8px">Latest Qtr VAT return value/Service tax paid</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">7</td>
          <td style="border:1px solid #ccc;padding:8px">Environmental and Social Safeguards (ESS)</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"></td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">a.</td>
          <td style="border:1px solid #ccc;padding:8px">Is the entity involved in any commercial pest control operation, use any Ozone depleting substance, hazardous chemicals, bio medical waste, Dyes, forest products, tobacco, alcohol, weapons, gambling, radioactive materials, unbounded asbestos, harmful fishing practice, commercial logging.</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">b.</td>
          <td style="border:1px solid #ccc;padding:8px">Does the entity involve in Child or forced Labour or business involve displacement of people, impact on indigenous people or established in land designated as forest or forest products</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">c.</td>
          <td style="border:1px solid #ccc;padding:8px">Does the entity have required consent of establishment from State pollution control board and other government authorities on establishment in Wetland Area, near National Park, Sanctuaries or Forest areas, ASI certificate for establishment up to 300 meters near a protected monument or cultural heritage, 500 meters near Coastal Regulation Zone</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">d.</td>
          <td style="border:1px solid #ccc;padding:8px">Does the entity involves in proper mechanism for treatment or disposal of waste and does not emit air, water or noise pollutants.</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">e.</td>
          <td style="border:1px solid #ccc;padding:8px">Does the Entity comply with the above ESS guidelines</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">Others:</td>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"></td>
  </tr>
  <tr>
          <td colspan="5" style="border:1px solid #ccc;padding:8px"><strong>Existing Loan Details</strong></td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Type of Loan</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Bank Name</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Loan Amt</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>EMI</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Tenure remaining</strong></td>
        </tr>
        ${
          Array.isArray(verificationData.existingLoans?.existingLoans) &&
          verificationData.existingLoans?.existingLoans.length > 0
            ? verificationData.existingLoans.existingLoans
                .map(
                  (loan) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px">${loan.typeOfLoan || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.bankName || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.loanAmount || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.emi || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.status || ""}</td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="5" style="border:1px solid #ccc;padding:8px;text-align:center;">No existing loans</td></tr>'
        }
        <tr>
          <td style="border:1px solid #ccc;padding:8px">B</td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Banking Details :-</strong></td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"> </td>
        </tr>
        ${
          Array.isArray(verificationData.bankingDetails?.bankingDetails) &&
          verificationData.bankingDetails?.bankingDetails.length > 0
            ? verificationData.bankingDetails.bankingDetails
                .map(
                  (bank) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px"> </td>
          <td style="border:1px solid #ccc;padding:8px">Bank Name – ${bank.bankName || ""}</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"></td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"> </td>
          <td style="border:1px solid #ccc;padding:8px">Account Type – ${bank.accountType || ""}</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"></td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"> </td>
          <td style="border:1px solid #ccc;padding:8px">Vintage of account – ${bank.noOfYears || ""} years</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"></td>
  </tr>
        `
                )
                .join("")
            : '<tr><td colspan="5" style="border:1px solid #ccc;padding:8px;text-align:center;">No banking details available</td></tr>'
        }
        <tr>
          <td style="border:1px solid #ccc;padding:8px"> </td>
          <td style="border:1px solid #ccc;padding:8px">If CC/OD limit- what is limit – Min Bal</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">NA</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">c</td>
          <td style="border:1px solid #ccc;padding:8px">Customer Behavior</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">8</td>
          <td style="border:1px solid #ccc;padding:8px">Detailed purpose/End use of Loan Amount</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">9</td>
          <td style="border:1px solid #ccc;padding:8px">Detailed observations (Positive and Negative)</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.observation?.observation || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">10</td>
          <td style="border:1px solid #ccc;padding:8px">Status of PD</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">11</td>
          <td style="border:1px solid #ccc;padding:8px"><strong>PD conducted by:</strong></td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"> </td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"> </td>
          <td style="border:1px solid #ccc;padding:8px">Name : -</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">Designation : -</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"> </td>
          <td style="border:1px solid #ccc;padding:8px">Signature :</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"></td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"> </td>
          <td style="border:1px solid #ccc;padding:8px">Date: -</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">Time : -</td>
  </tr>
        </table>
      <p style="margin:8px 0;line-height:1.5"><strong>Photo:</strong></p>
      </div>

    <footer class="pdf-footer">
      <span style="color:rgb(8, 136, 36);">${html_data.bankName || "SMFG SME"}</span><br>
      Generated on ${istDate}
    </footer>
    ${html_data.imagesData || ""}
  `;
};
