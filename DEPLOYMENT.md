# Deployment – TÜRKOMAT auf Railway

## Live-URL

**https://wahlomat-production.up.railway.app/**

## GitHub ↔ Railway

1. **Railway-Dashboard:** [railway.app](https://railway.app) → Projekt öffnen  
2. **Service auswählen** → **Settings** → **Source**  
3. **Connect Repository:** GitHub-Repo `developer6169bln/wahlomat` verbinden  
4. **Branch:** `main`  
5. **Auto-Deploy:** Bei jedem Push auf `main` wird automatisch neu deployed  

## Manuelles Deploy

- Push auf `main` löst automatisch ein neues Deployment aus  
- Oder im Railway-Dashboard: **Deploy** → **Redeploy**  

## Technik

- **Dockerfile** – Multi-Stage: Node baut die App, Caddy liefert statische Dateien  
- **Caddyfile** – Webserver-Konfiguration für SPA  
- **railway.json** – Nutzung des Dockerfile-Builds  

## Domain ändern

Railway-Dashboard → Service → **Settings** → **Networking** → **Generate Domain** oder **Custom Domain**  
