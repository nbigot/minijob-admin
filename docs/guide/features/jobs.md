# Jobs Management

Comprehensive guide to managing jobs in MiniJob Admin Dashboard.

![Jobs Management](/images/screenshots/jobs-list.png)

## Overview

The Jobs view provides complete lifecycle management for all jobs in your system. List, search, filter, create, view, retry, cancel, and delete jobs with an intuitive interface.

## Job List View

### Columns

| Column       | Description                                    |
| ------------ | ---------------------------------------------- |
| **ID**       | Unique job identifier                          |
| **Name**     | Job name/title                                 |
| **Topic**    | Job category/type                              |
| **State**    | Current state (Created, Queued, Running, etc.) |
| **Priority** | 0-3 (0=lowest, 3=highest)                      |
| **Created**  | Creation timestamp                             |
| **Updated**  | Last update timestamp                          |
| **Actions**  | Quick action buttons                           |

### Job States

Jobs progress through these states:

```
Created → Delayed → Pending → Queued → Running → Succeeded/Failed/Canceled
```

**State Descriptions:**

- **Created**: Just created, not yet queued
- **Delayed**: Scheduled to start at a future time
- **Pending**: Waiting for dependencies or conditions
- **Queued**: Ready for worker pickup
- **Running**: Currently being processed
- **Succeeded**: Completed successfully
- **Failed**: Encountered an error
- **Canceled**: Manually stopped
- **Deleted**: Removed from system

### State Colors

- 🟢 **Green**: Succeeded
- 🔵 **Blue**: Running, Queued
- 🟡 **Yellow**: Created, Delayed, Pending
- 🔴 **Red**: Failed, Deleted
- ⚪ **Gray**: Canceled, Hidden

## Filtering & Search

### Quick Filters

**By Status:**

- All Jobs
- Running
- Queued
- Succeeded
- Failed
- Pending

**By Topic:**

- Select from dropdown of available topics
- Shows job count per topic

### Search

Search across:

- Job ID
- Job Name
- Requester
- Session ID
- Trace ID

```
Search examples:
- "payment-123"      → finds jobs with payment in name
- "user-update"      → finds user update jobs
- "trace:abc123"     → finds by trace ID
```

### Advanced Filtering

Combine filters:

```
Status: Failed + Topic: payment + Search: "timeout"
```

Results: All failed payment jobs with "timeout" in name or properties.

## Job Actions

### View Details

Click on any job to view:

- Complete job information
- Properties (JSON)
- Execution history
- Resource locks
- Trace/session IDs
- Timestamps (created, started, completed)

### Clone Job

Create a copy of an existing job:

1. Click **Clone** button
2. Modify parameters if needed
3. Submit new job

Useful for:

- Retrying with different parameters
- Testing similar scenarios
- Batch job creation

### Retry Job

Retry a failed job:

1. Click **Retry** on failed job
2. Job is re-queued with same parameters
3. New job ID assigned

::: tip
Retry preserves original job properties but creates a new job instance.
:::

### Cancel Job

Stop a running or queued job:

1. Click **Cancel**
2. Confirm action
3. Job state changes to "Canceled"

**When to cancel:**

- Job is taking too long
- Job is processing incorrect data
- Need to redeploy with fixes

::: warning
Canceling doesn't rollback job side effects. Handle cleanup in your job code.
:::

### Delete Job

Permanently remove a job:

1. Click **Delete**
2. Confirm deletion
3. Job removed from database

**When to delete:**

- Test jobs no longer needed
- Obsolete jobs
- Cleaning up old history

::: danger
Deletion is permanent and cannot be undone.
:::

## Creating Jobs

### Manual Creation

Navigate to **Create Job** page:

**Required Fields:**

- **Topic**: Job category (e.g., `email`, `report`, `import`)
- **Name**: Descriptive job name

**Optional Fields:**

- **Priority**: 0-3 (default: 0)
  - 3 = Highest priority (processed first)
  - 0 = Normal priority
- **User Agent**: Client identifier
- **Requester**: User/service requesting the job
- **Session ID**: For session tracking
- **Trace ID**: For distributed tracing
- **Callback URL**: HTTP endpoint to call on completion
- **Visibility Timeout**: Seconds before job is visible (delay)
- **Start After**: Timestamp to start job (scheduled jobs)
- **Lock Resources**: Resources to lock (comma-separated)
- **Properties**: JSON data for the job

**Example Properties:**

```json
{
  "user_id": 12345,
  "email": "user@example.com",
  "template": "welcome",
  "language": "en"
}
```

### Generate Random Job

For testing:

1. Click **Generate Random Job**
2. Form auto-fills with realistic data
3. Submit or modify before submitting

### Bulk Job Creation

Create multiple jobs:

1. Clone existing job multiple times
2. Use API for programmatic creation
3. Import from CSV (planned feature)

## Job Details View

### Information Sections

**1. Basic Information**

- ID, Name, Topic
- State, Priority
- Created/Updated timestamps

**2. Requester Information**

- User Agent
- Requester
- Session ID
- Trace ID

**3. Timing Information**

- Created At
- Started At
- Completed At
- Duration
- Visibility Timeout
- Start After (scheduled time)

**4. Properties**
Pretty-printed JSON of job data:

```json
{
  "query": "SELECT * FROM users",
  "format": "csv",
  "notify": true
}
```

**5. Resource Locks**
List of locked resources:

- Resource ID
- Lock acquired timestamp
- Lock duration

**6. Execution History**
Timeline of job state changes:

```
2026-02-08 10:00:00 - Created
2026-02-08 10:00:05 - Queued
2026-02-08 10:00:10 - Running
2026-02-08 10:05:30 - Succeeded
```

### Actions from Detail View

- **Clone**: Create similar job
- **Retry**: Re-queue this job
- **Cancel**: Stop execution
- **Delete**: Remove permanently

## Pagination

Navigate large job lists:

- **Page Size**: 10, 25, 50, 100 jobs per page
- **Navigation**: First, Previous, Next, Last
- **Direct Page**: Jump to specific page number

## Sorting

Click column headers to sort:

- **ID**: Ascending/Descending
- **Created**: Newest/Oldest first
- **Priority**: Highest/Lowest first
- **State**: Alphabetical

## Bulk Operations

Select multiple jobs:

1. Use checkboxes to select jobs
2. Choose bulk action:
   - **Cancel Selected**: Stop multiple jobs
   - **Delete Selected**: Remove multiple jobs
   - **Retry Selected**: Re-queue multiple jobs

::: warning
Bulk operations cannot be undone. Use with caution.
:::

## Job Lifecycle Best Practices

### Priority Assignment

```
Priority 3: Critical/urgent jobs (payments, alerts)
Priority 2: Important jobs (reports, notifications)
Priority 1: Normal jobs (routine tasks)
Priority 0: Low priority (cleanups, logs)
```

### Topic Organization

Group related jobs:

```
email.welcome       → Welcome emails
email.password      → Password resets
email.notification  → General notifications

report.daily        → Daily reports
report.weekly       → Weekly reports
```

### Resource Locking

Lock resources to prevent conflicts:

```javascript
{
  "lock_resources": ["user:12345", "database:primary"],
  "properties": {
    "user_id": 12345,
    "action": "update_profile"
  }
}
```

### Scheduled Jobs

Delay job execution:

```javascript
{
  "start_after": "2026-02-08T14:00:00Z",
  "properties": {
    "type": "scheduled_report"
  }
}
```

### Distributed Tracing

Track jobs across services:

```javascript
{
  "trace_id": "a1b2c3d4e5f6",
  "session_id": "user-session-789",
  "properties": {
    "service": "api",
    "endpoint": "/users/update"
  }
}
```

## Monitoring Jobs

### Health Indicators

**Green** (Healthy):

- Success rate > 95%
- No stalled jobs
- Processing time within SLA

**Yellow** (Warning):

- Success rate 85-95%
- Few stalled jobs (< 5)
- Increasing queue depth

**Red** (Critical):

- Success rate < 85%
- Many stalled jobs (> 5)
- Queue backing up

### Alerts to Watch

1. **Failed Job Spike**: Sudden increase in failures
2. **Stalled Jobs**: Jobs stuck in running state
3. **Growing Queue**: Pending jobs accumulating
4. **Priority Starvation**: Low priority jobs never run

## Troubleshooting

### Job Stuck in Queued

**Causes:**

- No workers available
- Workers not configured for this topic
- Backend service down

**Solutions:**

- Check worker status
- Verify topic configuration
- Restart backend service

### Job Keeps Failing

**Causes:**

- Invalid input data
- Missing dependencies
- Resource unavailable

**Solutions:**

- Review job properties
- Check error logs
- Verify resource availability
- Fix and retry

### Job Never Completes

**Causes:**

- Infinite loop in job code
- Timeout too high
- Resource deadlock

**Solutions:**

- Cancel the job
- Review job implementation
- Check resource locks
- Adjust timeout settings

## API Integration

Jobs endpoints:

```javascript
// List jobs
GET /api/jobs?status=failed&topic=email&limit=50

// Get job details
GET /api/jobs/:id

// Create job
POST /api/jobs
Body: { topic, name, priority, properties, ... }

// Retry job
POST /api/jobs/:id/retry

// Cancel job
POST /api/jobs/:id/cancel

// Delete job
DELETE /api/jobs/:id
```

See [API Reference](/reference/api) for complete documentation.

## Next Steps

- **[Dashboard](/guide/features/dashboard)** - Monitor overall job health
- **[Resources](/guide/features/resources)** - Understand resource locking
- **[Topics](/guide/features/topics)** - Organize jobs by topic
- **[Job States Reference](/reference/job-states)** - Detailed state documentation
