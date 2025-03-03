import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
  Modal,
  Alert,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaSave } from "react-icons/fa";
import { useProperties } from "./propertyContext"; // Adjust path
import { api } from "../../api"; // Adjust path
import { theme } from "../styling/theme";

const AdminPropertyPage = () => {
  const { properties, setProperties, loading } = useProperties();
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [currentProperty, setCurrentProperty] = useState(null);
  const [message, setMessage] = useState({ show: false, text: "", type: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  const initialFormData = {
    id: "",
    title: "",
    location: "",
    availability: "Available Now",
    imageUrl: "",
    images: [""],
  };

  const [formData, setFormData] = useState({ ...initialFormData });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.imageUrl) {
      setMessage({
        show: true,
        text: "All fields are required",
        type: "danger",
      });
      return;
    }

    // Add URL validation
    try {
      new URL(formData.imageUrl); // This will throw an error if not a valid URL
    } catch (error) {
      setMessage({
        show: true,
        text: "Please enter a valid image URL",
        type: "danger",
      });
      return;
    }

    const propertyData = {
      ...formData,
      id: formMode === "add" ? Date.now().toString() : currentProperty.id,
      images: [formData.imageUrl], // Use the URL directly
    };

    const updatedProperties =
      formMode === "add"
        ? [...properties, propertyData]
        : properties.map((p) =>
            p.id === currentProperty.id ? propertyData : p
          );

    const success = await api.saveProperties(updatedProperties);
    if (success) {
      setProperties(updatedProperties);
      setMessage({
        show: true,
        text: `Property ${
          formMode === "add" ? "added" : "updated"
        } successfully!`,
        type: "success",
      });
      resetForm();
    }
  };

  const handleEdit = (property) => {
    setFormMode("edit");
    setCurrentProperty(property);
    setFormData({
      ...property,
      imageUrl: property.images[0] || "", // Set imageUrl from the first image
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    const success = await api.deleteProperty(propertyToDelete.id);
    if (success) {
      setProperties(properties.filter((p) => p.id !== propertyToDelete.id));
      setMessage({
        show: true,
        text: "Property deleted successfully!",
        type: "success",
      });
    }
    setShowDeleteModal(false);
    setPropertyToDelete(null);
  };

  const resetForm = () => {
    setFormData({ ...initialFormData });
    setCurrentProperty(null);
    setFormMode("add");
    setShowForm(false);
    setTimeout(() => setMessage({ show: false, text: "", type: "" }), 3000);
  };

  return (
    <Container className="py-5 mt-5">
      <Card style={{ borderRadius: theme.borderRadius?.md || "8px" }}>
        <Card.Body>
          <h2 style={{ color: theme.colors?.primary || "#007bff" }}>
            Property Management
          </h2>
          {message.show && (
            <Alert
              variant={message.type}
              onClose={() => setMessage({ show: false })}
              dismissible
            >
              {message.text}
            </Alert>
          )}

          {!showForm ? (
            <>
              <Button
                onClick={() => setShowForm(true)}
                style={{
                  backgroundColor: theme.colors?.primary || "#007bff",
                  border: "none",
                  marginBottom: "20px",
                }}
              >
                <FaPlus /> Add Property
              </Button>
              {loading ? (
                <div>Loading properties...</div>
              ) : (
                <ListGroup>
                  {properties.map((property) => (
                    <ListGroup.Item
                      key={property.id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        {property.title} - {property.location} (
                        {property.availability})
                      </div>
                      <div>
                        <Button
                          variant="outline-primary"
                          onClick={() => handleEdit(property)}
                          className="me-2"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => {
                            setPropertyToDelete(property);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Availability</Form.Label>
                <Form.Select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                >
                  <option value="Available Now">Available Now</option>
                  <option value="Coming Soon">Coming Soon</option>
                  <option value="Sold Out">Sold Out</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Property Image URL</Form.Label>
                <Form.Control
                  type="url"
                  name="imageUrl"
                  placeholder="https://example.com/your-image.jpg"
                  value={formData.imageUrl || ""}
                  onChange={handleInputChange}
                  required={formMode === "add"}
                />
                {formMode === "edit" && formData.images[0] && (
                  <div className="mt-2">
                    <small>
                      Current Image:{" "}
                      <a
                        href={formData.images[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </small>
                  </div>
                )}
              </Form.Group>
              <Button
                type="submit"
                style={{
                  backgroundColor: theme.colors?.primary || "#007bff",
                  border: "none",
                }}
              >
                <FaSave /> Save
              </Button>
              <Button variant="secondary" onClick={resetForm} className="ms-2">
                Cancel
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this property?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminPropertyPage;
