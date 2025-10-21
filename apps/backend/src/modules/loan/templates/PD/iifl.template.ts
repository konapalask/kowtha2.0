import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate } from "./pd-base.tempate";

export const iiflTemplate = (verificationData: any, html_data: any) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  return `
    ${pdBaseTemplate()}

    <div class="report-title">PD SHEET - SELF EMPLOYED APPLICANT</div>

    <div class="align-wrapper">
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Prospect No.</td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px"><strong>${verificationData.prospectNo?.prospectNo || ""}</strong></td>
        </tr>
        <tr>
          <td colspan="7" style="border:1px solid #ccc;padding:8px"><strong>NOTE: Please tick/circle as applicable</strong></td>
        </tr>
        <tr>
          <td colspan="7" style="border:1px solid #ccc;padding:8px"><strong>Basic Details</strong></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Name</strong></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px">${verificationData.prospectNo?.name || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Marital Status</strong></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px">${verificationData.prospectNo?.maritalStatusSingleMarriedDivorcedOthers || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Educational Qualification</strong></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px">${verificationData.prospectNo?.educationalQualificationBelow10th10thPass12thPassDiplomaItiGraduatePgProfessionalCertification || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Category</strong></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px">${verificationData.categoryGeneralScStObcOthers?.categoryGeneralScStObcOthers || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Number of Dependents</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Children:</strong> ${verificationData.categoryGeneralScStObcOthers?.children || ""}</td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Adults:</strong> ${verificationData.categoryGeneralScStObcOthers?.adults || ""}</td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px"><strong>Others:</strong> ${verificationData.categoryGeneralScStObcOthers?.others || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Number of years in Current Residence</strong></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px">${verificationData.categoryGeneralScStObcOthers?.numberOfYearsInCurrentResidence113355Years || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Current residence house size</strong></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px">${verificationData.categoryGeneralScStObcOthers?.currentResidenceHouseSize1rk1bhk2bhk2bhk || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>If <=1 Year, then Previous Address</strong></td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.categoryGeneralScStObcOthers?.if1YearThenPreviousAddress || ""}</td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Number of Years stayed at that Address</strong></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.categoryGeneralScStObcOthers?.numberOfYearsStayedAtThatAddress || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Number of Years in Current City</strong></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px">${verificationData.categoryGeneralScStObcOthers?.numberOfYearsInCurrentCity3Years3Years || ""}</td>
        </tr>
        <tr>
          <td rowspan="2" style="border:1px solid #ccc;padding:8px"><strong>If <=3 Years in current city, then mention</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Previous City</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.categoryGeneralScStObcOthers?.if3YearsPreviousCity || ""}</td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Number of Years In that City</strong></td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.categoryGeneralScStObcOthers?.numberOfYearsInThatCity || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Reason for Change</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.categoryGeneralScStObcOthers?.reasonForChange || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Parents Staying with?</strong></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px">${verificationData.categoryGeneralScStObcOthers?.parentsStayingWithSelfSeparateExpired || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Usage of Property after Purchase</strong></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px">${verificationData.categoryGeneralScStObcOthers?.usageOfPropertyAfterPurchaseSelfOccupancyInvestmentRentingPurposeOthers || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Brief Comments/Observation of the case</strong></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px">
            <table style="border-collapse:collapse;width:100%;margin:0">
              <tr>
                <td style="padding:4px"><strong>Date Of case Initiated:</strong></td>
                <td style="padding:4px">${verificationData.categoryGeneralScStObcOthers?.dateOfCaseInitiated || ""}</td>
        </tr>
        <tr>
                <td style="padding:4px"><strong>Date Of Appointment Provided:</strong></td>
                <td style="padding:4px">${verificationData.categoryGeneralScStObcOthers?.dateOfAppointmentProvided || ""}</td>
        </tr>
        <tr>
                <td style="padding:4px"><strong>Initiated Address:</strong></td>
                <td style="padding:4px">${verificationData.categoryGeneralScStObcOthers?.initiatedAddress || ""}</td>
        </tr>
        <tr>
                <td style="padding:4px"><strong>Visited Address:</strong></td>
                <td style="padding:4px">${verificationData.categoryGeneralScStObcOthers?.visitedAddress || ""}</td>
        </tr>
        <tr>
                <td style="padding:4px"><strong>Residential Address:</strong></td>
                <td style="padding:4px">${verificationData.categoryGeneralScStObcOthers?.residentialAddress || ""}</td>
        </tr>
        <tr>
                <td style="padding:4px"><strong>Contact Information:</strong></td>
                <td style="padding:4px">${verificationData.categoryGeneralScStObcOthers?.contactInformation || ""}</td>
        </tr>
        <tr>
                <td style="padding:4px"><strong>Loan Amount Required:</strong></td>
                <td style="padding:4px">${verificationData.categoryGeneralScStObcOthers?.loanAmountRequired || ""}</td>
        </tr>
        <tr>
                <td style="padding:4px"><strong>Purpose Of the Loan:</strong></td>
                <td style="padding:4px">${verificationData.categoryGeneralScStObcOthers?.purposeOfTheLoan || ""}</td>
        </tr>
        <tr>
                <td style="padding:4px"><strong>Profile Initiated:</strong></td>
                <td style="padding:4px">${verificationData.categoryGeneralScStObcOthers?.profileInitiated || ""}</td>
        </tr>
      </table>
            
            <p style="margin:8px 0;"><strong>Family Details</strong></p>
            <p style="margin:4px 0;">${verificationData.categoryGeneralScStObcOthers?.familyDetails || ""}</p>
            
            <p style="margin:8px 0;"><strong>Applicant's Profile</strong></p>
            <p style="margin:4px 0;">${verificationData.categoryGeneralScStObcOthers?.applicantsProfile || ""}</p>
            
            <p style="margin:8px 0;"><strong>Concerns</strong></p>
            <p style="margin:4px 0;">${verificationData.categoryGeneralScStObcOthers?.concerns || ""}</p>
            
            <p style="margin:8px 0;"><strong>Other Observations:</strong></p>
            <p style="margin:4px 0;">${verificationData.categoryGeneralScStObcOthers?.otherObservations || ""}</p>
            
            <p style="margin:8px 0;"><strong>Income Details:</strong></p>
            <p style="margin:4px 0;">${verificationData.categoryGeneralScStObcOthers?.incomeDetails || ""}</p>
            
            <p style="margin:8px 0;"><strong>Other Incomes:</strong></p>
            <p style="margin:4px 0;">${verificationData.categoryGeneralScStObcOthers?.otherIncomes || ""}</p>
            
            <p style="margin:8px 0;"><strong>REFERENCE DETAILS</strong></p>
            <p style="margin:4px 0;">${verificationData.categoryGeneralScStObcOthers?.referenceDetails || ""}</p>
            
            <p style="margin:8px 0;"><strong>STATUS OF THE CASE:</strong></p>
            <p style="margin:4px 0;"><strong>${verificationData.categoryGeneralScStObcOthers?.statusOfTheCase || ""}</strong></p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Name of PD Officer</strong></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px">${verificationData.categoryGeneralScStObcOthers?.nameOfPdOfficer || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Date of Discussion</strong></td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.categoryGeneralScStObcOthers?.dateOfDiscussion || ""}</td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Signature of the PD Officer</strong></td>
          <td colspan="4" style="border:1px solid #ccc;padding:8px">${verificationData.categoryGeneralScStObcOthers?.signatureOfThePdOfficer || ""}</td>
        </tr>
      </table>
    </div>

    <p style="margin:20px;"><strong>Disclaimer Clause:</strong></p>
    <p style="margin:20px;">This report (including any attachments) has been prepared based on verbal information provided by the person contacted. IIFL HOME FINANCE LTD will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. M/s. KOWTHA & CO will not be held liable in any case.</p>

    <p style="margin:20px;"><strong>PHOTOS:</strong></p>

    <footer class="pdf-footer">
      <span style="color:rgb(8, 136, 36);">${html_data.bankName || "IIFL"}</span><br>
      Generated on ${istDate}
    </footer>
    ${html_data.imagesData || ""}
  `;
};
