export const baseTemplate = (address: string, mailId: string, loan: any) => {
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
              background: #fff;
              color: #222;
              position: relative;
              min-height: 60vh;
            }
            .header {
              text-align: left;
              padding: 24px 40px 8px 40px;
              border-bottom: 2px solid #2c3e50;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
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
            }
            .branch-box {
              width: 100%;
              margin: 18px 0 0 0;
              border: 2px solid #888;
              border-radius: 4px;
              background: #f8f9fa;
            }
            .branch-table {
              width: 100%;
              border-collapse: collapse;
            }
            .branch-table td {
              border: none;
              padding: 10px 16px;
              font-size: 16px;
            }
            .branch-label {
              font-weight: bold;
              width: 160px;
            }
            .branch-value {
              font-size: 18px;
              font-weight: bold;
              color: #222;
            }
            .branch-note {
              background: #ffe0b2;
              color: #b26a00;
              font-size: 13px;
              text-align: center;
              border-radius: 3px;
              font-weight: bold;
            }
            .section-table {
              width: 100%;
              margin: 24px 0 0 0;
              border-collapse: collapse;
              font-size: 15px;
            }
            .section-header {
              background: #f5f5f5;
              font-weight: bold;
              font-size: 16px;
              text-align: center;
              border: 1px solid #888;
              padding: 8px;
              letter-spacing: 1px;
            }
            .section-table th, .section-table td {
              border: 1px solid #888;
              padding: 8px 10px;
              vertical-align: top;
            }
            .section-table th {
              background: #f5f5f5;
              font-weight: bold;
              text-align: center; 
              width: 220px;
            }
            .highlight {
              font-weight: bold;
              color: #1a237e;
            }
            .tick {
              font-weight: bold;
              color: #388e3c;
              font-size: 18px;
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
              padding: 8px 0 6px 0;
              background-color: transparent;
              z-index: 1000;
            }
            .logo {
              margin-top: 24px;
              text-align: center;
              opacity: 0.15;
            }
            .var-value {
              font-weight: bold;
            }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="firm">KOWTHA & CO.</div>
            <div class="subtitle">CHARTERED ACCOUNTANTS</div>
            <div class="address">${address}</div>
          </div>
          <div class="contact">
            Mobile no: 8332037517<br>
            Mail ID: ${mailId}
          </div>
        </div>

        <div class="report-title">DUE DILIGENCE REPORT</div>

        <div class="align-wrapper">
          <div class="branch-box">
            <table class="branch-table">
              <tr>
                <td class="branch-label">Application Number</td>
                <td class="branch-value" style="border-right: 1px solid #000;">${loan.applicationNumber}</td>
                <td class="branch-label">Bank Name</td>
                <td class="branch-value">${loan.bankName}</td>
              </tr>
            </table>
          </div>
        </div>
    `;
};