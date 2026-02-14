import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useData } from "../context/DataContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function ThesisFlow({ answers, onAnswer, onFinish }) {
  const { t } = useTranslation();
  const { theses } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const thesis = theses[currentIndex];

  const ANSWER_OPTIONS = [
    { value: -1, label: t("thesis.disagree") },
    { value: 0, label: t("thesis.neutral") },
    { value: 1, label: t("thesis.agree") },
  ];

  if (!theses.length) {
    return (
      <div className="thesis-flow">
        <LanguageSwitcher />
        <p>{t("thesis.noTheses")}</p>
      </div>
    );
  }

  const currentAnswer = answers[thesis?.id] ?? null;
  const answeredCount = Object.values(answers).filter((a) => a !== null).length;
  const progress = ((currentIndex + 1) / theses.length) * 100;

  const handleAnswer = (value) => {
    onAnswer(thesis.id, value);
    if (currentIndex < theses.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleSkip = () => {
    onAnswer(thesis.id, null);
    if (currentIndex < theses.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const canFinish = answeredCount >= 1;

  return (
    <div className="thesis-flow">
      <LanguageSwitcher />
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
        <span className="progress-text">
          {t("thesis.progress", { current: currentIndex + 1, total: theses.length })}
        </span>
      </div>

      <article className="thesis-card">
        <span className="thesis-category">{thesis.category}</span>
        <h2 className="thesis-text">{thesis.text}</h2>

        <div className="answer-buttons">
          {ANSWER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`btn-answer ${currentAnswer === opt.value ? "active" : ""}`}
              onClick={() => handleAnswer(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="thesis-actions">
          <button className="btn-skip" onClick={handleSkip}>
            {t("common.skip")}
          </button>
          {currentIndex > 0 && (
            <button className="btn-back" onClick={handleBack}>
              {t("common.back")}
            </button>
          )}
        </div>
      </article>

      <div className="flow-footer">
        {canFinish && (
          <button className="btn-finish" onClick={onFinish}>
            {t("thesis.showResults")}
          </button>
        )}
      </div>
    </div>
  );
}
