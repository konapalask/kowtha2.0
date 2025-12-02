import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:16px 0";
const labelCellStyle =
  "border:1px solid #c7cdd1;padding:8px;font-weight:600;color:#222;background:#f4f6fb;vertical-align:top;width:32%";
const valueCellStyle =
  "border:1px solid #c7cdd1;padding:8px;color:#333;vertical-align:top";

const hasValue = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.some((entry) => hasValue(entry));
  if (typeof value === "object")
    return Object.values(value).some((entry) => hasValue(entry));
  return false;
};

const formatMultiline = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  return String(value).replace(/\n+/g, "<br>");
};

const formatCurrency = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return formatMultiline(value);
  return `Rs. ${numeric.toLocaleString("en-IN")}/-`;
};

const formatObservations = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  return String(value).replace(/\n+/g, "<br>");
};
const ensureArray = <T,>(value: T | T[] | null | undefined): T[] => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
};

const renderKeyValue = (label: string, value: any, formatter?: (value: any) => string, options?: { colspan?: number }) => {
  const rendered = formatter ? formatter(value) : formatMultiline(value);
  return `
    <tr>
      <td style="${labelCellStyle}">${label}</td>
      <td style="${valueCellStyle}" colspan="${options?.colspan || 1}">
        ${rendered}
      </td>
    </tr>
  `;
};

const renderArrayTable = (headers: string[], rows: string[][]): string => {
  return `
    <table style="${tableStyle}">
      <tr>
        ${headers.map((header) => `<th style="${labelCellStyle}">${header}</th>`).join("")}
      </tr>
      ${rows.map((row) => `
        <tr>
          ${row.map((cell) => `<td style="${valueCellStyle}">${cell}</td>`).join("")}
        </tr>
      `).join("")}
    </table>
  `;
};


export const janaSenpBelow50lTemplate = (verificationData: any, html_data: any) => {
  const applicationDetails = verificationData.applicationDetails || {};
  const borrowerFamilyDetails = verificationData.borrowerFamilyDetails || {};
  const addressDetails = verificationData.addressDetails || {};
  const borrowerprofile = verificationData.borrowerprofile || {};
  const residenceDetails = verificationData.residenceDetails || {};
  const residenceOwnershipDetails = verificationData.residenceOwnershipDetails || {};
  const nameOfFirm = verificationData.nameOfFirm || {};
  const designation = verificationData.designation || {};
  const shareholdingDetails = verificationData.shareholdingDetails || {};
  const employmentOrBusinessDetails = verificationData.employmentOrBusinessDetails || {};
  const jobProfile = verificationData.jobProfile || {};
  const averageStockMaintained = verificationData.averageStockMaintained || {};
  const workingHours = verificationData.workingHours || {};
  const employmentDetails = verificationData.employmentDetails || {};  
  const currentMonthlySalary = verificationData.currentMonthlySalary || {};
  const otherIncome = verificationData.otherIncome || {};
  const specificForCashSalariedProfile = verificationData.specificForCashSalariedProfile || {};
  const businessAndProuctsAndEndUseOfTheSame = verificationData.businessAndProuctsAndEndUseOfTheSame || {};
  const clientDetails = verificationData.clientDetails || {};
  const vendorDetails = verificationData.vendorDetails || {};
  const thirdPartyChecks = verificationData.thirdPartyChecks || [];
  const incomeAssessment = verificationData.incomeAssessment || {};
  const specificForContractorProfile = verificationData.specificForContractorProfile || {};
  const levelOfActivity = verificationData?.levelOfActivity || {};
  const mortgageDetails = verificationData.mortgageDetails || {};
  const endUseOfLoan = verificationData.endUseOfLoan || {};
  const assetDetails = verificationData.assetDetails || {};
  const loanDetails = verificationData.loanDetails || {};
  const bankingDetails = verificationData.bankingDetails || {};
  const loanAmountAndEndUseOfLoan = verificationData.loanAmountAndEndUseOfLoan || {};
  const existingRelationWithLender = verificationData.existingRelationWithLender || {};
  const documentsSeen = verificationData.documentsSeen || {};
  const interviewerComments = verificationData.interviewerComments || {};
  const observations = verificationData.observations || {};
  const pdStatus = verificationData.pdStatus || {};
  const interviewerDetails = verificationData.interviewerDetails || {};
  const geoTagDetails = verificationData?.geoTagDetails || {};


  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content">
      <h1 class="report-title">Jana Small Finance Bank Ltd.</h1>
    </div>
    <table style="${tableStyle}">
      <tr>
        <td style="${labelCellStyle}">Application Number</td>
        <td style="${valueCellStyle}">${applicationDetails?.applicationNumber}</td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Details of Borrower’s & their family members & their Occupations</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Name</td>
              <td style="${labelCellStyle}">Relation</td>
              <td style="${labelCellStyle}">Age (DOB)</td>
              <td style="${labelCellStyle}">Qualification</td>
              <td style="${labelCellStyle}">Earning (Yes/No)</td>
              <td style="${labelCellStyle}">Approx. Income</td>
            </tr>
            ${ensureArray(borrowerFamilyDetails?.borrowerFamilyDetails).map((borrower: any) => `
              <tr>  
                <td style="${valueCellStyle}">${borrower.name}</td>
                <td style="${valueCellStyle}">${borrower.relationWithApplicant}</td>
                <td style="${valueCellStyle}">${borrower.age}</td>
                <td style="${valueCellStyle}">${borrower.qualification}</td>
                <td style="${valueCellStyle}">${borrower.earningMember}</td>
                <td style="${valueCellStyle}">${formatCurrency(borrower.approxIncome)}</td>
              </tr>
            `).join("")}
          </table>
        </td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Initiated address (Employment/Business</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Initiated Address</td>
              <td style="${labelCellStyle}">Visited Address</td>
            </tr>
            <tr>
              <td style="${valueCellStyle}">${formatMultiline(addressDetails?.initiatedAddress)}</td>
              <td style="${valueCellStyle}">${formatMultiline(addressDetails?.visitedAddress)}</td>
            </tr>
          </table>
        </td>
      </tr>


      <tr>
        <td style="${labelCellStyle}">Borrower Profile</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Applicant</td>
              <td style="${valueCellStyle}">${borrowerprofile?.applicantName} (${borrowerprofile?.applicantDateOfBirth})</td>
              </tr>
              <tr>
              <td style="${labelCellStyle}">Co-Applicant</td>
              <td style="${valueCellStyle}">${borrowerprofile?.coApplicantName} (${borrowerprofile?.coApplicantDateOfBirth})</td>
            </tr>
          </table>
        </td>
      </tr>

      ${renderKeyValue("Residence Details & Stability at Current Residence", formatMultiline(residenceDetails?.residenceDetails))}

      ${renderKeyValue("Residence Ownership", residenceOwnershipDetails?.residenceOwnership)}

      ${renderKeyValue("Name of Firm (employer/business)", nameOfFirm?.nameOfFirm)}

      ${renderKeyValue("Designation of Borrower/ownership type of business", designation?.designation)}


      <tr>
        <td style="${labelCellStyle}">If Partnership or Pvt. Ltd. Firm details of partner’s/share holders</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
          <tr>
            <td style="${labelCellStyle}" colspan="6"><u>Shareholding Details:</u></td>
          </tr>
            <tr>
              <td style="${labelCellStyle}">Name of the Shareholder</td>
              <td style="${labelCellStyle}">Relation with Applicant</td>
              <td style="${labelCellStyle}">Designation</td>
              <td style="${labelCellStyle}">% of Shareholding</td>
              <td style="${labelCellStyle}">Coming into Loan Structure</td>
              <td style="${labelCellStyle}">Function Handled</td>
            </tr>
            ${ensureArray(shareholdingDetails?.shareholdingDetails).map((shareholder: any) => `
              <tr>
                <td style="${valueCellStyle}">${shareholder.shareholderName}</td>
                <td style="${valueCellStyle}">${shareholder.relationWithApplicant}</td>
                <td style="${valueCellStyle}">${shareholder.designation}</td>
                <td style="${valueCellStyle}">${shareholder.shareholdingPercentage}</td>
                <td style="${valueCellStyle}">${shareholder.comingIntoLoanStructure}</td>
                <td style="${valueCellStyle}">${shareholder.functionHandled}</td>
              </tr>
            `).join("")}
          </table>
        </td>
      </tr>


      <tr>
        <td style="${labelCellStyle}">Employment/ Business Details & Stability Business premises details</td>
        <td style="${valueCellStyle}">${formatMultiline(employmentOrBusinessDetails?.employmentDetails)} <br> ${formatMultiline(employmentOrBusinessDetails?.businessPremises)}</td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Business Profile /Employment job profile along with previous business/employment details</td>
        <td style="${valueCellStyle}">${formatMultiline(jobProfile?.businessOrEmploymentProfile)} <br> ${formatMultiline(jobProfile?.previousBusinessOrEmploymentDetails)}</td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Average Stock Maintained</td>
        <td style="${valueCellStyle}">${formatCurrency(averageStockMaintained?.averageStockMaintained)}</td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Working Hours</td>
        <td style="${valueCellStyle}">${formatMultiline(workingHours?.workingHours)}</td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Employee Details (to be filled for Self Employed Profile)</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">No of Employees</td>
              <td style="${labelCellStyle}">Salary per month per employee</td>
              <td style="${labelCellStyle}">Status of Employee</td>
              <td style="${labelCellStyle}">No of Labours</td>
              <td style="${labelCellStyle}">Wages per month/per day</td>
              <td style="${labelCellStyle}">Status of Labour</td>
            </tr>
            <tr>
              <td style="${valueCellStyle}">${employmentDetails?.noOfEmployees}</td>
              <td style="${valueCellStyle}">${formatCurrency(employmentDetails?.salaryPerMonthPerEmployee)}</td>
              <td style="${valueCellStyle}">${employmentDetails?.statusOfEmployee}</td>
              <td style="${valueCellStyle}">${employmentDetails?.noOfLabours}</td>
              <td style="${valueCellStyle}">${formatCurrency(employmentDetails?.wagesPerMonthOrDay)}</td>
              <td style="${valueCellStyle}">${employmentDetails?.statusOfLabour}</td>
            </tr>
          </table>
        </td> 
      </tr>

      <tr>
        <td style="${labelCellStyle}">Current monthly Salary (to be filled in salaried income profile)</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Mode of salary paid by employer – Cash/ Bank credit</td>
              <td style="${valueCellStyle}" colspan="3">${currentMonthlySalary?.modeOfSalaryPayment}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Last 3 Month Salary</td>
              <td style="${labelCellStyle}">Net Salary as per salary slip/ certificate</td>
              <td style="${labelCellStyle}">Net Salary as per bank credits</td>
              <td style="${labelCellStyle}">Date of Credit</td>
            </tr>
            <tr>
              <td style="${valueCellStyle}">${currentMonthlySalary?.last3MonthSalary}</td>
              <td style="${valueCellStyle}">${formatCurrency(currentMonthlySalary?.netSalaryAsPerSalarySlipOrCertificate)}</td>
              <td style="${valueCellStyle}">${formatCurrency(currentMonthlySalary?.netSalaryAsPeBankCredits)}</td>
              <td style="${valueCellStyle}">${currentMonthlySalary?.dateOfCredit}</td>
            </tr>
          </table>
        </td>
      </tr>


      <tr>
        <td style="${labelCellStyle}">Other Source of Income (if any)</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Type of Income</td>
              <td style="${labelCellStyle}">Amount</td>
              <td style="${labelCellStyle}">Remarks (pls. Specify)</td>
            </tr>
            ${ensureArray(otherIncome?.otherIncome).map((income: any) => `
              <tr>
                <td style="${valueCellStyle}">${income.typeOfIncome}</td>
                <td style="${valueCellStyle}">${formatCurrency(income.incomeAmount)}</td>
                <td style="${valueCellStyle}">${income.remarks}</td>
              </tr>
            `).join("")}
          </table>
        </td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Specific for Cash Salaried Profile</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
              <tr>
              <td style="${labelCellStyle}" colspan="2">To be filled in for Cash Salaried profile:-</td>
              </tr>
            <tr>
              <td style="${labelCellStyle}">Did the PD agent met the employer (Y/N) (Name of the employer & mobile number)</td>
              <td style="${valueCellStyle}">${specificForCashSalariedProfile?.didPdAgentMetTheEmployer} <br> ${specificForCashSalariedProfile?.employerName} <br> ${specificForCashSalariedProfile?.mobileNumberOfEmployer}</td>
            </tr> 
            <tr>
              <td style="${labelCellStyle}">Does the employer maintain the attendance register (Y/N) <br> </td>
              <td style="${valueCellStyle}">${specificForCashSalariedProfile?.employerMaintainAttendanceSheet}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">If yes, is the name of the borrower reflecting in the attendance register (Y/N) & for how many months (try to check last 6 months attendance register)</td>
              <td style="${valueCellStyle}">${specificForCashSalariedProfile?.nameOfBorrowerReflectingInAttendance} , ${specificForCashSalariedProfile?.howManyMonthsReflectingInAttendance}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">If no, then do reference checks for employment confirmation with other employees working in the same firm. Minimum 2 references to be obtain. (Name & mobile number of the reference people to be documented)</td>
              <td style="${valueCellStyle}">${specificForCashSalariedProfile?.attendanceReferenceChecksinSameFirm?.map((reference: any) => `${reference.nameOfReferencePeople} , ${reference.mobileNumberReferencePeople}`).join("<br> ")}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Neighbour two reference checks to confirm applicant’s employer information is correct. (name & contact number along with feedback to be documented)</td>
              <td style="${valueCellStyle}">${specificForCashSalariedProfile?.attendanceNeighboursReferenceChecks?.map((reference: any) => `${reference.nameOfNeighbour} , ${reference.mobileNumberNeighbour} , ${reference.feedbackOnApplicant}`).join("<br> ")}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Does the employer maintain any salary register or any salary paid receipt/voucher or any other documentary proof for salary being paid to the borrower (Y/N) If yes, verify the salary paid to the borrower and capture photos in the PD report</td>
              <td style="${valueCellStyle}">${specificForCashSalariedProfile?.proofOfSalaryMaintenance}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">If no, then do reference checks with other employees working in the same firm for salary confirmation. Minimum 2 references to be obtained. (Name & mobile number of the reference people to be documented).</td>
              <td style="${valueCellStyle}">${specificForCashSalariedProfile?.salaryReferenceCheckInSameFirm?.map((reference: any) => `${reference.nameOfReferencePeople} , ${reference.mobileNumberReferencePeople}`).join("<br> ")}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Any variation in the salary paid amount as per salary certificate & as per salary register verified during the visit.</td>
              <td style="${valueCellStyle}">${specificForCashSalariedProfile?.variationInSalary}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Does the employer has GST number? (Y/N). If yes, Try to collect GST of the employer.</td>
              <td style="${valueCellStyle}">${specificForCashSalariedProfile?.employeHasGSTNumber} - ${specificForCashSalariedProfile?.gstNumber}</td>
            </tr>
          </table>
        </td>
      </tr>


      <tr>
        <td style="${labelCellStyle}">Main Business, Products and End use of the same</td>
        <td style="${valueCellStyle}">${formatMultiline(businessAndProuctsAndEndUseOfTheSame?.endUseOfProducts)}</td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Clients</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">No of Fixed Clients</td>
              <td style="${valueCellStyle}" colspan="3">${clientDetails?.noOfFixedClients}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Credit Period</td>
              <td style="${valueCellStyle}" colspan="3">${clientDetails?.creditPeriod}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Cash - Cheque proportion</td>
              <td style="${valueCellStyle}" colspan="3">${clientDetails?.cashChequeProportion}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Name (top 3 customers)</td>
              <td style="${labelCellStyle}">Contact Details</td>
              <td style="${labelCellStyle}">Location</td>
              <td style="${labelCellStyle}">Ref. Check</td>
            </tr>
            ${ensureArray(clientDetails?.top3customers).map((customer: any) => `
              <tr>
                <td style="${valueCellStyle}">${customer.nameOfClient}</td>
                <td style="${valueCellStyle}">${customer.contactDetails}</td>
                <td style="${valueCellStyle}">${customer.location}</td>
                <td style="${valueCellStyle}">${customer.referenceCheck}</td>
              </tr>
            `).join("")}
          </table>
        </td>
      </tr>


      <tr>
        <td style="${labelCellStyle}">Vendors</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">No of Fixed Vendors</td>
              <td style="${valueCellStyle}" colspan="3">${vendorDetails?.noOfFixedVendor}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Credit Period</td>
              <td style="${valueCellStyle}" colspan="3">${vendorDetails?.creditPeriod}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Cash - Cheque proportion</td>
              <td style="${valueCellStyle}" colspan="3">${vendorDetails?.cashChequeProportion}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Name (top 3 vendors)</td>
              <td style="${labelCellStyle}">Contact Details</td>
              <td style="${labelCellStyle}">Location</td>
              <td style="${labelCellStyle}">Ref. Check</td>
            </tr>
            ${ensureArray(vendorDetails?.top3vendors).map((vendor: any) => `
              <tr>
                <td style="${valueCellStyle}">${vendor?.nameOfVendor}</td>
                <td style="${valueCellStyle}">${vendor?.contactDetails}</td>
                <td style="${valueCellStyle}">${vendor?.location}</td>
                <td style="${valueCellStyle}">${vendor?.referenceCheck}</td>
              </tr>
            `).join("")}
          </table>
        </td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">TPC Check</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Individual / Business Name</td>
              <td style="${labelCellStyle}">Address</td>
              <td style="${labelCellStyle}">Contact No.</td>
              <td style="${labelCellStyle}">Knowing Since (Months / Years)</td>
              <td style="${labelCellStyle}">Feedback on Borrower</td>
              <td style="${labelCellStyle}">Feedback on Business</td>
            </tr>
            ${ensureArray(thirdPartyChecks?.thirdPartyChecks).map((check: any) => `
              <tr>
                <td style="${valueCellStyle}">${check?.individualOrBusinessName || ""}</td>
                <td style="${valueCellStyle}">${check?.address || ""}</td>
                <td style="${valueCellStyle}">${check?.contactNo || ""}</td>
                <td style="${valueCellStyle}">${check?.knowingSince || ""}</td>
                <td style="${valueCellStyle}">${check?.feedbackOnBorrower || ""}</td>
                <td style="${valueCellStyle}">${check?.feedbackOnBusiness || ""}</td>
              </tr>
            `).join("")}
          </table>
        </td>
      </tr>



      <tr>
        <td style="${labelCellStyle}">Income Assessment</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Last 3 Month Salary</td>
              <td style="${labelCellStyle}">Sales</td>
              <td style="${labelCellStyle}">Net Profit Margin</td>
              <td style="${labelCellStyle}">GST Paid (in Rupees)</td>
            </tr>
            ${ensureArray(incomeAssessment?.incomedetails).map((income: any) => `
              <tr>
                <td style="${valueCellStyle}">${formatCurrency(income.last3MonthSalary)}</td>
                <td style="${valueCellStyle}">${formatCurrency(income.sales)}</td>
                <td style="${valueCellStyle}">${formatCurrency(income.netProfitMargin)}</td>
                <td style="${valueCellStyle}">${formatCurrency(income.gstPaid)}</td>
              </tr>
            `).join("")}

            <tr>
              <td style="${labelCellStyle}" colspan="2"><u>Particulars:</u></td>
              <td style="${labelCellStyle}" colspan="2"><u>Amount (approx.):</u></td>
            </tr>
            <tr>
              <td style="${labelCellStyle}" colspan="2">Total Monthly Sales/Revenue</td>
              <td style="${valueCellStyle}" colspan="2">${formatCurrency(incomeAssessment?.totalMonthlySalesOrRevenue)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}" colspan="2">Less: Monthly Business Expenses</td>
              <td style="${valueCellStyle}" colspan="2">${formatCurrency(incomeAssessment?.monthlyBusinessExpenses)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}" colspan="2">Net Business Income</td>
              <td style="${valueCellStyle}" colspan="2">${formatCurrency(incomeAssessment?.netBusinessIncome)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}" colspan="2">Less: Current Obligations</td>
              <td style="${valueCellStyle}" colspan="2">${formatCurrency(incomeAssessment?.currentObligations)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}" colspan="2">Less: Family Expenses</td>
              <td style="${valueCellStyle}" colspan="2">${formatCurrency(incomeAssessment?.familyExpenses)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}" colspan="2">Net Disposal Income</td>
              <td style="${valueCellStyle}" colspan="2">${formatCurrency(incomeAssessment?.netDisposalIncome)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}" colspan="4"></td>
            </tr>
            <tr>
              <td style="${labelCellStyle}" colspan="2">Annual Sales</td>
              <td style="${valueCellStyle}" colspan="2">${formatCurrency(incomeAssessment?.annualSales)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}" colspan="2">Annual GST Paid</td>
              <td style="${valueCellStyle}" colspan="2">${formatCurrency(incomeAssessment?.annualGstPaid)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}" colspan="2">Annual Gross Profit</td>
              <td style="${valueCellStyle}" colspan="2">${formatCurrency(incomeAssessment?.annualGrossProfit)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}" colspan="2">Annual Net Profit</td>
              <td style="${valueCellStyle}" colspan="2">${formatCurrency(incomeAssessment?.annualNetProfit)}</td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Specific for Contractor Profile</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}" colspan="2">To be filled in for Contractor (Resi cum office) profile:-</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">How many contracts completed in last 6 months</td>
                <td style="${valueCellStyle}">${specificForContractorProfile?.contractsCompleted}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">In what mode, payment is getting against these contracts.</td>
                <td style="${valueCellStyle}">${specificForContractorProfile?.modeOfPayment}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">Document name of client, mobile number, type of contract & contract value in PD report</td>
                <td style="${valueCellStyle}">${specificForContractorProfile?.clientDetails?.nameOfClient} - ${specificForContractorProfile?.clientDetails?.mobileNumberOfClient} - ${specificForContractorProfile?.clientDetails?.typeOfContract} - ${formatCurrency(specificForContractorProfile?.clientDetails?.contractValue)}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">Randomly call 2 to 3 clients to verify the contract details and document the feedback in the PD report along with details of the client called for confirmation.</td>
                <td style="${valueCellStyle}">${specificForContractorProfile?.clientReferenceCheck?.map((client: any) => `${client.nameOfClient} - ${client.mobileNumberOfClient} - ${formatCurrency(client.feedbackOnClient)}`).join("<br> ")}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">Neighbour two reference checks to confirm applicant’s employer information is correct. (name & contact number along with feedback to be documented)</td>
                <td style="${valueCellStyle}">${specificForContractorProfile?.neighbourReferenceCheck?.map((neighbour: any) => `${neighbour.nameOfNeighbour} - ${neighbour.mobileNumberOfNeighbour} - ${neighbour.feedbackDetails}`).join("<br> ")}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">Stability or vintage in the same line of business</td>
                <td style="${valueCellStyle}">${specificForContractorProfile?.stabilityInTheSameBusiness}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">Direct contractor or doing sub-contracting work</td>
                <td style="${valueCellStyle}">${specificForContractorProfile?.directOrSubContractor}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">Advance amount paid to workers</td>
                <td style="${valueCellStyle}">${formatCurrency(specificForContractorProfile?.advanceAmountPaid)}</td>
              </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Level of Activity & Stocks along with Observation</td>
        <td style="${valueCellStyle}"><ul style="margin: 0; padding-left: 20px;">${levelOfActivity?.observations?.split("\n").map((line: string) => `<li style="margin-left: 20px;">${line}</li>`).join("")}</ul></td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Details of property to be mortgaged</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Collateral Address</td>
              <td style="${valueCellStyle}">${mortgageDetails?.collateralAddress}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Area</td>
              <td style="${valueCellStyle}">${mortgageDetails?.areaInSqYards} Sq. Yards</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Agreement Value (in Lakhs)</td>
              <td style="${valueCellStyle}">${formatCurrency(mortgageDetails?.agreementValue)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Actual Purchase Cost (in Lakhs)</td>
              <td style="${valueCellStyle}">${formatCurrency(mortgageDetails?.actualPurchaseCost)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Market Value (in Lakhs)</td>
              <td style="${valueCellStyle}">${formatCurrency(mortgageDetails?.marketValue)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">OCR (in Lakhs)</td>
              <td style="${valueCellStyle}">${formatCurrency(mortgageDetails?.ocrValue)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">OCR Paid till date (in Lakhs)</td>
              <td style="${valueCellStyle}">${formatCurrency(mortgageDetails?.ocrPaidTillDate)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Source of OCR</td>
              <td style="${valueCellStyle}">${mortgageDetails?.ocrSource}</td>
            </tr>
          </table>
        </td>
      </tr>


      <tr>
        <td style="${labelCellStyle}">End Use of Loan</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">HL Purchase</td>
              <td style="${valueCellStyle}">${endUseOfLoan?.hlPurchase}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">HL Repair or Renovation</td>
              <td style="${valueCellStyle}">${endUseOfLoan?.hlRepair}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">HL Construction</td>
              <td style="${valueCellStyle}">${endUseOfLoan?.hlConstruction}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">HL Plot + Construction</td>
              <td style="${valueCellStyle}">${endUseOfLoan?.hlPlotAndConstruction}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">HL Working Capital</td>
              <td style="${valueCellStyle}">${endUseOfLoan?.hlWorkingCapital}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Asset Acquisition and Expansion</td>
              <td style="${valueCellStyle}">${endUseOfLoan?.assetAcquisition}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Market Development and growth</td>
              <td style="${valueCellStyle}">${endUseOfLoan?.marketDevelopment}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Debt Management and Financial Efficiency</td>
              <td style="${valueCellStyle}">${endUseOfLoan?.debtManagement}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">BT and Top Up</td>
              <td style="${valueCellStyle}">${endUseOfLoan?.btAndTopUp}</td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Other Asset Details (Including properties, vehicles, investments etc.)</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Asset Details</td>
              <td style="${valueCellStyle}">${formatMultiline(assetDetails?.assetDetails)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}"><u>Type of Asset</u></td>
              <td style="${labelCellStyle}"><u>Approx. Value (in Lakhs):</u></td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Properties (Flat, Individual House, Commercial, Agri land, vacant residential land, etc.)</td>
              <td style="${valueCellStyle}">${assetDetails?.propertiesValue} Lakhs</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Life Insurance</td>
              <td style="${valueCellStyle}">${assetDetails?.lifeInsurance} Lakhs</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Medical Insurance</td>
              <td style="${valueCellStyle}">${assetDetails?.medicalInsurance} Lakhs</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">SIP</td>
              <td style="${valueCellStyle}">${assetDetails?.sipValue} Lakhs</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">FD</td>
              <td style="${valueCellStyle}">${assetDetails?.fdValue} Lakhs</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Vehicle</td>
              <td style="${valueCellStyle}">${assetDetails?.vehicleValue} Lakhs</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Others</td>
              <td style="${valueCellStyle}">${assetDetails?.otherAssetsValue} Lakhs</td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Loan Details</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Name of Bank</td>
              <td style="${labelCellStyle}">Type of Loan</td>
              <td style="${labelCellStyle}">Loan Amount</td>
              <td style="${labelCellStyle}">O/S Balance (in Lakhs)</td>
              <td style="${labelCellStyle}">EMI (in Rs.)</td>
              <td style="${labelCellStyle}">Tenor</td>
              <td style="${labelCellStyle}">MOB</td>
              <td style="${labelCellStyle}">EMI Paid Bank</td>
            </tr>
            ${ensureArray(loanDetails?.loanDetails)?.map((loan: any) => `
              <tr>
                <td style="${valueCellStyle}">${loan?.nameOfBank}</td>
                <td style="${valueCellStyle}">${loan?.typeOfLoan}</td>
                <td style="${valueCellStyle}">${formatCurrency(loan?.loanAmount)}</td>
                <td style="${valueCellStyle}">${formatCurrency(loan?.osBalance)}</td>
                <td style="${valueCellStyle}">${formatCurrency(loan?.emi)}</td>
                <td style="${valueCellStyle}">${loan?.tenure} months</td>
                <td style="${valueCellStyle}">${loan?.monthOnBooks}</td>
                <td style="${valueCellStyle}">${loan?.emiPaidBank}</td>
              </tr>
            `).join("")}
          </table>
        </td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Banking Details</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
            <tr>
          <td style="${labelCellStyle}">Bank Name</td>
          <td style="${labelCellStyle}">Branch Name</td>
          <td style="${labelCellStyle}">Account Type</td>
          <td style="${labelCellStyle}">Open Since (Year)</td>
        </tr>
        ${ensureArray(bankingDetails?.details)?.map((bank: any) => `
          <tr>
          <td style="${valueCellStyle}">${bank?.bankName}</td>
          <td style="${valueCellStyle}">${bank?.branchName}</td>
          <td style="${valueCellStyle}">${bank?.accountType}</td>
          <td style="${valueCellStyle}">${bank?.openSinceYear}</td>
        </tr>
        `).join("")}
          </table>
        </td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Loan Amount Required & End Use</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Loan Amount Required (in Lakhs)</td>
              <td style="${valueCellStyle}">${formatCurrency(loanAmountAndEndUseOfLoan?.loanAmountRequired)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">End Use of Loan (Amount & Detailed End Use)</td>
              <td style="${valueCellStyle}">${formatMultiline(loanAmountAndEndUseOfLoan?.endUseDetailsOfLoan)}</td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Existing Relation with this lender Bank/FI</td>
        <td style="${valueCellStyle}">${existingRelationWithLender?.relationshipWithLender}</td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Documents Seen</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Document Category</td>
              <td style="${labelCellStyle}">Document Name</td>
              <td style="${labelCellStyle}">Document Type</td>
              <td style="${labelCellStyle}">Remarks</td>
              ${ensureArray(documentsSeen?.documentsSeen)?.map((document: any) => `
                <tr>
                  <td style="${valueCellStyle}">${document?.documentCategory}</td>
                  <td style="${valueCellStyle}">${document?.documentName}</td>
                  <td style="${valueCellStyle}">${document?.documentType}</td>
                  <td style="${valueCellStyle}">${formatMultiline(document?.documentRemarks)}</td>
                </tr>
              `).join("")}
          </table>
        </td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Interviewer’s Comments along with the explanations to credit comments (with brief summary report)</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Comforts</td>
              <td style="${valueCellStyle}">${formatMultiline(interviewerComments?.comforts)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Discomforts</td>
              <td style="${valueCellStyle}">${formatMultiline(interviewerComments?.discomforts)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}" colspan="2"><i>Note: As per business calculations we estimated his monthly cash flow</i></td>
            </tr>
          </table>
         </td>
      </tr>


      <tr>
        <td style="${labelCellStyle}">Pd Status (Positive/Negative/Refer)</td>
        <td style="${valueCellStyle}">${html_data.approvedStatus|| "Not provided"}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Interviewer Details</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Interviewer Name</td>
              <td style="${labelCellStyle}">Visit Date and Time</td>
            </tr>
            <tr>
              <td style="${valueCellStyle}">${interviewerDetails?.interviewerName}</td>
              <td style="${valueCellStyle}">${interviewerDetails?.dateAndTimeOfInterview}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Geo Tag Details</td>
        <td style="border:1px solid #ccc;padding:8px">
          <p><strong><u>Enclosed:</u></strong></p>
          <p>${geoTagDetails?.coordinates 
            || geoTagDetails?.Coordinates 
            || verificationData?.geoTagDetails?.coordinates
            || verificationData?.GeoTagDetails?.coordinates
            || "Not provided"}</p>
        </td>
      </tr>
    </table>
    </div>



    ${pdBaseTemplateFooter(html_data)}

    <p style="margin:20px 0 8px;font-weight:600;color:#222;"> <strong><u>Disclaimer:</u></strong></p>
    <p style="margin:0 0 24px;color:#333;">This report (including any attachments) has been prepared on the basis of information provided by the person contacted. Jana Small Finance Bank Ltd. will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. Veeraraghavan & Co. will not be held liable in any case.</p>
  `;
};
