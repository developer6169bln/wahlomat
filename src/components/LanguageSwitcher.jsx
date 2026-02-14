import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "de", label: "DE" },
  { code: "en", label: "EN" },
  { code: "tr", label: "TR" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("wahlomat-lang", code);
  };

  return (
    <div className="language-switcher">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          className={`lang-btn ${i18n.language === code ? "active" : ""}`}
          onClick={() => handleChange(code)}
          title={code === "de" ? "Deutsch" : code === "en" ? "English" : "Türkçe"}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
