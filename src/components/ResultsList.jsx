import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchResults } from "../lib/api";
import LanguageSwitcher from "./LanguageSwitcher";

export default function ResultsList({ onBack }) {
  const { t } = useTranslation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadResults = async () => {
    setLoading(true);
    try {
      const data = await fetchResults();
      setResults(data || []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadResults();
  }, []);

  const getTopParty = (r) => {
    const matches = r.party_matches || [];
    if (!matches.length) return null;
    const sorted = [...matches].sort((a, b) => (Number(b.match) || 0) - (Number(a.match) || 0));
    return sorted[0];
  };

  // Gesamtprozente nach Parteien: Wie oft war welche Partei Top-Ergebnis?
  const partyTotals = results.reduce((acc, r) => {
    const top = getTopParty(r);
    if (!top) return acc;
    if (!acc[top.id]) acc[top.id] = { ...top, count: 0 };
    acc[top.id].count += 1;
    return acc;
  }, {});

  const totalCount = results.length;
  const partySummary = Object.values(partyTotals)
    .map((p) => ({
      ...p,
      percent: totalCount > 0 ? Math.round((p.count / totalCount) * 100) : 0,
    }))
    .sort((a, b) => b.percent - a.percent);

  return (
    <div className="results-list-page">
      <LanguageSwitcher />
      <header className="results-list-header">
        <button className="btn-back" onClick={onBack}>{t("common.back")}</button>
        <h1>{t("map.resultsList")}</h1>
        <button
          type="button"
          className="btn-refresh"
          onClick={loadResults}
          disabled={loading}
          title={t("map.refresh")}
        >
          {loading ? "…" : "↻"}
        </button>
      </header>

      {loading ? (
        <p className="results-list-loading">{t("map.loading")}</p>
      ) : results.length === 0 ? (
        <p className="results-list-empty">{t("map.noData")}</p>
      ) : (
        <div className="results-list-summary">
          <p className="results-list-total">{t("map.resultsTotal", { count: totalCount })}</p>
          <ul className="results-list-full">
            {partySummary.map((p) => (
              <li key={p.id} className="results-list-item">
                <span className="results-list-party" style={{ color: p.color }}>
                  {p.name}
                </span>
                <span className="results-list-percent">{p.percent}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
