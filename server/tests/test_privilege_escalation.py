"""
Regression tests for the student -> admin privilege escalation.

The bug chained four things:

1. `StudentEditProfile` carried a writable `role` field.
2. `PUT /profile/student/update` declared `update: StudentEditProfile = Depends()`,
   which binds every field as a query parameter, and wrote the whole model into
   `$set` with no allowlist.
3. Student documents really do store `role` (set by the CSV importer).
4. `get_current_user` read `role` back off the stored document rather than the
   collection the user was found in.

So `PUT /profile/student/update?...&role=admin` with an ordinary student token
made that student an admin from the next request onward - with the same,
unchanged token, which is why nothing in the logs showed an escalation.

These tests pin each link of the chain independently, so re-breaking any one of
them fails here rather than in production.
"""

import asyncio

import pytest
from fastapi.testclient import TestClient

import main
from src.database import get_database
from src.routes import utils as routes_utils
from src.routes.schemas import IMMUTABLE_STUDENT_FIELDS, StudentEditProfile


STUDENT_DOC = {
    "_id": "stu1",
    "username": "aarav.sharma@example.com",
    "email": "aarav.sharma@example.com",
    "roll_number": "B21CS001",
    "name": "Aarav Sharma",
    "branch": "CSE",
    "batch": 2027,
    "role": "student",
    "hashed_password": "not-a-real-hash",
    "has_edited_profile": False,
}


class FakeStudents:
    """Minimal stand-in for db.students that records what was written."""

    def __init__(self, doc):
        self.doc = dict(doc)
        self.last_set = None

    async def find_one(self, *_args, **_kwargs):
        return dict(self.doc)

    async def update_one(self, _filter, update, **_kwargs):
        self.last_set = update["$set"]
        self.doc.update(update["$set"])

        class Result:
            matched_count = 1

        return Result()


class FakeDB:
    def __init__(self, students):
        self.students = students


@pytest.fixture
def students():
    return FakeStudents(STUDENT_DOC)


@pytest.fixture
def client(students):
    """
    TestClient authenticated as an ordinary student.

    The override is keyed on the bound method object, because that is what
    `Depends(security.get_current_user)` captured at import time -
    monkeypatching the attribute afterwards would not be seen by the router.
    """

    async def fake_get_current_user():
        return dict(students.doc)

    main.app.dependency_overrides[get_database] = lambda: FakeDB(students)
    main.app.dependency_overrides[routes_utils.security.get_current_user] = (
        fake_get_current_user
    )
    yield TestClient(main.app)
    main.app.dependency_overrides.clear()


# --- 1. the schema must not expose privileged fields -----------------------


def test_role_is_not_an_editable_field():
    """The field that made the escalation possible must stay gone."""
    assert "role" not in StudentEditProfile.model_fields


@pytest.mark.parametrize("field", ["role", "username", "email", "roll_number"])
def test_privileged_fields_absent_from_edit_schema(field):
    assert field not in StudentEditProfile.model_fields
    assert field in IMMUTABLE_STUDENT_FIELDS


# --- 2. the handler must reject / ignore them ------------------------------


def test_student_cannot_set_own_role_via_body(client, students):
    """The core exploit: role=admin in the update payload."""
    response = client.put(
        "/profile/student/update",
        json={"name": "Aarav Sharma", "role": "admin"},
    )

    # extra="forbid" rejects it outright; if that is ever relaxed, the
    # assertions below still hold because the handler filters as well.
    assert response.status_code in (200, 422)
    assert students.doc["role"] == "student"
    if students.last_set is not None:
        assert "role" not in students.last_set


def test_student_cannot_set_role_via_query_string(client, students):
    """
    The original attack shape.

    The handler used `= Depends()`, so every model field was a query parameter
    and the exploit was a plain URL. The payload is a body now, so these are
    ignored entirely.
    """
    response = client.put(
        "/profile/student/update?role=admin&username=admin",
        json={"name": "Aarav Sharma"},
    )

    assert response.status_code == 200
    assert students.doc["role"] == "student"
    assert students.last_set is not None
    assert "role" not in students.last_set
    assert "username" not in students.last_set


def test_omitted_fields_are_not_nulled_out(client, students):
    """
    Regression for the silent, irreversible profile wipe.

    `exclude_unset` was a no-op under `Depends()`, and unlike the admin path
    there was no `is not None` filter, so `$set` wrote null over every field the
    student did not supply - CGPAs, DOB, addresses, resume and ID links - and
    `has_edited_profile = True` then blocked any correction.
    """
    response = client.put("/profile/student/update", json={"name": "Aarav S"})

    assert response.status_code == 200
    assert students.last_set["name"] == "Aarav S"
    for untouched in ("branch", "batch", "resume_link", "current_address"):
        assert untouched not in students.last_set


# --- 3. authorization must not trust the stored role -----------------------


def test_stored_role_cannot_grant_admin():
    """
    Defence in depth.

    Even if a tampered document survives in the database, resolving a user out
    of db.students must report them as a student.
    """
    tampered = dict(STUDENT_DOC, role="admin")

    class DB:
        class students:
            @staticmethod
            async def find_one(*_args, **_kwargs):
                return dict(tampered)

        class admins:
            @staticmethod
            async def find_one(*_args, **_kwargs):
                return None

    user = asyncio.run(
        routes_utils.get_user_from_collection(
            DB, "aarav.sharma@example.com", "student"
        )
    )

    assert user["role"] == "student"


# --- 4. endpoints that used to be reachable without a token ----------------


@pytest.mark.parametrize(
    "method,path",
    [
        # Was fully unauthenticated: anyone could mutate jobs and drive Google
        # API calls on the admin's OAuth credentials.
        ("POST", "/api/jobs/sync-expired"),
        # Was public: leaked every Google spreadsheet_id and admin_id.
        ("GET", "/api/jobs/master-sheets"),
        # Was public: leaked the admin's email and the internal sheet links.
        ("GET", "/api/jobs/get-jobs"),
    ],
)
def test_endpoint_requires_authentication(method, path):
    from fastapi.testclient import TestClient

    with TestClient(main.app) as anon:
        assert anon.request(method, path).status_code == 401, path


def test_api_docs_are_not_published_by_default():
    """Swagger exposed the whole admin API surface to anonymous callers."""
    from fastapi.testclient import TestClient

    with TestClient(main.app) as anon:
        for path in ("/docs", "/redoc", "/openapi.json"):
            assert anon.get(path).status_code == 404, path
