import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
// leaflet.heat benötigt globales L
if (typeof window !== "undefined") window.L = L;
import "leaflet.heat";
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

function createColoredIcon(color) {
  return L.divIcon({
    className: "colored-pin",
    html: `<div style="background-color:${color};width:16px;height:16px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function MapCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 6);
  }, [center, map]);
  return null;
}

function HeatmapLayers({ results, getTopParty }) {
  const map = useMap();
  const layersRef = useRef([]);

  useEffect(() => {
    if (!L.heatLayer) return;
    const pointsByParty = {};
    results.forEach((r) => {
      if (!r.lat || !r.lng) return;
      const top = getTopParty(r);
      if (!top) return;
      if (!pointsByParty[top.id]) pointsByParty[top.id] = { color: top.color, points: [] };
      pointsByParty[top.id].points.push([r.lat, r.lng, 0.5]);
    });

    const layers = [];
    Object.entries(pointsByParty).forEach(([partyId, { color, points }]) => {
      const layer = L.heatLayer(points, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: { 0: "rgba(255,255,255,0)", 0.5: color + "80", 1: color },
      });
      map.addLayer(layer);
      layers.push(layer);
    });
    layersRef.current = layers;

    return () => {
      layers.forEach((l) => map.removeLayer(l));
      layersRef.current = [];
    };
  }, [map, results, getTopParty]);

  return null;
}

export default function ResultsMap({ onBack }) {
  const { t } = useTranslation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapMode, setMapMode] = useState("pins"); // "pins" | "heatmap"

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

  const resultsWithLocation = results.filter((r) => r.lat && r.lng);
  const displayResults = resultsWithLocation.reduce((acc, r) => {
    const key = `${r.lat.toFixed(5)}_${r.lng.toFixed(5)}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});
  const listItems = Object.values(displayResults).map((arr) => arr[0]);

  const firstWithLocation = resultsWithLocation[0];
  const defaultCenter = [51.1657, 10.4515];

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
        <div className="map-mode-tabs">
          <button
            type="button"
            className={`map-mode-tab ${mapMode === "pins" ? "active" : ""}`}
            onClick={() => setMapMode("pins")}
          >
            {t("map.modePins")}
          </button>
          <button
            type="button"
            className={`map-mode-tab ${mapMode === "heatmap" ? "active" : ""}`}
            onClick={() => setMapMode("heatmap")}
          >
            {t("map.modeHeatmap")}
          </button>
        </div>
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
            {listItems.length === 0 ? (
              <p className="map-list-empty">{t("map.noData")}</p>
            ) : (
              <ul>
                {listItems.map((r) => {
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
              {mapMode === "pins" &&
                resultsWithLocation.map((r) => {
                  const top = getTopParty(r);
                  const color = top?.color || "#888";
                  const groupResults = displayResults[`${r.lat.toFixed(5)}_${r.lng.toFixed(5)}`] || [r];
                  return (
                    <Marker
                      key={r.id}
                      position={[r.lat, r.lng]}
                      icon={createColoredIcon(color)}
                    >
                      <Popup>
                        <div className="map-popup">
                          {r.city && <strong>{r.city}</strong>}
                          {r.region && <span>, {r.region}</span>}
                          <div className="map-popup-results">
                            {groupResults.map((res) => {
                              const topParty = getTopParty(res);
                              return topParty ? (
                                <p key={res.id} className="map-popup-party">
                                  <span style={{ color: topParty.color }}>{topParty.name}</span> {topParty.match}%
                                  {res.created_at && (
                                    <span className="map-popup-date"> ({formatDate(res.created_at)})</span>
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
              {mapMode === "heatmap" && (
                <HeatmapLayers results={resultsWithLocation} getTopParty={getTopParty} />
              )}
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}
