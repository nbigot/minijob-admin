# Resources

Learn how to manage resource locking to prevent conflicts in your job processing system.

![Resources](/images/screenshots/resources.png)

## Overview

Resource locking is a mechanism to prevent multiple jobs from accessing the same resource simultaneously, avoiding race conditions and data corruption.

## What are Resources?

Resources are identifiers for shared assets that jobs may need exclusive access to:

**Examples:**

- User accounts: `user:12345`
- Database records: `record:order-789`
- Files: `file:/path/to/document.pdf`
- External services: `api:payment-gateway`
- System resources: `database:primary`

## How Resource Locking Works

### Lock Acquisition

1. Job specifies required resources
2. System checks if resources are available
3. If available, locks are acquired atomically
4. Job executes with exclusive access
5. Locks released on completion

### Lock Process

```
Job Created → Request Locks → Wait if Locked → Acquire Locks → Execute → Release Locks
```

### Conflict Prevention

```
Job A: Locks [user:123, database:main]
Job B: Tries to lock [user:123]
Result: Job B waits until Job A completes
```

## Resources View

### Resource List

Displays all currently locked resources:

| Column          | Description                       |
| --------------- | --------------------------------- |
| **Resource ID** | Resource identifier               |
| **Locked By**   | Job ID holding the lock           |
| **Locked At**   | Lock acquisition time             |
| **Duration**    | How long resource has been locked |
| **Actions**     | Unlock button                     |

### Filtering

- **Show All**: All locked resources
- **By Job**: Resources locked by specific job
- **By Duration**: Resources locked > X minutes
- **By Pattern**: Filter resource IDs (e.g., `user:*`)

## Resource Actions

### View Locked Resources

Navigate to **Resources** page to see:

- All locked resources
- Which jobs hold locks
- Lock durations
- Warning indicators for long-held locks

### Unlock Individual Resource

1. Find the resource in the list
2. Click **Unlock** button
3. Confirm action
4. Resource becomes available

::: warning
Only unlock if you're certain the job won't cause data corruption when lock is removed.
:::

### Unlock All Resources

Bulk unlock all resources:

1. Click **Unlock All** button
2. Review warning message
3. Confirm action
4. All locks released

**When to use:**

- After system crash
- During maintenance
- When many jobs fail and hold locks

::: danger
Unlocking resources while jobs are running can cause data corruption. Use with caution.
:::

### Force Unlock After Timeout

Automatically unlock resources held beyond threshold:

```javascript
// Example: Auto-unlock after 1 hour
const LOCK_TIMEOUT = 3600; // seconds
```

## Locking Resources in Jobs

### Specify Resources

When creating a job, list resources to lock:

**Single Resource:**

```json
{
  "topic": "user-update",
  "name": "Update User Profile",
  "lock_resources": ["user:12345"]
}
```

**Multiple Resources:**

```json
{
  "topic": "order-process",
  "name": "Process Order",
  "lock_resources": ["user:12345", "order:789", "inventory:widget-001"]
}
```

### Resource Naming Conventions

Use consistent naming:

```
Pattern: <type>:<identifier>

user:<user_id>              → User account
order:<order_id>            → Order record
product:<sku>               → Product/inventory
file:<path>                 → File resource
api:<service_name>          → External API
database:<db_name>          → Database access
queue:<queue_name>          → Queue access
rate_limit:<endpoint>       → Rate limiting
cache:<key>                 → Cache entry
session:<session_id>        → User session
```

### Lock Scope Best Practices

**Lock Granularly:**

```javascript
// Good: Lock specific user
{ "lock_resources": ["user:12345"] }

// Bad: Lock entire user table
{ "lock_resources": ["users"] }
```

**Lock Minimal Resources:**

```javascript
// Good: Lock only what's needed
{ "lock_resources": ["user:123", "profile:123"] }

// Bad: Lock everything related
{ "lock_resources": ["user:123", "profile:123", "settings:123", "logs:123"] }
```

### Lock Order

Prevent deadlocks by consistent ordering:

```javascript
// Always lock in alphabetical order
{ "lock_resources": ["order:789", "user:123"] }

// Not: ["user:123", "order:789"]
```

## Lock Duration Monitoring

### Warning Thresholds

Visual indicators based on lock duration:

- 🟢 **< 5 minutes**: Normal
- 🟡 **5-30 minutes**: Warning
- 🟠 **30-60 minutes**: Concerning
- 🔴 **> 60 minutes**: Critical

### Long-Held Locks

Locks held too long may indicate:

- Job is stuck/stalled
- Job logic error (infinite loop)
- Network timeout
- System resource exhaustion

**Investigation Steps:**

1. Check job status (Running? Stalled?)
2. Review job logs for errors
3. Verify worker health
4. Check system resources
5. Consider canceling job

## Deadlock Prevention

### Deadlock Scenario

```
Job A: Locks [resource:1], waits for [resource:2]
Job B: Locks [resource:2], waits for [resource:1]
Result: Both jobs wait forever (deadlock)
```

### Prevention Strategies

**1. Lock Ordering**
Always acquire locks in same order:

```javascript
// All jobs lock alphabetically
resources.sort();
lockResources(resources);
```

**2. Lock Timeout**
Fail if can't acquire locks within timeout:

```javascript
const LOCK_ACQUISITION_TIMEOUT = 30; // seconds
```

**3. Lock All-or-Nothing**
Acquire all locks atomically or none:

```javascript
// Don't partially lock - acquire all or rollback
acquireLocksAtomic(["resource:1", "resource:2"]);
```

**4. Minimal Lock Duration**
Release locks as soon as possible:

```javascript
acquireLocks();
try {
  doWork(); // Keep this fast
} finally {
  releaseLocks(); // Always release
}
```

## Resource Patterns

### User Operations

```json
{
  "topic": "user-update",
  "lock_resources": ["user:12345"],
  "properties": {
    "user_id": 12345,
    "action": "update_email",
    "new_email": "user@example.com"
  }
}
```

### Order Processing

```json
{
  "topic": "order-process",
  "lock_resources": ["order:789", "user:123", "inventory:product-001", "inventory:product-002"],
  "properties": {
    "order_id": 789,
    "user_id": 123,
    "items": [
      { "sku": "product-001", "quantity": 2 },
      { "sku": "product-002", "quantity": 1 }
    ]
  }
}
```

### Database Migrations

```json
{
  "topic": "database-migration",
  "lock_resources": ["database:main"],
  "properties": {
    "migration": "add_user_columns",
    "version": "2.1.0"
  }
}
```

### Rate Limiting

```json
{
  "topic": "api-call",
  "lock_resources": ["rate_limit:external-api"],
  "properties": {
    "endpoint": "https://api.example.com/data",
    "method": "POST"
  }
}
```

## Troubleshooting

### Resource Stays Locked

**Symptoms:**

- Resource locked for hours
- Job shows as completed
- Can't acquire lock

**Causes:**

- Job crashed before releasing lock
- Backend didn't receive completion signal
- Database transaction issue

**Solutions:**

1. Check job status - is it complete?
2. Force unlock if job is done
3. Investigate job logs
4. Review backend connection

### Jobs Waiting Forever

**Symptoms:**

- Jobs stuck in "Pending" state
- Waiting for resource that never unlocks

**Causes:**

- Resource locked by failed job
- Deadlock situation
- Lock never released

**Solutions:**

1. Identify blocking resource
2. Find job holding lock
3. Cancel or complete blocking job
4. Force unlock if necessary

### Deadlock Detected

**Symptoms:**

- Multiple jobs waiting
- Circular dependency on resources
- No jobs completing

**Solutions:**

1. Identify jobs involved
2. Cancel one job to break cycle
3. Review lock acquisition order
4. Implement lock ordering in code

### Too Many Locks

**Symptoms:**

- Many resources locked
- System performance degraded
- Lock table growing large

**Causes:**

- Jobs running too long
- Too many concurrent jobs
- Lock scope too broad

**Solutions:**

1. Optimize job execution time
2. Reduce concurrent job count
3. Lock more specific resources
4. Implement lock cleanup

## Best Practices

### 1. Lock Granularity

```javascript
// Good: Lock specific record
lock("user:12345");

// Bad: Lock entire table
lock("users");
```

### 2. Minimal Lock Time

```javascript
// Good: Lock only during critical section
fetchData();
lock("resource:1");
updateResource();
unlock("resource:1");
saveResults();

// Bad: Lock for entire job
lock("resource:1");
fetchData();
updateResource();
saveResults();
unlock("resource:1");
```

### 3. Handle Lock Failures

```javascript
if (!acquireLocks(resources, (timeout = 30))) {
  // Failed to acquire locks
  return { status: "retry_later" };
}
```

### 4. Always Release Locks

```javascript
try {
  acquireLocks();
  doWork();
} finally {
  // Always release, even on error
  releaseLocks();
}
```

### 5. Document Resource Patterns

Maintain a registry of resource patterns:

```
user:<id>           - User account operations
order:<id>          - Order processing
inventory:<sku>     - Stock management
file:<path>         - File operations
```

## API Integration

Resources endpoints:

```javascript
// List locked resources
GET /api/resources?locked=true

// Get resource details
GET /api/resources/:id

// Unlock resource
POST /api/resources/:id/unlock

// Unlock all resources
POST /api/resources/unlock-all
```

## Next Steps

- **[Jobs Management](/guide/features/jobs)** - Learn about job lifecycle
- **[Dashboard](/guide/features/dashboard)** - Monitor locked resources
- **[Job States](/reference/job-states)** - Understand job state flow
- **[API Reference](/reference/api)** - Complete API documentation
