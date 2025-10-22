import { format, toZonedTime } from "date-fns-tz";

export const iiflTemplate = (verificationData: any, html_data: any) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    if (!amount) return "";
    return `Rs. ${amount.toLocaleString("en-IN")}/-`;
  };

  // Helper to get marital status selection
  const getMaritalStatusSelection = () => {
    const status =
      verificationData.prospectNo?.maritalStatusSingleMarriedDivorcedOthers ||
      "";
    return {
      single: status === "Single" ? "<strong>Single</strong>" : "Single",
      married: status === "Married" ? "<strong>Married</strong>" : "Married",
      divorced:
        status === "Divorced" ? "<strong>Divorced</strong>" : "Divorced",
      others: status === "Others" ? "<strong>Others</strong>" : "Others",
    };
  };

  const maritalStatus = getMaritalStatusSelection();

  // Helper to render nested observation table
  const renderObservationTable = () => {
    return `
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Date Of case Initiated</strong></p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.dateOfCaseInitiated || istDate.split(" ")[0]}</p></td></tr>
        <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Date Of Appointment Provided</strong></p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.dateOfAppointment || istDate.split(" ")[0]}</p></td></tr>
        <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Initiated Address</strong></p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.initiatedAddress || "XX"}</p></td></tr>
        <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Visited Address</strong></p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.visitedAddress || "XX"}</p></td></tr>
        <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Residential Address</strong></p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.residentialAddress || "XX"}</p></td></tr>
        <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Contact Information</strong></p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.contactNumber || "XXX"}</p></td></tr>
        <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Loan Amount Required</strong></p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.basicInformation?.loanAmountRequired) || "Rs.7lakhs"}</p></td></tr>
        <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Purpose Of the Loan</strong></p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.purposeOfLoan || "House construction"}</p></td></tr>
        <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Profile Initiated</strong></p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.businessName || "M/s XXX"}</p></td></tr>
      </table>`;
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="bank" content="IIFL">
        <meta name="template-type" content="IIFL">
        <meta name="generated-from" content="IIFL.docx">
        <meta name="generated-date" content="${new Date().toISOString()}">
        <title>IIFL - IIFL Template</title>
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
            <h1>IIFL</h1>
            <p>IIFL Template | Generated on ${istDate}</p>
        </div>
        <div class="template-content">
            <p style="margin:8px 0;line-height:1.5"><strong><em></em></strong></p>
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                <tr><td colspan="7" rowspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><a></a><strong>PD  Sheet - Self Employed Applicant</strong></p></td></tr>
                <tr></tr>
                <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Prospect No.</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>${verificationData.prospectNo?.prospectNumber || "IL11069731"}</strong></p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>NOTE: Please tick/circle as applicable</strong></p></td>
        </tr>
                <tr><td colspan="7" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"> </p></td></tr>
                <tr><td colspan="7" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Basic Details</strong></p></td></tr>
        <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name</strong></p></td>
                    <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>${verificationData.prospectNo?.applicantName || "Mrs.XXX"}</strong></p></td>
        </tr>
        <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Marital Status</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${maritalStatus.single}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${maritalStatus.married}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${maritalStatus.divorced}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${maritalStatus.others}</p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"> </p></td>
        </tr>
        <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Educational Qualification</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Below 10<sup>th</sup></strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">10th Pass</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">12th Pass</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Diploma/ITI<strong> </strong>Certification</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Graduate</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">PG/Professional Certification</p></td>
        </tr>
        <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Category</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">General</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">SC</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">ST</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">OBC</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Others</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"> </p></td>
        </tr>
        <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Number of Dependents</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Children</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>${verificationData.prospectNo?.numberOfChildren || "02"}</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Adults</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>${verificationData.prospectNo?.numberOfAdults || "02"}</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Others</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"> </p></td>
        </tr>
        <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Number of years in Current Residence</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">&lt;=1 Year</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">1-3 Years</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">3-5 Years</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>&gt;5 Years</strong></p></td>
                    <td colspan="2" rowspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong> </strong></p><p style="margin:8px 0;line-height:1.5"><strong> </strong></p></td>
        </tr>
        <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Current residence house size</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">1 RK</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">1 BHK</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>2 BHK</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">&gt;2BHK</p></td>
        </tr>
        <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>If &lt;1= Year, then Previous Address</strong></p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.prospectNo?.previousAddress || "NA"}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Number of Years stayed at that Address</strong></p></td>
                    <td colspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.prospectNo?.yearsAtPreviousAddress || "NA"}</p></td>
        </tr>
        <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Number of Years in Current City</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">&lt;=3 Years</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">&gt;3 Years</p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"> </p></td>
        </tr>
        <tr>
                    <td rowspan="2" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>If &lt;=3 Years in current city, then mention</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Previous City</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>${verificationData.prospectNo?.previousCity || "-"}</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Number of Years In that City</strong></p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>${verificationData.prospectNo?.yearsInPreviousCity || "-"}</strong></p></td>
        </tr>
        <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Reason for Change</strong></p></td>
                    <td colspan="5" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>${verificationData.prospectNo?.reasonForChange || "-"}</strong></p></td>
        </tr>
        <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Parents Staying with?</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Self</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Separate</p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong> </strong>Expired</p></td>
        </tr>
        <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Usage of Property after Purchase</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Self-Occupancy</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Investment</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Others</p></td>
                    <td colspan="3" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"> Renting Purpose</p></td>
        </tr>
        <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Brief Comments/Observation of the case</strong></p></td>
          <td colspan="6" style="border:1px solid #ccc;padding:8px">
                        ${renderObservationTable()}
                        <p style="margin:8px 0;line-height:1.5"><strong>Family Details</strong></p>
                        <ul>
                            ${
                              verificationData.familyDetails?.familyMembers
                                ?.map(
                                  (member: any) =>
                                    `<li>${member.details || ""}</li>`
                                )
                                .join("") ||
                              `<li>Applicant ${verificationData.prospectNo?.applicantName || "XXX"} is aged ${verificationData.prospectNo?.age || "30"} year an 10<sup>th</sup> class and native of ${verificationData.prospectNo?.nativePlace || "Eluru"}.</li>
                             <li>Her spouse ${verificationData.familyDetails?.spouseName || "XXX"} is aged ${verificationData.familyDetails?.spouseAge || "31"} years has studied ${verificationData.familyDetails?.spouseEducation || "Degree"} and own ${verificationData.familyDetails?.spouseOccupation || "auto driving"}.</li>`
                            }
                        </ul>

                        <p style="margin:8px 0;line-height:1.5"><strong>Applicant's Profile </strong></p>
                        <ul>
                            ${
                              verificationData.applicantProfile?.profileDetails
                                ?.map((detail: any) => `<li>${detail}</li>`)
                                .join("") ||
                              `<li>Applicant ${verificationData.prospectNo?.applicantName || "Mrs. XXX"} has studied ${verificationData.prospectNo?.education || "10<sup>th</sup> class"} and her native of ${verificationData.prospectNo?.nativePlace || "XXX"}.</li>
                             <li>Applicant runs business in the name of ${verificationData.basicInformation?.businessName || "M/s XXX"}</li>
                             <li>It is a sole proprietorship business and applicant is sole proprietor of the business</li>
                             <li>Applicant has ${verificationData.aboutTheBusiness?.businessVintage || "8"} years of Experience in this field.</li>`
                            }
                        </ul>

                        <p style="margin:8px 0;line-height:1.5"><strong>Concerns</strong></p>
                        <ul>
                            ${
                              verificationData.concerns?.concernsList
                                ?.map((concern: any) => `<li>${concern}</li>`)
                                .join("") ||
                              `<li>He didn't provide business vintage documents</li>
                             <li>We observed temporary business name board</li>
                             <li>During the visit there is no worker in business</li>
                             <li>She did not provide kacha records.</li>
                             <li>She did not provide UPI Payments.</li>
                             <li>Address mismatch for initiated premises and visited premises</li>`
                            }
                        </ul>

                        <p style="margin:8px 0;line-height:1.5"><strong>Other Observations:</strong></p>
                        <ul>
                            <li>We observed good level of business activity and stock in visited address</li>
                            <li>We observed ${verificationData.aboutTheBusiness?.machineryCount || "2"} machine in business</li>
                        </ul>

                        <p style="margin:8px 0;line-height:1.5"><strong>Income Details: -</strong></p>
                        <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
                            <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"> </p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Income</strong></p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"> </p></td></tr>
                            <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"> </p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Gross Receipts </p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.financialSummary?.grossReceipts || 25000)}</p></td></tr>
                            <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Add</p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Other Income (Related To The Business Only)</p></td><td style="border:1px solid #ccc;padding:8px"></td></tr>
                            <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"> </p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Total (A)</strong></p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.financialSummary?.totalIncome || 25000)}</p></td></tr>
                            <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Less</p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Expenses</strong></p></td><td style="border:1px solid #ccc;padding:8px"></td></tr>
                            <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"> </p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Purchase </p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.financialSummary?.purchaseExpenses || 5000)}</p></td></tr>
                            <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"> </p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Salaries</p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.financialSummary?.salaryExpenses || 5000)}</p></td></tr>
                            <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"> </p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Electricity  </p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.financialSummary?.electricityExpenses || 1000)}</p></td></tr>
                            <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"> </p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Other Expenses</p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.financialSummary?.otherExpenses || 1000)}</p></td></tr>
                            <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"> </p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Total (B)</strong></p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.financialSummary?.totalExpenses || 12000)}</p></td></tr>
                            <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"> </p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"> </p></td><td style="border:1px solid #ccc;padding:8px"></td></tr>
                            <tr><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"> </p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Net Profit (A-B)</p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${formatCurrency(verificationData.financialSummary?.netProfit || 13000)}</p></td></tr>
                            <tr><td style="border:1px solid #ccc;padding:8px"></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">Net margin</p></td><td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.financialSummary?.netMargin || 52}%</p></td></tr>
                        </table>
                        <p style="margin:8px 0;line-height:1.5"><strong>Other Incomes:</strong></p>
                        <p style="margin:8px 0;line-height:1.5">Applicant husband is auto driver and he earns Rs.25,000/- to Rs.30,000/- per month </p>
                        <p style="margin:8px 0;line-height:1.5"><strong>REFERENCE DETAILS</strong></p>
                        <p style="margin:8px 0;line-height:1.5">${verificationData.references?.referenceDetails || "XXXXX"}</p>
                        <p style="margin:8px 0;line-height:1.5"><strong>STATUS OF THE CASE:-</strong></p>
                        <ul><li><strong>${html_data.status || "Negative (Address mismatch for initiated address and visited address)"}</strong></li></ul>
          </td>
        </tr>
        <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of PD Officer</strong></p></td>
                    <td colspan="6" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.pdOfficer?.name || "Mr. Naveen"}</p></td>
        </tr>
        <tr>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Date of Discussion</strong></p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.basicInformation?.dateOfDiscussion || istDate.split(" ")[0]}</p></td>
                    <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Signature of the PD Officer</strong></p></td>
                    <td colspan="4" style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${verificationData.pdOfficer?.signature || "Mr.Naveen"}</p></td>
        </tr>
      </table>
            <p style="margin:8px 0;line-height:1.5"><strong>Disclaimer Clause:</strong></p>
            <p style="margin:8px 0;line-height:1.5">This report (including any attachments) has been prepared based on verbal information provided by the person contacted. IIFL HOME FINANCE LTD will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. <strong>M/s. KOWTHA & CO </strong>will not be held liable in any case.</p>
            <p style="margin:8px 0;line-height:1.5"><strong></strong></p>
            <p style="margin:8px 0;line-height:1.5"><strong>PHOTOS:</strong></p>
            ${html_data.imagesData || ""}
    </div>
    </body>
    </html>
  `;
};
