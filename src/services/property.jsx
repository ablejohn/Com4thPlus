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
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { useProperties } from "../services/propertyContext";
import { api } from "../../api";
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
    images: [""], // Changed to an array for multiple images
    beds: "",
    baths: "",
    sqft: "",
    priceNaira: "",
    description: "", // Added for consistency with PropertyDetailPage
    contactPhone: "",
  };

  const [formData, setFormData] = useState({ ...initialFormData });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.location ||
      !formData.beds ||
      !formData.baths ||
      !formData.sqft ||
      !formData.priceNaira
    ) {
      setMessage({
        show: true,
        text: "All fields except images are required",
        type: "danger",
      });
      return;
    }

    // Validate image URLs
    const validImages = formData.images.filter((url) => {
      if (!url) return false;
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });

    if (validImages.length === 0) {
      setMessage({
        show: true,
        text: "Please provide at least one valid image URL",
        type: "danger",
      });
      return;
    }

    if (
      isNaN(formData.beds) ||
      isNaN(formData.baths) ||
      isNaN(formData.sqft) ||
      isNaN(formData.priceNaira)
    ) {
      setMessage({
        show: true,
        text: "Beds, baths, square footage, and price must be valid numbers",
        type: "danger",
      });
      return;
    }

    const propertyData = {
      ...formData,
      id: formMode === "add" ? Date.now().toString() : currentProperty.id,
      images: validImages,
      beds: Number(formData.beds),
      baths: Number(formData.baths),
      sqft: Number(formData.sqft),
      priceNaira: Number(formData.priceNaira),
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
      images: property.images.length > 0 ? [...property.images] : [""],
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
                        {property.availability}) - {property.beds ?? "N/A"}{" "}
                        Beds, {property.baths ?? "N/A"} Baths,{" "}
                        {(property.sqft ?? 0).toLocaleString()} sqft, ₦
                        {(property.priceNaira ?? 0).toLocaleString()}
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
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Beds</Form.Label>
                    <Form.Control
                      type="number"
                      name="beds"
                      value={formData.beds}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Baths</Form.Label>
                    <Form.Control
                      type="number"
                      name="baths"
                      value={formData.baths}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Square Footage (sqft)</Form.Label>
                    <Form.Control
                      type="number"
                      name="sqft"
                      value={formData.sqft}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price (₦)</Form.Label>
                    <Form.Control
                      type="number"
                      name="priceNaira"
                      value={formData.priceNaira}
                      onChange={handleInputChange}
                      required
                      min="0"
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
                  <option value="Not Available">Not Available</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contact Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Property Images (Add URLs)</Form.Label>
                {formData.images.map((img, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <Form.Control
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={img}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      required={index === 0} // Only first image is required
                      className="me-2"
                    />
                    {formData.images.length > 1 && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeImageField(index)}
                      >
                        <FaTimes />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={addImageField}
                  className="mt-2"
                >
                  <FaPlus /> Add Another Image
                </Button>
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
