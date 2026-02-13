export default function AdminLayout({ activeTab, onTabChange, onBack, children }) {
  const tabs = [
    { id: "theses", label: "Thesen" },
    { id: "parties", label: "Parteien" },
    { id: "positions", label: "Positionen" },
  ];

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <button className="admin-back" onClick={onBack}>
          ← Zurück zum Wahl-O-Mat
        </button>
        <h1>Admin-Bereich</h1>
        <nav className="admin-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="admin-content">{children}</main>
    </div>
  );
}
