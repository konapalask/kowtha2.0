#!/usr/bin/env node

/**
 * QA PDF Generator Script
 * Generates PD form PDF templates for all banks (or specific banks) using dummy data
 */

import { promises as fs } from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import {
  generateBaseUserData,
  populateVerificationData,
  generateFinancialAnalysis,
} from "./lib/qa-data-generator.mjs";
import {
  loadBackendModules,
  getBankNames,
  getBankSchema,
} from "./lib/backend-imports.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OUTPUT_DIR = path.resolve(__dirname, "../project-data/qa-pdfs");
const ROOT_DIR = path.resolve(__dirname, "..");

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const banksArg = args.find((arg) => arg.startsWith("--banks="));

  let targetBanks = null;
  if (banksArg) {
    targetBanks = banksArg
      .split("=")[1]
      .split(",")
      .map((bank) => bank.trim().replace(/"/g, "").replace(/'/g, ""));
  }

  return { targetBanks };
}

/**
 * Ensure output directory exists
 */
async function ensureOutputDir() {
  try {
    await fs.access(OUTPUT_DIR);
  } catch (error) {
    console.log(`Creating output directory: ${OUTPUT_DIR}`);
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  }
}

/**
 * Sanitize bank name for filename
 */
function sanitizeBankName(bankName) {
  return bankName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Generate PDF from HTML using Puppeteer (matching backend configuration)
 */
async function generatePDF(htmlContent, outputPath, bankName = "Kowtha") {
  console.log(`  Generating PDF: ${path.basename(outputPath)}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--lang=en-IN",
      "--intl.accept_languages=en-IN",
      "--disable-web-security",
      "--disable-features=VizDisplayCompositor",
    ],
  });

  try {
    const page = await browser.newPage();

    // Set content to the HTML template
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
    });

    // Wait a bit more to ensure content is fully loaded
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate current IST date
    const istDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Debug logging
    console.log("Footer template variables:", {
      bankName: bankName || "Kowtha",
      istDate: istDate,
    });

    // Create footer template with proper string interpolation
    const footerTemplate = `
      <div style="
          font-size: 10px;
          width: 100%;
          padding: 6px 16px;
          color: #7f8c8d;
          border-top: 1px solid #eee;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          line-height: 1.4;
          height: 50px;
          box-sizing: border-box;
        ">
        <div style="color: rgb(8, 136, 36); font-weight: 600;">${bankName || "Kowtha"}</div>
        <div>
          Generated on ${istDate} —
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      </div>
    `;

    console.log("Footer template HTML:", footerTemplate);

    // Generate PDF with same settings as backend
    console.log("Starting PDF generation with header/footer...");
    const pdfBuffer = await page.pdf({
      format: "a4",
      margin: {
        top: "60px", // Increased to accommodate header
        right: "20px",
        bottom: "80px", // Increased further to prevent content overlap
        left: "20px",
      },
      printBackground: true,
      preferCSSPageSize: false, // Changed to false to ensure consistent page sizing
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="
            font-size: 8px;
            width: 100%;
            padding: 4px 16px;
            color: #999;
            border-bottom: 1px solid #eee;
            text-align: center;
          ">
          ${bankName || "Kowtha"} - Verification Report
        </div>
      `,
      footerTemplate: footerTemplate,
    });

    console.log("PDF generation completed. Buffer size:", pdfBuffer.length);

    // Write PDF to file
    await fs.writeFile(outputPath, pdfBuffer);
    console.log(`  ✓ Generated: ${outputPath}`);
  } finally {
    await browser.close();
  }
}

/**
 * Generate format PD images data (mock for QA)
 */
async function generateFormatPDImagesData(
  verificationData,
  bankName,
  applicationNumber,
  baseData
) {
  let signatureDataUri = "";
  try {
    const signaturePath = process.env.SIGNATURE_PATH
      ? path.resolve(process.cwd(), process.env.SIGNATURE_PATH)
      : path.resolve(__dirname, "../apps/backend/src/images/new_sign.jpg");
    const imageBuffer = await fs.readFile(signaturePath);
    signatureDataUri = `data:image/jpeg;base64,${imageBuffer.toString(
      "base64"
    )}`;
  } catch (error) {
    console.warn("Could not load signature image for QA:", error.message);
  }

  let samplePhotosHtml = "";
  try {
    const sampleImagePath = path.resolve(
      __dirname,
      "../project-data/sample-images/sample-gst.png"
    );
    const sampleBuffer = await fs.readFile(sampleImagePath);
    const sampleImageDataUri = `data:image/png;base64,${sampleBuffer.toString(
      "base64"
    )}`;
    samplePhotosHtml = `
      <div style="margin-bottom:16px;">
        <div style="font-size:14px;font-weight:bold;margin-bottom:8px;text-transform:uppercase;">GST Certificate</div>
        <div style="display:flex;flex-wrap:wrap;justify-content:flex-start;">
          <div style="width:48%;margin:1%;border:1px solid #ddd;padding:10px;text-align:center;display:inline-block;vertical-align:top;box-sizing:border-box;page-break-inside:avoid;">
            <img src="${sampleImageDataUri}" alt="Sample GST" style="width:100%;height:260px;object-fit:contain;margin-bottom:8px;" />
            <div style="font-size:12px;color:#555;text-align:left;">
              <div><strong>Geo Tag:</strong> 17.4436, 78.3772</div>
              <div><strong>Captured:</strong> QA Sample Image</div>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.warn("Could not load sample photo for QA:", error.message);
  }

  const loanInfo = baseData?.userData?.loan || {};

  return {
    bankName: bankName,
    path: `Generated for QA Testing - ${bankName}`,
    status: "Positive",
    applicationNumber: applicationNumber,
    imageDataUri: signatureDataUri,
    imagesData: samplePhotosHtml,
    financialAnalysis: generateFinancialAnalysis(),
    fieldExecutive: "QA Test User",
    loanDetails: {
      applicationNumber: loanInfo.applicationNumber ?? applicationNumber,
      applicantName:
        loanInfo.applicantName ??
        verificationData?.applicantDetails?.nameOfApplicant ??
        "",
      applicantMobile:
        loanInfo.applicantMobile ??
        verificationData?.applicantDetails?.phoneNumber ??
        "",
      applicantAddress:
        loanInfo.applicantAddress ??
        verificationData?.applicantDetails?.initiatedPremises ??
        "",
      loanAmount: loanInfo.loanAmount ?? verificationData?.loanAmount ?? null,
      loanType: loanInfo.loanType ?? verificationData?.loanType ?? "",
      loanPurpose: loanInfo.loanPurpose ?? "Working capital requirements",
      businessName:
        loanInfo.businessName ??
        verificationData?.applicantDetails?.nameOfConcern ??
        "",
    },
    fieldVisitTime:
      verificationData?.applicantDetails?.appointmentFixed ||
      new Date().toISOString(),
    pdVerifiedBy:
      verificationData?.pdOfficer?.name ||
      verificationData?.fieldExecutive?.name ||
      "QA Test Officer",
    pdVerifiedDate:
      verificationData?.applicantDetails?.dateOfVisit ||
      new Date().toISOString(),
  };
}

/**
 * Generate PDF for a specific bank
 */
async function generateBankPDF(bankName, backendModules) {
  console.log(`\n📄 Processing: ${bankName}`);

  try {
    // Get schema for this bank
    const schema = await getBankSchema(bankName);

    // Generate base user data
    const baseData = generateBaseUserData(bankName);
    const { userData, coordinates } = baseData;

    // Generate verification data using schema
    const verificationData = populateVerificationData(
      schema,
      baseData,
      coordinates
    );

    // Create html_data object
    const html_data = await generateFormatPDImagesData(
      verificationData,
      bankName,
      userData.loan.applicationNumber,
      baseData
    );

    // Determine which template to use
    let htmlTemplate;
    const {
      genericPDTemplate,
      rblTemplate,
      axisFinanceUBLTemplate,
      iciciTemplate,
      cholaTemplate,
      heroFincorpTemplate,
      heroHousingSelfTemplate,
      heroHousingSalariedTemplate,
      iiflTemplate,
      yesBankTemplate,
      tataUblTemplate,
      axisBankTemplate,
      axisFinanceTemplate,
      axisAgriTemplate,
      smfgSmeTemplate,
      adityaBirlaTemplate,
      niwasSalariedTemplate,
      niwasSenpTemplate,
      arkaFincapTemplate,
      idfcHlMlTemplate,
      idfcPlTemplate,
      indiaShelterSalariedTemplate,
      indiaShelterSenpTemplate,
    } = backendModules;

    if (bankName === "RBL" || bankName === "Rbl") {
      // RBL uses custom template
      console.log(`  Using RBL custom template`);
      htmlTemplate = rblTemplate(verificationData, html_data);
    } else if (bankName === "ICICI") {
      // ICICI uses custom template
      console.log(`  Using ICICI custom template`);
      htmlTemplate = iciciTemplate(verificationData, html_data);
    } else if (bankName === "Chola") {
      // Chola uses custom template
      console.log(`  Using Chola custom template`);
      htmlTemplate = cholaTemplate(verificationData, html_data);
    } else if (bankName === "Hero Fincorp") {
      // Hero Fincorp uses custom template
      console.log(`  Using Hero Fincorp custom template`);
      htmlTemplate = heroFincorpTemplate(verificationData, html_data);
    } else if (bankName === "IIFL") {
      // IIFL uses custom template
      console.log(`  Using IIFL custom template`);
      htmlTemplate = iiflTemplate(verificationData, html_data);
    } else if (bankName === "Yes Bank") {
      // Yes Bank uses custom template
      console.log(`  Using Yes Bank custom template`);
      htmlTemplate = yesBankTemplate(verificationData, html_data);
    } else if (bankName === "Tata Ubl") {
      // Tata UBL uses custom template
      console.log(`  Using Tata UBL custom template`);
      htmlTemplate = tataUblTemplate(verificationData, html_data);
    } else if (bankName === "Axis Bank") {
      // Axis Bank uses custom template
      console.log(`  Using Axis Bank custom template`);
      htmlTemplate = axisBankTemplate(verificationData, html_data);
    } else if (bankName === "Axis Agri") {
      console.log(`  Using Axis Agri custom template`);
      htmlTemplate = axisAgriTemplate(verificationData, html_data);
    } else if (bankName === "Axis Finance UBL Above 10L") {
      // Axis Finance UBL Above 10L uses custom template
      console.log(`  Using Axis Finance UBL custom template`);
      htmlTemplate = axisFinanceUBLTemplate(verificationData, html_data);
    } 
    else if(bankName=== "Axis Finance UBL Below 10L"){
      console.log(`  Using Axis Finance UBL Below 10L custom template`);
      htmlTemplate = axisFinanceUBLTemplate(verificationData, html_data);
    }
    else if (bankName === "Axis Finance") {
      // Axis Finance uses custom template
      console.log(`  Using Axis Finance custom template`);
      htmlTemplate = axisFinanceTemplate(verificationData, html_data);
    } else if (bankName === "Arka Fincap") {
      // Arka Fincap uses custom template
      console.log(`  Using Arka Fincap custom template`);
      htmlTemplate = arkaFincapTemplate(verificationData, html_data);
    } else if (bankName === "HeroHousing-Self") {
      // Hero Housing Self Employed uses custom template
      console.log(`  Using Hero Housing Self custom template`);
      htmlTemplate = heroHousingSelfTemplate(verificationData, html_data);
    } else if (bankName === "HeroHousing-Salaried") {
      console.log(`  Using Hero Housing Salaried custom template`);
      htmlTemplate = heroHousingSalariedTemplate(verificationData, html_data);
    } else if (bankName === "Niwas Salaried") {
      console.log(`  Using Niwas Salaried custom template`);
      htmlTemplate = niwasSalariedTemplate(verificationData, html_data);
    } else if (bankName === "Niwas Senp") {
      console.log(`  Using Niwas Senp custom template`);
      htmlTemplate = niwasSenpTemplate(verificationData, html_data);
    } else if (bankName === "India Shelter SENP") {
      console.log(`  Using India Shelter SENP custom template`);
      htmlTemplate = indiaShelterSenpTemplate(verificationData, html_data);
    } else if (bankName === "India Shelter Salaried") {
      console.log(`  Using India Shelter Salaried custom template`);
      htmlTemplate = indiaShelterSalariedTemplate(verificationData, html_data);
    } else if (bankName === "SMFG SME") {
      console.log(`  Using SMFG SME custom template`);
      htmlTemplate = smfgSmeTemplate(verificationData, html_data);
    } else if (bankName === "Aditya Birla") {
      console.log(`  Using Aditya Birla custom template`);
      htmlTemplate = adityaBirlaTemplate(verificationData, html_data);
    } else if (bankName === "IDFC PL") {
      console.log(`  Using IDFC PL custom template`);
      htmlTemplate = idfcPlTemplate(verificationData, html_data);
    } else if (bankName === "IDFC HL & ML") {
      // IDFC HL & ML uses custom template
      console.log(`  Using IDFC HL & ML custom template`);
      htmlTemplate = idfcHlMlTemplate(verificationData, html_data);
    } else {
      // All other banks use generic template
      console.log(`  Using generic template`);
      htmlTemplate = genericPDTemplate(verificationData, schema, html_data);
    }

    // Generate PDF filename
    const sanitizedName = sanitizeBankName(bankName);
    const outputPath = path.join(OUTPUT_DIR, `${sanitizedName}.pdf`);

    // Generate and save PDF
    await generatePDF(htmlTemplate, outputPath, bankName);

    return { success: true, outputPath, bankName };
  } catch (error) {
    console.error(
      `  ❌ Failed to generate PDF for ${bankName}:`,
      error.message
    );
    return { success: false, bankName, error: error.message };
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log("🚀 QA PDF Generator Starting...");
  console.log(`Output directory: ${OUTPUT_DIR}`);

  const { targetBanks } = parseArgs();

  try {
    // Ensure output directory exists
    await ensureOutputDir();

    // Load backend modules
    console.log("\n📦 Loading backend modules...");
    const backendModules = await loadBackendModules();
    console.log("✓ Backend modules loaded successfully");

    // Determine which banks to process
    let bankNames;
    if (targetBanks && targetBanks.length > 0) {
      bankNames = targetBanks;
      console.log(`\n📋 Processing specific banks: ${bankNames.join(", ")}`);

      // Validate bank names
      const allBanks = await getBankNames();
      const invalidBanks = bankNames.filter((bank) => !allBanks.includes(bank));
      if (invalidBanks.length > 0) {
        console.error(`❌ Invalid bank names: ${invalidBanks.join(", ")}`);
        console.log(`Available banks: ${allBanks.join(", ")}`);
        process.exit(1);
      }
    } else {
      bankNames = await getBankNames();
      console.log(`\n📋 Processing all ${bankNames.length} banks`);
    }

    // Generate PDFs
    console.log(`\n📄 Starting PDF generation...`);
    const results = [];

    for (const bankName of bankNames) {
      const result = await generateBankPDF(bankName, backendModules);
      results.push(result);

      // Small delay between generations to prevent resource issues
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Summary
    console.log("\n📊 Generation Summary:");
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    console.log(`✓ Successful: ${successful.length}/${results.length}`);
    successful.forEach((r) =>
      console.log(`  - ${r.bankName} → ${path.basename(r.outputPath)}`)
    );

    if (failed.length > 0) {
      console.log(`\n❌ Failed: ${failed.length}/${results.length}`);
      failed.forEach((r) => console.log(`  - ${r.bankName}: ${r.error}`));
    }

    console.log(`\n🎉 QA PDF generation completed!`);
    console.log(`PDFs saved to: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error("\n❌ Script failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
