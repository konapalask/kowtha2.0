import { format, toZonedTime } from "date-fns-tz";
import { category } from "google-play-scraper";
import * as path from "path";
import * as fs from "fs";
import { AxisFinanceUBLInterface } from "../interface/axis-finance-ubl.interface";
import { pdBaseTemplate } from "./pd-base.tempate";

export const axisFinanceUBLTemplate = (
  verificationData: AxisFinanceUBLInterface,
  html_data: any
) => {
  const recommendationStyles: Record<string, string> = {
    positive: '<li style="color: green; font-weight: bold;">POSITIVE</li>',
    negative: '<li style="color: red; font-weight: bold;">NEGATIVE</li>',
    credit_refer:
      '<li style="color: orange; font-weight: bold;">CREDIT REFER</li>',
  };

  const finalRecommendationHtml = recommendationStyles[html_data.status] || "";

  return `
    ${pdBaseTemplate()}

      <div class="report-title">PERSONAL DISCUSSION SHEET</div>
    
      <div class="align-wrapper">
        <table class="section-table">
          <tr>
          <th>Region</th>
          <th>Location</th>
          <th>Branch</th>
          <th>Ref No/Application No</th>
        </tr>
        <tr style="text-align: center;">
          <td><span class="var-value">${verificationData.basicDetails.region || ""}</span></td>
          <td><span class="var-value">${verificationData.basicDetails.location || ""}</span></td>
          <td><span class="var-value">${verificationData.basicDetails.branch || ""}</span></td>
          <td><span class="var-value">${html_data.applicationNumber || ""}</span></td>
        </tr>
        </table>
      </div>

      <div class="align-wrapper">
        <table class="section-table">
          <tr>
            <th>Name of the Customer</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails.applicantName || ""}</span></td>
          </tr>
          <tr>
            <th>Date of Report</th>
            <td colspan="5"><span class="var-value">${html_data.dateOfReport || ""}</span></td>
          </tr>
          <tr>
            <th>Name of Concern</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails.nameOfConcern || ""}</span></td>
          </tr>
          <tr>
            <th>Constitution</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails.constitution || ""}</span></td>
          </tr>
          <tr>
            <th>Initiated Address</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails.initiatedAddress || ""}</span></td>
          </tr>
          <tr>
            <th>Visited Address</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails.visitedAddress || ""}</span></td>
          </tr>
          <tr>
          <th>Phone No</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails.phoneNo || ""}</span></td>
          </tr>
          <tr>
            <th>Appointment Fixed</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails.appointmentFixed || ""}</span></td>
          </tr>
          <tr>
            <th>Structure of Loan</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails.structureOfLoan || ""}</span></td>
          </tr>
          <tr>
            <th>No of Visit</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails.noOfVisit || ""}</span></td>
          </tr>
          <tr>
            <th>Person Met</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails.personMet || ""}</span></td>
          </tr>
          <tr>
            <th>Visited By</th>
            <td colspan="5"><span class="var-value">${html_data.pd_officer || ""}</span></td>
          </tr>
          <tr>
            <th>About Applicant</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails.aboutApplicant || ""}</span></td>
          </tr>
          <tr>
            <th>Residential Details</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails.residentialDetails || ""}</span></td>
          </tr>
          <tr>
            <th>Co-Applicant Details</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails.coApplicantDetails || ""}</span></td>
          </tr>
        </table>
      </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Family Details</td></tr>
        <tr>
          <th>Name</th>
          <th>Relation with Applicant</th>
          <th>Age</th>
          <th>Qualification</th>
          <th>Occupation</th>
          <th>Staying With Applicant</th>
          <th>Mobile Number</th>
        </tr>
        ${
          Array.isArray(verificationData.familyDetails) &&
          verificationData.familyDetails.length > 0
            ? verificationData.familyDetails
                .map(
                  (familyMember) => `
            <tr>
              <td><span class="var-value">${familyMember.name || ""}</span></td>
              <td><span class="var-value">${familyMember.relation || ""}</span></td>
              <td><span class="var-value">${familyMember.age || ""}</span></td>
              <td><span class="var-value">${familyMember.educationalQualification || ""}</span></td>
              <td><span class="var-value">${familyMember.employmentType || ""}</span></td>
              <td><span class="var-value">${familyMember.stayingWithApplicant || ""}</span></td>
              <td><span class="var-value">${familyMember.mobileNumber || ""}</span></td>
            </tr>
          `
                )
                .join("")
            : '<tr><td colspan="6" style="text-align: center;">No family members details available</td></tr>'
        }
        <tr>
          <th>About the Business</th>
          <td colspan="6"><span class="var-value">${verificationData.basicDetails.aboutApplicant || ""}</span></td>
        </tr>
        <tr>
          <th>Documents Observed</th>
          <td colspan="6">
            ${
              Array.isArray(verificationData.uploadedItems) &&
              verificationData.uploadedItems.length > 0
                ? verificationData.uploadedItems
                    .map(
                      (doc) => `
                <span class="var-value">${doc.uri || ""} (${doc.type || ""}) - ${doc.timestamp || ""}</span><br>
              `
                    )
                    .join("")
                : '<span class="var-value">No documents observed</span>'
            }
          </td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Shareholding Details</td></tr>
        <tr>
          <th>Name of Shareholder</th>
          <th>Percentage of Shareholding</th>
          <th>Relationship with Applicant</th>
          <th>Designation</th>
          <th>Coming into Loan Structure</th>
          <th>Functional of Partner/Director</th>
        </tr>
        ${
          Array.isArray(verificationData.shareholdingDetails) &&
          verificationData.shareholdingDetails.length > 0
            ? verificationData.shareholdingDetails
                .map(
                  (shareholder) => `
            <tr>
              <td><span class="var-value">${shareholder.name || ""}</span></td>
              <td><span class="var-value">${shareholder.shareholdingPercentage || ""}%</span></td>
              <td><span class="var-value">${shareholder.relationshipWithApplicant || ""}</span></td>
              <td><span class="var-value">${shareholder.designation || ""}</span></td>
              <td><span class="var-value">${shareholder.comingIntoLoanStructure || ""}</span></td>
              <td><span class="var-value">${shareholder.functionOfPartnerOrDirector || ""}</span></td>
            </tr>
          `
                )
                .join("")
            : '<tr><td colspan="6" style="text-align: center;">No shareholding details available</td></tr>'
        }
        <tr>
          <th>About the Business</th>
          <td colspan="5"><span class="var-value">${verificationData.basicDetails.aboutApplicant || ""}</span></td>
        </tr>
        <tr>
          <th>Documents Observed</th>
          <td colspan="5">
            ${
              Array.isArray(verificationData.uploadedItems) &&
              verificationData.uploadedItems.length > 0
                ? verificationData.uploadedItems
                    .map(
                      (doc) => `
                <span class="var-value">${doc.uri || ""} (${doc.type || ""}) - ${doc.timestamp || ""}</span><br>
              `
                    )
                    .join("")
                : '<span class="var-value">No documents observed</span>'
            }
          </td>
        </tr>
      </table>
    </div>


    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Suppliers/Creditors</td></tr>
        <tr>
          <th>No of Fixed Suppliers</th>
          <td colspan="5"><span class="var-value">${verificationData.suppliersCreditors.numberOfFixedSuppliers || ""}</span></td>
        </tr>
        <tr>
          <th>Credit Period</th>
          <td colspan="5"><span class="var-value">${verificationData.suppliersCreditors.creditPeriod || ""}</span></td>
        </tr>
        <tr>
          <th>Cash-Cheque Proportion</th>
          <td colspan="5"><span class="var-value">${verificationData.suppliersCreditors.cashChequeProportions || ""}</span></td>
        </tr>
        <tr>
          <th>Top 3 Suppliers</th>
          <td colspan="5">
            ${
              Array.isArray(verificationData.suppliersCreditors?.suppliers) &&
              verificationData.suppliersCreditors?.suppliers.length > 0
                ? verificationData.suppliersCreditors?.suppliers
                    .map(
                      (supplier) => `
                <span class="var-value">${supplier.name || ""} - ${supplier.phone || ""} (${supplier.location || ""}) - ${supplier.review || ""}</span><br>
              `
                    )
                    .join("")
                : '<span class="var-value">No suppliers listed</span>'
            }
          </td>
        </tr>
        <tr><td colspan="6" class="section-header">Clients/Debtors</td></tr>
        <tr>
          <th>No of Fixed Customers</th>
          <td colspan="5"><span class="var-value">${verificationData.clientsDebtors.numberOfFixedCustomers || ""}</span></td>
        </tr>
        <tr>
          <th>Credit Period</th>
          <td colspan="5"><span class="var-value">${verificationData.clientsDebtors.creditPeriod || ""}</span></td>
        </tr>
        <tr>
          <th>Cash-Cheque Proportion</th>
          <td colspan="5"><span class="var-value">${verificationData.clientsDebtors.cashChequeProportions || ""}</span></td>
        </tr>
        <tr>
          <th>Top 3 Customers</th>
          <td colspan="5">
            ${
              Array.isArray(verificationData.clientsDebtors?.customers) &&
              verificationData.clientsDebtors?.customers.length > 0
                ? verificationData.clientsDebtors?.customers
                    .map(
                      (customer) => `
                <span class="var-value">${customer.name || ""} - ${customer.phone || ""} (${customer.location || ""}) - ${customer.review || ""}</span><br>
              `
                    )
                    .join("")
                : '<span class="var-value">No customers listed</span>'
            }
          </td>
        </tr>
        <tr>
          <th>Average Stock Maintainance</th>
          <td colspan="5"><span class="var-value">${verificationData.clientsDebtors.averageStockMaintenance || ""}</span></td>
        </tr>
        <tr>
          <th>Turnover & Margins</th>
          <td colspan="5"><span class="var-value">${verificationData.clientsDebtors.turnover || ""}</span></td>
        </tr>
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Expenditure</td></tr>
        <tr><td colspan="7" class="section-header">Salaries & Wages</td></tr>
        <tr>
          <th>No of Employees</th>
          <td colspan="6"><span class="var-value">${verificationData.salariesWages.numberOfEmployees || ""}</span></td>
        </tr>
        <tr>
          <th>Salary Per month per employee</th>
          <td colspan="6"><span class="var-value">${verificationData.salariesWages.salaryPerMonthPerEmployee || ""}</span></td>
        </tr>
        <tr>
          <th>Status of Employee</th>
          <td colspan="6"><span class="var-value">${verificationData.salariesWages.statusOfEmployee || ""}</span></td>
        </tr>
        <tr>
          <th>No. of Labours</th>
          <td colspan="6"><span class="var-value">${verificationData.salariesWages.numberOfLabours || ""}</span></td>
        </tr>
        <tr>
          <th>Wages per month/per day</th>
          <td colspan="6"><span class="var-value">${verificationData.salariesWages.wagesPerMonthPerDay || ""}</span></td>
        </tr>
        <tr>
          <th>Status of Labour</th>
          <td colspan="6"><span class="var-value">${verificationData.salariesWages.statusOfLabour || ""}</span></td>
        </tr>
        <tr>
          <th>Remarks</th>
          <td colspan="6"><span class="var-value">${verificationData.salariesWages.remarks || ""}</span></td>
        </tr>
        <tr>
          <th>Working Hours</th>
          <td colspan="6"><span class="var-value">${verificationData.salariesWages.workingHoursEnd || ""}</span></td>
        </tr>
        <tr>
          <th>Other Major Expenditure</th>
          <td colspan="6"><span class="var-value">${verificationData.salariesWages.otherMajorExpenditure || ""}</span></td>
        </tr>
        <tr><td colspan="7" class="section-header">Asset Details</td></tr>
        <tr><td colspan="7" class="section-header">All Immovable properties held that is Residential, Commercial, Land, Plot and any fixed structure</td></tr>
        <tr>
          <th>Address</th>
          <th>Area Measured in Sq.ft</th>
          <th>Purchase Cost in Lakhs</th>
          <th>Purchase Year</th>
          <th>Market Value in Lakhs</th>
          <th>Owner Name</th>
          <th>Mortgaged</th>
        </tr>
        ${
          Array.isArray(verificationData.assetDetails?.assets) &&
          verificationData.assetDetails?.assets.length > 0
            ? verificationData.assetDetails?.assets
                .map(
                  (property) => `
            <tr>
              <td><span class="var-value">${property.address || ""}</span></td>
              <td><span class="var-value">${property.areaMeasured || ""}</span></td>
              <td><span class="var-value">${property.purchaseCost || ""}</span></td>
              <td><span class="var-value">${property.purchaseYear || ""}</span></td>
              <td><span class="var-value">${property.marketValue || ""}</span></td>
              <td><span class="var-value">${property.ownerName || ""}</span></td>
              <td><span class="var-value">${property.mortgaged || ""}</span></td>
            </tr>
          `
                )
                .join("")
            : '<tr><td colspan="7" style="text-align: center;">No immovable properties listed</td></tr>'
        }
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr>
          <th>Any Liquid, Moveable & Monetary items such as Cash,Gold, FD, RD, Mutual Fund Holdings, Shares, Bonds,Securities </th>
          <td colspan="6"><span class="var-value">${verificationData.assetDetails.liquidMoveableMonetaryItems || ""}</span></td>
        </tr>
        <tr>
          <th>Life Insurance, Mediclaim, Property/Asset Insurance(Premium & Sum Assured) </th>
          <td colspan="6"><span class="var-value">${verificationData.assetDetails.lifeInsuranceMediclaim || ""}</span></td>
        </tr>
        <tr>
          <th>Capital invested in any business, Loans & Advances given</th>
          <td colspan="6"><span class="var-value">${verificationData.assetDetails.capitalInvestedBusiness || ""}</span></td>
        </tr>
        <tr>
          <th>Car, Bike and any other vehicle (Company Name and Model)</th>
          <td colspan="6">
            ${
              Array.isArray(verificationData.assetDetails?.vehicles) &&
              verificationData.assetDetails?.vehicles.length > 0
                ? verificationData.assetDetails?.vehicles
                    .map(
                      (vehicle) => `
                <span class="var-value">${vehicle.companyName || ""} ${vehicle.model || ""}</span><br>
              `
                    )
                    .join("")
                : '<span class="var-value">No vehicles listed</span>'
            }
          </td>
        </tr>
        </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Existing EMI's/Loans</td></tr>
        <tr>
          <th>Bank Name</th>
          <th>Purpose</th>
          <th>Loan Amount</th>
          <th>EMI</th>
          <th>Tenure</th>
        </tr>
        ${
          Array.isArray(verificationData.existingLoans?.loans) &&
          verificationData.existingLoans?.loans.length > 0
            ? verificationData.existingLoans?.loans
                .map(
                  (loan) => `
            <tr>
              <td><span class="var-value">${loan.bankName || ""}</span></td>
              <td><span class="var-value">${loan.purpose || ""}</span></td>
              <td><span class="var-value">${loan.tenure || ""}</span></td>
              <td><span class="var-value">${loan.loanAmount || ""}</span></td>
              <td><span class="var-value">${loan.emi || ""}</span></td>
            </tr>
          `
                )
                .join("")
            : '<tr><td colspan="7" style="text-align: center;">No existing loans details available</td></tr>'
        }
        </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Bank Details</td></tr>
        <tr>
          <th>Name</th>
          <th>Branch Name</th>
          <th>Account Type</th>
          <th>Open Since Year</th>
        </tr>
        ${
          Array.isArray(verificationData.existingLoans) &&
          verificationData.existingLoans.length > 0
            ? verificationData.existingLoans
                .map(
                  (loan) => `
            <tr>
              <td><span class="var-value">${loan.bankName || ""}</span></td>
              <td><span class="var-value">${loan.purpose || ""}</span></td>
              <td><span class="var-value">${loan.tenure || ""}</span></td>
              <td><span class="var-value">${loan.sanctionedAmount || ""}</span></td>
              <td><span class="var-value">${loan.outstandingBalance || ""}</span></td>
              <td><span class="var-value">${loan.emi || ""}</span></td>
              <td><span class="var-value">${loan.bankName || ""}</span></td>
              <td><span class="var-value">${loan.securedAgainst || ""}</span></td>
            </tr>
          `
                )
                .join("")
            : '<tr><td colspan="7" style="text-align: center;">No bank details available</td></tr>'
        }
        </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Third Party Check</td></tr>
        <tr>
          <th>Individual/Business Name</th>
          <th>Mobile Number</th>
          <th>Relationship</th>
          <th>Comments</th>
          <th>Feedback Status</th>
        </tr>
          ${
            Array.isArray(verificationData.thirdPartyCheck?.checks) &&
            verificationData.thirdPartyCheck?.checks.length > 0
              ? verificationData.thirdPartyCheck?.checks
                  .map(
                    (tpc) => `
              <tr>
                <td><span class="var-value">${tpc.tpcName || ""}</span></td>
                <td><span class="var-value">${tpc.mobileNumber || ""}</span></td>
                <td><span class="var-value">${tpc.relationship || ""}</span></td>
                <td><span class="var-value">${tpc.comments || ""}</span></td>
                <td><span class="var-value">${tpc.feedbackStatus || ""}</span></td>
              </tr>
            `
                  )
                  .join("")
              : '<tr><td colspan="6" style="text-align: center;">No third party checks details available</td></tr>'
          }

      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr>
          <th>Observations</th>
          <td colspan="6"><span class="var-value">${verificationData.assetDetails.observations || ""}</span></td>
        </tr>
        <tr>
          <th>Other Income: (Income from other than initiated business)</th>
          <td colspan="6"><span class="var-value">${verificationData.assetDetails.otherIncome || ""}</span></td>
        </tr>
        <tr>
          <th>Site Coordinates</th>
          <td colspan="6"><span class="var-value">${verificationData.assetDetails.siteCoordinates || ""}</span></td>
        </tr>
        <tr>
          <th>Remarks</th>
          <td colspan="6"><span class="var-value">${verificationData.assetDetails.remarks || ""}</span></td>
        </tr>
        <tr>
          <th>Status</th>
          <td colspan="6"><span class="var-value">${verificationData.assetDetails.status || ""}</span></td>
        </tr>
        <tr>
          <th>AFL Verifier's Name & Emp Code</th>
          <td colspan="6"><span class="var-value"> - </span></td>
        </tr>
        <tr>
          <th>AFL Verifier's Signature</th>
          <td colspan="6"><span class="var-value"> - </span></td>
        </tr>
    </table>
    </div>
    <br>
    <img src="${html_data.imageDataUri}" width="50%" height="40%" style="margin-left: 2%;" />
    <footer class="pdf-footer">
      <span style="color:rgb(8, 136, 36);">${"Bank of India"}</span><br>
      Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
    </footer>
  `;
};
