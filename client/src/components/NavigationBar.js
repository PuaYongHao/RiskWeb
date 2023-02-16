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
            <Nav.Link>Dashboard</Nav.Link>
          </Nav>
        ) : (
          <>{/* return empty element */}</>
        )}
        <Nav className="justify-content-end">
          {props.loggedIn ? (
            <Navbar.Text>
              Signed in as:{" "}
              <Link style={{ margin: "0px 20px 0px 0px" }}>Mark Otto</Link>
              <Link to="/login">Sign out</Link>
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
