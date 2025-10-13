import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate } from "./pd-base.tempate";

export const tataUblTemplate = (verificationData: any, html_data: any) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  return `
    ${pdBaseTemplate()}

    <div class="report-title">Personal Discussion Report (For Tata Capital Limited)</div>

        <div class="align-wrapper">
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Sr. No.</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Particular Head</strong></td>
          <td colspan="9" style="border:1px solid #ccc;padding:8px"><strong>Particular Description</strong></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">1</td>
          <td style="border:1px solid #ccc;padding:8px">Name of Applicant</td>
          <td colspan="9" style="border:1px solid #ccc;padding:8px">${verificationData.basicDetails?.nameOfApplicant || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">2</td>
          <td style="border:1px solid #ccc;padding:8px">Name of Entity</td>
          <td colspan="9" style="border:1px solid #ccc;padding:8px">${verificationData.basicDetails?.nameOfEntity || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">3</td>
          <td style="border:1px solid #ccc;padding:8px">Name of Co-Applicant(s)</td>
          <td colspan="9" style="border:1px solid #ccc;padding:8px">${verificationData.basicDetails?.nameOfCoApplicants || ""}</td>
        </tr>
        <tr>
          <td rowspan="3" style="border:1px solid #ccc;padding:8px">4</td>
          <td rowspan="3" style="border:1px solid #ccc;padding:8px">Proposed Loan Details</td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px"><strong>Product</strong></td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"><strong>Amount</strong></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Tenure</strong></td>
        </tr>
        <tr>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">${verificationData.proposedLoanDetails?.product || ""}</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.proposedLoanDetails?.amount || ""}</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.proposedLoanDetails?.tenure || ""}</td>
        </tr>
        <tr>
          <td colspan="4" style="border:1px solid #ccc;padding:8px"><strong>Repayment from</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">
            Bank name – ${verificationData.proposedLoanDetails?.bankName || ""}<br>
            Type - ${verificationData.proposedLoanDetails?.typeSAAccount || ""}<br>
            Account No. - ${verificationData.proposedLoanDetails?.accountNo || ""}
          </td>
        </tr>
        <tr>
          <td rowspan="3" style="border:1px solid #ccc;padding:8px">5</td>
          <td rowspan="3" style="border:1px solid #ccc;padding:8px">Office Address</td>
          <td colspan="9" style="border:1px solid #ccc;padding:8px"><strong>Add –</strong> ${verificationData.officeAddress?.add || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Rented/Owned</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Owned by</strong></td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px"><strong>Area(In Sq. Ft.)</strong></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Occupied since(years)</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>CMV / Rent p.m.</strong></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.officeAddress?.rentedOwned || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.officeAddress?.ownedBy || ""}</td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">${verificationData.officeAddress?.areaSqFt || ""}</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.officeAddress?.occupiedSinceYears || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.officeAddress?.cmvRentPerMonth || ""}</td>
        </tr>
        <tr>
          <td rowspan="3" style="border:1px solid #ccc;padding:8px">6</td>
          <td rowspan="3" style="border:1px solid #ccc;padding:8px">Residential Address</td>
          <td colspan="9" style="border:1px solid #ccc;padding:8px"><strong>Add –</strong> ${verificationData.residentialAddress?.add || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Rented/Owned</strong></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Owned by</strong></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Area(In Sq. Ft.)</strong></td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"><strong>Occupied since(years)</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>CMV / Rent p.m.</strong></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residentialAddress?.rentedOwned || ""}</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.residentialAddress?.ownedBy || ""}</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.residentialAddress?.areaSqFt || ""}</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.residentialAddress?.occupiedSinceYears || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residentialAddress?.cmvRentPerMonth || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">7</td>
          <td style="border:1px solid #ccc;padding:8px">Address of PD</td>
          <td colspan="9" style="border:1px solid #ccc;padding:8px">${verificationData.residentialAddress?.addressOfPDAndPersonMet || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">8</td>
          <td style="border:1px solid #ccc;padding:8px">Family Details</td>
          <td colspan="9" style="border:1px solid #ccc;padding:8px">
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
              <tr>
                <td style="border:1px solid #ccc;padding:8px"><strong>Name</strong></td>
                <td style="border:1px solid #ccc;padding:8px"><strong>Age</strong></td>
                <td style="border:1px solid #ccc;padding:8px"><strong>Qualification</strong></td>
                <td style="border:1px solid #ccc;padding:8px"><strong>Profession</strong></td>
                <td style="border:1px solid #ccc;padding:8px"><strong>Relation</strong></td>
                <td style="border:1px solid #ccc;padding:8px"><strong>Monthly Income</strong></td>
              </tr>
              ${
                Array.isArray(verificationData.familyDetails?.familyDetails) &&
                verificationData.familyDetails?.familyDetails.length > 0
                  ? verificationData.familyDetails.familyDetails
                      .map(
                        (family) => `
              <tr>
                <td style="border:1px solid #ccc;padding:8px">${family.name || ""}</td>
                <td style="border:1px solid #ccc;padding:8px">${family.age || ""}</td>
                <td style="border:1px solid #ccc;padding:8px">${family.qualification || ""}</td>
                <td style="border:1px solid #ccc;padding:8px">${family.profession || ""}</td>
                <td style="border:1px solid #ccc;padding:8px">${family.relation || ""}</td>
                <td style="border:1px solid #ccc;padding:8px">${family.monthlyIncome || ""}</td>
              </tr>
              `
                      )
                      .join("")
                  : '<tr><td colspan="6" style="border:1px solid #ccc;padding:8px;text-align:center;">No family details available</td></tr>'
              }
            </table>
          </td>
        </tr>
      </table>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px">9</td>
          <td style="border:1px solid #ccc;padding:8px">Current Business Details</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessDetails?.currentBusinessDetails || ""}</td>
        </tr>
      </table>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px">10</td>
          <td style="border:1px solid #ccc;padding:8px">Stock as on date</td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px">${verificationData.businessDetails?.stockAsOnDate || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">11</td>
          <td style="border:1px solid #ccc;padding:8px">Employees Details</td>
          <td colspan="8" style="border:1px solid #ccc;padding:8px">
            <strong>Current Employees: </strong>${verificationData.employeesDetails?.currentEmployees || ""}<br>
            <strong>Salary Range: </strong>${verificationData.employeesDetails?.salaryRange || ""}<br>
            <strong>Key Employee Name - </strong>${verificationData.employeesDetails?.keyEmployeeName || ""}
          </td>
        </tr>
        <tr>
          <td rowspan="2" style="border:1px solid #ccc;padding:8px">12</td>
          <td rowspan="2" style="border:1px solid #ccc;padding:8px">Bank Details</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Primary Banker</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px"><strong>Nature of Account</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Avg. Bal</strong></td>
        </tr>
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.bankDetails?.primaryBanker || ""}</td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.bankDetails?.natureOfAccount || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.bankDetails?.avgBal || ""}</td>
        </tr>
        <tr>
          <td rowspan="8" style="border:1px solid #ccc;padding:8px">13</td>
          <td rowspan="8" style="border:1px solid #ccc;padding:8px">Sales and Profit Details</td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">Turnover (FY 2024-25)</td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">${verificationData.salesAndProfitDetails?.turnoverFY202425 || ""}</td>
        </tr>
        <tr>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">Exp. Turnover (FY 2025-26)</td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">${verificationData.salesAndProfitDetails?.expTurnoverFY202526 || ""}</td>
        </tr>
        <tr>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">Monthly Turnover / Sales</td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">${verificationData.salesAndProfitDetails?.monthlyTurnoverSales || ""}</td>
        </tr>
        <tr>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">Net Monthly Income</td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">${verificationData.salesAndProfitDetails?.netMonthlyIncome || ""}</td>
        </tr>
        <tr>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">Profit Margin</td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">${verificationData.salesAndProfitDetails?.profitMargin || ""}</td>
        </tr>
        <tr>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">Is there any effect on turnover due to Covid</td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">${verificationData.salesAndProfitDetails?.covidEffectOnTurnover || ""}</td>
        </tr>
        <tr>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">After lockdown, is business running on same speed?</td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">${verificationData.salesAndProfitDetails?.postLockdownBusinessSpeed || ""}</td>
        </tr>
        <tr>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">Cash Sales (% of total turnover)</td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">${verificationData.salesAndProfitDetails?.cashSalesPercentage || ""}</td>
        </tr>
        <tr>
          <td rowspan="4" style="border:1px solid #ccc;padding:8px">14</td>
          <td rowspan="4" style="border:1px solid #ccc;padding:8px">Customer Details</td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px">Total Debtors as on date</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.customerDetails?.totalDebtorsAsOnDate || ""}</td>
        </tr>
        <tr>
          <td colspan="6" style="border:1px solid #ccc;padding:8px">Total Customers (No.)</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.customerDetails?.totalCustomersNo || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Name of Customer</strong></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>% of Total Sales</strong></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Debtor Days</strong></td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"><strong>Relationship since (years)</strong></td>
        </tr>
        <tr>
          <td colspan="8" style="border:1px solid #ccc;padding:8px">
            ${
              Array.isArray(verificationData.customerDetails?.customers) &&
              verificationData.customerDetails?.customers.length > 0
                ? verificationData.customerDetails.customers
                    .map(
                      (customer) =>
                        `${customer.nameOfCustomer || ""} - ${customer.percentageOfTotalSales || ""}% (${customer.debtorDays || ""} days, ${customer.relationshipSinceYears || ""} years)`
                    )
                    .join("<br>")
                : "NA"
            }
          </td>
        </tr>
      </table>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td rowspan="4" style="border:1px solid #ccc;padding:8px">15</td>
          <td rowspan="4" style="border:1px solid #ccc;padding:8px">Supplier Details</td>
          <td colspan="9" style="border:1px solid #ccc;padding:8px">Total Creditors as on date</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.supplierDetails?.totalCreditorsAsOnDate || ""}</td>
        </tr>
        <tr>
          <td colspan="9" style="border:1px solid #ccc;padding:8px">Total Suppliers (No.)</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.supplierDetails?.totalSuppliersNo || ""}</td>
  </tr>
  <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Name of Supplier</strong></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>% of Total Purchases</strong></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Creditor Days</strong></td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px"><strong>Relationship since (years)</strong></td>
  </tr>
  <tr>
          <td colspan="10" style="border:1px solid #ccc;padding:8px">
            ${
              Array.isArray(verificationData.supplierDetails?.suppliers) &&
              verificationData.supplierDetails?.suppliers.length > 0
                ? verificationData.supplierDetails.suppliers
                    .map(
                      (supplier) =>
                        `${supplier.nameOfSupplier || ""} - ${supplier.percentageOfTotalPurchases || ""}% (${supplier.creditorDays || ""} days, ${supplier.relationshipSinceYears || ""} years)`
                    )
                    .join("<br>")
                : "NA"
            }
          </td>
  </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">16</td>
          <td style="border:1px solid #ccc;padding:8px">Other Business/Income Details (if any)</td>
          <td colspan="10" style="border:1px solid #ccc;padding:8px">${verificationData.otherDetails?.otherBusinessIncomeDetails || ""}</td>
    </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">17</td>
          <td style="border:1px solid #ccc;padding:8px">Assets</td>
          <td colspan="10" style="border:1px solid #ccc;padding:8px">${verificationData.otherDetails?.assets || ""}</td>
    </tr>
  <tr>
          <td rowspan="2" style="border:1px solid #ccc;padding:8px">18</td>
          <td rowspan="2" style="border:1px solid #ccc;padding:8px">Liabilities</td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Bank</strong></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Nature of Loan</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Amount</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>EMI</strong></td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"><strong>Tenure</strong></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Outstanding Balance</strong></td>
  </tr>
  <tr>
          <td colspan="10" style="border:1px solid #ccc;padding:8px">
            ${
              Array.isArray(verificationData.otherDetails?.liabilities) &&
              verificationData.otherDetails?.liabilities.length > 0
                ? verificationData.otherDetails.liabilities
                    .map(
                      (liability) =>
                        `${liability.bank || ""} - ${liability.natureOfLoan || ""}: ${liability.amount || ""} (EMI: ${liability.emi || ""}, Tenure: ${liability.tenure || ""}, Outstanding: ${liability.outstandingBalance || ""})`
                    )
                    .join("<br>")
                : "No liabilities"
            }
          </td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">19</td>
          <td style="border:1px solid #ccc;padding:8px">End Use of proposed Loan</td>
          <td colspan="10" style="border:1px solid #ccc;padding:8px">${verificationData.otherDetails?.endUseOfProposedLoan || ""}</td>
  </tr>
    <tr>
          <td style="border:1px solid #ccc;padding:8px">20</td>
          <td style="border:1px solid #ccc;padding:8px">Political Connection</td>
          <td colspan="10" style="border:1px solid #ccc;padding:8px">${verificationData.otherDetails?.politicalConnection || ""}</td>
  </tr>
    <tr>
          <td style="border:1px solid #ccc;padding:8px">21</td>
          <td style="border:1px solid #ccc;padding:8px">Any Court Cases</td>
          <td colspan="10" style="border:1px solid #ccc;padding:8px">${verificationData.otherDetails?.anyCourtCases || ""}</td>
  </tr>
    <tr>
          <td style="border:1px solid #ccc;padding:8px">22</td>
          <td style="border:1px solid #ccc;padding:8px">Business belongs to which industry</td>
          <td colspan="10" style="border:1px solid #ccc;padding:8px">${verificationData.otherDetails?.businessIndustry || ""}</td>
  </tr>
    <tr>
          <td rowspan="5" style="border:1px solid #ccc;padding:8px">23</td>
          <td rowspan="5" style="border:1px solid #ccc;padding:8px">Value Added Information</td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">Customer Behavior?</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.valueAddedInformation?.customerBehavior || ""}</td>
  </tr>
<tr>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">Salaries paid during covid to employees?</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.valueAddedInformation?.salariesPaidDuringCovid || ""}</td>
  </tr>
   <tr>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">If partly paid, % of deduction on salary?</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.valueAddedInformation?.salaryDeductionPercentage || ""}</td>
  </tr>
   <tr>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">Nature/Types of Neighborhood Shops</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.valueAddedInformation?.neighborhoodShopsNature || ""}</td>
  </tr>
   <tr>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">Digital wallet used in the business?</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.valueAddedInformation?.digitalWalletUsed || ""}</td>
        </tr>
      </table>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">Customer Shop/Office Locality</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.valueAddedInformation?.customerShopLocality || ""}</td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">Nearby Bus Stop / Taxi Stand / Rickshaw Stand / Metro Station Name</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.valueAddedInformation?.nearbyTransportStand || ""}</td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">Utility bill</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.valueAddedInformation?.utilityBillDetails || ""}</td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">Loss Suffered In Business, If yes, the reason?</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.valueAddedInformation?.lossSufferedInBusiness || ""}</td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px">24</td>
          <td style="border:1px solid #ccc;padding:8px">Strengths</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.valueAddedInformation?.strengths || ""}</td>
  </tr> 
  <tr>
          <td style="border:1px solid #ccc;padding:8px">25</td>
          <td style="border:1px solid #ccc;padding:8px">Weaknesses</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.valueAddedInformation?.weaknesses || ""}</td>
  </tr> 
  <tr>
          <td rowspan="11" style="border:1px solid #ccc;padding:8px">26</td>
          <td rowspan="11" style="border:1px solid #ccc;padding:8px">Site Visit Observations</td>
          <td style="border:1px solid #ccc;padding:8px">Name Plate Displayed</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.siteVisitObservations?.namePlateDisplayed || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">Office Well Furnished?</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.siteVisitObservations?.officeWellFurnished || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">Business Activity Seen</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.siteVisitObservations?.businessActivitySeen || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">Difficulty in locating premises?</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.siteVisitObservations?.difficultyInLocatingPremises || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">Neighborhood:</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.siteVisitObservations?.neighborhood || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">Landmark</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.siteVisitObservations?.landmark || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">Abnormal Increase / Decrease in Turnover</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.siteVisitObservations?.abnormalIncreaseDecreaseInTurnover || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">Any Decrease in Net worth</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.siteVisitObservations?.anyDecreaseInNetWorth || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">Stock Seen During PD?</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.siteVisitObservations?.stockSeenDuringPD || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">No. of employees seen during PD?</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.siteVisitObservations?.noOfEmployeesSeenDuringPD || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">No. of customers seen during PD?</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.siteVisitObservations?.noOfCustomersSeenDuringPD || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">27</td>
          <td style="border:1px solid #ccc;padding:8px">Third Party Confirmation</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.siteVisitObservations?.thirdPartyConfirmation || ""}</td>
        </tr>
      </table>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px">28</td>
          <td style="border:1px solid #ccc;padding:8px">Pan Card</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.документы?.panCard || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">29</td>
          <td style="border:1px solid #ccc;padding:8px">Document Seen</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.документы?.otherDocumentSeen || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">30</td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Final Status</strong></td>
          <td style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">31</td>
          <td style="border:1px solid #ccc;padding:8px">Date of PD:</td>
          <td style="border:1px solid #ccc;padding:8px">${istDate}</td>
</tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">32</td>
          <td style="border:1px solid #ccc;padding:8px">Person met at the time of PD:</td>
          <td style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">33</td>
          <td style="border:1px solid #ccc;padding:8px">Phone No. of Applicant:</td>
          <td style="border:1px solid #ccc;padding:8px">-</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px">34</td>
          <td style="border:1px solid #ccc;padding:8px">PD done by:</td>
          <td style="border:1px solid #ccc;padding:8px">-</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">35</td>
          <td style="border:1px solid #ccc;padding:8px">Latitude and Longitude</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.basicDetails?.latitude || ""}, ${verificationData.basicDetails?.longitude || ""}</td>
  </tr>
  <tr>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"><strong>Video Link:</strong></td>
  </tr>
        </table>

      <p style="margin:8px 0;line-height:1.5"><strong>Acknowledgment of Site Visit</strong></p>
      <p style="margin:8px 0;line-height:1.5">(For Tata Capital Limited)</p>
      <p style="margin:8px 0;line-height:1.5">I, the undersigned, have applied for Micro Business Loan with Tata Capital Limited. In this regard, I have met an Executive from Kowtha & Co on the date for Personal Discussion.</p>
      <p style="margin:8px 0;line-height:1.5">I am informed that Executive is not authorized to collect any money.</p>
      <p style="margin:8px 0;line-height:1.5"><strong>Disclaimer Clause:</strong></p>
      <p style="margin:8px 0;line-height:1.5">This report (including any attachments) has been prepared based on verbal information provided by the person contacted. Tata Capital Limited will be absolutely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. <strong>M/s. KOWTHA & CO</strong> will not be held liable in any cases</p>
      <p style="margin:8px 0;line-height:1.5"><strong>PHOTOS:</strong></p>
      </div>

    <footer class="pdf-footer">
      <span style="color:rgb(8, 136, 36);">${html_data.bankName || "TATA UBL"}</span><br>
      Generated on ${istDate}
    </footer>
    ${html_data.imagesData || ""}
  `;
};
