import { useTranslation } from "react-i18next";
import { getSortedResults } from "../utils/calculateMatch";
import { useData } from "../context/DataContext";
import LanguageSwitcher from "./LanguageSwitcher";
import SaveResults from "./SaveResults";
import { isSupabaseConfigured } from "../lib/supabase";

export default function Results({ answers, onRestart, onSelectParty, onShowMap }) {
  const { t } = useTranslation();
  const { parties, positions } = useData();
  const results = getSortedResults(answers, parties, positions);
  const partyMatches = results.map(({ id, name, color, match }) => ({ id, name, color, match }));

  return (
    <div className="results-page">
      <LanguageSwitcher />
      <header className="results-header">
        <h1>{t("results.title")}</h1>
        <p>{t("results.subtitle")}</p>
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

      <SaveResults
        answers={answers}
        partyMatches={partyMatches}
      />

      <div className="results-actions">
        {onShowMap && isSupabaseConfigured() && (
          <button className="btn-map" onClick={onShowMap}>
            {t("results.showMap")}
          </button>
        )}
        <button className="btn-restart" onClick={onRestart}>
          {t("results.restart")}
        </button>
      </div>
    </div>
  );
}
