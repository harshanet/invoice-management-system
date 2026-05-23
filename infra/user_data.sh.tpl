#!/bin/bash
# Bootstrap for the Learning Resource Library backend box.
# Brings up: swap -> Node 22 + PM2 -> backend (live) -> nginx (HTTP :80) ->
# self-hosted GitHub Actions runner.
#
# TLS is handled by CloudFront in front of this box, so nginx only listens on
# port 80 and the security group only admits CloudFront's edge IPs.
#
# NOTE: `set -x` is intentionally NOT used so the PAT is kept out of
# /var/log/cloud-init-output.log.
set -eo pipefail

# --------------------------------------------------------------------------
# 1. Swap — t3.micro has only 1GB RAM; npm install + runner can OOM without it
# --------------------------------------------------------------------------
if [ ! -f /swapfile ]; then
  fallocate -l 1G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# --------------------------------------------------------------------------
# 2. Base packages + Node 22 + PM2
# --------------------------------------------------------------------------
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl git jq nginx rsync
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs
npm install -g pm2

# --------------------------------------------------------------------------
# 3. App — clone, install backend, write .env, start under PM2 (live now)
# --------------------------------------------------------------------------
APP_DIR=/home/ubuntu/app
sudo -u ubuntu git clone https://github.com/${github_owner}/${github_repo}.git $APP_DIR

cat > $APP_DIR/backend/.env <<'PRODENV'
${prod_env}
PRODENV
chown ubuntu:ubuntu $APP_DIR/backend/.env

sudo -u ubuntu bash -c "cd $APP_DIR/backend && npm install && pm2 start server.js --name lrl-backend"
sudo -u ubuntu pm2 save
# Resurrect PM2 processes on reboot
env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

# --------------------------------------------------------------------------
# 4. nginx reverse proxy (HTTP only; CloudFront terminates TLS)
# --------------------------------------------------------------------------
cat > /etc/nginx/sites-available/lrl <<NGINX
server {
    listen 80 default_server;
    server_name _;
    location / {
        proxy_pass http://localhost:5001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
NGINX
ln -sf /etc/nginx/sites-available/lrl /etc/nginx/sites-enabled/lrl
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# --------------------------------------------------------------------------
# 5. GitHub Actions self-hosted runner (auto-registered via PAT)
# --------------------------------------------------------------------------
RUNNER_DIR=/home/ubuntu/actions-runner
RUNNER_VERSION=2.319.1
sudo -u ubuntu mkdir -p $RUNNER_DIR
cd $RUNNER_DIR
sudo -u ubuntu curl -o actions-runner.tar.gz -L \
  https://github.com/actions/runner/releases/download/v$RUNNER_VERSION/actions-runner-linux-x64-$RUNNER_VERSION.tar.gz
sudo -u ubuntu tar xzf actions-runner.tar.gz

RUNNER_TOKEN=$(curl -sX POST \
  -H "Authorization: Bearer ${github_pat}" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/${github_owner}/${github_repo}/actions/runners/registration-token \
  | jq -r .token)

sudo -u ubuntu ./config.sh --unattended \
  --url https://github.com/${github_owner}/${github_repo} \
  --token "$RUNNER_TOKEN" \
  --name "ec2-$(hostname)" \
  --labels self-hosted \
  --replace

./svc.sh install ubuntu
./svc.sh start

echo "Bootstrap complete."
