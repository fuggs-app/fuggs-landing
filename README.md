# Fuggs Landing Page

Modern landing page for [Fuggs](https://github.com/fuggs-app/fuggs) - intelligent open-source club accounting software.

Built with native Web Components, Tailwind CSS, and zero build process.

## Quick Start

```bash
# Development server
npm run dev                    # Port 8001
./dev.sh                       # Alternative (port 8001)
./dev.sh 3000                  # Custom port

# Docker
npm run docker:dev             # Port 8080
```

Visit http://localhost:8001 or http://localhost:8080

**Note:** Use a local web server (not `file://`) to avoid CORS issues with ES6 modules.

## Tech Stack

- Native Custom Elements (Web Components v1)
- Tailwind CSS (CDN)
- IBM Plex Sans font
- Pure HTML/CSS/JS - no build required

## Deployment

**Docker (Recommended):**
```bash
# Use specific version for production (recommended)
docker pull ghcr.io/fuggs-app/fuggs-landing:1.0.0
docker run -p 8080:80 ghcr.io/fuggs-app/fuggs-landing:1.0.0

# Or use latest (auto-updates)
docker pull ghcr.io/fuggs-app/fuggs-landing:latest
docker run -p 8080:80 ghcr.io/fuggs-app/fuggs-landing:latest
```

**Docker Compose / Portainer:**
See examples in `portainer/site/` directory.

**Static Hosting:**
Deploy to GitHub Pages, Netlify, Vercel, or any static host - no build step needed.

## Releases

This project follows [Semantic Versioning](https://semver.org/). To create a new release:

```bash
# Patch release (1.0.0 → 1.0.1)
npm run release:patch

# Minor release (1.0.0 → 1.1.0)
npm run release:minor

# Major release (1.0.0 → 2.0.0)
npm run release:major
```

See [RELEASE.md](RELEASE.md) for detailed release process documentation.

## Project Structure

```
fuggs-landing/
├── site/                     # Landing page website
│   ├── index.html           # Main page
│   ├── css/styles.css       # Design tokens & custom styles
│   ├── js/                  # JavaScript modules
│   ├── assets/images/       # Logo & graphics
│   └── Dockerfile           # Site container image
├── portainer/               # Docker Compose stacks for Portainer
│   ├── site/                # Landing page deployment
│   │   ├── docker-compose.yml
│   │   └── README.md
│   ├── listmonk/            # Newsletter service deployment
│   │   ├── docker-compose.yml
│   │   ├── .env.example
│   │   └── README.md
│   └── README.md            # Deployment overview
├── CLAUDE.md                 # Development documentation
├── README.md                 # This file
└── package.json              # Scripts
```

## Links

- **Main Fuggs Repository:** https://github.com/fuggs-app/fuggs
- **Issues:** https://github.com/fuggs-app/fuggs-landing/issues
- **License:** MIT

---

For detailed documentation, component API reference, and troubleshooting, see [CLAUDE.md](CLAUDE.md).
