import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import {
  Button,
  Form,
  FormGroup,
  FormControl,
  InputGroup,
} from "react-bootstrap";

import NavigationBar from "../components/NavigationBar";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    // do something with email and password
  }

  function toggleShowPassword() {
    // Toggle the boolean state of showPassword
    setShowPassword(!showPassword);
  }

  return (
    <div>
      <NavigationBar loggedIn={false} />
      <div
        className="container"
        style={{
          width: "50%",
          position: "absolute",
          top: "15%",
          left: "25%",
        }}
      >
        <h2 className="text-center mt-4 mb-4">Login</h2>
        <Form onSubmit={handleSubmit}>
          <FormControl
            type="email"
            id="email"
            placeholder="Email Address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={{
              width: "50%",
              margin: "auto", // Center
              marginBottom: "10px",
            }}
          />
          <FormGroup
            style={{ width: "50%", margin: "auto", marginBottom: "10px" }}
          >
            <InputGroup>
              <FormControl
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <Button variant="light" onClick={toggleShowPassword}>
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputGroup>
          </FormGroup>
          <FormGroup style={{ width: "50%", margin: "auto" }}>
            <Button
              type="submit"
              variant="dark"
              size="lg"
              style={{
                width: "100%",
                textAlign: "center",
              }}
            >
              Login
            </Button>
          </FormGroup>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;
