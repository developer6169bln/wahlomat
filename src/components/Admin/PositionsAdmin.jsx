import { useTranslation } from "react-i18next";
import { useData } from "../../context/DataContext";
import { useThesisTranslation } from "../../hooks/useThesisTranslation";

export default function PositionsAdmin() {
  const { t } = useTranslation();
  const { getThesis } = useThesisTranslation();
  const { theses, parties, positions, updatePositions } = useData();

  const POSITION_OPTIONS = [
    { value: -2, label: t("partyDetail.positionDisagree") },
    { value: -1, label: t("partyDetail.positionRatherDisagree") },
    { value: 0, label: t("partyDetail.positionNeutral") },
    { value: 1, label: t("partyDetail.positionRatherAgree") },
    { value: 2, label: t("partyDetail.positionAgree") },
  ];

  const handleChange = (partyId, thesisId, value) => {
    const numValue = parseInt(value, 10);
    updatePositions({
      ...positions,
      [partyId]: {
        ...(positions[partyId] || {}),
        [thesisId]: numValue,
      },
    });
  };

  if (theses.length === 0 || parties.length === 0) {
    return (
      <div className="admin-section">
        <p className="admin-empty">{t("admin.positions.empty")}</p>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>{t("admin.positions.title")}</h2>
        <p className="admin-hint">{t("admin.positions.hint")}</p>
      </div>

      <div className="positions-grid-wrapper">
        <table className="positions-table">
          <thead>
            <tr>
              <th className="col-thesis">{t("admin.positions.thesis")}</th>
              {parties.map((party) => (
                <th key={party.id} className="col-party">
                  <span
                    className="party-badge-small"
                    style={{
                      backgroundColor: party.color,
                      color: party.textDark ? "#1a1a2e" : "white",
                    }}
                  >
                    {party.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {theses.map((thesis) => (
              <tr key={thesis.id}>
                <td className="col-thesis">
                  <span className="thesis-cat">{getThesis(thesis).category}</span>
                  {getThesis(thesis).text}
                </td>
                {parties.map((party) => (
                  <td key={party.id} className="col-party">
                    <select
                      value={positions[party.id]?.[thesis.id] ?? 0}
                      onChange={(e) =>
                        handleChange(party.id, thesis.id, e.target.value)
                      }
                    >
                      {POSITION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
