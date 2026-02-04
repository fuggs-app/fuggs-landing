# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fuggs Landing Page is a static landing page for Fuggs, an intelligent open-source club accounting software. Built with native Web Components, Tailwind CSS, and IBM Plex Sans font. No build process required - pure HTML/CSS/JS.

## Development Commands

### Local Development Server
```bash
npm run dev                      # Start Python HTTP server on port 8001
npm start                        # Alias for npm run dev
cd site && ./dev.sh              # Bash script alternative (port 8001 default)
cd site && ./dev.sh 3000         # Custom port
cd site && python3 -m http.server 8001  # Direct Python command
```

**Important:** Always run a local web server (not `file://` protocol) to avoid CORS issues with ES6 modules. The site files are in the `site/` directory.

### Docker Commands
```bash
npm run docker:build    # Build Docker image (builds from site/ directory)
npm run docker:run      # Run container on port 8080
npm run docker:dev      # Build and run combined
```

## Architecture

### Web Components (ES6 Modules)

The codebase uses **native Custom Elements API** (Web Components v1) without any framework. All components are autonomous custom elements that encapsulate their own HTML, styling, and behavior.

**Component Loading Pattern:**
1. Components are loaded as ES6 modules at the bottom of `site/index.html`
2. Each component extends `HTMLElement` and self-registers via `customElements.define()`
3. `site/js/main.js` waits for all components to be defined using `customElements.whenDefined()` before initializing global features

**Component Structure:**
- Components render by setting `this.innerHTML` in `connectedCallback()`
- Event listeners are attached after rendering in component methods
- No Shadow DOM is used - components render directly into Light DOM
- Components can accept attributes via `this.getAttribute()`

**Available Components:**
- `<fuggs-nav>` - Navigation with mobile menu and scroll behavior (site/js/components/fuggs-nav.js:6-111)
- `<fuggs-hero>` - Hero section with gradient background
- `<fuggs-feature-card>` - Reusable feature cards with icon attribute system (site/js/components/fuggs-feature-card.js:6-66)
- `<fuggs-how-step>` - Numbered process steps
- `<fuggs-cta-section>` - Call-to-action with email signup
- `<fuggs-footer>` - Footer with dynamic copyright year

### Global Features (main.js)

`site/js/main.js` provides two main features after component initialization:

1. **Smooth Scrolling:** Handles anchor link clicks with offset for fixed navigation (64px)
2. **Scroll Animations:** Uses Intersection Observer to trigger `.fade-in` animations with one-time observation

### Styling Architecture

**CSS Organization:**
- `site/css/styles.css` - Contains CSS custom properties (design tokens) and reusable component styles
- Tailwind CSS via CDN with custom config in `site/index.html` head
- Custom Tailwind config extends theme with Fuggs brand colors and IBM Plex Sans font

**Design Tokens (CSS Custom Properties):**
- Brand colors: `--fuggs-primary` (#FF521D), `--fuggs-primary-hover`, `--fuggs-primary-active`, `--fuggs-primary-light`
- Spacing scale: `--spacing-xs` through `--spacing-2xl`
- Shadow scale: `--shadow-sm` through `--shadow-xl`
- Transition timing: `--transition-fast`, `--transition-base`, `--transition-slow`

**Component Classes:**
- `.btn-primary` / `.btn-secondary` - Button styles with hover/active states
- `.feature-card` - Feature card container with hover lift effect
- `.fade-in` / `.fade-in.visible` - Scroll animation classes
- `.gradient-hero` / `.gradient-cta` - Gradient backgrounds

### Content Language

Content is in **German** (lang="de"). When modifying text content, maintain German language unless explicitly asked to change.

## File Structure

```
fuggs-landing/
├── site/                   # Landing page website
│   ├── index.html         # Main page (component declarations, Tailwind config)
│   ├── css/
│   │   └── styles.css     # Design tokens and custom styles
│   ├── js/
│   │   ├── main.js        # Global initialization, smooth scroll, animations
│   │   └── components/    # Web Components (ES6 modules)
│   ├── assets/images/     # Logo and graphics (SVG format)
│   ├── Dockerfile         # Nginx alpine production image
│   ├── .dockerignore      # Docker ignore patterns
│   └── dev.sh             # Development server script
├── CLAUDE.md              # Development documentation (this file)
├── README.md              # User-facing documentation
└── package.json           # npm scripts only (no dependencies)
```

## Key Patterns

### Adding New Icons to Feature Cards

Icons are defined in `site/js/components/fuggs-feature-card.js` within the `getIcon()` method. To add new icons:

1. Add SVG markup to the `icons` object in `getIcon()` method
2. Use the icon by passing the key as the `icon` attribute: `<fuggs-feature-card icon="new-icon" ...>`

### Modifying Navigation Links

Navigation items are hardcoded in `site/js/components/fuggs-nav.js` HTML template. Menu appears in both desktop and mobile versions - update both sections when changing links.

### Brand Color Changes

Update CSS custom properties in `site/css/styles.css` `:root` selector AND the Tailwind config in `site/index.html` script block to maintain consistency.

## Deployment Notes

- **Production:** Docker image uses nginx:alpine, serves static files from `/usr/share/nginx/html/`
- **GitHub Pages / Netlify / Vercel:** Works out-of-box, no build step required
- **CDN Dependencies:** Tailwind CSS and Google Fonts (IBM Plex Sans) are loaded via CDN with preconnect hints

## Browser Compatibility

Requires modern browsers with Custom Elements support:
- Chrome/Edge 67+
- Firefox 63+
- Safari 10.1+
- Mobile browsers (iOS Safari, Chrome Mobile)

No polyfills included.

## Web Components API Reference

### `<fuggs-nav>`
Sticky navigation bar with logo, menu links, and CTA button.

**Attributes:** None (content is hardcoded)

**Features:**
- Responsive mobile menu with hamburger toggle
- Scroll-based styling (transparent → solid background after 20px scroll)
- Auto-close menu on link click
- Mobile menu toggles via `#mobile-menu-btn`

**Customization:** Edit `site/js/components/fuggs-nav.js` template to change menu items or links.

---

### `<fuggs-hero>`
Hero section with headline, subheadline, and CTA buttons.

**Attributes:** None

**Features:**
- Gradient background (`.gradient-hero`)
- Responsive layout
- Social proof stats

---

### `<fuggs-feature-card>`
Reusable feature card component with icon, title, and description.

**Attributes:**
- `icon` (string, required): Icon identifier - "ai", "docker", "opensource", "clock", "cloud", "workflow", "secure"
- `title` (string, required): Card title
- `description` (string, required): Card description

**Example:**
```html
<fuggs-feature-card
  icon="ai"
  title="Intelligente Belegverarbeitung"
  description="Automatische Extraktion von Rechnungsdaten...">
</fuggs-feature-card>
```

**Features:**
- Hover animation (lift + shadow)
- SVG icons embedded in component
- `.feature-card` class applies styling from styles.css

---

### `<fuggs-how-step>`
Numbered process step component.

**Attributes:**
- `step` (string, required): Step number (displayed in circle badge)
- `title` (string, required): Step title
- `description` (string, required): Step description

**Example:**
```html
<fuggs-how-step
  step="1"
  title="Upload"
  description="Laden Sie Ihre Belege hoch">
</fuggs-how-step>
```

**Features:**
- Numbered circle badge
- Arrow connectors between steps (CSS-based)
- Responsive layout

---

### `<fuggs-cta-section>`
Call-to-action section with email signup form.

**Attributes:** None

**Features:**
- Gradient background (`.gradient-cta`)
- Email signup form with validation
- Newsletter subscription

---

### `<fuggs-footer>`
Site footer with links, logo, and copyright.

**Attributes:** None

**Features:**
- Multi-column layout (responsive)
- Social media links
- Dynamic copyright year (JavaScript-generated)

## Design Tokens Reference

### Colors (CSS Custom Properties)

| Token | Value | Usage |
|-------|-------|-------|
| `--fuggs-primary` | #FF521D | Primary brand color |
| `--fuggs-primary-hover` | #E6491A | Hover states |
| `--fuggs-primary-active` | #CC4017 | Active states |
| `--fuggs-primary-light` | #FFE5DC | Light backgrounds |
| `--fuggs-success` | #24a148 | Success states |
| `--fuggs-warning` | #f1c21b | Warning states |
| `--fuggs-danger` | #da1e28 | Error states |

**Tailwind Extensions:** Brand colors are also available as `fuggs-orange`, `fuggs-orange-hover`, etc. in Tailwind classes.

### Typography Scale

- **Font Family:** IBM Plex Sans (loaded via Google Fonts CDN)
- **Weights:** 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Responsive Scale:**
  - h1: 3rem (desktop), 2rem (mobile)
  - h2: 2rem (desktop), 1.5rem (mobile)
  - h3: 1.5rem (desktop), 1.25rem (mobile)
  - body: 1rem

### Spacing Scale

| Token | Value |
|-------|-------|
| `--spacing-xs` | 0.5rem |
| `--spacing-sm` | 1rem |
| `--spacing-md` | 2rem |
| `--spacing-lg` | 3rem |
| `--spacing-xl` | 4rem |
| `--spacing-2xl` | 6rem |

### Shadows & Transitions

**Shadows:** `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`
**Transitions:** `--transition-fast` (150ms), `--transition-base` (300ms), `--transition-slow` (500ms)

## Customization Guide

### Changing Brand Colors

Update **both** locations:

1. **CSS Variables** in `site/css/styles.css`:
```css
:root {
  --fuggs-primary: #FF521D;
  --fuggs-primary-hover: #E6491A;
  /* ... */
}
```

2. **Tailwind Config** in `site/index.html` head:
```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'fuggs-orange': '#FF521D',
        /* ... */
      }
    }
  }
}
```

### Adding New Feature Card Icons

Edit `site/js/components/fuggs-feature-card.js` in the `getIcon()` method:

```javascript
getIcon(iconName) {
  const icons = {
    'ai': `<svg>...</svg>`,
    'your-new-icon': `<svg class="w-12 h-12 text-fuggs-orange">...</svg>`
  };
  return icons[iconName] || icons['ai'];
}
```

Then use: `<fuggs-feature-card icon="your-new-icon" ...>`

### Modifying Navigation

Navigation items are in `site/js/components/fuggs-nav.js` template. Update **both** desktop and mobile menu sections when adding/removing links.

### Changing Content

- **Page content:** Edit `site/index.html` sections directly
- **Component content:** Edit respective component files in `site/js/components/`
- **Meta tags:** Update `site/index.html` head section for SEO/OG tags

## Deployment Options

### Docker Production

**Pre-built Image (Recommended):**
```bash
docker pull ghcr.io/fuggs-app/fuggs-landing:latest
docker run -p 8080:80 ghcr.io/fuggs-app/fuggs-landing:latest
```

**Build Custom Image:**
```bash
docker build -t fuggs-landing site/
docker run -p 8080:80 fuggs-landing
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  landing:
    image: ghcr.io/fuggs-app/fuggs-landing:latest
    ports:
      - "80:80"
    restart: unless-stopped
```

The Dockerfile uses `nginx:alpine` base image and serves files from `/usr/share/nginx/html/`.

### GitHub Pages

1. Push to GitHub repository
2. Settings → Pages
3. Source: Deploy from branch `main`, root `/`
4. Access at `https://[username].github.io/[repo]/`

### Netlify / Vercel / Cloudflare Pages

1. Connect GitHub repository
2. Deploy (no build configuration needed)
3. Framework preset: None (static site)

### Custom Nginx Server

Copy files to web root and configure:

```nginx
server {
    listen 80;
    server_name fuggs.app;
    root /var/www/fuggs-landing;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Optional: Cache static assets
    location ~* \.(js|css|svg|png|jpg|jpeg|gif|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Troubleshooting

### Components Not Rendering

**Symptoms:** Blank page or missing sections

**Solutions:**
1. Check browser console for errors (F12)
2. Verify you're using a local web server (not `file://` protocol)
3. Confirm all component files are loaded (Network tab in DevTools)
4. Check browser supports Custom Elements (all modern browsers do)
5. Ensure all components are defined before `main.js` runs

### Styles Not Loading

**Symptoms:** Unstyled content or missing Tailwind classes

**Solutions:**
1. Verify Tailwind CDN is accessible (check Network tab)
2. Confirm `site/css/styles.css` loads successfully
3. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
4. Check for JavaScript errors that might block rendering

### Images Not Showing

**Symptoms:** Broken logo or missing images

**Solutions:**
1. Verify `site/assets/images/logo.svg` exists
2. Check file paths are correct (relative to `site/index.html`)
3. Ensure web server serves SVG with correct MIME type (`image/svg+xml`)
4. For Docker, verify files are copied correctly in site/Dockerfile

### Mobile Menu Not Working

**Symptoms:** Hamburger menu doesn't toggle

**Solutions:**
1. Check `site/js/components/fuggs-nav.js` loaded and initialized
2. Verify event listeners are attached (check console for errors)
3. Inspect element IDs match: `#mobile-menu-btn` and `#mobile-menu`

## Browser DevTools Tips

### Inspecting Web Components

1. Open DevTools (F12)
2. Elements tab → Find custom elements like `<fuggs-nav>`
3. Expand to see rendered HTML in Light DOM
4. Web Components render directly (no Shadow DOM used)

### Debugging Component Initialization

Components log to console when fully initialized:
```
Fuggs Landing Page initialized
```

If this message doesn't appear, check which components failed to load in Network tab.

### Testing Scroll Animations

Use DevTools to scroll page programmatically:
```javascript
window.scrollTo({ top: 500, behavior: 'smooth' })
```

Fade-in animations trigger via Intersection Observer when elements enter viewport.
