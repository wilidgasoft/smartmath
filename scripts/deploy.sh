#!/bin/bash
# scripts/deploy.sh — Deploy or update SmartMath on the Ubuntu server
# Run from /opt/smartmath after git clone

set -euo pipefail

APP_DIR="/opt/smartmath"

echo "=== SmartMath Deployment ==="
echo "$(date)"
echo ""

cd "$APP_DIR"

echo "--- Pulling latest code ---"
git pull origin main

echo "--- Building application container ---"
docker compose build app

echo "--- Running database migrations ---"
docker compose --profile migrate run --rm migrate

echo "--- Restarting application ---"
docker compose up -d app tunnel

echo "--- Cleaning up old Docker images ---"
docker image prune -f

echo ""
echo "=== Deployment complete! ==="
echo ""
docker compose ps
echo ""
echo "Health check:"
sleep 3
curl -sf http://localhost:3000/api/health && echo " ✓ App is healthy" || echo " ✗ Health check failed"
