import React from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

function NavigationBar(props) {
  return (
    <Navbar bg="dark" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand>Welcome</Navbar.Brand>
        {props.loggedIn ? (
          <Nav className="me-auto">
            <Navbar.Text>
              <Link
                to="/main"
                style={{ textDecoration: "none", margin: "0px 20px 0px 0px" }}
              >
                Home
              </Link>
            </Navbar.Text>
            <Navbar.Text>
              <Link to="/dashboard" style={{ textDecoration: "none" }}>
                Dashboard
              </Link>
            </Navbar.Text>
          </Nav>
        ) : (
          <>{/* return empty element */}</>
        )}
        <Nav className="justify-content-end">
          {props.loggedIn ? (
            <Navbar.Text>
              Signed in as:{" "}
              <Link style={{ margin: "0px 20px 0px 0px" }}>Mark Otto</Link>
              <Link to="/">Sign out</Link>
            </Navbar.Text>
          ) : (
            <Nav.Link className="me-auto">Sign up</Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
