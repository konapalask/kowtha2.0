// import { AxisFinanceUBLInterface } from '../interface/axis-finance-ubl.interface';
// import { PDFFormDefinition, PDFSectionDefinition, loadPDFormsSchema, getFormById } from '../schema/pd-schema';

// type AnyObject = Record<string, any>;

// function pick(obj: AnyObject | undefined, key: string, defaultValue: any = ''): any {
//   if (!obj) return defaultValue;
//   const val = obj[key];
//   return val === undefined || val === null ? defaultValue : val;
// }

// // Map schema-driven data (snake_case) to AxisFinanceUBLInterface (camelCase keys expected by existing template)
// export function mapAxisUBLFromSchema(formId: string, data: AnyObject): AxisFinanceUBLInterface {
//   const form = getFormById(formId);
//   if (!form) {
//     throw new Error(`Form not found for id: ${formId}`);
//   }

//   // Flatten sections into a map for convenience
//   const sectionById: Record<string, PDFSectionDefinition> = {};
//   form.sections.forEach(sec => { sectionById[sec.id] = sec; });

//   // Basic details
//   const general = data['general'] || {};
//   const visitedAddress = data['visited_address'] || {};
//   const structureOfLoan = data['structure_of_loan'] || {};

//   const basicDetails = {
//     region: pick(general, 'region', ''),
//     location: pick(general, 'location', ''),
//     branch: pick(general, 'branch', ''),
//     applicantName: pick(general, 'name_of_the_applicant', ''),
//     nameOfConcern: pick(general, 'name_of_concern', ''),
//     constitution: pick(general, 'constitution', ''),
//     initiatedAddress: pick(general, 'pd_initiated_address', ''),
//     visitedAddress: pick(visitedAddress, 'visited_address', ''),
//     phoneNo: pick(visitedAddress, 'phone_no', ''),
//     appointmentFixed: pick(visitedAddress, 'appointment_fixed', ''),
//     structureOfLoan: pick(structureOfLoan, 'structure_of_loan', ''),
//     noOfVisit: pick(structureOfLoan, 'no_of_visit', ''),
//     personMet: pick(structureOfLoan, 'person_met', ''),
//     aboutApplicant: pick(structureOfLoan, 'about_applicantdescriptive_section', ''),
//     residentialDetails: pick(general, 'residential_details', ''),
//     coApplicantDetails: pick(general, 'co_applicant_details', ''),
//   };

//   // Family details (repeater)
//   const familyDetailsSection = data['family_details'] || {};
//   const familyDetailsRows: AnyObject[] = Array.isArray(familyDetailsSection?.rows)
//     ? familyDetailsSection.rows
//     : Array.isArray(familyDetailsSection) ? familyDetailsSection : [];
//   const familyDetails = familyDetailsRows.map((row: AnyObject) => ({
//     name: pick(row, 'name', ''),
//     relation: pick(row, 'relation_with_applicant', ''),
//     age: pick(row, 'age_yrs', ''),
//     educationalQualification: pick(row, 'qualification', ''),
//     employmentType: pick(row, 'occupation', ''),
//     stayingWithApplicant: pick(row, 'staying_with_applicant', ''),
//     mobileNumber: pick(row, 'mobile_number', ''),
//     otherRelation: pick(row, 'other_relation', ''),
//   }));

//   // Suppliers/Creditors
//   const suppliersCreditors = {
//     numberOfFixedSuppliers: pick(data['document_type'], 'no_of_fixed_suppliers', ''),
//     creditPeriod: pick(data['document_type'], 'credit_period', ''),
//     cashChequeProportions: pick(data['document_type'], 'cash-cheque_proportion', ''),
//     suppliers: (() => {
//       const sec = data['document_type'] || {};
//       const rows: AnyObject[] = Array.isArray(sec?.suppliers) ? sec.suppliers : Array.isArray(sec?.rows) ? sec.rows : [];
//       return rows.map((row: AnyObject) => ({
//         name: pick(row, 'name', pick(sec, 'name_top_3_suppliers', '')),
//         phone: pick(row, 'phone', ''),
//         review: pick(row, 'review', ''),
//         location: pick(row, 'location', pick(sec, 'location', '')),
//       }));
//     })(),
//   };

//   // Clients/Debtors
//   const clientsDebtors = {
//     numberOfFixedCustomers: pick(data['contact_details'], 'no_of_fixed_customers', ''),
//     creditPeriod: pick(data['contact_details'], 'credit_period_2', ''),
//     cashChequeProportions: pick(data['contact_details'], 'cash-cheque_proportion_2', ''),
//     averageStockMaintenance: pick(data['clients_debtors'], 'average_stock_maintenance', ''),
//     turnover: pick(data['clients_debtors'], 'turnover', ''),
//     netMargins: pick(data['clients_debtors'], 'net_margins', ''),
//     customers: (() => {
//       const sec = data['contact_details'] || {};
//       const rows: AnyObject[] = Array.isArray(sec?.customers) ? sec.customers : Array.isArray(sec?.rows) ? sec.rows : [];
//       return rows.map((row: AnyObject) => ({
//         name: pick(row, 'name', pick(sec, 'name_top_3_customers', '')),
//         phone: pick(row, 'phone', ''),
//         review: pick(row, 'review', ''),
//         location: pick(row, 'location', pick(sec, 'location_2', '')),
//       }));
//     })(),
//   };

//   // Salaries & Wages
//   const salariesWages = {
//     numberOfEmployees: pick(data['salaries_wages'], 'no_of_employees', ''),
//     salaryPerMonthPerEmployee: pick(data['salaries_wages'], 'salary_per_month_per_employee', ''),
//     statusOfEmployee: pick(data['salaries_wages'], 'status_of_employee', ''),
//     numberOfLabours: pick(data['salaries_wages'], 'number_of_labours', ''),
//     wagesPerMonthPerDay: pick(data['salaries_wages'], 'wages_per_month_per_day', ''),
//     statusOfLabour: pick(data['salaries_wages'], 'status_of_labour', ''),
//     workingHoursStart: pick(data['salaries_wages'], 'working_hours_start', ''),
//     workingHoursEnd: pick(data['salaries_wages'], 'working_hours_end', ''),
//     otherMajorExpenditure: pick(data['salaries_wages'], 'other_major_expenditure', ''),
//     remarks: pick(data['salaries_wages'], 'remarks', ''),
//   };

//   // Asset Details
//   const assetDetails = {
//     assets: (() => {
//       const sec = data['asset_details'] || {};
//       const rows: AnyObject[] = Array.isArray(sec?.rows) ? sec.rows : Array.isArray(sec?.assets) ? sec.assets : [];
//       return rows.map((row: AnyObject) => ({
//         address: pick(row, 'address', ''),
//         areaMeasured: pick(row, 'area_measured_in_sqft', ''),
//         purchaseCost: pick(row, 'purchase_cost_in_lakhs', ''),
//         purchaseYear: pick(row, 'purchase_year', ''),
//         marketValue: pick(row, 'market_value_in_lakhs', ''),
//         ownerName: pick(row, 'owner_name', ''),
//         mortgaged: pick(row, 'mortgaged', ''),
//       }));
//     })(),
//     liquidMoveableMonetaryItems: pick(data['any_liquid_moveable_monetary_items'], 'any_liquid_moveable_monetary_items_such_as_cashgold_fd_rd_mutual_fund_holdings_shares_bondssecurities', ''),
//     lifeInsuranceMediclaim: pick(data['life_insurance_mediclaim_propertyasset_insurancepremium_sum_assured'], 'life_insurance_mediclaim_propertyasset_insurancepremium_sum_assured', ''),
//     capitalInvestedBusiness: pick(data['capital_invested_in_any_business_loans_advances_given'], 'capital_invested_in_any_business_loans_advances_given', ''),
//     vehicles: pick(data['car_bike_and_any_other_vehicle_company_name_and_model'], 'car_bike_and_any_other_vehicle_company_name_and_model', ''),
//     observations: pick(data['observations'], 'observations', ''),
//     siteCoordinates: pick(data['site_coordinates'], 'site_coordinates', ''),
//     otherIncome: pick(data['other_income'], 'other_income', ''),
//     remarks: pick(data['remarks'], 'remarks', ''),
//     status: pick(data['status'], 'status', ''),
//   };

//   // Existing Loans
//   const existingLoansSec = data['existing_loans'] || {};
//   const existingLoansRows: AnyObject[] = Array.isArray(existingLoansSec?.rows) ? existingLoansSec.rows : Array.isArray(existingLoansSec?.loans) ? existingLoansSec.loans : [];
//   const existingLoans = {
//     loans: existingLoansRows.map((row: AnyObject) => ({
//       bankName: pick(row, 'bank_name', ''),
//       purpose: pick(row, 'purpose', ''),
//       loanAmount: pick(row, 'loan_amount', ''),
//       emi: pick(row, 'emi', ''),
//       tenure: pick(row, 'tenure', ''),
//     })),
//   };

//   // Shareholding
//   const shareholdingSec = data['constitution_shareholding_details'] || {};
//   const shareholdingRows: AnyObject[] = Array.isArray(shareholdingSec?.rows) ? shareholdingSec.rows : Array.isArray(shareholdingSec?.shareholders) ? shareholdingSec.shareholders : [];
//   const shareholdingDetails = {
//     shareholders: shareholdingRows.map((row: AnyObject) => ({
//       name: pick(row, 'name_of_the_shareholder', ''),
//       shareholdingPercentage: pick(row, 'of_shareholding', ''),
//       relationshipWithApplicant: pick(row, 'relation_with_main_applicant', ''),
//       designation: pick(row, 'designation', ''),
//       comingIntoLoanStructure: pick(row, 'coming_into_loan_structure', ''),
//       functionalOfPartnerDirector: pick(row, 'functional_of_partner_director', ''),
//     })),
//   };

//   // Third Party Check
//   const thirdPartyCheckSec = data['third_party_check'] || {};
//   const tpcRows: AnyObject[] = Array.isArray(thirdPartyCheckSec?.rows) ? thirdPartyCheckSec.rows : Array.isArray(thirdPartyCheckSec?.checks) ? thirdPartyCheckSec.checks : [];
//   const thirdPartyCheck = {
//     checks: tpcRows.map((row: AnyObject) => ({
//       tpcName: pick(row, 'name_of_the_person', ''),
//       mobileNumber: pick(row, 'mobile_number', ''),
//       relationship: pick(row, 'relationship', ''),
//       comments: pick(row, 'comments', ''),
//       feedbackStatus: pick(row, 'feedback_status', ''),
//       otherRelation: pick(row, 'other_relation', ''),
//     })),
//   };

//   // Additional Details (free form list)
//   const additionalDetails = {
//     details: ((sec: AnyObject) => {
//       const rows: AnyObject[] = Array.isArray(sec?.rows) ? sec.rows : [];
//       return rows.map((row: AnyObject) => ({ value: pick(row, 'value', '') }));
//     })(data['additional_details'] || {}),
//   };

//   const uploadedItems = Array.isArray(data?.uploaded_items) ? data.uploaded_items : (data?.uploadedItems || []);

//   const mapped: AxisFinanceUBLInterface = {
//     basicDetails,
//     familyDetails,
//     shareholdingDetails,
//     suppliersCreditors,
//     clientsDebtors,
//     salariesWages,
//     assetDetails,
//     existingLoans,
//     thirdPartyCheck,
//     additionalDetails,
//     uploadedItems,
//   };

//   return mapped;
// }

// // Legacy passthrough: if data already matches AxisFinanceUBLInterface, return it
// export function mapAxisUBL(data: AnyObject): AxisFinanceUBLInterface {
//   const looksLikeLegacy = data?.basicDetails && data?.existingLoans && data?.salariesWages;
//   if (looksLikeLegacy) return data as AxisFinanceUBLInterface;
//   // Default to schema-driven mapping for the selected form
//   const formId = 'axis_finance_ubl_above_10l';
//   return mapAxisUBLFromSchema(formId, data);
// }


