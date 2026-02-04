# Portainer Docker Compose Stacks

This directory contains Docker Compose configurations for deploying Fuggs services via Portainer.

## Directory Structure

```
portainer/
├── site/                    # Fuggs landing page
│   ├── docker-compose.yml  # Landing page service (fuggs.app)
│   └── README.md           # Deployment documentation
└── listmonk/               # Newsletter service
    ├── docker-compose.yml  # Listmonk service (newsletter.hopps.de)
    ├── .env.example        # Environment variables template
    └── README.md           # Deployment documentation
```

## Services Overview

### Landing Page (`site/`)
- **Domain**: fuggs.app
- **Purpose**: Main Fuggs landing page
- **Technology**: Static site (Nginx + Web Components)
- **Network**: nginx-proxy-manager
- **Secrets**: None required

### Listmonk (`listmonk/`)
- **Domain**: newsletter.hopps.de
- **Purpose**: Newsletter and mailing list management
- **Technology**: Listmonk + PostgreSQL 17
- **Network**: nginx-proxy-manager
- **Data**: `/opt/listmonk/uploads` and `/opt/listmonk/db`
- **Secrets**: Required (database + admin credentials)

## Prerequisites

### 1. Nginx Proxy Manager Network

All services use the external network `nginx-proxy-manager`. Ensure it exists:

```bash
docker network create nginx-proxy-manager
```

Or if using NPM via Docker Compose, the network is created automatically.

### 2. Host Directories (Listmonk only)

Create directories for Listmonk data persistence:

```bash
sudo mkdir -p /opt/listmonk/uploads
sudo mkdir -p /opt/listmonk/db
sudo chown -R 1000:1000 /opt/listmonk
```

## Deployment via Portainer

### Method 1: Git Repository (Recommended)

1. Go to Portainer → Stacks → Add Stack
2. **Build method**: Repository
3. **Repository URL**: Your git repository URL
4. **Repository reference**: `refs/heads/main`
5. **Compose path**:
   - For landing page: `portainer/site/docker-compose.yml`
   - For Listmonk: `portainer/listmonk/docker-compose.yml`
6. Add environment variables (if required - Listmonk only)
7. Deploy the stack

### Method 2: Manual Upload

1. Go to Portainer → Stacks → Add Stack
2. **Build method**: Web editor
3. Copy the content of the respective `docker-compose.yml`
4. Add environment variables (if required)
5. Deploy the stack

## Nginx Proxy Manager Configuration

After deploying each stack, configure NPM proxy hosts:

### Landing Page (fuggs.app)
- Forward Hostname: `fuggs_landing`
- Forward Port: `80`
- SSL: Let's Encrypt
- Enable: Force SSL, HTTP/2, HSTS, Block Common Exploits

### Listmonk (newsletter.hopps.de)
- Forward Hostname: `listmonk_app`
- Forward Port: `9000`
- SSL: Let's Encrypt
- Enable: Force SSL, HTTP/2, HSTS, Block Common Exploits, Websockets Support

## Updating Services

To update a service:

1. In Portainer, navigate to the stack
2. Click **"Pull and redeploy"**
3. The containers will pull latest images/code and restart

For the landing page, changes to the `site/` directory will be picked up on rebuild.

## Monitoring & Logs

### View logs in Portainer
1. Go to Stacks → Select stack → Containers
2. Click on container name
3. Click "Logs" tab

### View logs via CLI
```bash
# Landing page
docker logs fuggs_landing

# Listmonk
docker logs listmonk_app
docker logs listmonk_db
```

## Backup Strategy

### Landing Page
No backup needed - stateless application. Source code is in git.

### Listmonk
Regular backups recommended:

```bash
# Database backup
docker exec listmonk_db pg_dump -U listmonk listmonk > listmonk-$(date +%Y%m%d).sql

# Uploads backup
tar -czf listmonk-uploads-$(date +%Y%m%d).tar.gz /opt/listmonk/uploads
```

## Troubleshooting

### Check network exists
```bash
docker network ls | grep nginx-proxy-manager
```

### Check container connectivity
```bash
docker exec <container_name> ping -c 3 <other_container_name>
```

### Rebuild image (landing page)
```bash
cd portainer/site
docker compose build --no-cache
docker compose up -d
```

## Security Notes

1. **Secrets**: Never commit `.env` files to git
2. **Environment Variables**: Use Portainer's environment variable management
3. **Networks**: Services only accessible via nginx-proxy-manager
4. **Ports**: No ports exposed directly to the host
5. **SSL**: Always enable Force SSL in NPM

## Documentation

- Landing page docs: `site/README.md`
- Listmonk docs: `listmonk/README.md`
- Main project README: `../README.md`
- Development docs: `../CLAUDE.md`
