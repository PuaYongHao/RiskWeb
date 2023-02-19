import React, { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import "bootstrap/dist/css/bootstrap.css";
import {
  Button,
  Form,
  FormGroup,
  FormControl,
  InputGroup,
  Alert,
} from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const { setAuth } = useAuth();

  const navigate = useNavigate();

  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "/user",
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const uid = response?.data?._id;
      const username = response?.data?.name;
      const role = response?.data?.privilege;
      setAuth({ uid, email, password, username, role });
      navigate("/main");
    } catch (error) {
      if (!error?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

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
          {errMsg !== "" && (
            <Alert key="danger" variant="danger" dismissible ref={errRef}>
              {errMsg}
            </Alert>
          )}
          <FormControl
            type="email"
            id="email"
            ref={userRef}
            placeholder="Email Address"
            value={email}
            required
            autoComplete="off"
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
                ref={userRef}
                placeholder="Password"
                value={password}
                required
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
