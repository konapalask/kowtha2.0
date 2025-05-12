"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// create-pdf.ts
var fs = require("fs");
var PDFDocument = require('pdfkit'); // CommonJS style
/**
 * Convert raw HTML content (like <h1>, <p>) to basic PDF using pdfkit.
 * Note: You have to parse the HTML yourself, pdfkit doesn't support HTML parsing.
 */
function createPDFFromHTML(outputPath, htmlString) {
    var doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(outputPath));
    // Dummy HTML parser (very basic)
    var lines = htmlString.split(/<\/?[^>]+(>|$)/); // remove tags, very primitive
    lines.forEach(function (line, index) {
        if (line.trim() !== '') {
            doc.text(line.trim(), {
                paragraphGap: 10,
            });
        }
    });
    doc.end();
}
// Example HTML input (you must parse it yourself)
var sampleHTML = "\n  <h1>Hello World</h1>\n  <p>This is a sample PDF generated using PDFKit in TypeScript.</p>\n";
createPDFFromHTML('~/Desktop/output.pdf', sampleHTML);
