import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate } from "./pd-base.tempate";

export const axisBankTemplate = (verificationData: any, html_data: any) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  return `
    ${pdBaseTemplate()}

    <div class="report-title">PERSONAL DISCUSSION REPORT</div>
    
      <div class="align-wrapper">
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Application ID:</strong> ${verificationData.applicantDetails?.applicationId || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">PD Date: ${verificationData.applicantDetails?.pdDate || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Product (HL / LAP / Asha HL)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.applicantDetails?.product || ""}</td>
          </tr>
          <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Loan Amount</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.applicantDetails?.loanAmount || ""}</td>
          </tr>
          <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Customer Name</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.applicantDetails?.customerName || ""}</td>
          </tr>
          <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>PD address: - (Residence/Office/Factory/Godown)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.applicantDetails?.pdAddress || ""}</td>
          </tr>
          <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Contact Number (Mobile / Landline)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.applicantDetails?.contactNumber || ""}</td>
          </tr>
          <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Person Met: </strong></td>
          <td style="border:1px solid #ccc;padding:8px">Relationship with Borrower: ${verificationData.applicantDetails?.relationshipWithBorrower || ""}</td>
        </tr>
      </table>

      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Borrower Details</strong></td>
          </tr>
          <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Family Background (Details of family members, major income earning member, dependents details etc.)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">
            ${
              Array.isArray(verificationData.familyBackground?.familyMembers) &&
              verificationData.familyBackground?.familyMembers.length > 0
                ? verificationData.familyBackground.familyMembers
                    .map(
                      (member) =>
                        `${member.name || ""} - ${member.relationToApplicant || ""} – ${member.age || ""}yrs`
                    )
                    .join("<br>")
                : ""
            }
          </td>
          </tr>
          <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Total Family members (Nos)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.familyBackground?.totalFamilyMembers || ""}</td>
          </tr>
          <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>No. of Earning members (Nos)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.familyBackground?.noOfEarningMembers || ""}</td>
          </tr>
        </table>

      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Business place and vintage details</strong></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Name of firm:</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessPlaceVintage?.nameOfFirm || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Constitution (proprietorship / Partnership / Company / LLP)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessPlaceVintage?.constitution || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Who started the business? (self / acquired / second gen)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessPlaceVintage?.whoStartedBusiness || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Ownership of business place (self-owned / rented)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessPlaceVintage?.ownershipOfBusinessPlace || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Years in current office</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessPlaceVintage?.yearsInCurrentOffice || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Years in current city</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessPlaceVintage?.yearsInCurrentCity || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Years in current business</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessPlaceVintage?.yearsInCurrentBusiness || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Previous employment (if any)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessPlaceVintage?.previousEmployment || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Is Resi Cum office? If yes details of separate office set up.</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessPlaceVintage?.isResiCumOffice || ""}</td>
        </tr>
    </table>

      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td colspan="9" style="border:1px solid #ccc;padding:8px"><strong>Business/Financial Profile</strong></td>
        </tr>
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Nature of business (Trading / manufacturing / services / others: please specify)</strong></td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">${verificationData.businessFinancialProfile?.natureOfBusiness || ""}</td>
        </tr>
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Product / services offered.</strong></td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">${verificationData.businessFinancialProfile?.productServicesOffered || ""}</td>
        </tr>
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Business Model & background of business.</strong></td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">${verificationData.businessFinancialProfile?.businessModelBackground || ""}</td>
        </tr>
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Other details business observed during the visit:</strong></td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">
            Business name board seen: ${verificationData.otherDetailsObserved?.businessNameBoardSeen || ""}<br>
            No of employees seen: ${verificationData.otherDetailsObserved?.noOfEmployeesSeen || ""}<br>
            Business activity seen: ${verificationData.otherDetailsObserved?.businessActivitySeen || ""}<br>
            Stock seen: ${verificationData.otherDetailsObserved?.stockSeen || ""}<br>
            No. of machines seen: ${verificationData.otherDetailsObserved?.noOfMachinesSeen || ""}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Top 3 clients (customers) (Average debtor days).</strong></td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">
            ${
              Array.isArray(
                verificationData.otherDetailsObserved?.top3ClientsCustomers
              ) &&
              verificationData.otherDetailsObserved?.top3ClientsCustomers
                .length > 0
                ? verificationData.otherDetailsObserved.top3ClientsCustomers
                    .map(
                      (client) =>
                        `${client.name || ""} - ${client.contactDetails || ""} (${client.location || ""})`
                    )
                    .join("<br>")
                : "NA"
            }
          </td>
        </tr>
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Top 3 clients (suppliers) (Average creditor days).</strong></td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">
            ${
              Array.isArray(
                verificationData.otherDetailsObserved?.top3ClientsSuppliers
              ) &&
              verificationData.otherDetailsObserved?.top3ClientsSuppliers
                .length > 0
                ? verificationData.otherDetailsObserved.top3ClientsSuppliers
                    .map(
                      (supplier) =>
                        `${supplier.name || ""} - ${supplier.contactDetails || ""} (${supplier.location || ""})`
                    )
                    .join("<br>")
                : "NA"
            }
          </td>
        </tr>
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Any other business or alternate source of income such as rentals, commission etc. (Provide details)</strong></td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">${verificationData.otherDetailsObserved?.otherBusinessIncomeSource || ""}</td>
        </tr>
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Any other observations / remarks during visit:</strong></td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">${verificationData.otherDetailsObserved?.otherObservationsRemarks || ""}</td>
        </tr>
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Details of neighbor check / Third party check done and status:</strong></td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">${verificationData.otherDetailsObserved?.neighborCheckThirdParty || ""}</td>
        </tr>
        <tr>
          <td colspan="8" style="border:1px solid #ccc;padding:8px"><strong>Common Points applicable for all cases.</strong></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Turnover and Margin</strong></td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Sales fluctuations (Seasonal business)</strong></td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">Peak sales months: ${verificationData.commonPoints?.peakSalesMonths || ""}<br>Low sales months: ${verificationData.commonPoints?.lowSalesMonths || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Customer Identity established during PD</strong></td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">${verificationData.commonPoints?.customerIdentityEstablished || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Chartered A/c details</strong></td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">${verificationData.commonPoints?.charteredAcDetails || ""}</td>
        </tr>
        <tr>
          <td rowspan="3" style="border:1px solid #ccc;padding:8px"><strong>Details of existing loans confirmed during PD.</strong></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Loan type</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Loan Amt</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Tenure</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>EMI</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Bal tenure</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Bank Name</strong></td>
        </tr>
        ${
          Array.isArray(verificationData.commonPoints?.existingLoans) &&
          verificationData.commonPoints?.existingLoans.length > 0
            ? verificationData.commonPoints.existingLoans
                .map(
                  (loan) => `
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${loan.loanType || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.loanAmt || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.tenure || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.emi || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.balTenure || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.bankName || ""}</td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="7" style="border:1px solid #ccc;padding:8px;text-align:center;">No existing loans</td></tr>'
        }
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Loans taken from family, friends business associates etc.</strong></td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">${verificationData.commonPoints?.loansTakenFrom || ""}</td>
        </tr>
      </table>

      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Details of Working capital (OD/CC) if any</strong></td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">
            Bank Name: ${verificationData.commonPoints?.workingCapitalBankName || ""}<br>
            Limit: ${verificationData.commonPoints?.workingCapitalLimit || ""}<br>
            Utilisation: ${verificationData.commonPoints?.workingCapitalUtilisation || ""}<br>
            Collateral: ${verificationData.commonPoints?.workingCapitalCollateral || ""}<br>
            Details of linked loans (if any): ${verificationData.commonPoints?.workingCapitalLinkedLoans || ""}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>End Use of proposed Loan in detail. (Basis purpose of loan, in case cash out end use must be detailed)</strong></td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.commonPoints?.endUseOfProposedLoan || ""}</td>
        </tr>
        <tr>
          <td colspan="5" style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td rowspan="2" style="border:1px solid #ccc;padding:8px"><strong>Banking details:</strong></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Bank Name</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>A/c type</strong></td>
          <td rowspan="2" style="border:1px solid #ccc;padding:8px">Average Balances</td>
        </tr>
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.commonPoints?.bankingBankName || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.commonPoints?.bankingAcType || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Banking performance</strong></td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">Any cheque bounces seen (Y/N): ${verificationData.commonPoints?.bankingPerformance || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Details of collateral</strong></td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px"><strong>Address of property</strong>: ${verificationData.commonPoints?.detailsOfCollateral || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Status of PD (Positive, Negative, Credit Manager visit needed)</strong></td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px"><strong>${verificationData.commonPoints?.statusOfPD || ""}</strong></td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>PD Officer Name: -</strong></p>
      <p style="margin:8px 0;line-height:1.5"><strong>PD Officer Signature:</strong></p>
      <p style="margin:8px 0;line-height:1.5"><strong>Agency Name & Seal: M/s. KOWTHA & CO</strong></p>
      <p style="margin:8px 0;line-height:1.5"><strong>Geo Tagging & Photographs of business premises: -</strong></p>
      
      <p style="margin:8px 0;line-height:1.5"><strong>ANNEXURE 1: Income assessment for Asha Home Loans</strong></p>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"><strong>Product Specific PD (Applicable for Assessed income cases)</strong></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Monthly Turnover (Total monthly billing)</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">Rs. ${verificationData.incomeAssessment?.monthlyTurnover || ""} (As assessed during the PD through records maintained at business place).</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Total Purchases (Monthly purchases, cost of acquisition etc.)</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">Rs. ${verificationData.incomeAssessment?.totalPurchases || ""} (As assessed during the PD through records maintained at business place).</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Gross and Net margin of business.</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.grossNetMargin || ""} approx (Confirmed by customer during PD).</td>
        </tr>
        <tr>
          <td rowspan="22" style="border:1px solid #ccc;padding:8px">Estimated income.</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Cashflow analysis during PD.</strong></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Particulars</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Amount in INR.</strong></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Monthly TO/Gross Receipts (estimated)</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.monthlyGrossReceipts || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Any other income (monthly) (commission rental etc.)</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.otherIncome || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Gross monthly income (total).</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.grossMonthlyIncome || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Less: Direct expenses. (Purchase cost, cost of goods sold, selling expenses)</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.directExpenses || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Less: Rental expenses.</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.rentalExpenses || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Less: Staff Salary</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.staffSalary || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Less: Electricity/mobile/travel expenses.</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.utilityExpenses || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Less: Any other expenses than mentioned above.</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.otherExpenses || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Income left for domestic expenses</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.incomeForDomesticExpenses || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Less: Monthly household expenses</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.monthlyHouseholdExpenses || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">a) Food expenses</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.foodExpenses || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">b) Children education</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.childrenEducation || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">c) House rent (if any)</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.houseRent || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">d) Medical expenses</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.medicalExpenses || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">e) Any other household expenses.</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.otherHouseholdExpenses || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Net monthly income post all expenses</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.netMonthlyIncome || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Less: a) Savings/investments/insurance premium etc.</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.savingsInvestments || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">b) Existing EMIs (obligations)</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.existingEMIs || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">c) EMI allocated for the proposed loan</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.proposedLoanEMI || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Net surplus income post all expenses & obligations</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.netSurplusIncome || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Loans taken from family, friends business associates etc</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.incomeAssessment?.informalLoans || ""}</td>
        </tr>
      </table>
      <p style="margin:8px 0;line-height:1.5"><strong>PHOTOS:</strong></p>
    </div>

    <footer class="pdf-footer">
      <span style="color:rgb(8, 136, 36);">${html_data.bankName || "AXIS BANK"}</span><br>
      Generated on ${istDate}
    </footer>
    ${html_data.imagesData || ""}
  `;
};
