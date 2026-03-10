#!/bin/bash
# scripts/backup.sh — Backup the SmartMath PostgreSQL database
# Add to crontab: 0 3 * * * /opt/smartmath/scripts/backup.sh >> /var/log/smartmath-backup.log 2>&1

set -euo pipefail

APP_DIR="/opt/smartmath"
BACKUP_DIR="${APP_DIR}/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/smartmath_${TIMESTAMP}.sql.gz"
KEEP_BACKUPS=30

mkdir -p "$BACKUP_DIR"

cd "$APP_DIR"

echo "=== SmartMath Database Backup ==="
echo "$(date)"
echo "Backup file: $BACKUP_FILE"

# Create compressed backup
docker compose exec -T db pg_dump \
  -U "${POSTGRES_USER:-smartmath}" \
  "${POSTGRES_DB:-smartmath}" \
  | gzip > "$BACKUP_FILE"

SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "Backup complete. Size: $SIZE"

# Rotate: keep only the last N backups
echo "Rotating backups (keeping last $KEEP_BACKUPS)..."
cd "$BACKUP_DIR"
BACKUP_COUNT=$(ls -1 smartmath_*.sql.gz 2>/dev/null | wc -l)
if [ "$BACKUP_COUNT" -gt "$KEEP_BACKUPS" ]; then
  ls -t smartmath_*.sql.gz | tail -n +"$((KEEP_BACKUPS + 1))" | xargs rm --
  echo "Removed old backups. Current count: $KEEP_BACKUPS"
fi

echo "=== Backup complete ==="
