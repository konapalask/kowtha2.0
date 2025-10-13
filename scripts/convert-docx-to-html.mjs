/**
 * DOCX to HTML Converter for Bank Templates
 * 
 * This script recursively finds all .docx files in the bank template folders
 * and converts them to clean HTML files in the same directory.
 * 
 * Usage: npm run convert:templates
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import mammoth from "mammoth";
import sanitizeHtml from "sanitize-html";

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const TEMPLATES_DIR = path.join(__dirname, "../project-data/kowtha-provided-templates");
const EXCEL_FILES = ["DOCUMENTS REQUIRED.xlsx", "financial statement"];

// Statistics
const stats = {
  totalFound: 0,
  converted: 0,
  skipped: 0,
  failed: 0,
  errors: []
};

/**
 * Recursively find all .docx files in a directory
 */
function findDocxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively search subdirectories
      findDocxFiles(filePath, fileList);
    } else if (file.endsWith(".docx") && !file.startsWith("~$")) {
      // Skip temporary Word files (start with ~$)
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Convert a single DOCX file to HTML
 */
async function convertDocxToHtml(docxPath) {
  const fileName = path.basename(docxPath);
  const dirName = path.basename(path.dirname(docxPath));
  const htmlPath = docxPath.replace(".docx", ".html");

  // Skip if HTML already exists and is newer
  if (fs.existsSync(htmlPath)) {
    const docxStat = fs.statSync(docxPath);
    const htmlStat = fs.statSync(htmlPath);
    
    if (htmlStat.mtime > docxStat.mtime) {
      console.log(`⏭️  Skipped (already up-to-date): ${dirName}/${fileName}`);
      stats.skipped++;
      return;
    }
  }

  try {
    console.log(`🔄 Converting: ${dirName}/${fileName}`);
    
    // Read DOCX file
    const buffer = fs.readFileSync(docxPath);

    // Convert DOCX to HTML with style mapping
    const { value: rawHtml, messages } = await mammoth.convertToHtml({
      buffer,
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Normal'] => p:fresh",
        "r[style-name='Strong'] => strong",
        "r[style-name='Emphasis'] => em",
      ],
    });

    // Log any warnings from mammoth
    if (messages.length > 0) {
      console.log(`   ⚠️  Warnings: ${messages.length}`);
      messages.forEach(msg => {
        if (msg.type === 'warning') {
          console.log(`      - ${msg.message}`);
        }
      });
    }

    // Sanitize and enhance HTML
    const cleanHtml = sanitizeHtml(rawHtml, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "table",
        "thead",
        "tbody",
        "tfoot",
        "tr",
        "td",
        "th",
        "colgroup",
        "col",
        "span",
        "div",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "br",
        "hr",
      ]),
      allowedAttributes: {
        "*": ["colspan", "rowspan", "style", "class", "align"],
      },
      transformTags: {
        // Style tables for better readability
        table: (tagName, attribs) => ({
          tagName,
          attribs: {
            ...attribs,
            style: "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0;",
          },
        }),
        // Style table headers
        th: (tagName, attribs) => ({
          tagName,
          attribs: {
            ...attribs,
            style: "border:1px solid #ccc;padding:8px;font-weight:bold;background-color:#f5f5f5;text-align:left;",
          },
        }),
        // Style table cells
        td: (tagName, attribs) => ({
          tagName,
          attribs: {
            ...attribs,
            style: "border:1px solid #ccc;padding:8px;",
          },
        }),
        // Style paragraphs
        p: (tagName, attribs) => ({
          tagName,
          attribs: {
            ...attribs,
            style: "margin:8px 0;line-height:1.5;",
          },
        }),
        // Style headings
        h1: (tagName, attribs) => ({
          tagName,
          attribs: {
            ...attribs,
            style: "font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#333;",
          },
        }),
        h2: (tagName, attribs) => ({
          tagName,
          attribs: {
            ...attribs,
            style: "font-size:20px;font-weight:bold;margin:14px 0 6px 0;color:#333;",
          },
        }),
        h3: (tagName, attribs) => ({
          tagName,
          attribs: {
            ...attribs,
            style: "font-size:16px;font-weight:bold;margin:12px 0 4px 0;color:#333;",
          },
        }),
      },
    });

    // Create full HTML document with proper structure and metadata
    const bankName = dirName;
    const templateType = fileName.replace(".docx", "");
    
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="bank" content="${bankName}">
    <meta name="template-type" content="${templateType}">
    <meta name="generated-from" content="${fileName}">
    <meta name="generated-date" content="${new Date().toISOString()}">
    <title>${bankName} - ${templateType} Template</title>
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
        <h1>${bankName}</h1>
        <p>${templateType} Template | Generated from ${fileName}</p>
    </div>
    <div class="template-content">
        ${cleanHtml}
    </div>
</body>
</html>`;

    // Write HTML file
    fs.writeFileSync(htmlPath, fullHtml, "utf8");
    
    console.log(`✅ Converted: ${dirName}/${fileName} → ${path.basename(htmlPath)}`);
    stats.converted++;

  } catch (error) {
    console.error(`❌ Failed: ${dirName}/${fileName}`);
    console.error(`   Error: ${error.message}`);
    stats.failed++;
    stats.errors.push({
      file: `${dirName}/${fileName}`,
      error: error.message
    });
  }
}

/**
 * Main conversion function
 */
async function convertAllTemplates() {
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║  DOCX to HTML Converter for Bank Templates                  ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  // Check if templates directory exists
  if (!fs.existsSync(TEMPLATES_DIR)) {
    console.error(`❌ Templates directory not found: ${TEMPLATES_DIR}`);
    process.exit(1);
  }

  console.log(`📁 Scanning directory: ${TEMPLATES_DIR}\n`);

  // Find all DOCX files
  const docxFiles = findDocxFiles(TEMPLATES_DIR);
  stats.totalFound = docxFiles.length;

  console.log(`📄 Found ${docxFiles.length} DOCX files\n`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (docxFiles.length === 0) {
    console.log("ℹ️  No DOCX files found to convert.");
    return;
  }

  // Convert each file
  for (const docxPath of docxFiles) {
    await convertDocxToHtml(docxPath);
  }

  // Print summary
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n📊 Conversion Summary:");
  console.log(`   Total files found:     ${stats.totalFound}`);
  console.log(`   ✅ Successfully converted: ${stats.converted}`);
  console.log(`   ⏭️  Skipped (up-to-date):  ${stats.skipped}`);
  console.log(`   ❌ Failed:                 ${stats.failed}`);

  if (stats.errors.length > 0) {
    console.log("\n⚠️  Errors encountered:");
    stats.errors.forEach(({ file, error }) => {
      console.log(`   - ${file}: ${error}`);
    });
  }

  console.log("\n✨ Conversion complete!\n");

  // Exit with error code if any conversions failed
  if (stats.failed > 0) {
    process.exit(1);
  }
}

// Run the converter
convertAllTemplates().catch((error) => {
  console.error("\n❌ Fatal error:");
  console.error(error);
  process.exit(1);
});

