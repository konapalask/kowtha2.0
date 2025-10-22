/**
 * Backend Module Imports Helper
 * Handles importing TypeScript backend modules for PDF generation
 */

import { createRequire } from "module";
import { pathToFileURL } from "url";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Path to backend dist (compiled JS)
const backendDistPath = path.resolve(__dirname, "../../apps/backend/dist");

/**
 * Import compiled JavaScript module from dist folder
 */
async function importCompiledModule(modulePath) {
  try {
    // Import from compiled JS in dist folder
    const fullPath = path.resolve(backendDistPath, modulePath + ".js");
    const module = await import(fullPath);
    return module;
  } catch (error) {
    try {
      // Try requiring with CommonJS for some modules
      const fullPath = path.resolve(backendDistPath, modulePath + ".js");
      return require(fullPath);
    } catch (error2) {
      throw new Error(
        `Failed to import module ${modulePath}: ${error.message} | ${error2.message}`
      );
    }
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
      "modules/loan/templates/PD/generic.template"
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
      "modules/loan/templates/PD/icici.template"
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
      "modules/loan/templates/PD/hero-fincorp.template"
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
      "modules/loan/templates/PD/iifl.template"
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
      "modules/loan/templates/PD/yes-bank.template"
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
      "modules/loan/templates/PD/pd-base.tempate"
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
      iiflTemplate,
      yesBankTemplate,
      tataUblTemplate,
      axisBankTemplate,
      axisFinanceTemplate,
      arkaFincapTemplate,
      idfcHlMlTemplate,
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
      getIIFLTemplate(),
      getYesBankTemplate(),
      getTataUblTemplate(),
      getAxisBankTemplate(),
      getAxisFinanceTemplate(),
      getArkaFincapTemplate(),
      getIdfcHlMlTemplate(),
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
      iiflTemplate,
      yesBankTemplate,
      tataUblTemplate,
      axisBankTemplate,
      axisFinanceTemplate,
      arkaFincapTemplate,
      idfcHlMlTemplate,
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
