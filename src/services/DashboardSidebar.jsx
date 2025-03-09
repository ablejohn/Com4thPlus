// DashboardSidebar.jsx
import React from "react";
import { Card, Nav, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  FaChartBar,
  FaHome,
  FaUsers,
  FaFileExport,
  FaHandshake,
  FaCalendarAlt,
  FaBookmark
} from "react-icons/fa";

const DashboardSidebar = ({ activeTab, setActiveTab, dashboardSummary }) => {
  // Add tooltips for better UX
  const renderTooltip = (text) => (props) => (
    <Tooltip id={`tooltip-${text.toLowerCase().replace(/\s/g, '-')}`} {...props}>
      {text}
    </Tooltip>
  );

  return (
    <>
      <Card className="sidebar mb-3 shadow-sm">
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
            
            {/* Calendar Management - New Item */}
            <Nav.Item>
              <OverlayTrigger placement="right" overlay={renderTooltip("Block dates for maintenance or owner stays")}>
                <Nav.Link 
                  eventKey="calendar" 
                  active={activeTab === "calendar"}
                  onClick={() => setActiveTab("calendar")}
                  className="d-flex align-items-center"
                >
                  <FaCalendarAlt className="me-2" /> 
                  Block Dates
                  {dashboardSummary.blockedDates && (
                    <Badge bg="danger" pill className="ms-auto">
                      {dashboardSummary.blockedDates}
                    </Badge>
                  )}
                </Nav.Link>
              </OverlayTrigger>
            </Nav.Item>
            
            {/* Manual Booking - New Item */}
            <Nav.Item>
              <OverlayTrigger placement="right" overlay={renderTooltip("Manually create bookings for guests")}>
                <Nav.Link 
                  eventKey="booking" 
                  active={activeTab === "booking"}
                  onClick={() => setActiveTab("booking")}
                  className="d-flex align-items-center"
                >
                  <FaBookmark className="me-2" /> 
                  Manual Booking
                </Nav.Link>
              </OverlayTrigger>
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
      
      {/* Enhanced Quick Stats Card */}
      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <h6 className="mb-0">Quick Stats</h6>
        </Card.Header>
        <Card.Body>
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
          {/* New stat for blocked dates */}
          <div className="d-flex justify-content-between mb-2">
            <span>Blocked Dates</span>
            <span className="fw-bold text-danger">{dashboardSummary.blockedDates || 0}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Conversion</span>
            <span className="fw-bold text-success">{dashboardSummary.conversionRate}</span>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default DashboardSidebar;