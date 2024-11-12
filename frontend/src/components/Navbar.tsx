import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";
import i18n from "../i18n.ts";
import { Trans, useTranslation } from "react-i18next";

// Nav: The container for the entire navigation bar
export const Nav = styled.nav`
	background-color: #333; /* Dark gray background for the navbar */
	height: auto;
	padding: 20px 20px;
	box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.2); /* Subtle shadow */
	position: sticky;
	z-index: 2000;
`;

// NavMenu: A container for the navigation links (usually in a row)
export const NavMenu = styled.div`
	display: flex;
	align-items: center;
	gap: 20px; /* Space between nav links */
`;

// NavLink: Each button/link inside the NavMenu, styling react-router-dom's NavLink component
export const NavLink = styled(Link)`
	color: #90caf9; /* Muted blue color for the links */
	text-decoration: none;
	padding: 10px 15px;
	font-size: 16px;
	font-weight: 500;
	border-radius: 4px;
	transition:
		background-color 0.3s ease,
		color 0.3s ease;

	&.active {
		background-color: #555; /* Highlight for the active link */
		color: #ffffff;
	}

	&:hover {
		background-color: #555; /* Slightly lighter gray on hover */
		color: #ffffff; /* Turn text white on hover */
	}

	&:active {
		background-color: #444; /* Even lighter gray for active state */
	}
`;

// Title: The title of the website, displayed above the buttons
export const Title = styled.h1`
	color: #fff;
	font-size: 24px;
	margin: 0 0 25px;
`;

const Navbar = ({ changePage, setDarkTheme, useDarkTheme }: any) => {
	const { t } = useTranslation();
	return (
		<>
			<Nav>
				<Title>{t("title")}</Title>
				<NavMenu>
					<NavLink onClick={changePage} to="/">
						{t("page.home")}
					</NavLink>
					<ThemeToggle onClick={() => setDarkTheme(!useDarkTheme)}>
						{useDarkTheme ? "🌙" : "☀️"}
					</ThemeToggle>

					<LanguageSection>
						{Object.values(i18n.options.supportedLngs as string[])
							.filter((s) => s !== "cimode")
							.map((lng) => (
								<LanguageButton
									lng={lng}
									key={lng}
									type="submit"
									onClick={() => i18n.changeLanguage(lng)}
								>
									<Trans i18nKey={`languages.${lng}`} />
								</LanguageButton>
							))}
					</LanguageSection>
				</NavMenu>
			</Nav>
		</>
	);
};

export default Navbar;

const ThemeToggle = styled.button`
	background: none;
	border: none;
	font-size: 1.5em;
	cursor: pointer;
	color: ${({ theme }) => theme.textColor}; // Icon color matches text color
	position: absolute;
	top: 1rem;
	right: 1rem;

	&:hover {
		opacity: 0.8;
	}
`;

const LanguageSection = styled.div`
	display: flex;
	align-items: center;
	position: absolute;
	right: 1rem;
`;

const LanguageButton = styled.button<{ lng: string }>`
	background: none;
	border: none;
	font-size: 1em;
	cursor: pointer;
	color: ${({ theme }) => theme.textColor}; // Icon color matches text color
	font-weight: ${({ lng }) =>
		i18n.resolvedLanguage === lng ? "bold" : "normal"};
	background: ${({ lng }) =>
		lng === i18n.resolvedLanguage && "rgba(255, 255, 255, 0.1)"};
	min-width: 150px;

	&:hover {
		opacity: 0.8;
	}
`;
