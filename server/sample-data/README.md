# Sample data

## `students-sample.csv`

A ready-to-upload file for testing **Admin dashboard → Add Student CSV**.

The 12 students in it are not in the database, so uploading it inserts all 12.
Once you have uploaded it, uploading it again correctly reports
`No new students added` — the importer de-duplicates on email address, so to
repeat the test you need to change the emails (or delete those students first).

Every address is on `example.com`, which IANA reserves for documentation. The
credential emails the portal sends therefore bounce instead of reaching a real
person. **Replace these with real addresses before using this for an actual
intake**, otherwise nobody receives their password.

### Columns

| Column | Required | Notes |
|---|---|---|
| `name` | yes | Full name |
| `email` | yes | Also becomes the login username, and must be unique |
| `roll_number` | yes | Unique per student |
| `branch` | no | e.g. `CSE`, `ECE`, `MECH`, `EEE`, `Civil`, `AIDS` |
| `batch` | no | Year of graduation, e.g. `2027` |
| `course` | no | e.g. `B.Tech` |
| `gender` | no | Free text |
| `phone_no` | no | Free text |

Column order does not matter; the header names do. Extra columns are ignored.

### What happens on upload

1. Each row is validated. A bad row rejects the whole file with a 400 naming
   the offending email, so nothing is half-imported.
2. Rows whose email already exists are skipped, as are duplicate emails inside
   the file itself.
3. A random 16-character password is generated per student (from `secrets`, not
   `random`), stored only as a bcrypt hash, and emailed to them.
4. If SMTP is not configured, the response body contains the generated
   passwords instead — they cannot be recovered afterwards, so distribute them
   immediately or reset them.

### Limits and failure modes

- Maximum upload size is 5 MB; larger files are rejected with 413.
- The filename must end in `.csv`.
- Save as **CSV UTF-8**. A Windows-1252 export is also accepted, but anything
  else is rejected with a message telling you to re-save.
- Only an admin session can upload; the endpoint returns 401/403 otherwise.
