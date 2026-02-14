import { useTranslation } from "react-i18next";

/**
 * Gibt die übersetzte These zurück. Wenn eine Übersetzung für die ID existiert, wird sie verwendet,
 * sonst der Originaltext (für im Admin hinzugefügte Thesen).
 */
export function useThesisTranslation() {
  const { t, i18n } = useTranslation();

  const getThesis = (thesis) => {
    const key = `thesesData.${thesis.id}`;
    const translatedText = t(`${key}.text`);
    const translatedCategory = t(`${key}.category`);
    const hasTranslation = i18n.exists(`${key}.text`);

    return {
      text: hasTranslation ? translatedText : thesis.text,
      category: hasTranslation ? translatedCategory : thesis.category,
    };
  };

  return { getThesis };
}
