from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    # /health reports which optional integrations are configured, so that a
    # misconfigured deployment is diagnosable without reading logs. It must not
    # report the CORS allowlist: that is deployment topology, and this endpoint
    # is anonymous.
    assert set(body) == {"status", "redis", "mail"}


def test_root_does_not_expose_docs_by_default():
    """
    Swagger published every route and schema to anonymous callers. With
    ENABLE_DOCS unset (the default, and what production runs), `/` must answer
    directly rather than redirecting to it.
    """
    response = client.get("/", follow_redirects=False)
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_docs_endpoints_are_disabled_by_default():
    for path in ("/docs", "/redoc", "/openapi.json"):
        assert client.get(path).status_code == 404, path
