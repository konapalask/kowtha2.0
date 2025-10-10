import { format, toZonedTime } from 'date-fns-tz';
import { pdBaseTemplate } from './pd-base.tempate';


export const indiaShelterSalariedTemplate = (verificationData1: any, html_data: any) => {
    const indiaShelterSalariedData = {
        "loan_number" : "",
        "branch": "Hyderabad Main Branch",

        "basic_details": {
            "loan_product_hl_lap": "HL / LAP",
            "to_whom_you_meet": "",
            "name_of_the_applicant_with_dob": {
                "name": "",
                "dob": "",
            },
            "marital_status_single_married_divorced_other": "single / Married / Divorced / Other",
            "name_of_the_spouse_with_dob": {
                "name_2": "",
                "dob_2": "",
            },
            "does_the_spouse_work_if_yes_then_give_brief": "",
            "qualification_below_10_10th_pass_12th_pass_diploma_iti_certification_graduate_pg": "Below 10 / 10th Pass / 12th Pass / Diploma / ITI Certification / Graduate / PG / Professional Certification",
            "category_general_sc_st_obc_others": "General / SC / ST / OBC / Others",
            "total_no_of_family_members": "",
            "no_of_non_earning_members_dependants": "",

            "number_of_dependents": {
                "children": "2",
                "adults": "2",
                "others": "0",
            },

            "residence_address_details": {
                "address": "",
                "no_of_years_at_current_residence": "",
                "area_in_sq_ft": "",
                "monthly_rent_security_deposit_if_rented": "",
                "purchase_case_mv_if_owned": "",
            },

            "number_of_years_in_current_city_3_years_3_years": "<=3 years / >3 years",
            "other_income": "",
            "net_worth": "",
            "credit_card_details": "",
            "monthly_household_expenses": "Rs.",
            "existing_relationship_with_indiashelter": "",
        },

        "employer_details": {
            "employer_name": "Infosys Technologies Pvt. Ltd.",

            "employer_address": "Hyderabad, Telangana",
            "designation": "Software Engineer",

            "current_monthly_salary": {
                "gross": "₹95,000",
                "net": "₹80,000",
            },

            "no_of_years_in_present_employment": "5 Years",
            "applicants_job_profile": "",
            "about_the_company": "",
            "customer_location":"(longtitude, latitude)",
            "previous_employment_details": "",
        },

        "family_member_details": {
            "name_3": "Priya Sharma",
            "relation_with_applicant": "Spouse",
            "age_yrs": "33",
            "occupation_job_business": "Teacher",
            "educational_qualification_also_mention_if_govt_or_private_institution": "B.Ed   - Private Institution",
            "contact_no": "9876543210",
            "staying_with_applicant_yes_no": "Yes",
        },

        "current_loan_details": {
            "bank_fi_name": "ABC Bank",
            "loan_type": "Home Loan",
            "sanction_amt": "₹25,00,000",
            "emi": 24500,
            "no_of_emi_paid": 12,
            "bal_tenure": 108,
        },

        "banking_details": {
            "bank_name": "ABC Bank",
            "account_no": "123456789012",
            "account_type_saving_current": "Savings",
            "branch_name": "Hitech City",
            "operating_since_yrs": "6",
        },

        "loan_details_and_purpose": {
            "purpose_of_loan": ["flat_purchase",
                                "house_purchase",
                                "plot_purchase",
                                "construction_of_residential_house_property",
                                "business_development",
                                "improvementextension",
                                "balance_transfer",
                                "plot_construction"
                            ],
            "minimum_loan_amount_required_rs": "Rs.",
            "tenor_required": "Rs.",
            "comfortable_emi": "",

        },

        "collateral_details": {
            "status_of_property_to_be_purchased": ["Ready to move", 
                                                    "Under construction",
                                                    "Construction yet to start"
                                                ],
            "Usage_of_property_after_purchase": ["Self-occupied", 
                                                "Investment",
                                                "Others:",
                                                "Renting Purpose"
                                            ],
            "property_address": "Flat No. 402, Green Valley Apartments, Hyderabad, Telangana",
            "area_in_sqft": 1250,

            "ownership_of_the_property_from_how_many_years": "",
            "agreement_value": "₹48,00,000",
            "own_contribution": "₹8,00,000",
        },

        "reference_details": {
            "reference_1": {
                "name_4": "Amit Verma",
                "address_2": "501, Sunrise Apartments, Hyderabad",
                "relationship": "Friend",
                "contact_number": "9812345678",
                "email_address": "amit.verma@example.com",
                "no_of_year_known_the_applicant": "5 Years",
            },
            "reference_2": {
                "name_5": "Amit Verma",
                "address_3": "501, Sunrise Apartments, Hyderabad",
                "relationship_2": "Friend",
                "contact_number_2": "9812345678",
                "email_address": "amit.verma@example.com",
                "no_of_year_known_the_applicant_2": "5 Years",
            },
        },

        "TPC_Third_Party_Check_Details": {
            "office_reference_check": {
                "name_6": "Anjali Gupta",
                "mobile_no": "9876501234",
                "knowing_since_months_years": 36,
                "feedback_positive_negative": "Positive/Negative",
            },
        },



        "document_verified": {
            "document_type": ["Salary Slip",
                              "Bank Statement",
                              "Resident Proof", 
                              "Form 16"
                        ],
            "original_copy_not_provided": [],
            "details_cross_-_checked_yes_no": [],
            "comments_if_any": [],
        },


        "to_be_filled_by_pd_officer": {
            "major_observations_comments_concerns_during_pd": {
                "case_strengths": "",
                "case_weakness": "",
            },
            "pd_status_positive_negative_credit_refer": "Positive/Negative/Referred",
            "name_of_pd_officer": "",
            "date_time_of_visit": "",
            "signature_of_the_pd_officer": "",

        },
    };



    return `
    <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin-top: 24px;
                    padding: 0;
                    background: #fff;
                    color: #222;
                    position: relative;
                    min-height: 60vh;
                }
                .header {
                    text-align: left;
                    padding: 24px 40px 8px 40px;
                    border-bottom: 0px solid #2c3e50;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                .header .firm {
                    font-size: 28px;
                    font-weight: bold;
                    color: #1a237e;
                    letter-spacing: 1px;
                }
                .header .subtitle {
                    color: #1976d2;
                    font-style: italic;
                    font-size: 18px;
                    margin-bottom: 8px;
                }
                .header .address {
                    font-size: 14px;
                    margin-bottom: 4px;
                }
                .header .contact {
                    font-size: 14px;
                    text-align: right;
                    margin-top: 40px;
                }
                .logo {
                    display: block;
                    width: 220px;
                    filter: contrast(200%) brightness(80%) saturate(150%);
                    background: white;
                    image-rendering: auto;
                    margin-left: 0; /* aligns to left */
                    margin-bottom: 20px;
                }
                .report-title {
                    text-align: center;
                    font-size: 20px;
                    font-weight: bold;
                    margin: 24px 0 0 0;
                    letter-spacing: 1px;
                    text-decoration: underline;
                }
                .align-wrapper {
                    width: 100%;
                    margin: 0 auto;
                }
                .branch-box {
                    width: 100%;
                    margin: 18px 0 0 0;
                    border: 2px solid #888;
                    border-radius: 4px;
                    background: #f8f9fa;
                }
                .branch-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .branch-table td {
                    border: none;
                    padding: 10px 16px;
                    font-size: 16px;
                }
                .branch-label {
                    font-weight: bold;
                    width: 160px;
                }
                .branch-value {
                    font-size: 18px;
                    font-weight: bold;
                    color: #222;
                }
                .branch-note {
                    background: #ffe0b2;
                    color: #b26a00;
                    font-size: 13px;
                    text-align: center;
                    border-radius: 3px;
                    font-weight: bold;
                }
                .section-table {
                    width: 100%;
                    margin: 24px 0 0 0;
                    border-collapse: collapse;
                    font-size: 15px;
                }
                .section-header {
                    background: #f5f5f5;
                    font-weight: bold;
                    font-size: 16px;
                    text-align: center;
                    border: 1px solid #888;
                    padding: 8px;
                    letter-spacing: 1px;
                }
                .section-table th, .section-table td {
                    border: 1px solid #888;
                    padding: 8px 10px;
                    vertical-align: top;
                }
                .section-table th {
                    background: #f5f5f5;
                    font-weight: bold;
                    text-align: center; 
                    width: 220px;
                }
                .highlight {
                    font-weight: bold;
                    color: #1a237e;
                }
                .tick {
                    font-weight: bold;
                    color: #388e3c;
                    font-size: 18px;
                }
                .pdf-footer {
                    position: fixed;
                    bottom: 20px;
                    left: 0;
                    width: 100%;
                    display: flex;
                    justify-content: flex-end;
                    color: #8b9090ff;
                    font-size: 12px;
                    padding: 6px 40px 4px 40px;
                    z-index: 1000;
                    box-sizing: border-box;
                    align-items: center;
                }
                .pdf-footer p {
                    margin: 0;
                    padding: 0;
                }

                .page-break { page-break-before: always; display: block; height: 50px; }

            </style>
        </head>

            <body>
                <div class="header">
                    <div>
                        <div class="firm">KOWTHA & CO.,</div>
                        <div class="subtitle">CHARTERED ACCOUNTANTS</div>
                        <div class="address">Flat No. 501, AB Heights, Prem Nagar Colony</div>
                        <div class="address">Road No. 1, Banjara Hills, Hyderabad-500 033</div>
                    </div>
                    <div class="contact">
                        9490008968(TS)<br>
                        Mail ID: <a href="mailto:kowthaTS@gmail.com" style="color: #000000ff; text-decoration: none;">kowthaTS@gmail.com</a><br>
                    </div>
                </div>

                <footer class="pdf-footer">
                <p>INDIA SHELTER</p>
                </footer>


                <div class="align-wrapper">
                    <div class="content">
                        <table style="width:100%; border-collapse:collapse; font-size:12px; background:#fff;">
                            <style>
                                td, th { padding: 6px 10px !important; }
                            </style>
                            <!-- PD SHEET HEADER -->
                            <tr>
                                <th colspan="6" style="background:#90ee90; color:#222; font-size:18px; font-weight:bold; text-align:center; border:1px solid #222; padding:6px;">PD SHEET – SALARIED</th>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222; padding:4px 8px;">Loan Number</td>
                                <td colspan="5" style="border:1px solid #222; padding:4px 8px;">${indiaShelterSalariedData.loan_number}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222; padding:4px 8px;">Branch</td>
                                <td colspan="5" style="border:1px solid #222; padding:4px 8px;">${indiaShelterSalariedData.branch}</td>
                            </tr>
                            <!-- BASIC DETAILS HEADER -->
                            <tr>
                                <th colspan="6" style="background:#f5cfa0; color:#222; font-size:16px; font-weight:bold; text-align:center; border:1px solid #222; padding:6px;">Basic Details</th>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Loan Product</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["basic_details"]?.loan_product_hl_lap || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">To Whom you meet?</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["basic_details"]?.to_whom_you_meet || ""}</td>
                            </tr>
                            <tr>
                                <td rowspan="2" style="font-weight:bold; border:1px solid #222; vertical-align:middle;">Name of the Applicant<br/>with DOB</td>
                                <td colspan="5" style=" border:1px solid #222;"><b>Name:</b> ${indiaShelterSalariedData["basic_details"]?.name_of_the_applicant_with_dob.name || ""}</td>
                            </tr>
                            <tr>
                                <td colspan="5" style="border:1px solid #222;"><b>DOB:</b> ${indiaShelterSalariedData["basic_details"]?.name_of_the_applicant_with_dob.dob || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Marital Status</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["basic_details"]?.marital_status_single_married_divorced_other || ""}</td>
                            </tr>
                            <tr>
                                <td rowspan="2" style="font-weight:bold; border:1px solid #222;">Name of the Spouse<br/>with DOB</td>
                                <td colspan="5" style=" border:1px solid #222;"><b>Name:</b> ${indiaShelterSalariedData["basic_details"]?.name_of_the_spouse_with_dob.name_2 || ""}</td>
                            </tr>
                            <tr>
                                <td colspan="5" style="border:1px solid #222;"><b>DOB:</b> ${indiaShelterSalariedData["basic_details"]?.name_of_the_spouse_with_dob.dob_2 || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Does the Spouse Work<br/>(If yes then give brief)</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["basic_details"]?.does_the_spouse_work_if_yes_then_give_brief || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Qualification</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["basic_details"]?.qualification_below_10_10th_pass_12th_pass_diploma_iti_certification_graduate_pg || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Category</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["basic_details"]?.category_general_sc_st_obc_others || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Total No. of Family Members</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["basic_details"]?.total_no_of_family_members || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">No of non-earning<br/>members/ dependants</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["basic_details"]?.no_of_non_earning_members_dependants || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Number of Dependents</td>
                                <td style="font-weight:normal; border:1px solid #222;">Children: <span style='font-weight:bold; text-decoration:underline;'>${indiaShelterSalariedData["basic_details"]?.number_of_dependents.children || ""}</span></td>
                                <td style="font-weight:normal; border:1px solid #222;">Adults: <span style='font-weight:bold; text-decoration:underline;'>${indiaShelterSalariedData["basic_details"]?.number_of_dependents.adults || ""}</span></td>
                                <td colspan="2" style="border:1px solid #222;">Others: <span style='font-weight:bold; text-decoration:underline;'>${indiaShelterSalariedData["basic_details"]?.number_of_dependents.others || ""}</span></td>
                            </tr>
                            <tr>
                                <td rowspan="5" style="font-weight:bold; border:1px solid #222;">Residence Address & details</td>
                                <td colspan="6" style="border:1px solid #222;">Address: ${indiaShelterSalariedData["basic_details"]?.["Residence Address & Details"]?.address || ""}</td>
                            </tr>
                            <tr>
                                <td colspan="6" style="border:1px solid #222;">No of Years at Current Residence: ${indiaShelterSalariedData["basic_details"]?.["Residence Address & Details"]?.no_of_years_at_current_residence || ""}</td>
                            </tr>
                            <tr>
                                <td colspan="6" style="border:1px solid #222;">Area (in Sq ft): ${indiaShelterSalariedData["basic_details"]?.["Residence Address & Details"]?.area_in_sq_ft || ""}</td>
                            </tr>
                            <tr>
                                <td colspan="6" style="border:1px solid #222;">Monthly Rent & Security Deposit (if Rented): ${indiaShelterSalariedData["basic_details"]?.["Residence Address & Details"]?.monthly_rent_security_deposit_if_rented || ""}</td>
                            </tr>
                            <tr>
                                <td colspan="6" style="border:1px solid #222;">Purchase case & MV (if owned): ${indiaShelterSalariedData["basic_details"]?.["Residence Address & Details"]?.purchase_case_mv_if_owned || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Number of Years in Current City</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["basic_details"]?.number_of_years_in_current_city_3_years_3_years || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Other Income</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["basic_details"]?.other_income || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Net Worth (Car / Property / Investments, etc)</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["basic_details"]?.net_worth || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Credit Card details</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["basic_details"]?.credit_card_details || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Monthly Household expenses</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["basic_details"]?.monthly_household_expenses || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Existing Relationship with Indiashelter</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["basic_details"]?.existing_relationship_with_indiashelter || ""}</td>
                            </tr>
                        </table>

     <div class="page-break"></div>

                        <!-- EMPLOYER DETAILS SECTION -->
                        <table style="width:100%; border-collapse:collapse; font-size:12px; background:#fff; margin-top:12px;">
                            <tr>
                                <th colspan="6" style="background:#f5cfa0; color:#222; font-size:16px; font-weight:bold; text-align:center; border:1px solid #222;">Employer details</th>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Employer Name</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["employer_details"]?.employer_name || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Employer Address</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["employer_details"]?.employer_address || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Designation</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["employer_details"]?.designation || ""}</td>
                            </tr>
                            <tr>
                                <td rowspan="2" style="font-weight:bold; border:1px solid #222;">Current Monthly Salary (Net)</td>
                                <td style="font-weight:bold; border:1px solid #222;">Gross:</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["employer_details"]?.current_monthly_salary?.gross || ""}</td>
                                <td style="font-weight:bold; border:1px solid #222;">Net:</td>
                                <td colspan="2" style="border:1px solid #222;">${indiaShelterSalariedData["employer_details"]?.current_monthly_salary?.net || ""}</td>
                            </tr>
                            <tr></tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">No of yrs in present employment</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["employer_details"]?.["No of years in present employment"] || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Applicant's Job Profile:</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["employer_details"]?.["Applicant's Job Profile"] || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">About the company</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["employer_details"]?.about_the_company || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Customer Location (Office / Business GEO Tag)</td>
                                <td colspan="5" style="border:1px solid #222; color:#d4af37;">${indiaShelterSalariedData["employer_details"]?.customer_location || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Previous Employment</td>
                                <td colspan="5" style="border:1px solid #222;">${indiaShelterSalariedData["employer_details"]?.previous_employment_details || ""}</td>
                            </tr>
                        </table>

                        <!-- FAMILY MEMBER DETAILS SECTION -->
                        <table style="width:100%; border-collapse:collapse; font-size:12px; background:#fff; margin-top:12px;">
                            <tr>
                                <th colspan="7" style="background:#f5cfa0; color:#222; font-size:16px; font-weight:bold; text-align:center; border:1px solid #222;">Family Member Details</th>
                            </tr>
                            <tr>
                                <th style="border:1px solid #222;">Name</th>
                                <th style="border:1px solid #222;">Relation with Applicant</th>
                                <th style="border:1px solid #222;">Age (yrs)</th>
                                <th style="border:1px solid #222;">Occupation (Job / Business)</th>
                                <th style="border:1px solid #222;">Educational Qualification (Also mention if Govt. or Private institution)</th>
                                <th style="border:1px solid #222;">Contact no</th>
                                <th style="border:1px solid #222;">Staying with Applicant (yes/no)</th>
                            </tr>
                            <tr>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["family_member_details"]?.name_3 || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["family_member_details"]?.relation_with_applicant || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["family_member_details"]?.age_yrs || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["family_member_details"]?.["Occupation (Job / Business)"] || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["family_member_details"]?.educational_qualification_also_mention_if_govt_or_private_institution || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["family_member_details"]?.contact_no || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["family_member_details"]?.staying_with_applicant_yes_no || ""}</td>
                            </tr>
                        </table>

                <!-- CURRENT LOAN DETAILS SECTION -->
                        <table style="width:100%; border-collapse:collapse; font-size:12px; background:#fff; margin-top:12px;">
                            <tr>
                                <th colspan="6" style="background:#f5cfa0; color:#222; font-size:16px; font-weight:bold; text-align:center; border:1px solid #222;">Current Loan details</th>
                            </tr>
                            <tr>
                                <th style="border:1px solid #222;">Bank / FI Name</th>
                                <th style="border:1px solid #222;">Loan Type</th>
                                <th style="border:1px solid #222;">Sanction Amt.</th>
                                <th style="border:1px solid #222;">EMI</th>
                                <th style="border:1px solid #222;">No. of EMI Paid</th>
                                <th style="border:1px solid #222;">Bal. Tenor</th>
                            </tr>
                            <tr>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["current_loan_details"]?.bank_fi_name || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["current_loan_details"]?.loan_type || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["current_loan_details"]?.sanction_amt || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["current_loan_details"]?.emi || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["current_loan_details"]?.no_of_emi_paid || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["current_loan_details"]?.bal_tenure || ""}</td>
                            </tr>
                        </table>

                <!-- BANKING DETAILS SECTION -->
                        <table style="width:100%; border-collapse:collapse; font-size:12px; background:#fff; margin-top:12px;">
                            <tr>
                                <th colspan="5" style="background:#f5cfa0; color:#222; font-size:16px; font-weight:bold; text-align:center; border:1px solid #222;">Banking details</th>
                            </tr>
                            <tr>
                                <th style="border:1px solid #222;">Bank Name</th>
                                <th style="border:1px solid #222;">Account no.</th>
                                <th style="border:1px solid #222;">Account Type (Saving / Current)</th>
                                <th style="border:1px solid #222;">Branch Name</th>
                                <th style="border:1px solid #222;">Operating Since (Yrs)</th>
                            </tr>
                            <tr>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["banking_details"]?.bank_name || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["banking_details"]?.account_no || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["banking_details"]?.account_type_saving_current || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["banking_details"]?.branch_name || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["banking_details"]?.operating_since_yrs || ""}</td>
                            </tr>
                        </table>

                <!-- LOAN DETAILS & PURPOSE SECTION -->
                        <table style="width:100%; border-collapse:collapse; font-size:12px; background:#fff; margin-top:12px;">
                            <tr>
                                <th colspan="2" style="background:#f5cfa0; color:#222; font-size:16px; font-weight:bold; text-align:center; border:1px solid #222;">Loan Details & Purpose</th>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Purpose of Loan</td>
                                <td style="border:1px solid #222;">
                                    ${(indiaShelterSalariedData["loan_details_and_purpose"]?.["purpose_of_loan"] || []).join('<br/>')}
                                </td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Minimum Loan Amount Required</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["loan_details_and_purpose"]?.minimum_loan_amount_required_rs || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Tenor required</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["loan_details_and_purpose"]?.tenor_required || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Comfortable EMI</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["loan_details_and_purpose"]?.comfortable_emi || ""}</td>
                            </tr>
                        </table>

    <div class="page-break"></div>

                <!-- COLLATERAL DETAILS SECTION -->
                        <table style="width:100%; border-collapse:collapse; font-size:12px; background:#fff; margin-top:12px;">
                            <tr>
                                <th colspan="2" style="background:#f5cfa0; color:#222; font-size:16px; font-weight:bold; text-align:center; border:1px solid #222;">Collateral Details</th>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Status of Property to be Purchased</td>
                                <td style="border:1px solid #222;">${(indiaShelterSalariedData["collateral_details"]?.status_of_property_to_be_purchased || []).join('<br/>')}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Usage of Property after Purchase</td>
                                <td style="border:1px solid #222;">${(indiaShelterSalariedData["collateral_details"]?.Usage_of_property_after_purchase || []).join('<br/>')}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Property Address</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["collateral_details"]?.["Property Address"] || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Area (in Sqft)</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["collateral_details"]?.area_in_sqft || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Ownership of the property from how many years?</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["collateral_details"]?.ownership_of_the_property_from_how_many_years || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Agreement value</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["collateral_details"]?.agreement_value || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Own Contribution</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["collateral_details"]?.own_contribution || ""}</td>
                            </tr>
                        </table>

                        <!-- REFERENCE DETAILS SECTION -->
                        <table style="width:100%; border-collapse:collapse; font-size:12px; background:#fff; margin-top:12px;">
                            <tr>
                                <th colspan="3" style="background:#f5cfa0; color:#222; font-size:16px; font-weight:bold; text-align:center; border:1px solid #222;">References details</th>
                            </tr>
                            <tr>
                                <th style="border:1px solid #222;">Reference 1</th>
                                <th style="border:1px solid #222;">Reference 2</th>
                            </tr>
                            <tr>
                                <td style="border:1px solid #222;">
                                    Name: ${indiaShelterSalariedData["reference_details"]?.["reference_1"]?.name_4 || ""}<br/>
                                    Address: ${indiaShelterSalariedData["reference_details"]?.["reference_1"]?.address_2 || ""}<br/>
                                    Relationship: ${indiaShelterSalariedData["reference_details"]?.["reference_1"]?.relationship || ""}<br/>
                                    Contact Number: ${indiaShelterSalariedData["reference_details"]?.["reference_1"]?.contact_number || ""}<br/>
                                    Email Address: ${indiaShelterSalariedData["reference_details"]?.["reference_1"]?.email_address || ""}<br/>
                                    No of year known the applicant: ${indiaShelterSalariedData["reference_details"]?.["reference_1"]?.no_of_year_known_the_applicant || ""}
                                </td>
                                <td style="border:1px solid #222;">
                                    Name: ${indiaShelterSalariedData["reference_details"]?.["reference_2"]?.name_5 || ""}<br/>
                                    Address: ${indiaShelterSalariedData["reference_details"]?.["reference_2"]?.address_3 || ""}<br/>
                                    Relationship: ${indiaShelterSalariedData["reference_details"]?.["reference_2"]?.relationship_2 || ""}<br/>
                                    Contact Number: ${indiaShelterSalariedData["reference_details"]?.["reference_2"]?.contact_number_2 || ""}<br/>
                                    Email Address: ${indiaShelterSalariedData["reference_details"]?.["reference_2"]?.email_address || ""}<br/>
                                    No of year known the applicant: ${indiaShelterSalariedData["reference_details"]?.["reference_2"]?.no_of_year_known_the_applicant_2 || ""}
                                </td>
                            </tr>
                        </table>

                <!-- TPC (THIRD PARTY CHECK) DETAILS SECTION -->
                        <table style="width:100%; border-collapse:collapse; font-size:12px; background:#fff; margin-top:12px;">
                            <tr>
                                <th colspan="4" style="background:#f5cfa0; color:#222; font-size:16px; font-weight:bold; text-align:center; border:1px solid #222;">TPC (Third Party check) Details</th>
                            </tr>
                            <tr>
                                <th style="border:1px solid #222;">Name</th>
                                <th style="border:1px solid #222;">Mobile No.</th>
                                <th style="border:1px solid #222;">Knowing since (Months / Years)</th>
                                <th style="border:1px solid #222;">Feedback</th>
                            </tr>
                            <tr>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["TPC_Third_Party_Check_Details"]?.["office_reference_check"]?.name_6 || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["TPC_Third_Party_Check_Details"]?.["office_reference_check"]?.mobile_no || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["TPC_Third_Party_Check_Details"]?.["office_reference_check"]?.knowing_since_months_years || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["TPC_Third_Party_Check_Details"]?.["office_reference_check"]?.feedback_positive_negative || ""}</td>
                            </tr>
                        </table>

                        <!-- DOCUMENT VERIFIED SECTION -->
                        <table style="width:100%; border-collapse:collapse; font-size:12px; background:#fff; margin-top:12px;">
                            <tr>
                                <th colspan="4" style="background:#f5cfa0; color:#222; font-size:16px; font-weight:bold; text-align:center; border:1px solid #222;">Document Verified</th>
                            </tr>
                            <tr>
                                <th style="border:1px solid #222;">Document Type</th>
                                <th style="border:1px solid #222;">Original / Copy / Not Provided</th>
                                <th style="border:1px solid #222;">Details Cross - Checked (Yes / No)</th>
                                <th style="border:1px solid #222;">Comments (If any)</th>
                            </tr>
                            ${(indiaShelterSalariedData["document_verified"]?.["document_type"] || []).map((doc, i) => `
                                <tr>
                                    <td style="border:1px solid #222;">${doc}</td>
                                    <td style="border:1px solid #222;">${indiaShelterSalariedData["document_verified"]?.["original_copy_not_provided"][i] || ""}</td>
                                    <td style="border:1px solid #222;">${indiaShelterSalariedData["document_verified"]?.["details_cross_-_checked_yes_no"][i] || ""}</td>
                                    <td style="border:1px solid #222;">${indiaShelterSalariedData["document_verified"]?.["comments_if_any"][i] || ""}</td>
                                </tr>`).join('')}
                        </table>

                        <!-- TO BE FILLED BY PD OFFICER SECTION -->
                        <table style="width:100%; border-collapse:collapse; font-size:12px; background:#fff; margin-top:12px;">
                            <tr>
                                <th colspan="4" style="background:#f5cfa0; color:#222; font-size:16px; font-weight:bold; text-align:center; border:1px solid #222;">To be filled by PD officer</th>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Major Observations / Comments / Concerns During PD</td>
                                <td style="font-weight:bold; border:1px solid #222;">Case Strengths</td>
                                <td style="font-weight:bold; border:1px solid #222;">Case Weakness</td>
                                <td style="font-weight:bold; border:1px solid #222;">PD status</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["to_be_filled_by_pd_officer"]?.["major_observations_comments_concerns_during_pd"]?.case_strengths || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["to_be_filled_by_pd_officer"]?.["major_observations_comments_concerns_during_pd"]?.case_strengths || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["to_be_filled_by_pd_officer"]?.["major_observations_comments_concerns_during_pd"]?.case_weakness || ""}</td>
                                <td style="border:1px solid #222;">${indiaShelterSalariedData["to_be_filled_by_pd_officer"]?.pd_status_positive_negative_credit_refer || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Name of PD Officer</td>
                                <td colspan="3" style="border:1px solid #222;">${indiaShelterSalariedData["to_be_filled_by_pd_officer"]?.name_of_pd_officer || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Date & Time of Visit</td>
                                <td colspan="3" style="border:1px solid #222;">${indiaShelterSalariedData["to_be_filled_by_pd_officer"]?.date_time_of_visit || ""}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; border:1px solid #222;">Signature of the PD Officer</td>
                                <td colspan="3" style="border:1px solid #222;">${indiaShelterSalariedData["to_be_filled_by_pd_officer"]?.signature_of_the_pd_officer || ""}</td>
                            </tr>
                        </table>
                    </div>
                </div>

            </body>
    </html>
    `;
};
