import React, { useEffect, useState } from "react";
import "./css/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import HomePage from "./Pages/HomePage.tsx";

const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, []);

  const changePage = () => {
    setError(null);
  };

  return (
    <BrowserRouter>
      <Navbar changePage={changePage} />
      {error && (
        <div className="error">
          <h2 onClick={() => setError(null)}>{error || "Test"}</h2>
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
      </Routes>

      {loading && (
        <div className="loading-container">
          <div className="loading" />
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
