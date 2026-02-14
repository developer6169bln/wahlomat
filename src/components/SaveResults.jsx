import { useState } from "react";
import { useTranslation } from "react-i18next";
import { saveResult } from "../lib/api";
import { getLocationByIP } from "../utils/geolocation";
import { useData } from "../context/DataContext";

export default function SaveResults({ answers, partyMatches, onSaved }) {
  const { t } = useTranslation();
  const { mapEnabled } = useData();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (status === "saving") return;
    setError("");
    setStatus("saving");

    try {
      let lat = null, lng = null, city = null, region = null, country = null;
      if (mapEnabled) {
        const loc = await getLocationByIP();
        lat = loc.lat;
        lng = loc.lng;
        city = loc.city;
        region = loc.region;
        country = loc.country;
      }

      await saveResult({
        lat,
        lng,
        city,
        region,
        country,
        answers,
        party_matches: partyMatches,
      });
      setStatus("success");
      onSaved?.();
    } catch (err) {
      setStatus("error");
      setError(err.message || t("save.error"));
    }
  };

  if (status === "success") {
    return <p className="save-success">{t("save.success")}</p>;
  }

  return (
    <div className="save-results">
      <button
        type="button"
        className="btn-save"
        onClick={handleSave}
        disabled={status === "saving"}
      >
        {status === "saving" ? t("save.saving") : t("save.button")}
      </button>
      {error && <p className="save-error">{error}</p>}
      <p className="save-hint">{mapEnabled ? t("save.hint") : t("save.hintNoLocation")}</p>
    </div>
  );
}
