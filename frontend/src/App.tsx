import React, { useEffect, useState } from "react";
import "./App.css";
import TidalWaterPage from "./Pages/TidalWater.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import HomePage from "./Pages/HomePage.tsx";

const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      {error && (
        <div className="error" style={{ color: "red", fontSize: 18 }}>
          {error}
        </div>
      )}
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              setError={setError}
              loading={loading}
              setLoading={setLoading}
              apiUrl={apiUrl}
            />
          }
        />
        <Route
          path="/tidal-water"
          element={
            <TidalWaterPage
              setError={setError}
              loading={loading}
              setLoading={setLoading}
              apiUrl={apiUrl}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
