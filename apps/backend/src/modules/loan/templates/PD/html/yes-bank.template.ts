import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate } from "./pd-base.tempate";

export const yesBankTemplate = (verificationData: any, html_data: any) => {
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
          <td style="border:1px solid #ccc;padding:8px"><strong>Name of the Main applicant</strong></td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.basicDetailsOfApplicant?.nameOfTheMainApplicant || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>PD done with and Relation with applicant</strong></td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.basicDetailsOfApplicant?.pdDoneWithAndRelationWithApplicant || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Address of the Visit with Landmark</strong></td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.basicDetailsOfApplicant?.addressOfTheVisitWithLandmark || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>CAS ID</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.basicDetailsOfApplicant?.casId || ""}</td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Product (AFHL/MLAP)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.basicDetailsOfApplicant?.productAfhlMlap || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>PD Visit date and time</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.basicDetailsOfApplicant?.pdVisitDateAndTime || ""}</td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Contact number</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.basicDetailsOfApplicant?.contactNumber || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Loan Applied Amt</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.basicDetailsOfApplicant?.loanAppliedAmt || ""}</td>
          <td rowspan="2" style="border:1px solid #ccc;padding:8px"><strong>Address visited Type (Residence/Business/Employment place)</strong></td>
          <td rowspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.basicDetailsOfApplicant?.addressVisitedTypeResidenceBusinessEmploymentPlace || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Tenor Required</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.basicDetailsOfApplicant?.tenorRequired || ""}</td>
  </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>BASIC DETAILS OF APPLICANT:</strong></p>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Particulars</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Remarks</strong></td>
  </tr>
    <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Applicant – Business / Educational background / Past experience</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.basicDetailsOfApplicant?.applicantBusinessEducationalBackgroundPastExperience || ""}</td>
  </tr>
    <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Co-Applicant – Business / Employment / Educational background / Past experience</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.basicDetailsOfApplicant?.coApplicantBusinessEmploymentEducationalBackgroundPastExperience || ""}</td>
  </tr>
    <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Parents Occupation/Business/Employment background</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.basicDetailsOfApplicant?.parentsOccupationBusinessEmploymentBackground || ""}</td>
  </tr>
<tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Details of children (studying/working)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.basicDetailsOfApplicant?.detailsOfChildrenStudyingWorking || ""}</td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Siblings Business/Employment background (if residing together)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.basicDetailsOfApplicant?.siblingsBusinessEmploymentBackgroundIfResidingTogether || ""}</td>
  </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>SELF EMPLOYED PROFILE - Occupational Details</strong></p>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
   <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Particulars</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Remarks</strong></td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Name of the Business / Employment</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.nameOfTheBusinessEmployment || ""}</td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Constitution of Business Entity</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.constitutionOfBusinessEntityProprietorshipPartnershipLtdCo || ""}</td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Name of Proprietor, Partners/Shareholders with % share of each</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.nameOfProprietorPartnersShareholdersWithShareOfEach || ""}</td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>No of Years in Current Business</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.noOfYearsInCurrentBusiness || ""}</td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Business profile</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.businessProfile || ""}</td>
  </tr> 
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Whether GST registered</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.whetherGstRegisteredIfYesSinceWhenGstRegistrationExist || ""}</td>
  </tr> 
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Details of any other proof of business existence /stability available/verified during visit</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.detailsOfAnyOtherProofOfBusinessExistenceStabilityAvailableVerifiedDuringVisit || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Average Monthly sales/ receipts</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.averageMonthlySalesReceipts || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Average monthly purchase</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.averageMonthlyPurchase || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Gross margin on the on goods sold</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.grossMarginOnTheOnGoodsSold || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Overheads to run the business (Indirect expenses)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.overheadsToRunTheBusinessIndirectExpenses || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Net monthly profit from business</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.netMonthlyProfitFromBusiness || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Stock level</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.stockLevel || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Description about major customers along with credit terms</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.descriptionAboutMajorCustomersAlongWithCreditTerms || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Description about major suppliers along with credit terms</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.descriptionAboutMajorSuppliersAlongWithCreditTerms || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Business set up details</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.businessSetUpDetails || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Infrastructure and manpower details</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.infrastructureAndManpowerDetails || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Details of other owned Assets</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.detailsOfOtherOwnedAssetsPropertyLandEtcInvestmentDetailsFdMfShareEtc || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Details of other Source of Income</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.detailsOfOtherSourceOfIncomeRentalIncomeAgriIncomeInterestIncomeEtc || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Monthly total Household expenses</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.monthlyTotalHouseholdExpenses || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Collateral Details (for MLAP)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.selfEmployedProfileOccupationalDetails?.collateralDetailsForMlapCaptureTypeOccupancyStatusYearOfPurchaseParentalOwnedEtc || ""}</td>
  </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>END USE (FOR MLAP)</strong></p>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>MLAP (End use in detail)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.endUseForMlap?.mlapEndUseInDetail || ""}</td>
  </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>RESIDENCE/BUSINESS ADDRESS DETAILS:</strong></p>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Particulars</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Residence (for MLAP)</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Business place</strong></td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Premise Address</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceBusinessAddressDetails?.residencePremiseAddress || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceBusinessAddressDetails?.businessPlacePremiseAddress || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Ownership status (Rented/Owned, Parental)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceBusinessAddressDetails?.residenceOwnershipStatusRentedOwnedParental || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceBusinessAddressDetails?.businessPlaceOwnershipStatusRentedOwnedParental || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Owned /rented since when (number of Years)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceBusinessAddressDetails?.residenceOwnedRentedSinceWhenNumberOfYears || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceBusinessAddressDetails?.businessPlaceOwnedRentedSinceWhenNumberOfYears || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Details of Proof of ownership (if available /documented)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceBusinessAddressDetails?.residenceDetailsOfProofOfOwnershipIfAvailableDocumented || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceBusinessAddressDetails?.businessPlaceDetailsOfProofOfOwnershipIfAvailableDocumented || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Rented premised verification status</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceBusinessAddressDetails?.residenceRentedPremisedVerificationStatus || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceBusinessAddressDetails?.businessPlaceRentedPremisedVerificationStatus || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Rent per month (if rented)</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceBusinessAddressDetails?.residenceRentPerMonthIfRented || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceBusinessAddressDetails?.businessPlaceRentPerMonthIfRented || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Locality comment</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceBusinessAddressDetails?.residenceLocalityComment || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceBusinessAddressDetails?.businessPlaceLocalityComment || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Whether Property already Mortgage</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceBusinessAddressDetails?.residenceWhetherPropertyAlreadyMortgageMentionBankNbfcName || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceBusinessAddressDetails?.businessPlaceWhetherPropertyAlreadyMortgageMentionBankNbfcName || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>QR code check status</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceBusinessAddressDetails?.residenceQrCodeCheckStatusPositiveNegative || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceBusinessAddressDetails?.businessPlaceQrCodeCheckStatusPositiveNegative || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Premise visit comment</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceBusinessAddressDetails?.residencePremiseVisitComment || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.residenceBusinessAddressDetails?.businessPlacePremiseVisitComment || ""}</td>
  </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>REFERENCE CHECK DETAILS</strong></p>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Business Ref check</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Ref 1</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Ref 2</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Ref 3</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Ref 4</strong></td>
  </tr>
        ${
          Array.isArray(
            verificationData.referenceCheckDetails?.businessRefCheck
          ) &&
          verificationData.referenceCheckDetails?.businessRefCheck.length > 0
            ? verificationData.referenceCheckDetails.businessRefCheck
                .map(
                  (ref) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>${ref.label || ""}</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${ref.ref1 || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${ref.ref2 || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${ref.ref3 || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${ref.ref4 || ""}</td>
  </tr>
        `
                )
                .join("")
            : '<tr><td colspan="5" style="border:1px solid #ccc;padding:8px;text-align:center;">No business reference check details available</td></tr>'
        }
        
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Residence Ref check</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Ref 1</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Ref 2</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Ref 3</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Ref 4</strong></td>
  </tr>
        ${
          Array.isArray(
            verificationData.referenceCheckDetails?.residenceRefCheck
          ) &&
          verificationData.referenceCheckDetails?.residenceRefCheck.length > 0
            ? verificationData.referenceCheckDetails.residenceRefCheck
                .map(
                  (ref) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>${ref.label || ""}</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${ref.ref1 || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${ref.ref2 || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${ref.ref3 || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${ref.ref4 || ""}</td>
  </tr>
        `
                )
                .join("")
            : '<tr><td colspan="5" style="border:1px solid #ccc;padding:8px;text-align:center;">No residence reference check details available</td></tr>'
        }
      </table>

      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>FINAL PD COMMENT</strong></td>
 </tr>
 <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Interviewer's overall comments, along with explanations</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.finalPdComment?.interviewersOverallCommentsAlongWithExplanations || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Level of Activity & Stocks observed Along with other Observations</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.finalPdComment?.levelOfActivityStocksObservedAlongWithOtherObservations || ""}</td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>PD Status</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>${verificationData.finalPdComment?.pdStatus || ""}</strong></td>
  </tr>
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Remarks for Positive, Negative and Referred Cases</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.finalPdComment?.remarksForPositiveNegativeAndReferredCases || ""}</td>
  </tr>
      </table>

      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Name of the YBL Employee</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.yblEmployeeDetails?.nameOfTheYblEmployee || ""}</td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Designation</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.yblEmployeeDetails?.designation || ""}</td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>EMP ID</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.yblEmployeeDetails?.empId || ""}</td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Signature</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.yblEmployeeDetails?.signature || ""}</td>
  </tr> 
      </table>

      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
  <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>PD agency Interviewer's Name</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.pdAgencyDetails?.pdAgencyInterviewersName || ""}</td>
  </tr>
   <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Report Processed By</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.pdAgencyDetails?.reportProcessedBy || ""}</td>
  </tr>
        </table>

      <p style="margin:20px;"><strong>Disclaimer Clause:</strong></p>
      <p style="margin:20px;">This report (including any attachments) has been prepared based on verbal information provided by the person contacted. YES BANK will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. M/s. KOWTHA & CO will not be held liable in any case.</p>

      <p style="margin:20px;"><strong>VISIT PHOTOS:</strong></p>

      <p style="margin:20px;"><strong>ANNEXURE 1 – FOR AFHL CASES</strong></p>
      <p style="margin:20px;"><strong>ANNEXURE 2 – FOR SALARIED PROFILE</strong></p>
      </div>

    <footer class="pdf-footer">
      <span style="color:rgb(8, 136, 36);">${html_data.bankName || "YES BANK"}</span><br>
      Generated on ${istDate}
    </footer>
    ${html_data.imagesData || ""}
  `;
};
