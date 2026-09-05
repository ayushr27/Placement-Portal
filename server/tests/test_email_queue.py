"""
Guards the queue_email_task call contract.

register.py called it positionally as
    queue_email_task(background_tasks, email, subject, body)
against the real signature
    queue_email_task(email, subject, body, background_tasks=None)

so `body` landed in `background_tasks`, `if background_tasks:` was truthy for
any non-empty string, and .add_task() raised
`AttributeError: 'str' object has no attribute 'add_task'`.
Every CSV student upload returned 500, which is why no students could be
created and student login had no accounts to authenticate against.

These tests exercise the real function, not a stub, so the signature and its
caller cannot drift apart again.
"""

import inspect

from fastapi import BackgroundTasks

from src.services import utils as service_utils
from src.services.utils import queue_email_task


def test_signature_is_email_first():
    """The parameter order the caller relies on."""
    params = list(inspect.signature(queue_email_task).parameters)
    assert params == ["email", "subject", "body", "background_tasks"]


def test_queues_when_mail_configured(monkeypatch):
    monkeypatch.setattr(service_utils.secrets, "MAIL_USERNAME", "tpo@example.edu")
    monkeypatch.setattr(service_utils.secrets, "MAIL_PASSWORD", "app-password")

    bt = BackgroundTasks()
    queued = queue_email_task(
        email="student@example.edu",
        subject="Your Student Account Credentials",
        body="hello",
        background_tasks=bt,
    )

    assert queued is True
    assert len(bt.tasks) == 1
    # Arguments must reach the sender in the right order.
    assert bt.tasks[0].args == (
        "student@example.edu",
        "Your Student Account Credentials",
        "hello",
    )


def test_skips_and_reports_when_mail_not_configured(monkeypatch):
    """With no SMTP credentials the caller must learn the mail was not sent."""
    monkeypatch.setattr(service_utils.secrets, "MAIL_USERNAME", "")
    monkeypatch.setattr(service_utils.secrets, "MAIL_PASSWORD", "")

    bt = BackgroundTasks()
    queued = queue_email_task(
        email="student@example.edu",
        subject="s",
        body="b",
        background_tasks=bt,
    )

    assert queued is False
    assert bt.tasks == []


def test_register_calls_it_with_valid_arguments(monkeypatch):
    """
    The original defect, end to end: drive the real CSV path with the real
    queue_email_task and assert it does not raise.
    """
    import asyncio

    from src.services.register import process_student_csv

    monkeypatch.setattr(service_utils.secrets, "MAIL_USERNAME", "tpo@example.edu")
    monkeypatch.setattr(service_utils.secrets, "MAIL_PASSWORD", "app-password")

    class FakeCollection:
        async def find_one(self, *a, **k):
            return None

        async def insert_many(self, docs):
            self.docs = docs

    class FakeDB:
        students = FakeCollection()

        def __getitem__(self, name):
            return self.students

    csv_bytes = (
        b"name,email,roll_number,branch,batch,course\n"
        b"Jane Roe,jane@example.edu,B21CS002,CSE,2027,BTech\n"
    )

    result = asyncio.run(
        process_student_csv(FakeDB(), csv_bytes, background_tasks=BackgroundTasks())
    )

    assert result["inserted_count"] == 1
    assert result["emailed_count"] == 1
