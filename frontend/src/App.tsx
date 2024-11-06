import React, { useEffect, useState } from "react";
import "./css/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import HomePage from "./Pages/HomePage.tsx";
import styled, { createGlobalStyle, keyframes } from "styled-components";

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

      {loading && <GlobalLoading />}
    </BrowserRouter>
  );
}

export default App;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

type LoadingContainerProps = {
  fixed: boolean;
};

const LoadingContainer = styled.div<LoadingContainerProps>`
  position: ${({ fixed }) => (fixed ? "fixed" : "absolute")};
  top: 0;
  left: 0;
  width: ${({ fixed }) => (fixed ? "100vw" : "100%")};
  height: ${({ fixed }) => (fixed ? "100vh" : "100%")};
  z-index: 1000;
  backdrop-filter: blur(3px) brightness(50%);
`;

const LoadingSpinner = styled.div`
  position: absolute;
  border: 8px solid rgba(0, 0, 0, 0.1);
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  top: calc(50% - 25px);
  left: calc(50% - 25px);
  animation: ${spin} 1s linear infinite; /* Apply the spin animation */
`;

const GlobalNoScroll = createGlobalStyle`
  body {
    overflow: hidden;
  }
`;

export const GlobalLoading = () => {
  return (
    <>
      <GlobalNoScroll />
      <LoadingContainer fixed={true}>
        <LoadingSpinner />
      </LoadingContainer>
    </>
  );
};

export const LocalLoading = () => {
  return (
    <>
      <LoadingContainer fixed={false}>
        <LoadingSpinner />
      </LoadingContainer>
    </>
  );
};
