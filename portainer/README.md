# Listmonk - Newsletter & Mailing List Manager

This directory contains the Docker Compose configuration for deploying Listmonk on `newsletter.hopps.de`.

## Prerequisites

1. **Nginx Proxy Manager**: The external network `nginx-proxy-manager` must exist
2. **Host directories**: Create directories on the host for data persistence:
   ```bash
   sudo mkdir -p /opt/listmonk/uploads
   sudo mkdir -p /opt/listmonk/db
   sudo chown -R 1000:1000 /opt/listmonk
   ```

## Setup Instructions

### 1. Configure Environment Variables

In Portainer, add the following environment variables in the stack configuration:

```env
# PostgreSQL Database Credentials
DB_USER=listmonk
DB_PASSWORD=<generate_secure_password>
DB_NAME=listmonk

# Listmonk Admin Credentials (only used on first setup)
LISTMONK_ADMIN_USER=admin
LISTMONK_ADMIN_PASSWORD=<generate_secure_password>

# Timezone (optional)
TZ=Europe/Berlin
```

**Important**: Generate strong passwords for both `DB_PASSWORD` and `LISTMONK_ADMIN_PASSWORD`.

### 2. Deploy Stack in Portainer

1. Go to Portainer → Stacks → Add Stack
2. Name: `listmonk`
3. Build method: Repository
4. Repository URL: Your git repository
5. Repository reference: `refs/heads/main`
6. Compose path: `portainer/docker-compose.yml`
7. Add environment variables (from step 1)
8. Deploy the stack

### 3. Configure Nginx Proxy Manager

After the stack is deployed, configure NPM to proxy to the service:

1. **Proxy Host:**
   - Domain: `newsletter.hopps.de`
   - Scheme: `http`
   - Forward Hostname: `listmonk_app`
   - Forward Port: `9000`
   - Enable: Websockets Support, Block Common Exploits

2. **SSL Certificate:**
   - Request a new Let's Encrypt certificate
   - Enable Force SSL, HTTP/2, HSTS

### 4. First Login

1. Visit `https://newsletter.hopps.de`
2. Login with the admin credentials you set in the environment variables
3. Go to **Settings → Media** and change the upload path to: `/listmonk/uploads`

## Data Storage

All data is stored on the host at `/opt/listmonk/`:
- `/opt/listmonk/uploads` - Uploaded media files and attachments
- `/opt/listmonk/db` - PostgreSQL database data

## Backup

To backup Listmonk data:

```bash
# Backup database
docker exec listmonk_db pg_dump -U listmonk listmonk > /backup/listmonk-$(date +%Y%m%d).sql

# Backup uploads
tar -czf /backup/listmonk-uploads-$(date +%Y%m%d).tar.gz /opt/listmonk/uploads
```

## Updating

Listmonk automatically runs database migrations on startup. To update:

1. In Portainer, go to the stack
2. Click "Pull and redeploy"
3. The container will pull the latest image and run migrations automatically

## Service Details

- **App Container**: `listmonk_app` (listmonk/listmonk:latest)
- **Database Container**: `listmonk_db` (postgres:17-alpine)
- **Networks**:
  - `listmonk` (internal)
  - `nginx-proxy-manager` (external)
- **Domain**: newsletter.hopps.de
- **Internal Port**: 9000 (not exposed externally)

## Troubleshooting

### Check logs
```bash
docker logs listmonk_app
docker logs listmonk_db
```

### Database connection issues
Ensure the database is healthy:
```bash
docker exec listmonk_db pg_isready -U listmonk
```

### Reset admin password
If you forget the admin password, you can reset it via the database:
```bash
docker exec -it listmonk_db psql -U listmonk -d listmonk
# Then run SQL commands to reset password
```

## Documentation

- Official Listmonk Docs: https://listmonk.app/docs/
- GitHub: https://github.com/knadh/listmonk
