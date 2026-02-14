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
    // Immer numerisch nach höchster Übereinstimmung sortieren (match kann als String gespeichert sein)
    const sorted = [...matches].sort((a, b) => (Number(b.match) || 0) - (Number(a.match) || 0));
    return sorted[0];
  };

  // Nach Standort gruppieren (API liefert created_at DESC = neueste zuerst)
  const groupedByLocation = results.reduce((acc, r) => {
    if (!r.lat || !r.lng) return acc;
    const key = `${r.lat.toFixed(5)}_${r.lng.toFixed(5)}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});
  // Für Liste: pro Standort nur neuestes (für Übersicht)
  const displayResults = Object.values(groupedByLocation).map((arr) => arr[0]);
  // Für Karte: alle Gruppen mit allen Ergebnissen pro Marker
  const mapMarkers = Object.entries(groupedByLocation).map(([key, arr]) => {
    const [lat, lng] = key.split("_").map(Number);
    return { lat, lng, results: arr };
  });

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
            {mapMarkers.map(({ lat, lng, results: groupResults }) => {
              const first = groupResults[0];
              return (
                <Marker key={`${lat}_${lng}`} position={[lat, lng]}>
                  <Popup>
                    <div className="map-popup">
                      {first.city && <strong>{first.city}</strong>}
                      {first.region && <span>, {first.region}</span>}
                      <div className="map-popup-results">
                        {groupResults.map((r) => {
                          const top = getTopParty(r);
                          return top ? (
                            <p key={r.id} className="map-popup-party">
                              <span style={{ color: top.color }}>{top.name}</span> {top.match}%
                              {r.created_at && (
                                <span className="map-popup-date"> ({formatDate(r.created_at)})</span>
                              )}
                            </p>
                          ) : null;
                        })}
                      </div>
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
