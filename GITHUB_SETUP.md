# GitHub-Verbindung einrichten

Das Projekt ist bereits für Git vorbereitet (Commit erstellt).

## Schritt 1: GitHub-Login abschließen

Falls noch nicht geschehen, im Terminal ausführen:
```bash
gh auth login --web --git-protocol https
```

## Schritt 2: Repository auf GitHub erstellen

**Option A – Mit GitHub CLI (empfohlen):**
```bash
cd /Users/yasinkorkot/new-project/WahlOmat
gh repo create wahlomat --public --source=. --remote=origin --push
```

**Option B – Manuell:**
1. Gehe zu [github.com/new](https://github.com/new)
2. Repository-Name: **wahlomat**
3. Sichtbarkeit: **Public**
4. **NICHT** "Add README" aktivieren (Projekt existiert bereits)
5. Auf "Create repository" klicken
6. Dann im Projektordner:
```bash
cd /Users/yasinkorkot/new-project/WahlOmat
git remote add origin https://github.com/DEIN_USERNAME/wahlomat.git
git push -u origin main
```
(Ersetze `DEIN_USERNAME` durch deinen GitHub-Benutzernamen)
