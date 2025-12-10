import { useTabContext } from "@/pages/verify/[id]";
import { EditFormModalProps } from "@/utils/verifierInterface";
import { Form, message, Modal, Row } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormSelector } from "./VerificationEditForms";
import { updateFinancialAnalysis } from "@/services/verifier.services";
import { useDepartmentChange } from "@/utils/utility";
import _ from "lodash";

const formKeyMapping: Record<string, string> = {
  businessBasicDetails: "basicDetails",
  workBasicDetails: "basicDetails",
  toGrossProfit: "toGrossProfit",
  toNetProfit: "toNetProfit",
  // PD department specific mappings
  applicantDetails: "applicantDetails",
  familyDetails: "familyMemberDetails",
};

type FinancialSchemaFormat = "generic" | "statement2" | "statement3" | "statement4";

const detectFinancialSchemaFormat = (values: Record<string, any>): FinancialSchemaFormat => {
  const keys = Object.keys(values).map(k => k.toLowerCase());
  
  if (
    keys.some(k => 
      k.includes("grossreceipts") || 
      k.includes("costofmaterialconsumed") ||
      k.includes("grossprofitasperassumption") ||
      k.includes("pbdit")
    )
  ) {
    return "statement2";
  }
  
  if (
    keys.some(k => 
      k.includes("_2023") || 
      k.includes("_2024") ||
      k.includes("2023") ||
      k.includes("2024")
    )
  ) {
    return "statement3";
  }
  
  if (
    keys.some(k => 
      k.includes("assessed") || 
      k.includes("audited") ||
      k.includes("estimated") && (k.includes("openingstock") || k.includes("purchases"))
    )
  ) {
    return "statement4";
  }
  
  return "generic";
};

const parseNumber = (raw: any): number => {
  if (raw === undefined || raw === null) return 0;
  const cleaned = typeof raw === "string" ? raw.replace(/,/g, "").trim() : raw;
  const num = parseFloat(cleaned as any);
  return isNaN(num) ? 0 : num;
};

const getFormValue = (values: Record<string, any>, formField: string, schemaField: string): number => {
  return parseNumber(values[formField] ?? values[schemaField] ?? 0);
};

const calculateGenericFormat = (values: Record<string, any>) => {
  const openingStock = getFormValue(values, "toOpeningStock", "openingStock");
  const purchase = getFormValue(values, "toPurchase", "purchase");
  const costOfServices = getFormValue(values, "toCostOfServices", "costOfServices");
  const wages = getFormValue(values, "toWages", "wages");
  const hamaliCharges = getFormValue(values, "toHamaliCharges", "hamaliCharges");
  const manufacturingExpenses = getFormValue(values, "toManufacturingExpenses", "manufacturingExpenses");
  const packingCharges = getFormValue(values, "toPackingCharges", "packingCharges");
  const sales = getFormValue(values, "bySales", "sales");
  const services = getFormValue(values, "byServices", "services");
  const closingStock = getFormValue(values, "byClosingStock", "closingStock");
  const salaries = getFormValue(values, "toSalaries", "salaries");
  const rent = getFormValue(values, "toRent", "rent");
  const electricityCharges = getFormValue(values, "toElectricityCharges", "electricityCharges");
  const printingStationery = getFormValue(values, "toPrintingStationery", "printingStationery");
  const telephoneCharges = getFormValue(values, "toTelephoneCharges", "telephoneCharges");
  const postageTelegram = getFormValue(values, "toPostageTelegram", "postageTelegram");
  const officeMaintenance = getFormValue(values, "toOfficeMaintenance", "officeMaintenance");
  const repairsMaintenance = getFormValue(values, "toRepairsMaintenance", "repairsMaintenance");
  const sadarExpenses = getFormValue(values, "toSadarExpenses", "sadarExpenses");
  const auditFee = getFormValue(values, "toAuditFee", "auditFee");
  const advertisement = getFormValue(values, "toAdvertisement", "advertisement");
  const bankCharges = getFormValue(values, "toBankCharges", "bankCharges");
  const insurance = getFormValue(values, "toInsurance", "insurance");
  const depreciation = getFormValue(values, "toDepreciation", "depreciation");
  const interestOnLoan = getFormValue(values, "toInterestOnLoan", "interestOnLoan");
  const rentReceived = getFormValue(values, "byRentReceived", "rentReceived");
  const commissionReceived = getFormValue(values, "byCommissionReceived", "commissionReceived");

  const grossProfit =
    sales +
    services +
    closingStock -
    (openingStock +
      purchase +
      costOfServices +
      wages +
      hamaliCharges +
      manufacturingExpenses +
      packingCharges);

  const indirectExpenses =
    salaries +
    rent +
    electricityCharges +
    printingStationery +
    telephoneCharges +
    postageTelegram +
    officeMaintenance +
    repairsMaintenance +
    sadarExpenses +
    auditFee +
    advertisement +
    bankCharges +
    insurance +
    depreciation +
    interestOnLoan;
  const otherIncomes = rentReceived + commissionReceived;
  const netProfit = grossProfit + otherIncomes - indirectExpenses;

  return {
    openingStock,
    purchase,
    costOfServices,
    wages,
    hamaliCharges,
    manufacturingExpenses,
    packingCharges,
    sales,
    services,
    closingStock,
    salaries,
    rent,
    electricityCharges,
    printingStationery,
    telephoneCharges,
    postageTelegram,
    officeMaintenance,
    repairsMaintenance,
    sadarExpenses,
    auditFee,
    advertisement,
    bankCharges,
    insurance,
    depreciation,
    interestOnLoan,
    rentReceived,
    commissionReceived,
    grossProfit,
    netProfit,
  };
};

const calculateStatement2Format = (values: Record<string, any>) => {
  const grossReceipts = parseNumber(values.grossReceipts);
  const otherIncome = parseNumber(values.otherIncome);
  const costOfMaterialConsumed = parseNumber(values.costOfMaterialConsumed);
  const salary = parseNumber(values.salary);
  const rent = parseNumber(values.rent);
  const electricity = parseNumber(values.electricity);
  const travelling = parseNumber(values.travelling);
  const otherExpenses = parseNumber(values.otherExpenses);
  const financeExpenses = parseNumber(values.financeExpenses);
  const depreciation = parseNumber(values.depreciation);
  const incomeTax = parseNumber(values.incomeTax);

  const incomeSubtotal = grossReceipts + otherIncome;
  const expenditureSubtotal = salary + rent + electricity + travelling + otherExpenses;
  const grossProfitAsPerAssumption = incomeSubtotal - costOfMaterialConsumed;
  const netProfitBeforeInterestTaxDepreciation = incomeSubtotal - expenditureSubtotal;
  const netProfitBeforeTaxDepreciation = netProfitBeforeInterestTaxDepreciation - financeExpenses;
  const netProfitBeforeTax = netProfitBeforeTaxDepreciation - depreciation;
  const netProfitAfterTax = netProfitBeforeTax - incomeTax;
  const pbditMargin =
    incomeSubtotal !== 0
      ? (netProfitBeforeInterestTaxDepreciation / incomeSubtotal) * 100
      : 0;

  return {
    grossReceipts,
    otherIncome,
    incomeSubtotal,
    costOfMaterialConsumed,
    grossProfitAsPerAssumption,
    salary,
    rent,
    electricity,
    travelling,
    otherExpenses,
    expenditureSubtotal,
    netProfitBeforeInterestTaxDepreciation,
    pbditMargin,
    financeExpenses,
    netProfitBeforeTaxDepreciation,
    depreciation,
    netProfitBeforeTax,
    incomeTax,
    netProfitAfterTax,
  };
};

const calculateStatement3Format = (values: Record<string, any>) => {
  const getValue = (key: string) => parseNumber(values[key]);
  const round2 = (num: number) => Math.round(num * 100) / 100;

  // 2023 Actuals
  const openingStock_2023 = getValue("openingStock_2023");
  const purchases_2023 = getValue("purchases_2023");
  const gasLiquidItems_2023 = getValue("gasLiquidItems_2023");
  const sales_2023 = getValue("sales_2023");
  const majuriCharges_2023 = getValue("majuriCharges_2023");
  const closingStock_2023 = getValue("closingStock_2023");
  
  const salaries_2023 = getValue("salaries_2023");
  const bonus_2023 = getValue("bonus_2023");
  const electricityCharges_2023 = getValue("electricityCharges_2023");
  const sadar_2023 = getValue("sadar_2023");
  const coalGasLiquid_2023 = getValue("coalGasLiquid_2023");
  const sparesMachinery_2023 = getValue("sparesMachinery_2023");
  const bankInterest_2023 = getValue("bankInterest_2023");
  const bankCharges_2023 = getValue("bankCharges_2023");
  const financeCharges_2023 = getValue("financeCharges_2023");
  const shopRents_2023 = getValue("shopRents_2023");
  const gstLateFee_2023 = getValue("gstLateFee_2023");
  const auditorFee_2023 = getValue("auditorFee_2023");
  const telephoneCharges_2023 = getValue("telephoneCharges_2023");
  const travellingExp_2023 = getValue("travellingExp_2023");
  const vehicleMaintenance_2023 = getValue("vehicleMaintenance_2023");
  const depreciation_2023 = getValue("depreciation_2023");
  const interest_2023 = getValue("interest_2023");

  // 2024 Actuals
  const openingStock_2024 = getValue("openingStock_2024");
  const purchases_2024 = getValue("purchases_2024");
  const gasLiquidItems_2024 = getValue("gasLiquidItems_2024");
  const sales_2024 = getValue("sales_2024");
  const majuriCharges_2024 = getValue("majuriCharges_2024");
  const closingStock_2024 = getValue("closingStock_2024");
  
  const salaries_2024 = getValue("salaries_2024");
  const bonus_2024 = getValue("bonus_2024");
  const electricityCharges_2024 = getValue("electricityCharges_2024");
  const sadar_2024 = getValue("sadar_2024");
  const coalGasLiquid_2024 = getValue("coalGasLiquid_2024");
  const sparesMachinery_2024 = getValue("sparesMachinery_2024");
  const bankInterest_2024 = getValue("bankInterest_2024");
  const bankCharges_2024 = getValue("bankCharges_2024");
  const financeCharges_2024 = getValue("financeCharges_2024");
  const shopRents_2024 = getValue("shopRents_2024");
  const gstLateFee_2024 = getValue("gstLateFee_2024");
  const auditorFee_2024 = getValue("auditorFee_2024");
  const telephoneCharges_2024 = getValue("telephoneCharges_2024");
  const travellingExp_2024 = getValue("travellingExp_2024");
  const vehicleMaintenance_2024 = getValue("vehicleMaintenance_2024");
  const depreciation_2024 = getValue("depreciation_2024");
  const interest_2024 = getValue("interest_2024");

  // Estimated
  const openingStockEstimated = getValue("openingStockEstimated");
  const purchasesEstimated = getValue("purchasesEstimated");
  const gasLiquidItemsEstimated = getValue("gasLiquidItemsEstimated");
  const salesEstimated = getValue("salesEstimated");
  const majuriChargesEstimated = getValue("majuriChargesEstimated");
  const closingStockEstimated = getValue("closingStockEstimated");

  const salariesEstimated = getValue("salariesEstimated");
  const bonusEstimated = getValue("bonusEstimated");
  const electricityChargesEstimated = getValue("electricityChargesEstimated");
  const sadarEstimated = getValue("sadarEstimated");
  const coalGasLiquidEstimated = getValue("coalGasLiquidEstimated");
  const sparesMachineryEstimated = getValue("sparesMachineryEstimated");
  const bankInterestEstimated = getValue("bankInterestEstimated");
  const bankChargesEstimated = getValue("bankChargesEstimated");
  const financeChargesEstimated = getValue("financeChargesEstimated");
  const shopRentsEstimated = getValue("shopRentsEstimated");
  const gstLateFeeEstimated = getValue("gstLateFeeEstimated");
  const auditorFeeEstimated = getValue("auditorFeeEstimated");
  const telephoneChargesEstimated = getValue("telephoneChargesEstimated");
  const travellingExpEstimated = getValue("travellingExpEstimated");
  const vehicleMaintenanceEstimated = getValue("vehicleMaintenanceEstimated");
  const depreciationEstimated = getValue("depreciationEstimated");
  const interestEstimated = getValue("interestEstimated");

  // Always compute GP from current inputs
  const grossProfit_2023 =
    sales_2023 +
    closingStock_2023 +
    majuriCharges_2023 -
    (openingStock_2023 + purchases_2023 + gasLiquidItems_2023);
  
  const grossProfit_2024 =
    sales_2024 +
    closingStock_2024 +
    majuriCharges_2024 -
    (openingStock_2024 + purchases_2024 + gasLiquidItems_2024);
  
  const grossProfitEstimated =
    salesEstimated +
    closingStockEstimated +
    majuriChargesEstimated -
    (openingStockEstimated + purchasesEstimated + gasLiquidItemsEstimated);

  const netProfit_2023 =
    grossProfit_2023 -
    (salaries_2023 +
      bonus_2023 +
      electricityCharges_2023 +
      sadar_2023 +
      coalGasLiquid_2023 +
      sparesMachinery_2023 +
      bankInterest_2023 +
      bankCharges_2023 +
      financeCharges_2023 +
      shopRents_2023 +
      gstLateFee_2023 +
      auditorFee_2023 +
      telephoneCharges_2023 +
      travellingExp_2023 +
      vehicleMaintenance_2023 +
      depreciation_2023 +
      interest_2023);

  const netProfit_2024 =
    grossProfit_2024 -
    (salaries_2024 +
      bonus_2024 +
      electricityCharges_2024 +
      sadar_2024 +
      coalGasLiquid_2024 +
      sparesMachinery_2024 +
      bankInterest_2024 +
      bankCharges_2024 +
      financeCharges_2024 +
      shopRents_2024 +
      gstLateFee_2024 +
      auditorFee_2024 +
      telephoneCharges_2024 +
      travellingExp_2024 +
      vehicleMaintenance_2024 +
      depreciation_2024 +
      interest_2024);

  const netProfitEstimated =
    grossProfitEstimated -
    (salariesEstimated +
      bonusEstimated +
      electricityChargesEstimated +
      sadarEstimated +
      coalGasLiquidEstimated +
      sparesMachineryEstimated +
      bankInterestEstimated +
      bankChargesEstimated +
      financeChargesEstimated +
      shopRentsEstimated +
      gstLateFeeEstimated +
      auditorFeeEstimated +
      telephoneChargesEstimated +
      travellingExpEstimated +
      vehicleMaintenanceEstimated +
      depreciationEstimated +
      interestEstimated);

  // Change % calculations
  const calculateChange = (val2024: number, val2023: number) => 
    val2023 !== 0 ? round2(((val2024 - val2023) / val2023) * 100) : 0;

  const openingStockChange = calculateChange(openingStock_2024, openingStock_2023);
  const purchasesChange = calculateChange(purchases_2024, purchases_2023);
  const gasLiquidItemsChange = calculateChange(gasLiquidItems_2024, gasLiquidItems_2023);
  const salesChange = calculateChange(sales_2024, sales_2023);
  const majuriChargesChange = calculateChange(majuriCharges_2024, majuriCharges_2023);
  const closingStockChange = calculateChange(closingStock_2024, closingStock_2023);
  const grossProfitChange = calculateChange(grossProfit_2024, grossProfit_2023);
  const netProfitChange = calculateChange(netProfit_2024, netProfit_2023);
  
  const salariesChange = calculateChange(salaries_2024, salaries_2023);
  const bonusChange = calculateChange(bonus_2024, bonus_2023);
  const electricityChargesChange = calculateChange(electricityCharges_2024, electricityCharges_2023);
  const sadarChange = calculateChange(sadar_2024, sadar_2023);
  const coalGasLiquidChange = calculateChange(coalGasLiquid_2024, coalGasLiquid_2023);
  const sparesMachineryChange = calculateChange(sparesMachinery_2024, sparesMachinery_2023);
  const bankInterestChange = calculateChange(bankInterest_2024, bankInterest_2023);
  const bankChargesChange = calculateChange(bankCharges_2024, bankCharges_2023);
  const financeChargesChange = calculateChange(financeCharges_2024, financeCharges_2023);
  const shopRentsChange = calculateChange(shopRents_2024, shopRents_2023);
  const gstLateFeeChange = calculateChange(gstLateFee_2024, gstLateFee_2023);
  const auditorFeeChange = calculateChange(auditorFee_2024, auditorFee_2023);
  const telephoneChargesChange = calculateChange(telephoneCharges_2024, telephoneCharges_2023);
  const travellingExpChange = calculateChange(travellingExp_2024, travellingExp_2023);
  const vehicleMaintenanceChange = calculateChange(vehicleMaintenance_2024, vehicleMaintenance_2023);
  const depreciationChange = calculateChange(depreciation_2024, depreciation_2023);
  const interestChange = calculateChange(interest_2024, interest_2023);

 
  const total_2023_left =
    openingStock_2023 +
    purchases_2023 +
    gasLiquidItems_2023 +
    grossProfit_2023 +
    salaries_2023 +
    bonus_2023 +
    electricityCharges_2023 +
    sadar_2023 +
    coalGasLiquid_2023 +
    sparesMachinery_2023 +
    bankInterest_2023 +
    bankCharges_2023 +
    financeCharges_2023 +
    shopRents_2023 +
    gstLateFee_2023 +
    auditorFee_2023 +
    telephoneCharges_2023 +
    travellingExp_2023 +
    vehicleMaintenance_2023 +
    depreciation_2023 +
    interest_2023 +
    netProfit_2023;

  const total_2024_left =
    openingStock_2024 +
    purchases_2024 +
    gasLiquidItems_2024 +
    grossProfit_2024 +
    salaries_2024 +
    bonus_2024 +
    electricityCharges_2024 +
    sadar_2024 +
    coalGasLiquid_2024 +
    sparesMachinery_2024 +
    bankInterest_2024 +
    bankCharges_2024 +
    financeCharges_2024 +
    shopRents_2024 +
    gstLateFee_2024 +
    auditorFee_2024 +
    telephoneCharges_2024 +
    travellingExp_2024 +
    vehicleMaintenance_2024 +
    depreciation_2024 +
    interest_2024 +
    netProfit_2024;

  const total_estimated_left =
    openingStockEstimated +
    purchasesEstimated +
    gasLiquidItemsEstimated +
    grossProfitEstimated +
    salariesEstimated +
    bonusEstimated +
    electricityChargesEstimated +
    sadarEstimated +
    coalGasLiquidEstimated +
    sparesMachineryEstimated +
    bankInterestEstimated +
    bankChargesEstimated +
    financeChargesEstimated +
    shopRentsEstimated +
    gstLateFeeEstimated +
    auditorFeeEstimated +
    telephoneChargesEstimated +
    travellingExpEstimated +
    vehicleMaintenanceEstimated +
    depreciationEstimated +
    interestEstimated +
    netProfitEstimated;

  const total_2023_right =
    sales_2023 + majuriCharges_2023 + closingStock_2023 + grossProfit_2023;

  const total_2024_right =
    sales_2024 + majuriCharges_2024 + closingStock_2024 + grossProfit_2024;

  const total_estimated_right =
    salesEstimated + majuriChargesEstimated + closingStockEstimated + grossProfitEstimated;


  const monthlyTurnover = round2(salesEstimated / 12);

  const totalEstimatedExpenses =
    salariesEstimated + bonusEstimated + electricityChargesEstimated + sadarEstimated + 
    coalGasLiquidEstimated + sparesMachineryEstimated + bankInterestEstimated + 
    bankChargesEstimated + financeChargesEstimated + shopRentsEstimated + 
    gstLateFeeEstimated + auditorFeeEstimated + telephoneChargesEstimated + 
    travellingExpEstimated + vehicleMaintenanceEstimated + depreciationEstimated + 
    interestEstimated;

  const monthlyPayments = round2(totalEstimatedExpenses / 12);

  const monthlyNetProfit = round2(netProfitEstimated / 12);


  const gpPercentage =
    salesEstimated !== 0
      ? round2((grossProfitEstimated / salesEstimated) * 100)
      : 0;

  const npPercentage =
    salesEstimated !== 0
      ? round2((netProfitEstimated / salesEstimated) * 100)
      : 0;

  return {
    ...values,
    openingStock_2023,
    purchases_2023,
    gasLiquidItems_2023,
    sales_2023,
    majuriCharges_2023,
    closingStock_2023,
    grossProfit_2023,
    netProfit_2023,
    salaries_2023,
    bonus_2023,
    electricityCharges_2023,
    sadar_2023,
    coalGasLiquid_2023,
    sparesMachinery_2023,
    bankInterest_2023,
    bankCharges_2023,
    financeCharges_2023,
    shopRents_2023,
    gstLateFee_2023,
    auditorFee_2023,
    telephoneCharges_2023,
    travellingExp_2023,
    vehicleMaintenance_2023,
    depreciation_2023,
    interest_2023,
    // 2024 Actuals
    openingStock_2024,
    purchases_2024,
    gasLiquidItems_2024,
    sales_2024,
    majuriCharges_2024,
    closingStock_2024,
    grossProfit_2024,
    netProfit_2024,
    salaries_2024,
    bonus_2024,
    electricityCharges_2024,
    sadar_2024,
    coalGasLiquid_2024,
    sparesMachinery_2024,
    bankInterest_2024,
    bankCharges_2024,
    financeCharges_2024,
    shopRents_2024,
    gstLateFee_2024,
    auditorFee_2024,
    telephoneCharges_2024,
    travellingExp_2024,
    vehicleMaintenance_2024,
    depreciation_2024,
    interest_2024,
    // Changes
    openingStockChange,
    purchasesChange,
    gasLiquidItemsChange,
    salesChange,
    majuriChargesChange,
    closingStockChange,
    grossProfitChange,
    netProfitChange,
    salariesChange,
    bonusChange,
    electricityChargesChange,
    sadarChange,
    coalGasLiquidChange,
    sparesMachineryChange,
    bankInterestChange,
    bankChargesChange,
    financeChargesChange,
    shopRentsChange,
    gstLateFeeChange,
    auditorFeeChange,
    telephoneChargesChange,
    travellingExpChange,
    vehicleMaintenanceChange,
    depreciationChange,
    interestChange,
    // Estimated
    openingStockEstimated,
    purchasesEstimated,
    gasLiquidItemsEstimated,
    salesEstimated,
    majuriChargesEstimated,
    closingStockEstimated,
    grossProfitEstimated,
    netProfitEstimated,
    salariesEstimated,
    bonusEstimated,
    electricityChargesEstimated,
    sadarEstimated,
    coalGasLiquidEstimated,
    sparesMachineryEstimated,
    bankInterestEstimated,
    bankChargesEstimated,
    financeChargesEstimated,
    shopRentsEstimated,
    gstLateFeeEstimated,
    auditorFeeEstimated,
    telephoneChargesEstimated,
    travellingExpEstimated,
    vehicleMaintenanceEstimated,
    depreciationEstimated,
    interestEstimated,
    // Totals
    total_2023_left,
    total_2024_left,
    total_estimated_left,
    total_2023_right,
    total_2024_right,
    total_estimated_right,
    // Monthly
    monthlyTurnover,
    monthlyPayments,
    monthlyNetProfit,
    gpPercentage,
    npPercentage,
  };
};

const calculateStatement4Format = (values: Record<string, any>) => {
  const getValue = (key: string) => parseNumber(values[key]);

  const openingStockAssessed = getValue("openingStockAssessed");
  const purchasesAssessed = getValue("purchasesAssessed");
  const salesEstimated = getValue("salesEstimated");
  const servicesEstimated = getValue("servicesEstimated");
  const closingStockEstimated = getValue("closingStockEstimated");

  const salesPlusServices = salesEstimated + servicesEstimated;
  const grossProfitAssessed =
    salesPlusServices -
    (openingStockAssessed + purchasesAssessed - closingStockEstimated);

  const electricity = getValue("electricity");
  const rent = getValue("rent");
  const salaries = getValue("salaries");
  const travellingCharges = getValue("travellingCharges");
  const otherExpenses = getValue("otherExpenses");

  const grandTotalExpenditure =
    openingStockAssessed + purchasesAssessed + grossProfitAssessed;
  const grandTotalIncome = salesPlusServices + closingStockEstimated;
  const byGrossProfitEstimated = grossProfitAssessed;
  const netProfit =
    grossProfitAssessed -
    (electricity + rent + salaries + travellingCharges + otherExpenses);

  const grandTotal = grandTotalExpenditure;

  const safeDiv = (num: number, denom: number) =>
    denom === 0 ? 0 : (num / denom) * 100;
  const round2 = (num: number) => Math.round(num * 100) / 100;

  const gpMargin = round2(safeDiv(grossProfitAssessed, salesPlusServices));
  const npMargin = round2(safeDiv(netProfit, salesPlusServices));
  const netProfitMargin = npMargin;
  const gpMarginPercent = gpMargin;
  const npMarginPercent = npMargin;
  const netProfitMarginPercent = netProfitMargin;
  return {
    ...values,
    openingStockAssessed,
    purchasesAssessed,
    grossProfitAssessed,
    salesEstimated,
    servicesEstimated,
    closingStockEstimated,
    electricity,
    rent,
    salaries,
    travellingCharges,
    otherExpenses,
    toGrossProfit: grossProfitAssessed,
    grandTotalExpenditure,
    grandTotalIncome,
    byGrossProfitEstimated,
    netProfit,
    netProfitEstimated: netProfit,
    grandTotal,
    netProfitMargin,
    gpMargin,
    npMargin,
    gpMarginPercent,
    npMarginPercent,
    netProfitMarginPercent,
  };
};

interface ExtendedEditFormModalProps extends EditFormModalProps {
  onEditSuccess?: () => void;
}

export const EditFormModal: React.FC<ExtendedEditFormModalProps> = ({
  visible,
  onCancel,
  formKey,
  initialValues,
  currentTab,
  fetchVerificationData,
  onEditSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { activeTab } = useTabContext();
  const currentDepartment = useDepartmentChange();
  // const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (visible && initialValues) {
      const currentVerification = initialValues?.verifications?.find(
        (v: any) => v.type === currentTab
      );

      // Handle financial analysis data differently since it's not nested under verificationData
      if (formKey === "financialAnalysis") {
        const financialData = currentVerification?.financialAnalysis;
        if (financialData) {
          const formValues = {
            toOpeningStock: financialData.openingStock?.toString() || "",
            toPurchase: financialData.purchase?.toString() || "",
            toCostOfServices: financialData.costOfServices?.toString() || "",
            toWages: financialData.wages?.toString() || "",
            toHamaliCharges: financialData.hamaliCharges?.toString() || "",
            toManufacturingExpenses:
              financialData.manufacturingExpenses?.toString() || "",
            toPackingCharges: financialData.packingCharges?.toString() || "",
            bySales: financialData.sales?.toString() || "",
            byServices: financialData.services?.toString() || "",
            byClosingStock: financialData.closingStock?.toString() || "",
            toSalaries: financialData.salaries?.toString() || "",
            toRent: financialData.rent?.toString() || "",
            toElectricityCharges:
              financialData.electricityCharges?.toString() || "",
            toPrintingStationery:
              financialData.printingStationery?.toString() || "",
            toTelephoneCharges:
              financialData.telephoneCharges?.toString() || "",
            toPostageTelegram: financialData.postageTelegram?.toString() || "",
            toOfficeMaintenance:
              financialData.officeMaintenance?.toString() || "",
            toRepairsMaintenance:
              financialData.repairsMaintenance?.toString() || "",
            toSadarExpenses: financialData.sadarExpenses?.toString() || "",
            toAuditFee: financialData.auditFee?.toString() || "",
            toAdvertisement: financialData.advertisement?.toString() || "",
            toBankCharges: financialData.bankCharges?.toString() || "",
            toInsurance: financialData.insurance?.toString() || "",
            toDepreciation: financialData.depreciation?.toString() || "",
            toInterestOnLoan: financialData.interestOnLoan?.toString() || "",
            byRentReceived: financialData.rentReceived?.toString() || "",
            byCommissionReceived:
              financialData.commissionReceived?.toString() || "",
          };
          form.setFieldsValue(formValues);
        }
      } else if (currentDepartment === "PD") {
        // Handle PD department data structure
        if (formKey === "applicantDetails") {
          const applicantData =
            currentVerification?.verificationData?.applicantDetails;
          if (applicantData) {
            form.setFieldsValue(applicantData);
          }
        } else if (formKey === "familyDetails") {
          const familyData =
            currentVerification?.verificationData?.familyMemberDetails ||
            currentVerification?.verificationData?.familyDetails;
          if (familyData) {
            form.setFieldsValue({ familyMemberDetails: familyData });
          }
        } else if (formKey === "businessBasicDetails") {
          const basicData = currentVerification?.verificationData?.basicDetails;
          if (basicData) {
            form.setFieldsValue(basicData);
          }
        } else if (formKey === "businessDetails") {
          const businessData =
            currentVerification?.verificationData?.businessDetails;
          if (businessData) {
            form.setFieldsValue(businessData);
          }
        } else if (formKey === "shareholdingDetails") {
          const shareData =
            currentVerification?.verificationData?.shareholdingDetails;
          if (shareData) {
            // Form expects { shareholders: [...] }
            form.setFieldsValue(shareData);
          }
        } else if (formKey === "suppliersCreditors") {
          const supData =
            currentVerification?.verificationData?.suppliersCreditors;
          if (supData) {
            form.setFieldsValue({ suppliersCreditors: supData });
          }
        } else if (formKey === "clientsDebtors") {
          const cliData = currentVerification?.verificationData?.clientsDebtors;
          if (cliData) {
            const customers = Array.isArray(cliData.customers)
              ? cliData.customers
              : [];
            const mappedCustomers = {
              customer1Name: customers[0]?.name,
              customer1Phone: customers[0]?.phone,
              customer1Location: customers[0]?.location,
              customer1Review: customers[0]?.review,
              customer2Name: customers[1]?.name,
              customer2Phone: customers[1]?.phone,
              customer2Location: customers[1]?.location,
              customer2Review: customers[1]?.review,
              customer3Name: customers[2]?.name,
              customer3Phone: customers[2]?.phone,
              customer3Location: customers[2]?.location,
              customer3Review: customers[2]?.review,
            };
            form.setFieldsValue({
              clientsDebtors: { ...cliData, ...mappedCustomers },
            });
          }
        } else if (formKey === "salariesWages") {
          const salData = currentVerification?.verificationData?.salariesWages;
          if (salData) {
            form.setFieldsValue({ salariesWages: salData });
          }
        } else if (formKey === "documentsObserved") {
          const docData =
            currentVerification?.verificationData?.documentsObserved;
          if (docData) {
            form.setFieldsValue({ documentsObserved: docData });
          }
          // Tata UBL specific form handling
        } else if (
          formKey === "basicDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const basicData = currentVerification?.verificationData?.basicDetails;
          if (basicData) {
            form.setFieldsValue({ basicDetails: basicData });
          }
        } else if (
          formKey === "proposedLoanDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const loanData =
            currentVerification?.verificationData?.proposedLoanDetails;
          if (loanData) {
            form.setFieldsValue({ proposedLoanDetails: loanData });
          }
        } else if (
          formKey === "officeAddress" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const officeData =
            currentVerification?.verificationData?.officeAddress;
          if (officeData) {
            form.setFieldsValue({ officeAddress: officeData });
          }
        } else if (
          formKey === "residentialAddress" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const resData =
            currentVerification?.verificationData?.residentialAddress;
          if (resData) {
            form.setFieldsValue({ residentialAddress: resData });
          }
        } else if (
          formKey === "employeeDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const empData =
            currentVerification?.verificationData?.employeeDetails;
          if (empData) {
            form.setFieldsValue({ employeeDetails: empData });
          }
        } else if (
          formKey === "bankDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const bankData = currentVerification?.verificationData?.bankDetails;
          if (bankData) {
            form.setFieldsValue({ bankDetails: bankData });
          }
        } else if (
          formKey === "salesAndProfitDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const salesData =
            currentVerification?.verificationData?.salesAndProfitDetails;
          if (salesData) {
            form.setFieldsValue({ salesAndProfitDetails: salesData });
          }
        } else if (
          formKey === "customersDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const custData =
            currentVerification?.verificationData?.customersDetails;
          if (custData) {
            form.setFieldsValue({ customersDetails: custData });
          }
        } else if (
          formKey === "supplierDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const suppData =
            currentVerification?.verificationData?.supplierDetails;
          if (suppData) {
            form.setFieldsValue({ supplierDetails: suppData });
          }
        } else if (
          formKey === "additionalBusinessDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const addBizData =
            currentVerification?.verificationData?.additionalBusinessDetails;
          if (addBizData) {
            form.setFieldsValue({ additionalBusinessDetails: addBizData });
          }
        } else if (
          formKey === "existingLoans" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const loanData = currentVerification?.verificationData?.existingLoans;
          if (loanData) {
            form.setFieldsValue({ existingLoans: loanData });
          }
        } else if (
          formKey === "miscelleanousDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const miscData =
            currentVerification?.verificationData?.miscelleanousDetails;
          if (miscData) {
            form.setFieldsValue({ miscelleanousDetails: miscData });
          }
        } else if (
          formKey === "valueAddedDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const valueData =
            currentVerification?.verificationData?.valueAddedDetails;
          if (valueData) {
            form.setFieldsValue({ valueAddedDetails: valueData });
          }
        } else if (
          formKey === "siteVisitDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const siteData =
            currentVerification?.verificationData?.siteVisitDetails;
          if (siteData) {
            form.setFieldsValue({ siteVisitDetails: siteData });
          }
        } else if (
          formKey === "thirdPartyCheck" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const tpcData =
            currentVerification?.verificationData?.thirdPartyCheck;
          if (tpcData) {
            form.setFieldsValue({ thirdPartyCheck: tpcData });
          }
        } else if (
          formKey === "additionalDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const addData =
            currentVerification?.verificationData?.additionalDetails;
          if (addData) {
            form.setFieldsValue({ additionalDetails: addData });
          }
        }
        if (formKey === "assetDetails") {
          const assetData = currentVerification?.verificationData?.assetDetails;
          if (assetData) {
            form.setFieldsValue({ assetDetails: assetData });
          }
        } else {
          // Handle other PD forms normally
          form.setFieldsValue(currentVerification?.verificationData || {});
        }
      } else {
        // Handle other forms normally
        form.setFieldsValue(currentVerification?.verificationData || {});
      }
    }
  }, [visible, initialValues, form, formKey, currentTab, currentDepartment]);

  const getInitialValues = async () => {
    const currentVerification = initialValues?.verifications?.find(
      (v: any) => v.addressType === currentTab
    );

    // Handle financial analysis data differently
    if (formKey === "financialAnalysis") {
      return currentVerification?.financialAnalysis;
    }

    // For PD department, handle data structure differently
    if (currentDepartment === "PD") {
      if (formKey === "applicantDetails") {
        return currentVerification?.verificationData?.applicantDetails;
      }
      if (formKey === "familyDetails") {
        return {
          familyMemberDetails:
            currentVerification?.verificationData?.familyMemberDetails ||
            currentVerification?.verificationData?.familyDetails ||
            [],
        };
      }
      if (formKey === "businessBasicDetails") {
        return currentVerification?.verificationData?.basicDetails;
      }
      if (formKey === "businessDetails") {
        return currentVerification?.verificationData?.businessDetails;
      }
      if (formKey === "bankingDetails") {
        return currentVerification?.verificationData?.bankingDetails;
      }
      if (formKey === "financeDetails") {
        return currentVerification?.verificationData?.financeDetails;
      }
      if (formKey === "shareholdingDetails") {
        return currentVerification?.verificationData?.shareholdingDetails;
      }
      if (formKey === "suppliersCreditors") {
        return {
          suppliersCreditors:
            currentVerification?.verificationData?.suppliersCreditors,
        };
      }
      if (formKey === "clientsDebtors") {
        return {
          clientsDebtors: currentVerification?.verificationData?.clientsDebtors,
        };
      }
      if (formKey === "salariesWages") {
        return {
          documentsObserved:
            currentVerification?.verificationData?.documentsObserved,
        };
      }
      if (formKey === "documentsObserved") {
        return {
          documentsObserved:
            currentVerification?.verificationData?.documentsObserved,
        };
      }
      if (formKey === "assetDetails") {
        return {
          assetDetails: currentVerification?.verificationData?.assetDetails,
        };
      }
      if (formKey === "additionalDetails") {
        return currentVerification?.verificationData?.additionalDetails;
      }
    }

    // Handle other forms normally
    return currentVerification?.verificationData?.[
      formKeyMapping[formKey] || formKey
    ];
  };

  // Helper function to validate non-empty strings
  const validateNonEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") {
      // Check if string has at least one non-whitespace character
      return value.trim().length > 0;
    }
    if (typeof value === "number") {
      return !isNaN(value);
    }
    return true; // For other types, consider them valid
  };

  // Helper function to clean whitespace-only values
  const cleanWhitespaceValues = (obj: any): any => {
    if (typeof obj === "string") {
      return obj.trim() === "" ? undefined : obj.trim();
    }
    if (Array.isArray(obj)) {
      return obj
        .map(cleanWhitespaceValues)
        .filter((item) => item !== undefined);
    }
    if (typeof obj === "object" && obj !== null) {
      const cleaned: any = {};
      for (const key in obj) {
        const cleanedValue = cleanWhitespaceValues(obj[key]);
        if (cleanedValue !== undefined) {
          cleaned[key] = cleanedValue;
        }
      }
      return cleaned;
    }
    return obj;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Validate form first. If invalid, this will throw and skip the rest.
      const values = await form.validateFields();

      // Additional validation for empty strings/spaces - only save if at least one non-whitespace character
      const validationErrors: string[] = [];
      Object.entries(values).forEach(([key, value]) => {
        if (typeof value === "string" && value.trim() === "") {
          validationErrors.push(key);
        }

        // Check nested objects and arrays
        if (typeof value === "object" && value !== null) {
          const checkNestedValues = (obj: any, path: string = "") => {
            Object.entries(obj).forEach(([nestedKey, nestedValue]) => {
              const currentPath = path ? `${path}.${nestedKey}` : nestedKey;
              if (
                typeof nestedValue === "string" &&
                nestedValue.trim() === ""
              ) {
                validationErrors.push(currentPath);
              } else if (
                typeof nestedValue === "object" &&
                nestedValue !== null
              ) {
                checkNestedValues(nestedValue, currentPath);
              }
            });
          };
          checkNestedValues(value, key);
        }
      });

      if (validationErrors.length > 0) {
        message.error(validationErrors.join(", "));
        setLoading(false);
        return;
      }

      // Only proceed if validation passes

      // Clean whitespace-only values before processing
      const cleanedValues = cleanWhitespaceValues(values);

      const formValues =
        formKey === "familyMemberDetails"
          ? Object.values(cleanedValues?.familyMemberDetails)
          : cleanedValues;
      console.log(formValues);
      const initialValues = await getInitialValues();
      const cleanedInitialValues = Object.fromEntries(
        Object.entries(initialValues).filter(
          ([_, value]) => value !== undefined && value !== null && value !== ""
        )
      );
      const isChanged =
        JSON.stringify(_.sortBy(Object.entries(formValues))) !==
        JSON.stringify(_.sortBy(Object.entries(cleanedInitialValues)));

      if (isChanged) {
        if (formKey === "financialAnalysis") {
          try {
            const schemaFormat = detectFinancialSchemaFormat(values);
            
            let financialData: Record<string, any>;

            switch (schemaFormat) {
              case "statement2":
                financialData = calculateStatement2Format(values);
                break;
              
              case "statement3":
                financialData = calculateStatement3Format(values);
                break;
              
              case "statement4":
                financialData = calculateStatement4Format(values);
                break;
              
              case "generic":
              default:
                financialData = calculateGenericFormat(values);
                break;
            }

            const allFinancialData = {
              ...values,
              ...financialData,
            };

            await updateFinancialAnalysis(id as string, allFinancialData);
            message.success("Financial analysis updated successfully!");
            fetchVerificationData();
            onEditSuccess?.();
            onCancel();
            return;
          } catch (error) {
            console.error("Error updating financial analysis:", error);
            message.error("Failed to update financial analysis");
            setLoading(false);
            return;
          }
        }

        // Handle other forms normally
        const mappedKey = formKeyMapping[formKey] || formKey;

        // For PD department, handle data structure differently
        let finalData: Record<string, any>;
        if (currentDepartment === "PD") {
          if (formKey === "businessBasicDetails") {
            finalData = {
              basicDetails: formValues,
            };
          } else if (formKey === "businessDetails") {
            finalData = {
              businessDetails: formValues,
            };
          } else if (formKey === "applicantDetails") {
            finalData = {
              applicantDetails: formValues,
            };
          } else if (formKey === "familyDetails") {
            finalData = {
              familyMemberDetails: formValues.familyMemberDetails || [],
            };
          } else {
            finalData = {
              [mappedKey]: formValues,
            };
          }
        } else {
          finalData = {
            [mappedKey]: formValues,
          };
        }

        const request = indexedDB.open("editLogs", 1);

        request.onerror = (event) => {
          console.error("Database error:", request.error);
          message.error("Failed to save changes: Database error");
        };

        request.onsuccess = (event: any) => {
          const db = request.result;

          try {
            const transaction = db.transaction("logs", "readwrite");
            const store = transaction.objectStore("logs");

            const getRequest = store.get(`${id}_${activeTab}`);

            getRequest.onsuccess = () => {
              const existingData = getRequest.result || {};

              const logEntry = {
                id: `${id}_${activeTab}`,
                ...existingData,
                ...finalData,
                timestamp: new Date().toISOString(),
              };

              const putRequest = store.put(logEntry);

              putRequest.onsuccess = () => {
                message.success("Changes saved to edit logs successfully");
                form.resetFields();
                fetchVerificationData();
                onEditSuccess?.();
                onCancel();
              };

              putRequest.onerror = () => {
                console.error("Error saving log:", putRequest.error);
                message.error("Failed to save edit log");
              };
            };

            getRequest.onerror = () => {
              console.error("Error fetching existing log:", getRequest.error);
              // If we can't read existing data, just save the new data
              const logEntry = {
                id: `${id}_${activeTab}`,
                ...finalData,
                timestamp: new Date().toISOString(),
              };

              const putRequest = store.put(logEntry);
              putRequest.onsuccess = () => {
                message.success("Changes saved to edit logs successfully");
                form.resetFields();
                fetchVerificationData();
                onEditSuccess?.();
                onCancel();
              };
            };

            transaction.oncomplete = () => {
              db.close();
            };

            transaction.onerror = () => {
              console.error("Transaction error:", transaction.error);
              message.error("Failed to save changes: Transaction error");
              db.close();
            };
          } catch (error) {
            console.error("Error in database operation:", error);
            message.error("Failed to save changes: Operation error");
            db.close();
          }
        };
      } else {
        // If not changed, check if a log exists and update it by removing the data related to formKey
        const request = indexedDB.open("editLogs", 1);
        request.onerror = (event) => {
          console.error("Database error:", request.error);
        };
        request.onsuccess = (event: any) => {
          const db = request.result;
          try {
            const transaction = db.transaction("logs", "readwrite");
            const store = transaction.objectStore("logs");
            const key = `${id}_${activeTab}`;
            const getRequest = store.get(key);
            getRequest.onsuccess = () => {
              const existingData = getRequest.result;
              if (existingData) {
                const mappedKey = formKeyMapping[formKey] || formKey;
                // Remove the data related to formKey
                const updatedData = { ...existingData };
                delete updatedData[mappedKey];
                // Optionally, check if only id and timestamp remain
                // If so, you could delete the log, but per instruction, just update it
                const putRequest = store.put(updatedData);
                putRequest.onsuccess = () => {
                  message.success("Removed stale form data from edit log");
                  // console.log("Removed stale form data from edit log");
                  onEditSuccess?.();
                };
                putRequest.onerror = () => {
                  console.error("Error updating log:", putRequest.error);
                };
              }
            };
            getRequest.onerror = () => {
              console.error(
                "Error checking for existing log:",
                getRequest.error
              );
            };
            transaction.oncomplete = () => {
              db.close();
            };
            transaction.onerror = () => {
              console.error("Transaction error:", transaction.error);
              db.close();
            };
          } catch (error) {
            console.error("Error in database operation:", error);
            db.close();
          }
        };
      }
      onCancel();
    } catch (error) {
      // If validation fails, AntD will show errors on the form fields automatically
      // Only show a message if you want a global error
      // message.error("Please fill all required fields correctly.");
      setLoading(false);
    }
  };

  const getMaritalStatus = () => {
    return initialValues?.verifications?.find(
      (v: any) => v.addressType === currentTab
    )?.verificationData?.basicDetails?.maritalStatus;
  };

  // console.log(initialValues);

  console.log(
    initialValues?.verifications?.find((v: any) => v.addressType === currentTab)
      ?.verificationData?.[formKeyMapping[formKey] || formKey]
  );

  return (
    <Modal
      title={`Edit ${formKey.replace(/([A-Z])/g, " $1").trim()}`}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleSubmit}
      width={"100%"}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={
          formKey === "familyMemberDetails"
            ? {
                familyMemberDetails: initialValues?.verifications?.find(
                  (v: any) => v.addressType === currentTab
                )?.verificationData?.[formKeyMapping[formKey] || formKey],
              }
            : formKey === "financialAnalysis"
              ? {
                  // For financial analysis, we'll set initial values in useEffect
                  // since the data structure is different
                }
              : currentDepartment === "PD" && formKey === "familyDetails"
                ? {
                    familyMemberDetails:
                      initialValues?.verifications?.find(
                        (v: any) => v.addressType === currentTab
                      )?.verificationData?.familyMemberDetails || [],
                  }
                : currentDepartment === "PD" && formKey === "applicantDetails"
                  ? initialValues?.verifications?.find(
                      (v: any) => v.addressType === currentTab
                    )?.verificationData?.applicantDetails
                  : currentDepartment === "PD" &&
                      formKey === "businessBasicDetails"
                    ? initialValues?.verifications?.find(
                        (v: any) => v.addressType === currentTab
                      )?.verificationData?.basicDetails
                    : currentDepartment === "PD" &&
                        formKey === "businessDetails"
                      ? initialValues?.verifications?.find(
                          (v: any) => v.addressType === currentTab
                        )?.verificationData?.businessDetails
                      : currentDepartment === "PD" &&
                          formKey === "shareholdingDetails"
                        ? initialValues?.verifications?.find(
                            (v: any) => v.addressType === currentTab
                          )?.verificationData?.shareholdingDetails
                        : currentDepartment === "PD" &&
                            formKey === "suppliersCreditors"
                          ? initialValues?.verifications?.find(
                              (v: any) => v.addressType === currentTab
                            )?.verificationData?.suppliersCreditors
                          : currentDepartment === "PD" &&
                              formKey === "clientsDebtors"
                            ? initialValues?.verifications?.find(
                                (v: any) => v.addressType === currentTab
                              )?.verificationData?.clientsDebtors
                            : currentDepartment === "PD" &&
                                formKey === "salariesWages"
                              ? initialValues?.verifications?.find(
                                  (v: any) => v.addressType === currentTab
                                )?.verificationData?.salariesWages
                              : currentDepartment === "PD" &&
                                  formKey === "assetDetails"
                                ? initialValues?.verifications?.find(
                                    (v: any) => v.addressType === currentTab
                                  )?.verificationData?.assetDetails
                                : initialValues?.verifications?.find(
                                    (v: any) => v.addressType === currentTab
                                  )?.verificationData?.[
                                    formKeyMapping[formKey] || formKey
                                  ]
        }
        // onValuesChange={() => setDirty(true)}
        // preserve={false}
      >
        <Row gutter={[12, 0]}>
          <FormSelector
            form={form}
            formKey={formKey}
            currentTab={currentTab}
            getMaritalStatus={getMaritalStatus}
          />
        </Row>
      </Form>
    </Modal>
  );
};
