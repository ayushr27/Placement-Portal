from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    # /health also reports which optional integrations are configured, so that a
    # misconfigured deployment is diagnosable without reading logs.
    assert set(body) == {"status", "redis", "mail", "cors_origins"}
    assert isinstance(body["cors_origins"], list)

def test_redirect_to_docs():
    response = client.get("/", follow_redirects=False)
    assert response.status_code == 307
    assert response.headers["location"] == "/docs"
