// Paste this into Google Apps Script (Extensions → Apps Script in your Google Sheet)
// Then Deploy → New Deployment → Web App → Anyone can access → Deploy
// Copy the URL and add it to your Vercel environment variables as SHEET_LOG_URL

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date().toISOString(),
    data.mode || '',
    data.question || '',
    data.response || '',
    data.largeText ? 'large' : 'normal'
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
