# Build stage
# The output is static files: build them once, on the native platform, for every image platform
FROM --platform=$BUILDPLATFORM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application with fixed backend hostname
# Application Configuration
ENV VITE_APP_TITLE="MiniJob Admin"
# Allow overriding the app version at docker build time via --build-arg VITE_APP_VERSION=...
ARG VITE_APP_VERSION=1.0.1
ENV VITE_APP_VERSION=${VITE_APP_VERSION}
ENV VITE_USE_MOCK_API=false
ENV VITE_API_BASE_URL=""
ENV VITE_PROMETHEUS_URL="/prometheus/"

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Install envsubst (gettext) to allow runtime env substitution of nginx template
RUN apk add --no-cache gettext

# Copy default nginx template (can be overridden by docker-compose volume)
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy entrypoint that will render the template and start nginx
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
