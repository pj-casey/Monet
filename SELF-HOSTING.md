# Self-Hosting Monet

Monet can be self-hosted with a single `docker compose up` command.

## Quick Start

```bash
# Clone the repo
git clone https://github.com/your-username/monet.git
cd monet

# Start with Docker Compose
docker compose up -d

# Open in your browser
open http://localhost:3001
```

## What's Included

- **Frontend** — the design editor (served as static files)
- **API server** — Hono REST API for design storage, auth, and sync
- **SQLite database** — stored in a Docker volume (persists across restarts)

## Requirements

- Docker and Docker Compose
- ~512MB RAM
- Any OS (Linux, macOS, Windows)

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 3001) | No |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | No |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | No |

### OAuth Setup (Optional)

To enable Google/GitHub login:

1. **Google:** Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → Create OAuth 2.0 Client. Set redirect URI to `http://your-domain:3001/api/auth/oauth/callback?provider=google`.

2. **GitHub:** Go to [GitHub Developer Settings](https://github.com/settings/developers) → New OAuth App. Set callback URL to `http://your-domain:3001/api/auth/oauth/callback?provider=github`.

3. Add the credentials to `docker-compose.yml` under `environment`.

## Reverse Proxy (Nginx)

To run behind a domain with HTTPS:

```nginx
server {
    listen 443 ssl;
    server_name canvas.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Data & Backups

The SQLite database is stored in the `monet-data` Docker volume.

To backup:
```bash
docker compose cp monet:/app/apps/api/data/monet.db ./backup.db
```

To restore:
```bash
docker compose cp ./backup.db monet:/app/apps/api/data/monet.db
docker compose restart
```

## Updating

```bash
git pull
docker compose build
docker compose up -d
```

Your data is preserved in the Docker volume across updates.
