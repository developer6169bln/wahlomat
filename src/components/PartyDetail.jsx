import { useData } from "../context/DataContext";

const ANSWER_LABELS = { "-1": "Stimme nicht zu", "0": "Neutral", "1": "Stimme zu" };
const POSITION_LABELS = {
  "-2": "Stimme nicht zu",
  "-1": "Eher nicht zu",
  "0": "Neutral",
  "1": "Eher zu",
  "2": "Stimme zu",
};

export default function PartyDetail({ party, answers, onBack }) {
  const { theses, positions } = useData();
  const partyPositions = positions[party.id] || {};

  return (
    <div className="party-detail">
      <header className="detail-header">
        <button className="btn-back" onClick={onBack}>
          ← Zurück
        </button>
        <div
          className={`detail-party-badge ${party.textDark ? "text-dark" : ""}`}
          style={{ backgroundColor: party.color }}
        >
          {party.name}
        </div>
        <h1>{party.fullName}</h1>
        <p className="detail-match">Übereinstimmung: {party.match}%</p>
      </header>

      <div className="detail-comparison">
        <h2>Vergleich deiner Antworten mit den Parteipositionen</h2>
        <ul className="comparison-list">
          {theses.map((thesis) => {
            const userAnswer = answers[thesis.id];
            const partyPos = partyPositions[thesis.id];
            const userLabel = userAnswer !== null ? ANSWER_LABELS[String(userAnswer)] : "—";
            const partyLabel = partyPos !== undefined ? POSITION_LABELS[String(partyPos)] : "—";

            return (
              <li key={thesis.id} className="comparison-item">
                <p className="comparison-thesis">{thesis.text}</p>
                <div className="comparison-answers">
                  <div className="comparison-user">
                    <span className="label">Deine Antwort:</span>
                    <span>{userLabel}</span>
                  </div>
                  <div className="comparison-party">
                    <span className="label">{party.name}:</span>
                    <span>{partyLabel}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
