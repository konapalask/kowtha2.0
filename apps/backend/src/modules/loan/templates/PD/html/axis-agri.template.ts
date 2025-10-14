import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate } from "./pd-base.tempate";

export const axisagriTemplate = (verificationData: any, html_data: any) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  return `
    ${pdBaseTemplate()}

    <div class="report-title">PERSONAL DISCUSSION SHEET (PD) WITH RURAL ENTERPRISE</div>

    <div class="align-wrapper">
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td colspan="6" style="border:1px solid #ccc;padding:8px">
            <strong>Personal Discussion Sheet (PD) with Rural Enterprise</strong>
          </td>
        </tr>
        <tr>
          <td colspan="6" style="border:1px solid #ccc;padding:8px">
            Reference Number - ${verificationData.general?.referenceNumber || ""}
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Name of Firm:</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.general?.nameOfFirm || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Constitution</strong></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.general?.constitution || ""}</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"><strong>Incorporation Date:</strong> ${verificationData.general?.incorporationDate || ""}</td>
        </tr>
        <tr>
          <td rowspan="2" style="border:1px solid #ccc;padding:8px"><strong>Address of the Firm</strong></td>
          <td colspan="5" rowspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.addressOfTheFirm?.addressOfTheFirm || ""}</td>
        </tr>
        <tr></tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Date & Time of PD</strong></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.addressOfTheFirm?.dateTimeOfPd || ""}</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"><strong>Place of PD:</strong> ${verificationData.addressOfTheFirm?.placeOfPd || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Name of Person Met</strong></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.addressOfTheFirm?.nameOfPersonMet || ""}</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"><strong>Designation:</strong> ${verificationData.addressOfTheFirm?.designation || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>Name of PD Official:</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.addressOfTheFirm?.nameOfPdOfficial || ""}</td>
        </tr>
        <tr>
          <td colspan="6" style="border:1px solid #ccc;padding:8px"><strong>Business Profile:</strong></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>1. Type of Industry</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.typeOfIndustry || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>2. Nature of business:</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.natureOfBusiness || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>3. Details on management of business</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.detailsOnManagementOfBusiness || ""}</td>
        </tr>
        <tr>
          <td rowspan="2" style="border:1px solid #ccc;padding:8px"><strong>4. Total Experience in Same line Business</strong></td>
          <td colspan="5" rowspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.totalExperienceInSameLineBusiness || ""}</td>
        </tr>
        <tr></tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>5. Shareholding Details</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.shareholdingDetails || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>6. Business Locality:</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.businessLocality || ""}</td>
        </tr>
        <tr>
          <td colspan="6" style="border:1px solid #ccc;padding:8px"></td>
        </tr>
        <tr>
          <td rowspan="3" style="border:1px solid #ccc;padding:8px"><strong>7. Business Premise setup / Ownership / Nameplate / Staff etc.</strong></td>
          <td colspan="5" rowspan="3" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.businessPremiseSetup || ""}</td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr>
          <td rowspan="2" style="border:1px solid #ccc;padding:8px"><strong>8. Financial Brief:</strong></td>
          <td colspan="5" rowspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.financialBrief || ""}</td>
        </tr>
        <tr></tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>9. End use of the Loan & Loan amount Required</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.endUseOfTheLoanAndLoanAmountRequired || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>10. Other Businesses owned if any & other Incomes:</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.otherBusinessesOwnedIfAnyAndOtherIncomes || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>11. Business License Related Information:</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.businessLicenseRelatedInformation || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>12. Documents Provided during Visit:</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.documentsProvidedDuringVisit || ""}</td>
        </tr>
        <tr>
          <td rowspan="4" style="border:1px solid #ccc;padding:8px"><strong>13. Banking & Working Capital Limit Information</strong></td>
          <td rowspan="2" style="border:1px solid #ccc;padding:8px"><strong>Bank name</strong></td>
          <td colspan="3" rowspan="2" style="border:1px solid #ccc;padding:8px"><strong>Limit Type</strong></td>
          <td rowspan="2" style="border:1px solid #ccc;padding:8px"><strong>Limit Amount</strong></td>
        </tr>
        <tr></tr>
        ${
          Array.isArray(
            verificationData.businessProfile
              ?.bankingAndWorkingCapitalLimitInformation
          ) &&
          verificationData.businessProfile
            ?.bankingAndWorkingCapitalLimitInformation.length > 0
            ? verificationData.businessProfile.bankingAndWorkingCapitalLimitInformation
                .map(
                  (banking) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px">${banking.bankName || ""}</td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${banking.limitType || ""}</td>
          <td style="border:1px solid #ccc;padding:8px">${banking.limitAmount || ""}</td>
        </tr>
        `
                )
                .join("")
            : `<tr><td colspan="5" style="border:1px solid #ccc;padding:8px;text-align:center;">No banking details available</td></tr>`
        }
        <tr>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.additionalDetailsConductTod || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>14. Is it a Takeover</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.isItATakeover || ""}</td>
        </tr>
        <tr>
          <td rowspan="2" style="border:1px solid #ccc;padding:8px"><strong>15. Any other Loan Obligations of the Firm</strong></td>
          <td colspan="5" rowspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.anyOtherLoanObligationsOfTheFirm || ""}</td>
        </tr>
        <tr></tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>16. Current Account if any</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.currentAccountIfAny || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>17. Collateral Security Details</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.collateralSecurityDetails || ""}</td>
        </tr>
        <tr>
          <td rowspan="2" style="border:1px solid #ccc;padding:8px"><strong>18. Existing Banking Relations with Axis if any</strong></td>
          <td colspan="5" rowspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.existingBankingRelationsWithAxisIfAny || ""}</td>
        </tr>
        <tr></tr>
        <tr>
          <td rowspan="3" style="border:1px solid #ccc;padding:8px"><strong>19. Major Suppliers & Clients</strong></td>
          <td colspan="3" style="border:1px solid #ccc;padding:8px"><strong>Suppliers (Creditors)</strong></td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px"><strong>Clients (Debtors)</strong></td>
        </tr>
        ${
          Array.isArray(
            verificationData.businessProfile?.majorSuppliersAndClients
          ) &&
          verificationData.businessProfile?.majorSuppliersAndClients.length > 0
            ? verificationData.businessProfile.majorSuppliersAndClients
                .map(
                  (item) => `
        <tr>
          <td colspan="3" style="border:1px solid #ccc;padding:8px">${item.suppliers || ""}</td>
          <td colspan="2" style="border:1px solid #ccc;padding:8px">${item.clients || ""}</td>
        </tr>
        `
                )
                .join("")
            : `<tr><td colspan="5" style="border:1px solid #ccc;padding:8px;text-align:center;">No suppliers/clients information available</td></tr>`
        }
        <tr>
          <td rowspan="2" style="border:1px solid #ccc;padding:8px"><strong>20. Stocks/Raw material related observations:</strong></td>
          <td colspan="5" rowspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.stocksRawMaterialRelatedObservations || ""}</td>
        </tr>
        <tr></tr>
        <tr>
          <td rowspan="2" style="border:1px solid #ccc;padding:8px"><strong>21. COVID-19 Impact & Recovery period Or any other Business Risks</strong></td>
          <td colspan="5" rowspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.covid19ImpactAndRecoveryPeriod || ""}</td>
        </tr>
        <tr></tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>22. Family Background & Net-worth</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.familyBackgroundAndNetWorth || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>23. Business Succession Plan</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.businessSuccessionPlan || ""}</td>
        </tr>
        <tr>
          <td rowspan="2" style="border:1px solid #ccc;padding:8px"><strong>24. Qualification of Proprietor / Partners / Directors</strong></td>
          <td colspan="5" rowspan="2" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.qualificationOfProprietor || ""}</td>
        </tr>
        <tr></tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>25. Third Party Checks</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.thirdPartyChecks || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>26. Lease land Verification</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.leaseLandVerification || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>27. Remarks & Observations</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">${verificationData.businessProfile?.remarksAndObservations || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>PD Final Status</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px"><strong>${verificationData.businessProfile?.pdFinalStatus || ""}</strong></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><strong>PD Vendor Name & Address</strong></td>
          <td colspan="5" style="border:1px solid #ccc;padding:8px">PD Vendor Stamp & Signature</td>
        </tr>
      </table>
    </div>

    <p style="margin:20px;"><strong>Photos:</strong></p>

    <footer class="pdf-footer">
      <span style="color:rgb(8, 136, 36);">${html_data.bankName || "AXIS AGRI"}</span><br>
      Generated on ${istDate}
    </footer>
    ${html_data.imagesData || ""}
  `;
};
