import { useState } from "react";
import { useData } from "../../context/DataContext";

export default function PartiesAdmin() {
  const { parties, theses, positions, updateParties, updatePositions } = useData();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    id: "",
    name: "",
    fullName: "",
    color: "#000000",
    textDark: false,
  });

  const handleAdd = () => {
    setForm({
      id: "",
      name: "",
      fullName: "",
      color: "#000000",
      textDark: false,
    });
    setEditing({ isNew: true });
  };

  const handleEdit = (party) => {
    setForm({
      id: party.id,
      name: party.name,
      fullName: party.fullName,
      color: party.color,
      textDark: party.textDark ?? false,
    });
    setEditing({ id: party.id, isNew: false });
  };

  const handleSave = () => {
    if (!editing) return;
    const { textDark, ...rest } = form;
    const partyData = { ...rest, textDark: !!textDark };

    if (editing.isNew) {
      if (!form.id || !form.name) {
        alert("ID und Kurzname sind Pflichtfelder.");
        return;
      }
      if (parties.some((p) => p.id === form.id)) {
        alert("Diese Partei-ID existiert bereits.");
        return;
      }
      updateParties([...parties, partyData]);
      const partyPositions = {};
      theses.forEach((t) => { partyPositions[t.id] = 0; });
      updatePositions({ ...positions, [form.id]: partyPositions });
    } else {
      updateParties(
        parties.map((p) => (p.id === editing.id ? partyData : p))
      );
    }
    setEditing(null);
  };

  const handleDelete = (id) => {
    if (confirm("Partei wirklich löschen? Die Positionen werden ebenfalls entfernt.")) {
      updateParties(parties.filter((p) => p.id !== id));
      const { [id]: _, ...rest } = positions;
      updatePositions(rest);
      if (editing?.id === id) setEditing(null);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Parteien verwalten</h2>
        <button className="btn-add" onClick={handleAdd}>
          + Neue Partei
        </button>
      </div>

      {editing ? (
        <div className="admin-form">
          <label>
            ID (Kurzform, z.B. spd)
            <input
              type="text"
              value={form.id}
              onChange={(e) => setForm((f) => ({ ...f, id: e.target.value.toLowerCase() }))}
              placeholder="spd"
              disabled={!editing.isNew}
            />
          </label>
          <label>
            Kurzname
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="SPD"
            />
          </label>
          <label>
            Vollständiger Name
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              placeholder="Sozialdemokratische Partei Deutschlands"
            />
          </label>
          <label>
            Farbe
            <div className="color-input">
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
              />
              <input
                type="text"
                value={form.color}
                onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
              />
            </div>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.textDark}
              onChange={(e) => setForm((f) => ({ ...f, textDark: e.target.checked }))}
            />
            Dunkle Schrift auf Badge (für helle Farben wie Gelb)
          </label>
          <div className="form-actions">
            <button className="btn-save" onClick={handleSave}>
              Speichern
            </button>
            <button className="btn-cancel" onClick={() => setEditing(null)}>
              Abbrechen
            </button>
          </div>
        </div>
      ) : null}

      <ul className="admin-list">
        {parties.map((party) => (
          <li key={party.id} className="admin-list-item">
            <div className="list-item-content">
              <span
                className="item-badge"
                style={{
                  backgroundColor: party.color,
                  color: party.textDark ? "#1a1a2e" : "white",
                }}
              >
                {party.name}
              </span>
              <p className="item-text">{party.fullName}</p>
            </div>
            <div className="list-item-actions">
              <button onClick={() => handleEdit(party)}>Bearbeiten</button>
              <button className="btn-danger" onClick={() => handleDelete(party.id)}>
                Löschen
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
