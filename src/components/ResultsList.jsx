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

  const formatLocation = (r) => {
    const parts = [r.city, r.region, r.country].filter(Boolean);
    return parts.length ? parts.join(", ") : t("map.unknownLocation");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

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
        <ul className="results-list-full">
          {results.map((r) => {
            const top = getTopParty(r);
            return (
              <li key={r.id} className="results-list-item">
                {top && (
                  <span className="results-list-party" style={{ color: top.color }}>
                    {top.name} {top.match}%
                  </span>
                )}
                <span className="results-list-location">{formatLocation(r)}</span>
                {r.created_at && (
                  <span className="results-list-date">{formatDate(r.created_at)}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
