import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
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

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    const fetchResults = async () => {
      const { data, error } = await supabase
        .from("results")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (!error) setResults(data || []);
      setLoading(false);
    };
    fetchResults();
  }, []);

  const getTopParty = (r) => {
    const matches = r.party_matches || [];
    return matches.length ? matches[0] : null;
  };

  const firstWithLocation = results.find((r) => r.lat && r.lng);
  const defaultCenter = [51.1657, 10.4515]; // Deutschland

  if (!isSupabaseConfigured()) {
    return (
      <div className="map-page">
        <LanguageSwitcher />
        <button className="btn-back" onClick={onBack}>{t("common.back")}</button>
        <p className="map-empty">{t("map.noData")}</p>
      </div>
    );
  }

  return (
    <div className="map-page">
      <LanguageSwitcher />
      <header className="map-header">
        <button className="btn-back" onClick={onBack}>{t("common.back")}</button>
        <h1>{t("map.title")}</h1>
        <p className="map-subtitle">{t("map.subtitle")}</p>
      </header>

      {loading ? (
        <p className="map-loading">{t("map.loading")}</p>
      ) : (
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
            {results.filter((r) => r.lat && r.lng).map((r) => {
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
      )}
    </div>
  );
}
