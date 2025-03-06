// DashboardSidebar.jsx
import React from "react";
import { Card, Nav, Badge } from "react-bootstrap";
import {
  FaChartBar,
  FaHome,
  FaUsers,
  FaFileExport,
  FaHandshake
} from "react-icons/fa";

const DashboardSidebar = ({ activeTab, setActiveTab, dashboardSummary }) => {
  return (
    <>
      <Card className="sidebar mb-3">
        <Card.Body className="p-0">
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link 
                eventKey="dashboard" 
                active={activeTab === "dashboard"}
                onClick={() => setActiveTab("dashboard")}
                className="d-flex align-items-center"
              >
                <FaChartBar className="me-2" /> Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="properties" 
                active={activeTab === "properties"}
                onClick={() => setActiveTab("properties")}
                className="d-flex align-items-center"
              >
                <FaHome className="me-2" /> Properties
                <Badge bg="primary" pill className="ms-auto">
                  {dashboardSummary.totalProperties}
                </Badge>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="leads" 
                active={activeTab === "leads"}
                onClick={() => setActiveTab("leads")}
                className="d-flex align-items-center"
              >
                <FaUsers className="me-2" /> 
                Leads & Bookings
                <Badge bg="success" pill className="ms-auto">
                  {dashboardSummary.totalLeads}
                </Badge>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="affiliates" 
                active={activeTab === "affiliates"}
                onClick={() => setActiveTab("affiliates")}
                className="d-flex align-items-center"
              >
                <FaHandshake className="me-2" /> 
                Affiliates
                <Badge bg="info" pill className="ms-auto">
                  {dashboardSummary.totalAffiliates}
                </Badge>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="reports" 
                active={activeTab === "reports"}
                onClick={() => setActiveTab("reports")}
                className="d-flex align-items-center"
              >
                <FaFileExport className="me-2" /> 
                Reports
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Body>
      </Card>
      
      {/* Quick Stats Card */}
      <Card>
        <Card.Body>
          <h6 className="text-muted mb-3">Quick Stats</h6>
          <div className="d-flex justify-content-between mb-2">
            <span>Properties</span>
            <span className="fw-bold">{dashboardSummary.totalProperties}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Available</span>
            <span className="fw-bold">{dashboardSummary.availableNow}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Total Leads</span>
            <span className="fw-bold">{dashboardSummary.totalLeads}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Bookings</span>
            <span className="fw-bold">{dashboardSummary.totalBookings}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Conversion</span>
            <span className="fw-bold">{dashboardSummary.conversionRate}</span>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default DashboardSidebar;