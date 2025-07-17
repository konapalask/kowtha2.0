import { VerificationData } from "./address.interface";

export const addressTemplate = (verificationData: VerificationData, html_data: any, addressType: string) => {
    if (html_data.path) {
        html_data.path = html_data.path.replace('<ul>', '').replace('</ul>', '')
      }
      let aadhar = verificationData.basicDetails?.aadhar || '';
  
      if(aadhar.length > 4) {
        aadhar = 'XXXX-XXXX-' + aadhar.slice(aadhar.length - 4);
      }
  
      const recommendationStyles: Record<string, string> = {
        Positive: '<li style="color: green; font-weight: bold;">POSITIVE</li>',
        Negative: '<li style="color: red; font-weight: bold;">NEGATIVE</li>',
      };
      
      const finalRecommendationHtml = recommendationStyles[html_data.status] || '';

      let category = verificationData.basicDetails?.category || '';
      if(category === 'Other') {
        category = verificationData.basicDetails?.categoryOther || '';
      }

      let isApplicantAvailable = verificationData.basicDetails?.isApplicantAvailable || '';
      
      if(isApplicantAvailable === 'Yes') {
        isApplicantAvailable = `
            <tr>
              <th>Is Applicant Available</th>
              <td colspan="5"><span class="var-value">${verificationData.basicDetails?.isApplicantAvailable || ''}</span></td>
            </tr>
            <tr>
              <th>Available Person Mobile</th>
              <td colspan="5"><span class="var-value">${verificationData.basicDetails?.availablePersonMobile || ''}</span></td>
            </tr>
        `;
      } else if(isApplicantAvailable === 'No') {
        let availablePersonRelation = verificationData.basicDetails?.availablePersonRelation || '';
        if(availablePersonRelation === 'Others') {
          availablePersonRelation = verificationData.basicDetails?.availablePersonRelationOther || '';
        }
        isApplicantAvailable = `
            <tr>
              <th>Available Person Name</th>
              <td colspan="5"><span class="var-value">${verificationData.basicDetails?.availablePersonName || ''}</span></td>
            </tr>
            <tr>
              <th>Available Person Relation</th>
              <td colspan="5"><span class="var-value">${availablePersonRelation}</span></td>
            </tr>
            <tr>
              <th>Available Person Mobile</th>
              <td colspan="5"><span class="var-value">${verificationData.basicDetails?.availablePersonMobile || ''}</span></td>
            </tr>
        `;
      }

      let addressMismatch = verificationData.addressVerification?.addressMismatch || '';
      if(addressMismatch === 'Yes') {
        addressMismatch = `
          <tr>
            <th>Address Mismatch</th>
            <td colspan="5"><span class="var-value">${addressMismatch}</span></td>
          </tr>
          <tr>
          <th>Address Correction Details</th>
          <td colspan="5"><span class="var-value">${verificationData.addressVerification?.addressCorrectionDetails || ''}</span></td>
        </tr>
        `;
      } else if(addressMismatch === 'No') {
        addressMismatch = `
          <tr>
            <th>Address Mismatch</th>
            <td colspan="5"><span class="var-value">${addressMismatch}</span></td>
          </tr>
        `;
      }
      let spouseWorking = verificationData.familyEmploymentDetails?.isSpouseWorking || '';
      if(spouseWorking === 'No') {
        spouseWorking = `
          <tr>
            <th>Is Spouse Working</th>
            <td colspan="5"><span class="var-value">No</span></td>
          </tr>`
      } else if(spouseWorking === 'Yes') {
        spouseWorking = `
          <tr>
          <th>Is Spouse Working</th>
          <td colspan="5"><span class="var-value">Yes</span></td>
        </tr>
        <tr>
          <th>Spouse Employment Details</th>
          <td colspan="5"><span class="var-value">${verificationData.familyEmploymentDetails?.spouseEmploymentDetails || ''}</span></td>
        </tr>
        `
      }
    return `
    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="6" class="section-header">Residence Verification</td></tr>
        <tr>
          <th>Name of the Applicant</th>
          <td colspan="5"><span class="var-value">${verificationData.basicDetails?.applicantName || ''}</span></td>
        </tr>
        <tr>
          <th>Initiated Address</th>
          <td colspan="5"><span class="var-value">${verificationData.addressVerification?.addressDetails || ''}</span></td>
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
          <th>Address Type</th>
          <td colspan="5"><span class="var-value">${addressType === 'PermanentAddress' ? 'Permanent Address' : 'Current Address'}</span></td>
        </tr>
        <tr>
          <th>Residential Address</th>
          <td colspan="5"><span class="var-value">${verificationData.addressVerification?.addressDetails || ''}</span></td>
        </tr>
        ${isApplicantAvailable}
        <tr>
          <th>Marital Status</th>
          <td colspan="2"><span class="var-value">${verificationData.basicDetails?.applicantMaritalStatus || ''}</span></td>
          <th>Educational Qualification</th>
          <td colspan="2"><span class="var-value">${verificationData.basicDetails?.educationQualification || ''}</span></td>
        </tr>
        <tr>
          <th>Category</th>
          <td colspan="2"><span class="var-value">${category}</span></td>
          <th>Number of Dependents</th>
          <td colspan="2"><span class="var-value">${verificationData.familyEmploymentDetails?.dependents || ''}</span></td>
        </tr>
        <tr>
          <th>House Area</th>
          <td colspan="5"><span class="var-value">${verificationData.residenceDetails?.houseArea || ''}</span></td>
        </tr>
        <tr>
          <th>Rent Details</th>
          <td colspan="5"><span class="var-value">${verificationData.residenceDetails?.rentDetails || ''}</span></td>
        </tr>
        <tr>
          <th>Accessibility</th>
          <td colspan="5"><span class="var-value">${verificationData.residenceDetails?.accessibility || ''}</span></td>
        </tr>
        <tr>
          <th>Residence Type</th>
          <td colspan="5"><span class="var-value">${verificationData.residenceDetails?.residenceType || ''}</span></td>
        </tr>
        <tr>
          <th>Residence Status</th>
          <td colspan="5"><span class="var-value">${verificationData.residenceDetails?.residenceStatus || ''}</span></td>
        </tr>
        <tr>
          <th>Standard of Living</th>
          <td colspan="5"><span class="var-value">${verificationData.residenceDetails?.standardOfLiving || ''}</span></td>
        </tr>
        <tr>
          <th>Specify Residence Type</th>
          <td colspan="5"><span class="var-value">${verificationData.residenceDetails?.specifyResidenceType || ''}</span></td>
        </tr>
        <tr>
          <th>Years at Current Address</th>
          <td colspan="5"><span class="var-value">${verificationData.residenceDetails?.yearsAtCurrentAddress || ''}</span></td>
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
        <tr>
          <th>Address Proof Submitted</th>
          <td colspan="5"><span class="var-value">${verificationData.addressVerification?.addressProof || ''}</span></td>
        </tr>
        <tr>
          <th>Political Symbol Visible</th>
          <td colspan="5"><span class="var-value">${verificationData.residenceDetails?.politicalSymbolVisible || ''}</span></td>
        </tr>
        <tr>
          <th>Previous City</th>
          <td colspan="5"><span class="var-value">${verificationData.addressVerification?.previousCity || ''}</span></td>
        </tr>
        <tr>
          <th>Address Category</th>
          <td colspan="5"><span class="var-value">${verificationData.addressVerification?.addressCategory || ''}</span></td>
        </tr>
        ${addressMismatch}
        <tr>
          <th>Previous Address</th>
          <td colspan="5"><span class="var-value">${verificationData.addressVerification?.previousAddress || ''}</span></td>
        </tr>
        <tr>
          <th>No. of Years at Previous Address</th>
          <td colspan="5"><span class="var-value">${verificationData.addressVerification?.previousAddressYears || ''}</span></td>
        </tr>
        <tr>
          <th>Reason for Change</th>
          <td colspan="5"><span class="var-value">${verificationData.addressVerification?.reasonForChange || ''}</span></td>
        </tr>
        <tr>
          <th>No. of Years at Current City</th>
          <td colspan="5"><span class="var-value">${verificationData.addressVerification?.numberOfYearsAtCurrentCity || ''}</span></td>
        </tr>
        <tr>
          <th>No. of Years at Current Residence</th>
          <td colspan="5"><span class="var-value">${verificationData.addressVerification?.numberOfYearsAtCurrentResidence || ''}</span></td>
        </tr>
        <tr>
          <th>No. of Years at Previous City</th>
          <td colspan="5"><span class="var-value">${verificationData.addressVerification?.numberOfYearsAtPreviousCity || ''}</span></td>
        </tr>
        <tr>
          <th>Geotag</th>
          <td colspan="5"><span class="var-value">${verificationData.addressVerification?.geoTag || ''}</span></td>
        </tr>
        <tr><td colspan="6" class="section-header">Family Employment Details</td></tr>
        <tr>
          <th>Total Family Members</th>
          <td colspan="5"><span class="var-value">${verificationData.familyEmploymentDetails?.totalFamilyMembers || ''}</span></td>
        </tr>
        <tr>
          <th>No. of Dependents</th>
          <td colspan="5"><span class="var-value">${verificationData.familyEmploymentDetails?.dependents || ''}</span></td>
        </tr>
        <tr>
          <th>Assets Observed</th>
          <td colspan="5"><span class="var-value">${verificationData.familyEmploymentDetails?.assetsObserved || ''}</span></td>
        </tr>
        <tr>
          <th>Earning Members</th>
          <td colspan="5"><span class="var-value">${verificationData.familyEmploymentDetails?.earningMembers || ''}</span></td>
        </tr>
        ${spouseWorking}
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
      <tr><td colspan="7" class="section-header">Family Member Details</td></tr>
      <tr>
        <th>Name</th>
        <th>Relation</th>
        <th>Age</th>
        <th>Employment Type</th>
        <th>Educational Qualification</th>
        <th>Staying With Applicant</th>
      </tr>
      ${Array.isArray(verificationData.familyMemberDetails) && verificationData.familyMemberDetails.length > 0
        ? verificationData.familyMemberDetails.map(fmd => `
          <tr>
            <td><span class="var-value">${fmd.name || ''}</span></td>
            <td><span class="var-value">${fmd.relation === 'Other' ? fmd.otherRelation : fmd.relation || ''}</span></td>
            <td><span class="var-value">${fmd.age || ''}</span></td>
            <td><span class="var-value">${fmd.employmentType || ''}</span></td>
            <td><span class="var-value">${fmd.educationalQualification || ''}</span></td>
            <td><span class="var-value">${fmd.stayingWithApplicant || ''}</span></td>
          </tr>
        `).join('')
        : '<tr><td colspan="5" style="text-align: center;">No Family Member Details found</td></tr>'}
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
  `;
}