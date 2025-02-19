import React, { useState, useEffect } from "react";
import { 
  Container, Row, Col, Card, Nav, Tab, Button, Form, Table, 
  Modal, Pagination, Badge, Alert, Spinner
} from "react-bootstrap";
import { 
  FaHome, FaPlus, FaEdit, FaTrash, FaSearch, FaUpload, 
  FaUsers, FaMoneyBillWave, FaCalendarAlt, FaChartBar,
  FaCog, FaSignOutAlt, FaBell, FaTags, FaMapMarkerAlt 
} from "react-icons/fa";

// Theme configuration (reused from the provided code)
const theme = {
  colors: {
    primary: "#0044cc",
    primaryDark: "#003399",
    primaryLight: "#e6eeff",
    accent: "#FF385C",
    dark: "#333333",
    light: "#f8f9fa",
    white: "#ffffff",
    gray: "#6c757d",
    grayLight: "#e9ecef",
    success: "#28a745",
    warning: "#ffc107",
  },
  borderRadius: {
    sm: "8px",
    md: "16px",
    lg: "24px",
    circle: "50%"
  },
  boxShadow: {
    sm: "0 4px 12px rgba(0, 0, 0, 0.05)",
    md: "0 8px 24px rgba(0, 0, 0, 0.08)",
    lg: "0 16px 32px rgba(0, 0, 0, 0.1)"
  },
  transition: "all 0.3s ease",
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "2.5rem"
  }
};

const AdminDashboard = () => {
  // State management
  const [activeSection, setActiveSection] = useState("overview");
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  // Mocked property data
  const mockProperties = [
    {
      id: 1,
      title: "COM4TH PLUS LIMITED Apartment",
      location: "6c Oduduwa Street, GRA IKEJA",
      type: "Apartment",
      status: "Available",
      bedrooms: [3, 4, 5],
      basePrice: 250000,
      images: ["appartment1.jpg", "appartment1-living.jpg"],
      amenities: ["Free Parking", "Fitness Center", "Swimming Pool", "High-Speed WiFi"],
      featured: true,
      createdAt: "2025-01-15"
    },
    {
      id: 2,
      title: "Luxury Villa with Ocean View",
      location: "Lekki Phase 1, Lagos",
      type: "Villa",
      status: "Available",
      bedrooms: [4, 5],
      basePrice: 450000,
      images: ["villa1.jpg", "villa1-pool.jpg"],
      amenities: ["Private Pool", "Garden", "High-Speed WiFi", "Smart Home Features"],
      featured: false,
      createdAt: "2025-01-20"
    },
    {
      id: 3,
      title: "Modern Office Space",
      location: "Victoria Island, Lagos",
      type: "Commercial",
      status: "Reserved",
      bedrooms: [],
      basePrice: 800000,
      images: ["office1.jpg"],
      amenities: ["24/7 Security", "Conference Rooms", "High-Speed WiFi", "Parking"],
      featured: false,
      createdAt: "2025-02-05"
    }
  ];

  // Mocked booking data
  const mockBookings = [
    {
      id: 101,
      propertyId: 1,
      propertyTitle: "COM4TH PLUS LIMITED Apartment",
      clientName: "John Adebayo",
      contactNumber: "+234 801 234 5678",
      bedrooms: 4,
      startDate: "2025-03-01",
      endDate: "2025-09-01",
      amount: 300000,
      status: "Confirmed",
      paymentStatus: "Paid",
      bookingType: "Long-term"
    },
    {
      id: 102,
      propertyId: 1,
      propertyTitle: "COM4TH PLUS LIMITED Apartment",
      clientName: "Sarah Okonkwo",
      contactNumber: "+234 802 345 6789",
      bedrooms: null,
      startDate: "2025-03-15",
      endDate: "2025-03-15",
      amount: 500000,
      status: "Pending",
      paymentStatus: "Partial",
      bookingType: "Party"
    },
    {
      id: 103,
      propertyId: 2,
      propertyTitle: "Luxury Villa with Ocean View",
      clientName: "Michael Eze",
      contactNumber: "+234 803 456 7890",
      bedrooms: 5,
      startDate: "2025-04-01",
      endDate: "2025-04-30",
      amount: 450000,
      status: "Confirmed",
      paymentStatus: "Paid",
      bookingType: "Short-term"
    }
  ];

  // Mocked user data
  const mockUsers = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@com4th.com",
      role: "Admin",
      phone: "+234 700 123 4567",
      lastLogin: "2025-02-18 09:45:23"
    },
    {
      id: 2,
      name: "Property Manager",
      email: "manager@com4th.com",
      role: "Manager",
      phone: "+234 700 234 5678",
      lastLogin: "2025-02-18 08:30:12"
    },
    {
      id: 3,
      name: "Booking Agent",
      email: "agent@com4th.com",
      role: "Agent",
      phone: "+234 700 345 6789",
      lastLogin: "2025-02-17 16:20:45"
    }
  ];

  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      // Simulating API load time
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProperties(mockProperties);
      setBookings(mockBookings);
      setUsers(mockUsers);
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Handle property edit
  const handleEditProperty = (property) => {
    setCurrentProperty(property);
    setShowPropertyModal(true);
  };

  // Handle property delete
  const handleDeleteProperty = (propertyId) => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to delete this property?")) {
      setProperties(properties.filter(p => p.id !== propertyId));
      setAlert({
        show: true,
        message: "Property deleted successfully",
        variant: "success"
      });
      
      // Hide alert after 3 seconds
      setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 3000);
    }
  };

  // Filter properties based on search term
  const filteredProperties = properties.filter(property => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dashboard Overview Component
  const DashboardOverview = () => (
    <div>
      <h2 className="mb-4">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle p-3 me-3" style={{ backgroundColor: theme.colors.primaryLight }}>
                <FaHome style={{ color: theme.colors.primary }} size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Properties</h6>
                <h3 className="mb-0">{properties.length}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle p-3 me-3" style={{ backgroundColor: `${theme.colors.success}20` }}>
                <FaCalendarAlt style={{ color: theme.colors.success }} size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Bookings</h6>
                <h3 className="mb-0">{bookings.length}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle p-3 me-3" style={{ backgroundColor: `${theme.colors.accent}20` }}>
                <FaMoneyBillWave style={{ color: theme.colors.accent }} size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Revenue</h6>
                <h3 className="mb-0">₦{bookings.reduce((sum, booking) => sum + booking.amount, 0).toLocaleString()}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle p-3 me-3" style={{ backgroundColor: `${theme.colors.warning}20` }}>
                <FaUsers style={{ color: theme.colors.warning }} size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Users</h6>
                <h3 className="mb-0">{users.length}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Recent Bookings */}
      <Card className="mb-4" style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Recent Bookings</h5>
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => setActiveSection("bookings")}
              style={{ borderRadius: theme.borderRadius.sm }}
            >
              View All
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Property</th>
                <th>Client</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 3).map(booking => (
                <tr key={booking.id}>
                  <td>#{booking.id}</td>
                  <td>{booking.propertyTitle}</td>
                  <td>{booking.clientName}</td>
                  <td>{booking.startDate}</td>
                  <td>₦{booking.amount.toLocaleString()}</td>
                  <td>
                    <Badge bg={booking.status === "Confirmed" ? "success" : "warning"}>
                      {booking.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      
      {/* Featured Properties */}
      <Card style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Featured Properties</h5>
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => setActiveSection("properties")}
              style={{ borderRadius: theme.borderRadius.sm }}
            >
              Manage Properties
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="g-4">
            {properties.filter(p => p.featured).map(property => (
              <Col md={4} key={property.id}>
                <Card style={{ borderRadius: theme.borderRadius.sm, boxShadow: theme.boxShadow.sm }}>
                  <div style={{ height: "160px", overflow: "hidden", borderRadius: `${theme.borderRadius.sm} ${theme.borderRadius.sm} 0 0` }}>
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title className="text-truncate">{property.title}</Card.Title>
                    <div className="d-flex align-items-center mb-2">
                      <FaMapMarkerAlt className="text-muted me-1" size={14} />
                      <small className="text-muted text-truncate">{property.location}</small>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <Badge bg="primary">₦{property.basePrice.toLocaleString()}</Badge>
                      <Badge bg={property.status === "Available" ? "success" : "warning"}>
                        {property.status}
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            {properties.filter(p => p.featured).length === 0 && (
              <Col>
                <p className="text-center text-muted my-4">No featured properties available</p>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );

  // Properties Management Component
  const PropertiesManagement = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Property Management</h2>
        <Button 
          variant="primary"
          onClick={() => {
            setCurrentProperty(null);
            setShowPropertyModal(true);
          }}
          style={{ 
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
            borderRadius: theme.borderRadius.sm
          }}
        >
          <FaPlus className="me-2" /> Add Property
        </Button>
      </div>
      
      {alert.show && (
        <Alert variant={alert.variant} className="mb-4" dismissible onClose={() => setAlert({ show: false })}>
          {alert.message}
        </Alert>
      )}
      
      {/* Search and Filters */}
      <Card className="mb-4" style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-0">
                  <div className="position-relative">
                    <Form.Control
                      type="text"
                      placeholder="Search properties..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ paddingLeft: "40px", borderRadius: theme.borderRadius.sm }}
                    />
                    <FaSearch style={{ position: "absolute", top: "12px", left: "14px", color: theme.colors.gray }} />
                  </div>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Select style={{ borderRadius: theme.borderRadius.sm }}>
                  <option value="">Property Type</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Commercial</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select style={{ borderRadius: theme.borderRadius.sm }}>
                  <option value="">Status</option>
                  <option>Available</option>
                  <option>Reserved</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select style={{ borderRadius: theme.borderRadius.sm }}>
                  <option value="">Sort By</option>
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </Form.Select>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      {/* Properties Table */}
      <Card style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
        <Card.Body>
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Bedrooms</th>
                  <th>Base Price</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map(property => (
                  <tr key={property.id}>
                    <td>#{property.id}</td>
                    <td>
                      <div style={{ width: "60px", height: "40px", overflow: "hidden", borderRadius: theme.borderRadius.sm }}>
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    </td>
                    <td>{property.title}</td>
                    <td>{property.location}</td>
                    <td>{property.type}</td>
                    <td>{property.bedrooms.length > 0 ? property.bedrooms.join(", ") : "N/A"}</td>
                    <td>₦{property.basePrice.toLocaleString()}</td>
                    <td>
                      <Badge bg={property.status === "Available" ? "success" : "warning"}>
                        {property.status}
                      </Badge>
                    </td>
                    <td>
                      <Form.Check 
                        type="switch"
                        checked={property.featured}
                        onChange={() => {
                          const updatedProperties = properties.map(p => 
                            p.id === property.id ? {...p, featured: !p.featured} : p
                          );
                          setProperties(updatedProperties);
                        }}
                      />
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleEditProperty(property)}
                          style={{ borderRadius: theme.borderRadius.sm }}
                        >
                          <FaEdit />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteProperty(property.id)}
                          style={{ borderRadius: theme.borderRadius.sm }}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProperties.length === 0 && (
                  <tr>
                    <td colSpan="10" className="text-center py-4">
                      No properties found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">
              Showing {filteredProperties.length} of {properties.length} properties
            </div>
            <Pagination>
              <Pagination.Prev disabled />
              <Pagination.Item active>{1}</Pagination.Item>
              <Pagination.Item>{2}</Pagination.Item>
              <Pagination.Item>{3}</Pagination.Item>
              <Pagination.Next />
            </Pagination>
          </div>
        </Card.Body>
      </Card>
      
      {/* Property Add/Edit Modal */}
      <Modal 
        show={showPropertyModal} 
        onHide={() => setShowPropertyModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton style={{ backgroundColor: theme.colors.primaryLight }}>
          <Modal.Title>{currentProperty ? "Edit Property" : "Add New Property"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Property Title</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter property title"
                    defaultValue={currentProperty?.title || ""}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Property Type</Form.Label>
                  <Form.Select defaultValue={currentProperty?.type || ""}>
                    <option value="">Select Type</option>
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Commercial</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                placeholder="Enter detailed description"
                defaultValue={currentProperty?.description || ""}
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter property location"
                    defaultValue={currentProperty?.location || ""}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select defaultValue={currentProperty?.status || "Available"}>
                    <option>Available</option>
                    <option>Reserved</option>
                    <option>Under Maintenance</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Base Price (₦)</Form.Label>
                  <Form.Control 
                    type="number" 
                    placeholder="Enter base price"
                    defaultValue={currentProperty?.basePrice || ""}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bedroom Options (comma separated)</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="E.g. 3,4,5"
                    defaultValue={currentProperty?.bedrooms.join(",") || ""}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Bathrooms</Form.Label>
                  <Form.Control 
                    type="number" 
                    placeholder="Number of bathrooms"
                    defaultValue={currentProperty?.bathrooms || ""}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Size (sq ft)</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Property size"
                    defaultValue={currentProperty?.size || ""}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Phone</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Contact number"
                    defaultValue={currentProperty?.contactPhone || ""}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Amenities</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {["Free Parking", "Fitness Center", "Swimming Pool", "High-Speed WiFi", 
                  "Air Conditioning", "24/7 Security", "Smart Home Features", "Elevator Access"].map(amenity => (
                  <Form.Check
                    key={amenity}
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    label={amenity}
                    className="me-3"
                    defaultChecked={currentProperty?.amenities.includes(amenity)}
                  />
                ))}
              </div>
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Featured Property</Form.Label>
                  <Form.Check 
                    type="switch"
                    id="featured-switch"
                    label="Mark as featured property"
                    defaultChecked={currentProperty?.featured}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Property Images</Form.Label>
              <div className="d-flex align-items-center mb-3">
                <Button 
                  variant="outline-primary"
                  style={{ borderRadius: theme.borderRadius.sm }}
                >
                  <FaUpload className="me-2" /> Upload Images
                </Button>
                <span className="text-muted ms-3">Maximum 10 images (5MB each)</span>
              </div>
              
              {currentProperty && currentProperty.images.length > 0 && (
                <div className="d-flex flex-wrap gap-3 mt-3">
                  {currentProperty.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        width: "100px", 
                        height: "80px", 
                        borderRadius: theme.borderRadius.sm,
                        overflow: "hidden",
                        position: "relative"
                      }}
                    >
                      <img 
                        src={img} 
                        alt={`Property ${idx}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute"
                        style={{ top: "5px", right: "5px", padding: "2px 6px" }}
                      >
                        <FaTrash size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Form.Group>

            {/* Party/Get-Together Section */}
            <Card className="mb-3" style={{ borderRadius: theme.borderRadius.sm }}>
              <Card.Header className="bg-light">
                <h6 className="mb-0">Party/Get-Together Settings</h6>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Maximum Guests</Form.Label>
                      <Form.Control 
                        type="number" 
                        placeholder="Max number of guests"
                        defaultValue={currentProperty?.partyDetails?.maxGuests || "30"}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Price Range (₦)</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="E.g. 500k to 550k"
                        defaultValue={currentProperty?.partyDetails?.priceRange || ""}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Caution Fee (₦)</Form.Label>
                      <Form.Control 
                        type="number" 
                        placeholder="Enter caution fee amount"
                        defaultValue={currentProperty?.partyDetails?.cautionFee || "50000"}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Party Hours</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="E.g. 12pm to 8pm"
                          defaultValue={currentProperty?.partyDetails?.hours || ""}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-0">
                    <Form.Label>Party Rules & Restrictions</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={2}
                      placeholder="Enter party rules and restrictions"
                      defaultValue={currentProperty?.partyDetails?.rules || ""}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => setShowPropertyModal(false)}
              style={{ borderRadius: theme.borderRadius.sm }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary"
              style={{ 
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.primary,
                borderRadius: theme.borderRadius.sm
              }}
              onClick={() => {
                // Handle save logic here
                setShowPropertyModal(false);
                setAlert({
                  show: true,
                  message: currentProperty ? "Property updated successfully" : "Property added successfully",
                  variant: "success"
                });
                
                // Hide alert after 3 seconds
                setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 3000);
              }}
            >
              {currentProperty ? "Update Property" : "Add Property"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  
    // Bookings Management Component
    const BookingsManagement = () => (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Booking Management</h2>
          <Button 
            variant="primary"
            style={{ 
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary,
              borderRadius: theme.borderRadius.sm
            }}
          >
            <FaPlus className="me-2" /> New Booking
          </Button>
        </div>
        
        {/* Search and Filters */}
        <Card className="mb-4" style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
          <Card.Body>
            <Form>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-0">
                    <div className="position-relative">
                      <Form.Control
                        type="text"
                        placeholder="Search bookings..."
                        style={{ paddingLeft: "40px", borderRadius: theme.borderRadius.sm }}
                      />
                      <FaSearch style={{ position: "absolute", top: "12px", left: "14px", color: theme.colors.gray }} />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Select style={{ borderRadius: theme.borderRadius.sm }}>
                    <option value="">Booking Type</option>
                    <option>Long-term</option>
                    <option>Short-term</option>
                    <option>Party</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Select style={{ borderRadius: theme.borderRadius.sm }}>
                    <option value="">Status</option>
                    <option>Confirmed</option>
                    <option>Pending</option>
                    <option>Cancelled</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Select style={{ borderRadius: theme.borderRadius.sm }}>
                    <option value="">Payment Status</option>
                    <option>Paid</option>
                    <option>Partial</option>
                    <option>Unpaid</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Control 
                    type="date" 
                    placeholder="Filter by date"
                    style={{ borderRadius: theme.borderRadius.sm }}
                  />
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
        
        {/* Bookings Table */}
        <Card style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
          <Card.Body>
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Property</th>
                    <th>Client</th>
                    <th>Booking Type</th>
                    <th>Date(s)</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td>#{booking.id}</td>
                      <td>{booking.propertyTitle}</td>
                      <td>
                        <div>
                          <div className="fw-medium">{booking.clientName}</div>
                          <small className="text-muted">{booking.contactNumber}</small>
                        </div>
                      </td>
                      <td>{booking.bookingType}</td>
                      <td>
                        {booking.bookingType === "Party" ? (
                          booking.startDate
                        ) : (
                          <>
                            {booking.startDate} <br />
                            <small className="text-muted">to {booking.endDate}</small>
                          </>
                        )}
                      </td>
                      <td>₦{booking.amount.toLocaleString()}</td>
                      <td>
                        <Badge bg={booking.status === "Confirmed" ? "success" : "warning"}>
                          {booking.status}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={
                          booking.paymentStatus === "Paid" ? "success" : 
                          booking.paymentStatus === "Partial" ? "warning" : "danger"
                        }>
                          {booking.paymentStatus}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            style={{ borderRadius: theme.borderRadius.sm }}
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            style={{ borderRadius: theme.borderRadius.sm }}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="text-muted">
                Showing {bookings.length} bookings
              </div>
              <Pagination>
                <Pagination.Prev disabled />
                <Pagination.Item active>{1}</Pagination.Item>
                <Pagination.Item>{2}</Pagination.Item>
                <Pagination.Item>{3}</Pagination.Item>
                <Pagination.Next />
              </Pagination>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  
    // Users Management Component
    const UsersManagement = () => (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>User Management</h2>
          <Button 
            variant="primary"
            style={{ 
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary,
              borderRadius: theme.borderRadius.sm
            }}
          >
            <FaPlus className="me-2" /> Add User
          </Button>
        </div>
        
        {/* Users Table */}
        <Card style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
          <Card.Body>
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Phone</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg={
                          user.role === "Admin" ? "danger" : 
                          user.role === "Manager" ? "primary" : "info"
                        }>
                          {user.role}
                        </Badge>
                      </td>
                      <td>{user.phone}</td>
                      <td>{user.lastLogin}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            style={{ borderRadius: theme.borderRadius.sm }}
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            style={{ borderRadius: theme.borderRadius.sm }}
                            disabled={user.role === "Admin"}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
    
    // Settings Component
    const SettingsComponent = () => (
      <div>
        <h2 className="mb-4">Settings</h2>
        
        <Tab.Container defaultActiveKey="general">
          <Row>
            <Col md={3}>
              <Card style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
                <Card.Body>
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="general" className="d-flex align-items-center">
                        <FaCog className="me-2" /> General Settings
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="security" className="d-flex align-items-center">
                        <FaUsers className="me-2" /> User Roles & Permissions
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="notifications" className="d-flex align-items-center">
                        <FaBell className="me-2" /> Notification Settings
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="property" className="d-flex align-items-center">
                        <FaHome className="me-2" /> Property Settings
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="billing" className="d-flex align-items-center">
                        <FaMoneyBillWave className="me-2" /> Billing & Payments
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Body>
              </Card>
            </Col>
            <Col md={9}>
              <Card style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
                <Card.Body>
                  <Tab.Content>
                    <Tab.Pane eventKey="general">
                      <h4 className="mb-4">General Settings</h4>
                      <Form>
                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Company Name</Form.Label>
                              <Form.Control 
                                type="text" 
                                defaultValue="COM4TH PLUS LIMITED"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Contact Email</Form.Label>
                              <Form.Control 
                                type="email" 
                                defaultValue="info@com4th.com"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Phone Number</Form.Label>
                              <Form.Control 
                                type="text" 
                                defaultValue="+234 700 000 0000"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Default Currency</Form.Label>
                              <Form.Select defaultValue="NGN">
                                <option value="NGN">Nigerian Naira (₦)</option>
                                <option value="USD">US Dollar ($)</option>
                                <option value="EUR">Euro (€)</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Form.Group className="mb-3">
                          <Form.Label>Office Address</Form.Label>
                          <Form.Control 
                            type="text" 
                            defaultValue="6c Oduduwa Street, GRA IKEJA"
                          />
                        </Form.Group>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                          <Button 
                            variant="primary"
                            style={{ 
                              backgroundColor: theme.colors.primary,
                              borderColor: theme.colors.primary,
                              borderRadius: theme.borderRadius.sm
                            }}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </Form>
                    </Tab.Pane>
                    
                    <Tab.Pane eventKey="security">
                      <h4 className="mb-4">User Roles & Permissions</h4>
                      {/* Role management content */}
                    </Tab.Pane>
                    
                    <Tab.Pane eventKey="notifications">
                      <h4 className="mb-4">Notification Settings</h4>
                      {/* Notification settings content */}
                    </Tab.Pane>
                    
                    <Tab.Pane eventKey="property">
                      <h4 className="mb-4">Property Settings</h4>
                      {/* Property settings content */}
                    </Tab.Pane>
                    
                    <Tab.Pane eventKey="billing">
                      <h4 className="mb-4">Billing & Payments</h4>
                      {/* Billing settings content */}
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
  
    // Render sidebar and content
    return (
      <div className="d-flex">
        {/* Sidebar */}
        <div 
          className="d-flex flex-column p-3 text-white bg-dark" 
          style={{ 
            width: "280px", 
            height: "100vh",
            position: "fixed",
            backgroundColor: theme.colors.dark + " !important"
          }}
        >
          <div className="d-flex align-items-center mb-4 px-2">
            <h3 className="mb-0">COM4TH Admin</h3>
          </div>
  
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item mb-2">
              <button
                className={`nav-link text-white d-flex align-items-center ${activeSection === "overview" ? "active" : ""}`}
                onClick={() => setActiveSection("overview")}
                style={{ 
                  backgroundColor: activeSection === "overview" ? theme.colors.primary : "transparent",
                  borderRadius: theme.borderRadius.sm
                }}
              >
                <FaHome className="me-3" /> Dashboard
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`nav-link text-white d-flex align-items-center ${activeSection === "properties" ? "active" : ""}`}
                onClick={() => setActiveSection("properties")}
                style={{ 
                  backgroundColor: activeSection === "properties" ? theme.colors.primary : "transparent",
                  borderRadius: theme.borderRadius.sm
                }}
              >
                <FaHome className="me-3" /> Properties
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`nav-link text-white d-flex align-items-center ${activeSection === "bookings" ? "active" : ""}`}
                onClick={() => setActiveSection("bookings")}
                style={{ 
                  backgroundColor: activeSection === "bookings" ? theme.colors.primary : "transparent",
                  borderRadius: theme.borderRadius.sm
                }}
              >
                <FaCalendarAlt className="me-3" /> Bookings
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`nav-link text-white d-flex align-items-center ${activeSection === "users" ? "active" : ""}`}
                onClick={() => setActiveSection("users")}
                style={{ 
                  backgroundColor: activeSection === "users" ? theme.colors.primary : "transparent",
                  borderRadius: theme.borderRadius.sm
                }}
              >
                <FaUsers className="me-3" /> Users
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`nav-link text-white d-flex align-items-center ${activeSection === "settings" ? "active" : ""}`}
                onClick={() => setActiveSection("settings")}
                style={{ 
                  backgroundColor: activeSection === "settings" ? theme.colors.primary : "transparent",
                  borderRadius: theme.borderRadius.sm
                }}
              >
                <FaCog className="me-3" /> Settings
              </button>
            </li>
          </ul>
  
          <hr />
          <div className="dropdown">
            <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="https://via.placeholder.com/40" alt="Admin" width="32" height="32" className="rounded-circle me-2" />
              <strong>Admin User</strong>
            </a>
            <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
              <li><a className="dropdown-item" href="#">Profile</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="#">Sign out</a></li>
            </ul>
          </div>
        </div>
  
        {/* Main content */}
        <div className="flex-grow-1 p-4" style={{ marginLeft: "280px" }}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              {activeSection === "overview" && <DashboardOverview />}
              {activeSection === "properties" && <PropertiesManagement />}
              {activeSection === "bookings" && <BookingsManagement />}
              {activeSection === "users" && <UsersManagement />}
              {activeSection === "settings" && <SettingsComponent />}
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default AdminDashboard;