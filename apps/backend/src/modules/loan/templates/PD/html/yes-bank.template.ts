import { format, toZonedTime } from "date-fns-tz";

export const yesBankTemplate = (verificationData: any, html_data: any) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    if (!amount) return "";
    return `Rs. ${amount.toLocaleString("en-IN")}/-`;
  };

  // Helper function to render children details
  const renderChildrenDetails = () => {
    const children = verificationData.familyDetails?.children || [];
    if (children.length === 0) {
      return `<ol><li>XXX-son-26yrs-MS.</li><li>XX-son-23yrs-MS</li></ol>`;
    }
    return `<ol>${children.map((child: any) => `<li>${child.name || "XXX"}-${child.relation || "son"}-${child.age || "26"}yrs-${child.education || "MS"}.</li>`).join("")}</ol>`;
  };

  // Helper function to render business reference check
  const renderBusinessRefCheck = () => {
    const refs = verificationData.referenceCheck?.businessReferences || [];
    const ref1 = refs[0] || {};
    const ref2 = refs[1] || {};
    const ref3 = refs[2] || {};
    const ref4 = refs[3] || {};

    return `
      <tr>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Reference type (Nearby business premises, Buyer, Suppliers)</strong></p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref1.type || "XXX"}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref2.type || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref3.type || "-"}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref4.type || ""}</p></td>
      </tr>
      <tr>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of Shop/Business premises with whom ref check done</strong></p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref1.businessName || "NA"}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref2.businessName || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref3.businessName || "-"}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref4.businessName || "-"}</p></td>
      </tr>
      <tr>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of person spoken to</strong></p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref1.contactPerson || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref2.contactPerson || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref3.contactPerson || "-"}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref4.contactPerson || ""}</p></td>
      </tr>
      <tr>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Feedback on business stability, vintage of business, Volume of business, Payment regularity, Capture contact number of person as well (in case ref check done from Suppliers/Buyer)</strong></p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref1.feedback || "Good"}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref2.feedback || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref3.feedback || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref4.feedback || ""}</p></td>
      </tr>
      <tr>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Any other Ref check feedback</strong></p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref1.otherFeedback || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref2.otherFeedback || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref3.otherFeedback || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref4.otherFeedback || ""}</p></td>
      </tr>
      <tr>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Ref Check status (Positive, Negative, Neutral)</strong></p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref1.status || "Positive"}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref2.status || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref3.status || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref4.status || ""}</p></td>
      </tr>
    `;
  };

  // Helper function to render residence reference check
  const renderResidenceRefCheck = () => {
    const refs = verificationData.referenceCheck?.residenceReferences || [];
    const ref1 = refs[0] || {};
    const ref2 = refs[1] || {};
    const ref3 = refs[2] || {};
    const ref4 = refs[3] || {};

    return `
      <tr>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Reference type (from neighbors, nearby Grocery stores, sweets shops, Dairy etc.)</strong></p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref1.type || "XXX"}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref2.type || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref3.type || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref4.type || ""}</p></td>
      </tr>
      <tr>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of Person, Shop/Business premises with whom ref check done</strong></p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref1.businessName || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref2.businessName || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref3.businessName || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref4.businessName || ""}</p></td>
      </tr>
      <tr>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of person spoken to</strong></p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref1.contactPerson || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref2.contactPerson || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref3.contactPerson || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref4.contactPerson || ""}</p></td>
      </tr>
      <tr>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Feedback on applicant's behavior, Involvement in Negative activity, Vintage at residence, involvement in political activity etc</strong></p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref1.feedback || "Good"}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref2.feedback || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref3.feedback || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref4.feedback || ""}</p></td>
      </tr>
      <tr>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Any other Ref check feedback</strong></p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref1.otherFeedback || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref2.otherFeedback || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref3.otherFeedback || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref4.otherFeedback || ""}</p></td>
      </tr>
      <tr>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Ref Check status (Positive, Negative, Neutral)</strong></p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref1.status || "Positive"}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref2.status || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref3.status || ""}</p></td>
        <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ref4.status || ""}</p></td>
      </tr>
    `;
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="bank" content="YES BANK">
        <meta name="template-type" content="YES BANK">
        <meta name="generated-from" content="YES BANK.docx">
        <meta name="generated-date" content="${new Date().toISOString()}">
        <title>YES BANK - YES BANK Template</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                color: #333;
            }
            .template-header {
                border-bottom: 2px solid #333;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .template-header h1 {
                margin: 0;
                font-size: 28px;
            }
            .template-header p {
                margin: 5px 0 0 0;
                color: #666;
                font-size: 14px;
            }
            .template-content {
                margin-top: 20px;
            }
            @media print {
                body {
                    padding: 0;
                }
                .template-header {
                    display: none;
                }
            }
        </style>
    </head>
    <body>
        <div class="template-header">
            <h1>YES BANK</h1>
            <p>YES BANK Template | Generated on ${istDate}</p>
        </div>
        <div class="template-content">
            <p style="margin:8px 0;line-height:1.5"><strong><em>KOWTHA &amp; CO.,</em></strong></p>
            <p style="margin:8px 0;line-height:1.5"><strong><em>CHARTERED ACCOUNTANTS</em></strong> 7396716323</p>
            <p style="margin:8px 0;line-height:1.5">Flat No. 501, AB Heights, Prem Nagar Colony 7995321368</p>
            <p style="margin:8px 0;line-height:1.5">Road No. 1, Banjara Hills, Hyderabad-500004 Mail ID: kowthats@gmail.com</p>
            <p style="margin:8px 0;line-height:1.5"><strong>PERSONAL DISCUSSION REPORT</strong></p>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of the Main applicant</strong></p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.applicantName || "Mr. XXXX"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>PD done with and Relation with applicant</strong></p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Applicant</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Address of the Visit with Landmark</strong></p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.visitedAddress || "XXXX"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>CAS ID</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.casId || "4795473"}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Product (AFHL/MLAP)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.product || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>PD Visit date and time</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.visitDate || istDate.split(" ")[0]}</p><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.visitTime || "09:54 AM"}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Contact number</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.contactNumber || "XXX"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Loan Applied Amt</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.basicInformation?.loanAmount) || "Rs. 15 lakhs"}</p></td>
                    <td rowspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Address visited Type (Residence/Business/Employment place)</strong></p></td>
                    <td rowspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.addressType || "Business"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Tenor Required</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.tenorRequired || "10 years"}</p></td>
                </tr>
            </table>
            
            <p style="margin:8px 0;line-height:1.5"><strong>BASIC DETAILS OF APPLICANT:</strong></p>
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Particulars</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Remarks</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Applicant</strong></p><ul><li>Business</li><li>Educational background</li><li>Past experience</li></ul></td>
                    <td style="border:1px solid #ccc;padding:8px">
                        <ul>
                            <li>Applicant is ${verificationData.basicInformation?.applicantName || "Mr. XXX"}, aged ${verificationData.basicInformation?.age || "28"} years and native of ${verificationData.basicInformation?.nativePlace || "XXX"}.</li>
                            <li>He is running the business under the name of ${verificationData.basicInformation?.businessName || "M/S. XXXX"} since ${verificationData.aboutTheBusiness?.businessStartYear || "2020"}.</li>
                            <li>He has total ${verificationData.aboutTheBusiness?.businessVintage || "03"} years' experience in this field.</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Co-Applicant</strong></p><ul><li>Business</li><li>Employment</li><li>Educational background</li><li>Past experience</li></ul></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.coApplicant?.details || "NA"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Parents Occupation/Business/Employment background</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.parents?.occupation || "NA"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Details of children (studying/working)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px">${renderChildrenDetails()}</td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Siblings Business/Employment background (if residing together)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.siblings?.background || "No"}</p></td>
                </tr>
            </table>
            
            <p style="margin:8px 0;line-height:1.5"><strong>SELF EMPLOYED PROFILE - Occupational Details</strong></p>
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Particulars</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Remarks</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of the Business / Employment</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>${verificationData.basicInformation?.businessName || "M/S. XXX"}</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Constitution of Business Entity (Proprietorship, Partnership, Ltd. Co.)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.aboutTheBusiness?.constitution || "Proprietorship"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of Proprietor, Partners/Shareholders with % share of each</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.applicantName || "Mr. XXX"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>No of Years in Current Business</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.aboutTheBusiness?.businessVintage || "03"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Business profile (to include nature of industry, product preference in the market, competition, seasonality, and other aspects of business</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px">
                        <p style="margin:8px 0;line-height:1.5"><strong>Business details</strong></p>
                        <ul>
                            ${
                              verificationData.aboutTheBusiness?.businessDetails
                                ?.map((detail: any) => `<li>${detail}</li>`)
                                .join("") ||
                              `<li>Applicant started business in ${verificationData.aboutTheBusiness?.businessStartYear || "2020"}.</li>
                             <li>He is running business under the name of ${verificationData.basicInformation?.businessName || "M/S. XXX"} at ${verificationData.basicInformation?.businessLocation || "Hyderabad"}.</li>
                             <li>The applicant is the proprietor of this business and he manages the all business activity.</li>
                             <li>During visit applicant not provided any kind of business documents which confirms business ownership.</li>
                             <li>Applicant not provided any work orders of ongoing sites, and previously completed.</li>
                             <li>Applicant not provided any purchase bills of materials he uses in plumbing works.</li>
                             <li>During visit no tools and machinery observed in visited premises, which are used in plumbing works.</li>
                             <li>Based on lack of documents for business ownership confirmation and for income calculation, hence we are unable to assess the income of applicant based on oral information.</li>`
                            }
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Whether GST registered (if Yes, since when GST registration exist)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.aboutTheBusiness?.gstRegistration || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Details of any other proof of business existence /stability available/verified during visit</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.aboutTheBusiness?.proofOfBusiness || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Average Monthly sales/ receipts</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.financialSummary?.monthlySales) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Average monthly purchase</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.financialSummary?.monthlyPurchase) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Gross margin on the on goods sold</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.financialSummary?.grossMargin || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Overheads to run the business (Indirect expenses)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.financialSummary?.overheads) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Net monthly profit from business</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.financialSummary?.netProfit) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Stock level</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.aboutTheBusiness?.stockLevel || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Description about major customers along with credit terms</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.customers?.customerDetails || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Description about major suppliers along with credit terms</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.suppliers?.supplierDetails || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Business set up details</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.aboutTheBusiness?.businessSetup || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Infrastructure and manpower details (to include Business / factory details, plant capacity utilization and staff strength etc)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.aboutTheBusiness?.infrastructureDetails || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Details of other owned Assets (Property, Land etc) / Investment Details (FD, MF, Share etc)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.assets?.assetsDetails || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Details of other Source of Income (Rental income, Agri income, Interest income etc)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.otherIncomes?.otherIncomeDetails || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Monthly total Household expenses</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.financialSummary?.householdExpenses) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Collateral Details (for MLAP) – Capture Type, Occupancy status, Year of purchase, Parental owned etc</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.collateral?.collateralDetails || "Plot purchases"}</p></td>
                </tr>
            </table>
            
            <p style="margin:8px 0;line-height:1.5"><strong>END USE (FOR MLAP)</strong></p>
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>MLAP (End use in detail), (In case of BT Loan/Loan consolidation, capture end use of earlier loans), (For LCP - capture Cost, AV, source of OCR etc)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.endUse || "Open plot purchase"}</p></td>
                </tr>
            </table>
            
            <p style="margin:8px 0;line-height:1.5"><strong>RESIDENCE/BUSINESS ADDRESS DETAILS:</strong></p>
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Particulars</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Residence (for MLAP)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Business place (NA for salaried profile)</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Premise Address</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.residenceAddress || "XXX"}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.businessAddress || "XXX"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Ownership status (Rented/Owned, Parental)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.residenceOwnership || "Owned"}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.businessOwnership || "Owned"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Owned /rented since when (number of Years)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.residenceYears || "10 years"}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.businessYears || "10 years"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Details of Proof of ownership (if available /documented)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.residenceProof || "NA"}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.businessProof || "NA"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Rented premised verification status</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.residenceVerification || "-"}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.businessVerification || "-"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Rent per month (if rented)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.residenceRent || "NA"}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.businessRent || "NA"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Locality comment (Middle class/Upper middle class/Lower middle class/Lower class/Tin roof)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.residenceLocality || "Middle"}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.businessLocality || "Middle"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Whether Property already Mortgage (if same is owned) – mention Bank/NBFC name</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.residenceMortgage || "NA"}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.businessMortgage || "NA"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>QR code check status (for retail counters on best effort basis) – Positive /Negative</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.residenceQRStatus || "Positive"}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.businessQRStatus || "Positive"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Premise visit comment (whichever visited), also attach visit Pics with selfie</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.residenceVisitComment || "No"}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.businessVisitComment || "Yes"}</p></td>
                </tr>
            </table>
            
            <p style="margin:8px 0;line-height:1.5">*If stability is less than 3 years at current business premises then capture details of earlier premises as applicable</p>
            
            <p style="margin:8px 0;line-height:1.5"><strong>REFERENCE CHECK DETAILS</strong></p>
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Business Ref check</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Ref 1</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Ref 2</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Ref 3</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Ref 4</strong></p></td>
                </tr>
                ${renderBusinessRefCheck()}
                <tr><td style="border:1px solid #ccc;padding:8px"></td><td style="border:1px solid #ccc;padding:8px"></td><td style="border:1px solid #ccc;padding:8px"></td><td style="border:1px solid #ccc;padding:8px"></td><td style="border:1px solid #ccc;padding:8px"></td></tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Residence Ref check (if visited)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Ref 1</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Ref 2</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Ref 3</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Ref 4</strong></p></td>
                </tr>
                ${renderResidenceRefCheck()}
            </table>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>FINAL PD COMMENT</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Interviewer's overall comments, along with explanations</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px">
                        <ul>
                            ${
                              verificationData.finalComments?.interviewerComments
                                ?.map((comment: any) => `<li>${comment}</li>`)
                                .join("") ||
                              `<li>During visit applicant provided all latest documents and claims to be, he works as Plumber, but on visit we observed he doesn't seem like engaged in plumbing works. He doesn't have proper knowledge on plumbing related works.</li>`
                            }
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Level of Activity &amp; Stocks observed Along with other Observations</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.finalComments?.activityLevel || "-"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>PD Status</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>${verificationData.finalComments?.pdStatus || "Negative"}</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Remarks for Positive, Negative and Referred Cases</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px">
                        <ul>
                            ${
                              verificationData.finalComments?.remarks
                                ?.map((remark: any) => `<li>${remark}</li>`)
                                .join("") ||
                              `<li>He did not provide kacha records and GST for verification.</li>`
                            }
                        </ul>
                    </td>
                </tr>
            </table>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of the YBL Employee</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.yblEmployee?.name || "Mr. XXX"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Designation</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.yblEmployee?.designation || "PD Executive"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>EMP ID</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.yblEmployee?.empId || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Signature</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.yblEmployee?.signature || "Mr. XXX"}</p></td>
                </tr>
            </table>
            
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>PD agency Interviewer's Name</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.pdAgency?.interviewerName || "Mr. XXX"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Report Processed By</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>${verificationData.pdAgency?.processedBy || "-"}</strong></p></td>
                </tr>
            </table>
            
            <p style="margin:8px 0;line-height:1.5"><strong>Disclaimer Clause:</strong></p>
            <p style="margin:8px 0;line-height:1.5">This report (including any attachments) has been prepared based on verbal information provided by the person contacted. YES BANK will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. M/s. KOWTHA &amp; CO will not be held liable in any case</p>
            
            <p style="margin:8px 0;line-height:1.5"></p>
            <p style="margin:8px 0;line-height:1.5"><strong>VISIT PHOTOS:</strong></p>
            ${html_data.imagesData || ""}
            
            <p style="margin:8px 0;line-height:1.5"><strong>ANNEXURE 1 – FOR AFHL CASES</strong></p>
            <p style="margin:8px 0;line-height:1.5"><strong>AFHL - Proposed Property Detail:</strong></p>
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Source from which property was identified</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.proposedProperty?.source || "Not Provided"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of the Builder/ Project/ Builder Representative</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.proposedProperty?.builderName || "Not Provided"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Type of Transaction (Purchase, BT/BT+Topup, Construction etc)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.proposedProperty?.transactionType || "Not Provided"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Type of property</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.proposedProperty?.propertyType || "Not Provided"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Details of Property (Address/Flat No./Floor/2 BHK, 3 BHK etc./ Stage of completion, Landmark etc.)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.proposedProperty?.propertyDetails || "Not Provided"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Total Cost of the Property</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.proposedProperty?.totalCost || "Not Provided"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Source details of OCR-(Individual Savings, Sale of another property, Other family members help, etc )</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.proposedProperty?.ocrSource || "Not Provided"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Down payment details (if already done)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.proposedProperty?.downPaymentDetails || "Not Provided"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Amount of down payment</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.proposedProperty?.downPaymentAmount || "Not Provided"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Source of funds for down payment (Individual savings, sale of another property, other Family members help etc.)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.proposedProperty?.downPaymentSource || "Not Provided"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Purpose of Purchase-(Self Occupation/ Investment)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.proposedProperty?.purchasePurpose || "Not Provided"}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Distance of the property from current business and residence</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px">
                        <p style="margin:8px 0;line-height:1.5"><em>If distance is more than 15-20Km from work place , please advise reason for buying property in far area.</em></p>
                        <p style="margin:8px 0;line-height:1.5"><em>How borrower intend to commute from workplace to home in far area.</em></p>
                    </td>
                </tr>
            </table>
            
            <p style="margin:8px 0;line-height:1.5"><strong>ANNEXURE 2 – FOR SALARIED PROFILE</strong></p>
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>DETAILS FOR SALARIED PROFILE</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Particulars</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Remarks</strong></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of the Company</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.employment?.companyName || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Constitution of the Company</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.employment?.companyConstitution || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name &amp; Email ID of HR and Reporting Authority</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.employment?.hrDetails || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name and designation of person met from Employer side alongwith contact no</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.employment?.contactPerson || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Employer Details (i.e., Years in business, Number of employees, Industry etc.)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.employment?.employerDetails || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Employment Status (Regular /on Contact)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.employment?.employmentStatus || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Current Designation &amp; Department</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.employment?.designation || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Employee Id</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.employment?.employeeId || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Salary Mode &amp; salary account details</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.employment?.salaryDetails || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Gross Monthly Salary</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.employment?.grossSalary) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Net Monthly Salary</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.employment?.netSalary) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Whether any loan from employer, If Yes please provide details.</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.employment?.employerLoan || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Terms of Employment</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.employment?.employmentTerms || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Vintage with current employer</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.employment?.vintage || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Details of previous work experience with number of years of experience (If Applicable)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><em>How many years worked in previous job</em></p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Any other source of Income</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.employment?.otherIncome || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Existing Residence status (Rented, Self-owned, Parental, Kachaa house/Chawl etc)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.employment?.residenceStatus || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Rental expenses per month (if existing Residence is rented)</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.employment?.rentalExpenses) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Other General Family expenses per month</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.employment?.familyExpenses) || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Third Party Check for employment</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.employment?.thirdPartyCheck || ""}</p></td>
                </tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Documentary Evidence Seen for employment, with Period/Validity Date</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px">
                        <p style="margin:8px 0;line-height:1.5">1. ${verificationData.employment?.document1 || ""}</p>
                        <p style="margin:8px 0;line-height:1.5">2. ${verificationData.employment?.document2 || ""}</p>
                    </td>
                </tr>
            </table>
        </div>
    </body>
    </html>
  `;
};
