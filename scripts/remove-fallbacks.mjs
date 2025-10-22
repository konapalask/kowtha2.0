#!/usr/bin/env node

/**
 * Script to remove ALL fallback values from PD templates
 * This removes meaningful fallback data but keeps empty strings
 */

import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesToAudit = [
  "arka-fincap.template.ts",
  "axis-bank.template.ts",
  "tata-ubl.template.ts",
  "rbl.template.ts",
  "axis-finance.template.ts",
  "hero-housing-self.template.ts",
  "icici.template.ts",
  "idfc-hl-ml.template.ts",
  "chola.template.ts",
  "axis-finance-ubl.template.ts",
];

const templatesDir = path.resolve(
  __dirname,
  "../apps/backend/src/modules/loan/templates/PD/html"
);

function removeAllFallbacks(content) {
  let result = content;

  // Pattern 1: Replace || "Anything that's not empty" with || ""
  // This removes all meaningful fallback strings
  result = result.replace(/\|\|\s*"([^"]{1,})"/g, '|| ""');

  // Pattern 2: Replace || Number with || 0 (for currency formatting functions)
  result = result.replace(/\|\|\s*([0-9]{4,})/g, "|| 0");

  // Pattern 3: Replace || NegativeNumber with || 0
  result = result.replace(/\|\|\s*-([0-9]+)/g, "|| 0");

  return result;
}

async function processTemplates() {
  console.log("🔍 Removing fallback values from templates...\n");

  for (const templateName of templatesToAudit) {
    const filePath = path.join(templatesDir, templateName);

    try {
      const content = readFileSync(filePath, "utf8");
      const originalContent = content;
      const cleanedContent = removeAllFallbacks(content);

      if (originalContent !== cleanedContent) {
        writeFileSync(filePath, cleanedContent, "utf8");
        console.log(`✅ Updated: ${templateName}`);
      } else {
        console.log(`✓ No changes: ${templateName}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${templateName}:`, error.message);
    }
  }

  console.log("\n✨ Template audit complete!");
}

processTemplates();
