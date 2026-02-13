import { useState } from "react";
import { useData } from "../context/DataContext";

const ANSWER_OPTIONS = [
  { value: -1, label: "Stimme nicht zu" },
  { value: 0, label: "Neutral" },
  { value: 1, label: "Stimme zu" },
];

export default function ThesisFlow({ answers, onAnswer, onFinish }) {
  const { theses } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const thesis = theses[currentIndex];

  if (!theses.length) {
    return (
      <div className="thesis-flow">
        <p>Keine Thesen vorhanden. Bitte im Admin-Bereich Thesen anlegen.</p>
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
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
        <span className="progress-text">
          These {currentIndex + 1} von {theses.length}
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
            Überspringen
          </button>
          {currentIndex > 0 && (
            <button className="btn-back" onClick={handleBack}>
              ← Zurück
            </button>
          )}
        </div>
      </article>

      <div className="flow-footer">
        {canFinish && (
          <button className="btn-finish" onClick={onFinish}>
            Auswertung anzeigen
          </button>
        )}
      </div>
    </div>
  );
}
