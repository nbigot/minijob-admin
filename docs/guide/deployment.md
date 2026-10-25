# Deployment

Deploy MiniJob Admin Dashboard to production using Docker, Docker Compose, or traditional web servers.

## Deployment Options

MiniJob Admin Dashboard offers flexible deployment options to suit your infrastructure:

1. **Docker (Single Container)** - Simple, portable, runtime-configurable
2. **Docker Compose** - Multi-container orchestration with backend services
3. **Static Build** - Deploy to any web server (nginx, Apache, Caddy)
4. **CDN/Static Hosting** - Deploy to Netlify, Vercel, GitHub Pages

## Docker Deployment (Recommended)

### Quick Start

Each release publishes an image to the GitHub Container Registry, `ghcr.io/nbigot/minijob-admin`, for linux/amd64 and linux/arm64. It is tagged with the release version (for example `1.0.1`), its minor version (`1.0`) and `latest`.

The simplest way to deploy:

```bash
docker run \
  -e BACKEND_URL="http://your-backend:8080" \
  -e PROMETHEUS_URL="http://your-prometheus:9090" \
  -p 8081:80 \
  ghcr.io/nbigot/minijob-admin
```

Access at `http://localhost:8081`

### With Custom Port

```bash
docker run \
  -e BACKEND_URL="http://your-backend:8080" \
  -p 9000:80 \
  ghcr.io/nbigot/minijob-admin
```

Access at `http://localhost:9000`

### With Docker Host Backend

If your backend runs on the Docker host:

```bash
docker run \
  -e BACKEND_URL="http://host.docker.internal:8080" \
  -e PROMETHEUS_URL="http://host.docker.internal:9090" \
  -p 8081:80 \
  ghcr.io/nbigot/minijob-admin
```

::: tip
Use `host.docker.internal` to access services running on your Docker host machine.
:::

### With Custom Network

For containers on the same Docker network:

```bash
# Create network
docker network create minijob-network

# Run backend (example)
docker run --name minijob-backend \
  --network minijob-network \
  your-backend-image

# Run admin dashboard
docker run \
  --network minijob-network \
  -e BACKEND_URL="http://minijob-backend:8080" \
  -p 8081:80 \
  ghcr.io/nbigot/minijob-admin
```

## Docker Compose Deployment

### Using NPM Scripts

```bash
# Build and start
npm run docker:compose

# Stop services
npm run docker:stop
```

### Manual Docker Compose

Create or use the existing `docker-compose.yml`:

```yaml
version: "3.8"

services:
  minijob-admin:
    image: ghcr.io/nbigot/minijob-admin:latest
    ports:
      - "8081:80"
    environment:
      - BACKEND_URL=http://minijob-backend:8080
      - PROMETHEUS_URL=http://prometheus:9090
    depends_on:
      - minijob-backend
    restart: unless-stopped

  minijob-backend:
    image: your-backend-image
    ports:
      - "8080:8080"
    restart: unless-stopped
```

Commands:

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f minijob-admin

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## Building Your Own Docker Image

### Build from Source

```bash
# Using npm script
npm run docker:build

# Or manually
docker build -t your-registry/minijob-admin:latest .
```

### With Custom Version

```bash
docker build \
  --build-arg VITE_APP_VERSION=1.2.3 \
  -t your-registry/minijob-admin:1.2.3 .
```

### Multi-stage Build

The Dockerfile uses multi-stage builds for optimization:

1. **Build stage** - Compiles Vue.js application
2. **Production stage** - Serves with nginx (Alpine-based, ~50MB)

### Push to Registry

```bash
# Tag image
docker tag nbigot/minijob-admin your-registry/minijob-admin:latest

# Push to Docker Hub or private registry
docker push your-registry/minijob-admin:latest
```

## Static Build Deployment

### Build for Production

```bash
# Build optimized static files
npm run build
```

Output directory: `dist/`

### Deploy to Nginx

```nginx
server {
    listen 80;
    server_name admin.example.com;
    root /var/www/minijob-admin;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (optional)
    location /api/ {
        proxy_pass http://backend:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;
    gzip_min_length 1000;
}
```

Deploy:

```bash
# Copy build files to server
scp -r dist/* user@server:/var/www/minijob-admin/

# Restart nginx
ssh user@server 'sudo systemctl restart nginx'
```

### Deploy to Apache

`.htaccess` configuration:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## CDN/Static Hosting Deployment

### Netlify

1. Connect your GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Environment variables:
   - Add `VITE_API_BASE_URL`, `VITE_PROMETHEUS_URL`, etc.
4. Deploy

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

`vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### GitHub Pages

See [GitHub Pages deployment workflow below](#github-actions-deployment).

## Kubernetes Deployment

### Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: minijob-admin
spec:
  replicas: 2
  selector:
    matchLabels:
      app: minijob-admin
  template:
    metadata:
      labels:
        app: minijob-admin
    spec:
      containers:
        - name: minijob-admin
          image: ghcr.io/nbigot/minijob-admin:latest
          ports:
            - containerPort: 80
          env:
            - name: BACKEND_URL
              value: "http://minijob-backend:8080"
            - name: PROMETHEUS_URL
              value: "http://prometheus:9090"
---
apiVersion: v1
kind: Service
metadata:
  name: minijob-admin
spec:
  type: LoadBalancer
  ports:
    - port: 80
      targetPort: 80
  selector:
    app: minijob-admin
```

Deploy:

```bash
kubectl apply -f k8s/deployment.yaml
kubectl get services minijob-admin
```

## GitHub Actions Deployment

Automated deployment on every push:

`.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}

      - name: Deploy to Server
        uses: easingthemes/ssh-deploy@main
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: /var/www/minijob-admin
```

## SSL/TLS Configuration

### Using Let's Encrypt with Nginx

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d admin.example.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Nginx SSL Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name admin.example.com;

    ssl_certificate /etc/letsencrypt/live/admin.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.example.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /var/www/minijob-admin;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name admin.example.com;
    return 301 https://$server_name$request_uri;
}
```

## Health Checks

### Docker Health Check

Add to your `Dockerfile`:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
```

### Kubernetes Liveness/Readiness Probes

```yaml
livenessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 5
  periodSeconds: 5
```

## Performance Optimization

### Build Optimization

```bash
# Production build with analysis
npm run build -- --mode production

# Check bundle size
npm install -g vite-bundle-visualizer
npx vite-bundle-visualizer
```

### Nginx Caching

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Compression

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript
           application/x-javascript application/xml+rss
           application/javascript application/json;
```

## Monitoring Deployment

After deployment, verify:

1. ✅ Application loads without errors
2. ✅ API connection works (check browser console)
3. ✅ Dark mode toggles correctly
4. ✅ All routes are accessible
5. ✅ Health check returns OK

## Rollback Procedure

### Docker Rollback

```bash
# Pull the previous version (see the releases page for the versions)
docker pull ghcr.io/nbigot/minijob-admin:1.0.1

# Replace the running container with the previous version
docker stop minijob-admin
docker rm minijob-admin
docker run -d --name minijob-admin \
  -e BACKEND_URL="http://your-backend:8080" \
  -p 8081:80 \
  ghcr.io/nbigot/minijob-admin:1.0.1
```

### Kubernetes Rollback

```bash
# Check rollout history
kubectl rollout history deployment/minijob-admin

# Rollback to previous version
kubectl rollout undo deployment/minijob-admin

# Rollback to specific revision
kubectl rollout undo deployment/minijob-admin --to-revision=2
```

## Next Steps

- **[Troubleshooting](/guide/troubleshooting)** - Common deployment issues
- **[Configuration](/guide/configuration)** - Advanced configuration options
- **[Contributing](/guide/contributing)** - Contribute improvements
