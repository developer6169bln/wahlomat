import { getSortedResults } from "../utils/calculateMatch";
import { useData } from "../context/DataContext";

export default function Results({ answers, onRestart, onSelectParty }) {
  const { parties, positions } = useData();
  const results = getSortedResults(answers, parties, positions);

  return (
    <div className="results-page">
      <header className="results-header">
        <h1>Dein Ergebnis</h1>
        <p>Sortiert nach Übereinstimmung mit deinen Antworten</p>
      </header>

      <div className="results-list">
        {results.map((party, index) => (
          <button
            key={party.id}
            className="result-item"
            onClick={() => onSelectParty(party)}
          >
            <span className="result-rank">#{index + 1}</span>
            <span
              className={`result-party-badge ${party.textDark ? "text-dark" : ""}`}
              style={{ backgroundColor: party.color }}
            >
              {party.name}
            </span>
            <span className="result-party-name">{party.fullName}</span>
            <span className="result-match">{party.match}%</span>
          </button>
        ))}
      </div>

      <div className="results-actions">
        <button className="btn-restart" onClick={onRestart}>
          Von vorne beginnen
        </button>
      </div>
    </div>
  );
}
