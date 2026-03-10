#!/bin/bash
# scripts/setup.sh — Run once on a fresh Ubuntu server to set up SmartMath

set -euo pipefail

echo "=== SmartMath Server Setup ==="
echo "This will install Docker and prepare the server environment."
echo ""

# 1. Update system packages
echo "--- Updating system packages ---"
sudo apt update && sudo apt upgrade -y

# 2. Install Docker (official script)
echo "--- Installing Docker ---"
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"

# 3. Install Docker Compose plugin
echo "--- Installing Docker Compose plugin ---"
sudo apt install -y docker-compose-plugin

# 4. Install Git
echo "--- Installing Git ---"
sudo apt install -y git

# 5. Create application directory
echo "--- Creating application directory ---"
sudo mkdir -p /opt/smartmath
sudo chown "$USER":"$USER" /opt/smartmath

# 6. Configure UFW firewall
# Only allow SSH — Cloudflare Tunnel handles all HTTP/HTTPS traffic
echo "--- Configuring firewall ---"
sudo ufw allow OpenSSH
sudo ufw --force enable
echo "Firewall configured: only SSH is open. Cloudflare Tunnel handles HTTP/HTTPS."

# 7. Enable automatic security updates
echo "--- Enabling automatic security updates ---"
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades

echo ""
echo "=== Setup complete! ==="
echo ""
echo "IMPORTANT: Log out and back in for Docker group changes to take effect."
echo ""
echo "Next steps:"
echo "  1. Log out: exit"
echo "  2. Log back in via SSH"
echo "  3. Clone the repo:  git clone <repo-url> /opt/smartmath"
echo "  4. cd /opt/smartmath"
echo "  5. Copy env file:   cp .env.example .env"
echo "  6. Edit env file:   nano .env"
echo "  7. Set up Cloudflare Tunnel (see docs/11-DOCKER-DEPLOYMENT.md section 10.3)"
echo "  8. Run migrations:  docker compose --profile migrate run --rm migrate"
echo "  9. Start the app:   docker compose up -d"
