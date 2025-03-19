import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Badge,
  Button,
  Modal
} from "react-bootstrap";
import {
  FaHome,
  FaChartLine,
  FaCalendarAlt,
  FaHandshake,
  FaLock,
  FaHistory,
  FaCrown,
  FaCheck,
  FaArrowUp
} from "react-icons/fa";

const AnalyticsTab = ({ dashboardSummary = {} }) => {
  // Add subscription state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  // Handle premium feature modal
  const handlePremiumFeature = () => {
    setShowPremiumModal(true);
  };

  // Make sure dashboardSummary is initialized with default values
  const summary = {
    totalProperties: dashboardSummary.totalProperties || 0,
    availableNow: dashboardSummary.availableNow || 0,
    comingSoon: dashboardSummary.comingSoon || 0,
    notAvailable: dashboardSummary.notAvailable || 0,
    totalBookings: dashboardSummary.totalBookings || 0,
    totalAffiliates: dashboardSummary.totalAffiliates || 0,
    topProperties: dashboardSummary.topProperties || []
  };

  return (
    <>
      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="summary-card h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Properties</h6>
                  <h2>{summary.totalProperties}</h2>
                  <div className="small text-success">
                    <FaArrowUp className="me-1" />
                    Updated properties
                  </div>
                </div>
                <div className="icon-bg" style={{ backgroundColor: "rgba(0, 123, 255, 0.1)", padding: "12px", borderRadius: "50%" }}>
                  <FaHome size={24} style={{ color: "#007bff" }} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="summary-card h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Bookings</h6>
                  <h2>{summary.totalBookings}</h2>
                  <div className="small text-success">
                    Conversion rate
                  </div>
                </div>
                <div className="icon-bg" style={{ backgroundColor: "rgba(255, 193, 7, 0.1)", padding: "12px", borderRadius: "50%" }}>
                  <FaCalendarAlt size={24} style={{ color: "#ffc107" }} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="summary-card h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Affiliates</h6>
                  <h2>{summary.totalAffiliates}</h2>
                  <div className="small text-success">
                    Active referrals
                  </div>
                </div>
                <div className="icon-bg" style={{ backgroundColor: "rgba(220, 53, 69, 0.1)", padding: "12px", borderRadius: "50%" }}>
                  <FaHandshake size={24} style={{ color: "#dc3545" }} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Performance Visualization */}
      <Row>
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-3">Performance Overview</h5>
              <div style={{ height: "250px" }} className="d-flex justify-content-center align-items-center bg-light rounded mb-3">
                <div className="text-center">
                  <FaChartLine size={40} className="text-muted mb-2" />
                  <p>Monthly property performance visualization</p>
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <div className="small">
                  <div className="text-muted">Response Time</div>
                  <div className="fw-bold">--</div>
                </div>
                <div className="small">
                  <div className="text-muted">Booking Rate</div>
                  <div className="fw-bold">--</div>
                </div>
                <div className="small">
                  <div className="text-muted">Viewing Rate</div>
                  <div className="fw-bold">--</div>
                </div>
                <div className="small">
                  <div className="text-muted">Avg. Booking Time</div>
                  <div className="fw-bold">--</div>
                </div>
              </div>
            </Card.Body>
          </Card>
          
          <Row>
            <Col md={6}>
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h5 className="mb-3">Property Status</h5>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Available Now</span>
                      <span>{summary.availableNow} properties</span>
                    </div>
                    <div className="progress mb-3" style={{ height: "8px" }}>
                      <div 
                        className="progress-bar bg-success" 
                        style={{ width: `${summary.totalProperties > 0 ? 
                          (summary.availableNow / summary.totalProperties * 100) : 0}%` }}
                      ></div>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-1">
                      <span>Coming Soon</span>
                      <span>{summary.comingSoon} properties</span>
                    </div>
                    <div className="progress mb-3" style={{ height: "8px" }}>
                      <div 
                        className="progress-bar bg-warning" 
                        style={{ width: `${summary.totalProperties > 0 ? 
                          (summary.comingSoon / summary.totalProperties * 100) : 0}%` }}
                      ></div>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-1">
                      <span>Not Available</span>
                      <span>{summary.notAvailable} properties</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div 
                        className="progress-bar bg-secondary" 
                        style={{ width: `${summary.totalProperties > 0 ? 
                          (summary.notAvailable / summary.totalProperties * 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              {/* Recent Activity (always premium) */}
              <Card className="shadow-sm mb-4 premium-card" onClick={handlePremiumFeature}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Recent Activity <FaLock size={12} className="ms-1" /></h5>
                    <Badge bg="warning" className="premium-badge">Premium</Badge>
                  </div>
                  <div className="placeholder-content text-center py-3">
                    <FaHistory size={24} className="text-muted mb-2" />
                    <p className="mb-0">Activity tracking available with Premium</p>
                    <Button variant="warning" size="sm" className="mt-2">
                      <FaCrown className="me-1" /> Upgrade to Premium
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Top Properties</h5>
                <Badge bg="primary">Last 30 days</Badge>
              </div>
              
              {summary.topProperties.length > 0 ? (
                summary.topProperties.map((property, index) => (
                  <div key={property.id || index} className={`property-performance p-2 rounded ${index < summary.topProperties.length - 1 ? 'mb-3 border-bottom' : ''}`}>
                    <div className="d-flex justify-content-between">
                      <h6>{property.name || 'Unnamed Property'}</h6>
                      <Badge bg="success">{property.bookings || 0} bookings</Badge>
                    </div>
                    <div className="d-flex justify-content-between text-muted small">
                      <span>{property.views || 0} views</span>
                      <span>Conversion: {property.views ? Math.round((property.bookings || 0) / property.views * 100) : 0}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="mb-0 text-muted">No property data available</p>
                </div>
              )}
              
              <div className="text-center mt-4">
                <a href="#" className="btn btn-sm btn-outline-primary">View All Properties</a>
              </div>
            </Card.Body>
          </Card>
          
          {/* Quick Tasks (always premium) */}
          <Card className="shadow-sm mb-4 premium-card" onClick={handlePremiumFeature}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Quick Tasks <FaLock size={12} className="ms-1" /></h5>
                <Badge bg="warning" className="premium-badge">Premium</Badge>
              </div>
              <div className="placeholder-content text-center py-3">
                <FaCalendarAlt size={24} className="text-muted mb-2" />
                <p className="mb-0">Task management available with Premium</p>
                <Button variant="warning" size="sm" className="mt-2">
                  <FaCrown className="me-1" /> Upgrade to Premium
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Premium Upgrade Modal */}
      <Modal
        show={showPremiumModal}
        onHide={() => setShowPremiumModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Upgrade to Premium</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <FaCrown size={48} className="text-warning mb-3" />
            <h4>Unlock Premium Features</h4>
            <p className="text-muted">
              Get access to Quick Tasks, Recent Activities, Analytics, and more with our Premium plan.
            </p>
          </div>
          
          <h5>Premium Features Include:</h5>
          <ul className="feature-list mb-4">
            <li><FaCheck className="text-success me-2" /> Quick Tasks Management</li>
            <li><FaCheck className="text-success me-2" /> Recent Activities Tracking</li>
            <li><FaCheck className="text-success me-2" /> Advanced Analytics</li>
            <li><FaCheck className="text-success me-2" /> Email Notifications</li>
            <li><FaCheck className="text-success me-2" /> Priority Support</li>
          </ul>
      
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPremiumModal(false)}>
            Maybe Later
          </Button>
          <Button 
            variant="warning" 
            onClick={() => {
              setIsSubscribed(true);
              setShowPremiumModal(false);
            }}
          >
            <FaCrown className="me-1" /> Upgrade Now
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .premium-card {
          position: relative;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .premium-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .premium-badge {
          position: absolute;
          top: 10px;
          right: 10px;
        }

        .placeholder-content {
          color: #6c757d;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #f8f9fa;
          border-radius: 8px;
        }

        .feature-list {
          padding-left: 0;
          list-style: none;
        }

        .feature-list li {
          padding: 8px 0;
          display: flex;
          align-items: center;
        }
      `}</style>
    </>
  );
};

export default AnalyticsTab;