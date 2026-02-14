import { useTranslation } from "react-i18next";
import { useData } from "../context/DataContext";
import LanguageSwitcher from "./LanguageSwitcher";

const POSITION_KEYS = {
  "-2": "positionDisagree",
  "-1": "positionRatherDisagree",
  "0": "positionNeutral",
  "1": "positionRatherAgree",
  "2": "positionAgree",
};

const ANSWER_KEYS = { "-1": "disagree", "0": "neutral", "1": "agree" };

export default function PartyDetail({ party, answers, onBack }) {
  const { t } = useTranslation();
  const { theses, positions } = useData();
  const partyPositions = positions[party.id] || {};

  return (
    <div className="party-detail">
      <LanguageSwitcher />
      <header className="detail-header">
        <button className="btn-back" onClick={onBack}>
          {t("common.back")}
        </button>
        <div
          className={`detail-party-badge ${party.textDark ? "text-dark" : ""}`}
          style={{ backgroundColor: party.color }}
        >
          {party.name}
        </div>
        <h1>{party.fullName}</h1>
        <p className="detail-match">{t("partyDetail.match")}: {party.match}%</p>
      </header>

      <div className="detail-comparison">
        <h2>{t("partyDetail.comparisonTitle")}</h2>
        <ul className="comparison-list">
          {theses.map((thesis) => {
            const userAnswer = answers[thesis.id];
            const partyPos = partyPositions[thesis.id];
            const userLabel = userAnswer !== null ? t(`thesis.${ANSWER_KEYS[String(userAnswer)]}`) : "—";
            const partyLabel = partyPos !== undefined ? t(`partyDetail.${POSITION_KEYS[String(partyPos)]}`) : "—";

            return (
              <li key={thesis.id} className="comparison-item">
                <p className="comparison-thesis">{thesis.text}</p>
                <div className="comparison-answers">
                  <div className="comparison-user">
                    <span className="label">{t("partyDetail.yourAnswer")}:</span>
                    <span>{userLabel}</span>
                  </div>
                  <div className="comparison-party">
                    <span className="label">{party.name}:</span>
                    <span>{partyLabel}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
