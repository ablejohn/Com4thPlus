// DashboardSidebar.jsx
import React from "react";
import { Card, Nav, Badge, OverlayTrigger, Tooltip, ProgressBar } from "react-bootstrap";
import {
  FaChartBar,
  FaBuilding,
  FaFileExport,
  FaHandshake,
  FaCalendarAlt,
  FaBook,
  FaTachometerAlt,
  FaUserFriends,
  FaChartLine,
  FaPercentage
} from "react-icons/fa";

const DashboardSidebar = ({ activeTab, setActiveTab, dashboardSummary, tabConfig }) => {
  // Add tooltips for better UX
  const renderTooltip = (text) => (props) => (
    <Tooltip
      id={`tooltip-${text.toLowerCase().replace(/\s/g, "-")}`}
      {...props}
      style={{ 
        fontSize: '0.85rem', 
        padding: '0.5rem',
        opacity: 0.95
      }}
    >
      {text}
    </Tooltip>
  );

  return (
    <>
      {/* Main Navigation */}
      <div className="mb-4">
        <h6 className="text-uppercase text-muted mb-3 ps-3 fw-semibold" style={{ fontSize: "0.75rem" }}>
          Main Navigation
        </h6>
        
        <Nav variant="pills" className="flex-column nav-dashboard gap-1">
          {tabConfig && tabConfig.map(tab => (
            <Nav.Item key={tab.id}>
              <OverlayTrigger
                placement="right"
                delay={{ show: 400, hide: 100 }}
                overlay={renderTooltip(tab.label)}
              >
                <Nav.Link
                  active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="d-flex align-items-center py-2 px-3"
                  style={{ 
                    borderRadius: "8px",
                    transition: "all 0.2s ease",
                    backgroundColor: activeTab === tab.id ? "#007bff" : "transparent"
                  }}
                >
                  <span className="nav-icon me-3">
                    {tab.icon}
                  </span>
                  <span className="nav-text">{tab.label}</span>
                  
                  {/* Conditional badges for items with counts */}
                  {tab.id === "properties" && (
                    <Badge bg="primary" pill className="ms-auto" style={{ opacity: 0.8 }}>
                      {dashboardSummary.totalProperties}
                    </Badge>
                  )}
                  {tab.id === "affiliates" && (
                    <Badge bg="info" pill className="ms-auto" style={{ opacity: 0.8 }}>
                      {dashboardSummary.totalAffiliates}
                    </Badge>
                  )}
                </Nav.Link>
              </OverlayTrigger>
            </Nav.Item>
          ))}
          
          {/* Reports (not in tabConfig) */}
          <Nav.Item>
            <OverlayTrigger
              placement="right"
              delay={{ show: 400, hide: 100 }}
              overlay={renderTooltip("Generate and export reports")}
            >
              <Nav.Link
                active={activeTab === "reports"}
                onClick={() => setActiveTab("reports")}
                className="d-flex align-items-center py-2 px-3"
                style={{ 
                  borderRadius: "8px",
                  transition: "all 0.2s ease"
                }}
              >
                <span className="nav-icon me-3">
                  <FaFileExport />
                </span>
                <span className="nav-text">Reports</span>
              </Nav.Link>
            </OverlayTrigger>
          </Nav.Item>
        </Nav>
      </div>

      {/* Enhanced Quick Stats Card */}
      <Card 
        className="border-0 shadow-sm"
        style={{ 
          borderRadius: "12px",
          overflow: "hidden"
        }}
      >
        <Card.Header 
          className="d-flex align-items-center"
          style={{ 
            background: "linear-gradient(to right, #f8f9fa, #edf2f7)",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            padding: "0.85rem 1rem"
          }}
        >
          <FaChartLine className="text-primary me-2" />
          <h6 className="mb-0 fw-semibold">Quick Stats</h6>
        </Card.Header>
        
        <Card.Body className="py-3">
          <div className="stat-item mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="d-flex align-items-center">
                <FaBuilding className="text-secondary me-2" style={{ fontSize: "0.85rem" }} />
                <span>Properties</span>
              </span>
              <Badge bg="light" text="dark" className="fw-semibold">
                {dashboardSummary.totalProperties}
              </Badge>
            </div>
            <div className="d-flex text-muted" style={{ fontSize: "0.8rem" }}>
              <span className="me-2">Available: {dashboardSummary.availableNow}</span>
              <span>Coming Soon: {dashboardSummary.comingSoon}</span>
            </div>
          </div>
          
          <div className="stat-item mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="d-flex align-items-center">
                <FaBook className="text-success me-2" style={{ fontSize: "0.85rem" }} />
                <span>Bookings</span>
              </span>
              <Badge bg="light" text="dark" className="fw-semibold">
                {dashboardSummary.totalBookings}
              </Badge>
            </div>
            <div className="d-flex text-muted" style={{ fontSize: "0.8rem" }}>
              <span>Blocked Dates: {dashboardSummary.blockedDates}</span>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="d-flex justify-content-between align-items-center">
              <span className="d-flex align-items-center">
                <FaPercentage className="text-warning me-2" style={{ fontSize: "0.85rem" }} />
                <span>Conversion</span>
              </span>
              <Badge bg="success" className="fw-semibold" style={{ opacity: 0.9 }}>
                {dashboardSummary.conversionRate}
              </Badge>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      {/* System Status Indicator */}
      <div className="mt-4 d-flex align-items-center justify-content-between px-3">
        <div className="d-flex align-items-center">
          <div 
            className="me-2" 
            style={{ 
              width: "8px", 
              height: "8px", 
              borderRadius: "50%", 
              backgroundColor: "#10b981", 
              boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.3)" 
            }}
          ></div>
          <span className="text-muted" style={{ fontSize: "0.8rem" }}>All systems operational</span>
        </div>
        <span className="text-muted" style={{ fontSize: "0.75rem" }}>v1.2.4</span>
      </div>
    </>
  );
};

export default DashboardSidebar;