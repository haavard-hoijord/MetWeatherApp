import { Nav, NavLink, NavMenu, Title } from "./NavbarStyle";

const Navbar = () => {
  return (
    <>
      <Nav>
        <Title>Weather App</Title>
        <NavMenu>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/tidal-water">Tidal Water</NavLink>
          <NavLink to="/temperature">Temperature</NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};

export default Navbar;
