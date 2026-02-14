# Deployment – Türk-O-Mat auf Railway

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

## Railway PostgreSQL für Ergebnis-Speicherung & Karte

1. **PostgreSQL hinzufügen:** Railway-Dashboard → Projekt → **+ New** → **Database** → **PostgreSQL**
2. **Verbindung:** Der PostgreSQL-Service stellt `DATABASE_URL` bereit
3. **App-Service:** In den Settings des App-Services unter **Variables** → **Add Reference** → `Postgres.DATABASE_URL` auswählen (oder den Namen deines DB-Services)
4. Die Tabelle `results` wird beim ersten Start automatisch erstellt

Ohne PostgreSQL: API antwortet mit 503, Speichern schlägt fehl.

## Domain ändern

Railway-Dashboard → Service → **Settings** → **Networking** → **Generate Domain** oder **Custom Domain**  
