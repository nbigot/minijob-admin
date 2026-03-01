# Topics

Learn how to organize and monitor jobs using topics in MiniJob Admin Dashboard.

![Topics](/images/screenshots/topics.png)

## Overview

Topics are categories that group related jobs together, making it easier to organize, monitor, and manage your job processing system.

## What are Topics?

Topics are labels that categorize jobs by:

- **Business function** (e.g., `email`, `reports`, `imports`)
- **Service/module** (e.g., `user-service`, `order-service`)
- **Job type** (e.g., `background`, `scheduled`, `webhook`)
- **Priority/SLA** (e.g., `critical`, `normal`, `low-priority`)

## Topics View

### Topic Statistics

For each topic, view:

| Metric           | Description                |
| ---------------- | -------------------------- |
| **Topic Name**   | Category identifier        |
| **Job Count**    | Total jobs in this topic   |
| **Percentage**   | % of all jobs              |
| **Success Rate** | % of succeeded jobs        |
| **Failure Rate** | % of failed jobs           |
| **Avg Duration** | Mean execution time        |
| **Active Jobs**  | Currently running + queued |

### Topic Distribution Chart

Visual pie/bar chart showing:

- Job distribution across topics
- Relative sizes of each topic
- Which topics dominate your workload

### Sorting & Filtering

Sort by:

- **Job Count** (highest to lowest)
- **Success Rate** (lowest first to identify problems)
- **Average Duration** (longest first)
- **Topic Name** (alphabetical)

Filter:

- Active topics only
- Topics with failures
- Topics above/below certain count

## Topic Naming Conventions

### Hierarchical Naming

Use dot notation for hierarchy:

```
email.welcome          → Welcome emails
email.password-reset   → Password reset emails
email.notification     → General notifications
email.marketing        → Marketing campaigns

report.daily           → Daily reports
report.weekly          → Weekly reports
report.monthly         → Monthly reports

import.users           → User imports
import.orders          → Order imports
import.products        → Product imports
```

### Service-Based Naming

```
user-service.create    → User creation
user-service.update    → User updates
user-service.delete    → User deletion

order-service.process  → Order processing
order-service.refund   → Order refunds
order-service.cancel   → Order cancellations
```

### Environment-Based

```
prod.email.welcome     → Production emails
staging.email.welcome  → Staging emails
dev.email.welcome      → Development emails
```

## Topic Organization Strategies

### Strategy 1: By Business Function

```
authentication
  ├─ login
  ├─ logout
  └─ password-reset

notifications
  ├─ email
  ├─ sms
  └─ push

billing
  ├─ invoice-generation
  ├─ payment-processing
  └─ subscription-renewal
```

### Strategy 2: By Priority/SLA

```
critical              → < 1 min SLA
high-priority         → < 5 min SLA
normal                → < 30 min SLA
low-priority          → < 1 hour SLA
background            → No SLA
```

### Strategy 3: By Data Flow

```
ingestion             → Data intake jobs
processing            → Data transformation
enrichment            → Data augmentation
export                → Data export
cleanup               → Data maintenance
```

### Strategy 4: By Trigger

```
api-triggered         → API request jobs
scheduled             → Cron/scheduled jobs
event-driven          → Event handler jobs
webhook               → Webhook receiver jobs
```

## Using Topics

### Creating Jobs with Topics

Specify topic during job creation:

```json
{
  "topic": "email.welcome",
  "name": "Send Welcome Email",
  "properties": {
    "to": "user@example.com",
    "template": "welcome"
  }
}
```

### Filtering Jobs by Topic

From the Jobs page:

1. Select topic from dropdown
2. View only jobs in that topic
3. Apply additional filters (status, search)

### Monitoring Topics

From the Topics page:

1. View topic performance metrics
2. Identify problematic topics (low success rate)
3. Find bottlenecks (high avg duration)
4. Track topic growth over time

## Topic-Based Analysis

### Success Rate Analysis

Identify topics with low success rates:

```
email.notification     → 98% success ✅
report.daily          → 95% success ⚠️
import.large-file     → 75% success ❌ (needs attention)
```

**Actions for low success rate:**

- Review job logs for common errors
- Check input data quality
- Optimize job implementation
- Increase timeout/resources

### Performance Analysis

Find slow topics:

```
email.send            → 500ms avg ✅
report.simple         → 5s avg ⚠️
report.complex        → 2 min avg ❌ (optimize)
```

**Optimization strategies:**

- Add caching
- Reduce database queries
- Process in parallel
- Split into smaller jobs

### Volume Analysis

Track job distribution:

```
email.* topics        → 60% of all jobs
report.* topics       → 30% of all jobs
import.* topics       → 10% of all jobs
```

**Capacity planning:**

- High-volume topics need more workers
- Low-volume topics can share resources
- Growing topics need monitoring

## Topic-Based Worker Configuration

### Dedicated Workers

Assign workers to specific topics:

```yaml
worker-email:
  topics: [email.welcome, email.notification]
  concurrency: 10

worker-reports:
  topics: [report.daily, report.weekly]
  concurrency: 2  # CPU-intensive

worker-general:
  topics: [*]  # All other topics
  concurrency: 5
```

### Priority-Based Routing

```yaml
worker-critical:
  topics: [critical.*]
  priority: high
  concurrency: 20

worker-normal:
  topics: [normal.*, low-priority.*]
  priority: normal
  concurrency: 10
```

## Topic Patterns

### Email Topics

```json
{
  "topic": "email.transactional",
  "priority": 3, // High priority
  "properties": {
    "template": "order-confirmation",
    "to": "customer@example.com",
    "order_id": 789
  }
}
```

### Report Generation

```json
{
  "topic": "report.weekly-sales",
  "priority": 1,
  "start_after": "2026-02-09T00:00:00Z", // Scheduled
  "properties": {
    "report_type": "sales",
    "period": "weekly",
    "format": "pdf"
  }
}
```

### Data Import

```json
{
  "topic": "import.csv",
  "priority": 1,
  "lock_resources": ["database:main"],
  "properties": {
    "file_path": "/uploads/users.csv",
    "table": "users",
    "batch_size": 1000
  }
}
```

### Webhook Processing

```json
{
  "topic": "webhook.stripe",
  "priority": 3,  // High priority
  "properties": {
    "event_type": "payment.succeeded",
    "event_id": "evt_123",
    "payload": { ... }
  }
}
```

## Topic Metrics Dashboard

Create custom dashboards per topic:

```javascript
// Example: Email topic dashboard
{
  "topic": "email.*",
  "metrics": {
    "count": 1500,
    "success_rate": 98.5,
    "avg_duration": 450,  // ms
    "p95_duration": 800,  // ms
    "p99_duration": 1200  // ms
  }
}
```

## Best Practices

### 1. Consistent Naming

```javascript
// Good: Clear, consistent
"email.welcome";
"email.password-reset";
"email.notification";

// Bad: Inconsistent
"welcomeEmail";
"pwd_reset_mail";
"notifications";
```

### 2. Appropriate Granularity

```javascript
// Good: Balanced detail
"report.sales";
"report.inventory";
"report.analytics";

// Too coarse:
"reports"; // Can't distinguish types

// Too fine:
"report.sales.daily.pdf.usa.west"; // Too specific
```

### 3. Use Wildcards Wisely

```javascript
// Good: Logical grouping
"email.*"      → All email jobs
"critical.*"   → All critical jobs

// Bad: Too broad
"*"  // Matches everything
```

### 4. Document Topics

Maintain a topic registry:

```markdown
| Topic         | Description             | SLA      | Owner     |
| ------------- | ----------------------- | -------- | --------- |
| email.welcome | New user welcome emails | < 1 min  | User Team |
| report.daily  | Daily sales reports     | < 30 min | Analytics |
| import.users  | Bulk user imports       | < 1 hour | Data Team |
```

### 5. Monitor Topic Health

Set up alerts:

```javascript
if (topic.success_rate < 90%) {
  alert("Topic health degraded: " + topic.name);
}

if (topic.avg_duration > topic.sla * 0.8) {
  alert("Topic approaching SLA limit: " + topic.name);
}
```

## Topic Evolution

### Adding New Topics

1. Define topic purpose and naming
2. Document in registry
3. Configure workers if needed
4. Deploy job code
5. Monitor initial runs

### Deprecating Topics

1. Mark as deprecated in registry
2. Alert on new job creation
3. Migrate existing jobs
4. Remove worker configuration
5. Archive topic

### Splitting Topics

When a topic becomes too large:

```
Before: email  (1000 jobs/day)

After:
  email.transactional  (700 jobs/day)
  email.marketing      (200 jobs/day)
  email.notification   (100 jobs/day)
```

## Troubleshooting

### Topic Not Appearing

**Cause:** No jobs created with this topic yet

**Solution:** Create a job or check topic filter settings

### Incorrect Statistics

**Cause:** Cache issue or calculation error

**Solution:** Refresh page, check backend logs

### Topic Performance Issues

**Cause:** Resource contention, slow workers

**Solution:**

1. Review worker configuration
2. Check for resource locks
3. Optimize job implementation
4. Scale worker capacity

## API Integration

Topics endpoints:

```javascript
// List all topics with stats
GET /api/topics

// Get topic details
GET /api/topics/:name

// Topic distribution
GET /api/topics/distribution

// Jobs by topic
GET /api/jobs?topic=email.welcome
```

## Next Steps

- **[Jobs Management](/guide/features/jobs)** - Manage jobs within topics
- **[Dashboard](/guide/features/dashboard)** - Monitor topic metrics
- **[Configuration](/guide/configuration)** - Configure topic-based workers
- **[API Reference](/reference/api)** - Topic API documentation
