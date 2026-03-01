# Health Monitoring

Monitor the health and availability of your MiniJob backend system.

![Health Monitoring](/images/screenshots/health-monitoring.png)

## Overview

The Health page provides real-time status information about your MiniJob backend server, helping you quickly identify and diagnose system issues.

## Health Check View

### Status Indicator

Large visual indicator showing:

- 🟢 **Healthy** - System operational
- 🟡 **Degraded** - System issues detected
- 🔴 **Unhealthy** - System down or error
- ⚪ **Unknown** - Unable to determine status

### Health Information

| Field             | Description                    |
| ----------------- | ------------------------------ |
| **Status**        | Overall health status          |
| **Response Time** | API response latency (ms)      |
| **Last Check**    | Timestamp of last health check |
| **Uptime**        | System uptime duration         |
| **Version**       | Backend version number         |
| **Environment**   | Deployment environment         |

### System Details

Additional system information:

- Database connectivity
- Queue status
- Worker availability
- Memory usage
- CPU utilization

## Health Check Frequency

The health check:

- Runs automatically every 30 seconds
- Can be triggered manually with "Refresh" button
- Times out after 10 seconds
- Retries on transient failures

## Status Meanings

### Healthy 🟢

**Indicators:**

- Response time < 1000ms
- Database connected
- Queue accessible
- Workers active

**Actions:**

- Continue normal monitoring
- Review metrics periodically

### Degraded 🟡

**Indicators:**

- Response time 1-5 seconds
- Some services slow
- Warning in backend logs
- High resource usage

**Actions:**

1. Check backend logs
2. Review system resources
3. Monitor for further degradation
4. Plan capacity increase

### Unhealthy 🔴

**Indicators:**

- Response time > 5 seconds
- Database disconnected
- Queue inaccessible
- No workers available
- Backend not responding

**Actions:**

1. **Immediate:** Check backend service status
2. Check database connectivity
3. Verify network connectivity
4. Review error logs
5. Restart services if needed
6. Escalate to on-call engineer

### Unknown ⚪

**Indicators:**

- Cannot reach backend
- Network error
- Timeout
- CORS error

**Actions:**

1. Verify `VITE_API_BASE_URL` configuration
2. Check network connectivity
3. Verify firewall rules
4. Check backend service status

## Health Endpoint

The dashboard calls:

```
GET /api/health
```

**Expected Response:**

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

## Monitoring Best Practices

### Regular Checks

- Review health dashboard daily
- Set up automated alerts
- Monitor response time trends
- Track uptime percentage

### Alert Thresholds

```javascript
// Response time alerts
if (responseTime > 1000) {
  alertLevel = "warning";
}
if (responseTime > 5000) {
  alertLevel = "critical";
}

// Uptime alerts
if (uptime < 3600) {
  alert("Service recently restarted");
}
```

### Integration with Monitoring

Send health data to:

- Prometheus for metrics
- Grafana for dashboards
- PagerDuty for alerting
- Datadog for APM

## Health Check Components

### Database Health

Verifies:

- Connection established
- Query execution works
- Transaction support
- Response time acceptable

**Common Issues:**

- Connection pool exhausted
- Database server down
- Network partition
- Credentials expired

### Queue Health

Verifies:

- Queue accessible
- Can enqueue/dequeue
- Queue not full
- Lock mechanism working

**Common Issues:**

- Queue server down
- Queue full (no space)
- Lock table corrupted
- Network timeout

### Worker Health

Verifies:

- Workers registered
- Workers processing jobs
- Worker heartbeats received
- No stuck workers

**Common Issues:**

- All workers crashed
- Workers not starting
- Worker configuration error
- Resource exhaustion

## Response Time Analysis

### Normal Range

- **Excellent**: < 100ms
- **Good**: 100-500ms
- **Acceptable**: 500-1000ms
- **Slow**: 1000-5000ms
- **Critical**: > 5000ms

### Causes of Slow Response

**Backend:**

- High CPU usage
- Memory pressure
- Slow database queries
- Network latency

**Database:**

- Missing indexes
- Long-running queries
- Lock contention
- Transaction deadlocks

**Network:**

- High latency
- Packet loss
- Bandwidth saturation
- Firewall delays

## Uptime Tracking

### Calculating Uptime

```
Uptime % = (Total Time - Downtime) / Total Time × 100
```

### Target SLAs

- **99.9%** (Three nines): ~8.7 hours downtime/year
- **99.95%**: ~4.4 hours downtime/year
- **99.99%** (Four nines): ~52 minutes downtime/year

### Tracking Downtime

Record incidents:

```json
{
  "incident_id": "2026-02-08-001",
  "start": "2026-02-08T14:30:00Z",
  "end": "2026-02-08T14:45:00Z",
  "duration": 900, // seconds
  "cause": "Database connection pool exhausted",
  "resolution": "Increased pool size"
}
```

## Troubleshooting Health Issues

### Backend Not Responding

**Check:**

```bash
# Is service running?
systemctl status minijob-backend

# Can you reach it?
curl http://localhost:8080/api/health

# Check logs
tail -f /var/log/minijob/backend.log
```

**Solutions:**

- Restart backend service
- Check configuration
- Verify port not blocked
- Review error logs

### Database Connection Failed

**Check:**

```bash
# Can database be reached?
psql -h localhost -U minijob -d minijob

# Are connections exhausted?
SELECT count(*) FROM pg_stat_activity;
```

**Solutions:**

- Restart database
- Increase connection pool
- Kill idle connections
- Check credentials

### High Response Time

**Check:**

```bash
# System resources
top
free -m
df -h

# Network latency
ping <backend-host>
traceroute <backend-host>
```

**Solutions:**

- Scale up resources
- Optimize queries
- Add caching
- Review code performance

### Workers Not Available

**Check:**

```bash
# Are worker processes running?
ps aux | grep worker

# Check worker logs
tail -f /var/log/minijob/worker.log
```

**Solutions:**

- Start worker processes
- Check worker configuration
- Verify topic registration
- Review error messages

## Health Dashboard Integration

### Grafana Dashboard

Example metrics to track:

```
- Backend response time (avg, p95, p99)
- Health check success rate
- System uptime
- Database connection count
- Active workers count
- Queue depth
```

### Prometheus Queries

```promql
# Response time
minijob_health_response_time_ms

# Health check success
rate(minijob_health_check_success_total[5m])

# System uptime
minijob_uptime_seconds
```

### Alert Rules

```yaml
alerts:
  - name: BackendDown
    condition: minijob_health_status != 1
    duration: 5m
    severity: critical

  - name: HighResponseTime
    condition: minijob_health_response_time_ms > 5000
    duration: 2m
    severity: warning
```

## API Integration

```javascript
// Get health status
GET / api / health;

// Get detailed health report
GET / api / health / detailed;

// Get system metrics
GET / api / health / metrics;
```

**Response Example:**

```json
{
  "status": "healthy",
  "timestamp": "2026-02-08T10:30:00Z",
  "response_time": 45,
  "uptime": 86400,
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "database": {
      "status": "healthy",
      "response_time": 12,
      "connections": {
        "active": 5,
        "idle": 3,
        "max": 100
      }
    },
    "queue": {
      "status": "healthy",
      "depth": 42,
      "locked_resources": 3
    },
    "workers": {
      "status": "healthy",
      "count": 10,
      "active": 7,
      "idle": 3
    }
  },
  "system": {
    "cpu_percent": 25.3,
    "memory_percent": 45.7,
    "disk_percent": 60.2
  }
}
```

## Best Practices

1. **Monitor Continuously** - Don't just check when problems occur
2. **Set Up Alerts** - Get notified of issues immediately
3. **Track Trends** - Response time trends reveal capacity issues
4. **Document Incidents** - Learn from past outages
5. **Test Failover** - Regularly test backup systems
6. **Review Regularly** - Weekly health reviews catch patterns

## Next Steps

- **[Dashboard](/guide/features/dashboard)** - Monitor job metrics
- **[System Admin](/guide/features/system)** - System management operations
- **[Troubleshooting](/guide/troubleshooting)** - Common issues and solutions
- **[Configuration](/guide/configuration)** - Backend configuration
