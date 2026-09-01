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
