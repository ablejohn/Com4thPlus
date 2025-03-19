import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Dropdown,
  Nav,
} from "react-bootstrap";
import { 
  FaBuilding, 
  FaUserCog, 
  FaBook, 
  FaChartBar, 
  FaHandshake, 
  FaTachometerAlt 
} from "react-icons/fa";
import { useProperties } from "../services/propertyContext";
import { theme } from "../styling/theme";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

// Import modularized components
import DashboardSidebar from "./DashboardSidebar";
import PropertyManagement from "./PropertyManagement";
import AffiliatesManagement from "./AffiliatesManagement";
import AnalyticsTab from "./AnalyticsTab";
import ManualBooking from "./ManualBooking";

const AdminPropertyPage = () => {
  const navigate = useNavigate(); // Navigation hook
  const { properties, setProperties, loading } = useProperties();
  const [message, setMessage] = useState({ show: false, text: "", type: "" });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedProperty, setSelectedProperty] = useState(null);
  
  // Define tab configuration for the sidebar
  const tabConfig = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FaTachometerAlt />
    },
    {
      id: "properties",
      label: "Properties",
      icon: <FaBuilding />
    },
    {
      id: "affiliates",
      label: "Affiliates",
      icon: <FaHandshake />
    },
    {
      id: "booking",
      label: "Booking",
      icon: <FaBook />
    }
  ];

  // Dashboard summary calculations
  const dashboardSummary = {
    totalProperties: properties?.length || 0, // Added null check
    availableNow: properties?.filter((p) => p.availability === "Available Now").length || 0,
    comingSoon: properties?.filter((p) => p.availability === "Coming Soon").length || 0,
    notAvailable: properties?.filter((p) => p.availability === "Not Available").length || 0,
    totalBookings: 0,
    conversionRate: "53%",
    totalAffiliates: 0,
    blockedDates: 12, // Example data
  };

  // Show message function
  const showMessage = (text, type = "success") => {
    setMessage({ show: true, text, type });
    setTimeout(() => setMessage({ show: false }), 3000);
  };

  // Property selection handler
  const handlePropertySelect = (propertyId) => {
    const property = properties.find((p) => p.id === propertyId);
    setSelectedProperty(property);
  };

  // Logout handler
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        localStorage.removeItem("authToken"); // Clear stored tokens if any
        sessionStorage.clear(); // Clear session storage
        navigate("/admin/login"); // Redirect to login page
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Card
            style={{
              borderRadius: theme.borderRadius?.lg || "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Card.Header
              style={{
                background: theme.colors?.primary || "#007bff",
                borderRadius: `${theme.borderRadius?.lg || "12px"} ${
                  theme.borderRadius?.lg || "12px"
                } 0 0`,
                padding: "1rem",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="m-0" style={{ color: "#fff" }}>
                  <FaBuilding className="me-2" /> Property Management
                </h2>
                <div>
                  <Dropdown className="d-inline-block">
                    <Dropdown.Toggle variant="light" id="user-dropdown">
                      <FaUserCog />
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                      <Dropdown.Item>Profile</Dropdown.Item>
                      <Dropdown.Item>Settings</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout}>
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {message.show && (
                <Alert
                  variant={message.type}
                  onClose={() => setMessage({ show: false })}
                  dismissible
                >
                  {message.text}
                </Alert>
              )}

              <Row>
                <Col md={3} lg={2} className="mb-4">
                  <DashboardSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    dashboardSummary={dashboardSummary}
                    tabConfig={tabConfig}
                  />
                </Col>

                <Col md={9} lg={10}>
                  {/* Secondary tab navigation for booking functions */}
                  {activeTab === "booking" && (
                    <div className="mb-4">
                      <Nav variant="tabs">
                        <Nav.Item>
                          <Nav.Link
                            active={true}
                            onClick={() => setActiveTab("booking")}
                          >
                            <FaBook className="me-2" /> Manual Booking
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                  )}

                  {activeTab === "dashboard" && (
                    <AnalyticsTab dashboardSummary={dashboardSummary} />
                  )}

                  {activeTab === "properties" && (
                    <PropertyManagement
                      properties={properties}
                      setProperties={setProperties}
                      loading={loading}
                      showMessage={showMessage}
                      onPropertySelect={handlePropertySelect}
                    />
                  )}

                  {activeTab === "affiliates" && <AffiliatesManagement />}

                  {activeTab === "booking" && (
                    <ManualBooking
                      properties={properties}
                      selectedProperty={selectedProperty}
                      onPropertySelect={handlePropertySelect}
                      showMessage={showMessage}
                    />
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPropertyPage;