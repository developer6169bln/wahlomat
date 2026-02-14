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

## Supabase (PostgreSQL) für Ergebnis-Speicherung & Karte

1. Projekt auf [supabase.com](https://supabase.com) erstellen  
2. SQL-Editor: Migration ausführen → `supabase/migrations/20250214000000_create_results_table.sql`  
3. Settings → API: URL und anon key kopieren  
4. Railway: Environment Variables setzen:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Oder lokal: `.env` mit `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` anlegen (siehe `.env.example`)

Ohne Supabase: Speichern-Button und Karte werden ausgeblendet.

## Domain ändern

Railway-Dashboard → Service → **Settings** → **Networking** → **Generate Domain** oder **Custom Domain**  
