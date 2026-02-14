import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { requestLocation, reverseGeocode } from "../utils/geolocation";

export default function SaveResults({ answers, partyMatches, onSaved }) {
  const { t } = useTranslation();
  const [status, setStatus] = useState("idle"); // idle | asking | saving | success | error | no-db
  const [error, setError] = useState("");

  if (!isSupabaseConfigured()) {
    return null;
  }

  const handleSave = async () => {
    setStatus("asking");
    setError("");

    try {
      const { lat, lng } = await requestLocation();
      setStatus("saving");

      const { city, region, country } = await reverseGeocode(lat, lng);

      const { error: insertError } = await supabase.from("results").insert({
        lat,
        lng,
        city: city || null,
        region: region || null,
        country: country || null,
        answers,
        party_matches: partyMatches,
      });

      if (insertError) throw insertError;
      setStatus("success");
      onSaved?.();
    } catch (err) {
      setStatus("error");
      if (err.code === 1) {
        setError(t("save.locationDenied"));
      } else if (err.code === 2) {
        setError(t("save.locationUnavailable"));
      } else if (err.code === 3) {
        setError(t("save.locationTimeout"));
      } else {
        setError(err.message || t("save.error"));
      }
    }
  };

  if (status === "success") {
    return (
      <p className="save-success">{t("save.success")}</p>
    );
  }

  return (
    <div className="save-results">
      <button
        className="btn-save"
        onClick={handleSave}
        disabled={status === "asking" || status === "saving"}
      >
        {status === "asking" && t("save.requesting")}
        {status === "saving" && t("save.saving")}
        {(status === "idle" || status === "error") && t("save.button")}
      </button>
      {error && <p className="save-error">{error}</p>}
      <p className="save-hint">{t("save.hint")}</p>
    </div>
  );
}
