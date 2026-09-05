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
 *  2. Project Settings -> Script Properties -> add APPS_SCRIPT_TOKEN with a
 *     random value (openssl rand -hex 32), and set the same value as the
 *     backend's APPS_SCRIPT_TOKEN environment variable.
 *  3. Deploy -> New deployment -> type "Web app".
 *  4. Execute as: Me.  Who has access: Anyone.
 *  5. Authorize when prompted (it needs Forms + Sheets + Drive access).
 *  6. Copy the /exec URL -> that is APPS_SCRIPT_URL.
 *
 * "Anyone" is required because the backend calls it server-to-server with no
 * Google credentials, so the token in step 2 is what actually authenticates the
 * caller. Without it, anyone holding the URL can create spreadsheets in this
 * account and repoint any form it can open. Still treat the URL as a secret.
 */

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ error: 'Missing request body' });
    }

    var body = JSON.parse(e.postData.contents);

    // The deployment must be reachable by "Anyone" for the backend to call it
    // without Google credentials, so without this check the URL alone is the
    // only protection - and anyone who obtained it could create unlimited
    // spreadsheets here, or call setDestination on any form this account can
    // open and divert a live recruitment form's responses to a sheet of their
    // choosing. Set APPS_SCRIPT_TOKEN in Script Properties to the same value as
    // the backend's APPS_SCRIPT_TOKEN environment variable.
    var expectedToken = PropertiesService
      .getScriptProperties()
      .getProperty('APPS_SCRIPT_TOKEN');
    if (expectedToken && !constantTimeEquals(String(body.token || ''), expectedToken)) {
      return json({ error: 'Unauthorized' });
    }

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

/**
 * Compare two strings without leaking their common prefix length via timing.
 * Apps Script has no crypto.timingSafeEqual, so this is done by hand.
 */
function constantTimeEquals(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  var diff = 0;
  for (var i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
