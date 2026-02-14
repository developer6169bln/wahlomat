import { useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "./AdminLayout";
import ThesesAdmin from "./ThesesAdmin";
import PartiesAdmin from "./PartiesAdmin";
import PositionsAdmin from "./PositionsAdmin";
import SettingsAdmin from "./SettingsAdmin";
import { useData } from "../../context/DataContext";

export default function AdminPage({ onBack }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("theses");
  const { resetToDefault } = useData();

  const handleReset = () => {
    if (confirm(t("admin.resetConfirm"))) {
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
      {activeTab === "settings" && <SettingsAdmin />}
      <footer className="admin-footer">
        <button className="btn-reset" onClick={handleReset}>
          {t("admin.reset")}
        </button>
      </footer>
    </AdminLayout>
  );
}
