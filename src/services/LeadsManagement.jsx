// LeadsManagement.jsx
import React, { useState } from "react";
import {
  Card,
  Table,
  Badge,
  Button,
  Form,
  InputGroup,
  Dropdown,
  Tabs,
  Tab,
  Row,
  Col,
  Modal
} from "react-bootstrap";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaFilter,
  FaSort,
  FaUserCheck,
  FaPhone,
  FaEnvelope,
  FaCalendarCheck,
  FaComments,
  FaPlusCircle,
  FaSave,
  FaTimes
} from "react-icons/fa";

const LeadsManagement = () => {
  // State for leads and bookings
  const [activeTab, setActiveTab] = useState("leads");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    property: "",
    status: "New",
    source: "Website",
    notes: "",
    createdAt: ""
  });

  // Mock lead data
  const [leads, setLeads] = useState([
    { 
      id: 1, 
      name: "John Doe", 
      email: "john@example.com", 
      phone: "+234 123 456 7890", 
      property: "2-Bedroom in Lekki", 
      status: "New",
      source: "Website",
      notes: "Interested in viewing next week",
      createdAt: "2025-03-01T12:30:00Z"
    },
    { 
      id: 2, 
      name: "Jane Smith", 
      email: "jane@example.com", 
      phone: "+234 098 765 4321", 
      property: "3-Bedroom in Ikeja", 
      status: "Contacted",
      source: "Referral",
      notes: "Follow up scheduled for Friday",
      createdAt: "2025-03-02T14:45:00Z"
    },
    { 
      id: 3, 
      name: "Michael Johnson", 
      email: "michael@example.com", 
      phone: "+234 555 123 4567", 
      property: "Duplex in Victoria Island", 
      status: "Viewing Scheduled",
      source: "Social Media",
      notes: "Very interested, has financing ready",
      createdAt: "2025-03-03T09:15:00Z"
    },
    { 
      id: 4, 
      name: "Sarah Williams", 
      email: "sarah@example.com", 
      phone: "+234 333 888 9999", 
      property: "Office Space in Ikoyi", 
      status: "Negotiating",
      source: "Affiliate",
      notes: "Wants to negotiate price",
      createdAt: "2025-03-03T16:20:00Z" 
    }
  ]);

  // Mock booking data
  const [bookings, setBookings] = useState([
    {
      id: 1,
      leadId: 3,
      leadName: "Michael Johnson",
      property: "Duplex in Victoria Island",
      bookingDate: "2025-03-10T13:00:00Z",
      status: "Confirmed",
      deposit: 250000,
      agentAssigned: "David Adeyemi",
      notes: "Client requested parking information"
    },
    {
      id: 2,
      leadId: 2,
      leadName: "Jane Smith",
      property: "3-Bedroom in Ikeja",
      bookingDate: "2025-03-12T10:30:00Z",
      status: "Pending",
      deposit: 0,
      agentAssigned: "Chioma Okafor",
      notes: "Client will confirm by tomorrow"
    }
  ]);

  // Filter leads based on search and status
  const filteredLeads = leads
    .filter(lead => {
      if (statusFilter === "all") return true;
      return lead.status.toLowerCase() === statusFilter.toLowerCase();
    })
    .filter(lead => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        lead.name.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        lead.property.toLowerCase().includes(searchLower) ||
        lead.phone.includes(searchTerm)
      );
    });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add or update lead
  const handleSaveLead = () => {
    const newLead = {
      ...formData,
      id: formData.id || Date.now(),
      createdAt: formData.createdAt || new Date().toISOString()
    };

    if (currentLead) {
      // Update existing lead
      setLeads(leads.map(lead => lead.id === currentLead.id ? newLead : lead));
    } else {
      // Add new lead
      setLeads([...leads, newLead]);
    }

    setShowAddModal(false);
    resetForm();
  };

  // Delete lead
  const handleDeleteLead = (id) => {
    setLeads(leads.filter(lead => lead.id !== id));
    // Also remove any bookings linked to this lead
    setBookings(bookings.filter(booking => booking.leadId !== id));
  };

  // View lead details
  const handleViewDetails = (lead) => {
    setCurrentLead(lead);
    setShowDetailsModal(true);
  };

  // Edit lead
  const handleEditLead = (lead) => {
    setCurrentLead(lead);
    setFormData({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      property: lead.property,
      status: lead.status,
      source: lead.source,
      notes: lead.notes,
      createdAt: lead.createdAt
    });
    setShowAddModal(true);
  };

  // Reset form
  const resetForm = () => {
    setCurrentLead(null);
    setFormData({
      id: "",
      name: "",
      email: "",
      phone: "",
      property: "",
      status: "New",
      source: "Website",
      notes: "",
      createdAt: ""
    });
  };

  // Convert lead to booking
  const handleCreateBooking = (lead) => {
    const newBooking = {
      id: Date.now(),
      leadId: lead.id,
      leadName: lead.name,
      property: lead.property,
      bookingDate: new Date(Date.now() + 86400000 * 2).toISOString(), // Default to 2 days from now
      status: "Pending",
      deposit: 0,
      agentAssigned: "",
      notes: ""
    };
    setBookings([...bookings, newBooking]);
    
    // Update lead status
    setLeads(leads.map(l => 
      l.id === lead.id ? { ...l, status: "Booking Created" } : l
    ));
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="leads" title="Leads">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <Button 
                  variant="primary" 
                  onClick={() => {
                    resetForm();
                    setShowAddModal(true);
                  }}
                >
                  <FaPlusCircle className="me-2" /> Add New Lead
                </Button>
                
                <div className="d-flex">
                  <Dropdown className="me-2">
                    <Dropdown.Toggle variant="outline-secondary" id="status-filter-dropdown">
                      <FaFilter className="me-1" /> {statusFilter === "all" ? "All Status" : statusFilter}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setStatusFilter("all")}>All Status</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatusFilter("new")}>New</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatusFilter("contacted")}>Contacted</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatusFilter("viewing scheduled")}>Viewing Scheduled</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatusFilter("negotiating")}>Negotiating</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatusFilter("booking created")}>Booking Created</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  
                  <InputGroup>
                    <Form.Control
                      placeholder="Search leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="outline-secondary">
                      <FaSearch />
                    </Button>
                  </InputGroup>
                </div>
              </div>
              
              {filteredLeads.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Interested In</th>
                      <th>Source</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map(lead => (
                      <tr key={lead.id}>
                        <td>{lead.name}</td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="d-flex align-items-center">
                              <FaEnvelope size={12} className="me-1 text-muted" /> {lead.email}
                            </span>
                            <span className="d-flex align-items-center mt-1">
                              <FaPhone size={12} className="me-1 text-muted" /> {lead.phone}
                            </span>
                          </div>
                        </td>
                        <td>{lead.property}</td>
                        <td>{lead.source}</td>
                        <td>
                          <Badge bg={
                            lead.status === "New" 
                              ? "danger" 
                              : lead.status === "Contacted" 
                                ? "warning"
                                : lead.status === "Viewing Scheduled"
                                  ? "info"
                                  : lead.status === "Negotiating"
                                    ? "primary"
                                    : "success"
                          }>
                            {lead.status}
                          </Badge>
                        </td>
                        <td>
                          <Button 
                            size="sm" 
                            variant="outline-info" 
                            className="me-1"
                            onClick={() => handleViewDetails(lead)}
                          >
                            <FaComments />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline-primary" 
                            className="me-1"
                            onClick={() => handleEditLead(lead)}
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline-success" 
                            className="me-1"
                            onClick={() => handleCreateBooking(lead)}
                            disabled={bookings.some(b => b.leadId === lead.id)}
                          >
                            <FaCalendarCheck />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline-danger"
                            onClick={() => handleDeleteLead(lead.id)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <FaUserCheck size={40} className="text-muted mb-3" />
                  <h5>No leads found</h5>
                  <p className="text-muted">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your search or filters" 
                      : "Add your first lead to get started"}
                  </p>
                  {!searchTerm && statusFilter === "all" && (
                    <Button 
                      variant="primary" 
                      onClick={() => {
                        resetForm();
                        setShowAddModal(true);
                      }}
                    >
                      <FaPlusCircle className="me-2" /> Add New Lead
                    </Button>
                  )}
                </div>
              )}
            </Tab>
            
            <Tab eventKey="bookings" title="Bookings">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Property Bookings</h5>
                <InputGroup style={{ maxWidth: "300px" }}>
                  <Form.Control
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="outline-secondary">
                    <FaSearch />
                  </Button>
                </InputGroup>
              </div>
              
              {bookings.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Property</th>
                      <th>Booking Date</th>
                      <th>Agent</th>
                      <th>Status</th>
                      <th>Deposit</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking.id}>
                        <td>{booking.leadName}</td>
                        <td>{booking.property}</td>
                        <td>{new Date(booking.bookingDate).toLocaleDateString('en-NG', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</td>
                        <td>{booking.agentAssigned || "Not Assigned"}</td>
                        <td>
                          <Badge bg={booking.status === "Confirmed" ? "success" : "warning"}>
                            {booking.status}
                          </Badge>
                        </td>
                        <td>₦{booking.deposit.toLocaleString()}</td>
                        <td>
                          <Button size="sm" variant="outline-primary" className="me-1">
                            <FaEdit />
                          </Button>
                          <Button size="sm" variant="outline-danger">
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <FaCalendarCheck size={40} className="text-muted mb-3" />
                  <h5>No bookings yet</h5>
                  <p className="text-muted">
                    Create a booking from an existing lead
                  </p>
                </div>
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* Add/Edit Lead Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentLead ? "Edit Lead" : "Add New Lead"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter client's full name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter client's email"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +234 123 456 7890"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formProperty">
                  <Form.Label>Interested Property</Form.Label>
                  <Form.Control
                    type="text"
                    name="property"
                    value={formData.property}
                    onChange={handleInputChange}
                    placeholder="Property the client is interested in"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formStatus">
                  <Form.Label>Lead Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Viewing Scheduled">Viewing Scheduled</option>
                    <option value="Negotiating">Negotiating</option>
                    <option value="Booking Created">Booking Created</option>
                    <option value="Closed">Closed</option>
                    <option value="Lost">Lost</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formSource">
                  <Form.Label>Lead Source</Form.Label>
                  <Form.Select
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                  >
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Affiliate">Affiliate Partner</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formNotes">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional information about this lead"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            <FaTimes /> Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveLead}>
            <FaSave /> {currentLead ? "Update Lead" : "Save Lead"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Lead Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        centered
      >
        {currentLead && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                Lead Details - {currentLead.name}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="mb-3">
                <Col xs={12} className="mb-3">
                  <Badge 
                    bg={
                      currentLead.status === "New" 
                        ? "danger" 
                        : currentLead.status === "Contacted" 
                          ? "warning"
                          : currentLead.status === "Viewing Scheduled"
                            ? "info"
                            : currentLead.status === "Negotiating"
                              ? "primary"
                              : "success"
                    }
                    className="p-2"
                  >
                    Status: {currentLead.status}
                  </Badge>
                </Col>
                <Col md={6}>
                  <h6>Contact Information</h6>
                  <div className="mb-2">
                    <FaEnvelope className="me-2 text-muted" /> 
                    <a href={`mailto:${currentLead.email}`}>{currentLead.email}</a>
                  </div>
                  <div>
                    <FaPhone className="me-2 text-muted" /> 
                    <a href={`tel:${currentLead.phone}`}>{currentLead.phone}</a>
                  </div>
                </Col>
                <Col md={6}>
                  <h6>Lead Details</h6>
                  <div className="mb-2">
                    <strong>Property Interest:</strong> {currentLead.property}
                  </div>
                  <div className="mb-2">
                    <strong>Source:</strong> {currentLead.source}
                  </div>
                  <div>
                    <strong>Created:</strong> {new Date(currentLead.createdAt).toLocaleDateString('en-NG', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric'
                    })}
                  </div>
                </Col>
              </Row>
              
              <hr />
              
              <h6>Notes & Activity</h6>
              <p>{currentLead.notes || "No notes available for this lead."}</p>
              
              {/* Booking information if available */}
              {bookings.some(b => b.leadId === currentLead.id) && (
                <>
                  <hr />
                  <h6 className="text-success">Booking Information</h6>
                  {bookings.filter(b => b.leadId === currentLead.id).map(booking => (
                    <div key={booking.id} className="booking-info bg-light p-3 rounded">
                      <div className="mb-2">
                        <strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString('en-NG', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="mb-2">
                        <strong>Status:</strong> <Badge bg={booking.status === "Confirmed" ? "success" : "warning"}>{booking.status}</Badge>
                      </div>
                      <div className="mb-2">
                        <strong>Agent Assigned:</strong> {booking.agentAssigned || "Not Assigned"}
                      </div>
                      <div className="mb-2">
                        <strong>Deposit:</strong> ₦{booking.deposit.toLocaleString()}
                      </div>
                      <div>
                        <strong>Notes:</strong> {booking.notes || "No additional notes"}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
              <Button 
                variant="primary" 
                onClick={() => {
                  setShowDetailsModal(false);
                  handleEditLead(currentLead);
                }}
              >
                <FaEdit className="me-1" /> Edit Lead
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
};

export default LeadsManagement;