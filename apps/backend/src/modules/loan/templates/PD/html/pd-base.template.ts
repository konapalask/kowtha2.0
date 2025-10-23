export const pdBaseTemplate = (html_data?: any) => {
  return `
    <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              padding-bottom: 140px;
              background: #fff;
              color: #222;
              position: relative;
              min-height: 60vh;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
            }
            .header {
              text-align: left;
              padding: 24px 40px 8px 40px;
              border-bottom: 2px solid #2c3e50;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              width: 100%;
              height: 100%;
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
              margin-right: 40px;
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
              width: 90%;
              margin: 0 auto;
              width: 100%;
              height: 100%;
              padding: 0 40px;
              box-sizing: border-box;
            }
            .branch-box {
              width: 100%;
              margin: 18px 0 0 0;
              border: 2px solid #888;
              border-radius: 4px;
              background: #f8f9fa;
              width: 100%;
              height: 100%;
            }
            .branch-table {
              width: 100%;
              border-collapse: collapse;
              width: 100%;
              height: 100%;
            }
            .branch-table td {
              border: none;
              padding: 10px 16px;
              font-size: 16px;
            }
            .branch-label {
              font-weight: bold;
              width: 160px;
              height: 100%;
            }
            .branch-value {
              font-size: 18px;
              font-weight: bold;
              color: #222;
              height: 100%;
            }
            .branch-note {
              background: #ffe0b2;
              color: #b26a00;
              font-size: 13px;
              text-align: center;
              border-radius: 3px;
              font-weight: bold;
              height: 100%;
            }
            .section-table {
              width: 100%;
              margin: 24px 0 0 0;
              border-collapse: collapse;
              font-size: 15px;
              height: 100%;
            }
            .section-header {
              background: #f5f5f5;
              font-weight: bold;
              font-size: 16px;
              text-align: center;
              border: 1px solid #888;
              padding: 8px;
              letter-spacing: 1px;
              height: 100%;
            }
            .section-table th, .section-table td {
              border: 1px solid #888;
              padding: 8px 10px;
              vertical-align: top;
              height: 100%;
            }
            .section-table th {
              background: #f5f5f5;
              font-weight: bold;
              text-align: center; 
              width: 220px;
              height: 100%;
            }
            .template-content {
              padding: 24px 40px 0 40px;
              box-sizing: border-box;
            }
            .highlight {
              font-weight: bold;
              color: #1a237e;
              height: 100%;
            }
            .tick {
              font-weight: bold;
              color: #388e3c;
              font-size: 18px;
              height: 100%;
            }
            .pdf-footer {
              position: fixed;
              bottom: 0;
              left: 0;
              width: 100%;
              text-align: center;
              color: #7f8c8d;
              font-size: 12px;
              border-top: 1px solid #eee;
              padding: 12px 40px;
              background-color: #fff;
              z-index: 1000;
            }
            .logo {
              margin-top: 24px;
              text-align: center;
              opacity: 0.15;
              height: 100%;
            }
            .var-value {
              font-weight: normal;
              color: #333;
              height: 100%;
            }
            .photos-section {
              margin: 24px 0;
              page-break-inside: avoid;
            }
            .photos-title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 16px;
              text-transform: uppercase;
              color: #1a237e;
            }
            .photo-grid {
              display: flex;
              flex-wrap: wrap;
              justify-content: flex-start;
              gap: 16px;
            }
            .photo-item {
              width: 48%;
              border: 1px solid #ddd;
              padding: 10px;
              text-align: center;
              vertical-align: top;
              box-sizing: border-box;
              page-break-inside: avoid;
            }
            .photo-item img {
              width: 100%;
              height: 260px;
              object-fit: contain;
              margin-bottom: 8px;
            }
            .photo-metadata {
              font-size: 12px;
              color: #555;
              text-align: left;
            }
            .photo-metadata div {
              margin-bottom: 4px;
            }
            .verification-summary {
              margin: 24px 0;
              font-size: 13px;
            }
            .verification-summary table {
              width: 100%;
              border-collapse: collapse;
            }
            .verification-summary td {
              padding: 6px 8px;
              border: 1px solid #ccc;
              vertical-align: top;
            }
            .verification-summary td:first-child {
              width: 220px;
              font-weight: bold;
              background: #f5f5f5;
            }
            .signature-section {
              margin: 16px 0 24px;
              text-align: left;
            }
            .signature-section img {
              max-width: 240px;
              height: auto;
              margin-top: 6px;
            }
        </style>
      </head>
      <body>
      <div class="header">
        <div>
          <div class="firm">KOWTHA & CO.</div>
          <div class="subtitle">CHARTERED ACCOUNTANTS</div>
          <div class="address">26-22-21, Mudunurivari Street, Gandhi Nagar, VIJAYAWADA – 520 003.</div>
        </div>
        <div class="contact">
          Mobile no: 9490008968 (AP), 8330961359 (TS)<br>
          Mail ID: opspd@gmail.com
        </div>
      </div>
      
    `;
};

export const pdBaseTemplateFooter = (html_data?: any) => {
  const currentDate = new Date();
  const timeZone = "Asia/Kolkata";
  const istDate = currentDate.toLocaleString("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const formatDate = (value?: any) => {
    if (!value) return "Not Provided";
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("en-GB", {
        timeZone: "Asia/Kolkata",
      });
    }
    return String(value);
  };

  const formatTime = (value?: any) => {
    if (!value) return "Not Provided";
    const stringValue = String(value).trim();
    if (/^\d{1,2}:\d{2}(:\d{2})?$/u.test(stringValue)) {
      return stringValue;
    }
    const parsed = new Date(stringValue);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleTimeString("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return stringValue;
  };

  const fieldVisitTimeDisplay = formatTime(html_data?.fieldVisitTime);
  const pdVerifiedDateDisplay = formatDate(html_data?.pdVerifiedDate);
  const pdVerifiedByDisplay = html_data?.pdVerifiedBy || "Not Provided";

  return `
      ${
        html_data?.imagesData
          ? `
        <div class="photos-section">
          <div class="photos-title">PHOTOS</div>
          ${html_data.imagesData}
        </div>
      `
          : ""
      }
      
      <div class="verification-summary">
        <table>
          <tr>
            <td>Field Visit Time</td>
            <td>${fieldVisitTimeDisplay}</td>
          </tr>
          <tr>
            <td>PD Verified By (Officer)</td>
            <td>${pdVerifiedByDisplay}</td>
          </tr>
          <tr>
            <td>PD Verified Date</td>
            <td>${pdVerifiedDateDisplay}</td>
          </tr>
        </table>
      </div>
      
      ${
        html_data?.imageDataUri
          ? `
        <div class="signature-section">
          <p style="margin:8px 0;line-height:1.5"><strong>Agency Name & Seal:</strong> Kowtha & Co.</p>
          <img src="${html_data.imageDataUri}" alt="Kowtha Signature" />
        </div>
      `
          : ""
      }
      
      <footer class="pdf-footer">
        <span style="color:rgb(8, 136, 36);">${html_data?.bankName || ""}</span><br>
        Generated on ${istDate}
      </footer>
    </body>
    </html>
    `;
};
