import React, { useContext } from "react";
import { Navbar, Nav, Dropdown, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { AuthContext } from "../Context/AuthContext";
import { ThemeContext } from "../ThemeContext";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate, Link   } from "react-router-dom";

function NavBar() {
  const { user, loading, setUser } = useContext(AuthContext);
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        setUser(null);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  console.log("Current user:", user);

  if (loading) {
    return <div>Loading...</div>; // Optionally handle loading state
  }

  return (
    <Navbar
      bg={isDarkTheme ? "dark" : "light"}
      variant={isDarkTheme ? "dark" : "light"}
      expand="lg"
      style={{
        padding: "20px",
        borderBottom: isDarkTheme ? "none" : "2px solid #000",
      }}
    >
      <Navbar.Brand as={Link} to="/" style={{ fontSize: "1.5rem" }}>
        Orchids
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <LinkContainer to="/">
            <Nav.Link>Home</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/about">
            <Nav.Link>About</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/natural">
            <Nav.Link>Natural</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/contact">
            <Nav.Link>Contact</Nav.Link>
          </LinkContainer>
          {user && user.role === "admin" && (
            <LinkContainer to="/dashboard">
              <Nav.Link>Dashboard</Nav.Link>
            </LinkContainer>
          )}
        </Nav>
        <Nav className="ms-auto">
          <Button
            variant="light"
            onClick={toggleTheme}
            style={{
              marginLeft: "auto",
              height: "50px",
              display: "flex",
              alignItems: "center",
              transform: "translate(0px, 7.19999px)",
            }}
          >
            <i
              className={`bi ${
                isDarkTheme ? "bi-lightbulb-fill" : "bi-lightbulb"
              }`}
              style={{ fontSize: "1.2rem", height: "30px", width: "30px" }}
            ></i>
          </Button>
          {user ? (
            <Dropdown align="end" style={{ marginLeft: "10px" }}>
              <Dropdown.Toggle
                variant="light"
                id="dropdown-basic"
                style={{
                  display: "flex",
                  alignItems: "center",
                  transform: "translate(0px, 7.19999px)",
                  height: "50px",
                }}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                ) : (
                  <i
                    className="bi bi-person-circle"
                    style={{
                      fontSize: "1.5rem",
                      marginRight: "10px",
                      width: "30px",
                      height: "30px",
                    }}
                  ></i>
                )}
                {user.displayName || user.name}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <LinkContainer to="/profile">
                  <Dropdown.Item>Profile</Dropdown.Item>
                </LinkContainer>
                {user.role === "admin" && (
                  <LinkContainer to="/dashboard">
                    <Dropdown.Item>Dashboard</Dropdown.Item>
                  </LinkContainer>
                )}
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <LinkContainer to="/login">
              <Nav.Link onClick={handleLogin}>
                <Button variant="light" onClick={handleLogin}>
                  <i
                    className="bi bi-box-arrow-in-right"
                    style={{
                      fontSize: "1.5rem",
                      marginRight: "5px",
                      height: "30px",
                      width: "30px",
                    }}
                  ></i>{" "}
                  Login
                </Button>
              </Nav.Link>
            </LinkContainer>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
