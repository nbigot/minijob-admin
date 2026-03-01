# API Reference

Complete API documentation for MiniJob Admin Dashboard backend integration.

## Base URL

```
http://localhost:8080/api
```

Configure via `VITE_API_BASE_URL` environment variable.

## Authentication

Currently, the API does not require authentication. In production environments, implement:

- API keys
- JWT tokens
- OAuth 2.0

## Response Format

### Success Response

```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 150
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid job parameters",
    "details": {
      "field": "topic",
      "reason": "Topic is required"
    }
  }
}
```

## HTTP Status Codes

| Code | Meaning                                        |
| ---- | ---------------------------------------------- |
| 200  | OK - Request succeeded                         |
| 201  | Created - Resource created successfully        |
| 204  | No Content - Success with no response body     |
| 400  | Bad Request - Invalid parameters               |
| 401  | Unauthorized - Authentication required         |
| 403  | Forbidden - Insufficient permissions           |
| 404  | Not Found - Resource doesn't exist             |
| 409  | Conflict - Resource conflict (e.g., duplicate) |
| 422  | Unprocessable Entity - Validation failed       |
| 500  | Internal Server Error - Server error           |
| 503  | Service Unavailable - Temporary unavailability |

---

## Jobs API

### List Jobs

```http
GET /api/jobs
```

**Query Parameters:**

| Parameter | Type    | Description                    | Example                  |
| --------- | ------- | ------------------------------ | ------------------------ |
| `status`  | string  | Filter by status               | `failed`, `running`      |
| `topic`   | string  | Filter by topic                | `email`, `report.daily`  |
| `search`  | string  | Search by name/ID              | `payment-123`            |
| `limit`   | integer | Results per page (default: 50) | `100`                    |
| `offset`  | integer | Pagination offset              | `50`                     |
| `sort`    | string  | Sort field                     | `created_at`, `priority` |
| `order`   | string  | Sort order                     | `asc`, `desc`            |

**Example Request:**

```bash
curl -X GET "http://localhost:8080/api/jobs?status=failed&topic=email&limit=20"
```

**Example Response:**

```json
{
  "jobs": [
    {
      "id": "job-123",
      "name": "Send Welcome Email",
      "topic": "email.welcome",
      "state": "failed",
      "priority": 1,
      "created_at": "2026-02-08T10:00:00Z",
      "updated_at": "2026-02-08T10:05:30Z",
      "started_at": "2026-02-08T10:00:10Z",
      "completed_at": "2026-02-08T10:05:30Z",
      "duration": 320,
      "error": "SMTP connection timeout",
      "requester": "api",
      "user_agent": "minijob-admin/1.0.0"
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20
  }
}
```

---

### Get Job Details

```http
GET /api/jobs/:id
```

**Path Parameters:**

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| `id`      | string | Job ID      |

**Example Request:**

```bash
curl -X GET "http://localhost:8080/api/jobs/job-123"
```

**Example Response:**

```json
{
  "id": "job-123",
  "name": "Send Welcome Email",
  "topic": "email.welcome",
  "state": "succeeded",
  "priority": 1,
  "created_at": "2026-02-08T10:00:00Z",
  "updated_at": "2026-02-08T10:05:30Z",
  "started_at": "2026-02-08T10:00:10Z",
  "completed_at": "2026-02-08T10:05:30Z",
  "duration": 320,
  "requester": "api",
  "user_agent": "minijob-admin/1.0.0",
  "session_id": "sess-789",
  "trace_id": "trace-abc123",
  "callback_url": "https://api.example.com/callback",
  "visibility_timeout": 0,
  "start_after": null,
  "locked_resources": ["user:12345"],
  "properties": {
    "user_id": 12345,
    "email": "user@example.com",
    "template": "welcome"
  },
  "history": [
    { "state": "created", "timestamp": "2026-02-08T10:00:00Z" },
    { "state": "queued", "timestamp": "2026-02-08T10:00:05Z" },
    { "state": "running", "timestamp": "2026-02-08T10:00:10Z" },
    { "state": "succeeded", "timestamp": "2026-02-08T10:05:30Z" }
  ]
}
```

---

### Create Job

```http
POST /api/jobs
```

**Request Body:**

```json
{
  "topic": "email.welcome",
  "name": "Send Welcome Email",
  "priority": 1,
  "requester": "api",
  "user_agent": "minijob-admin/1.0.0",
  "session_id": "sess-789",
  "trace_id": "trace-abc123",
  "callback_url": "https://api.example.com/callback",
  "visibility_timeout": 0,
  "start_after": "2026-02-08T14:00:00Z",
  "lock_resources": ["user:12345"],
  "properties": {
    "user_id": 12345,
    "email": "user@example.com",
    "template": "welcome"
  }
}
```

**Required Fields:**

- `topic` (string)
- `name` (string)

**Optional Fields:**

- `priority` (integer, 0-3, default: 0)
- `requester` (string)
- `user_agent` (string)
- `session_id` (string)
- `trace_id` (string)
- `callback_url` (string)
- `visibility_timeout` (integer, seconds)
- `start_after` (ISO 8601 timestamp)
- `lock_resources` (array of strings)
- `properties` (object)

**Example Response:**

```json
{
  "id": "job-456",
  "state": "created",
  "created_at": "2026-02-08T10:00:00Z",
  "message": "Job created successfully"
}
```

---

### Retry Job

```http
POST /api/jobs/:id/retry
```

**Path Parameters:**

| Parameter | Type   | Description     |
| --------- | ------ | --------------- |
| `id`      | string | Job ID to retry |

**Example Request:**

```bash
curl -X POST "http://localhost:8080/api/jobs/job-123/retry"
```

**Example Response:**

```json
{
  "new_job_id": "job-789",
  "state": "queued",
  "message": "Job retried successfully"
}
```

---

### Cancel Job

```http
POST /api/jobs/:id/cancel
```

**Path Parameters:**

| Parameter | Type   | Description      |
| --------- | ------ | ---------------- |
| `id`      | string | Job ID to cancel |

**Example Request:**

```bash
curl -X POST "http://localhost:8080/api/jobs/job-123/cancel"
```

**Example Response:**

```json
{
  "id": "job-123",
  "state": "canceled",
  "message": "Job canceled successfully"
}
```

---

### Delete Job

```http
DELETE /api/jobs/:id
```

**Path Parameters:**

| Parameter | Type   | Description      |
| --------- | ------ | ---------------- |
| `id`      | string | Job ID to delete |

**Example Request:**

```bash
curl -X DELETE "http://localhost:8080/api/jobs/job-123"
```

**Example Response:**

```json
{
  "message": "Job deleted successfully"
}
```

---

## Dashboard API

### Get Dashboard Statistics

```http
GET /api/dashboard/stats
```

**Example Response:**

```json
{
  "stats": {
    "total": 1500,
    "created": 10,
    "delayed": 25,
    "pending": 30,
    "queued": 50,
    "running": 20,
    "succeeded": 1200,
    "failed": 150,
    "canceled": 10,
    "deleted": 5
  },
  "timestamp": "2026-02-08T10:30:00Z"
}
```

---

### Get Activity Metrics

```http
GET /api/dashboard/metrics
```

**Query Parameters:**

| Parameter | Type   | Description | Example                              |
| --------- | ------ | ----------- | ------------------------------------ |
| `window`  | string | Time window | `1m`, `5m`, `15m`, `1h`, `6h`, `24h` |

**Example Request:**

```bash
curl -X GET "http://localhost:8080/api/dashboard/metrics?window=1h"
```

**Example Response:**

```json
{
  "metrics": {
    "active_jobs": 70,
    "stalled_jobs": 2,
    "success_rate": 88.9,
    "average_duration": 320
  },
  "window": "1h",
  "timestamp": "2026-02-08T10:30:00Z"
}
```

---

### Get Job Processing Chart Data

```http
GET /api/dashboard/chart
```

**Query Parameters:**

| Parameter  | Type   | Description         |
| ---------- | ------ | ------------------- |
| `window`   | string | Time window         |
| `interval` | string | Data point interval |

**Example Response:**

```json
{
  "data": {
    "timestamps": ["2026-02-08T09:00:00Z", "2026-02-08T09:05:00Z", "2026-02-08T09:10:00Z"],
    "succeeded": [45, 52, 48],
    "failed": [3, 5, 2],
    "pending": [10, 12, 8]
  }
}
```

---

## Resources API

### List Locked Resources

```http
GET /api/resources
```

**Query Parameters:**

| Parameter | Type    | Description        |
| --------- | ------- | ------------------ |
| `locked`  | boolean | Filter locked only |

**Example Response:**

```json
{
  "resources": [
    {
      "id": "user:12345",
      "locked_by": "job-123",
      "locked_at": "2026-02-08T10:00:10Z",
      "duration": 320
    }
  ]
}
```

---

### Unlock Resource

```http
POST /api/resources/:id/unlock
```

**Example Response:**

```json
{
  "message": "Resource unlocked successfully"
}
```

---

### Unlock All Resources

```http
POST /api/resources/unlock-all
```

**Example Response:**

```json
{
  "unlocked_count": 15,
  "message": "All resources unlocked successfully"
}
```

---

## Topics API

### List Topics

```http
GET /api/topics
```

**Example Response:**

```json
{
  "topics": [
    {
      "name": "email.welcome",
      "count": 500,
      "percentage": 33.3,
      "success_rate": 98.5,
      "average_duration": 450,
      "active_jobs": 10
    }
  ]
}
```

---

### Get Topic Distribution

```http
GET /api/topics/distribution
```

**Example Response:**

```json
{
  "distribution": [
    { "topic": "email.welcome", "count": 500, "percentage": 33.3 },
    { "topic": "report.daily", "count": 300, "percentage": 20.0 },
    { "topic": "import.users", "count": 200, "percentage": 13.3 }
  ]
}
```

---

## Health API

### Get Health Status

```http
GET /api/health
```

**Example Response:**

```json
{
  "status": "healthy",
  "timestamp": "2026-02-08T10:30:00Z",
  "response_time": 45,
  "uptime": 86400,
  "version": "1.0.0",
  "checks": {
    "database": "healthy",
    "queue": "healthy",
    "workers": "healthy"
  }
}
```

---

## System API

### Restart Server

```http
POST /api/system/restart
```

**Example Response:**

```json
{
  "message": "Server restart initiated"
}
```

---

### Shutdown Server

```http
POST /api/system/shutdown
```

**Example Response:**

```json
{
  "message": "Server shutdown initiated"
}
```

---

### Delete All Jobs

```http
DELETE /api/system/jobs
```

**Example Response:**

```json
{
  "deleted_count": 1500,
  "message": "All jobs deleted successfully"
}
```

---

## Rate Limiting

API rate limits (if implemented):

- **Per IP**: 1000 requests/hour
- **Per User**: 5000 requests/hour
- **Burst**: 100 requests/minute

**Rate Limit Headers:**

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1707392400
```

## Pagination

For list endpoints:

```http
GET /api/jobs?limit=50&offset=100
```

**Response includes:**

```json
{
  "data": [...],
  "meta": {
    "total": 1500,
    "limit": 50,
    "offset": 100,
    "page": 3
  }
}
```

## Filtering

Multiple filters can be combined:

```http
GET /api/jobs?status=failed&topic=email&search=timeout&limit=20
```

## Sorting

```http
GET /api/jobs?sort=created_at&order=desc
```

**Sortable Fields:**

- `created_at`
- `updated_at`
- `priority`
- `duration`
- `state`

## Error Codes

| Code                  | Description               |
| --------------------- | ------------------------- |
| `VALIDATION_ERROR`    | Request validation failed |
| `NOT_FOUND`           | Resource not found        |
| `CONFLICT`            | Resource conflict         |
| `INTERNAL_ERROR`      | Server error              |
| `RATE_LIMIT_EXCEEDED` | Too many requests         |
| `SERVICE_UNAVAILABLE` | Temporary unavailability  |

## WebSocket API (Future)

Real-time updates via WebSocket:

```javascript
const ws = new WebSocket("ws://localhost:8080/ws");

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  // Handle real-time job updates
};
```

## Next Steps

- **[Jobs Management](/guide/features/jobs)** - Using the Jobs API
- **[Dashboard](/guide/features/dashboard)** - Using the Dashboard API
- **[Configuration](/guide/configuration)** - API configuration
