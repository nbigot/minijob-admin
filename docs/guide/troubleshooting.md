# Troubleshooting

Common issues and solutions for MiniJob Admin Dashboard.

## Installation Issues

### NPM Install Fails

**Problem:** `npm install` errors or dependency conflicts

**Solutions:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lockfile
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still failing, try with legacy peer deps
npm install --legacy-peer-deps
```

### Port Already in Use

**Problem:** Error: `EADDRINUSE: address already in use :::3000`

**Solutions:**

```bash
# Find process using the port
lsof -ti:3000
# Or on Windows
netstat -ano | findstr :3000

# Kill the process
kill -9 <PID>
# Or on Windows
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- --port 3001
```

### Build Errors

**Problem:** Build fails with Vite errors

**Solutions:**

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Clear dist folder
rm -rf dist

# Rebuild
npm run build
```

## Connection Issues

### Cannot Connect to Backend

**Problem:** Dashboard shows connection errors

**Symptoms:**

- "Network Error" in browser console
- Jobs page empty or error
- Dashboard shows no data

**Check:**

1. Backend service is running
2. Backend URL is correct in `.env`
3. No firewall blocking connection
4. CORS properly configured on backend

**Solutions:**

```bash
# Verify backend is accessible
curl http://localhost:8080/api/health

# Check environment variable
echo $VITE_API_BASE_URL

# Use simulation mode temporarily
npm run dev -- --mode simul
```

### CORS Errors

**Problem:** CORS policy errors in browser console

**Error Message:**

```
Access to XMLHttpRequest at 'http://localhost:8080/api/jobs'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Backend Solutions:**

**Node.js/Express:**

```javascript
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
```

**nginx:**

```nginx
add_header Access-Control-Allow-Origin "*";
add_header Access-Control-Allow-Methods "GET, POST, DELETE, PUT, PATCH, OPTIONS";
add_header Access-Control-Allow-Headers "Content-Type, Authorization";
```

### API Timeout

**Problem:** Requests timeout

**Solutions:**

```javascript
// Increase timeout in src/services/axios.js
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000, // Increase to 30 seconds
});
```

## Display Issues

### Dark Mode Not Working

**Problem:** Dark mode toggle doesn't work or persists incorrectly

**Solutions:**

```javascript
// Clear localStorage
localStorage.removeItem("vitepress-theme-appearance");

// Hard reload
Ctrl + Shift + R(Windows / Linux);
Cmd + Shift + R(Mac);
```

### Charts Not Displaying

**Problem:** Dashboard charts are blank or show errors

**Check:**

1. Browser console for JavaScript errors
2. Chart.js is loaded
3. Data is being fetched

**Solutions:**

```bash
# Reinstall Chart.js
npm install chart.js --save

# Clear cache and rebuild
rm -rf node_modules/.vite
npm run dev
```

### Icons Missing

**Problem:** Font Awesome icons don't display

**Solutions:**

```bash
# Reinstall Font Awesome
npm install @fortawesome/fontawesome-free

# Verify import in main.js
import '@fortawesome/fontawesome-free/css/all.css'
```

### Responsive Layout Broken

**Problem:** Layout breaks on mobile/tablet

**Solutions:**

1. Hard reload browser (clear cache)
2. Check TailwindCSS is working
3. Review browser console for CSS errors
4. Test in different browser

## Data Issues

### Jobs Not Displaying

**Problem:** Jobs page is empty but backend has jobs

**Check:**

1. Browser console for errors
2. Network tab shows API call succeeding
3. API response has data

**Solutions:**

```bash
# Test API directly
curl http://localhost:8080/api/jobs

# Check response format matches expected schema
# Verify jobService.js parses response correctly
```

### Incorrect Job States

**Problem:** Job states don't match backend

**Solutions:**

1. Check state mapping in frontend code
2. Verify backend returns expected state names
3. Clear browser cache
4. Check for polling interval issues

### Metrics Show Zero

**Problem:** Dashboard shows zero for all metrics

**Check:**

1. Backend health endpoint
2. Mock API isn't accidentally enabled
3. API responses have data

**Solutions:**

```bash
# Verify VITE_USE_MOCK_API is false
cat .env.development | grep MOCK

# Test dashboard API
curl http://localhost:8080/api/dashboard/stats
```

## Docker Issues

### Container Won't Start

**Problem:** Docker container exits immediately

**Check logs:**

```bash
docker logs <container-id>
```

**Common causes:**

- Port already in use
- Invalid environment variables
- nginx configuration error

**Solutions:**

```bash
# Use different port
docker run -p 8082:80 ghcr.io/nbigot/minijob-admin

# Check nginx logs
docker exec <container-id> cat /var/log/nginx/error.log

# Rebuild image
docker build --no-cache -t nbigot/minijob-admin .
```

### Environment Variables Not Working

**Problem:** Docker container ignores environment variables

**Check:**

```bash
# Verify variables are passed
docker inspect <container-id> | grep -A 10 "Env"
```

**Solutions:**

```bash
# Use -e flag for each variable
docker run \
  -e BACKEND_URL="http://localhost:8080" \
  -e PROMETHEUS_URL="http://localhost:9090" \
  -p 8081:80 \
  ghcr.io/nbigot/minijob-admin

# Or use env file
docker run --env-file .env.docker -p 8081:80 ghcr.io/nbigot/minijob-admin
```

### Can't Connect to Backend from Docker

**Problem:** Docker container can't reach backend on localhost

**Solution:**
Use `host.docker.internal` instead of `localhost`:

```bash
docker run \
  -e BACKEND_URL="http://host.docker.internal:8080" \
  -p 8081:80 \
  ghcr.io/nbigot/minijob-admin
```

## Performance Issues

### Slow Page Load

**Problem:** Dashboard takes long to load

**Solutions:**

1. Check backend response times
2. Reduce polling frequency
3. Limit number of jobs displayed
4. Enable production build optimizations

```javascript
// Reduce query limit
GET /api/jobs?limit=50  // Instead of 100+
```

### High Memory Usage

**Problem:** Browser uses excessive memory

**Causes:**

- Polling creating memory leaks
- Too many DOM elements
- Charts not being destroyed

**Solutions:**

1. Disable auto-refresh when not needed
2. Clear old chart instances
3. Limit history depth
4. Use pagination

### Slow Charts

**Problem:** Charts lag or freeze browser

**Solutions:**

```javascript
// Reduce data points
const maxDataPoints = 50; // Limit chart data

// Disable animations
const chartOptions = {
  animation: false,
};

// Use time-based sampling
// Instead of every data point, sample every 5 minutes
```

## Mock Data Issues

### Mock API Not Working

**Problem:** Simulation mode shows errors

**Check:**

```bash
# Verify environment variable
cat .env.simul | grep VITE_USE_MOCK_API
# Should be: VITE_USE_MOCK_API=true
```

**Solutions:**

```bash
# Explicitly run in simulation mode
npm run dev -- --mode simul

# Check mock setup file exists
ls src/mocks/setup.js
```

### Mock Data Not Realistic

**Problem:** Mock data doesn't reflect real scenarios

**Solutions:**
Customize mock data files:

- `src/mocks/data/mock_jobs.js`
- `src/mocks/data/mock_dashboard.js`
- See mock data documentation in source files

## Build & Deployment Issues

### Production Build Fails

**Problem:** `npm run build` errors

**Solutions:**

```bash
# Check for TypeScript/ESLint errors
npm run lint

# Build with detailed output
npm run build -- --mode production --debug

# Check for missing dependencies
npm install
```

### Built App Shows Blank Page

**Problem:** Production build loads but shows white screen

**Check:**

1. Browser console for errors
2. Base URL configuration
3. Asset paths

**Solutions:**

```javascript
// Check vite.config.js base path
export default defineConfig({
  base: "/minijob-admin/", // Must match deployment path
  // ...
});
```

### Assets Not Loading

**Problem:** CSS, JS, or images don't load in production

**Check:**

1. Browser console for 404 errors
2. Base path in configuration
3. Build output directory

**Solutions:**

```bash
# Verify base path matches server location
# If deployed to /app/minijob-admin/, set:
base: '/app/minijob-admin/'

# Check assets in dist folder
ls -la dist/assets/
```

## Browser-Specific Issues

### Works in Chrome but Not Firefox

**Solutions:**

1. Check for browser-specific JavaScript
2. Verify CSS vendor prefixes
3. Test with Firefox DevTools
4. Update to latest Firefox

### Works in Dev but Not Production

**Causes:**

- Environment variables differ
- Build optimization issues
- Missing dependencies

**Solutions:**

```bash
# Test production build locally
npm run build
npm run preview

# Compare .env.development vs .env.production
diff .env.development .env.production
```

## Getting More Help

### Enable Debug Mode

```javascript
// Add to main.js
if (import.meta.env.DEV) {
  console.log("App Config:", {
    apiURL: import.meta.env.VITE_API_BASE_URL,
    mockAPI: import.meta.env.VITE_USE_MOCK_API,
    version: import.meta.env.VITE_APP_VERSION,
  });
}
```

### Check Browser Console

Press F12 and review:

- Console tab for JavaScript errors
- Network tab for failed requests
- Application tab for localStorage

### Collect Diagnostics

```bash
# Node and npm versions
node --version
npm --version

# Package versions
npm list vue vite chart.js axios

# Environment
cat .env.development
```

### Report an Issue

When reporting issues, include:

1. Error message (full text)
2. Browser and version
3. Steps to reproduce
4. Environment (development/production)
5. Screenshots if applicable

**GitHub Issues:**
https://github.com/nbigot/minijob-admin/issues

## Common Error Messages

### "Failed to fetch"

**Meaning:** Cannot connect to backend

**Solutions:** Check backend URL, CORS, firewall

### "Cannot read property of undefined"

**Meaning:** JavaScript accessing null/undefined value

**Solutions:** Check data structure, add null checks

### "Module not found"

**Meaning:** Missing dependency or wrong import path

**Solutions:** `npm install`, fix import path

### "ECONNREFUSED"

**Meaning:** Connection refused by server

**Solutions:** Check server is running, port is correct

## Prevention Tips

1. **Use version control** - Commit working state before changes
2. **Test after updates** - Run tests after npm updates
3. **Monitor logs** - Regularly check browser and server logs
4. **Document changes** - Note configuration changes
5. **Keep dependencies updated** - But test thoroughly

## Next Steps

- **[Configuration](/guide/configuration)** - Proper configuration reference
- **[Deployment](/guide/deployment)** - Deployment best practices
- **[Contributing](/guide/contributing)** - Report bugs or contribute fixes
