// AdminPropertyPage.jsx - Main Component
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Dropdown
} from "react-bootstrap";
import { 
  FaBuilding, 
  FaUserCog 
} from "react-icons/fa";
import { useProperties } from "../services/propertyContext";
import { theme } from "../styling/theme";

// Import modularized components
import DashboardSidebar from "./DashboardSidebar";
import PropertyManagement from "./PropertyManagement";
import LeadsManagement from "./LeadsManagement";
import AffiliatesManagement from "./AffiliatesManagement";
import AnalyticsTab from "./AnalyticsTab";

const AdminPropertyPage = () => {
  // Core state
  const { properties, setProperties, loading } = useProperties();
  const [message, setMessage] = useState({ show: false, text: "", type: "" });
  const [activeTab, setActiveTab] = useState("dashboard");

  // Dashboard summary calculations
  const dashboardSummary = {
    totalProperties: properties.length,
    availableNow: properties.filter(p => p.availability === "Available Now").length,
    comingSoon: properties.filter(p => p.availability === "Coming Soon").length,
    notAvailable: properties.filter(p => p.availability === "Not Available").length,
    totalLeads: 15, // Example data (would be calculated from actual leads)
    totalBookings: 8,
    conversionRate: "53%",
    totalAffiliates: 6
  };

  // Show message function (can be passed to child components)
  const showMessage = (text, type = "success") => {
    setMessage({ show: true, text, type });
    setTimeout(() => setMessage({ show: false }), 3000);
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Card style={{ 
            borderRadius: theme.borderRadius?.lg || "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}>
            <Card.Header style={{ 
              background: theme.colors?.primary || "#007bff", 
              borderRadius: `${theme.borderRadius?.lg || "12px"} ${theme.borderRadius?.lg || "12px"} 0 0`,
              padding: "1rem"
            }}>
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
                      <Dropdown.Item>Logout</Dropdown.Item>
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
                  />
                </Col>
                
                <Col md={9} lg={10}>
                  {activeTab === "dashboard" && (
                    <AnalyticsTab dashboardSummary={dashboardSummary} />
                  )}
                  
                  {activeTab === "properties" && (
                    <PropertyManagement 
                      properties={properties}
                      setProperties={setProperties}
                      loading={loading}
                      showMessage={showMessage}
                    />
                  )}
                  
                  {activeTab === "leads" && (
                    <LeadsManagement />
                  )}
                  
                  {activeTab === "affiliates" && (
                    <AffiliatesManagement />
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