import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import {
  Trash2,
  AlertTriangle,
  Edit2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/properties`
      );
      setProperties(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to fetch properties");
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/properties/${propertyId}`
      );
      setShowDeleteModal(false);
      await fetchProperties();
    } catch (err) {
      console.error("Error deleting property:", err);
      setError("Failed to delete property");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/properties`);
      setShowDeleteAllModal(false);
      await fetchProperties();
    } catch (err) {
      console.error("Error deleting all properties:", err);
      setError("Failed to delete all properties");
    }
  };

  // Navigate to the property form for editing
  const handleEdit = (propertyId) => {
    navigate(`/admin?propertyId=${propertyId}`);
  };

  const toggleAvailability = async (property) => {
    const newAvailability =
      property.availability === "Available Now"
        ? "Not Available"
        : "Available Now";

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/properties/${
          property.id
        }/availability`,
        { availability: newAvailability }
      );
      await fetchProperties();
    } catch (err) {
      console.error("Error toggling availability:", err);
      setError("Failed to update availability");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Available Properties</h2>
        {properties.length > 0 && (
          <Button
            variant="danger"
            onClick={() => setShowDeleteAllModal(true)}
            className="d-flex align-items-center gap-2"
          >
            <Trash2 size={18} />
            Delete All Properties
          </Button>
        )}
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {properties.map((property) => (
          <Col key={property.id}>
            <Card className="h-100 shadow-sm">
              {property.images && property.images[0] && (
                <Card.Img
                  variant="top"
                  src={`${import.meta.env.VITE_API_BASE_URL}${
                    property.images[0]
                  }`}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <Card.Title>{property.title}</Card.Title>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEdit(property.id)} // Redirect to /admin
                      className="p-1"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        setPropertyToDelete(property);
                        setShowDeleteModal(true);
                      }}
                      className="p-1"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <Card.Text className="mb-2">{property.location}</Card.Text>
                <div className="small text-muted mb-2">
                  {property.pricing_options && property.pricing_options[0] && (
                    <div>
                      From ₦{property.pricing_options[0].price} |{" "}
                      {property.pricing_options[0].bedrooms} Bedrooms
                    </div>
                  )}
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <Button
                    variant={
                      property.availability === "Available Now"
                        ? "success"
                        : "warning"
                    }
                    size="sm"
                    onClick={() => toggleAvailability(property)}
                    className="d-flex align-items-center gap-1"
                  >
                    {property.availability === "Available Now" ? (
                      <ToggleRight size={16} />
                    ) : (
                      <ToggleLeft size={16} />
                    )}
                    {property.availability}
                  </Button>
                  {property.superhost && (
                    <span className="badge bg-primary">Superhost</span>
                  )}
                </div>
              </Card.Body>
              <Card.Footer className="bg-white">
                <small className="text-muted">
                  {property.featured_highlights &&
                    property.featured_highlights[0]}
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Delete Single Property Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <AlertTriangle className="me-2" />
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{propertyToDelete?.title}"? This
          action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(propertyToDelete?.id)}
          >
            Delete Property
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete All Properties Modal */}
      <Modal
        show={showDeleteAllModal}
        onHide={() => setShowDeleteAllModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <AlertTriangle className="me-2" />
            Delete All Properties
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete all properties? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteAllModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAll}>
            Delete All Properties
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Properties;
