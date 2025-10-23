/**
 * Backend Module Imports Helper
 * Handles importing TypeScript backend modules for PDF generation
 */

import fs from "fs";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Register ts-node so we can import backend TypeScript directly
const tsNode = require("ts-node");
tsNode.register({
  transpileOnly: true,
  project: path.resolve(__dirname, "../../apps/backend/tsconfig.json"),
});

// Path to backend source (TypeScript)
const backendSrcPath = path.resolve(__dirname, "../../apps/backend/src");

function resolveModulePath(modulePath) {
  const tsPath = path.resolve(backendSrcPath, `${modulePath}.ts`);
  if (fs.existsSync(tsPath)) {
    return tsPath;
  }
  const indexTsPath = path.resolve(backendSrcPath, modulePath, "index.ts");
  if (fs.existsSync(indexTsPath)) {
    return indexTsPath;
  }
  throw new Error(`Cannot resolve module path for ${modulePath}`);
}

/**
 * Import compiled JavaScript module from dist folder
 */
async function importCompiledModule(modulePath) {
  try {
    const fullPath = resolveModulePath(modulePath);
    return require(fullPath);
  } catch (error) {
    throw new Error(
      `Failed to import module ${modulePath}: ${error.message}`
    );
  }
}

/**
 * Get form schemas for all banks
 */
export async function getFormSchemas() {
  try {
    const module = await importCompiledModule(
      "modules/loan/forms-schema/index"
    );
    return module.formSchema || module.default?.formSchema;
  } catch (error) {
    console.error("Failed to load form schemas:", error);
    throw error;
  }
}

/**
 * Get generic PD template
 */
export async function getGenericPDTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/generic.template"
    );
    return module.genericPDTemplate || module.default;
  } catch (error) {
    console.error("Failed to load generic PD template:", error);
    throw error;
  }
}

/**
 * Get RBL template
 */
export async function getRBLTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/rbl.template"
    );
    return module.rblTemplate || module.default;
  } catch (error) {
    console.error("Failed to load RBL template:", error);
    throw error;
  }
}

/**
 * Get Axis Finance UBL template
 */
export async function getAxisFinanceUBLTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/axis-finance-ubl.template"
    );
    return module.axisFinanceUBLTemplate || module.default;
  } catch (error) {
    console.error("Failed to load Axis Finance UBL template:", error);
    throw error;
  }
}

/**
 * Get ICICI template
 */
export async function getICICITemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/icici.template"
    );
    return module.iciciTemplate || module.default;
  } catch (error) {
    console.error("Failed to load ICICI template:", error);
    throw error;
  }
}

/**
 * Get Chola template
 */
export async function getCholaTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/chola.template"
    );
    return module.cholaTemplate || module.default;
  } catch (error) {
    console.error("Failed to load Chola template:", error);
    throw error;
  }
}

/**
 * Get Hero Fincorp template
 */
export async function getHeroFincorpTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/hero-fincorp.template"
    );
    return module.heroFincorpTemplate || module.default;
  } catch (error) {
    console.error("Failed to load Hero Fincorp template:", error);
    throw error;
  }
}

/**
 * Get IIFL template
 */
export async function getIIFLTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/iifl.template"
    );
    return module.iiflTemplate || module.default;
  } catch (error) {
    console.error("Failed to load IIFL template:", error);
    throw error;
  }
}

export async function getYesBankTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/yes-bank.template"
    );
    return module.yesBankTemplate || module.default;
  } catch (error) {
    console.error("Failed to load Yes Bank template:", error);
    throw error;
  }
}

export async function getTataUblTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/tata-ubl.template"
    );
    return module.tataUblTemplate || module.default;
  } catch (error) {
    console.error("Failed to load Tata UBL template:", error);
    throw error;
  }
}

/**
 * Get IDFC PL template
 */
export async function getIdfcPlTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/idfc-pl.template"
    );
    return module.idfcPlTemplate || module.default;
  } catch (error) {
    console.error("Failed to load IDFC PL template:", error);
    throw error;
  }
}

export async function getIndiaShelterSalariedTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/india-shelter-salaried.template"
    );
    return module.indiaShelterSalariedTemplate || module.default;
  } catch (error) {
    console.error("Failed to load India Shelter Salaried template:", error);
    throw error;
  }
}

export async function getIndiaShelterSenpTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/india-shelter-senp.template"
    );
    return module.indiaShelterSenpTemplate || module.default;
  } catch (error) {
    console.error("Failed to load India Shelter SENP template:", error);
    throw error;
  }
}

export async function getAxisBankTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/axis-bank.template"
    );
    return module.axisBankTemplate || module.default;
  } catch (error) {
    console.error("Failed to load Axis Bank template:", error);
    throw error;
  }
}

export async function getAxisFinanceTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/axis-finance.template"
    );
    return module.axisFinanceTemplate || module.default;
  } catch (error) {
    console.error("Failed to load Axis Finance template:", error);
    throw error;
  }
}

export async function getAxisAgriTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/axis-agri.template"
    );
    return module.axisAgriTemplate || module.default;
  } catch (error) {
    console.error("Failed to load Axis Agri template:", error);
    throw error;
  }
}

export async function getSmfgSmeTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/smfg-sme.template"
    );
    return module.smfgSmeTemplate || module.default;
  } catch (error) {
    console.error("Failed to load SMFG SME template:", error);
    throw error;
  }
}

export async function getAdityaBirlaTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/aditya-birla.template"
    );
    return module.adityaBirlaTemplate || module.default;
  } catch (error) {
    console.error("Failed to load Aditya Birla template:", error);
    throw error;
  }
}

export async function getArkaFincapTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/arka-fincap.template"
    );
    return module.arkaFincapTemplate || module.default;
  } catch (error) {
    console.error("Failed to load Arka Fincap template:", error);
    throw error;
  }
}

export async function getHeroHousingSelfTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/hero-housing-self.template"
    );
    return module.heroHousingSelfTemplate || module.default;
  } catch (error) {
    console.error("Failed to load Hero Housing Self template:", error);
    throw error;
  }
}

export async function getHeroHousingSalariedTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/herohousing-salaried.template"
    );
    return module.herohousingSalariedTemplate || module.default;
  } catch (error) {
    console.error("Failed to load Hero Housing Salaried template:", error);
    throw error;
  }
}

export async function getIdfcHlMlTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/idfc-hl-ml.template"
    );
    return module.idfcHlMlTemplate || module.default;
  } catch (error) {
    console.error("Failed to load IDFC HL & ML template:", error);
    throw error;
  }
}

/**
 * Get PD base template (CSS and base HTML)
 */
export async function getPDBaseTemplate() {
  try {
    const module = await importCompiledModule(
      "modules/loan/templates/PD/html/pd-base.tempate"
    );
    return module.pdBaseTemplate || module.default;
  } catch (error) {
    console.error("Failed to load PD base template:", error);
    throw error;
  }
}

/**
 * Get all required backend modules for PDF generation
 */
export async function loadBackendModules() {
  console.log("Loading backend modules...");

  try {
    const [
      formSchema,
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
      arkaFincapTemplate,
      idfcHlMlTemplate,
      idfcPlTemplate,
      indiaShelterSalariedTemplate,
      indiaShelterSenpTemplate,
      smfgSmeTemplate,
      adityaBirlaTemplate,
      pdBaseTemplate,
    ] = await Promise.all([
      getFormSchemas(),
      getGenericPDTemplate(),
      getRBLTemplate(),
      getAxisFinanceUBLTemplate(),
      getICICITemplate(),
      getCholaTemplate(),
      getHeroFincorpTemplate(),
      getHeroHousingSelfTemplate(),
      getHeroHousingSalariedTemplate(),
      getIIFLTemplate(),
      getYesBankTemplate(),
      getTataUblTemplate(),
      getAxisBankTemplate(),
      getAxisFinanceTemplate(),
      getAxisAgriTemplate(),
      getArkaFincapTemplate(),
      getIdfcHlMlTemplate(),
      getIdfcPlTemplate(),
      getIndiaShelterSalariedTemplate(),
      getIndiaShelterSenpTemplate(),
      getSmfgSmeTemplate(),
      getAdityaBirlaTemplate(),
      getPDBaseTemplate(),
    ]);

    return {
      formSchema,
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
      arkaFincapTemplate,
      idfcHlMlTemplate,
      idfcPlTemplate,
      indiaShelterSalariedTemplate,
      indiaShelterSenpTemplate,
      smfgSmeTemplate,
      adityaBirlaTemplate,
      pdBaseTemplate,
    };
  } catch (error) {
    console.error("Failed to load backend modules:", error);
    throw error;
  }
}

/**
 * Get bank names from form schema
 */
export async function getBankNames() {
  try {
    const formSchema = await getFormSchemas();
    if (!formSchema) {
      throw new Error("Form schema not loaded");
    }
    return Object.keys(formSchema);
  } catch (error) {
    console.error("Failed to get bank names:", error);
    throw error;
  }
}

/**
 * Get schema for specific bank
 */
export async function getBankSchema(bankName) {
  try {
    const formSchema = await getFormSchemas();
    if (!formSchema || !formSchema[bankName]) {
      throw new Error(`Bank schema not found for: ${bankName}`);
    }
    return formSchema[bankName];
  } catch (error) {
    console.error(`Failed to get schema for bank ${bankName}:`, error);
    throw error;
  }
}
