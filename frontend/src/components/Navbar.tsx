import { Nav, NavLink, NavMenu } from "./NavbarStyle";

const Navbar = () => {
  return (
    <>
      <Nav>
        <NavMenu>
          <NavLink to="/">Tidal Water</NavLink>
          <NavLink to="/">Test1</NavLink>
          <NavLink to="/">Test2</NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};

export default Navbar;
