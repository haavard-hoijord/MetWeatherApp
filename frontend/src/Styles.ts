// noinspection CssUnresolvedCustomProperty

import styled, { createGlobalStyle, keyframes } from "styled-components";

const backgroundAnimation = keyframes`
    0% {
        background-position: 0 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0 50%;
    }
`;

const GlobalStyle = createGlobalStyle`
	#root, :root {
			--primary-color: #7d7d7d;
			--secondary-color: #a9a9a9;
	}
	
	body {
		margin: 0;
		padding: 0;
		font-family: Arial, sans-serif;
		background: linear-gradient(90deg, lightskyblue, skyblue, lightblue);
		background-size: 300% 300%;
		animation: background_animation 15s ease-in-out infinite;
		color: white;
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
