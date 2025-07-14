import { WorkVerificationData } from "./work.interface"

export const workTemplate = (verificationData: WorkVerificationData, html_data: any) => {
    if (html_data.path) {
        html_data.path = html_data.path.replace('<ul>', '').replace('</ul>', '')
      }
      
      const recommendationStyles: Record<string, string> = {
        Positive: '<li style="color: green; font-weight: bold;">POSITIVE</li>',
        Negative: '<li style="color: red; font-weight: bold;">NEGATIVE</li>',
      };

      const finalRecommendationHtml = recommendationStyles[html_data.status] || '';
      
      let aadhar = verificationData.basicDetails?.aadhar || '';
      if(aadhar.length > 4) {
        aadhar = 'XXXX-XXXX-' + aadhar.slice(aadhar.length - 4);
      }

      let employerType = verificationData.employmentDetails?.employerType || '';
      if(employerType === 'Others') {
        employerType = verificationData.employmentDetails?.employerTypeOther || '';
      }

      let natureOfService = verificationData.employmentDetails?.natureOfService || '';
      if(natureOfService === 'Others') {
        natureOfService = verificationData.employmentDetails?.natureOfServiceOther || '';
      }

      let isAddressSame = verificationData.employmentDetails?.isAddressSame || '';
      if(isAddressSame === 'No') {
        isAddressSame = `
          <tr>
            <th>Is Address Same</th>
            <td colspan="5"><span class="var-value">${isAddressSame}</span></td>
          </tr>
          <tr>
          <th>Address Correction Details</th>
          <td colspan="5"><span class="var-value">${verificationData.employmentDetails?.addressCorrection || ''}</span></td>
        </tr>
        `;
      } else if(isAddressSame === 'Yes') {
        isAddressSame = `
          <tr>
            <th>Is Address Same</th>
            <td colspan="5"><span class="var-value">${isAddressSame}</span></td>
          </tr>
        `;
      }

      return `
        <div class="align-wrapper">
          <table class="section-table">
            <tr><td colspan="6" class="section-header">Employment Verification</td></tr>
            <tr>
              <th>Name of the the Applicant</th>
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
              <th>Applicant's Qualification</th>
              <td colspan="5"><span class="var-value">${verificationData.basicDetails?.qualification || ''}</span></td>
            </tr>
            <tr>
              <th>Purpose of Loan</th>
              <td colspan="5"><span class="var-value">${verificationData.basicDetails?.purposeOfLoan || ''}</span></td>
            </tr>
            <tr>
              <th>Loan Amount</th>
              <td colspan="2"><span class="var-value">${verificationData.basicDetails?.loanAmount || ''}</span></td>
              <th>Tenure</th>
              <td colspan="2"><span class="var-value">${verificationData.basicDetails?.tenure || ''}</span></td>
            </tr>
            <tr>
              <th>Name of the Current Employer</th>
              <td colspan="5"><span class="var-value">${verificationData.employmentDetails?.currentOfficeName || ''}</span></td>
            </tr>
            <tr>
              <th>Office Address</th>
              <td colspan="5"><span class="var-value">${verificationData.employmentDetails?.officeAddress || ''}</span></td>
            </tr>
            <tr>
              <th>No. of years in Current Job</th>
              <td colspan="2"><span class="var-value">${verificationData.employmentDetails?.yearsInCurrentJob || ''}</span></td>
              <th>Total Work Experience</th>
              <td colspan="2"><span class="var-value">${verificationData.employmentDetails?.totalWorkExperience || ''}</span></td>
            </tr>
            <tr>
              <th>Designation</th>
              <td colspan="5"><span class="var-value">${verificationData.employmentDetails?.designation || ''}</span></td>
            </tr>
            <tr>
              <th>No. of Employees in the Company</th>
              <td colspan="2"><span class="var-value">${verificationData.employmentDetails?.companySize || ''}</span></td>
              <th>Mode of Salary</th>
              <td colspan="2"><span class="var-value">${verificationData.employmentDetails?.salaryMode || ''}</span></td>
            </tr>
            <tr>
              <th>Employee ID(Copy/Photograph Mandatory)</th>
              <td colspan="5"><span class="var-value">${verificationData.employmentDetails?.idCardNumber || ''}</span></td>
            </tr>
            <tr>
              <th>Type of Employer</th>
              <td colspan="5"><span class="var-value">${employerType}</span></td>
            </tr>
            <tr>
              <th>Type of Industry</th>
              <td colspan="5"><span class="var-value">${natureOfService}</span></td>
            </tr>
            <tr>
              <th>Type of Office Locality</th>
              <td colspan="5"><span class="var-value">${verificationData.employmentDetails?.officeLocality || ''}</span></td>
            </tr>
            <tr>
              <th>Monthly Gross Salary</th>
              <td colspan="2"><span class="var-value">${verificationData.employmentDetails?.grossSalary || ''}</span></td>
              <th>Monthly Net Salary</th>
              <td colspan="2"><span class="var-value">${verificationData.employmentDetails?.netSalary || ''}</span></td>
            </tr>
            ${isAddressSame}
          </table>
          <div style="text-align: right; margin-top: 10px; font-size: 14px; color: #333;">
            Field Executive: ${html_data.fieldExecutive || ''}
          </div>
        </div>
        <div class="footer">
          <span style="color: #138808;">${html_data.bankName}</span><span style="color: #FF9933;"></span><br>
          Generated on ${new Date().toLocaleString()}
        </div>
  
        <div style="page-break-before: always;"></div>
        <div class="align-wrapper">
          <table class="section-table">
            <tr><td colspan="7" class="section-header">Past Employment History</td></tr>
            <tr>
              <th>Employer Name</th>
              <th>Designation</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Contact Person</th>
              <th>Contact Number</th>
              <th>Reason for Movement</th>
            </tr>
            ${verificationData.pastEmployment?.employments?.map(employment => `
              <tr>
                <td><span class="var-value">${employment.employerName || ''}</span></td>
                <td><span class="var-value">${employment.designation || ''}</span></td>
                <td><span class="var-value">${employment.fromDate || ''}</span></td>
                <td><span class="var-value">${employment.toDate || ''}</span></td>
                <td><span class="var-value">${employment.contactPersonName || ''}</span></td>
                <td><span class="var-value">${employment.contactPersonNumber || ''}</span></td>
                <td><span class="var-value">${employment.reasonForMovement || ''}</span></td>
              </tr>
            `).join('') || '<tr><td colspan="7" style="text-align: center;">No past employment history found</td></tr>'}
          </table>
        </div>
  
        <div class="align-wrapper">
          <table class="section-table">
            <tr><td colspan="6" class="section-header">Colleague References</td></tr>
            <tr>
              <th>Name</th>
              <th>Designation</th>
              <th>Mobile</th>
              <th>Email Address</th>
              <th>Address</th>
              <th>Years Known</th>
            </tr>
            ${verificationData.colleagueReferences?.references?.map(reference => `
              <tr>
                <td><span class="var-value">${reference.name || ''}</span></td>
                <td><span class="var-value">${reference.designation || ''}</span></td>
                <td><span class="var-value">${reference.contactNumber || ''}</span></td>
                <td><span class="var-value">${reference.emailAddress || ''}</span></td>
                <td><span class="var-value">${reference.address || ''}</span></td>
                <td><span class="var-value">${reference.yearsKnown || ''}</span></td>
              </tr>
            `).join('') || '<tr><td colspan="6" style="text-align: center;">No colleague references found</td></tr>'}
          </table>
        </div>
  
        <div class="align-wrapper">
          <table class="section-table">
            <tr><td colspan="6" class="section-header">Existing Loans</td></tr>
            <tr>
              <th>Bank Name</th>
              <th>Loan Amount</th>
              <th>EMI</th>
              <th>Tenure</th>
              <th>Purpose</th>
            </tr>
            ${verificationData.existingLoans?.loans?.map(loan => `
              <tr>
                <td><span class="var-value">${loan.bankName || ''}</span></td>
                <td><span class="var-value">${loan.loanAmount || ''}</span></td>
                <td><span class="var-value">${loan.emi || ''}</span></td>
                <td><span class="var-value">${loan.tenure || ''}</span></td>
                <td><span class="var-value">${loan.purpose || ''}</span></td>
              </tr>
            `).join('') || '<tr><td colspan="5" style="text-align: center;">No existing loans found</td></tr>'}
          </table>
          <div style="text-align: right; margin-top: 10px; font-size: 14px; color: #333;">
            Field Executive: ${html_data.fieldExecutive || ''}
          </div>
        </div>

        <div class="footer">
          <span style="color: #138808;">${html_data.bankName}</span><span style="color: #FF9933;"></span><br>
          Generated on ${new Date().toLocaleString()}
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
              Generated on ${new Date().toLocaleString()}
            </div>
            ${html_data.imagesData}
      `;
}