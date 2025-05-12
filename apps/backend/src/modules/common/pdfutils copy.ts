// create-pdf.ts
import * as fs from 'fs';
const PDFDocument = require('pdfkit'); // CommonJS style

/**
 * Convert raw HTML content (like <h1>, <p>) to basic PDF using pdfkit.
 * Note: You have to parse the HTML yourself, pdfkit doesn't support HTML parsing.
 */
function createPDFFromHTML(outputPath: string, htmlString: string) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(outputPath));

  // Dummy HTML parser (very basic)
  const lines = htmlString.split(/<\/?[^>]+(>|$)/); // remove tags, very primitive

  lines.forEach((line, index) => {
    if (line.trim() !== '') {
      doc.text(line.trim(), {
        paragraphGap: 10,
      });
    }
  });

  doc.end();
}

// Example HTML input (you must parse it yourself)
const sampleHTML = `
  <h1>Hello World</h1>
  <p>This is a sample PDF generated using PDFKit in TypeScript.</p>
`;

createPDFFromHTML('~/Desktop/output.pdf', sampleHTML);
