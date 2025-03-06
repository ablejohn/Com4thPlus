// AnalyticsTab.jsx
import React from "react";
import {
  Row,
  Col,
  Card,
  Badge
} from "react-bootstrap";
import {
  FaHome,
  FaBuilding,
  FaUsers,
  FaPercentage,
  FaChartLine,
  FaCalendarAlt,
  FaHandshake,
  FaPowerOff,
  FaMoneyBillWave
} from "react-icons/fa";

const AnalyticsTab = ({ dashboardSummary }) => {
  // Mock performance data that would come from actual tracking
  const performanceData = {
    propertiesAdded: 5,
    propertyViews: 142,
    leadsGenerated: 15,
    bookingRate: 53,
    averageResponse: "2.5 hours",
    topProperties: [
      { name: "2-Bedroom in Lekki", views: 45, leads: 4 },
      { name: "Office Space in Ikoyi", views: 38, leads: 3 },
      { name: "Duplex in Victoria Island", views: 32, leads: 5 }
    ]
  };

  return (
    <>
      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="summary-card h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Properties</h6>
                  <h2>{dashboardSummary.totalProperties}</h2>
                  <div className="small text-success">+{performanceData.propertiesAdded} this month</div>
                </div>
                <div className="icon-bg" style={{ backgroundColor: "rgba(0, 123, 255, 0.1)", padding: "12px", borderRadius: "50%" }}>
                  <FaHome size={24} style={{ color: "#007bff" }} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="summary-card h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Leads</h6>
                  <h2>{dashboardSummary.totalLeads}</h2>
                  <div className="small text-success">
                    {performanceData.propertyViews} property views
                  </div>
                </div>
                <div className="icon-bg" style={{ backgroundColor: "rgba(40, 167, 69, 0.1)", padding: "12px", borderRadius: "50%" }}>
                  <FaUsers size={24} style={{ color: "#28a745" }} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="summary-card h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Bookings</h6>
                  <h2>{dashboardSummary.totalBookings}</h2>
                  <div className="small text-success">
                    {performanceData.bookingRate}% conversion
                  </div>
                </div>
                <div className="icon-bg" style={{ backgroundColor: "rgba(255, 193, 7, 0.1)", padding: "12px", borderRadius: "50%" }}>
                  <FaCalendarAlt size={24} style={{ color: "#ffc107" }} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="summary-card h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Affiliates</h6>
                  <h2>{dashboardSummary.totalAffiliates}</h2>
                  <div className="small text-success">
                    3 new referrals
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
                  <div className="fw-bold">{performanceData.averageResponse}</div>
                </div>
                <div className="small">
                  <div className="text-muted">Inquiry Conversion</div>
                  <div className="fw-bold">{performanceData.bookingRate}%</div>
                </div>
                <div className="small">
                  <div className="text-muted">Viewing Rate</div>
                  <div className="fw-bold">74%</div>
                </div>
                <div className="small">
                  <div className="text-muted">Avg. Booking Time</div>
                  <div className="fw-bold">5.2 days</div>
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
                      <span>{dashboardSummary.availableNow} properties</span>
                    </div>
                    <div className="progress mb-3" style={{ height: "8px" }}>
                      <div 
                        className="progress-bar bg-success" 
                        style={{ width: `${dashboardSummary.availableNow / dashboardSummary.totalProperties * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-1">
                      <span>Coming Soon</span>
                      <span>{dashboardSummary.comingSoon} properties</span>
                    </div>
                    <div className="progress mb-3" style={{ height: "8px" }}>
                      <div 
                        className="progress-bar bg-warning" 
                        style={{ width: `${dashboardSummary.comingSoon / dashboardSummary.totalProperties * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-1">
                      <span>Not Available</span>
                      <span>{dashboardSummary.notAvailable} properties</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div 
                        className="progress-bar bg-secondary" 
                        style={{ width: `${dashboardSummary.notAvailable / dashboardSummary.totalProperties * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h5 className="mb-3">Recent Activity</h5>
                  <div className="activity-timeline">
                    <div className="timeline-item d-flex mb-3">
                      <div className="timeline-dot bg-success"></div>
                      <div className="timeline-content ms-2">
                        <p className="mb-0">New lead: John Doe interested in Lekki property</p>
                        <small className="text-muted">2 hours ago</small>
                      </div>
                    </div>
                    
                    <div className="timeline-item d-flex mb-3">
                      <div className="timeline-dot bg-primary"></div>
                      <div className="timeline-content ms-2">
                        <p className="mb-0">Property viewing scheduled for Duplex in VI</p>
                        <small className="text-muted">Yesterday</small>
                      </div>
                    </div>
                    
                    <div className="timeline-item d-flex mb-3">
                      <div className="timeline-dot bg-warning"></div>
                      <div className="timeline-content ms-2">
                        <p className="mb-0">New affiliate partner registered</p>
                        <small className="text-muted">2 days ago</small>
                      </div>
                    </div>
                    
                    <div className="timeline-item d-flex">
                      <div className="timeline-dot bg-info"></div>
                      <div className="timeline-content ms-2">
                        <p className="mb-0">Commission paid to Tobi Akinlade</p>
                        <small className="text-muted">3 days ago</small>
                      </div>
                    </div>
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
              
              {performanceData.topProperties.map((property, index) => (
                <div key={index} className={`property-performance p-2 rounded ${index < performanceData.topProperties.length - 1 ? 'mb-3 border-bottom' : ''}`}>
                  <div className="d-flex justify-content-between">
                    <h6>{property.name}</h6>
                    <Badge bg="success">{property.leads} leads</Badge>
                  </div>
                  <div className="d-flex justify-content-between text-muted small">
                    <span>{property.views} views</span>
                    <span>Conversion: {Math.round(property.leads / property.views * 100)}%</span>
                  </div>
                </div>
              ))}
              
              <div className="text-center mt-4">
                <a href="#" className="btn btn-sm btn-outline-primary">View All Properties</a>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-3">Quick Tasks</h5>
              <div className="list-group">
                <a href="#" className="list-group-item list-group-item-action">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Update Property Listings</h6>
                    <small className="text-primary">Now</small>
                  </div>
                  <p className="mb-1 small text-muted">Check for outdated listings and update availability status</p>
                </a>
                
                <a href="#" className="list-group-item list-group-item-action">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Follow Up on Leads</h6>
                    <small className="text-warning">Today</small>
                  </div>
                  <p className="mb-1 small text-muted">5 leads require follow-up</p>
                </a>
                
                <a href="#" className="list-group-item list-group-item-action">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Process Affiliate Payments</h6>
                    <small className="text-danger">Overdue</small>
                  </div>
                  <p className="mb-1 small text-muted">2 commission payments pending</p>
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .timeline-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-top: 5px;
        }
        
        .activity-timeline {
          position: relative;
        }
      `}</style>
    </>
  );
};

export default AnalyticsTab;