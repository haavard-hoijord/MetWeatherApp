import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import HomePage from "./Pages/HomePage.tsx";
import styled, {
	createGlobalStyle,
	keyframes,
	ThemeProvider,
} from "styled-components";
import GlobalStyle, { LightTheme, DarkTheme } from "./Styles";
import i18n from "./i18n.ts";

const apiUrl = import.meta.env.VITE_API_URL;

function App() {
	const [useDarkTheme, setDarkTheme] = useState(() => {
		const savedTheme = localStorage.getItem("darkTheme");
		return savedTheme ? JSON.parse(savedTheme) : true;
	});

	useEffect(() => {
		localStorage.setItem("darkTheme", JSON.stringify(useDarkTheme));
	}, [useDarkTheme]);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [language, setLanguage] = useState(() => {
		const savedLanguage = localStorage.getItem("i18nextLng");
		return savedLanguage ? savedLanguage : i18n.language;
	});

	useEffect(() => {
		i18n.changeLanguage(language);
		localStorage.setItem("i18nextLng", language);
	}, [language]);

	useEffect(() => {
		const handleLanguageChange = (lng: string) => {
			setLanguage(lng); // Update state to trigger re-render
		};

		i18n.on("languageChanged", handleLanguageChange);

		return () => {
			i18n.off("languageChanged", handleLanguageChange);
		};
	}, []);

	useEffect(() => {
		setError(null);
	}, []);

	const changePage = () => {
		setError(null);
	};

	return (
		<ThemeProvider theme={useDarkTheme ? LightTheme : DarkTheme}>
			<GlobalStyle />
			<BrowserRouter>
				<Navbar
					changePage={changePage}
					setDarkTheme={setDarkTheme}
					useDarkTheme={useDarkTheme}
				/>
				{error && <ErrorModal error={error} setError={setError} />}
				<Routes>
					<Route
						path="/MetWeatherApp"
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
		</ThemeProvider>
	);
}

export default App;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

type LoadingProps = {
	fixed: boolean;
};

const LoadingContainer = styled.div.withConfig({
	shouldForwardProp: (prop) => prop !== "fixed",
})<LoadingProps>`
	position: ${({ fixed }) => (fixed ? "fixed" : "absolute")};
	top: 0;
	left: 0;
	width: ${({ fixed }) => (fixed ? "100vw" : "100%")};
	height: ${({ fixed }) => (fixed ? "100vh" : "100%")};
	z-index: 1000;
	backdrop-filter: blur(3px) brightness(50%);
	border-radius: 15px;
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

const ErrorModal = ({
	setError,
	error,
}: {
	setError: (error: string | null) => void;
	error: string;
}) => {
	return (
		<ErrorModalContainer onClick={() => setError(null)}>
			{error}
		</ErrorModalContainer>
	);
};

const ErrorModalContainer = styled.h2`
	position: fixed;
	bottom: 20px;
	left: 20px;
	background: gray;
	padding: 20px;
	border-radius: 15px;
	color: red;
	max-width: 30%;
	word-wrap: break-word;
	cursor: pointer;
	z-index: 2000;
`;
