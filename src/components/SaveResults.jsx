import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { saveResult } from "../lib/api";
import { requestLocation, reverseGeocode } from "../utils/geolocation";

export default function SaveResults({ answers, partyMatches, onSaved }) {
  const { t } = useTranslation();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const pendingRef = useRef(false);

  // iOS Safari: requestLocation MUSS als erstes aufgerufen werden – vor jedem setState.
  // Sonst erkennt Safari keine User-Geste mehr und die Berechtigungsabfrage erscheint nicht.
  const handleTap = () => {
    if (status === "asking" || status === "saving" || pendingRef.current) return;
    pendingRef.current = true;
    const promise = requestLocation();
    setError("");
    setStatus("asking");
    promise
      .then(({ lat, lng }) => {
        setStatus("saving");
        return reverseGeocode(lat, lng).then((geo) => ({ lat, lng, ...geo }));
      })
      .then(({ lat, lng, city, region, country }) =>
        saveResult({
          lat,
          lng,
          city: city || null,
          region: region || null,
          country: country || null,
          answers,
          party_matches: partyMatches,
        })
      )
      .then(() => {
        pendingRef.current = false;
        setStatus("success");
        onSaved?.();
      })
      .catch((err) => {
        pendingRef.current = false;
        setStatus("error");
        if (err.code === 1) setError(t("save.locationDenied"));
        else if (err.code === 2) setError(t("save.locationUnavailable"));
        else if (err.code === 3) setError(t("save.locationTimeout"));
        else setError(err.message || t("save.error"));
      });
  };

  if (status === "success") {
    return (
      <p className="save-success">{t("save.success")}</p>
    );
  }

  const handleSaveWithoutLocation = () => {
    if (status === "asking" || status === "saving") return;
    setError("");
    setStatus("saving");
    saveResult({
      lat: null,
      lng: null,
      city: null,
      region: null,
      country: null,
      answers,
      party_matches: partyMatches,
    })
      .then(() => {
        setStatus("success");
        onSaved?.();
      })
      .catch((err) => {
        setStatus("error");
        setError(err.message || t("save.error"));
      });
  };

  return (
    <div className="save-results">
      <button
        type="button"
        className="btn-save"
        onPointerDown={handleTap}
        onClick={handleTap}
        disabled={status === "asking" || status === "saving"}
      >
        {status === "asking" && t("save.requesting")}
        {status === "saving" && t("save.saving")}
        {(status === "idle" || status === "error") && t("save.button")}
      </button>
      <button
        type="button"
        className="btn-save btn-save-secondary"
        onClick={handleSaveWithoutLocation}
        disabled={status === "asking" || status === "saving"}
      >
        {t("save.buttonNoLocation")}
      </button>
      {error && <p className="save-error">{error}</p>}
      <p className="save-hint">{t("save.hint")}</p>
    </div>
  );
}
