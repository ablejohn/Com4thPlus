// PropertyManagement.jsx
import React, { useState } from "react";
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
  const [propertyToViewBlockedDates, setPropertyToViewBlockedDates] =
    useState(null);

  // Handle editing of a property
  const handleEdit = (property) => {
    setFormMode("edit");
    setCurrentProperty(property);
    setShowForm(true);
  };

  // Handle property deletion
  const handleDelete = async () => {
    const success = await api.deleteProperty(propertyToDelete.id);
    if (success) {
      setProperties(properties.filter((p) => p.id !== propertyToDelete.id));
      showMessage("Property deleted successfully!", "success");
    }
    setShowDeleteModal(false);
    setPropertyToDelete(null);
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
      return property.availability.toLowerCase() === filterStatus.toLowerCase();
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
        default:
          return 0;
      }
    });

  // Save form handler (passed to PropertyForm)
  const handleSaveProperty = async (propertyData) => {
    const updatedProperties =
      formMode === "add"
        ? [...properties, propertyData]
        : properties.map((p) =>
            p.id === currentProperty.id ? propertyData : p
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
  };

  // Reset form state
  const resetForm = () => {
    setCurrentProperty(null);
    setFormMode("add");
    setShowForm(false);
  };

  return (
    <>
      <Card className="mb-3">
        <Card.Body>
          <div className="d-md-flex justify-content-between align-items-center mb-3">
            <div className="d-flex mb-3 mb-md-0">
              <Button
                onClick={() => setShowForm(true)}
                style={{
                  backgroundColor: theme.colors?.primary || "#007bff",
                  border: "none",
                }}
                className="me-2"
              >
                <FaPlus /> Add Property
              </Button>

              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>List view</Tooltip>}
              >
                <Button
                  variant={viewMode === "list" ? "primary" : "outline-primary"}
                  className="me-1"
                  onClick={() => setViewMode("list")}
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
                  className="me-2"
                  onClick={() => setViewMode("grid")}
                >
                  <FaTable />
                </Button>
              </OverlayTrigger>

              <Dropdown className="me-2">
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="filter-dropdown"
                  className="d-flex align-items-center"
                >
                  <FaFilter className="me-1" /> Filter
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => setFilterStatus("all")}
                    active={filterStatus === "all"}
                  >
                    All Properties
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setFilterStatus("available now")}
                    active={filterStatus === "available now"}
                  >
                    Available Now
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setFilterStatus("coming soon")}
                    active={filterStatus === "coming soon"}
                  >
                    Coming Soon
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setFilterStatus("not available")}
                    active={filterStatus === "not available"}
                  >
                    Not Available
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="sort-dropdown"
                  className="d-flex align-items-center"
                >
                  <FaSort className="me-1" /> Sort
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
            </div>

            <div className="search-container">
              <InputGroup>
                <Form.Control
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-secondary">
                  <FaSearch />
                </Button>
              </InputGroup>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-2">Loading properties...</p>
            </div>
          ) : (
            <>
              {/* List View */}
              {viewMode === "list" && (
                <div className="property-list">
                  {filteredProperties.length > 0 ? (
                    <ListGroup>
                      {filteredProperties.map((property) => (
                        <ListGroup.Item
                          key={property.id}
                          className="property-item py-3"
                        >
                          <Row>
                            <Col md={2} className="mb-2 mb-md-0">
                              <div
                                className="property-thumbnail"
                                style={{
                                  backgroundImage: `url(${
                                    property.images[0] ||
                                    "/placeholder-image.jpg"
                                  })`,
                                  height: "80px",
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  borderRadius: "4px",
                                }}
                              ></div>
                            </Col>
                            <Col md={5}>
                              <h5 className="mb-1">{property.title}</h5>
                              <div className="text-muted small mb-2">
                                {property.location}
                              </div>
                              <div>
                                <Badge
                                  bg={
                                    property.availability === "Available Now"
                                      ? "success"
                                      : property.availability === "Coming Soon"
                                      ? "warning"
                                      : "secondary"
                                  }
                                  className="me-2"
                                >
                                  {property.availability}
                                </Badge>
                                <span className="me-3">
                                  {property.beds} Beds
                                </span>
                                <span className="me-3">
                                  {property.baths} Baths
                                </span>
                                <span>
                                  {(property.sqft || 0).toLocaleString()} sqft
                                </span>
                              </div>
                            </Col>
                            <Col md={2} className="text-md-center">
                              <div className="price-tag">
                                ₦{(property.priceNaira || 0).toLocaleString()}
                              </div>
                              <div className="small text-success mt-1">
                                {property.bookings
                                  ? `${property.bookings} bookings`
                                  : "0 bookings"}
                              </div>
                            </Col>
                            <Col
                              md={3}
                              className="d-flex align-items-center justify-content-md-end mt-2 mt-md-0"
                            >
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleViewBlockedDates(property)}
                                className="me-2"
                                title="View blocked dates"
                              >
                                <FaCalendarAlt /> Dates
                              </Button>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEdit(property)}
                                className="me-2"
                              >
                                <FaEdit /> Edit
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
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <div className="text-center py-4">
                      <FaHome size={40} className="text-muted mb-3" />
                      <h5>No properties found</h5>
                      <p className="text-muted">
                        {searchTerm
                          ? "Try adjusting your search or filters"
                          : "Add your first property to get started"}
                      </p>
                      {!searchTerm && (
                        <Button
                          variant="primary"
                          onClick={() => setShowForm(true)}
                        >
                          <FaPlus /> Add Property
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Grid View */}
              {viewMode === "grid" && (
                <Row>
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                      <Col key={property.id} md={6} lg={4} className="mb-4">
                        <Card className="h-100 property-card">
                          <div
                            className="property-image"
                            style={{
                              backgroundImage: `url(${
                                property.images[0] || "/placeholder-image.jpg"
                              })`,
                              height: "180px",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              borderTopLeftRadius:
                                theme.borderRadius?.md || "8px",
                              borderTopRightRadius:
                                theme.borderRadius?.md || "8px",
                            }}
                          >
                            <Badge
                              bg={
                                property.availability === "Available Now"
                                  ? "success"
                                  : property.availability === "Coming Soon"
                                  ? "warning"
                                  : "secondary"
                              }
                              className="position-absolute m-2"
                            >
                              {property.availability}
                            </Badge>
                            <div className="position-absolute bottom-0 end-0 m-2">
                              <span className="badge bg-dark">
                                ₦{(property.priceNaira || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <Card.Body>
                            <h5 className="card-title mb-1">
                              {property.title}
                            </h5>
                            <p className="text-muted small mb-2">
                              {property.location}
                            </p>
                            <div className="d-flex justify-content-between mb-3">
                              <div>
                                <span className="me-2">
                                  {property.beds} Beds
                                </span>
                                <span className="me-2">
                                  {property.baths} Baths
                                </span>
                              </div>
                              <span>
                                {(property.sqft || 0).toLocaleString()} sqft
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mt-auto pt-2 border-top">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleViewBlockedDates(property)}
                                title="View blocked dates"
                              >
                                <FaCalendarAlt />
                              </Button>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEdit(property)}
                              >
                                <FaEdit /> Edit
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
                      <div className="text-center py-4">
                        <FaHome size={40} className="text-muted mb-3" />
                        <h5>No properties found</h5>
                        <p className="text-muted">
                          {searchTerm
                            ? "Try adjusting your search or filters"
                            : "Add your first property to get started"}
                        </p>
                        {!searchTerm && (
                          <Button
                            variant="primary"
                            onClick={() => setShowForm(true)}
                          >
                            <FaPlus /> Add Property
                          </Button>
                        )}
                      </div>
                    </Col>
                  )}
                </Row>
              )}
            </>
          )}
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
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{propertyToDelete?.title}</strong>? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
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
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCalendarAlt className="me-2" />
            Blocked Dates for {propertyToViewBlockedDates?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {propertyToViewBlockedDates?.blockedDates?.length > 0 ? (
            <ListGroup>
              {propertyToViewBlockedDates?.blockedDates?.map(
                (dateRange, index) => (
                  <ListGroup.Item
                    key={index}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>From:</strong>{" "}
                      {new Date(dateRange.startDate).toLocaleDateString()}
                      <strong className="ms-3">To:</strong>{" "}
                      {new Date(dateRange.endDate).toLocaleDateString()}
                    </div>
                    <Badge bg="secondary">
                      {dateRange.reason || "Unavailable"}
                    </Badge>
                  </ListGroup.Item>
                )
              ) || []}
            </ListGroup>
          ) : (
            <div className="text-center py-4">
              <p className="mb-0">No blocked dates for this property.</p>
              <small className="text-muted">
                You can add blocked dates when editing the property.
              </small>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
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
            Edit Property & Dates
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PropertyManagement;
