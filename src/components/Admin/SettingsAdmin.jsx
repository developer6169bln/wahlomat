import { useTranslation } from "react-i18next";
import { useData } from "../../context/DataContext";

export default function SettingsAdmin() {
  const { t } = useTranslation();
  const { mapEnabled, updateMapEnabled } = useData();

  return (
    <div className="admin-settings">
      <h2>{t("admin.settings.title")}</h2>
      <div className="admin-setting-row">
        <label className="admin-toggle">
          <input
            type="checkbox"
            checked={mapEnabled}
            onChange={(e) => updateMapEnabled(e.target.checked)}
          />
          <span className="admin-toggle-slider" />
          <span className="admin-toggle-label">{t("admin.settings.mapEnabled")}</span>
        </label>
        <p className="admin-setting-hint">{t("admin.settings.mapEnabledHint")}</p>
      </div>
    </div>
  );
}
