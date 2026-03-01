# Dashboard

The Dashboard is the main view of MiniJob Admin Dashboard, providing real-time insights into your job processing system.

![Dashboard](/images/screenshots/dashboard.png)

## Overview

The Dashboard gives you a comprehensive, at-a-glance view of your job queue status, processing trends, and resource utilization. It automat ically refreshes to show live data.

## Key Components

### 1. Job Status Cards

Ten status cards display real-time job counts:

| Status        | Description                  | Color  |
| ------------- | ---------------------------- | ------ |
| **Total**     | All jobs in the system       | Blue   |
| **Created**   | Jobs just created            | Gray   |
| **Delayed**   | Jobs scheduled for later     | Yellow |
| **Pending**   | Jobs waiting to be queued    | Orange |
| **Queued**    | Jobs ready for execution     | Purple |
| **Running**   | Jobs currently executing     | Blue   |
| **Succeeded** | Successfully completed jobs  | Green  |
| **Failed**    | Jobs that encountered errors | Red    |
| **Canceled**  | Manually canceled jobs       | Gray   |
| **Deleted**   | Removed jobs                 | Red    |

### 2. Job Activity Metrics

Real-time statistics showing:

- **Active Jobs**: Currently running + queued jobs
- **Stalled Jobs**: Jobs stuck in running state beyond expected duration
- **Success Rate**: Percentage of successful job completions
- **Average Duration**: Mean job execution time

### 3. Job Processing Charts

Visual representation using Chart.js showing:

- **Succeeded Jobs** (green line)
- **Failed Jobs** (red line)
- **Pending Jobs** (orange line)

Charts update automatically and support multiple time windows.

### 4. Time Window Selector

Choose your monitoring timeframe:

- **1 minute** - Real-time monitoring
- **5 minutes** - Short-term trends
- **15 minutes** - Medium-term analysis
- **1 hour** - Hourly overview
- **6 hours** - Half-day patterns
- **24 hours** - Daily trends

### 5. Stalled Jobs List

Displays jobs that:

- Are in "running" state
- Exceed expected duration
- May require attention or retry

Shows:

- Job ID and name
- Topic
- Duration (how long it's been running)
- Quick actions (View, Retry, Cancel)

### 6. Locked Resources

Overview of resources currently locked by jobs:

- Resource name/ID
- Locking job ID
- Lock duration
- Quick unlock action

### 7. Jobs by Topic

Distribution chart showing:

- Number of jobs per topic
- Percentage of total jobs
- Topic-wise success rates

## Features

### Auto-Refresh

The dashboard automatically polls for updates:

- Default interval: **5 seconds**
- Configurable in source code
- Pause/resume capability (planned feature)

### Dark Mode

Full dark mode support:

- Automatic detection from system preference
- Manual toggle in the header
- Preference persisted in localStorage
- Charts adapt colors for visibility

### Responsive Design

Optimized for all screen sizes:

- **Desktop**: Multi-column grid layout
- **Tablet**: Adaptive two-column layout
- **Mobile**: Single-column stacked cards

## How to Use

### Monitoring Job Queue Health

1. **Check status cards** for abnormal counts
   - High "Failed" count → investigate errors
   - Growing "Pending" count → possible bottleneck
   - Many "Stalled" jobs → check worker health

2. **Review processing charts**
   - Spikes in failures → recent issue
   - Declining success rate → degrading system
   - Flat lines → no activity (check backend)

3. **Inspect stalled jobs**
   - Jobs stuck > 1 hour may need canceling
   - Retry if it's a transient failure
   - Investigate job logs before retrying

### Time Window Selection

Choose based on your needs:

```
1 minute   → Debug active issues in real-time
5 minutes  → Monitor recent deployments
15 minutes → Track immediate impact of changes
1 hour     → Review recent performance
6 hours    → Analyze shift patterns
24 hours   → Daily operations overview
```

### Resource Management

From the dashboard:

1. See locked resources count
2. Click to view detailed resource list
3. Unlock resources if jobs failed

### Topic Analysis

Identify which topics:

- Have the most jobs
- Have the highest failure rates
- Take the longest to process

Click a topic to filter jobs by that topic.

## Configuration

### Polling Interval

Customize in `src/views/Dashboard.vue`:

```javascript
// Change polling frequency
const POLL_INTERVAL = 5000; // milliseconds

// Disable auto-refresh
const AUTO_REFRESH = false;
```

### Chart Configuration

Modify chart settings in the Dashboard component:

```javascript
const chartOptions = {
  scales: {
    y: {
      beginAtZero: true,
      ticks: { color: isDark ? "#fff" : "#000" },
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};
```

### Metric Calculations

Success rate calculation:

```javascript
const successRate = (succeeded / (succeeded + failed)) * 100;
```

Customize thresholds for warnings:

```javascript
// Warn if success rate < 95%
const SUCCESS_THRESHOLD = 95;

// Highlight if stalled jobs > 5
const STALLED_THRESHOLD = 5;
```

## Dashboard Metrics Explained

### What is a "Stalled Job"?

A job is considered stalled when:

1. Status is "running"
2. Duration exceeds expected execution time
3. No progress updates received

**Common causes:**

- Worker crashed
- Network timeout
- Infinite loop in job code
- Database deadlock

**Resolution:**

- Cancel and retry the job
- Check worker logs
- Investigate job code
- Review resource availability

### Success Rate Formula

```
Success Rate = (Succeeded Jobs / (Succeeded + Failed Jobs)) × 100%
```

Excludes: canceled, deleted, pending, and running jobs.

### Average Duration

Mean time from job start to completion:

```
Average Duration = Sum(all completed job durations) / Count(completed jobs)
```

Only includes succeeded and failed jobs (completed states).

## Troubleshooting

### Dashboard Not Updating

**Issue**: Metrics are stale, charts don't refresh

**Solutions:**

1. Check backend connectivity (browser console for errors)
2. Verify polling is enabled
3. Check `VITE_API_BASE_URL` configuration
4. Ensure backend /api/dashboard endpoint is responsive

### Charts Not Displaying

**Issue**: Chart area is blank or shows error

**Solutions:**

1. Verify Chart.js is loaded (check browser console)
2. Check if data is being fetched successfully
3. Ensure chart canvas element exists
4. Review chart configuration for errors

### Incorrect Metrics

**Issue**: Numbers don't match backend database

**Solutions:**

1. Check backend API response format
2. Verify time window selection matches expectations
3. Clear cache and hard reload (Ctrl+Shift+R)
4. Check for calculation errors in Dashboard component

### Performance Issues

**Issue**: Dashboard is slow or laggy

**Solutions:**

1. Increase polling interval (reduce frequency)
2. Reduce chart data points
3. Disable auto-refresh temporarily
4. Check for memory leaks in browser DevTools

## Best Practices

1. **Monitor regularly** - Check dashboard at start of shifts
2. **Set time windows** based on your needs - don't always use 1 minute
3. **Investigate spikes** immediately - failed job spikes indicate issues
4. **Track trends** - Use 24-hour view to identify patterns
5. **Act on stalls** - Don't let jobs run indefinitely
6. **Review topics** - High-volume topics may need optimization

## API Integration

Dashboard fetches data from multiple endpoints:

```javascript
// Job statistics
GET /api/dashboard/stats

// Activity metrics
GET /api/dashboard/metrics?window=5m

// Stalled jobs
GET /api/jobs?state=running&stalled=true

// Locked resources
GET /api/resources?locked=true

// Jobs by topic
GET /api/topics/distribution
```

Response format examples in [API Reference](/reference/api).

## Next Steps

- **[Jobs Management](/guide/features/jobs)** - Detailed job operations
- **[Resources](/guide/features/resources)** - Resource locking details
- **[Topics](/guide/features/topics)** - Topic organization strategies
