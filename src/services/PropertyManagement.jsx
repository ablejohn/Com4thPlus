// PropertyManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  Modal,
  ListGroup,
  Row,
  Col,
  Badge,
  InputGroup,
  Dropdown,
  Spinner,
  OverlayTrigger,
  Tooltip,
  Tab,
  Nav
} from "react-bootstrap";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaSearch,
  FaFilter,
  FaSort,
  FaList,
  FaTable,
  FaHome,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaRegCalendarCheck,
  FaRegCalendarTimes,
  FaEye,
  FaTag
} from "react-icons/fa";
import { api } from "../../api";
import { theme } from "../styling/theme";
import PropertyForm from "./PropertyForm";

const PropertyManagement = ({
  properties,
  setProperties,
  loading,
  showMessage,
}) => {
  // Property management state
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [currentProperty, setCurrentProperty] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showBlockedDatesModal, setShowBlockedDatesModal] = useState(false);
  const [propertyToViewBlockedDates, setPropertyToViewBlockedDates] = useState(null);
  const [showPropertyDetailsModal, setShowPropertyDetailsModal] = useState(false);
  const [propertyToView, setPropertyToView] = useState(null);
  const [activeFilterPanel, setActiveFilterPanel] = useState(false);

  // Update document title
  useEffect(() => {
    document.title = "Property Management | Admin Dashboard";
    return () => {
      document.title = "Admin Dashboard";
    };
  }, []);

  // Count properties by status
  const propertyCounts = properties.reduce(
    (counts, property) => {
      const status = property.availability.toLowerCase().replace(/\s/g, "");
      counts[status] = (counts[status] || 0) + 1;
      counts.total += 1;
      return counts;
    },
    { total: 0 }
  );

  // Handle editing of a property
  const handleEdit = (property) => {
    setFormMode("edit");
    setCurrentProperty(property);
    setShowForm(true);
  };

  // Handle viewing property details
  const handleViewDetails = (property) => {
    setPropertyToView(property);
    setShowPropertyDetailsModal(true);
  };

  // Handle property deletion
  const handleDelete = async () => {
    try {
      const success = await api.deleteProperty(propertyToDelete.id);
      if (success) {
        setProperties(properties.filter((p) => p.id !== propertyToDelete.id));
        showMessage("Property deleted successfully!", "success");
      }
    } catch (error) {
      showMessage("Failed to delete property: " + error.message, "danger");
    } finally {
      setShowDeleteModal(false);
      setPropertyToDelete(null);
    }
  };

  // Handle viewing blocked dates
  const handleViewBlockedDates = (property) => {
    setPropertyToViewBlockedDates(property);
    setShowBlockedDatesModal(true);
  };

  // Filter and sort properties
  const filteredProperties = properties
    .filter((property) => {
      if (filterStatus === "all") return true;
      return property.availability.toLowerCase().replace(/\s/g, "") === filterStatus.toLowerCase().replace(/\s/g, "");
    })
    .filter((property) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        property.title.toLowerCase().includes(searchLower) ||
        property.location.toLowerCase().includes(searchLower) ||
        property.description?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "priceAsc":
          return a.priceNaira - b.priceNaira;
        case "priceDesc":
          return b.priceNaira - a.priceNaira;
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "nameAZ":
          return a.title.localeCompare(b.title);
        case "nameZA":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  // Save form handler (passed to PropertyForm)
  const handleSaveProperty = async (propertyData) => {
    try {
      if (formMode === "add") {
        // Add created date for new properties
        propertyData.createdAt = new Date().toISOString();
      }

      const updatedProperties =
        formMode === "add"
          ? [...properties, propertyData]
          : properties.map((p) =>
              p.id === currentProperty.id ? { ...p, ...propertyData } : p
            );

      const success = await api.saveProperties(updatedProperties);
      if (success) {
        setProperties(updatedProperties);
        showMessage(
          `Property ${formMode === "add" ? "added" : "updated"} successfully!`,
          "success"
        );
        resetForm();
      }
    } catch (error) {
      showMessage(`Failed to ${formMode} property: ${error.message}`, "danger");
    }
  };

  // Reset form state
  const resetForm = () => {
    setCurrentProperty(null);
    setFormMode("add");
    setShowForm(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  // Get status badge for property
  const getStatusBadge = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("available")) {
      return <Badge bg="success" className="py-1 px-2">{status}</Badge>;
    } else if (statusLower.includes("coming")) {
      return <Badge bg="warning" text="dark" className="py-1 px-2">{status}</Badge>;
    } else {
      return <Badge bg="secondary" className="py-1 px-2">{status}</Badge>;
    }
  };

  // Get status color class
  const getStatusClass = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("available")) {
      return "text-success";
    } else if (statusLower.includes("coming")) {
      return "text-warning";
    } else {
      return "text-secondary";
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setSortBy("newest");
  };

  // Check if has blocked dates
  const hasBlockedDates = (property) => {
    return property.blockedDates && property.blockedDates.length > 0;
  };

  return (
    <>
      {/* Property Stats Cards */}
      <Row className="mb-4">
        <Col sm={6} lg={3} className="mb-3 mb-lg-0">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex">
              <div className="rounded-circle p-3 bg-primary bg-opacity-10 me-3">
                <FaHome className="text-primary" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Properties</h6>
                <h3 className="mb-0 fw-bold">{propertyCounts.total || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3} className="mb-3 mb-lg-0">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex">
              <div className="rounded-circle p-3 bg-success bg-opacity-10 me-3">
                <FaCheckCircle className="text-success" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Available</h6>
                <h3 className="mb-0 fw-bold">{propertyCounts.availablenow || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3} className="mb-3 mb-lg-0">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex">
              <div className="rounded-circle p-3 bg-warning bg-opacity-10 me-3">
                <FaRegCalendarCheck className="text-warning" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Coming Soon</h6>
                <h3 className="mb-0 fw-bold">{propertyCounts.comingsoon || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3} className="mb-3 mb-lg-0">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex">
              <div className="rounded-circle p-3 bg-secondary bg-opacity-10 me-3">
                <FaRegCalendarTimes className="text-secondary" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Not Available</h6>
                <h3 className="mb-0 fw-bold">{propertyCounts.notavailable || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Management Card */}
      <Card className="border-0 shadow-sm" style={{ borderRadius: "10px", overflow: "hidden" }}>
        <Card.Header className="bg-white py-3 border-0">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <h5 className="mb-0 fw-bold d-flex align-items-center">
              <FaHome className="me-2 text-primary" /> Property Management
            </h5>
            <Button
              onClick={() => setShowForm(true)}
              variant="primary"
              className="rounded-pill px-3 d-flex align-items-center"
            >
              <FaPlus className="me-2" /> Add Property
            </Button>
          </div>
        </Card.Header>
        
        <Card.Body className="p-0">
          {/* Filters and search section */}
          <div className="px-4 py-3 border-bottom">
            <Row className="align-items-center">
              <Col lg={7} className="mb-3 mb-lg-0">
                <div className="d-flex flex-wrap gap-2">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>List view</Tooltip>}
                  >
                    <Button
                      variant={viewMode === "list" ? "primary" : "outline-primary"}
                      className="rounded-pill"
                      onClick={() => setViewMode("list")}
                      size="sm"
                    >
                      <FaList />
                    </Button>
                  </OverlayTrigger>

                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Grid view</Tooltip>}
                  >
                    <Button
                      variant={viewMode === "grid" ? "primary" : "outline-primary"}
                      className="rounded-pill"
                      onClick={() => setViewMode("grid")}
                      size="sm"
                    >
                      <FaTable />
                    </Button>
                  </OverlayTrigger>

                  <Dropdown>
                    <Dropdown.Toggle
                      variant="outline-secondary"
                      id="filter-dropdown"
                      className="rounded-pill d-flex align-items-center"
                      size="sm"
                    >
                      <FaFilter className="me-2" /> 
                      {filterStatus === "all" ? "All Properties" : 
                       filterStatus === "availablenow" ? "Available Now" : 
                       filterStatus === "comingsoon" ? "Coming Soon" : 
                       "Not Available"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => setFilterStatus("all")}
                        active={filterStatus === "all"}
                      >
                        All Properties
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setFilterStatus("availablenow")}
                        active={filterStatus === "availablenow"}
                      >
                        Available Now
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setFilterStatus("comingsoon")}
                        active={filterStatus === "comingsoon"}
                      >
                        Coming Soon
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setFilterStatus("notavailable")}
                        active={filterStatus === "notavailable"}
                      >
                        Not Available
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  <Dropdown>
                    <Dropdown.Toggle
                      variant="outline-secondary"
                      id="sort-dropdown"
                      className="rounded-pill d-flex align-items-center"
                      size="sm"
                    >
                      <FaSort className="me-2" /> 
                      {sortBy === "newest" ? "Newest First" : 
                       sortBy === "oldest" ? "Oldest First" : 
                       sortBy === "priceAsc" ? "Price: Low to High" : 
                       sortBy === "priceDesc" ? "Price: High to Low" :
                       sortBy === "nameAZ" ? "Name: A to Z" :
                       "Name: Z to A"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => setSortBy("newest")}
                        active={sortBy === "newest"}
                      >
                        Newest First
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setSortBy("oldest")}
                        active={sortBy === "oldest"}
                      >
                        Oldest First
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setSortBy("nameAZ")}
                        active={sortBy === "nameAZ"}
                      >
                        Name: A to Z
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setSortBy("nameZA")}
                        active={sortBy === "nameZA"}
                      >
                        Name: Z to A
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setSortBy("priceAsc")}
                        active={sortBy === "priceAsc"}
                      >
                        Price: Low to High
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setSortBy("priceDesc")}
                        active={sortBy === "priceDesc"}
                      >
                        Price: High to Low
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  {(searchTerm || filterStatus !== "all" || sortBy !== "newest") && (
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      className="rounded-pill"
                      onClick={clearFilters}
                    >
                      <FaTimes className="me-1" /> Clear Filters
                    </Button>
                  )}
                </div>
              </Col>
              
              <Col lg={5}>
                <InputGroup>
                  <Form.Control
                    placeholder="Search by name, location or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-end-0"
                    style={{ borderRadius: "50px 0 0 50px" }}
                  />
                  <Button 
                    variant="outline-secondary" 
                    style={{ borderRadius: "0 50px 50px 0", borderLeft: "none" }}
                  >
                    <FaSearch />
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          </div>

          {/* Content section */}
          <div className="p-4">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">Loading properties...</p>
              </div>
            ) : (
              <>
                {/* Results summary */}
                <div className="mb-3 text-muted small">
                  Showing {filteredProperties.length} of {properties.length} properties
                </div>

                {/* List View */}
                {viewMode === "list" && (
                  <div className="property-list">
                    {filteredProperties.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover property-table mb-0">
                          <thead>
                            <tr>
                              <th>Property</th>
                              <th>Location</th>
                              <th>Details</th>
                              <th>Price (₦)</th>
                              <th>Status</th>
                              <th className="text-end">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredProperties.map((property) => (
                              <tr key={property.id} className="align-middle">
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div
                                      className="property-thumbnail me-3"
                                      style={{
                                        backgroundImage: `url(${
                                          property.images?.[0] ||
                                          "/placeholder-image.jpg"
                                        })`,
                                        width: "60px",
                                        height: "50px",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        borderRadius: "6px",
                                      }}
                                    ></div>
                                    <div>
                                      <h6 className="mb-0">{property.title}</h6>
                                      <div className="small text-muted">ID: {property.id}</div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <FaMapMarkerAlt className="text-muted me-1" size={14} />
                                    {property.location}
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <Badge bg="light" text="dark" className="border">
                                      <FaBed className="me-1" size={12} /> {property.beds}
                                    </Badge>
                                    <Badge bg="light" text="dark" className="border">
                                      <FaBath className="me-1" size={12} /> {property.baths}
                                    </Badge>
                                    <Badge bg="light" text="dark" className="border">
                                      <FaRulerCombined className="me-1" size={12} /> {(property.sqft || 0).toLocaleString()} sqft
                                    </Badge>
                                  </div>
                                </td>
                                <td>
                                  <div className="fw-bold">{property.priceNaira?.toLocaleString() || 0}</div>
                                </td>
                                <td>
                                  {getStatusBadge(property.availability)}
                                </td>
                                <td>
                                  <div className="d-flex justify-content-end gap-1">
                                    <Button
                                      variant="light"
                                      size="sm"
                                      className="btn-icon"
                                      onClick={() => handleViewDetails(property)}
                                      title="View details"
                                    >
                                      <FaEye />
                                    </Button>
                                    <Button
                                      variant="light"
                                      size="sm"
                                      className="btn-icon"
                                      onClick={() => handleViewBlockedDates(property)}
                                      title="View blocked dates"
                                    >
                                      <FaCalendarAlt />
                                    </Button>
                                    <Button
                                      variant="light"
                                      size="sm"
                                      className="btn-icon text-primary"
                                      onClick={() => handleEdit(property)}
                                      title="Edit property"
                                    >
                                      <FaEdit />
                                    </Button>
                                    <Button
                                      variant="light"
                                      size="sm"
                                      className="btn-icon text-danger"
                                      onClick={() => {
                                        setPropertyToDelete(property);
                                        setShowDeleteModal(true);
                                      }}
                                      title="Delete property"
                                    >
                                      <FaTrash />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-5 bg-light rounded">
                        <FaHome size={40} className="text-muted mb-3" />
                        <h5>No properties found</h5>
                        <p className="text-muted">
                          {searchTerm || filterStatus !== "all"
                            ? "Try adjusting your search or filters"
                            : "Add your first property to get started"}
                        </p>
                        {!searchTerm && filterStatus === "all" && (
                          <Button
                            variant="primary"
                            onClick={() => setShowForm(true)}
                            className="mt-2"
                          >
                            <FaPlus className="me-2" /> Add Property
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Grid View */}
                {viewMode === "grid" && (
                  <Row className="g-3">
                    {filteredProperties.length > 0 ? (
                      filteredProperties.map((property) => (
                        <Col key={property.id} md={6} lg={4} xl={3}>
                          <Card className="h-100 property-card border-0 shadow-sm" style={{ transition: "all 0.2s" }}>
                            <div className="position-relative">
                              <div
                                className="property-image"
                                style={{
                                  backgroundImage: `url(${
                                    property.images?.[0] || "/placeholder-image.jpg"
                                  })`,
                                  height: "160px",
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  borderRadius: "10px 10px 0 0",
                                }}
                              ></div>
                              <div className="position-absolute top-0 start-0 m-2">
                                {getStatusBadge(property.availability)}
                              </div>
                              <div className="position-absolute top-0 end-0 m-2">
                                <Badge bg="dark" className="px-2 py-1">
                                  <FaTag className="me-1" /> ₦{(property.priceNaira || 0).toLocaleString()}
                                </Badge>
                              </div>
                            </div>
                            <Card.Body className="p-3">
                              <h6 className="mb-1 property-title">{property.title}</h6>
                              <p className="text-muted small mb-2">
                                <FaMapMarkerAlt className="me-1" size={12} />{property.location}
                              </p>
                              <div className="d-flex justify-content-between mb-3">
                                <div className="d-flex gap-2">
                                  <Badge bg="light" text="dark" className="border px-2">
                                    <FaBed className="me-1" size={12} /> {property.beds}
                                  </Badge>
                                  <Badge bg="light" text="dark" className="border px-2">
                                    <FaBath className="me-1" size={12} /> {property.baths}
                                  </Badge>
                                </div>
                                <Badge bg="light" text="dark" className="border px-2">
                                  <FaRulerCombined className="me-1" size={12} /> {(property.sqft || 0).toLocaleString()}
                                </Badge>
                              </div>
                              <div className="d-flex gap-1 mt-auto">
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  className="flex-grow-1"
                                  onClick={() => handleViewDetails(property)}
                                >
                                  <FaEye className="me-1" /> View
                                </Button>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="flex-grow-1"
                                  onClick={() => handleEdit(property)}
                                >
                                  <FaEdit className="me-1" /> Edit
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => {
                                    setPropertyToDelete(property);
                                    setShowDeleteModal(true);
                                  }}
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col xs={12}>
                        <div className="text-center py-5 bg-light rounded">
                          <FaHome size={40} className="text-muted mb-3" />
                          <h5>No properties found</h5>
                          <p className="text-muted">
                            {searchTerm || filterStatus !== "all"
                              ? "Try adjusting your search or filters"
                              : "Add your first property to get started"}
                          </p>
                          {!searchTerm && filterStatus === "all" && (
                            <Button
                              variant="primary"
                              onClick={() => setShowForm(true)}
                              className="mt-2"
                            >
                              <FaPlus className="me-2" /> Add Property
                            </Button>
                          )}
                        </div>
                      </Col>
                    )}
                  </Row>
                )}
              </>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Property Form Modal */}
      {showForm && (
        <PropertyForm
          show={showForm}
          onHide={resetForm}
          formMode={formMode}
          currentProperty={currentProperty}
          onSave={handleSaveProperty}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        size="sm"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-danger">
            <FaExclamationTriangle className="me-2" /> Delete Property
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <p>Are you sure you want to delete <strong>{propertyToDelete?.title}</strong>?</p>
          <p className="text-danger small mb-0">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Property
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Blocked Dates Modal */}
      <Modal
        show={showBlockedDatesModal}
        onHide={() => setShowBlockedDatesModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>
            <FaCalendarAlt className="me-2 text-primary" />
            Blocked Dates
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <div className="mb-3 pb-3 border-bottom">
            <h6>{propertyToViewBlockedDates?.title}</h6>
            <p className="text-muted small mb-0">
              <FaMapMarkerAlt className="me-1" /> {propertyToViewBlockedDates?.location}
            </p>
          </div>

          {propertyToViewBlockedDates?.blockedDates?.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Duration</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {propertyToViewBlockedDates?.blockedDates?.map((dateRange, index) => {
                    // Calculate duration
                    const startDate = new Date(dateRange.start || dateRange.startDate);
                    const endDate = new Date(dateRange.end || dateRange.endDate);
                    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <tr key={index}>
                        <td>{formatDate(dateRange.start || dateRange.startDate)}</td>
                        <td>{formatDate(dateRange.end || dateRange.endDate)}</td>
                        <td>{duration} {duration === 1 ? 'day' : 'days'}</td>
                        <td>
                          <Badge bg="secondary">
                            {dateRange.reason || "Unavailable"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 bg-light rounded">
              <p className="mb-0">No blocked dates for this property.</p>
              <small className="text-muted">
                You can add blocked dates when editing the property.
              </small>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="outline-secondary"
            onClick={() => setShowBlockedDatesModal(false)}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowBlockedDatesModal(false);
              handleEdit(propertyToViewBlockedDates);
            }}
          >
            <FaEdit className="me-2" /> Edit Property
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Property Details Modal */}
      <Modal
        show={showPropertyDetailsModal}
        onHide={() => setShowPropertyDetailsModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>
            <FaEye className="me-2 text-primary" />
            Property Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {propertyToView && (
            <>
              <div className="property-header position-relative">
                <div
                  className="property-banner"
                  style={{
                    backgroundImage: `url(${propertyToView.images?.[0] || "/placeholder-image.jpg"})`,
                    height: "200px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="position-absolute bottom-0 start-0 end-0 p-3" 
                    style={{ 
                      background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                      color: "white"
                    }}>
                    <h4 className="mb-1">{propertyToView.title}</h4>
                    <p className="mb-0">
                      <FaMapMarkerAlt className="me-1" /> {propertyToView.location}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <Tab.Container defaultActiveKey="details">
                  <Nav variant="tabs" className="mb-4">
                    <Nav.Item>
                      <Nav.Link eventKey="details">
                        <FaHome className="me-2" /> Details
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="dates">
                        <FaCalendarAlt className="me-2" /> 
                        Blocked Dates
                        {hasBlockedDates(propertyToView) && (
                          <Badge bg="primary" pill className="ms-2">
                            {propertyToView.blockedDates?.length}
                          </Badge>
                        )}
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                
                  <Tab.Content>
                    <Tab.Pane eventKey="details">
                      <Row>
                        <Col md={8}>
                          <div className="mb-4">
                            <h6 className="text-primary mb-3">Property Information</h6>
                            <Row className="g-3">
                              <Col sm={6} md={4}>
                                <div className="detail-item">
                                  <small className="text-muted d-block">Type</small>
                                  <span>{propertyToView.type || "Not specified"}</span>
                                </div>
                              </Col>
                              <Col sm={6} md={4}>
                                <div className="detail-item">
                                  <small className="text-muted d-block">Status</small>
                                  <span className={getStatusClass(propertyToView.availability)}>
                                    {propertyToView.availability}
                                  </span>
                                </div>
                              </Col>
                              <Col sm={6} md={4}>
                                <div className="detail-item">
                                  <small className="text-muted d-block">ID</small>
                                  <span>{propertyToView.id}</span>
                                </div>
                              </Col>
                              <Col sm={6} md={4}>
                                <div className="detail-item">
                                  <small className="text-muted d-block">Bedrooms</small>
                                  <span>{propertyToView.beds}</span>
                                </div>
                              </Col>
                              <Col sm={6} md={4}>
                                <div className="detail-item">
                                  <small className="text-muted d-block">Bathrooms</small>
                                  <span>{propertyToView.baths}</span>
                                </div>
                              </Col>
                              <Col sm={6} md={4}>
                                <div className="detail-item">
                                  <small className="text-muted d-block">Area</small>
                                  <span>{(propertyToView.sqft || 0).toLocaleString()} sqft</span>
                                </div>
                              </Col>
                            </Row>
                          </div>
                          
                          <div className="mb-4">
                            <h6 className="text-primary mb-3">Description</h6>
                            <p className="mb-0">{propertyToView.description || "No description available."}</p>
                          </div>
                          
                          {propertyToView.amenities && propertyToView.amenities.length > 0 && (
                            <div className="mb-4">
                              <h6 className="text-primary mb-3">Amenities</h6>
                              <div className="d-flex flex-wrap gap-2">
                                {propertyToView.amenities.map((amenity, idx) => (
                                  <Badge key={idx} bg="light" text="dark" className="py-2 px-3">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </Col>
                        
                        <Col md={4}>
                          <Card className="border-0 shadow-sm">
                            <Card.Body>
                              <h6 className="text-primary mb-3">Pricing & Booking</h6>
                              <div className="mb-3">
                                <small className="text-muted d-block">Price</small>
                                <h5 className="mb-0">₦{(propertyToView.priceNaira || 0).toLocaleString()}</h5>
                              </div>
                              
                              <div className="mb-3">
                                <small className="text-muted d-block">Created On</small>
                                <div>{formatDate(propertyToView.createdAt)}</div>
                              </div>
                              
                              <div className="mb-3">
                                <small className="text-muted d-block">Last Updated</small>
                                <div>{formatDate(propertyToView.updatedAt)}</div>
                              </div>
                              
                              <div className="mb-3">
                                <small className="text-muted d-block">Bookings</small>
                                <div>{propertyToView.bookings || 0}</div>
                              </div>
                              
                              <div className="d-grid gap-2 mt-4">
                                <Button 
                                  variant="primary" 
                                  onClick={() => {
                                    setShowPropertyDetailsModal(false);
                                    handleEdit(propertyToView);
                                  }}
                                >
                                  <FaEdit className="me-2" /> Edit Property
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  onClick={() => {
                                    setShowPropertyDetailsModal(false);
                                    setPropertyToDelete(propertyToView);
                                    setShowDeleteModal(true);
                                  }}
                                >
                                  <FaTrash className="me-2" /> Delete Property
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Tab.Pane>
                    
                    <Tab.Pane eventKey="dates">
                      {propertyToView.blockedDates?.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Duration</th>
                                <th>Reason</th>
                              </tr>
                            </thead>
                            <tbody>
                              {propertyToView.blockedDates.map((dateRange, index) => {
                                // Calculate duration
                                const startDate = new Date(dateRange.start || dateRange.startDate);
                                const endDate = new Date(dateRange.end || dateRange.endDate);
                                const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                                
                                return (
                                  <tr key={index}>
                                    <td>{formatDate(dateRange.start || dateRange.startDate)}</td>
                                    <td>{formatDate(dateRange.end || dateRange.endDate)}</td>
                                    <td>{duration} {duration === 1 ? 'day' : 'days'}</td>
                                    <td>
                                      <Badge bg="secondary">
                                        {dateRange.reason || "Unavailable"}
                                      </Badge>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-light rounded">
                          <p className="mb-0">No blocked dates for this property.</p>
                          <small className="text-muted">
                            You can add blocked dates when editing the property.
                          </small>
                        </div>
                      )}
                      
                      <div className="d-flex justify-content-end mt-3">
                        <Button
                          variant="primary"
                          onClick={() => {
                            setShowPropertyDetailsModal(false);
                            handleEdit(propertyToView);
                          }}
                        >
                          <FaEdit className="me-2" /> Edit Blocked Dates
                        </Button>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PropertyManagement;