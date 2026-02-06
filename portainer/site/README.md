# Fuggs Landing Page

This directory contains the Docker Compose configuration for deploying the Fuggs landing page on `fuggs.de`.

## Prerequisites

1. **Nginx Proxy Manager**: The external network `nginx-proxy-manager` must exist
2. **Build context**: The docker-compose references `../../site` for the build context

## Setup Instructions

### 1. Deploy Stack in Portainer

1. Go to Portainer → Stacks → Add Stack
2. Name: `fuggs-landing`
3. Build method: Repository
4. Repository URL: Your git repository
5. Repository reference: `refs/heads/main`
6. Compose path: `portainer/site/docker-compose.yml`
7. Deploy the stack

**Note**: The image will be built from the `site/` directory using the Dockerfile.

### 2. Configure Nginx Proxy Manager

After the stack is deployed, configure NPM to proxy to the service:

1. **Proxy Host:**
   - Domain: `fuggs.de`
   - Scheme: `http`
   - Forward Hostname: `fuggs_landing`
   - Forward Port: `80`
   - Enable: Block Common Exploits

2. **SSL Certificate:**
   - Request a new Let's Encrypt certificate
   - Enable Force SSL, HTTP/2, HSTS

### 3. Optional: WWW Redirect

To redirect `www.fuggs.de` to `fuggs.de`:

1. Add another Proxy Host in NPM
2. Domain: `www.fuggs.de`
3. Scheme: `http`
4. Forward Hostname: `fuggs_landing`
5. Forward Port: `80`
6. SSL: Same certificate or request new one
7. In the Advanced tab, add custom Nginx configuration:
   ```nginx
   return 301 https://fuggs.de$request_uri;
   ```

## Service Details

- **Container**: `fuggs_landing`
- **Base Image**: `nginx:alpine`
- **Network**: `nginx-proxy-manager` (external)
- **Domain**: fuggs.de
- **Internal Port**: 80 (not exposed externally)
- **Content**: Static HTML/CSS/JS (Web Components)

## Updating

The landing page uses a static build. To update:

1. Push changes to the `site/` directory in git
2. In Portainer, go to the stack
3. Click "Pull and redeploy"
4. The container will rebuild with the latest code

## Technology Stack

- Native Web Components (Custom Elements API)
- Tailwind CSS (CDN)
- IBM Plex Sans font
- Nginx for serving static files

## Troubleshooting

### Check logs
```bash
docker logs fuggs_landing
```

### Test container locally
```bash
cd ../..
docker build -t fuggs-landing:test site/
docker run -p 8080:80 fuggs-landing:test
# Visit http://localhost:8080
```

### Rebuild image
If the image doesn't update properly:
```bash
docker compose -f portainer/site/docker-compose.yml build --no-cache
docker compose -f portainer/site/docker-compose.yml up -d
```

## Documentation

- Main README: `../../README.md`
- Development docs: `../../CLAUDE.md`
- Site source: `../../site/`
