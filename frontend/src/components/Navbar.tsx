import { Nav, NavLink, NavMenu, Title } from "./NavbarStyle";

const Navbar = ({ changePage }: any) => {
  return (
    <>
      <Nav>
        <Title>Weather App</Title>
        <NavMenu>
          <NavLink onClick={changePage} to="/">
            Home
          </NavLink>
          <NavLink onClick={changePage} to="/tidal-water">
            Tidal Water
          </NavLink>
          <NavLink onClick={changePage} to="/temperature">
            Temperature
          </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};

export default Navbar;
