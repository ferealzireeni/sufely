# SUFELY Coming Soon Website

Standalone coming-soon website with a Request Early Access form.

## Connect Google Apps Script

1. Create a Google Sheet.
2. Go to Extensions > Apps Script.
3. Paste this script:

```js
const NOTIFICATION_EMAIL = "ferealzireeni@gmail.com";

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.name || "",
    data.email || "",
    data.company || "",
    data.role || "",
    data.message || "",
    data.source || "",
    data.submittedAt || ""
  ]);

  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: "New SUFELY Early Access Request",
    htmlBody: `
      <h2>New SUFELY Early Access Request</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.name || "")}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email || "")}</p>
      <p><strong>Company:</strong> ${escapeHtml(data.company || "")}</p>
      <p><strong>Role:</strong> ${escapeHtml(data.role || "")}</p>
      <p><strong>Message:</strong><br>${escapeHtml(data.message || "").replace(/\n/g, "<br>")}</p>
      <p><strong>Source:</strong> ${escapeHtml(data.source || "")}</p>
      <p><strong>Submitted at:</strong> ${escapeHtml(data.submittedAt || "")}</p>
    `,
    replyTo: data.email || NOTIFICATION_EMAIL
  });

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
```

4. Deploy > New deployment > Web app.
5. Set "Who has access" to "Anyone".
6. Copy the Web app URL.
7. Paste it into `script.js`:

```js
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
```

Open `index.html` directly or serve this folder with a static server.
