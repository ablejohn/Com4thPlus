import React, { useState, useEffect } from "react"; // Add useEffect
import { Card, Form, Button, Container, Row, Col } from "react-bootstrap";
import { Plus, Image, Trash2, Save, X, Home, Upload } from "lucide-react";
import { propertyService } from "./propertyService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AdminPropertyForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    contactPhone: "",
    pricingOptions: [{ bedrooms: "", price: "", label: "" }],
    bathrooms: "",
    type: "Apartment",
    amenities: [],
    superhost: false,
    size: "",
    availability: "Available Now",
    featuredHighlights: [""],
    partyDetails: {
      maxGuests: "",
      priceRange: "",
      cautionFee: "",
      cookingAllowed: false,
      notes: "",
    },
    images: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [availableNow, setAvailableNow] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in to access this page");
      navigate("/admin/login");
    }
  }, [navigate]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title) errors.title = "Title is required";
    if (!formData.location) errors.location = "Location is required";
    if (!formData.description) errors.description = "Description is required";
    if (formData.images.length === 0)
      errors.images = "At least one image is required";
    return errors;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...previews]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeImage = (index) => {
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newPreviews);
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handlePricingOptionChange = (index, field, value) => {
    const newPricingOptions = [...formData.pricingOptions];
    newPricingOptions[index] = {
      ...newPricingOptions[index],
      [field]: value,
      label:
        field === "bedrooms"
          ? `${value} Bedroom${value !== "1" ? "s" : ""} - ₦${
              newPricingOptions[index].price
            }`
          : field === "price"
          ? `${newPricingOptions[index].bedrooms} Bedroom${
              newPricingOptions[index].bedrooms !== "1" ? "s" : ""
            } - ₦${value}`
          : newPricingOptions[index].label,
    };
    setFormData((prev) => ({
      ...prev,
      pricingOptions: newPricingOptions,
    }));
  };

  const addPricingOption = () => {
    setFormData((prev) => ({
      ...prev,
      pricingOptions: [
        ...prev.pricingOptions,
        { bedrooms: "", price: "", label: "" },
      ],
    }));
  };

  const removePricingOption = (index) => {
    setFormData((prev) => ({
      ...prev,
      pricingOptions: prev.pricingOptions.filter((_, i) => i !== index),
    }));
  };

  const handleFeaturedHighlightChange = (index, value) => {
    const newHighlights = [...formData.featuredHighlights];
    newHighlights[index] = value;
    setFormData((prev) => ({
      ...prev,
      featuredHighlights: newHighlights,
    }));
  };

  const addFeaturedHighlight = () => {
    setFormData((prev) => ({
      ...prev,
      featuredHighlights: [...prev.featuredHighlights, ""],
    }));
  };

  const removeFeaturedHighlight = (index) => {
    setFormData((prev) => ({
      ...prev,
      featuredHighlights: prev.featuredHighlights.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((error) => toast.error(error));
      return;
    }

    const finalData = {
      ...formData,
      availability: availableNow,
    };

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to create a property");
        navigate("/admin/login");
        return;
      }

      setIsLoading(true);
      const result = await propertyService.createProperty(finalData, token);
      toast.success("Property created successfully!");
      navigate("/properties");
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("authToken");
        navigate("/admin/login");
      } else {
        toast.error(error.message || "Failed to create property");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light py-4">
      <Container>
        <Card className="mb-4 shadow-sm">
          <Card.Header className="bg-white border-bottom">
            <div className="d-flex align-items-center gap-2">
              <Home className="h-5 w-5" />
              <h4 className="mb-0">Add New Property</h4>
            </div>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Property Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Description */}
              <Form.Group className="mb-4">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                />
              </Form.Group>

              {/* Images Upload */}
              <Form.Group className="mb-4">
                <Form.Label>Property Images</Form.Label>
                <div className="border border-2 border-dashed rounded p-4 text-center">
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="d-none"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-5 w-5 text-muted" />
                    <p className="mt-2 text-muted small">
                      Click to upload images
                    </p>
                  </label>
                </div>
                {previewImages.length > 0 && (
                  <Row className="g-3 mt-2">
                    {previewImages.map((preview, index) => (
                      <Col key={index} xs={6} md={3}>
                        <div className="position-relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="img-fluid rounded"
                            style={{
                              height: "120px",
                              width: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1 p-1 rounded-circle"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}
              </Form.Group>

              {/* Pricing Options */}
              <Form.Group className="mb-4">
                <Form.Label>Pricing Options</Form.Label>
                {formData.pricingOptions.map((option, index) => (
                  <div
                    key={index}
                    className="d-flex gap-3 mb-3 align-items-center"
                  >
                    <Form.Control
                      type="number"
                      placeholder="Bedrooms"
                      className="w-25"
                      value={option.bedrooms}
                      onChange={(e) =>
                        handlePricingOptionChange(
                          index,
                          "bedrooms",
                          e.target.value
                        )
                      }
                      required
                    />
                    <Form.Control
                      type="number"
                      placeholder="Price (₦)"
                      className="w-25"
                      value={option.price}
                      onChange={(e) =>
                        handlePricingOptionChange(
                          index,
                          "price",
                          e.target.value
                        )
                      }
                      required
                    />
                    {index > 0 && (
                      <Button
                        variant="outline-danger"
                        onClick={() => removePricingOption(index)}
                        className="p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="link"
                  className="p-0 text-primary d-flex align-items-center gap-2"
                  onClick={addPricingOption}
                >
                  <Plus className="h-4 w-4" />
                  Add Pricing Option
                </Button>
              </Form.Group>

              {/* Featured Highlights */}
              <Form.Group className="mb-4">
                <Form.Label>Featured Highlights</Form.Label>
                {formData.featuredHighlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="d-flex gap-3 mb-3 align-items-center"
                  >
                    <Form.Control
                      type="text"
                      value={highlight}
                      onChange={(e) =>
                        handleFeaturedHighlightChange(index, e.target.value)
                      }
                      required
                    />
                    {index > 0 && (
                      <Button
                        variant="outline-danger"
                        onClick={() => removeFeaturedHighlight(index)}
                        className="p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="link"
                  className="p-0 text-primary d-flex align-items-center gap-2"
                  onClick={addFeaturedHighlight}
                >
                  <Plus className="h-4 w-4" />
                  Add Highlight
                </Button>
              </Form.Group>

              {/* Party Details */}
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Maximum Guests</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.partyDetails.maxGuests}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          partyDetails: {
                            ...prev.partyDetails,
                            maxGuests: e.target.value,
                          },
                        }))
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Price Range (₦)</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.partyDetails.priceRange}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          partyDetails: {
                            ...prev.partyDetails,
                            priceRange: e.target.value,
                          },
                        }))
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-4">
                <Form.Label>Availability</Form.Label>
                <Form.Check
                  type="switch"
                  id="available-now-switch"
                  label={availableNow ? "Available Now" : "Not Available"}
                  checked={availableNow}
                  onChange={(e) => {
                    setAvailableNow(e.target.checked);
                    setFormData((prev) => ({
                      ...prev,
                      availability: e.target.checked
                        ? "Available Now"
                        : "Not Available",
                    }));
                  }}
                />
              </Form.Group>

              {/* Submit Buttons */}
              <div className="d-flex justify-content-end gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="d-flex align-items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Property
                    </>
                  )}
                </Button>
                <Link to="/viewallproperties" className="btn btn-primary">
                  View All Properties
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AdminPropertyForm;
