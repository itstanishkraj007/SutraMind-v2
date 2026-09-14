from datetime import datetime, timezone
from tests.conftest import auth_headers, login


def test_sync_pull_initial(client):
    token = login(client, "coordinator@sutramind.local")
    headers = auth_headers(token)
    res = client.get("/api/v1/sync/pull?cursor=0", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "changes" in data
    assert "cursor" in data
    assert "timestamp" in data
    assert isinstance(data["changes"], dict)


def test_sync_push_empty_batch_rejected(client):
    token = login(client, "coordinator@sutramind.local")
    headers = auth_headers(token)
    res = client.post("/api/v1/sync/push", headers=headers, json={"operations": []})
    assert res.status_code == 422


def test_sync_push_and_pull_lifecycle(client):
    token = login(client, "coordinator@sutramind.local")
    headers = auth_headers(token)
    now_iso = datetime.now(timezone.utc).isoformat()
    push_payload = {
        "operations": [
            {
                "operation_id": "11111111-1111-1111-1111-111111111111",
                "entity_type": "MasterTerm",
                "entity_id": "99999999-9999-9999-9999-999999999999",
                "operation": "Create",
                "payload_json": (
                    '{"id": "99999999-9999-9999-9999-999999999999", '
                    '"category": "TEST_CAT", "code": "T01", '
                    '"label_en": "Test Term", "label_hi": "परीक्षण", "active": true}'
                ),
                "occurred_at_utc": now_iso,
            }
        ]
    }
    res = client.post("/api/v1/sync/push", headers=headers, json=push_payload)
    assert res.status_code == 200
    data = res.json()
    assert "11111111-1111-1111-1111-111111111111" in data["applied"]
    assert data["server_cursor"] >= 1

    pull_res = client.get("/api/v1/sync/pull?cursor=0", headers=headers)
    assert pull_res.status_code == 200
    pull_data = pull_res.json()
    assert "MasterTerm" in pull_data["changes"]
