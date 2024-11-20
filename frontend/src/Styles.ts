import styled, { createGlobalStyle } from "styled-components";

type Theme = {
	[key: string]: string;
	"--primary-color": string;
	"--secondary-color": string;
};

export const LightTheme: Theme = {
	background: "linear-gradient(to bottom, #87ceeb, #f0f8ff) no-repeat", // Light blue gradient for daytime sky
	"--primary-color": "rgba(255, 255, 255, 0.9)", // Light card background
	"--secondary-color": "rgba(240, 240, 240, 0.9)", // Slightly darker light gray for contrast
	textColor: "#333", // Dark text color for readability
	theme: "light",
	borderColor: "#cccccc",
	iconColor: "#333333",
};

export const DarkTheme: Theme = {
	background: "linear-gradient(to bottom, #2b2d42, #3a3a55) no-repeat", // Darker gradient for night sky
	"--primary-color": "rgba(45, 45, 58, 0.85)", // Dark gray card background
	"--secondary-color": "rgba(60, 60, 75, 0.85)", // Slightly lighter dark gray for contrast
	textColor: "#ffffff", // Light text color for dark background
	theme: "dark",
	borderColor: "#555555",
	iconColor: "#ffffff",
};

const GlobalStyle = createGlobalStyle`
		#root, :root{
        --primary-color: ${({ theme }) => theme["--primary-color"]};
        --secondary-color: ${({ theme }) => theme["--secondary-color"]};
		}
		#root {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;

        height: 100%;
        background: ${({ theme }) => theme.background};
        color: ${({ theme }) => theme.textColor};
    }

    h2 {
        padding: 10px 10px 0 15px;
        margin: 0;
    }

    h3 {
        margin: 0;
        padding-left: 15px;
    }
`;
export default GlobalStyle;

export const Container = styled.div`
	border-radius: 15px;
`;

export const PrimaryContainer = styled(Container)`
	padding: 5px;
`;

export const SecondaryContainer = styled(Container)`
	background: var(--secondary-color);
	padding: 5px;
	box-shadow: 5px 5px 4px rgba(0, 0, 0, 0.3);
`;

export const InfoChart = styled(SecondaryContainer)`
	position: relative;
	margin: 10px;
	h3 {
		color: lightslategrey;
	}
`;
