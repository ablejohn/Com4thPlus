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
  Badge,
} from "react-bootstrap";
import { Edit2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentProperty, setCurrentProperty] = useState({
    id: null,
    title: "",
    description: "",
    availability: true,
  });

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
      setError("Failed to fetch properties");
      setLoading(false);
    }
  };

  const handleEditClick = (property) => {
    setCurrentProperty({
      id: property.id,
      title: property.title,
      description: property.description,
      availability: property.availability,
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/properties/${
          currentProperty.id
        }`,
        {
          title: currentProperty.title,
          description: currentProperty.description,
          availability: currentProperty.availability,
        }
      );
      toast.success("Property updated successfully!");
      setShowEditModal(false);
      fetchProperties();
    } catch (err) {
      toast.error("Failed to update property");
      setError("Failed to update property");
    }
  };

  const handleDeleteClick = (property) => {
    setCurrentProperty(property);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/properties/${
          currentProperty.id
        }`
      );
      toast.success("Property deleted successfully!");
      setShowDeleteModal(false);
      fetchProperties();
    } catch (err) {
      toast.error("Failed to delete property");
      setError("Failed to delete property");
    }
  };

  if (loading) {
    return (
      <Container fluid className="py-5 bg-light min-vh-100">
        <h1 className="text-center mb-5 fw-bold display-5 text-dark">
          Manage Properties
        </h1>
        <Row xs={1} md={2} className="g-4 justify-content-center">
          {[...Array(4)].map((_, index) => (
            <Col key={index}>
              <Card className="shadow-sm border-0">
                <Card.Body className="p-4">
                  <div className="placeholder-glow">
                    <h5 className="card-title placeholder col-6"></h5>
                    <p className="card-text placeholder col-8"></p>
                    <p className="card-text placeholder col-4"></p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <p className="text-danger fs-4">{error}</p>
        <Button onClick={fetchProperties} variant="primary" size="lg">
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5 bg-light min-vh-100">
      <h1 className="text-center mb-5 fw-bold display-5 text-dark">
        Manage Properties
      </h1>
      {properties.length === 0 ? (
        <p className="text-center fs-4 text-muted">No properties to manage.</p>
      ) : (
        <Row xs={1} md={2} className="g-4 justify-content-center">
          {properties.map((property) => (
            <Col key={property.id}>
              <Card
                className="shadow-sm border-0 h-100"
                style={{ maxWidth: "500px" }}
              >
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Card.Title className="fw-bold fs-4 mb-0">
                      {property.title || "Untitled Property"}
                    </Card.Title>
                    <Badge
                      bg={property.availability ? "success" : "danger"}
                      className="px-2 py-1"
                    >
                      {property.availability ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                  <Card.Text className="text-muted mb-3">
                    {property.description || "No description available"}
                  </Card.Text>
                  <div className="d-flex gap-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="d-flex align-items-center gap-2"
                      onClick={() => handleEditClick(property)}
                    >
                      <Edit2 size={16} /> Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="d-flex align-items-center gap-2"
                      onClick={() => handleDeleteClick(property)}
                    >
                      <Trash2 size={16} /> Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Edit Property Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Edit Property</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Title</Form.Label>
              <Form.Control
                type="text"
                value={currentProperty.title}
                onChange={(e) =>
                  setCurrentProperty({
                    ...currentProperty,
                    title: e.target.value,
                  })
                }
                className="rounded-3"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={currentProperty.description}
                onChange={(e) =>
                  setCurrentProperty({
                    ...currentProperty,
                    description: e.target.value,
                  })
                }
                className="rounded-3"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Availability</Form.Label>
              <Form.Check
                type="switch"
                id="availability-switch"
                label={
                  currentProperty.availability ? "Available" : "Not Available"
                }
                checked={currentProperty.availability}
                onChange={(e) =>
                  setCurrentProperty({
                    ...currentProperty,
                    availability: e.target.checked,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowEditModal(false)}
            className="rounded-3"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleEditSave}
            className="rounded-3 px-4"
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Delete Property</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="fs-5">
            Are you sure you want to delete{" "}
            <strong>{currentProperty.title}</strong>? This action cannot be
            undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowDeleteModal(false)}
            className="rounded-3"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            className="rounded-3 px-4"
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Properties;
