import { format, toZonedTime } from 'date-fns-tz';
import { category } from 'google-play-scraper';
import * as path from 'path';
import * as fs from 'fs';
import { RBLInterface } from './interface/rbl.interface';
import { pdBaseTemplate } from './pd-base.tempate';


export const rblTemplate = (verificationData: RBLInterface, html_data: any) => {

  const recommendationStyles: Record<string, string> = {
    'Positive': '<li style="color: green; font-weight: bold;">POSITIVE</li>',
    'Negative': '<li style="color: red; font-weight: bold;">NEGATIVE</li>',
    'CreditRefer': '<li style="color: orange; font-weight: bold;">CREDIT REFER</li>',
  };

  const finalRecommendationHtml = recommendationStyles[html_data.status] || '';
  
  const date = new Date();
  const timeZone = 'Asia/Kolkata';
  const zonedDate = toZonedTime(date, timeZone);

  const istDate = format(zonedDate, 'dd-MM-yyyy hh:mm:ss a xxx', { timeZone });

  return `
    ${pdBaseTemplate()}

      <div class="report-title">PERSONAL DISCUSSION SHEET</div>
    
      <div class="align-wrapper">
        <table class="section-table">
        <tr><td colspan="7" class="section-header">Case Details</td></tr>
          <tr>
            <th>Reference Number(LOS ID)</th>
            <td colspan="5"><span class="var-value">${verificationData.caseDetails.referenceNumber || ''}</span></td>
          </tr>
          <tr>
            <th>Name of the Applicant</th>
            <td colspan="5"><span class="var-value">${verificationData.caseDetails.nameOfApplicant || ''}</span></td>
          </tr>
          <tr>
            <th>Co - Applicant</th>
            <td colspan="5"><span class="var-value">${verificationData.caseDetails.coApplicant || ''}</span></td>
          </tr>
          <tr>
            <th>Type of Borrower</th>
            <td colspan="5"><span class="var-value">${verificationData.caseDetails.typeOfBorrower || ''}</span></td>
          </tr>
        </table>
      </div>

       <div class="align-wrapper">
        <table class="section-table">
        <tr><td colspan="7" class="section-header">Meeting Details</td></tr>
          <tr>
            <th>Address Visited</th>
            <td colspan="5"><span class="var-value">${verificationData.caseDetails.addressVisited || ''}</span></td>
          </tr>
          <tr>
            <th>Person Met</th>
            <td colspan="5"><span class="var-value">${verificationData.caseDetails.personMet || ''}</span></td>
          </tr>
          <tr>
            <th>Contact Number</th>
            <td colspan="5"><span class="var-value">${verificationData.caseDetails.contactNo || ''}</span></td>
          </tr>
          <tr>
            <th>Date of Visit</th>
            <td colspan="5"><span class="var-value">${''}</span></td>
          </tr>
        </table>
      </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Business Owner Details</td></tr>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Qualification</th>
          <th>Occupation</th>
          <th>Relation</th>
          <th>Remarks</th>
        </tr>
        ${Array.isArray(verificationData.businessOwnerDetails) && verificationData.businessOwnerDetails.length > 0
          ? verificationData.businessOwnerDetails.map(businessOwner => `
            <tr>
              <td><span class="var-value">${businessOwner.name || ''}</span></td>
              <td><span class="var-value">${businessOwner.age || ''}</span></td>
              <td><span class="var-value">${businessOwner.qualification || ''}</span></td>
              <td><span class="var-value">${businessOwner.occupation || ''}</span></td>
              <td><span class="var-value">${businessOwner.relation || ''}</span></td>
              <td><span class="var-value">${businessOwner.remarks || ''}</span></td>
            </tr>
          `).join('')
          : '<tr><td colspan="6" style="text-align: center;">No business owner details available</td></tr>'}
      </table>
    </div>

    <div class="align-wrapper">

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Family Details</td></tr>
        <tr>
          <th>About the Applicant</th>
          <td colspan="5"><span class="var-value">${verificationData.familyDetails.aboutApplicant || ''}</span></td>
        </tr>
        <tr>
          <th>About the Co - Applicant</th>
          <td colspan="5"><span class="var-value">${verificationData.familyDetails.aboutCoApplicant || ''}</span></td>
        </tr>
      </table>
    </div>
    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Business Details</td></tr>
        <tr>
          <th>Business Name</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessName || ''}</span></td>
        </tr>
        <tr>
          <th>Type of Entity</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.typeOfEntity || ''}</span></td>
        </tr>
        <tr>
          <th>GST Number</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.gstNumber || ''}</span></td>
        </tr>
         <tr>
          <th>Legal Name</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.legalName || ''}</span></td>
        </tr>
        <tr>
          <th>Trade Name</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.tradeName || ''}</span></td>
        </tr>      
        <tr>
          <th>Last GST Return(As per GST records)</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.lastGSTReturn || ''}</span></td>
        </tr> 
        <tr>
          <th>Establishment</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.establishment || ''}</span></td>
        </tr>
        <tr>
          <th>Shop Address</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.shopAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Shop Ownership</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.shopOwnership || ''}</span></td>
        </tr>
        <tr>
          <th>Godown</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.godownAddress || ''}</span></td>
        </tr>
        <tr>
          <th>Godown Ownership</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.godownOwnership || ''}</span></td>
        </tr>
        <tr>
          <th>Nature of Business</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.natureOfBusiness || ''}</span></td>
        </tr>
        <tr>
          <th>Product Details</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.productDetails || ''}</span></td>
        </tr>
        <tr>
          <th>Business Process</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.businessProcess || ''}</span></td>
        </tr>
        <tr>
          <th>Margins</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.margins || ''}</span></td>
        </tr>
        <tr>
          <th>Documents Observed</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.documentsObserved || ''}</span></td>
        </tr>
        <tr>
          <th>Activity Observed</th>
          <td colspan="5"><span class="var-value">${verificationData.businessDetails.activityObserved || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Inputs/Purchases</td></tr>
        <tr>
          <th>Details of Inputs</th>
          <td colspan="5"><span class="var-value">${verificationData.inputsPurchases.detailsOfInputs || ''}</span></td>
        </tr>
        <tr>
          <th>Purchase Details</th>
          <td colspan="5"><span class="var-value">${verificationData.inputsPurchases.purchaseDetails || ''}</span></td>
        </tr>
        <tr>
          <th>Order Cycle</th>
          <td colspan="5"><span class="var-value">${verificationData.inputsPurchases.orderCycle || ''}</span></td>
        </tr>
        <tr>
          <th>Avg Order Qnty</th>
          <td colspan="5"><span class="var-value">${verificationData.inputsPurchases.avgOrderQnty || ''}</span></td>
        </tr>
        <tr>
          <th>Credit Terms</th>
          <td colspan="5"><span class="var-value">${verificationData.inputsPurchases.creditTerms || ''}</span></td>
        </tr>
        <tr>
          <th>Other Remarks</th>
          <td colspan="5"><span class="var-value">${verificationData.inputsPurchases.otherRemarks || ''}</span></td>
        </tr>
      </table>
    </div>
    <div style="page-break-before: always;"></div>


    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Outputs/Supply</td></tr>
        <tr>
          <th>Market for Output</th>
          <td colspan="5"><span class="var-value">${verificationData.outputsSupply.marketForOutput || ''}</span></td>
        </tr>
        <tr>
          <th>Mode of Marketing</th>
          <td colspan="5"><span class="var-value">${verificationData.outputsSupply.modeOfMarketing || ''}</span></td>
        </tr>
        <tr>
          <th>Type of Customers</th>
          <td colspan="5"><span class="var-value">${verificationData.outputsSupply.typeOfCustomers || ''}</span></td>
        </tr>
        <tr>
          <th>Credit Terms</th>
          <td colspan="5"><span class="var-value">${verificationData.outputsSupply.creditTerms || ''}</span></td>
        </tr>
        <tr>
          <th>Stock of Finished Goods</th>
          <td colspan="5"><span class="var-value">${verificationData.outputsSupply.stockOfFinishedGoods || ''}</span></td>
        </tr>
        <tr><td colspan="6" class="section-header">Employee Details</td></tr>
        <tr>
          <th>No of Employees</th>
          <td colspan="5"><span class="var-value">${verificationData.employeeDetails.noOfEmployees || ''}</span></td>
        </tr>
        <tr>
          <th>Salary Details</th>
          <td colspan="5"><span class="var-value">${verificationData.employeeDetails.salaryDetails || ''}</span></td>
        </tr>
        <tr>
          <th>PF/ESI Applied</th>
          <td colspan="5"><span class="var-value">${verificationData.employeeDetails.pfEsiApplied || ''}</span></td>
        </tr>
      </table>
    </div>


    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Trade References - Suppliers</td></tr>
        <tr>
          <th>Name of Suppliers</th>
          <th>Contact Details</th>
        </tr>
        </tr>
        ${Array.isArray(verificationData.tradeReferencesSuppliers.suppliers) && verificationData.tradeReferencesSuppliers.suppliers.length > 0
          ? verificationData.tradeReferencesSuppliers.suppliers.map(supplier => `
            <tr>
              <td><span class="var-value">${supplier.nameOfSuppliers || ''}</span></td>
              <td><span class="var-value">${supplier.contactDetails || ''}</span></td>
            </tr>
          `).join('')
          : '<tr><td colspan="7" style="text-align: center;">No trade references suppliers listed</td></tr>'}
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Trade References - Customers</td></tr>
        <tr>
          <th>Name of Customers</th>
          <th>Contact Details</th>
        </tr>
        </tr>
        ${Array.isArray(verificationData.tradeReferencesCustomers.customers) && verificationData.tradeReferencesCustomers.customers.length > 0
          ? verificationData.tradeReferencesCustomers.customers.map(customer => `
            <tr>
              <td><span class="var-value">${customer.nameOfCustomer || ''}</span></td>
              <td><span class="var-value">${customer.contactDetails || ''}</span></td>
            </tr>
          `).join('')
          : '<tr><td colspan="7" style="text-align: center;">No trade references customers listed</td></tr>'}
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Other Sources of Income</td></tr>
        <tr>
          <th>Source of Income</th>
          <th>Details</th>
        </tr>
        </tr>
        ${Array.isArray(verificationData.otherSourcesOfIncome.otherSourcesOfIncome) && verificationData.otherSourcesOfIncome.otherSourcesOfIncome.length > 0
          ? verificationData.otherSourcesOfIncome.otherSourcesOfIncome.map(customer => `
            <tr>
              <td><span class="var-value">${customer.sourceOfIncome || ''}</span></td>
              <td><span class="var-value">${customer.details || ''}</span></td>
            </tr>
          `).join('')
          : '<tr><td colspan="7" style="text-align: center;">No other sources of income listed</td></tr>'}
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Loan Details</td></tr>
        <tr>
          <th>Name of Bank/Institution</th>
          <th>Product</th>
          <th>Loan Amount</th>
          <th>EMI</th>
          <th>POS</th>
          <th>Remarks</th>
        </tr>
        ${Array.isArray(verificationData.loansDetails.loansDetails) && verificationData.loansDetails.loansDetails.length > 0
          ? verificationData.loansDetails.loansDetails.map(loan => `
            <tr>
              <td><span class="var-value">${loan.nameOfBankInstitution || ''}</span></td>
              <td><span class="var-value">${loan.product || ''}</span></td>
              <td><span class="var-value">${loan.loanAmount || ''}</span></td>
              <td><span class="var-value">${loan.emi || ''}</span></td>
              <td><span class="var-value">${loan.pos || ''}</span></td>
              <td><span class="var-value">${loan.remarks || ''}</span></td>
            </tr>
          `).join('')
          : '<tr><td colspan="7" style="text-align: center;">No existing loans details available</td></tr>'}
        </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Applicants Main Banking Details</td></tr>
        <tr>
          <th>Bank Name</th>
          <th>Account Holder Name</th>
          <th>Account Type</th>
          <th>No of Year</th>
          <th>Limit of CC/OD</th>
          <th>Remarks</th>
        </tr>
        ${Array.isArray(verificationData.applicantsMainBankingDetails.bankingDetails) && verificationData.applicantsMainBankingDetails.bankingDetails.length > 0
          ? verificationData.applicantsMainBankingDetails.bankingDetails.map(loan => `
            <tr>
              <td><span class="var-value">${loan.bankName || ''}</span></td>
              <td><span class="var-value">${loan.accountHolderName || ''}</span></td>
              <td><span class="var-value">${loan.accountType || ''}</span></td>
              <td><span class="var-value">${loan.noOfYear || ''}</span></td>
              <td><span class="var-value">${loan.limitOfCCOD || ''}</span></td>
              <td><span class="var-value">${loan.remarks || ''}</span></td>
            </tr>
          `).join('')
          : '<tr><td colspan="7" style="text-align: center;">No applicants main banking details available</td></tr>'}
        </table>
    </div>
    
    <div class="align-wrapper">
      <table class="section-table">
        <tr>
          <th>End Use</th>
          <td colspan="6"><span class="var-value">${verificationData.applicantsMainBankingDetails.endUse || ''}</span></td>
        </tr>
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Own Contribution</td></tr>
        <tr>
          <th>Particulars</th>
          <th>Remarks</th>
        </tr>
        </tr>
        ${Array.isArray(verificationData.ownContributions.ownContributions) && verificationData.ownContributions.ownContributions.length > 0
          ? verificationData.ownContributions.ownContributions.map(customer => `
            <tr>
              <td><span class="var-value">${customer.particulars || ''}</span></td>
              <td><span class="var-value">${customer.remarks || ''}</span></td>
            </tr>
          `).join('')
          : '<tr><td colspan="7" style="text-align: center;">No own contributions listed</td></tr>'}
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">Net Worth</td></tr>
        <tr>
          <th>Type of Property/Other investments</th>
          <th>Owner Name</th>
          <th>Years of Ownership</th>
          <th>Approx Market Value</th>
        </tr>
        </tr>
        ${Array.isArray(verificationData.netWorth.netWorth) && verificationData.netWorth.netWorth.length > 0
          ? verificationData.netWorth.netWorth.map(customer => `
            <tr>
              <td><span class="var-value">${customer.typeOfProperty || ''}</span></td>
              <td><span class="var-value">${customer.ownerName || ''}</span></td>
              <td><span class="var-value">${customer.yearsOfOwnership || ''}</span></td>
              <td><span class="var-value">${customer.approxMarketValue || ''}</span></td>
            </tr>
          `).join('')
          : '<tr><td colspan="7" style="text-align: center;">No net worth listed</td></tr>'}
      </table>
    </div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr>
          <th>Particulars</th>
          <td colspan="5"><span class="var-value">${verificationData.particulars.coordinates || ''}</span></td>
        </tr>
      </table>
    </div>

  <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">FINANCIAL ANALYSIS</td></tr>
        <tr>
          <th>Particulars</th>
          <th>Estimations</th>
        </tr>
        <tr>
          <td><span class="var-value">To Opening Stock</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.openingStock || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Purchase</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.purchase || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Cost of Services</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.costOfServices || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Wages</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.wages || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Hamali Charges</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.hamaliCharges || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Manufacturing Expenses</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.manufacturingExpenses || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Packing Charges</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.packingCharges || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Sales</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.sales || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Services</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.services || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Closing Stock</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.closingStock || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Salaries</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.salaries || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Rent</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.rent || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Electricity Charges</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.electricityCharges || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Printing Stationery</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.printingStationery || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Telephone Charges</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.telephoneCharges || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Postage Telegram</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.postageTelegram || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Office Maintenance</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.officeMaintenance || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Repairs Maintenance</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.repairsMaintenance || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Sadar Expenses</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.sadarExpenses || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Audit Fee</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.auditFee || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Advertisement</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.advertisement || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Bank Charges</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.bankCharges || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Insurance</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.insurance || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Depreciation</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.depreciation || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Interest On Loan</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.interestOnLoan || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Rent Received</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.rentReceived || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Commission Received</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.commissionReceived || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Net Profit</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.netProfit || 0}</span></td>
        </tr>
        <tr>
          <td><span class="var-value">To Gross Profit</span></td>
          <td><span class="var-value">${html_data.financialAnalysis?.grossProfit || 0}</span></td>
        </tr>
      </table>
    </div>

    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Final Remarks</td></tr>
        <tr>
          <th>Synopsis</th>
          <td colspan="5">
            <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
              ${html_data.path || ''}
            </ul>
          </td>
        </tr>
        <tr>
          <th>Final Recommendation</th>
          <td colspan="5">
            <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
              ${finalRecommendationHtml}
            </ul>
          </td>
        </tr>
      </table>
    </div>
    <br>
    <br>
    <br>
    Disclaimer: 
    <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
        The report contains information provided by the Applicant met. The information is provided verbally and could be verified only to a limited extent. RBL will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions.
    </ul>


    <br>
    <img src="${html_data.imageDataUri}" width="50%" height="40%" style="margin-left: 2%;" />
    <footer class="pdf-footer">
      <span style="color:rgb(8, 136, 36);">${html_data.bankName}</span><br>
      Generated on ${istDate}
    </footer>
    ${html_data.imagesData}
  `;
}

