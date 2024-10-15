import React, { useState } from "react";
import "./App.css";
import TidalWaterPage from "./Pages/TidalWater.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";

const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/*<Route exact path="/" element={<Home />} />*/}
        <Route
          // path="/tidal-water"
          path="/"
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
