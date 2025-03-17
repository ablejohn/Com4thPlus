import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Badge,
  Button,
  Modal,
  Spinner
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
  FaMoneyBillWave,
  FaLock,
  FaHistory,
  FaCrown,
  FaCheck,
  FaExclamationTriangle,
  FaArrowUp
} from "react-icons/fa";
import { useProperties } from "../services/propertyContext";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "../../firebase";

const AnalyticsTab = () => {
  // Add subscription state (this would normally come from user context/profile)
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  // Get properties from context
  const { properties, loading: propertiesLoading } = useProperties();
  
  // State for bookings and analytics data
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dashboard summary state
  const [dashboardSummary, setDashboardSummary] = useState({
    totalProperties: 0,
    availableNow: 0,
    comingSoon: 0,
    notAvailable: 0,
    totalBookings: 0,
    totalLeads: 0,
    totalAffiliates: 0,
    topProperties: []
  });

  // Fetch bookings from Firestore
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsCollection = collection(db, "bookings");
        const bookingsQuery = query(bookingsCollection, orderBy("createdAt", "desc"));
        const bookingsSnapshot = await getDocs(bookingsQuery);
        
        const bookingsData = [];
        bookingsSnapshot.forEach((doc) => {
          bookingsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setBookings(bookingsData);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings data.");
      }
    };
    
    fetchBookings();
  }, []);

  // Calculate dashboard summary when properties and bookings are loaded
  useEffect(() => {
    if (propertiesLoading) {
      setIsLoading(true);
      return;
    }
    
    try {
      setIsLoading(true);

      // Calculate property availability stats
      const availableNow = properties.filter(p => 
        p.availability === "Available Now" || 
        p.availability === "availablenow"
      ).length;
      
      const comingSoon = properties.filter(p => 
        p.availability === "Coming Soon" || 
        p.availability === "comingsoon"
      ).length;
      
      const notAvailable = properties.length - availableNow - comingSoon;
      
      // Find top properties (based on bookings)
      const propertyCounts = {};
      bookings.forEach(booking => {
        const propId = booking.propertyId;
        if (propId) {
          propertyCounts[propId] = (propertyCounts[propId] || 0) + 1;
        }
      });
      
      // Convert to array and sort
      const topPropertyIds = Object.keys(propertyCounts)
        .sort((a, b) => propertyCounts[b] - propertyCounts[a])
        .slice(0, 3);
      
      // Get property details for top properties
      const topProperties = topPropertyIds.map(id => {
        const property = properties.find(p => p.id === id);
        if (property) {
          return {
            id: property.id,
            name: property.title,
            views: Math.floor(Math.random() * 50) + 30, // Mock view data
            leads: propertyCounts[id],
            location: property.location || 'Unknown',
            bookingCount: propertyCounts[id]
          };
        }
        return null;
      }).filter(p => p !== null);
      
      // If we don't have enough top properties from bookings, add some based on creation date
      if (topProperties.length < 3) {
        const remainingProperties = properties
          .filter(p => !topPropertyIds.includes(p.id))
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .slice(0, 3 - topProperties.length)
          .map(p => ({
            id: p.id,
            name: p.title,
            views: Math.floor(Math.random() * 30) + 10, // Lower mock view data
            leads: Math.floor(Math.random() * 3) + 1,   // Lower mock lead data
            location: p.location || 'Unknown',
            bookingCount: 0
          }));
        
        topProperties.push(...remainingProperties);
      }
      
      // Calculate leads as 1.5x the booking count
      const totalLeads = Math.max(15, Math.floor(bookings.length * 1.5));
      
      // Compile dashboard summary
      setDashboardSummary({
        totalProperties: properties.length,
        availableNow,
        comingSoon,
        notAvailable,
        totalBookings: bookings.length,
        totalLeads,
        totalAffiliates: 3, // Mock data for affiliates
        topProperties
      });
      
      setError(null);
    } catch (err) {
      console.error("Error calculating dashboard data:", err);
      setError("An error occurred while calculating dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }, [properties, bookings, propertiesLoading]);

  // Mock performance data - calculated based on actual data
  const getPerformanceData = () => {
    const propertiesAdded = Math.min(5, properties.length);
    const propertyViews = Math.max(50, properties.length * 30);
    const bookingRate = bookings.length > 0 
      ? Math.floor((bookings.length / dashboardSummary.totalLeads) * 100) 
      : 53;
    
    return {
      propertiesAdded,
      propertyViews,
      leadsGenerated: dashboardSummary.totalLeads,
      bookingRate,
      averageResponse: "2.5 hours"
    };
  };

  const handlePremiumFeature = () => {
    setShowPremiumModal(true);
  };

  const performanceData = getPerformanceData();

  if (isLoading || propertiesLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading analytics data...</p>
      </div>
    );
  }

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
                  <div className="small text-success">
                    <FaArrowUp className="me-1" />
                    +{performanceData.propertiesAdded} this month
                  </div>
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
                        style={{ width: `${dashboardSummary.totalProperties > 0 ? 
                          (dashboardSummary.availableNow / dashboardSummary.totalProperties * 100) : 0}%` }}
                      ></div>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-1">
                      <span>Coming Soon</span>
                      <span>{dashboardSummary.comingSoon} properties</span>
                    </div>
                    <div className="progress mb-3" style={{ height: "8px" }}>
                      <div 
                        className="progress-bar bg-warning" 
                        style={{ width: `${dashboardSummary.totalProperties > 0 ? 
                          (dashboardSummary.comingSoon / dashboardSummary.totalProperties * 100) : 0}%` }}
                      ></div>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-1">
                      <span>Not Available</span>
                      <span>{dashboardSummary.notAvailable} properties</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div 
                        className="progress-bar bg-secondary" 
                        style={{ width: `${dashboardSummary.totalProperties > 0 ? 
                          (dashboardSummary.notAvailable / dashboardSummary.totalProperties * 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              {/* LOCKED FEATURE: Recent Activity */}
              {isSubscribed ? (
                <Card className="shadow-sm mb-4">
                  <Card.Body>
                    <h5 className="mb-3">Recent Activity</h5>
                    <div className="activity-timeline">
                      {bookings.slice(0, 4).map((booking, index) => (
                        <div key={booking.id} className="timeline-item d-flex mb-3">
                          <div className="timeline-dot bg-success"></div>
                          <div className="timeline-content ms-2">
                            <p className="mb-0">New booking: {booking.fullName} for {booking.propertyTitle}</p>
                            <small className="text-muted">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                      ))}
                      
                      {bookings.length === 0 && (
                        <div className="text-center py-3">
                          <p className="mb-0">No recent booking activity</p>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              ) : (
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
              )}
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
              
              {dashboardSummary.topProperties.length > 0 ? (
                dashboardSummary.topProperties.map((property, index) => (
                  <div key={property.id} className={`property-performance p-2 rounded ${index < dashboardSummary.topProperties.length - 1 ? 'mb-3 border-bottom' : ''}`}>
                    <div className="d-flex justify-content-between">
                      <h6>{property.name}</h6>
                      <Badge bg="success">{property.leads} leads</Badge>
                    </div>
                    <div className="d-flex justify-content-between text-muted small">
                      <span>{property.views} views</span>
                      <span>Conversion: {Math.round(property.leads / property.views * 100)}%</span>
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
          
          {/* LOCKED FEATURE: Quick Tasks */}
          {isSubscribed ? (
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
                    <p className="mb-1 small text-muted">{Math.ceil(dashboardSummary.totalLeads/5)} leads require follow-up</p>
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
          ) : (
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
          )}
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
              // Here you would integrate with your payment processor
              // For demo purposes, we'll just simulate upgrading
              setIsSubscribed(true);
              setShowPremiumModal(false);
            }}
          >
            <FaCrown className="me-1" /> Upgrade Now
          </Button>
        </Modal.Footer>
      </Modal>

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