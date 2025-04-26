#!/bin/bash

# --- CONFIG ---
USER="${DB_USER}"
PASSWORD="${DB_PASS}"
BACKUP_DIR="/home/backup"
DATE=$(date +%Y-%m-%d)
GDRIVE_FOLDER="gdrive:/mysql_backups"

# --- CHECK ---
if [[ -z "$USER" || -z "$PASSWORD" ]]; then
  echo "Error: DB_USER or DB_PASSWORD environment variable is not set."
  exit 1
fi

# --- SETUP ---
mkdir -p "$BACKUP_DIR"

# --- BACKUP ALL DATABASES ---
echo "Starting MySQL backup..."
mysqldump -u "$USER" -p"$PASSWORD" --all-databases | gzip > "$BACKUP_DIR/all_databases_$DATE.sql.gz"

# --- UPLOAD TO GOOGLE DRIVE ---
echo "Uploading to Google Drive..."
rclone copy "$BACKUP_DIR/all_databases_$DATE.sql.gz" "$GDRIVE_FOLDER"

# --- CLEANUP OLD LOCAL BACKUPS (older than 7 days) ---
echo "Cleaning up old local backups..."
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -exec rm {} \;

echo "Backup completed successfully!"
