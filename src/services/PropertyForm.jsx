// PropertyForm.jsx
import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { FaSave, FaTimes, FaPlus } from "react-icons/fa";
import { theme } from "../styling/theme";

const PropertyForm = ({ show, onHide, formMode, currentProperty, onSave }) => {
  const initialFormData = {
    id: "",
    title: "",
    location: "",
    availability: "Available Now",
    images: [""],
    beds: "",
    baths: "",
    sqft: "",
    priceNaira: "",
    description: "",
    contactPhone: "",
    propertyType: "Apartment",
    yearBuilt: "",
    features: [],
    status: "active",
    bookings: 0, // Added bookings field
    commission: 5, // Default commission rate for affiliates (in percentage)
    blockedDates: [], // Adding blocked dates field
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  // Set form data when editing
  useEffect(() => {
    if (formMode === "edit" && currentProperty) {
      setFormData({
        ...currentProperty,
        images:
          currentProperty.images?.length > 0
            ? [...currentProperty.images]
            : [""],
        blockedDates: currentProperty.blockedDates || [], // Initialize with existing blocked dates or empty array
      });
    } else {
      setFormData(initialFormData);
    }
  }, [formMode, currentProperty]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle image URL changes
  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  // Add new image field
  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  // Remove image field
  const removeImageField = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Validate the form before submitting
  const validateForm = () => {
    const errors = {};

    // Required fields validation
    if (!formData.title) errors.title = "Title is required";
    if (!formData.location) errors.location = "Location is required";
    if (!formData.beds) errors.beds = "Number of bedrooms is required";
    if (!formData.baths) errors.baths = "Number of bathrooms is required";
    if (!formData.sqft) errors.sqft = "Square footage is required";
    if (!formData.priceNaira) errors.priceNaira = "Price is required";

    // Validate numeric fields
    if (formData.beds && isNaN(formData.beds))
      errors.beds = "Must be a valid number";
    if (formData.baths && isNaN(formData.baths))
      errors.baths = "Must be a valid number";
    if (formData.sqft && isNaN(formData.sqft))
      errors.sqft = "Must be a valid number";
    if (formData.priceNaira && isNaN(formData.priceNaira))
      errors.priceNaira = "Must be a valid number";
    if (
      formData.commission &&
      (isNaN(formData.commission) ||
        formData.commission < 0 ||
        formData.commission > 100)
    ) {
      errors.commission = "Commission must be between 0-100%";
    }

    // Validate at least one valid image URL
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
      errors.images = "Please provide at least one valid image URL";
    }

    // Validate blocked dates
    if (formData.blockedDates && formData.blockedDates.length > 0) {
      formData.blockedDates.forEach((dateRange, index) => {
        if (dateRange.startDate && dateRange.endDate) {
          if (new Date(dateRange.startDate) > new Date(dateRange.endDate)) {
            if (!errors.blockedDates) errors.blockedDates = [];
            errors.blockedDates[index] = "End date must be after start date";
          }
        }
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare property data for submission
    const propertyData = {
      ...formData,
      id: formMode === "add" ? Date.now().toString() : currentProperty.id,
      images: formData.images.filter((url) => !!url),
      beds: Number(formData.beds),
      baths: Number(formData.baths),
      sqft: Number(formData.sqft),
      priceNaira: Number(formData.priceNaira),
      commission: Number(formData.commission),
      bookings: Number(formData.bookings || 0),
      blockedDates: formData.blockedDates || [],
      createdAt:
        formMode === "add"
          ? new Date().toISOString()
          : currentProperty.createdAt,
      updatedAt: new Date().toISOString(),
    };

    // Call the parent's save handler
    onSave(propertyData);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          {formMode === "add" ? "Add New Property" : "Edit Property"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formTitle">
                <Form.Label>Property Title *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. 2 Bedroom Apartment in Lekki"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.title}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formLocation">
                <Form.Label>Location *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Lekki Phase 1, Lagos"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.location}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.location}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formType">
                <Form.Label>Property Type</Form.Label>
                <Form.Select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Land">Land</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Office">Office</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formAvailability">
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
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              <Form.Group className="mb-3" controlId="formBeds">
                <Form.Label>Bedrooms *</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Number of beds"
                  name="beds"
                  value={formData.beds}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.beds}
                  min="0"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.beds}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3" controlId="formBaths">
                <Form.Label>Bathrooms *</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Number of baths"
                  name="baths"
                  value={formData.baths}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.baths}
                  min="0"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.baths}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3" controlId="formSqft">
                <Form.Label>Square Feet *</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Area in sqft"
                  name="sqft"
                  value={formData.sqft}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.sqft}
                  min="0"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.sqft}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3" controlId="formPrice">
                <Form.Label>Price (₦) *</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Price in Naira"
                  name="priceNaira"
                  value={formData.priceNaira}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.priceNaira}
                  min="0"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.priceNaira}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* New Affiliate and Booking Fields */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formCommission">
                <Form.Label>Affiliate Commission (%)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Commission rate for affiliates"
                  name="commission"
                  value={formData.commission}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.commission}
                  min="0"
                  max="100"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.commission}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  This is the percentage paid to affiliates who refer clients
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formBookings">
                <Form.Label>Current Bookings</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Number of bookings"
                  name="bookings"
                  value={formData.bookings || 0}
                  onChange={handleInputChange}
                  min="0"
                  disabled={formMode === "add"}
                />
                <Form.Text className="text-muted">
                  {formMode === "add"
                    ? "Bookings will be tracked automatically"
                    : "Number of client bookings for this property"}
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Detailed description of the property"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formContact">
            <Form.Label>Contact Phone</Form.Label>
            <Form.Control
              type="tel"
              placeholder="e.g. +234 123 456 7890"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formImages">
            <Form.Label>Property Images *</Form.Label>
            {formData.images.map((url, index) => (
              <InputGroup className="mb-2" key={index}>
                <Form.Control
                  type="url"
                  placeholder="Enter image URL"
                  value={url}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  isInvalid={!!formErrors.images && index === 0}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => removeImageField(index)}
                  disabled={formData.images.length === 1}
                >
                  <FaTimes />
                </Button>
              </InputGroup>
            ))}
            {formErrors.images && (
              <div className="text-danger small mb-2">{formErrors.images}</div>
            )}
            <Button
              variant="outline-secondary"
              onClick={addImageField}
              className="mt-2"
              size="sm"
            >
              <FaPlus /> Add Another Image
            </Button>
          </Form.Group>

          {/* Blocked Dates Section */}
          <Form.Group className="mb-4">
            <Form.Label>
              <strong>Blocked Dates</strong>
              <small className="ms-2 text-muted">
                (Periods when the property is unavailable for booking)
              </small>
            </Form.Label>

            {formData.blockedDates?.map((dateRange, index) => (
              <Row key={index} className="mb-2 align-items-center">
                <Col xs={12} md={4}>
                  <Form.Group>
                    <Form.Label className="small">Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => {
                        const updatedBlockedDates = [...formData.blockedDates];
                        updatedBlockedDates[index].startDate = e.target.value;
                        setFormData({
                          ...formData,
                          blockedDates: updatedBlockedDates,
                        });
                      }}
                      isInvalid={
                        formErrors.blockedDates &&
                        formErrors.blockedDates[index]
                      }
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={4}>
                  <Form.Group>
                    <Form.Label className="small">End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => {
                        const updatedBlockedDates = [...formData.blockedDates];
                        updatedBlockedDates[index].endDate = e.target.value;
                        setFormData({
                          ...formData,
                          blockedDates: updatedBlockedDates,
                        });
                      }}
                      isInvalid={
                        formErrors.blockedDates &&
                        formErrors.blockedDates[index]
                      }
                    />
                    {formErrors.blockedDates &&
                      formErrors.blockedDates[index] && (
                        <Form.Control.Feedback type="invalid">
                          {formErrors.blockedDates[index]}
                        </Form.Control.Feedback>
                      )}
                  </Form.Group>
                </Col>

                <Col xs={12} md={3}>
                  <Form.Group>
                    <Form.Label className="small">Reason (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. Maintenance"
                      value={dateRange.reason || ""}
                      onChange={(e) => {
                        const updatedBlockedDates = [...formData.blockedDates];
                        updatedBlockedDates[index].reason = e.target.value;
                        setFormData({
                          ...formData,
                          blockedDates: updatedBlockedDates,
                        });
                      }}
                    />
                  </Form.Group>
                </Col>

                <Col
                  xs={12}
                  md={1}
                  className="d-flex align-items-end justify-content-end mt-2 mt-md-0"
                >
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      const updatedBlockedDates = [...formData.blockedDates];
                      updatedBlockedDates.splice(index, 1);
                      setFormData({
                        ...formData,
                        blockedDates: updatedBlockedDates,
                      });
                    }}
                  >
                    <FaTimes />
                  </Button>
                </Col>
              </Row>
            ))}

            <Button
              variant="outline-primary"
              size="sm"
              className="mt-2"
              onClick={() => {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                const todayStr = today.toISOString().split("T")[0];
                const tomorrowStr = tomorrow.toISOString().split("T")[0];

                setFormData({
                  ...formData,
                  blockedDates: [
                    ...(formData.blockedDates || []),
                    {
                      startDate: todayStr,
                      endDate: tomorrowStr,
                      reason: "",
                    },
                  ],
                });
              }}
            >
              <FaPlus className="me-1" /> Add Blocked Date Range
            </Button>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              <FaTimes /> Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              style={{
                backgroundColor: theme.colors?.primary || "#007bff",
                border: "none",
              }}
            >
              <FaSave /> {formMode === "add" ? "Add Property" : "Save Changes"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PropertyForm;
