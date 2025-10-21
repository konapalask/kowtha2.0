import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate } from "./pd-base.tempate";

export const idfcHlMlTemplate = (verificationData: any, html_data: any) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  return `
    ${pdBaseTemplate()}

    <div class="report-title">IDFC Bank LTD – Personal Discussion Report</div>

        <div class="align-wrapper">
      <p style="margin:8px 0;line-height:1.5"><strong>I] General Details:-</strong></p>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Name of the Applicant</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.general?.nameOfTheApplicant || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Name of the Co-Applicant/s</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.general?.nameOfTheCoApplicantS || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Reference Number</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.general?.referenceNumber || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Product</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.general?.product || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Customer Category</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.general?.customerCategory || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Date of Initiation</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.general?.dateOfInitiation || ""}</td>
              </tr>
              <tr>
          <td style="border:1px solid #ccc;padding:8px">Date of Customer Availability</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.general?.dateOfCustomerAvailability || ""}</td>
              </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Date of PD</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.general?.dateOfPd || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Number of Visits Made</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.general?.numberOfVisitsMade || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Person Met</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.general?.personMet || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Place and Address of Visit</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.general?.placeAndAddressOfVisit || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Owned/ Rental</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.general?.ownedRental || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Whether Name Board Seen</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.general?.whetherNameBoardSeen || ""}</td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>II] Personal Details:-</strong></p>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Name of the Applicant</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.personalDetails?.nameOfTheApplicant || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Phone No. of the applicant</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.personalDetails?.phoneNoOfTheApplicant || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">PAN No.</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.personalDetails?.panNo || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Educational Qualification</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.personalDetails?.educationalQualification || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Role in Business</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.personalDetails?.roleInBusiness || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Details of Family Members</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.personalDetails?.detailsOfFamilyMembers || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Residence Address</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.personalDetails?.residenceAddress || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Nature of Residence</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.personalDetails?.natureOfResidence || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">No. of years in the same address</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.personalDetails?.noOfYearsInTheSameAddress || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">No of years in the same City</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.personalDetails?.noOfYearsInTheSameCity || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Permanent Address (If different from above)</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.personalDetails?.permanentAddress || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Name of the co-applicants and relationship</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.personalDetails?.nameOfTheCoApplicantsAndRelationship || ""}</td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>III] Business/ Work Details:-</strong></p>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Name of the Entity/ Employer Name</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessWorkDetails?.nameOfTheEntityEmployerName || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Constitution</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessWorkDetails?.constitution || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Brief on business model and Nature of Business</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessWorkDetails?.briefOnBusinessModelAndNatureOfBusiness || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Year of Incorporation</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessWorkDetails?.yearOfIncorporation || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Business actively managed by Self / Others: If others name and relationship with the applicant</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessWorkDetails?.businessActivelyManagedBySelfOthers || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Number of years in Business/ Service</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessWorkDetails?.numberOfYearsInBusinessService || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Total Work Experience</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessWorkDetails?.totalWorkExperience || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Business started by Self Or Family Business</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessWorkDetails?.businessStartedBySelfOrFamilyBusiness || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Previous Work Experience</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessWorkDetails?.previousWorkExperience || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">If the business entity is a Pvt. Ltd. then Name of the directors and their share holding</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessWorkDetails?.ifTheBusinessEntityIsAPvtLtdThenNameOfTheDirectorsAndTheirShareHolding || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Registered with Shop & Establishment act? if Yes Regn NO</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.businessWorkDetails?.registeredWithShopEstablishmentActIfYesRegnNo || ""}</td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>Business Data:</strong></p>
      <p style="margin:8px 0;line-height:1.5"><strong>IV] Operational Details:-</strong></p>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Nature of Business / Line of activity</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.operationalDetails?.natureOfBusinessLineOfActivity || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Relevant Experience/ Qualification</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.operationalDetails?.relevantExperienceQualification || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Describe Business Process</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.operationalDetails?.describeBusinessProcess || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Activity level at the time of visit</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.operationalDetails?.activityLevelAtTheTimeOfVisit || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Details of Product</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.operationalDetails?.detailsOfProduct || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Source of Raw Material</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.operationalDetails?.sourceOfRawMaterial || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Names of Customers with contact No.</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.operationalDetails?.namesOfCustomersWithContactNo || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Names of Suppliers with contact No.</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.operationalDetails?.namesOfSuppliersWithContactNo || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Employee Strength and Actual seen at the time of Visit</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.operationalDetails?.employeeStrengthAndActualSeenAtTheTimeOfVisit || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Strengths and Weaknesses of Business</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.operationalDetails?.strengthsAndWeaknessesOfBusiness || ""}</td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>V] Financial Details:-</strong></p>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Particulars</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>As per the data provided by the applicant up to 31-03-2025</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>As per our estimation</strong></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Gross Income per year</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.financialDetails?.grossIncomePerYearApplicant || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.financialDetails?.grossIncomePerYearEstimation || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Net Income per year</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.financialDetails?.netIncomePerYearApplicant || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.financialDetails?.netIncomePerYearEstimation || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Net Profit for last 2 years</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.financialDetails?.netProfitForLast2YearsApplicant || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.financialDetails?.netProfitForLast2YearsEstimation || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Gross Business Margin %</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.financialDetails?.grossBusinessMarginApplicant || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.financialDetails?.grossBusinessMarginEstimation || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Net Business Margin %</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.financialDetails?.netBusinessMarginApplicant || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.financialDetails?.netBusinessMarginEstimation || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">No. of years filing ITRs</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.financialDetails?.noOfYearsFilingItRsApplicant || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.financialDetails?.noOfYearsFilingItRsEstimation || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Last 2 years ITRs</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.financialDetails?.last2YearsItRsApplicant || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.financialDetails?.last2YearsItRsEstimation || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Last 2 years Form 16 (Salaried)</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.financialDetails?.last2YearsForm16SalariedApplicant || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.financialDetails?.last2YearsForm16SalariedEstimation || ""}</td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>Loans and Banking Details:</strong></p>
      <p style="margin:8px 0;line-height:1.5">Term Loans:</p>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Institution / Bank / NBFC Name</td>
          <td style="border:1px solid #ccc;padding:8px">Type of Loan (LAP / HL / CD / CV / AL etc.)</td>
          <td style="border:1px solid #ccc;padding:8px">Monthly Principal / EMI</td>
          <td style="border:1px solid #ccc;padding:8px">Monthly Interest (if not in Emi mode)</td>
          <td style="border:1px solid #ccc;padding:8px">Loan amount Rs. Lacs</td>
          <td style="border:1px solid #ccc;padding:8px">MOB</td>
          <td style="border:1px solid #ccc;padding:8px">O/s (Rs)</td>
        </tr>
        ${
          Array.isArray(verificationData.loansAndBankingDetails?.termLoans) &&
          verificationData.loansAndBankingDetails?.termLoans.length > 0
            ? verificationData.loansAndBankingDetails.termLoans
                .map(
                  (loan) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px">${loan.institutionBankNbfcName || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.typeOfLoan || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.monthlyPrincipalEmi || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.monthlyInterest || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.loanAmount || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.mob || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${loan.os || ""}</td>
            </tr>
        `
                )
                .join("")
            : '<tr><td colspan="7" style="border:1px solid #ccc;padding:8px;text-align:center;">No term loans</td></tr>'
        }
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>Banking Details:</strong></p>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Bank Name</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Type of Account</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Relationship since</strong></td>
          <td style="border:1px solid #ccc;padding:8px"><strong>Avg balance</strong></td>
        </tr>
        ${
          Array.isArray(
            verificationData.loansAndBankingDetails?.bankingDetails
          ) &&
          verificationData.loansAndBankingDetails?.bankingDetails.length > 0
            ? verificationData.loansAndBankingDetails.bankingDetails
                .map(
                  (bank) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px">${bank.bankName || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${bank.typeOfAccount || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${bank.relationshipSince || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${bank.avgBalance || ""}</td>
            </tr>
        `
                )
                .join("")
            : '<tr><td colspan="4" style="border:1px solid #ccc;padding:8px;text-align:center;">No banking details</td></tr>'
        }
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>Other Assets:</strong></p>
      <p style="margin:8px 0;line-height:1.5">${verificationData.loansAndBankingDetails?.otherAssets || "Nil"}</p>

      <p style="margin:8px 0;line-height:1.5"><strong>Other Business if any:</strong></p>
      <p style="margin:8px 0;line-height:1.5">${verificationData.loansAndBankingDetails?.otherBusinessIfAny || "-"}</p>

      <p style="margin:8px 0;line-height:1.5"><strong>Rental Income If any:</strong></p>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Property address</td>
          <td style="border:1px solid #ccc;padding:8px">Tenant Name</td>
          <td style="border:1px solid #ccc;padding:8px">Since When ( no of years )</td>
          <td style="border:1px solid #ccc;padding:8px">Rent agreement available ( Y / N )</td>
          <td style="border:1px solid #ccc;padding:8px">Monthly Rent amount? (inclusive of maintenance)</td>
        </tr>
        ${
          Array.isArray(
            verificationData.loansAndBankingDetails?.rentalIncome
          ) && verificationData.loansAndBankingDetails?.rentalIncome.length > 0
            ? verificationData.loansAndBankingDetails.rentalIncome
                .map(
                  (rental) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px">${rental.propertyAddress || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${rental.tenantName || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${rental.sinceWhenNoOfYears || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${rental.rentAgreementAvailable || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${rental.monthlyRentAmount || ""}</td>
        </tr>
        `
                )
                .join("")
            : '<tr><td colspan="5" style="border:1px solid #ccc;padding:8px;text-align:center;">No rental income</td></tr>'
        }
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>VI] Loan Details:-</strong></p>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Amount of Loan Applied</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.loanDetails?.amountOfLoanApplied || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Purpose of Loan (End Use)</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.loanDetails?.purposeOfLoanEndUse || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Collateral Offered</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.loanDetails?.collateralOffered || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Address of the Property offered as collateral</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.loanDetails?.addressOfThePropertyOfferedAsCollateral || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Owner of the Property</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.loanDetails?.ownerOfTheProperty || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">If the Property is Vacant, reason for the same</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.loanDetails?.ifThePropertyIsVacantReasonForTheSame || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Area of the Property (Sq. yd.)</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.loanDetails?.areaOfThePropertySqYd || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Market Value of the Property (Approx)</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.loanDetails?.marketValueOfThePropertyApprox || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Is the property presently mortgaged with any Bank / FI?</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.loanDetails?.isThePropertyPresentlyMortgagedWithAnyBankFi || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">If yes (provide the name of financier and loan details)</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.loanDetails?.ifYesProvideTheNameOfFinancierAndLoanDetails || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">End use of loan</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.loanDetails?.endUseOfLoan || ""}</td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>VII] Personal Discussion Details:-</strong></p>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Strengths</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.personalDiscussionDetails?.strengths || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Other observation</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.personalDiscussionDetails?.otherObservation || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Overall outcome of the Personal Discussion</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.personalDiscussionDetails?.overallOutcomeOfThePersonalDiscussion || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">Remarks</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.personalDiscussionDetails?.remarks || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">PD Conducted by<br>Signature<br>Date</td>
          <td style="border:1px solid #ccc;padding:8px">${verificationData.personalDiscussionDetails?.pdConductedBy || ""}<br>${verificationData.personalDiscussionDetails?.signature || ""}<br>${verificationData.personalDiscussionDetails?.date || ""}</td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>The details provided in the application form and the details provided by the customer at the time of discussion are same – Yes / No. (If NO please provide the details)</strong></p>
      <p style="margin:8px 0;line-height:1.5">${verificationData.personalDiscussionDetails?.detailsMatch || ""}</p>

      <p style="margin:8px 0;line-height:1.5"><strong>Photos:</strong></p>
    </div>

    <footer class="pdf-footer">
      <span style="color:rgb(8, 136, 36);">${html_data.bankName || "IDFC Bank"}</span><br>
      Generated on ${istDate}
    </footer>
    ${html_data.imagesData || ""}
  `;
};
