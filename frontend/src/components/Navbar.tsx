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
        </NavMenu>
      </Nav>
    </>
  );
};

export default Navbar;
