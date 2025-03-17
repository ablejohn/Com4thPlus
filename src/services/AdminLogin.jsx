import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { FaLock, FaUserShield } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { theme } from "../styling/theme";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const firestore = getFirestore();

  // Get the redirect path from location state or default to /admin/add-property
  const from = location.state?.from?.pathname || "/admin/add-property";

  // Check if user is already logged in as admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userRef = doc(firestore, "users", user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists() && userDoc.data().role === "admin") {
            navigate(from, { replace: true });
          }
        } catch (err) {
          console.error("Error checking admin status:", err);
        }
      }
    };

    checkAdminStatus();
  }, [auth, firestore, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Sign in with Firebase authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Check if user has admin role in Firestore
      const userRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists() && userDoc.data().role === "admin") {
        // User is an admin, redirect to the requested page or default admin page
        navigate(from, { replace: true });
      } else {
        // User exists but doesn't have admin role
        await auth.signOut(); // Sign out non-admin user
        setError("You don't have admin permissions");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password");
      } else {
        setError(
          err.message || "Failed to login. Please check your credentials."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="py-5 d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", background: "#f8f9fa" }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card
            style={{
              borderRadius: theme.borderRadius?.lg || "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "none",
            }}
          >
            <Card.Header
              style={{
                background: theme.colors?.primary || "#007bff",
                borderRadius: `${theme.borderRadius?.lg || "12px"} ${
                  theme.borderRadius?.lg || "12px"
                } 0 0`,
                padding: "1.5rem",
              }}
            >
              <h2 className="text-center m-0" style={{ color: "#fff" }}>
                <FaUserShield className="me-2" /> Admin Login
              </h2>
            </Card.Header>

            <Card.Body className="p-4">
              {error && (
                <Alert
                  variant="danger"
                  onClose={() => setError("")}
                  dismissible
                >
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Admin Email</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaUserShield />
                    </span>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter admin email"
                      required
                      style={{ padding: "0.75rem" }}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Admin Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter admin password"
                      required
                      style={{ padding: "0.75rem" }}
                    />
                  </div>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2 mt-3"
                  style={{
                    background: theme.colors?.primary || "#007bff",
                    borderRadius: theme.borderRadius?.md || "6px",
                  }}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login to Admin Dashboard"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;
