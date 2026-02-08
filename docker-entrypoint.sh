#!/bin/sh
set -e

TEMPLATE=/etc/nginx/templates/default.conf.template
DEST=/etc/nginx/conf.d/default.conf

# Provide sensible defaults and ensure variables are exported to child processes.
# Also remove any trailing slash from BACKEND_URL to avoid malformed proxy_pass.
: "${BACKEND_URL:=http://127.0.0.1:8080}"
: "${PROMETHEUS_URL:=/prometheus/}"
BACKEND_URL="${BACKEND_URL%/}"
export BACKEND_URL PROMETHEUS_URL

if [ -f "$TEMPLATE" ]; then
  echo "Rendering nginx config from template"
  echo "BACKEND_URL=$BACKEND_URL"
  echo "PROMETHEUS_URL=$PROMETHEUS_URL"
  /usr/bin/envsubst '${BACKEND_URL} ${PROMETHEUS_URL}' < "$TEMPLATE" > "$DEST"
fi

exec "$@"
