/**
 * Apps Script web app backing APPS_SCRIPT_URL.
 *
 * The backend POSTs {formId, jobTitle} when an admin creates a job
 * (src/services/jobs.py -> create_sheet_for_job) and expects HTTP 200 with:
 *
 *   { "sheetUrl": "https://docs.google.com/spreadsheets/d/...",
 *     "publishedUrl": "https://docs.google.com/forms/d/e/.../viewform" }
 *
 * `formId` is the form's FILE id, taken from the edit URL
 * (https://docs.google.com/forms/d/<FILE_ID>/edit). The published id in a
 * share URL (/forms/d/e/<PUBLISHED_ID>/viewform) is a different value and
 * cannot be opened by FormApp, which is why the admin must paste the edit link.
 *
 * `publishedUrl` is returned so the backend can store the public link for
 * students rather than the edit link the admin pasted.
 *
 * -- Deploy ---------------------------------------------------------------
 *  1. script.google.com -> New project, paste this file, save.
 *  2. Deploy -> New deployment -> type "Web app".
 *  3. Execute as: Me.  Who has access: Anyone.
 *  4. Authorize when prompted (it needs Forms + Sheets + Drive access).
 *  5. Copy the /exec URL -> that is APPS_SCRIPT_URL.
 *
 * "Anyone" is required because the backend calls it server-to-server with no
 * Google credentials. The URL is unguessable, but treat it as a secret: anyone
 * holding it can create spreadsheets in this account.
 */

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ error: 'Missing request body' });
    }

    var body = JSON.parse(e.postData.contents);
    var formId = body.formId;
    var jobTitle = body.jobTitle || 'Job';

    if (!formId) {
      return json({ error: 'formId is required' });
    }

    var form = FormApp.openById(formId);

    // One spreadsheet per job, holding that job's responses.
    var ss = SpreadsheetApp.create(jobTitle + ' - Responses');
    form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

    return json({
      sheetUrl: ss.getUrl(),
      publishedUrl: form.getPublishedUrl(),
    });
  } catch (err) {
    // Surface the reason; the backend logs the response body.
    return json({ error: String(err) });
  }
}

/** Health check: opening the /exec URL in a browser should show this. */
function doGet() {
  return json({ status: 'ok', expects: 'POST {formId, jobTitle}' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
