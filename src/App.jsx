import { useState } from "react";
import { DataProvider } from "./context/DataContext";
import StartPage from "./components/StartPage";
import ThesisFlow from "./components/ThesisFlow";
import Results from "./components/Results";
import PartyDetail from "./components/PartyDetail";
import AdminPage from "./components/Admin/AdminPage";
import ResultsMap from "./components/ResultsMap";
import ResultsList from "./components/ResultsList";
import "./App.css";

const VIEWS = { start: "start", theses: "theses", results: "results", detail: "detail", admin: "admin", map: "map", resultsList: "resultsList" };

function AppContent() {
  const [view, setView] = useState(VIEWS.start);
  const [answers, setAnswers] = useState({});
  const [selectedParty, setSelectedParty] = useState(null);

  const handleAnswer = (thesisId, value) => {
    setAnswers((prev) => ({ ...prev, [thesisId]: value }));
  };

  const handleRestart = () => {
    setAnswers({});
    setSelectedParty(null);
    setView(VIEWS.start);
  };

  const handleSelectParty = (party) => {
    setSelectedParty(party);
    setView(VIEWS.detail);
  };

  return (
    <div className={`app ${(view === VIEWS.map || view === VIEWS.resultsList) ? "app-fullwidth" : ""}`}>
      {view === VIEWS.start && (
        <StartPage
          onStart={() => setView(VIEWS.theses)}
          onAdmin={() => setView(VIEWS.admin)}
        />
      )}
      {view === VIEWS.theses && (
        <ThesisFlow
          answers={answers}
          onAnswer={handleAnswer}
          onFinish={() => setView(VIEWS.results)}
        />
      )}
      {view === VIEWS.results && (
        <Results
          answers={answers}
          onRestart={handleRestart}
          onSelectParty={handleSelectParty}
          onShowMap={() => setView(VIEWS.map)}
          onShowList={() => setView(VIEWS.resultsList)}
        />
      )}
      {view === VIEWS.detail && selectedParty && (
        <PartyDetail
          party={selectedParty}
          answers={answers}
          onBack={() => setView(VIEWS.results)}
        />
      )}
      {view === VIEWS.admin && (
        <AdminPage onBack={() => setView(VIEWS.start)} />
      )}
      {view === VIEWS.map && (
        <ResultsMap onBack={() => setView(VIEWS.results)} />
      )}
      {view === VIEWS.resultsList && (
        <ResultsList onBack={() => setView(VIEWS.results)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
