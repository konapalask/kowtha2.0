import { BusinessVerificationData } from "./business.interface";

export const businessTemplate = (verificationData: BusinessVerificationData, html_data: any) => {
    
  if (html_data.path) {
    html_data.path = html_data.path.replace('<ul>', '').replace('</ul>', '')
  }

  const recommendationStyles: Record<string, string> = {
    Positive: '<li style="color: green; font-weight: bold;">POSITIVE</li>',
    Negative: '<li style="color: red; font-weight: bold;">NEGATIVE</li>',
  };
  
  const finalRecommendationHtml = recommendationStyles[html_data.status] || '';
  // Constitution check for others
    let constitution = verificationData.businessDetails?.constitution || '';
    if(constitution === 'Others') {
        constitution = verificationData.businessDetails?.constitutionOther || '';
    }

    // Corrected Business Name check
    let correctedBusinessName = verificationData.basicDetails?.isBusinessNameSame || '';
    if(correctedBusinessName === 'No') {
        correctedBusinessName = `
        <tr>
            <th>Corrected Business Name</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails?.correctedBusinessName || ''}</span></td>
        </tr>
        `;
    } else {
      correctedBusinessName = '';
    }

    // Corrected Address check
    let correctedAddress = verificationData.basicDetails?.isAddressSame || '';
    if(correctedAddress === 'No') {
        correctedAddress = `
        <tr>
            <th>Corrected Address</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails?.addressCorrection || ''}</span></td>
        </tr>
        `;
    } else {
      correctedAddress = '';
    }

    // Aadhar Number masking
    let aadhar = verificationData.basicDetails?.aadhar || '';
    if(aadhar.length > 4) {
      aadhar = 'XXXX-XXXX-' + aadhar.slice(aadhar.length - 4);
    }

    let personMet = verificationData.basicDetails?.personMet || '';
    if(personMet === 'Applicant') {
      personMet = `
      <tr>
        <th>Person Met</th>
        <td colspan="5"><span class="var-value">Applicant</span></td>
      </tr>
      `;
      } else if(personMet === 'Others') {
        personMet = `
        <tr>
          <th>Person Met Name</th>
          <td colspan="5"><span class="var-value">${verificationData.basicDetails?.personMetName || ''}</span></td>
        </tr>
        <tr>
          <th>Person Met Relation</th>
          <td colspan="5"><span class="var-value">${verificationData.basicDetails?.personMetRelation || ''}</span></td>
        </tr>
      `;
    } else {
      personMet = `
        <tr>
          <th>Person Met Name</th>
          <td colspan="5"><span class="var-value">${verificationData.basicDetails?.personMetName || ''}</span></td>
        </tr>
        <tr>
          <th>Person Met Relation</th>
          <td colspan="5"><span class="var-value">${verificationData.basicDetails?.personMetRelation || ''}</span></td>
        </tr>
      `;
    }

    let rentalAmount = verificationData.miscellaneous?.ownershipOfPremises || '';
    if(rentalAmount === 'Leased') {
        rentalAmount = verificationData.miscellaneous?.leaseAmount || '0';
    } else if (rentalAmount === 'Rented') {
        rentalAmount = verificationData.miscellaneous?.rentalAmount || '0';
    } else {
        rentalAmount = '0';
    }

    return `
    <div class="align-wrapper">
        <table class="section-table">
          <tr><td colspan="6" class="section-header">Business Verification</td></tr>
          <tr>
            <th>Name of the Applicant</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails?.applicantName || ''}</span></td>
          </tr>
          <tr>
            <th>Aadhar Number</th>
            <td colspan="5"><span class="var-value">${aadhar}</span></td>
          </tr>
          <tr>
            <th>PAN Number</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails?.panNumber || ''}</span></td>
          </tr>
          <tr>
            <th>Business Name</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails?.businessName || ''}</span></td>
          </tr>
          <tr>
            <th>Business Profile</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails?.businessProfile || ''}</span></td>
          </tr>
          <tr>
            <th>Business Address</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails?.businessAddress || ''}</span></td>
          </tr>
          <tr>
            <th>Is Business Name Same</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails?.isBusinessNameSame || ''}</span></td>
          </tr>
          ${correctedBusinessName}
          <tr>
            <th>Is Address Same</th>
            <td colspan="5"><span class="var-value">${verificationData.basicDetails?.isAddressSame || ''}</span></td>
          </tr>
          ${correctedAddress}
          ${personMet}
          <tr>
            <th>Total Work Experience</th>
            <td colspan="5"><span class="var-value">${verificationData.businessDetails?.totalExperience || ''}</span></td>
          </tr>
          <tr>
            <th>Name Board Seen</th>
            <td colspan="5"><span class="var-value">${verificationData.businessDetails?.nameBoardSeen || ''}</span></td>
          </tr>
          <tr>
            <th>Name Board Matched</th>
            <td colspan="5"><span class="var-value">${verificationData.businessDetails?.nameBoardMatched || ''}</span></td>
          </tr>
          <tr>
            <th>Date of Commencement of Business</th>
            <td colspan="5"><span class="var-value">${verificationData.businessDetails?.businessStartYear || ''}</span></td>
          </tr>
          <tr>
            <th>Is Address Traceable</th>
            <td colspan="5"><span class="var-value">${verificationData.businessDetails?.isAddressTraceable || ''}</span></td>
          </tr>
          <tr>
            <th>Business Seasonal</th>
            <td colspan="5"><span class="var-value">${verificationData.businessDetails?.isBusinessSeasonal || ''}</span></td>
          </tr>
          <tr>
            <th>Constitution</th>
            <td colspan="5"><span class="var-value">${constitution}</span></td>
          </tr>
        </table>
        <div style="text-align: right; margin-top: 10px; font-size: 14px; color: #333;">
          Field Executive: ${html_data.fieldExecutive || ''}
        </div>
      </div>
      <div class="footer">
        <span style="color: #138808;">${html_data.bankName}</span><span style="color: #FF9933;"></span><br>
        Generated on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      </div>

      <div style="page-break-before: always;"></div>
      <div class="align-wrapper">
        <table class="section-table">
          <tr><td colspan="6" class="section-header">Miscellaneous Details</td></tr>
          <tr>
            <th>Stock Seen</th>
            <td colspan="5"><span class="var-value">${verificationData.miscellaneous?.stockSeen || ''}</span></td>
          </tr>
          <tr>
            <th>Ownership of Premises</th>
            <td colspan="5"><span class="var-value">Lease</span></td>
          </tr>
          <tr>
            <th>Area of Premises</th>
            <td colspan="5"><span class="var-value">${verificationData.miscellaneous?.areaOfPremises || ''}</span></td>
          </tr>
          <tr>
            <th>Locality of Business</th>
            <td colspan="5"><span class="var-value">${verificationData.miscellaneous?.localityOfBusiness || ''}</span></td>
          </tr>
          <tr>
            <th>Rental/Lease Amount</th>
            <td colspan="5"><span class="var-value">${verificationData.miscellaneous?.rentalAmount || ''}</span></td>
          </tr>
          <tr>
            <th>Number of Employees Working Under Applicant</th>
            <td colspan="5"><span class="var-value">${verificationData.miscellaneous?.employeesUnderApplicant || ''}</span></td>
          </tr>
          <tr>
            <th>Employees Seen</th>
            <td colspan="5"><span class="var-value">${verificationData.miscellaneous?.employeesSeen || ''}</span></td>
          </tr>
          <tr>
            <th>Other Setup Observed</th>
            <td colspan="5"><span class="var-value">${verificationData.miscellaneous?.otherSetupObserved || ''}</span></td>
          </tr>
          <tr>
            <th>Politically Connected</th>
            <td colspan="5"><span class="var-value">${verificationData.miscellaneous?.politicallyConnected || ''}</span></td>
          </tr>
          <tr>
            <th>Years in Current Premises</th>
            <td colspan="5"><span class="var-value">${verificationData.miscellaneous?.yearsInCurrentPremises || ''}</span></td>
          </tr>
          <tr>
            <th>Geotag</th>
            <td colspan="5"><span class="var-value">${verificationData.businessDetails?.geoTag || ''}</span></td>
          </tr>
        </table>
      </div>
      <div class="align-wrapper">
        <table class="section-table">
        <tr><td colspan="6" class="section-header">Third Party Check</td></tr>
        <tr>
          <th>Name</th>
          <th>Mobile Number</th>
          <th>Relationship</th>
          <th>Feedback Status</th>
          <th>Comments</th>
        </tr>
        ${Array.isArray(verificationData.thirdPartyCheck?.checks) && verificationData.thirdPartyCheck.checks.length > 0
          ? verificationData.thirdPartyCheck.checks.map(tpc => `
            <tr>
              <td><span class="var-value">${tpc.tpcName || ''}</span></td>
              <td><span class="var-value">${tpc.mobileNumber || ''}</span></td>
              <td><span class="var-value">${tpc.relationship || ''}</span></td>
              <td><span class="var-value">${tpc.feedbackStatus || ''}</span></td>
              <td><span class="var-value">${tpc.comments || ''}</span></td>
            </tr>
          `).join('')
          : '<tr><td colspan="5" style="text-align: center;">No third party checks found</td></tr>'}
        </table>
      </div>

      <div class="align-wrapper">
        <table class="section-table">
        <tr><td colspan="6" class="section-header">Existing Loans</td></tr>
        <tr>
          <th>Bank Name</th>
          <th>Loan Amount</th>
          <th>Tenure</th>
          <th>EMI</th>
          <th>Purpose</th>
        </tr>
        ${Array.isArray(verificationData.existingLoans?.loans) && verificationData.existingLoans.loans.length > 0
          ? verificationData.existingLoans.loans.map(loan => `
            <tr>
              <td><span class="var-value">${loan.bankName || ''}</span></td>
              <td><span class="var-value">${loan.loanAmount || ''}</span></td>
              <td><span class="var-value">${loan.tenure || ''}</span></td>
              <td><span class="var-value">${loan.emi || ''}</span></td>
              <td><span class="var-value">${loan.purpose || ''}</span></td>
            </tr>
          `).join('')
          : '<tr><td colspan="5" style="text-align: center;">No existing loans found</td></tr>'}
        </table>
        <div style="text-align: right; margin-top: 10px; font-size: 14px; color: #333;">
          Field Executive: ${html_data.fieldExecutive || ''}
        </div>
      </div>
      <div class="footer">
        <span style="color: #138808;">${html_data.bankName}</span><span style="color: #FF9933;"></span><br>
        Generated on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      </div>


      <div style="page-break-before: always;"></div>
      <div class="align-wrapper">
        <table class="section-table">
          <tr><td colspan="6" class="section-header">Final Remarks</td></tr>
          <tr>
            <th>Remarks</th>
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
        <div style="text-align: right; margin-top: 10px; font-size: 14px; color: #333;">
          Field Executive: ${html_data.fieldExecutive || ''}
        </div>
      </div>
      <br>
      <img src="${html_data.imageDataUri}" width="50%" height="40%" style="margin-left: 2%;" />

          <div class="footer">
            <span style="color: #138808;">${html_data.bankName}</span><span style="color: #FF9933;"></span><br>
            Generated on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </div>
          ${html_data.imagesData}
  `
}