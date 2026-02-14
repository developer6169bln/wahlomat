import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { fetchResults } from "../lib/api";
import LanguageSwitcher from "./LanguageSwitcher";
import "leaflet/dist/leaflet.css";

// Leaflet Default-Icon Fix (React-Leaflet)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function MapCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 6);
  }, [center, map]);
  return null;
}

export default function ResultsMap({ onBack }) {
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
    // Immer nach höchster Übereinstimmung sortieren (falls Reihenfolge nicht stimmt)
    const sorted = [...matches].sort((a, b) => (b.match ?? 0) - (a.match ?? 0));
    return sorted[0];
  };

  // Pro Standort nur das neueste Ergebnis anzeigen (API liefert created_at DESC)
  const deduplicatedByLocation = results.reduce((acc, r) => {
    if (!r.lat || !r.lng) return acc;
    const key = `${r.lat.toFixed(4)}_${r.lng.toFixed(4)}`;
    if (!acc[key]) acc[key] = r;
    return acc;
  }, {});
  const displayResults = Object.values(deduplicatedByLocation);

  const firstWithLocation = displayResults.find((r) => r.lat && r.lng);
  const defaultCenter = [51.1657, 10.4515]; // Deutschland

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
    <div className="map-page">
      <LanguageSwitcher />
      <header className="map-header">
        <button className="btn-back" onClick={onBack}>{t("common.back")}</button>
        <h1>{t("map.title")}</h1>
        <p className="map-subtitle">{t("map.subtitle")}</p>
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
        <p className="map-loading">{t("map.loading")}</p>
      ) : (
        <div className="map-with-list">
          <aside className="map-results-list">
            <h3>{t("map.resultsList")}</h3>
            {displayResults.length === 0 ? (
              <p className="map-list-empty">{t("map.noData")}</p>
            ) : (
              <ul>
                {displayResults.map((r) => {
                  const top = getTopParty(r);
                  return (
                    <li key={r.id} className="map-list-item">
                      <span className="map-list-location">{formatLocation(r)}</span>
                      {top && (
                        <span className="map-list-party" style={{ color: top.color }}>
                          {top.name} {top.match}%
                        </span>
                      )}
                      {r.created_at && (
                        <span className="map-list-date">{formatDate(r.created_at)}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>
          <div className="map-container">
          <MapContainer
            center={defaultCenter}
            zoom={5}
            className="leaflet-map"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapCenter center={firstWithLocation ? [firstWithLocation.lat, firstWithLocation.lng] : null} />
            {displayResults.map((r) => {
              const top = getTopParty(r);
              return (
                <Marker key={r.id} position={[r.lat, r.lng]}>
                  <Popup>
                    <div className="map-popup">
                      {r.city && <strong>{r.city}</strong>}
                      {r.region && <span>, {r.region}</span>}
                      {top && (
                        <p className="map-popup-party">
                          {t("map.topParty")}:{" "}
                          <span style={{ color: top.color }}>{top.name}</span> ({top.match}%)
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}
