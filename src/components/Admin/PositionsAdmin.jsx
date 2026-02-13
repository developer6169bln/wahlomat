import { useData } from "../../context/DataContext";

const POSITION_OPTIONS = [
  { value: -2, label: "Stimme nicht zu" },
  { value: -1, label: "Eher nicht zu" },
  { value: 0, label: "Neutral" },
  { value: 1, label: "Eher zu" },
  { value: 2, label: "Stimme zu" },
];

export default function PositionsAdmin() {
  const { theses, parties, positions, updatePositions } = useData();

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
        <p className="admin-empty">
          Bitte zuerst Thesen und Parteien anlegen.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Parteipositionen</h2>
        <p className="admin-hint">
          Wähle für jede Partei und jede These die Position (-2 bis +2).
        </p>
      </div>

      <div className="positions-grid-wrapper">
        <table className="positions-table">
          <thead>
            <tr>
              <th className="col-thesis">These</th>
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
                  <span className="thesis-cat">{thesis.category}</span>
                  {thesis.text}
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
