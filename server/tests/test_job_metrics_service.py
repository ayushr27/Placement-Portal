import pytest
from fastapi import HTTPException
from datetime import datetime, timedelta, timezone
from src.services.job_metrics import calculate_metrics, update_or_create_job_metrics, update_all_jobs_metrics

class FakeJob:
    def __init__(self, _id="123", deadline=None, metrics=None, responses_sheet_link=None, admin_doc={}):
        self._id = _id
        self.application_deadline = deadline
        self.metrics = metrics
        self.responses_sheet_link = responses_sheet_link
        self.admin_doc = admin_doc

class FakeAsyncCursor:
    def __init__(self, items):
        self.items = items

    def __aiter__(self):
        async def gen():
            for item in self.items:
                # unwrap object to dict if needed
                yield item.__dict__ if hasattr(item, "__dict__") else item
        return gen()


class FakeJobsCollection:
    def __init__(self, items):
        self.items = items

    async def find_one(self, query):
        _id = query.get("_id")
        for item in self.items:
            doc = item.__dict__ if hasattr(item, "__dict__") else item
            if doc.get("_id") == _id:
                return doc
        return None

    def find(self, query):
        # ignoring query, return all items
        return FakeAsyncCursor(self.items)


class FakeCollection:
    def __init__(self):
        self.storage = {}

    async def find_one(self, query):
        job_id = query.get("job_id")
        return self.storage.get(job_id)

    async def update_one(self, filter, update, upsert=False):
        job_id = filter.get("job_id")
        self.storage[job_id] = update.get("$set", {})
        return True


class FakeDB:
    def __init__(self, jobs=None):
        self.jobs = FakeJobsCollection(jobs or [])
        self.job_metrics = FakeCollection()



@pytest.mark.asyncio
async def test_calculate_metrics_job_not_found():
    db = FakeDB()
    with pytest.raises(Exception):  # 404 case
        await calculate_metrics(db, "missing")

@pytest.mark.asyncio
async def test_calculate_metrics_missing_sheet():
    job = FakeJob(responses_sheet_link=None)
    db = FakeDB([job])
    with pytest.raises(Exception):  # 400 case
        await calculate_metrics(db, job._id)

@pytest.mark.asyncio
async def test_calculate_metrics_empty_responses(monkeypatch):
    job = FakeJob(responses_sheet_link="link")
    db = FakeDB([job])
    monkeypatch.setattr("src.services.job_metrics.fetch_form_responses", lambda *_: [])
    metrics = await calculate_metrics(db, job._id, job.admin_doc)
    assert metrics == {"gender_wise": {}, "branch_wise": {}}

@pytest.mark.asyncio
async def test_calculate_metrics_with_data(monkeypatch):
    job = FakeJob(responses_sheet_link="link")
    db = FakeDB([job])
    monkeypatch.setattr(
        "src.services.job_metrics.fetch_form_responses",
        lambda *_: [{"gender": "M", "branch": "CSE"}, {"gender": "F", "branch": "ECE"}],
    )
    metrics = await calculate_metrics(db, job._id, job.admin_doc)
    assert metrics["gender_wise"]["M"] == 1
    assert metrics["gender_wise"]["F"] == 1
    assert metrics["branch_wise"]["CSE"] == 1
    assert metrics["branch_wise"]["ECE"] == 1

@pytest.mark.asyncio
async def test_update_or_create_job_metrics_skip_deadline(monkeypatch):
    job = FakeJob(deadline=datetime.now(timezone.utc) - timedelta(weeks=1) - timedelta(days=1), responses_sheet_link="dummy")
    db = FakeDB([job])

    async def fake_calculate_metrics(*_):
        return {"gender_wise": {}, "branch_wise": {}}

    monkeypatch.setattr("src.services.job_metrics.calculate_metrics", fake_calculate_metrics)

    updated = await update_or_create_job_metrics(db, job.__dict__, job.admin_doc)

    assert updated is False

@pytest.mark.asyncio
async def test_update_or_create_job_metrics_triggers(monkeypatch):
    job = FakeJob(deadline=datetime.now(timezone.utc) + timedelta(days=1), responses_sheet_link="link")
    db = FakeDB([job])

    async def fake_calculate_metrics(*_, **__):
        return {"dummy": 1}

    monkeypatch.setattr("src.services.job_metrics.calculate_metrics", fake_calculate_metrics)

    updated = await update_or_create_job_metrics(db, job.__dict__, job.admin_doc)
    assert updated is True

@pytest.mark.asyncio
async def test_update_all_jobs_metrics(monkeypatch):
    job = FakeJob(deadline=datetime.now(timezone.utc) + timedelta(days=1), responses_sheet_link="link")
    fake_jobs = [
        {"_id": "1", "title": "SWE", "responses_sheet_link": "link"},
        {"_id": "2", "title": "DS", "responses_sheet_link": "link"}
    ]
    db = FakeDB(fake_jobs)

    async def fake_calculate_metrics(*_):
        return {"gender_wise": {}, "branch_wise": {}}

    monkeypatch.setattr("src.services.job_metrics.calculate_metrics", fake_calculate_metrics)

    updated = await update_all_jobs_metrics(db, job.admin_doc)

    assert updated == ["1", "2"]



@pytest.mark.asyncio
async def test_one_job_without_a_sheet_does_not_fail_the_whole_batch(monkeypatch):
    """
    Regression for the reported "can't check the metrics" error.

    calculate_metrics raises HTTPException(400) for a job with no responses
    sheet. update_all_jobs_metrics caught that with a broad `except Exception`
    and re-raised it as a 500 for the entire batch, so a single job posted
    without a form link made the metrics refresh fail for every other job -
    permanently, since the bad job stays in the collection.
    """
    no_sheet = FakeJob(_id="no-sheet", responses_sheet_link=None)
    good = FakeJob(
        _id="has-sheet",
        responses_sheet_link="link",
        deadline=datetime.now(timezone.utc) + timedelta(days=1),
    )
    db = FakeDB([no_sheet, good])

    async def fake_calculate_metrics(_db, job_id, *_args, **_kwargs):
        if job_id == "no-sheet":
            raise HTTPException(status_code=400, detail="Job has no response sheet link")
        return {"gender_wise": {}, "branch_wise": {}}

    monkeypatch.setattr(
        "src.services.job_metrics.calculate_metrics", fake_calculate_metrics
    )

    updated = await update_all_jobs_metrics(db, {})

    # The healthy job still gets metrics; the broken one is skipped, not fatal.
    assert updated == ["has-sheet"]
