# System Administration

The **System Administration** page provides critical management operations for your MiniJob backend server. It allows administrators to control server lifecycle, perform bulk data operations, and manage resource locks from a single interface.

![System Admin](/images/screenshots/system.png)

::: warning Access Control
System administration operations are powerful and potentially destructive. Restrict access to this page in production environments.
:::

## Overview

The System Admin view is organized into two main sections:

- **Server Control** — Start, restart, or shut down the MiniJob backend server
- **Bulk Operations** — Mass-delete jobs, clear queues, and unlock all resources

All destructive actions require explicit confirmation via a modal dialog before executing.

## Server Control

### Restart Server

Sends a restart signal to the MiniJob backend process. The server will gracefully stop and restart, re-establishing all connections.

**When to use:**

- After changing backend configuration
- When the server appears unresponsive but jobs are still queued
- After deploying a new backend version

::: tip
Running jobs are allowed to complete before the server restarts when graceful shutdown is configured in the backend.
:::

### Shutdown Server

Sends a shutdown signal to stop the MiniJob backend process completely.

::: danger
Shutting down the server will stop all job processing. Running jobs may be interrupted depending on backend configuration. Use this only when intentionally stopping the service.
:::

## Bulk Operations

### Delete All Jobs

Permanently removes **all jobs** from the system regardless of their state (created, queued, running, succeeded, failed, etc.).

**API endpoint:** `DELETE /api/v1/jobs/`

::: danger Irreversible Action
This operation cannot be undone. All job history, results, and metadata will be permanently lost. Take a backup before proceeding.
:::

**Use cases:**

- Resetting a development or staging environment
- Clearing test data before a fresh test run
- Emergency cleanup of a flooded job queue

### Clear Job Queues

Removes all jobs that are currently in **queued** state, waiting to be processed. Jobs in other states (running, succeeded, failed) are not affected.

**API endpoint:** `DELETE /api/v1/jobs/queued`

::: warning
Jobs that are already running will **not** be stopped. Only pending queued items are removed.
:::

**Use cases:**

- Discarding a backlog of obsolete queued jobs
- Recovering from a runaway job producer
- Resetting the queue before a maintenance window

### Unlock All Resources

Releases all resource locks held by any job. This is useful when resources remain locked after a job crash or unexpected termination.

**API endpoint:** `POST /api/v1/resources/unlock`

::: warning
Unlocking resources while jobs are actively running may cause **resource conflicts**. Running jobs that hold locks may behave unexpectedly. Confirm no jobs are running before using this operation.
:::

**Use cases:**

- Recovering stuck resources after a job crash
- Resetting lock state after a server failure
- Development environment cleanup

## Confirmation Flow

Every operation in System Admin uses a confirmation modal to prevent accidental execution:

1. Click the action button (e.g., **Delete All Jobs**)
2. A confirmation dialog appears describing the action and its impact
3. Click **Confirm** to proceed, or **Cancel** to abort
4. A success or failure notification is shown after the operation completes

## API Reference

| Operation            | Method   | Endpoint                        |
| -------------------- | -------- | ------------------------------- |
| Restart Server       | `POST`   | `/api/v1/admin/server/restart`  |
| Shutdown Server      | `POST`   | `/api/v1/admin/server/shutdown` |
| Delete All Jobs      | `DELETE` | `/api/v1/jobs/`                 |
| Clear Queued Jobs    | `DELETE` | `/api/v1/jobs/queued`           |
| Unlock All Resources | `POST`   | `/api/v1/resources/unlock`      |

## Related Pages

- [Jobs Management](/guide/features/jobs) — Manage individual jobs
- [Resources](/guide/features/resources) — View and manage resource locks
- [Health Monitoring](/guide/features/health-monitoring) — Check server health status
- [Troubleshooting](/guide/troubleshooting) — Recover from common issues
