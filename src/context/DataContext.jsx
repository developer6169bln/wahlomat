import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { theses as defaultTheses } from "../data/theses";
import { parties as defaultParties } from "../data/parties";
import { positions as defaultPositions } from "../data/positions";

const STORAGE_KEY = "wahlomat-data";

const DataContext = createContext(null);

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Fehler beim Laden aus localStorage:", e);
  }
  return null;
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Fehler beim Speichern in localStorage:", e);
  }
}

export function DataProvider({ children }) {
  const [data, setData] = useState(() => {
    const stored = loadFromStorage();
    const base = stored || {
      theses: defaultTheses,
      parties: defaultParties,
      positions: { ...defaultPositions },
    };
    if (base.mapEnabled === undefined) base.mapEnabled = true;
    return base;
  });

  useEffect(() => {
    saveToStorage(data);
  }, [data]);

  const updateTheses = useCallback((theses) => {
    setData((prev) => ({ ...prev, theses }));
  }, []);

  const updateParties = useCallback((parties) => {
    setData((prev) => ({ ...prev, parties }));
  }, []);

  const updatePositions = useCallback((positions) => {
    setData((prev) => ({ ...prev, positions }));
  }, []);

  const resetToDefault = useCallback(() => {
    setData((prev) => ({
      theses: defaultTheses,
      parties: defaultParties,
      positions: { ...defaultPositions },
      mapEnabled: prev.mapEnabled ?? true,
    }));
  }, []);

  const updateMapEnabled = useCallback((enabled) => {
    setData((prev) => ({ ...prev, mapEnabled: enabled }));
  }, []);

  return (
    <DataContext.Provider
      value={{
        theses: data.theses,
        parties: data.parties,
        positions: data.positions,
        mapEnabled: data.mapEnabled ?? true,
        updateTheses,
        updateParties,
        updatePositions,
        updateMapEnabled,
        resetToDefault,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
