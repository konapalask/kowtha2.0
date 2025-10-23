import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

export const iciciTemplate = (verificationData: any, html_data: any) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  return `
    ${pdBaseTemplate(html_data)}

    <div class="report-title">PERSONAL DISCUSSION REPORT - ICICI</div>

    <div class="align-wrapper">
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td colspan="17" style="border:1px solid #ccc;padding:8px"><strong>Proposal</strong></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>APS ID</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.proposal?.apsId || ""}</td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Application No</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.proposal?.applicationNo || ""}</td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Initiation Date</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.proposal?.initiationDate || ""}</td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px"><strong>Branch</strong></td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">${verificationData.proposal?.branch || ""}</td>
        </tr>
        <tr>
          <td colspan="17" style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"><strong>PD Details:</strong></td>
          <td colspan="14" style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Business Name</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>PD Conducted on (Date)</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Location of PD (Resi/Office)</strong></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Location address of PD</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>PD Conducted by (Name)</strong></td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px"><strong>Person Met at PD</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px"><strong>Relationship of the person met during PD with Applicant</strong></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Distance from HFC Branch</strong></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.pdDetails?.businessName || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.pdDetails?.pdConductedDate || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.pdDetails?.locationOfPd || ""}</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.pdDetails?.locationAddressOfPd || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.pdDetails?.pdConductedBy || ""}</td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">${verificationData.pdDetails?.personMetAtPd || ""}</td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.pdDetails?.relationshipWithApplicant || ""}</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.pdDetails?.distanceFromHfcBranch || ""}</td>
        </tr>
        <tr>
          <td colspan="17" style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"><strong>Applicants</strong></td>
          <td colspan="14" style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Name of the applicant/ Co Applicant</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Relationship with applicant</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Current age</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Qualification</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Income Holder(Yes/No)</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Property ownership (Yes / No)</strong></td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px"><strong>Income Source(Business/Rental/Salary/)</strong></td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px"><strong>Remarks If any</strong></td>
        </tr>
        ${
          Array.isArray(verificationData.applicants?.applicants) &&
          verificationData.applicants?.applicants.length > 0
            ? verificationData.applicants.applicants
                .map(
                  (applicant) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px">${applicant.name || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${applicant.relationshipWithApplicant || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${applicant.currentAge || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${applicant.qualification || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${applicant.incomeHolder || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${applicant.propertyOwnership || ""}</td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">${applicant.incomeSource || ""}</td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">${applicant.remarks || ""}</td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="17" style="border:1px solid #ccc;padding:8px;text-align:center;">No applicants information available</td></tr>'
        }

        <!-- Family Background and Personal Details Section -->
        <tr>
          <td rowspan="9" style="border:1px solid #ccc;padding:8px"><strong>Family Background and Personal details</strong></td>
          <td rowspan="7" style="border:1px solid #ccc;padding:8px"><strong>Residence Details</strong></td>
          <td colspan="15" style="border:1px solid #ccc;padding:8px"><strong>Current Residence:</strong> ${verificationData.familyBackgroundPersonalDetails?.currentResidenceOwnedRented || ""}</td>
        </tr>
        <tr>
          <td colspan="15" style="border:1px solid #ccc;padding:8px"><strong>Owner name:</strong> ${verificationData.familyBackgroundPersonalDetails?.ifCurrentResidenceIsOwnedOwnerName || ""}</td>
        </tr>
        <tr>
          <td colspan="15" style="border:1px solid #ccc;padding:8px"><strong>If Rented- Owner name and Contact No:</strong> ${verificationData.familyBackgroundPersonalDetails?.ifRentedOwnerNameAndContactNo || ""}</td>
        </tr>
        <tr>
          <td colspan="15" style="border:1px solid #ccc;padding:8px"><strong>If Rented- Permanent Residence details:</strong> ${verificationData.familyBackgroundPersonalDetails?.ifRentedPermanentResidenceDetails || ""}</td>
        </tr>
        <tr>
          <td colspan="15" style="border:1px solid #ccc;padding:8px"><strong>No of years in Current Residence:</strong> ${verificationData.familyBackgroundPersonalDetails?.noOfYearsInCurrentResidenceAndPreviousResidenceDetails || ""}</td>
        </tr>
        <tr>
          <td colspan="15" style="border:1px solid #ccc;padding:8px"><strong>No of Years in Same City:</strong> ${verificationData.familyBackgroundPersonalDetails?.noOfYearsInSameCity || ""}</td>
        </tr>
        <tr>
          <td colspan="15" style="border:1px solid #ccc;padding:8px"><strong>Distance from Current residence to Business premises:</strong> ${verificationData.familyBackgroundPersonalDetails?.distanceFromCurrentResidenceToBusinessPremises || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Family Details</strong></td>
          <td colspan="15" style="border:1px solid #ccc;padding:8px">${verificationData.familyBackgroundPersonalDetails?.familyDetailsWithNoOfDependant || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Earning members</strong></td>
          <td colspan="15" style="border:1px solid #ccc;padding:8px">${verificationData.familyBackgroundPersonalDetails?.earningMembersInFamilyTheirSourceOfIncomeAndTotalIncome || ""}</td>
        </tr>

        <!-- Nature of Business Section -->
        <tr>
          <td rowspan="14" style="border:1px solid #ccc;padding:8px"><strong>Nature of Business and Business Vintage</strong></td>
          <td colspan="16" style="border:1px solid #ccc;padding:8px"><strong>Business Premises:</strong> ${verificationData.natureOfBusinessAndBusinessVintage?.businessPremisesOwnedRented || ""}</td>
        </tr>
        <tr>
          <td colspan="16" style="border:1px solid #ccc;padding:8px"><strong>Business Premises Owner details:</strong> ${verificationData.natureOfBusinessAndBusinessVintage?.businessPremisesOwnerDetails || ""}</td>
        </tr>
        <tr>
          <td colspan="16" style="border:1px solid #ccc;padding:8px"><strong>No of years in Same premises:</strong> ${verificationData.natureOfBusinessAndBusinessVintage?.noOfYearsInSamePremises || ""}</td>
        </tr>
        <tr>
          <td colspan="16" style="border:1px solid #ccc;padding:8px"><strong>No of Years in same Business:</strong> ${verificationData.natureOfBusinessAndBusinessVintage?.noOfYearsInSameBusiness || ""}</td>
        </tr>
        <tr>
          <td colspan="16" style="border:1px solid #ccc;padding:8px"><strong>Previous exp if any:</strong> ${verificationData.natureOfBusinessAndBusinessVintage?.previousExpIfAny || ""}</td>
        </tr>
        <tr>
          <td colspan="16" style="border:1px solid #ccc;padding:8px"><strong>Business Activity:</strong> ${verificationData.natureOfBusinessAndBusinessVintage?.businessActivity || ""}</td>
        </tr>
        <tr>
          <td colspan="16" style="border:1px solid #ccc;padding:8px"><strong>Gross margin and Net Margin:</strong> ${verificationData.natureOfBusinessAndBusinessVintage?.grossMarginAndNetMargin || ""}</td>
        </tr>
        <tr>
          <td colspan="16" style="border:1px solid #ccc;padding:8px"><strong>Ideas about to start business:</strong> ${verificationData.natureOfBusinessAndBusinessVintage?.ideasAboutToStartBusiness || ""}</td>
        </tr>
        <tr>
          <td colspan="16" style="border:1px solid #ccc;padding:8px"><strong>Staff Details:</strong> ${verificationData.natureOfBusinessAndBusinessVintage?.staffDetails || ""}</td>
        </tr>
        <tr>
          <td colspan="16" style="border:1px solid #ccc;padding:8px"><strong>Documents Verified:</strong> ${verificationData.natureOfBusinessAndBusinessVintage?.documentsVerifiedKutchaBillsLicenseOtherDocumentsAndPeriodOfBillsVerifiedAndAmount || ""}</td>
        </tr>
        <tr>
          <td colspan="16" style="border:1px solid #ccc;padding:8px"><strong>Machinery/Assets used in business:</strong> ${verificationData.natureOfBusinessAndBusinessVintage?.machineryAssetsUsedInBusiness || ""}</td>
        </tr>
        <tr>
          <td colspan="16" style="border:1px solid #ccc;padding:8px"><strong>Business Vintage as Per Local References:</strong> ${verificationData.natureOfBusinessAndBusinessVintage?.businessVintageAsPerLocalReferences || ""}</td>
        </tr>
        <tr>
          <td colspan="16" style="border:1px solid #ccc;padding:8px"><strong>Business Vintage as per Document Verified:</strong> ${verificationData.natureOfBusinessAndBusinessVintage?.businessVintageAsPerDocumentVerified || ""}</td>
        </tr>
        <tr>
          <td colspan="16" style="border:1px solid #ccc;padding:8px"><strong>Business Locality and Market Competition:</strong> ${verificationData.natureOfBusinessAndBusinessVintage?.businessLocalityAndMarketCompetition || ""}</td>
        </tr>

        <!-- Income Assessment Section -->
        <tr>
          <td rowspan="3" style="border:1px solid #ccc;padding:8px"><strong>Income Assessment</strong></td>
          <td colspan="16" style="border:1px solid #ccc;padding:8px"><strong>Core Business income:</strong> ${verificationData.incomeAssessment?.coreBusinessIncome || ""}</td>
        </tr>
        <tr>
          <td colspan="16" style="border:1px solid #ccc;padding:8px"><strong>Any other Income:</strong> ${verificationData.incomeAssessment?.anyOtherIncome || ""}</td>
        </tr>
        <tr>
          <td colspan="16" style="border:1px solid #ccc;padding:8px"><strong>Maximum EMI Paying Capability:</strong> ${verificationData.incomeAssessment?.maximumEmiPayingCapabilityCustomerConfirmed || ""}</td>
        </tr>

        <tr>
          <td colspan="17" style="border:1px solid #ccc;padding:8px"><strong>Asset Creation in last 5 years:</strong> ${verificationData.assetCreationInLast5Years?.assetCreationInLast5Years || ""}</td>
        </tr>

        <!-- Cash Flow Analysis Section -->
        <tr>
          <td colspan="17" style="border:1px solid #ccc;padding:8px"><strong>Cash Flow analysis during PD</strong></td>
        </tr>
        <tr>
          <td colspan="17" style="border:1px solid #ccc;padding:8px">${verificationData.cashFlowAnalysisDuringPd?.cashFlowAnalysis || ""}</td>
        </tr>

        <!-- ITR and Financial Section -->
        <tr>
          <td colspan="17" style="border:1px solid #ccc;padding:8px"><strong>ITR and Financial</strong></td>
        </tr>
        <tr>
          <td colspan="17" style="border:1px solid #ccc;padding:8px"><strong>ITR Filing:</strong> ${verificationData.itrAndFinancial?.itrFillingYesNo || ""}</td>
        </tr>
        <tr>
          <td colspan="17" style="border:1px solid #ccc;padding:8px"><strong>Amount declared:</strong> ${verificationData.itrDetailsIfAny?.ifFillingAmountOfIncomeDeclared || ""}</td>
        </tr>

        <!-- Banking Details Section -->
        <tr>
          <td rowspan="4" style="border:1px solid #ccc;padding:8px"><strong>Banking Details</strong></td>
          <td colspan="16" style="border:1px solid #ccc;padding:8px"><strong>Bank Name | A/c Type | No of years</strong></td>
        </tr>
        ${
          Array.isArray(verificationData.bankingDetails?.bankingDetails) &&
          verificationData.bankingDetails?.bankingDetails.length > 0
            ? verificationData.bankingDetails.bankingDetails
                .map(
                  (banking) => `
        <tr>
          <td colspan="16" style="border:1px solid #ccc;padding:8px">${banking.bankName || ""} | ${banking.accountType || ""} | ${banking.noOfYears || ""}</td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="16" style="border:1px solid #ccc;padding:8px;text-align:center;">No banking details available</td></tr>'
        }

        <!-- Existing Loan Details Section -->
        <tr>
          <td colspan="17" style="border:1px solid #ccc;padding:8px"><strong>Existing Loan Details</strong></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Lender</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Type of Loan</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Loan Availed year</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Loan Amount</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>POS</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>EMI</strong></td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px"><strong>Security Offered</strong></td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px"><strong>Emi deducting Bank account</strong></td>
        </tr>
        ${
          Array.isArray(
            verificationData.existingLoanDetails?.existingLoanDetails
          ) &&
          verificationData.existingLoanDetails?.existingLoanDetails.length > 0
            ? verificationData.existingLoanDetails.existingLoanDetails
                .map(
                  (loan) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px">${loan.lender || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.typeOfLoan || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.loanAvailedYear || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.loanAmount || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.pos || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.emi || ""}</td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">${loan.securityOffered || ""}</td>
          <td colspan="7" style="border:1px solid #ccc;padding:8px">${loan.emiDeductingBankAccount || ""}</td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="17" style="border:1px solid #ccc;padding:8px;text-align:center;">No existing loans</td></tr>'
        }

        <!-- Reference Section -->
        <tr>
          <td colspan="17" style="border:1px solid #ccc;padding:8px"><strong>Reference (Name & Contact No.)</strong></td>
        </tr>
        <tr>
          <td colspan="17" style="border:1px solid #ccc;padding:8px"><strong>Suppliers/Staff:</strong> ${verificationData.reference?.suppliersStaff || ""}</td>
        </tr>
        <tr>
          <td colspan="17" style="border:1px solid #ccc;padding:8px"><strong>Customers:</strong> ${verificationData.reference?.customers || ""}</td>
        </tr>
        <tr>
          <td colspan="17" style="border:1px solid #ccc;padding:8px"><strong>Neighbor Feedback:</strong> ${verificationData.reference?.neighborFeedback || ""}</td>
        </tr>

        <!-- Collateral Details Section -->
        <tr>
          <td colspan="2" rowspan="7" style="border:1px solid #ccc;padding:8px"><strong>Collateral Details</strong></td>
          <td colspan="15" style="border:1px solid #ccc;padding:8px"><strong>Property Location:</strong> ${verificationData.collateralDetails?.propertyLocation || ""}</td>
        </tr>
        <tr>
          <td colspan="15" style="border:1px solid #ccc;padding:8px"><strong>Property Type:</strong> ${verificationData.collateralDetails?.propertyType || ""}</td>
        </tr>
        <tr>
          <td colspan="15" style="border:1px solid #ccc;padding:8px"><strong>Property area (sqft.):</strong> ${verificationData.collateralDetails?.propertyAreaSqft || ""}</td>
        </tr>
        <tr>
          <td colspan="15" style="border:1px solid #ccc;padding:8px"><strong>Property Value and Registration Value:</strong> ${verificationData.collateralDetails?.propertyValueAndRegistrationValue || ""}</td>
        </tr>
        <tr>
          <td colspan="15" style="border:1px solid #ccc;padding:8px"><strong>Propose Property Current Occupancy:</strong> ${verificationData.collateralDetails?.proposePropertyCurrentOccupancy || ""}</td>
        </tr>
        <tr>
          <td colspan="15" style="border:1px solid #ccc;padding:8px"><strong>Distance from Business:</strong> ${verificationData.collateralDetails?.proposePropertyDistanceFromBusiness || ""}</td>
        </tr>
        <tr>
          <td colspan="15" style="border:1px solid #ccc;padding:8px"><strong>Seller Details:</strong> ${verificationData.collateralDetails?.sellerDetails || ""}</td>
        </tr>

        <!-- OCR Details Section -->
        <tr>
          <td colspan="2" rowspan="2" style="border:1px solid #ccc;padding:8px"><strong>OCR details for Purchase Case:</strong></td>
          <td colspan="15" style="border:1px solid #ccc;padding:8px"><strong>OCR Paid:</strong> ${verificationData.ocrDetailsForPurchaseCase?.ocrPaid || ""}</td>
        </tr>
        <tr>
          <td colspan="15" style="border:1px solid #ccc;padding:8px"><strong>OCR source:</strong> ${verificationData.ocrDetailsForPurchaseCase?.ocrSource || ""}</td>
        </tr>

        <!-- End Use Section -->
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>End use of loan:</strong></td>
          <td colspan="15" style="border:1px solid #ccc;padding:8px">${verificationData.endUseOfLoan?.endUseOfLoan || ""}</td>
        </tr>

        <!-- Remarks Section -->
        <tr>
          <td colspan="17" style="border:1px solid #ccc;padding:8px"><strong>Remarks: Summary of Transaction</strong></td>
        </tr>
        <tr>
          <td colspan="17" style="border:1px solid #ccc;padding:8px">${verificationData.remarksSummaryOfTransaction?.remarksSummaryOfTransaction || ""}</td>
        </tr>

        <!-- PD Status Section -->
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>PD Status</strong></td>
          <td colspan="16" style="border:1px solid #ccc;padding:8px"><strong>${verificationData.pdStatus?.pdStatus || ""}</strong></td>
        </tr>
      </table>
    </div>

    <p style="margin:20px;"><strong>Disclaimer Clause:</strong></p>
    <p style="margin:20px;">This report (including any attachments) has been prepared based on verbal information provided by the person contacted. ICICI HOME FINANCE will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. M/s. KOWTHA & CO will not be held liable in any case.</p>

    <p style="margin:20px;"><strong>Business Photos:</strong></p>

    ${pdBaseTemplateFooter(html_data)}
  `;
};
