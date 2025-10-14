import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate } from "./pd-base.tempate";

export const idfcPlTemplate = (verificationData: any, html_data: any) => {
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
          <td style="border:1px solid #ccc;padding:8px"><strong>Name of the Applicant</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.general?.nameOfTheApplicant || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>SDFC ID</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.general?.sdfcId || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Person Contacted</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.general?.personContacted || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Visited Address</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.general?.visitedAddress || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Date of Visit / Time of visit</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.general?.dateOfVisitTimeOfVisit || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Alternate contact number of the customer (Mobile/Landline)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.general?.alternateContactNumberOfTheCustomerMobileLandline || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Marital Status (Married/Divorced/Bachelor)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.general?.maritalStatusMarriedDivorcedBachelor || ""}</td>
        </tr>
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Name Of The Employer</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.employmentDetails?.nameOfTheEmployer || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Type Of Firm (Proprietor / Partnership / Pvt. Ltd. / Govt. / PSU / MNC)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.employmentDetails?.typeOfFirmProprietorPartnershipPvtLtdGovtPsuMnc || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Number Of Employees</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.employmentDetails?.numberOfEmployees || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Department And Designation</strong></td>
          <td style="border:1px solid #ccc;padding:8px">
            <strong>Department:</strong> ${verificationData.employmentDetails?.department || ""}<br>
            <strong>Designation:</strong> ${verificationData.employmentDetails?.designation || ""}
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Years In Current Company</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.employmentDetails?.yearsInCurrentCompany || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Previous Job Details / Work Experience / Total Years Of Experience</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.employmentDetails?.previousJobDetailsWorkExperienceTotalYearsOfExperience || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Level of activity & stocks along with observations</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.employmentDetails?.levelOfActivityStocksAlongWithObservations || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Company Profile (Service / Manufacturing / Small Scale / Finance / Other [Please Specify])</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.employmentDetails?.companyProfileServiceManufacturingSmallScaleFinanceOtherPleaseSpecify || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Third Party Check</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.employmentDetails?.thirdPartyCheck || ""}</td>
        </tr>
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>INCOME DETAILS:</strong></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Gross Salary</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeDetails?.grossSalary || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Net Salary</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeDetails?.netSalary || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Overtime Details, If Any</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeDetails?.overtimeDetailsIfAny || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Monthly Expenses</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeDetails?.monthlyExpenses || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Monthly Net Income</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.incomeDetails?.monthlyNetIncome || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Total no of family members</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.familyDetails?.totalNoOfFamilyMembers || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Earning Family Members income details</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.familyDetails?.earningFamilyMembersIncomeDetails || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>No. Of Dependents</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.familyDetails?.noOfDependents || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Any other source of income Monthly/Annual</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.familyDetails?.anyOtherSourceOfIncomeMonthlyAnnual || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>BANKING DETAILS:</strong></td>
          <td style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Banking Relationship with</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.bankingDetails?.bankingRelationshipWith || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Cash Credit Limit</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.bankingDetails?.cashCreditLimit || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Overdraft limit</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.bankingDetails?.overdraftLimit || ""}</td>
        </tr>
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">
            <strong>OBLIGATIONS/LOANS:</strong>
            <table style="border-collapse:collapse;width:100%;margin:10px 0">
              <tr>
                <td style="border:1px solid #ccc;padding:8px"><strong>Institution / Bank / NBFC Name</strong></td>
                <td style="border:1px solid #ccc;padding:8px"><strong>Type of Loan</strong></td>
                <td style="border:1px solid #ccc;padding:8px"><strong>Monthly Principal / EMI</strong></td>
                <td style="border:1px solid #ccc;padding:8px"><strong>Loan amount (Rs. Lacs)</strong></td>
              </tr>
              ${
                Array.isArray(
                  verificationData.obligationsLoans?.obligationsLoans
                ) &&
                verificationData.obligationsLoans?.obligationsLoans.length > 0
                  ? verificationData.obligationsLoans.obligationsLoans
                      .map(
                        (loan) => `
              <tr>
                <td style="border:1px solid #ccc;padding:8px">${loan.institutionBankNbfcName || ""}</td>
                <td style="border:1px solid #ccc;padding:8px">${loan.typeOfLoan || ""}</td>
                <td style="border:1px solid #ccc;padding:8px">${loan.monthlyPrincipalEmi || ""}</td>
                <td style="border:1px solid #ccc;padding:8px">${loan.loanAmount || ""}</td>
              </tr>
              `
                      )
                      .join("")
                  : '<tr><td colspan="4" style="border:1px solid #ccc;padding:8px;text-align:center;">No obligations/loans</td></tr>'
              }
            </table>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Current Residence (Owned/Rented/Parents House/Relatives House/Company Provided)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceDetails?.currentResidenceOwnedRentedParentsHouseRelativesHouseCompanyProvided || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Years At Current Residence</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceDetails?.yearsAtCurrentResidence || ""}</td>
        </tr>
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Assets owned:</strong></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Four Wheeler / Two Wheeler</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.assetsOwned?.assetsOwned || ""}</td>
        </tr>
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>BIL LOAN DETAILS:</strong></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Loan amount applied</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.bilLoanDetails?.loanAmountApplied || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>End Use</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.bilLoanDetails?.endUse || ""}</td>
        </tr>
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Name of Interviewer</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.interviewerDetails?.nameOfInterviewer || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Designation and signature</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.interviewerDetails?.designationAndSignature || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>PD Status</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>${verificationData.interviewerDetails?.pdStatus || ""}</strong></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Interviewers remarks</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.interviewerDetails?.interviewersRemarks || ""}</td>
        </tr>
      </table>
    </div>

    <p style="margin:20px;"><strong>Disclaimer Clause:</strong></p>
    <p style="margin:20px;">This report (including any attachments) has been prepared based on verbal information provided by the person contacted. IDFC FIRST BANK will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. M/s. KOWTHA & CO will not be held liable in any case.</p>

    <p style="margin:20px;"><strong>Photos:</strong></p>

    <footer class="pdf-footer">
      <span style="color:rgb(8, 136, 36);">${html_data.bankName || "IDFC PL"}</span><br>
      Generated on ${istDate}
    </footer>
    ${html_data.imagesData || ""}
  `;
};
