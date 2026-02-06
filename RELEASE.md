# Release Process

This document describes how to create a new release of the Fuggs Landing Page.

## Overview

Releases follow [Semantic Versioning](https://semver.org/) (semver):
- **MAJOR** version: Incompatible changes
- **MINOR** version: New features (backwards compatible)
- **PATCH** version: Bug fixes (backwards compatible)

Each release creates:
- Git tag (e.g., `v1.2.3`)
- Versioned Docker image (e.g., `ghcr.io/fuggs-app/fuggs-landing:1.2.3`)
- GitHub Release with release notes

## Prerequisites

- Write access to the repository
- Git configured with your credentials
- Node.js and npm installed (for version management)

## Release Steps

### 1. Update Version in package.json

Use npm's built-in version command to update package.json and create a git tag:

```bash
# For a patch release (1.0.0 → 1.0.1)
npm version patch

# For a minor release (1.0.0 → 1.1.0)
npm version minor

# For a major release (1.0.0 → 2.0.0)
npm version major
```

This will:
- Update the `version` field in `package.json`
- Create a git commit with message "1.2.3" (version number)
- Create a git tag `v1.2.3`

### 2. Push the Tag to GitHub

Push both the commit and the tag:

```bash
git push && git push --tags
```

### 3. Automated Release Process

Once the tag is pushed, GitHub Actions automatically:
1. Builds the Docker image for multiple architectures (amd64, arm64)
2. Tags the image with:
   - Full version: `1.2.3`
   - Minor version: `1.2`
   - Major version: `1`
   - `latest`
3. Pushes images to GitHub Container Registry (ghcr.io)
4. Creates a GitHub Release with release notes

You can monitor the workflow at: `https://github.com/fuggs-app/fuggs-landing/actions`

### 4. Update Portainer Deployments

After the release is published, update your Portainer compose file:

**Option A: Use specific version (recommended for production)**
```yaml
services:
  landing:
    image: ghcr.io/fuggs-app/fuggs-landing:1.2.3  # ← Update this
    container_name: fuggs_landing
    restart: unless-stopped
```

**Option B: Use major version (auto-updates with patches/minors)**
```yaml
services:
  landing:
    image: ghcr.io/fuggs-app/fuggs-landing:1  # ← Always latest v1.x.x
    container_name: fuggs_landing
    restart: unless-stopped
```

**Option C: Use latest (not recommended for production)**
```yaml
services:
  landing:
    image: ghcr.io/fuggs-app/fuggs-landing:latest
    container_name: fuggs_landing
    restart: unless-stopped
```

In Portainer:
1. Go to Stacks → fuggs-landing
2. Update the `image:` tag in the compose file
3. Click "Update the stack"
4. Portainer will pull the new image and restart the container

## Quick Reference

```bash
# 1. Create a patch release
npm version patch

# 2. Push to GitHub
git push && git push --tags

# 3. Wait for GitHub Actions to build (~2-3 minutes)

# 4. Update Portainer compose with new version tag
```

## Manual Release (Alternative)

If you prefer to control the version tag manually:

```bash
# 1. Update package.json version manually
vim package.json  # Change "version": "1.2.3"

# 2. Commit the change
git add package.json
git commit -m "Bump version to 1.2.3"

# 3. Create the tag
git tag v1.2.3

# 4. Push everything
git push && git push --tags
```

## Rollback

If you need to rollback to a previous version in Portainer:

```bash
# Update compose to use previous version
image: ghcr.io/fuggs-app/fuggs-landing:1.2.2  # previous version

# Or pull and run manually
docker pull ghcr.io/fuggs-app/fuggs-landing:1.2.2
docker stop fuggs_landing
docker rm fuggs_landing
docker run -d --name fuggs_landing \
  -p 8080:80 \
  --restart unless-stopped \
  ghcr.io/fuggs-app/fuggs-landing:1.2.2
```

## Troubleshooting

### Tag already exists
```bash
# Delete local tag
git tag -d v1.2.3

# Delete remote tag
git push --delete origin v1.2.3

# Create new tag
git tag v1.2.3
git push --tags
```

### GitHub Actions workflow failed
1. Check the workflow logs: `https://github.com/fuggs-app/fuggs-landing/actions`
2. Common issues:
   - Insufficient permissions (check GITHUB_TOKEN)
   - Docker build errors (check Dockerfile)
   - Registry authentication issues

### Image not available in Portainer
1. Verify image was pushed: `https://github.com/fuggs-app/fuggs-landing/pkgs/container/fuggs-landing`
2. Check image is public or authentication is configured
3. Try pulling manually: `docker pull ghcr.io/fuggs-app/fuggs-landing:1.2.3`

## Best Practices

1. **Always test before releasing**
   - Run `npm run docker:dev` to test Docker build locally
   - Test the site functionality before tagging

2. **Write meaningful release notes**
   - Edit the GitHub Release after it's created
   - Document breaking changes, new features, and bug fixes

3. **Use specific version tags in production**
   - Avoid `latest` in production Portainer deployments
   - Pin to specific versions for predictable deployments

4. **Follow semver strictly**
   - Breaking changes = MAJOR version bump
   - New features = MINOR version bump
   - Bug fixes = PATCH version bump

## Version History

Check all releases at: `https://github.com/fuggs-app/fuggs-landing/releases`

Check all Docker images at: `https://github.com/fuggs-app/fuggs-landing/pkgs/container/fuggs-landing`