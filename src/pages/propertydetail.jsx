import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  FaBed, FaMapMarkerAlt, FaHeart, 
  FaWifi, FaCar, FaUsers, FaMoneyBillWave, 
  FaRegCalendarAlt, FaPhone, FaArrowLeft
} from "react-icons/fa";
import { 
  Container, Row, Col, Button, Badge, Card, 
  Carousel, Modal, Spinner, Form 
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { usePaystackPayment } from 'react-paystack';

// Theme configuration
const theme = {
  colors: {
    primary: "#40E0D0",
    primaryDark: "#20B2AA",
    primaryLight: "rgba(64, 224, 208, 0.1)",
    dark: "#333333",
    light: "#f8f9fa",
    white: "#ffffff",
    gray: "#6c757d",
    grayLight: "#e9ecef",
  },
  borderRadius: {
    sm: "8px",
    md: "16px",
  },
  boxShadow: {
    sm: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
};

// Paystack config
const PAYSTACK_PUBLIC_KEY = "YOUR_PAYSTACK_PUBLIC_KEY";

const PropertyDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [apartmentType, setApartmentType] = useState("");
  const [amount, setAmount] = useState(0);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate number of days between dates
  const getDays = () => {
    if (startDate && endDate) {
      const difference = Math.abs(endDate - startDate);
      return Math.ceil(difference / (1000 * 60 * 60 * 24));
    }
    return 1;
  };

  // Calculate amount based on selection
  useEffect(() => {
    if (apartmentType) {
      const baseAmounts = {
        "3br": 250000,
        "4br": 300000,
        "5br": 350000,
        "5br-party": 500000
      };
      
      const baseAmount = baseAmounts[apartmentType] || 0;
      
      // For non-party rentals, multiply by number of days
      if (apartmentType !== "5br-party") {
        setAmount(baseAmount * getDays());
      } else {
        setAmount(baseAmount);
      }
    } else {
      setAmount(0);
    }
  }, [apartmentType, startDate, endDate]);

  // Configure Paystack
  const config = {
    reference: (new Date()).getTime().toString(),
    email,
    amount: amount * 100, // Convert to kobo
    publicKey: PAYSTACK_PUBLIC_KEY,
    metadata: {
      custom_fields: [
        { display_name: "Full Name", variable_name: "full_name", value: fullName },
        { display_name: "Phone Number", variable_name: "phone_number", value: phone },
        { display_name: "Apartment Type", variable_name: "apartment_type", value: apartmentType },
        { display_name: "Check-in Date", variable_name: "check_in", value: startDate ? startDate.toISOString().split('T')[0] : "" },
        { display_name: "Check-out Date", variable_name: "check_out", value: endDate ? endDate.toISOString().split('T')[0] : "" }
      ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  // Payment handlers
  const onSuccess = (reference) => {
    setIsProcessing(false);
    setShowPaymentModal(false);
    navigate(`/payment-success?ref=${reference.reference}&amount=${amount}&type=${apartmentType}`);
  };

  const onClose = () => {
    setIsProcessing(false);
    alert("Payment cancelled. You can try again when ready.");
  };

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      // Mock data for demo purposes
      const mockData = {
        id: 1,
        title: "COM4TH PLUS LIMITED Luxury Apartments",
        location: "6c Oduduwa Street, GRA IKEJA",
        price: {
          "5bedroom": "350k",
          "4bedroom": "300k",
          "3bedroom": "250k",
          "party5bedroom": "500k"
        },
        description: "COM4TH PLUS LIMITED offers luxury apartments in the heart of GRA IKEJA. Our apartments are perfect for both accommodation and small parties or get-togethers. We have 3, 4, and 5-bedroom options available to meet your needs.",
        bedrooms: "3-5",
        contactPhone: "0814 318 3494",
        availability: "Available Now",
        type: "Luxury Apartment",
        amenities: [
          { icon: <FaWifi />, name: "High-speed WiFi" },
          { icon: <FaCar />, name: "Free parking" },
          { icon: <FaUsers />, name: "Party space (max 30 guests)" },
          { icon: <FaMoneyBillWave />, name: "Refundable caution fee of 100k" },
        ],
        images: [
          "appartment1.jpg",
          "appartment6.jpeg",
          "appartment10.jpeg",
          "appartment12.jpeg",
        ],
        rules: [
          "Maximum number of guests is strictly 30 people for parties",
          "No large cooking is allowed for any get together or party at the apartment",
          "Refundable caution fee of 100k in all categories",
          "Check-in: After 2:00 PM",
          "Checkout: 12:00 PM",
        ],
      };

      setTimeout(() => {
        setProperty(mockData);
      }, 1000);
    };

    fetchProperty();
  }, [id]);

  // Handler functions
  const handleReserveNow = () => {
    if (!apartmentType) {
      alert("Please select an apartment type");
      return;
    }
    
    if (!startDate || !endDate) {
      alert("Please select check-in and check-out dates");
      return;
    }
    
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !fullName || !phone) {
      alert("Please fill in all required fields");
      return;
    }
    
    setIsProcessing(true);
    initializePayment(onSuccess, onClose);
  };

  // Loading state
  if (!property) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="text-center">
          <Spinner animation="border" role="status" style={{ color: theme.colors.primary, width: "3rem", height: "3rem" }} />
          <p className="mt-3" style={{ color: theme.colors.gray }}>Loading property details...</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      {/* Back button */}
      <Container className="py-3">
        <Link to="/" className="text-decoration-none">
          <Button
            variant="light"
            className="rounded-pill mb-4 d-flex align-items-center"
            style={{ boxShadow: theme.boxShadow.sm, border: "none", padding: "0.6rem 1.2rem" }}
          >
            <FaArrowLeft className="me-2" style={{ color: theme.colors.primary }} />
            <span style={{ color: theme.colors.dark }}>Back to Properties</span>
          </Button>
        </Link>
      </Container>

      <Container>
        {/* Image Gallery */}
        <Row className="g-3 mb-4">
          <Col md={6}>
            <div className="position-relative" style={{ cursor: "pointer" }} onClick={() => setShowGalleryModal(true)}>
              <img
                src={property.images[0]}
                alt="Main property view"
                className="img-fluid w-100 h-100 object-fit-cover shadow"
                style={{ borderRadius: theme.borderRadius.md, maxHeight: "600px" }}
              />
              <Badge
                bg="primary"
                className="position-absolute"
                style={{
                  top: "20px",
                  left: "20px",
                  backgroundColor: theme.colors.primaryDark,
                  padding: "8px 12px",
                }}
              >
                PREMIUM
              </Badge>
            </div>
          </Col>
          <Col md={6}>
            <Row className="g-3">
              {property.images.slice(1, 4).map((image, index) => (
                <Col md={6} key={index}>
                  <div className="position-relative" style={{ cursor: "pointer" }} onClick={() => {
                    setActiveImage(index + 1);
                    setShowGalleryModal(true);
                  }}>
                    <img
                      src={image}
                      alt={`Property view ${index + 2}`}
                      className="img-fluid w-100 h-100 object-fit-cover shadow"
                      style={{ borderRadius: theme.borderRadius.md, maxHeight: "295px" }}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Gallery Modal */}
      <Modal show={showGalleryModal} onHide={() => setShowGalleryModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ border: "none" }}>
          <Modal.Title style={{ color: theme.colors.primaryDark }}>Property Gallery</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Carousel activeIndex={activeImage} onSelect={setActiveImage} interval={null}>
            {property.images.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  src={image}
                  alt={`Property view ${index + 1}`}
                  className="d-block w-100"
                  style={{ maxHeight: "80vh", objectFit: "contain" }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
      </Modal>

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => !isProcessing && setShowPaymentModal(false)} centered backdrop="static">
        <Modal.Header closeButton={!isProcessing}>
          <Modal.Title style={{ color: theme.colors.primaryDark }}>Complete Your Reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePaymentSubmit}>
            {/* Reservation Summary */}
            <div className="mb-4 p-3 rounded" style={{ backgroundColor: theme.colors.primaryLight }}>
              <h5 className="mb-3 fw-bold">Reservation Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Property:</span>
                <span className="fw-bold">{property.title}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Type:</span>
                <span className="fw-bold">
                  {apartmentType === "3br" ? "3 Bedroom" : 
                   apartmentType === "4br" ? "4 Bedroom" : 
                   apartmentType === "5br" ? "5 Bedroom" : 
                   apartmentType === "5br-party" ? "5 Bedroom (Party)" : ""}
                </span>
              </div>
              {startDate && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Check-in:</span>
                  <span className="fw-bold">{startDate.toLocaleDateString()}</span>
                </div>
              )}
              {endDate && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Check-out:</span>
                  <span className="fw-bold">{endDate.toLocaleDateString()}</span>
                </div>
              )}
              <div className="d-flex justify-content-between mt-3">
                <span className="fw-bold">Total Amount:</span>
                <span className="fw-bold">₦{amount.toLocaleString()}</span>
              </div>
              {apartmentType === "5br-party" && (
                <div className="d-flex justify-content-between mt-2">
                  <span className="fw-bold text-danger">Caution Fee:</span>
                  <span className="fw-bold text-danger">₦100,000 (To be paid at arrival)</span>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <h5 className="mb-3 fw-bold" style={{ color: theme.colors.primaryDark }}>Contact Information</h5>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isProcessing}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isProcessing}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={isProcessing}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mb-3 p-3 fw-bold"
              disabled={isProcessing}
              style={{
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.primary,
                borderRadius: theme.borderRadius.sm,
              }}
            >
              {isProcessing ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Processing...
                </>
              ) : (
                `Pay ₦${amount.toLocaleString()} Now`
              )}
            </Button>
            <p className="text-center text-muted small mb-0">Secure payment powered by Paystack</p>
          </Form>
        </Modal.Body>
      </Modal>

      <Container className="py-4">
        <Row>
          <Col lg={8}>
            {/* Property Header */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="d-inline-block px-3 py-2 rounded-pill mb-3" style={{ background: theme.colors.primaryLight, color: theme.colors.primary }}>
                    <span className="fw-semibold">{property.type.toUpperCase()}</span>
                  </div>
                  <h1 className="mb-2 fw-bold" style={{ color: theme.colors.dark }}>{property.title}</h1>
                  <p className="text-muted d-flex align-items-center">
                    <FaMapMarkerAlt className="me-2" style={{ color: theme.colors.primary }}/>
                    {property.location}
                  </p>
                </div>
                <Button
                  variant={isFavorite ? "danger" : "outline-danger"}
                  className="rounded-circle p-2"
                  style={{ 
                    backgroundColor: isFavorite ? theme.colors.primary : "white",
                    borderColor: theme.colors.primary,
                    width: "45px",
                    height: "45px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: theme.boxShadow.sm,
                    border: "none"
                  }}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <FaHeart size={22} color={isFavorite ? "white" : theme.colors.primary} />
                </Button>
              </div>
            </div>
            
            {/* Key Details */}
            <div className="d-flex flex-wrap gap-4 mb-4 p-3 rounded" style={{ backgroundColor: theme.colors.primaryLight }}>
              <div className="d-flex align-items-center">
                <FaBed className="me-2" style={{ color: theme.colors.primary }} size={20} />
                <span>{property.bedrooms} Bedrooms</span>
              </div>
              <div className="d-flex align-items-center">
                <FaRegCalendarAlt className="me-2" style={{ color: theme.colors.primary }} size={18} />
                <span>{property.availability}</span>
              </div>
              <div className="d-flex align-items-center">
                <FaPhone className="me-2" style={{ color: theme.colors.primary }} size={18} />
                <span>{property.contactPhone}</span>
              </div>
            </div>
            
            {/* Description Card */}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: theme.borderRadius.md }}>
              <div className="position-absolute" style={{ 
                top: 0, left: 0, right: 0, height: "6px", 
                background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                borderRadius: `${theme.borderRadius.md} ${theme.borderRadius.md} 0 0`
              }} />
              <Card.Body className="p-4">
                <h4 className="mb-3 fw-bold" style={{ color: theme.colors.primaryDark }}>About this place</h4>
                <p className="text-muted" style={{ lineHeight: "1.7" }}>{property.description}</p>
              </Card.Body>
            </Card>
            
            {/* Pricing Options Card */}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: theme.borderRadius.md }}>
              <div className="position-absolute" style={{ 
                top: 0, left: 0, right: 0, height: "6px", 
                background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                borderRadius: `${theme.borderRadius.md} ${theme.borderRadius.md} 0 0`
              }} />
              <Card.Body className="p-4">
                <h4 className="mb-3 fw-bold" style={{ color: theme.colors.primaryDark }}>Pricing Options</h4>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="p-3 rounded h-100" style={{ backgroundColor: theme.colors.primaryLight }}>
                      <h5 className="fw-bold mb-3">Accommodation</h5>
                      <ul className="list-unstyled mb-0">
                        <li className="mb-2 d-flex justify-content-between">
                          <span>5 Bedrooms:</span> 
                          <span className="fw-bold">₦350,000</span>
                        </li>
                        <li className="mb-2 d-flex justify-content-between">
                          <span>4 Bedrooms:</span> 
                          <span className="fw-bold">₦300,000</span>
                        </li>
                        <li className="d-flex justify-content-between">
                          <span>3 Bedrooms:</span> 
                          <span className="fw-bold">₦250,000</span>
                        </li>
                      </ul>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="p-3 rounded h-100" style={{ backgroundColor: theme.colors.grayLight }}>
                      <h5 className="fw-bold mb-3">Get Together/Party</h5>
                      <ul className="list-unstyled mb-0">
                        <li className="mb-2 d-flex justify-content-between">
                          <span>5 Bedrooms:</span> 
                          <span className="fw-bold">₦500,000</span>
                        </li>
                        <li className="mb-2">
                          <span className="fw-bold text-danger">Note:</span> Maximum 30 guests allowed
                        </li>
                        <li>
                          <span className="fw-bold">Caution Fee:</span> ₦100,000 (Refundable)
                        </li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            
            {/* Amenities Card */}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: theme.borderRadius.md }}>
              <div className="position-absolute" style={{ 
                top: 0, left: 0, right: 0, height: "6px", 
                background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                borderRadius: `${theme.borderRadius.md} ${theme.borderRadius.md} 0 0`
              }} />
              <Card.Body className="p-4">
                <h4 className="mb-3 fw-bold" style={{ color: theme.colors.primaryDark }}>What this place offers</h4>
                <Row className="g-3">
                  {property.amenities.map((amenity, index) => (
                    <Col md={6} key={index}>
                      <div className="d-flex align-items-center p-3 rounded"
                        style={{ backgroundColor: index % 2 === 0 ? theme.colors.primaryLight : theme.colors.grayLight }}
                      >
                        <span className="me-3" style={{ color: theme.colors.primary }}>{amenity.icon}</span>
                        {amenity.name}
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
            
            {/* House Rules Card */}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: theme.borderRadius.md }}>
              <div className="position-absolute" style={{ 
                top: 0, left: 0, right: 0, height: "6px", 
                background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                borderRadius: `${theme.borderRadius.md} ${theme.borderRadius.md} 0 0`
              }} />
              <Card.Body className="p-4">
                <h4 className="mb-3 fw-bold" style={{ color: theme.colors.primaryDark }}>House Rules</h4>
                <ul className="mb-0 ps-3">
                  {property.rules.map((rule, index) => (
                    <li key={index} className="mb-2 text-muted">{rule}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <div style={{ position: "sticky", top: "20px" }}>
              {/* Booking Card */}
              <Card className="shadow border-0 mb-4" style={{ borderRadius: theme.borderRadius.md }}>
                <Card.Body className="p-4">
                  <h4 className="fw-bold mb-4" style={{ color: theme.colors.primaryDark }}>Make a Reservation</h4>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Select Apartment Type</Form.Label>
                    <Form.Select 
                      value={apartmentType}
                      onChange={(e) => setApartmentType(e.target.value)}
                      style={{ padding: "0.75rem", borderRadius: theme.borderRadius.sm }}
                    >
                      <option value="">Choose an option</option>
                      <option value="3br">3 Bedroom</option>
                      <option value="4br">4 Bedroom</option>
                      <option value="5br">5 Bedroom</option>
                      <option value="5br-party">5 Bedroom (Party)</option>
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Check-in</Form.Label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      minDate={new Date()}
                      className="form-control"
                      placeholderText="Select check-in date"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Check-out</Form.Label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate || new Date()}
                      className="form-control"
                      placeholderText="Select check-out date"
                    />
                  </Form.Group>
                  
                  {/* Price breakdown */}
                  <div className="mb-4 p-3 rounded" style={{ backgroundColor: theme.colors.primaryLight }}>
                    <h5 className="fw-bold mb-3">Price Breakdown</h5>
                    
                    {amount > 0 ? (
                      <>
                        <div className="d-flex justify-content-between mb-2">
                          <span>
                            {apartmentType === "3br" ? "3 Bedroom" : 
                             apartmentType === "4br" ? "4 Bedroom" : 
                             apartmentType === "5br" ? "5 Bedroom" : 
                             apartmentType === "5br-party" ? "5 Bedroom (Party)" : ""}
                          </span>
                          <span className="fw-bold">₦{amount.toLocaleString()}</span>
                        </div>
                        
                        {apartmentType !== "5br-party" && (
                          <div className="d-flex justify-content-between text-muted small mb-2">
                            <span>
                              {getDays()} {getDays() === 1 ? 'day' : 'days'}
                              {startDate && endDate && ` (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})`}
                            </span>
                          </div>
                        )}
                        
                        <hr className="my-3" />
                        
                        <div className="d-flex justify-content-between fw-bold">
                          <span>Total</span>
                          <span style={{ color: theme.colors.primaryDark }}>₦{amount.toLocaleString()}</span>
                        </div>
                        
                        {apartmentType === "5br-party" && (
                          <div className="d-flex justify-content-between mt-2 text-danger">
                            <span className="fw-bold">Caution Fee</span>
                            <span className="fw-bold">₦100,000</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-muted mb-0">Select apartment type and dates to see pricing</p>
                    )}
                  </div>
                  
                  <Button
                    variant="primary"
                    className="w-100 py-3 fw-bold"
                    onClick={handleReserveNow}
                    disabled={!apartmentType || !startDate || !endDate}
                    style={{
                      backgroundColor: theme.colors.primary,
                      borderColor: theme.colors.primary,
                      borderRadius: theme.borderRadius.sm,
                    }}
                  >
                    Reserve Now
                  </Button>
                </Card.Body>
              </Card>
              
              {/* Contact Card */}
              <Card className="border-0 shadow-sm" style={{ borderRadius: theme.borderRadius.md }}>
                <Card.Body className="p-4">
                  <h5 className="mb-3 fw-bold">Have questions?</h5>
                  <p className="text-muted mb-3">Contact us directly for quick assistance</p>
                  <Button
                    variant="outline-primary"
                    className="w-100 d-flex align-items-center justify-content-center py-2"
                    href={`tel:${property.contactPhone.replace(/\s/g, '')}`}
                    style={{
                      borderColor: theme.colors.primary,
                      color: theme.colors.primary,
                      borderRadius: theme.borderRadius.sm,
                    }}
                  >
                    <FaPhone className="me-2" />
                    Call {property.contactPhone}
                  </Button>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PropertyDetailPage;