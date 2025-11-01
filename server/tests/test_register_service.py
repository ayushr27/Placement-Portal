import pytest
from fastapi import HTTPException
from src.services.register import process_student_csv


class FakeCollection:
    """Minimal async collection mock."""
    def __init__(self):
        self.data = []
        self.find_one_called_with = None
        self.insert_many_called_with = None

    async def find_one(self, query):
        self.find_one_called_with = query
        for doc in self.data:
            if doc["email"] == query.get("email"):
                return doc
        return None

    async def insert_many(self, docs):
        self.insert_many_called_with = docs
        self.data.extend(docs)
        return {"inserted_ids": [1] * len(docs)}


class FakeDB:
    """Minimal DB mock with only students collection."""
    def __init__(self):
        self.students = FakeCollection()


@pytest.mark.asyncio
async def test_missing_required_columns():
    db = FakeDB()
    bad_csv = "email,name\njohn@example.com,John\n"
    file_bytes = bad_csv.encode("utf-8")

    with pytest.raises(HTTPException) as exc:
        await process_student_csv(db, file_bytes)
    assert exc.value.status_code == 400
    assert "CSV missing required columns" in exc.value.detail


@pytest.mark.asyncio
async def test_existing_student_skipped(monkeypatch):
    db = FakeDB()
    db.students.data.append({"email": "jane@example.com"})

    csv_content = (
        "name,email,roll_number,branch,batch,course\n"
        "Jane Doe,jane@example.com,101,CSE,2027,BTech\n"
    )
    file_bytes = csv_content.encode("utf-8")

    # Patch send_email_to_student to avoid real sending
    monkeypatch.setattr("src.services.utils.send_email_to_student", lambda *a, **k: None)

    result = await process_student_csv(db, file_bytes)
    assert result == {
        "inserted_count": 0,
        "inserted_emails": [],
        "message": "No new students added"
    }


@pytest.mark.asyncio
async def test_new_student_insert_and_email(monkeypatch):
    db = FakeDB()

    csv_content = (
        "name,email,roll_number,branch,batch,course\n"
        "John Doe,john@example.com,102,ME,2027,BTech\n"
    )
    file_bytes = csv_content.encode("utf-8")

    sent_emails = []
    def fake_send_email(background_tasks, email, subject, body):
        sent_emails.append((email, subject, body))

    monkeypatch.setattr("src.services.register.queue_email_task", fake_send_email)

    result = await process_student_csv(db, file_bytes, background_tasks=None)

    assert result["inserted_count"] == 1
    assert "john@example.com" in result["inserted_emails"]
    assert len(sent_emails) == 1
    assert "John Doe" in sent_emails[0][2]
