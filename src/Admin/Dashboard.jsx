import React, { useState, useEffect, useCallback, useMemo, createContext, useContext } from "react";
import { Container, Row, Col, Card, Nav, Button, Form, Table, Modal, Badge, Alert, Spinner } from "react-bootstrap";
import { FaHome, FaPlus, FaEdit, FaTrash, FaSearch, FaUsers, FaCalendarAlt, FaCog, FaSignOutAlt, FaBuilding } from "react-icons/fa";

// Theme configuration using CSS variables
const theme = {
  colors: {
    primary: "#0044cc",
    primaryLight: "#e6eeff",
    success: "#28a745",
    warning: "#ffc107",
    danger: "#dc3545",
    gray: "#6c757d",
  },
  borderRadius: {
    sm: "8px",
    md: "16px",
  },
  boxShadow: {
    sm: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
};

// Alert context for global notifications
const AlertContext = createContext();

// Custom hook for data fetching and error handling
const useDataFetching = (mockData, delay = 800) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, delay));
        setData(mockData);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mockData, delay]);

  return { data, loading, error, setData };
};

// Reusable component for stat cards
const StatsCard = ({ title, value, icon: Icon }) => (
  <Card style={{ 
    borderRadius: theme.borderRadius.md, 
    boxShadow: theme.boxShadow.sm,
    transition: "transform 0.2s ease-in-out",
  }}
  onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
  onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
  >
    <Card.Body className="d-flex justify-content-between align-items-center">
      <div>
        <h6 className="text-muted mb-1">{title}</h6>
        <h3 className="mb-0">{value}</h3>
      </div>
      <div style={{ 
        backgroundColor: theme.colors.primaryLight, 
        color: theme.colors.primary,
        padding: "12px",
        borderRadius: "50%"
      }}>
        <Icon size={24} />
      </div>
    </Card.Body>
  </Card>
);

// Status badge component for consistent styling
const StatusBadge = ({ status }) => {
  const variant = 
    status === "Available" || status === "Confirmed" ? "success" :
    status === "Reserved" || status === "Pending" ? "warning" :
    status === "Admin" ? "danger" : "primary";
  
  return <Badge bg={variant}>{status}</Badge>;
};

// Dashboard Overview Component
const DashboardOverview = ({ propertyCount, bookingCount, userCount, recentBookings }) => (
  <div>
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2>Dashboard Overview</h2>
      <div className="d-flex">
        <Button variant="outline-primary" className="me-2">
          <FaCalendarAlt className="me-2" /> Today
        </Button>
        <Button variant="outline-primary">
          <FaCalendarAlt className="me-2" /> This Month
        </Button>
      </div>
    </div>
    
    <Row className="g-4 mb-4">
      <Col md={4}>
        <StatsCard title="Properties" value={propertyCount} icon={FaBuilding} />
      </Col>
      <Col md={4}>
        <StatsCard title="Bookings" value={bookingCount} icon={FaCalendarAlt} />
      </Col>
      <Col md={4}>
        <StatsCard title="Users" value={userCount} icon={FaUsers} />
      </Col>
    </Row>
    
    <Row className="mt-4">
      <Col md={8}>
        <Card className="mb-4" style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
          <Card.Header className="bg-transparent">
            <h5 className="mb-0">Recent Bookings</h5>
          </Card.Header>
          <Card.Body>
            <Table hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Property</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(booking => (
                  <tr key={booking.id}>
                    <td>#{booking.id}</td>
                    <td>{booking.propertyTitle}</td>
                    <td>{booking.clientName}</td>
                    <td>{booking.startDate}</td>
                    <td><StatusBadge status={booking.status} /></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
          <Card.Header className="bg-transparent">
            <h5 className="mb-0">Quick Actions</h5>
          </Card.Header>
          <Card.Body>
            <div className="d-grid gap-2">
              <Button variant="outline-primary">
                <FaPlus className="me-2" /> Add New Property
              </Button>
              <Button variant="outline-primary">
                <FaCalendarAlt className="me-2" /> Schedule Viewing
              </Button>
              <Button variant="outline-primary">
                <FaUsers className="me-2" /> Add New User
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div>
);

// Properties Management Component
const PropertiesManagement = ({ properties, searchTerm, setSearchTerm, onEdit, onDelete, addNewProperty }) => (
  <div>
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2>Property Management</h2>
      <Button variant="primary" onClick={addNewProperty}>
        <FaPlus className="me-2" /> Add Property
      </Button>
    </div>
    
    <Card className="mb-4" style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
      <Card.Body>
        <Form>
          <Row>
            <Col md={6}>
              <div className="position-relative">
                <Form.Control
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search properties"
                />
                <FaSearch className="position-absolute" style={{ right: "10px", top: "10px", color: theme.colors.gray }} />
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex justify-content-md-end mt-3 mt-md-0">
                <Form.Select className="me-2" style={{ width: "auto" }}>
                  <option>All Types</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Office</option>
                </Form.Select>
                <Form.Select style={{ width: "auto" }}>
                  <option>All Status</option>
                  <option>Available</option>
                  <option>Reserved</option>
                </Form.Select>
              </div>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
    
    <Card style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
      <Card.Body>
        {properties.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: "3rem", color: theme.colors.gray }}>
              <FaBuilding />
            </div>
            <h5 className="mt-3">No properties found</h5>
            <p className="text-muted">Try adjusting your search criteria</p>
            <Button variant="primary" onClick={addNewProperty}>
              <FaPlus className="me-2" /> Add New Property
            </Button>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(property => (
                  <tr key={property.id}>
                    <td>#{property.id}</td>
                    <td>{property.title}</td>
                    <td>{property.location}</td>
                    <td>{property.type}</td>
                    <td><StatusBadge status={property.status} /></td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => onEdit(property)}>
                        <FaEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => onDelete(property.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
      <Card.Footer className="bg-white d-flex justify-content-between align-items-center">
        <div>Showing {properties.length} of {properties.length} properties</div>
        <nav aria-label="Properties pagination">
          <ul className="pagination mb-0">
            <li className="page-item disabled">
              <span className="page-link">Previous</span>
            </li>
            <li className="page-item active">
              <span className="page-link">1</span>
            </li>
            <li className="page-item">
              <Button variant="link" className="page-link">2</Button>
            </li>
            <li className="page-item">
              <Button variant="link" className="page-link">Next</Button>
            </li>
          </ul>
        </nav>
      </Card.Footer>
    </Card>
  </div>
);

// Bookings Management Component
const BookingsManagement = ({ bookings }) => (
  <div>
    <h2 className="mb-4">Booking Management</h2>
    <Card style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
      <Card.Header className="bg-transparent d-flex justify-content-between align-items-center">
        <h5 className="mb-0">All Bookings</h5>
        <div className="d-flex gap-2">
          <Form.Select style={{ width: "auto" }}>
            <option>All Status</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </Form.Select>
          <Button variant="outline-primary" size="sm">
            <FaSearch className="me-1" /> Filter
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Table hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Property</th>
              <th>Client</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>#{booking.id}</td>
                <td>{booking.propertyTitle}</td>
                <td>{booking.clientName}</td>
                <td>{booking.startDate}</td>
                <td><StatusBadge status={booking.status} /></td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-1">
                    <FaEdit /> Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  </div>
);

// Users Management Component
const UsersManagement = ({ users }) => (
  <div>
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2>User Management</h2>
      <Button variant="primary">
        <FaPlus className="me-2" /> Add User
      </Button>
    </div>
    <Card style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
      <Card.Body>
        <div className="mb-4">
          <Row>
            <Col md={6}>
              <div className="position-relative">
                <Form.Control
                  type="text"
                  placeholder="Search users..."
                  aria-label="Search users"
                />
                <FaSearch className="position-absolute" style={{ right: "10px", top: "10px", color: theme.colors.gray }} />
              </div>
            </Col>
            <Col md={6} className="mt-3 mt-md-0">
              <div className="d-flex justify-content-md-end">
                <Form.Select style={{ width: "auto" }}>
                  <option>All Roles</option>
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>User</option>
                </Form.Select>
              </div>
            </Col>
          </Row>
        </div>
        <Table hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>#{user.id}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-light text-primary d-flex align-items-center justify-content-center me-2" 
                         style={{ width: "32px", height: "32px" }}>
                      {user.name.charAt(0)}
                    </div>
                    {user.name}
                  </div>
                </td>
                <td>{user.email}</td>
                <td><StatusBadge status={user.role} /></td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2">
                    <FaEdit />
                  </Button>
                  <Button variant="outline-danger" size="sm">
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  </div>
);

// Settings Component
const SettingsComponent = () => (
  <div>
    <h2 className="mb-4">Settings</h2>
    <Row>
      <Col lg={8}>
        <Card className="mb-4" style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
          <Card.Header className="bg-transparent">
            <h5 className="mb-0">Company Information</h5>
          </Card.Header>
          <Card.Body>
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control type="text" defaultValue="COM4TH PLUS LIMITED" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Email</Form.Label>
                    <Form.Control type="email" defaultValue="info@com4th.com" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="tel" defaultValue="+234 123 456 7890" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Website</Form.Label>
                    <Form.Control type="url" defaultValue="https://com4th.com" />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control as="textarea" rows={2} defaultValue="6c Oduduwa Street, GRA IKEJA" />
              </Form.Group>
              <Button variant="primary" type="submit">Save Changes</Button>
            </Form>
          </Card.Body>
        </Card>
        
        <Card style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
          <Card.Header className="bg-transparent">
            <h5 className="mb-0">Notification Settings</h5>
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Check 
                type="switch"
                id="email-notifications"
                label="Email Notifications"
                className="mb-3"
                defaultChecked
              />
              <Form.Check 
                type="switch"
                id="booking-alerts"
                label="New Booking Alerts"
                className="mb-3"
                defaultChecked
              />
              <Form.Check 
                type="switch"
                id="system-updates"
                label="System Update Notifications"
                className="mb-3"
              />
              <Button variant="primary" type="submit">Save Preferences</Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      
      <Col lg={4}>
        <Card className="mb-4" style={{ borderRadius: theme.borderRadius.md, boxShadow: theme.boxShadow.sm }}>
          <Card.Header className="bg-transparent">
            <h5 className="mb-0">Theme Settings</h5>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Color Theme</Form.Label>
              <div className="d-flex gap-2 mb-3">
                <div className="rounded-circle bg-primary" style={{ width: "30px", height: "30px", cursor: "pointer" }}></div>
                <div className="rounded-circle bg-danger" style={{ width: "30px", height: "30px", cursor: "pointer" }}></div>
                <div className="rounded-circle bg-success" style={{ width: "30px", height: "30px", cursor: "pointer" }}></div>
                <div className="rounded-circle bg-dark" style={{ width: "30px", height: "30px", cursor: "pointer" }}></div>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Display Mode</Form.Label>
              <Form.Select defaultValue="light">
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="system">System Default</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">Apply Theme</Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div>
);

const AdminDashboard = () => {
  // Context for alerts
  const [alertState, setAlertState] = useState({ show: false, message: "", variant: "" });
  const showAlert = useCallback((message, variant = "success") => {
    setAlertState({ show: true, message, variant });
    setTimeout(() => setAlertState({ show: false }), 3000);
  }, []);

  // State management
  const [activeSection, setActiveSection] = useState("overview");
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Data fetching with custom hook
  const { data: properties, loading: propertiesLoading, error: propertiesError, setData: setProperties } = 
    useDataFetching([
      { id: 1, title: "COM4TH PLUS LIMITED Apartment", location: "6c Oduduwa Street, GRA IKEJA", type: "Apartment", status: "Available" },
      { id: 2, title: "Luxury Villa", location: "Lekki Phase 1, Lagos", type: "Villa", status: "Reserved" },
    ]);
  
  const { data: bookings, loading: bookingsLoading } = 
    useDataFetching([
      { id: 101, propertyId: 1, propertyTitle: "COM4TH PLUS LIMITED Apartment", clientName: "John Adebayo", startDate: "2025-03-01", status: "Confirmed" },
      { id: 102, propertyId: 2, propertyTitle: "Luxury Villa", clientName: "Sarah Okonkwo", startDate: "2025-03-15", status: "Pending" },
    ]);
  
  const { data: users, loading: usersLoading } = 
    useDataFetching([
      { id: 1, name: "Admin User", email: "admin@com4th.com", role: "Admin" },
      { id: 2, name: "Property Manager", email: "manager@com4th.com", role: "Manager" },
    ]);

  // Memoized filtered properties
  const filteredProperties = useMemo(() => 
    properties.filter(property =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
    ), [properties, searchTerm]);

  // Event handlers
  const handleEditProperty = useCallback((property) => {
    setCurrentProperty(property);
    setShowPropertyModal(true);
  }, []);

  const handleDeleteProperty = useCallback((propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      showAlert("Property deleted successfully");
    }
  }, [setProperties, showAlert]);

  const handleSaveProperty = useCallback(() => {
    // Implement property save logic here
    setShowPropertyModal(false);
    showAlert(`Property ${currentProperty ? "updated" : "added"} successfully`);
  }, [currentProperty, showAlert]);

  // Loading state aggregation
  const isLoading = propertiesLoading || bookingsLoading || usersLoading;

  return (
    <AlertContext.Provider value={{ alert: alertState, showAlert }}>
      <div className="d-flex">
        {/* Sidebar */}
        <nav className="bg-dark text-white p-3" style={{ 
          width: "280px", 
          height: "100vh",
          position: "fixed",
          overflowY: "auto"
        }}>
          <div className="text-center py-4">
            <h3 className="mb-2">COM4TH Admin</h3>
            <div className="user-info small mb-4">
              <img 
                src="https://via.placeholder.com/40" 
                alt="Admin" 
                className="rounded-circle mb-2" 
                width="40" 
                height="40" 
              />
              <div>Admin User</div>
            </div>
          </div>
          <Nav className="flex-column" as="ul">
            <Nav.Item as="li">
              <Nav.Link 
                className={`text-white mb-2 ${activeSection === "overview" ? "active bg-primary" : ""}`} 
                onClick={() => setActiveSection("overview")}
                style={{ borderRadius: theme.borderRadius.sm }}
              >
                <FaHome className="me-2" /> Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link 
                className={`text-white mb-2 ${activeSection === "properties" ? "active bg-primary" : ""}`} 
                onClick={() => setActiveSection("properties")}
                style={{ borderRadius: theme.borderRadius.sm }}
              >
                <FaBuilding className="me-2" /> Properties
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link 
                className={`text-white mb-2 ${activeSection === "bookings" ? "active bg-primary" : ""}`} 
                onClick={() => setActiveSection("bookings")}
                style={{ borderRadius: theme.borderRadius.sm }}
              >
                <FaCalendarAlt className="me-2" /> Bookings
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link 
                className={`text-white mb-2 ${activeSection === "users" ? "active bg-primary" : ""}`} 
                onClick={() => setActiveSection("users")}
                style={{ borderRadius: theme.borderRadius.sm }}
              >
                <FaUsers className="me-2" /> Users
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link 
                className={`text-white mb-2 ${activeSection === "settings" ? "active bg-primary" : ""}`} 
                onClick={() => setActiveSection("settings")}
                style={{ borderRadius: theme.borderRadius.sm }}
              >
                <FaCog className="me-2" /> Settings
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <div className="mt-auto pt-4">
            <Nav.Link className="text-white d-flex align-items-center">
              <FaSignOutAlt className="me-2" /> Logout
            </Nav.Link>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-grow-1 p-4" style={{ marginLeft: "280px" }}>
          {alertState.show && <Alert variant={alertState.variant}>{alertState.message}</Alert>}

          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
              <Spinner animation="border" variant="primary" />
              <span className="ms-2">Loading dashboard data...</span>
            </div>
          ) : (
            <>
              {activeSection === "overview" && 
                <DashboardOverview 
                  propertyCount={properties.length}
                  bookingCount={bookings.length}
                  userCount={users.length}
                  recentBookings={bookings}
                />
              }
              {activeSection === "properties" && 
                <PropertiesManagement 
                  properties={filteredProperties}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  onEdit={handleEditProperty}
                  onDelete={handleDeleteProperty}
                  addNewProperty={() => setShowPropertyModal(true)}
                />
              }
              {activeSection === "bookings" && <BookingsManagement bookings={bookings} />}
              {activeSection === "users" && <UsersManagement users={users} />}
              {activeSection === "settings" && <SettingsComponent />}
            </>
          )}
        </main>
      </div>

      {/* Property Form Modal */}
      <Modal show={showPropertyModal} onHide={() => setShowPropertyModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{currentProperty ? "Edit Property" : "Add New Property"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Property Title</Form.Label>
              <Form.Control 
                type="text" 
                defaultValue={currentProperty?.title || ""} 
                placeholder="Enter property title"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control 
                type="text" 
                defaultValue={currentProperty?.location || ""} 
                placeholder="Enter property location"
              />
            </Form.Group>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Property Type</Form.Label>
                  <Form.Select defaultValue={currentProperty?.type || ""}>
                    <option value="">Select type...</option>
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Office</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select defaultValue={currentProperty?.status || ""}>
                    <option value="">Select status...</option>
                    <option>Available</option>
                    <option>Reserved</option>
                    <option>Maintenance</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPropertyModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveProperty}>
            {currentProperty ? "Update" : "Add"} Property
          </Button>
        </Modal.Footer>
      </Modal>
    </AlertContext.Provider>
  );
};

export default AdminDashboard;