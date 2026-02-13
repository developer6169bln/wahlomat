import { useState } from "react";
import AdminLayout from "./AdminLayout";
import ThesesAdmin from "./ThesesAdmin";
import PartiesAdmin from "./PartiesAdmin";
import PositionsAdmin from "./PositionsAdmin";
import { useData } from "../../context/DataContext";

export default function AdminPage({ onBack }) {
  const [activeTab, setActiveTab] = useState("theses");
  const { resetToDefault } = useData();

  const handleReset = () => {
    if (confirm("Alle Daten auf die Standardwerte zurücksetzen? Gespeicherte Änderungen gehen verloren.")) {
      resetToDefault();
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onBack={onBack}
    >
      {activeTab === "theses" && <ThesesAdmin />}
      {activeTab === "parties" && <PartiesAdmin />}
      {activeTab === "positions" && <PositionsAdmin />}
      <footer className="admin-footer">
        <button className="btn-reset" onClick={handleReset}>
          Auf Standard zurücksetzen
        </button>
      </footer>
    </AdminLayout>
  );
}
