# Wahl-O-Mat

Ein interaktives Tool zur politischen Bildung – vergleiche deine Positionen mit denen von Parteien.

## Starten

```bash
npm install
npm run dev
```

Die App läuft unter [http://localhost:5173](http://localhost:5173).

## Projektstruktur

```
src/
├── data/           # Thesen, Parteien, Positionen
├── components/     # React-Komponenten
├── utils/          # Berechnungslogik
├── App.jsx
└── main.jsx
```

## Daten anpassen

- **`src/data/theses.js`** – Thesen mit Kategorien
- **`src/data/parties.js`** – Parteien mit Farben
- **`src/data/positions.js`** – Parteipositionen (-2 bis +2 pro These)

## Hinweis

Dieses Projekt dient der politischen Bildung und gibt keine Wahlempfehlung ab. Die Beispieldaten sind fiktiv.
