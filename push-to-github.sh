#!/bin/bash
# Nach dem GitHub-Login ausführen: ./push-to-github.sh

set -e
cd "$(dirname "$0")"

echo "Prüfe GitHub-Anmeldung..."
if ! gh auth status &>/dev/null; then
  echo ""
  echo "Bitte zuerst anmelden:"
  echo "  gh auth login --web --git-protocol https"
  echo ""
  echo "Dann diese Datei erneut ausführen."
  exit 1
fi

echo "Erstelle Repository 'wahlomat' und pushe..."
gh repo create wahlomat --public --source=. --remote=origin --push

echo ""
echo "Fertig! https://github.com/$(gh api user --jq .login)/wahlomat"
