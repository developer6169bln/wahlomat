import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function StartPage({ onStart, onAdmin }) {
  const { t } = useTranslation();

  return (
    <div className="start-page">
      <LanguageSwitcher />
      <header className="start-header">
        <h1 className="logo">{t("start.title")}</h1>
        <p className="tagline">{t("start.tagline")}</p>
      </header>

      <div className="start-content">
        <div className="info-card">
          <h2>{t("start.howItWorks")}</h2>
          <ol>
            <li>{t("start.step1")}</li>
            <li>{t("start.step2")}</li>
            <li>{t("start.step3")}</li>
          </ol>
          <p className="disclaimer">{t("start.disclaimer")}</p>
        </div>

        <button className="btn-start" onClick={onStart}>
          {t("start.startButton")}
        </button>
        {onAdmin && (
          <a href="#" className="admin-link" onClick={(e) => { e.preventDefault(); onAdmin(); }}>
            {t("start.adminLink")}
          </a>
        )}
      </div>
    </div>
  );
}
