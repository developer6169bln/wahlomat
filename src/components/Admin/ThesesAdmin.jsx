import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useData } from "../../context/DataContext";

export default function ThesesAdmin() {
  const { t } = useTranslation();
  const { theses, parties, positions, updateTheses, updatePositions } = useData();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ text: "", category: "" });

  const handleAdd = () => {
    const newId = Math.max(0, ...theses.map((th) => th.id)) + 1;
    setForm({ text: "", category: "Allgemein" });
    setEditing({ id: newId, isNew: true });
  };

  const handleEdit = (thesis) => {
    setForm({ text: thesis.text, category: thesis.category });
    setEditing({ id: thesis.id, isNew: false });
  };

  const handleSave = () => {
    if (!editing) return;
    if (editing.isNew) {
      updateTheses([...theses, { id: editing.id, ...form }]);
      const newPositions = { ...positions };
      parties.forEach((p) => {
        newPositions[p.id] = { ...(newPositions[p.id] || {}), [editing.id]: 0 };
      });
      updatePositions(newPositions);
    } else {
      updateTheses(
        theses.map((th) =>
          th.id === editing.id ? { ...th, ...form } : th
        )
      );
    }
    setEditing(null);
  };

  const handleDelete = (id) => {
    if (confirm(t("admin.theses.deleteConfirm"))) {
      updateTheses(theses.filter((th) => th.id !== id));
      const newPositions = { ...positions };
      parties.forEach((p) => {
        const { [id]: _, ...rest } = newPositions[p.id] || {};
        newPositions[p.id] = rest;
      });
      updatePositions(newPositions);
      if (editing?.id === id) setEditing(null);
    }
  };

  const handleCancel = () => setEditing(null);

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>{t("admin.theses.title")}</h2>
        <button className="btn-add" onClick={handleAdd}>
          {t("admin.theses.add")}
        </button>
      </div>

      {editing ? (
        <div className="admin-form">
          <label>
            {t("admin.theses.category")}
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              placeholder={t("admin.theses.categoryPlaceholder")}
            />
          </label>
          <label>
            {t("admin.theses.thesisLabel")}
            <textarea
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              placeholder={t("admin.theses.thesisPlaceholder")}
              rows={3}
            />
          </label>
          <div className="form-actions">
            <button className="btn-save" onClick={handleSave}>
              {t("common.save")}
            </button>
            <button className="btn-cancel" onClick={handleCancel}>
              {t("common.cancel")}
            </button>
          </div>
        </div>
      ) : null}

      <ul className="admin-list">
        {theses.map((thesis) => (
          <li key={thesis.id} className="admin-list-item">
            <div className="list-item-content">
              <span className="item-category">{thesis.category}</span>
              <p className="item-text">{thesis.text}</p>
            </div>
            <div className="list-item-actions">
              <button onClick={() => handleEdit(thesis)}>{t("common.edit")}</button>
              <button className="btn-danger" onClick={() => handleDelete(thesis.id)}>
                {t("common.delete")}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
