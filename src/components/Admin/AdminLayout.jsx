import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher";

export default function AdminLayout({ activeTab, onTabChange, onBack, children }) {
  const { t } = useTranslation();

  const tabs = [
    { id: "theses", label: t("admin.tabs.theses") },
    { id: "parties", label: t("admin.tabs.parties") },
    { id: "positions", label: t("admin.tabs.positions") },
  ];

  return (
    <div className="admin-layout">
      <LanguageSwitcher />
      <header className="admin-header">
        <button className="admin-back" onClick={onBack}>
          {t("admin.backToApp")}
        </button>
        <h1>{t("admin.title")}</h1>
        <nav className="admin-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="admin-content">{children}</main>
    </div>
  );
}
