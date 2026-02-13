export default function StartPage({ onStart, onAdmin }) {
  return (
    <div className="start-page">
      <header className="start-header">
        <h1 className="logo">Wahl-O-Mat</h1>
        <p className="tagline">Finde heraus, welche Partei deinen Positionen am nächsten steht</p>
      </header>

      <div className="start-content">
        <div className="info-card">
          <h2>So funktioniert's</h2>
          <ol>
            <li>Beantworte die folgenden Thesen mit „Stimme zu“, „Neutral“ oder „Stimme nicht zu“</li>
            <li>Du kannst Thesen überspringen – sie fließen dann nicht in die Auswertung ein</li>
            <li>Am Ende siehst du, wie hoch deine Übereinstimmung mit den Parteipositionen ist</li>
          </ol>
          <p className="disclaimer">
            Der Wahl-O-Mat gibt keine Wahlempfehlung ab. Er dient der politischen Bildung und dem Vergleich von Positionen.
          </p>
        </div>

        <button className="btn-start" onClick={onStart}>
          Jetzt starten
        </button>
        {onAdmin && (
          <a href="#" className="admin-link" onClick={(e) => { e.preventDefault(); onAdmin(); }}>
            Admin-Bereich
          </a>
        )}
      </div>
    </div>
  );
}
