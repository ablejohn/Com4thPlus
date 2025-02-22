// src/components/AdminLogin.jsx
import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Hardcoded credentials for simplicity (replace with backend auth later)
    const correctUsername = "admin";
    const correctPassword = "password123";

    if (username === correctUsername && password === correctPassword) {
      localStorage.setItem("isAdminLoggedIn", "true");
      setError("");
      navigate("/admin/properties");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center min-vh-100 bg-light"
    >
      <Card
        className="shadow-lg border-0"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <Lock size={40} className="text-primary" />
            <h2 className="fw-bold mt-3">Admin Login</h2>
            <p className="text-muted">Access the admin dashboard</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-3"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-3"
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 rounded-3 py-2"
            >
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminLogin;
