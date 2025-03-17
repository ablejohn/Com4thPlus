import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  Modal,
  Badge,
  Tab,
  Nav,
  Table
} from "react-bootstrap";
import { 
  FaUserPlus, 
  FaLock, 
  FaCalendarAlt, 
  FaBuilding, 
  FaBed, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMoneyBillWave,
  FaShieldAlt,
  FaSearch,
  FaListAlt,
  FaEye,
  FaCheckCircle,
  FaRegClock,
  FaTimes
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useProperties } from "../services/propertyContext";
import { api } from "../../api";
import { usePaystackPayment } from "react-paystack";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

const isDateRangeAvailable = (blockedDates, startDate, endDate) => {
  if (!blockedDates || blockedDates.length === 0) return true;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return !blockedDates.some((range) => {
    const rangeStart = new Date(range.start);
    const rangeEnd = new Date(range.end);
    return start <= rangeEnd && end >= rangeStart;
  });
};

const AdminClientRegistration = () => {
  const { properties, updateProperty, updatePropertyBlockedDates, bookings = [], setBookings } = useProperties();
  
  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    propertyId: "",
    apartmentType: "",
    amount: "",
    paymentStatus: "pending",
    specialRequests: ""
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Booking management states
  const [activeTab, setActiveTab] = useState("register");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Calculate days between check-in and check-out
  const getDays = () => {
    if (startDate && endDate) {
      const difference = Math.abs(endDate - startDate);
      return Math.ceil(difference / (1000 * 60 * 60 * 24));
    }
    return 1;
  };

  // Calculate booking amount based on property and duration
  const calculateAmount = () => {
    const selectedProperty = properties.find(p => p.id === formData.propertyId);
    if (!selectedProperty || !formData.apartmentType) return 0;
    
    let baseAmount = selectedProperty.priceNaira || 0;
    const priceMultipliers = {
      "3br": 1,
      "4br": 1.2,
      "5br": 1.4,
      "5br-party": 2,
    };
    
    baseAmount = baseAmount * (priceMultipliers[formData.apartmentType] || 1);
    return formData.apartmentType === "5br-party" ? baseAmount : baseAmount * getDays();
  };

  // Update amount when relevant fields change
  useEffect(() => {
    if (formData.propertyId && startDate && endDate && formData.apartmentType) {
      const calculatedAmount = calculateAmount();
      setFormData(prev => ({ ...prev, amount: calculatedAmount }));
    }
  }, [formData.propertyId, startDate, endDate, formData.apartmentType]);

  // Form change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "propertyId" && value) {
      const selectedProperty = properties.find(p => p.id === value);
      if (selectedProperty && selectedProperty.apartmentType) {
        setFormData(prev => ({
          ...prev,
          apartmentType: selectedProperty.apartmentType[0] || "",
        }));
      }
    }
  };

  // Paystack configuration
  const config = {
    reference: new Date().getTime().toString(),
    email: formData.email,
    amount: calculateAmount() * 100, // Paystack amount in kobo
    publicKey: PAYSTACK_PUBLIC_KEY,
    metadata: {
      custom_fields: [
        {
          display_name: "Full Name",
          variable_name: "full_name",
          value: formData.fullName,
        },
        {
          display_name: "Phone Number",
          variable_name: "phone_number",
          value: formData.phone,
        },
        {
          display_name: "Apartment Type",
          variable_name: "apartment_type",
          value: formData.apartmentType,
        },
        {
          display_name: "Check-in Date",
          variable_name: "check_in",
          value: startDate ? startDate.toISOString().split("T")[0] : "",
        },
        {
          display_name: "Check-out Date",
          variable_name: "check_out",
          value: endDate ? endDate.toISOString().split("T")[0] : "",
        },
      ],
    },
  };

  const initializePayment = usePaystackPayment(config);

  // Handle successful payment
  const onPaymentSuccess = async (reference) => {
    setIsProcessing(false);
    setShowPaymentModal(false);
    
    const selectedProperty = properties.find(p => p.id === formData.propertyId);
    const bookingId = "BK" + Math.floor(10000 + Math.random() * 90000);
    
    // Block the dates for this property
    const newBlockedDates = [
      ...(selectedProperty.blockedDates || []),
      {
        start: startDate.toISOString().split("T")[0],
        end: endDate.toISOString().split("T")[0],
      },
    ];
    
    const bookingData = {
      id: bookingId,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      propertyId: formData.propertyId,
      propertyTitle: selectedProperty.title,
      apartmentType: formData.apartmentType,
      amount: calculateAmount(),
      paymentStatus: "paid",
      paymentReference: reference.reference,
      checkIn: startDate.toISOString().split("T")[0],
      checkOut: endDate.toISOString().split("T")[0],
      specialRequests: formData.specialRequests || "None"
    };

    try {
      await api.createBooking(bookingData);
      await updateProperty(formData.propertyId, { availability: "Booked" });
      await updatePropertyBlockedDates(formData.propertyId, newBlockedDates);
      
      // If your context provides a way to update bookings
      if (typeof setBookings === 'function') {
        setBookings(prev => [bookingData, ...prev]);
      }
      
      setSuccess("Payment successful and booking confirmed!");
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        propertyId: "",
        apartmentType: "",
        amount: "",
        paymentStatus: "pending",
        specialRequests: ""
      });
      setStartDate(null);
      setEndDate(null);
      setCurrentStep(1);
      
      // Switch to bookings tab after successful registration
      setActiveTab("bookings");
    } catch (err) {
      setError("Payment succeeded but booking failed. Please contact support.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle payment cancellation
  const onPaymentClose = () => {
    setIsProcessing(false);
    setShowPaymentModal(false);
    setError("Payment cancelled. Booking not completed.");
    setIsSubmitting(false);
  };

  // Validate Step 1 (property selection)
  const validateStep1 = () => {
    if (!formData.propertyId) {
      setError("Please select a property");
      return false;
    }
    if (!formData.apartmentType) {
      setError("Please select an apartment type");
      return false;
    }
    if (!startDate || !endDate) {
      setError("Please select both check-in and check-out dates");
      return false;
    }
    
    // Check for date conflicts
    const selectedProperty = properties.find(p => p.id === formData.propertyId);
    if (!isDateRangeAvailable(selectedProperty.blockedDates, startDate, endDate)) {
      setError("Selected dates conflict with existing bookings");
      return false;
    }
    
    setError("");
    return true;
  };

  // Validate Step 2 (client information)
  const validateStep2 = () => {
    if (!formData.fullName) {
      setError("Please enter client's full name");
      return false;
    }
    if (!formData.email) {
      setError("Please enter client's email address");
      return false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    if (!formData.phone) {
      setError("Please enter client's phone number");
      return false;
    }
    
    setError("");
    return true;
  };

  // Move to next step
  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  // Move to previous step
  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError("");
  };

  // Handle "Reserve Now" button click
  const handleReserveNow = () => {
    const selectedProperty = properties.find(p => p.id === formData.propertyId);
    
    if (selectedProperty.availability !== "Available Now") {
      setError("This property is not available for booking");
      return;
    }
    
    setShowPaymentModal(true);
  };

  // Handle payment form submission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setIsSubmitting(true);
    initializePayment(onPaymentSuccess, onPaymentClose);
  };

  // Create a manual booking without payment (record as pending)
  const handleManualBooking = async () => {
    if (!validateStep1() || !validateStep2()) {
      setCurrentStep(1);
      return;
    }
    
    const selectedProperty = properties.find(p => p.id === formData.propertyId);
    const bookingId = "BK" + Math.floor(10000 + Math.random() * 90000);
    
    // Block the dates for this property
    const newBlockedDates = [
      ...(selectedProperty.blockedDates || []),
      {
        start: startDate.toISOString().split("T")[0],
        end: endDate.toISOString().split("T")[0],
      },
    ];
    
    const bookingData = {
      id: bookingId,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      propertyId: formData.propertyId,
      propertyTitle: selectedProperty.title,
      apartmentType: formData.apartmentType,
      checkIn: startDate.toISOString().split("T")[0],
      checkOut: endDate.toISOString().split("T")[0],
      amount: calculateAmount(),
      paymentStatus: "pending",
      specialRequests: formData.specialRequests || "None",
      createdAt: new Date().toISOString()
    };
    
    try {
      await api.createBooking(bookingData);
      await updatePropertyBlockedDates(formData.propertyId, newBlockedDates);
      
      // If your context provides a way to update bookings
      if (typeof setBookings === 'function') {
        setBookings(prev => [bookingData, ...prev]);
      }
      
      setSuccess("Booking created successfully with pending payment status");
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        propertyId: "",
        apartmentType: "",
        amount: "",
        paymentStatus: "pending",
        specialRequests: ""
      });
      setStartDate(null);
      setEndDate(null);
      setCurrentStep(1);
      
      // Switch to bookings tab
      setActiveTab("bookings");
    } catch (err) {
      setError("Failed to create booking. Please try again.");
      console.error(err);
    }
  };
  
  // Handle view booking details
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  // Filter bookings based on search term
  const filteredBookings = searchTerm 
    ? bookings.filter(booking => 
        booking.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.propertyTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : bookings;

  // Available properties for booking
  const availableProperties = properties.filter(p => p.availability === "Available Now");
  
  // Helper function to get apartment type name
  const getApartmentTypeName = (type) => {
    switch(type) {
      case "3br": return "3 Bedroom";
      case "4br": return "4 Bedroom";
      case "5br": return "5 Bedroom";
      case "5br-party": return "5 Bedroom (Party)";
      default: return "Unknown";
    }
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="step-header mb-4">
              <h5 className="text-primary">Step 1: Select Property & Dates</h5>
              <p className="text-muted">Choose available property and booking dates</p>
            </div>
            
            <Form.Group className="mb-3">
              <Form.Label>
                <FaBuilding className="me-2 text-primary" />
                Select Property
              </Form.Label>
              <Form.Select
                name="propertyId"
                value={formData.propertyId}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="border-0 shadow-sm"
                style={{ padding: "0.7rem", borderRadius: "8px" }}
              >
                <option value="">-- Select Property --</option>
                {availableProperties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.title} - {property.location}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <FaBed className="me-2 text-primary" />
                Apartment Type
              </Form.Label>
              <Form.Select
                name="apartmentType"
                value={formData.apartmentType}
                onChange={handleChange}
                required
                disabled={isSubmitting || !formData.propertyId}
                className="border-0 shadow-sm"
                style={{ padding: "0.7rem", borderRadius: "8px" }}
              >
                <option value="">-- Select Type --</option>
                {formData.propertyId && (
                  <>
                    <option value="3br">3 Bedroom</option>
                    <option value="4br">4 Bedroom</option>
                    <option value="5br">5 Bedroom</option>
                    <option value="5br-party">5 Bedroom (Party)</option>
                  </>
                )}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaCalendarAlt className="me-2 text-primary" />
                    Check-in Date
                  </Form.Label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select check-in date"
                    className="form-control border-0 shadow-sm"
                    style={{ padding: "0.7rem", borderRadius: "8px" }}
                    disabled={isSubmitting}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaCalendarAlt className="me-2 text-primary" />
                    Check-out Date
                  </Form.Label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate || new Date()}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select check-out date"
                    className="form-control border-0 shadow-sm"
                    style={{ padding: "0.7rem", borderRadius: "8px" }}
                    disabled={isSubmitting}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            {formData.propertyId && startDate && endDate && (
              <div className="alert alert-info d-flex align-items-center mt-3">
                <FaCalendarAlt className="me-2" />
                <div>
                  <strong>Duration:</strong> {getDays()} {getDays() === 1 ? 'day' : 'days'}
                </div>
              </div>
            )}
          </>
        );
      
      case 2:
        return (
          <>
            <div className="step-header mb-4">
              <h5 className="text-primary">Step 2: Client Information</h5>
              <p className="text-muted">Enter client details for the booking</p>
            </div>
            
            <Form.Group className="mb-3">
              <Form.Label>
                <FaUser className="me-2 text-primary" />
                Full Name
              </Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter client's full name"
                required
                disabled={isSubmitting}
                className="border-0 shadow-sm"
                style={{ padding: "0.7rem", borderRadius: "8px" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <FaEnvelope className="me-2 text-primary" />
                Email Address
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter client's email"
                required
                disabled={isSubmitting}
                className="border-0 shadow-sm"
                style={{ padding: "0.7rem", borderRadius: "8px" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <FaPhone className="me-2 text-primary" />
                Phone Number
              </Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter client's phone number"
                required
                disabled={isSubmitting}
                className="border-0 shadow-sm"
                style={{ padding: "0.7rem", borderRadius: "8px" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Special Requests (Optional)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="Any special requests or notes for this booking"
                disabled={isSubmitting}
                className="border-0 shadow-sm"
                style={{ borderRadius: "8px" }}
              />
            </Form.Group>
          </>
        );
      
      case 3:
        return (
          <>
            <div className="step-header mb-4">
              <h5 className="text-primary">Step 3: Review & Payment</h5>
              <p className="text-muted">Review booking details and proceed to payment</p>
            </div>
            
            <div className="booking-summary p-3 mb-4 rounded" style={{ backgroundColor: "#f8f9fa" }}>
              <h6 className="mb-3 fw-bold d-flex align-items-center">
                <FaBuilding className="me-2 text-primary" /> Property Details
              </h6>
              <Row className="mb-3">
                <Col sm={6}>
                  <p className="mb-2">
                    <strong>Property:</strong><br />
                    {properties.find(p => p.id === formData.propertyId)?.title}
                  </p>
                </Col>
                <Col sm={6}>
                  <p className="mb-2">
                    <strong>Type:</strong><br />
                    {getApartmentTypeName(formData.apartmentType)}
                  </p>
                </Col>
              </Row>
              
              <h6 className="mb-3 fw-bold d-flex align-items-center">
                <FaUser className="me-2 text-primary" /> Client Information
              </h6>
              <Row className="mb-3">
                <Col sm={6}>
                  <p className="mb-2"><strong>Name:</strong><br />{formData.fullName}</p>
                </Col>
                <Col sm={6}>
                  <p className="mb-2"><strong>Phone:</strong><br />{formData.phone}</p>
                </Col>
              </Row>
              <p className="mb-3"><strong>Email:</strong><br />{formData.email}</p>
              
              <h6 className="mb-3 fw-bold d-flex align-items-center">
                <FaCalendarAlt className="me-2 text-primary" /> Booking Dates
              </h6>
              <Row className="mb-3">
                <Col sm={6}>
                  <p className="mb-2">
                    <strong>Check-in:</strong><br />
                    {startDate?.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </Col>
                <Col sm={6}>
                  <p className="mb-2">
                    <strong>Check-out:</strong><br />
                    {endDate?.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </Col>
              </Row>
              <p className="mb-2"><strong>Duration:</strong> {getDays()} {getDays() === 1 ? 'day' : 'days'}</p>
              
              <h6 className="mb-3 fw-bold d-flex align-items-center mt-3">
                <FaMoneyBillWave className="me-2 text-primary" /> Payment Details
              </h6>
              <p className="mb-2 fs-5 fw-bold text-primary">
                Total Amount: ₦{calculateAmount().toLocaleString()}
              </p>
              
              {formData.apartmentType === "5br-party" && (
                <div className="alert alert-warning d-flex align-items-center mt-3 mb-0">
                  <FaShieldAlt className="me-2" />
                  <div>
                    <strong>Caution Fee Required:</strong> ₦100,000 (To be paid at arrival)
                  </div>
                </div>
              )}
            </div>
            
            {formData.specialRequests && (
              <div className="mb-4">
                <h6 className="fw-bold">Special Requests:</h6>
                <p className="mb-0">{formData.specialRequests}</p>
              </div>
            )}
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h3 className="mb-0 fw-bold">Booking Management</h3>
          <p className="text-muted">Create and manage client bookings</p>
        </Col>
      </Row>
      
      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Row>
          <Col>
            <Nav variant="tabs" className="mb-4">
              <Nav.Item>
                <Nav.Link 
                  eventKey="register" 
                  className="d-flex align-items-center"
                >
                  <FaUserPlus className="me-2" /> New Booking
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  eventKey="bookings" 
                  className="d-flex align-items-center"
                >
                  <FaListAlt className="me-2" /> All Bookings
                  <Badge bg="primary" pill className="ms-2">
                    {bookings.length}
                  </Badge>
                </Nav.Link>
              </Nav.Item>
            </Nav>
            
            {error && (
              <Alert
                variant="danger"
                onClose={() => setError("")}
                dismissible
                className="mb-4"
                style={{ borderRadius: "8px", border: "none" }}
              >
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert
                variant="success"
                onClose={() => setSuccess("")}
                dismissible
                className="mb-4"
                style={{ borderRadius: "8px", border: "none" }}
              >
                {success}
              </Alert>
            )}
            
            <Tab.Content>
              <Tab.Pane eventKey="register">
                <Card className="border-0 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden" }}>
                  <Card.Header className="bg-primary text-white py-3" style={{ border: "none" }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="mb-0">
                        <FaUserPlus className="me-2" /> Client Registration
                      </h4>
                      <Badge bg="light" text="dark" pill>New Booking</Badge>
                    </div>
                  </Card.Header>
                  
                  <Card.Body className="p-4">
                    {/* Progress bar for steps */}
                    <div className="steps-progress mb-4">
                      <div className="d-flex justify-content-between position-relative mb-1">
                        {[1, 2, 3].map((step) => (
                          <div 
                            key={step} 
                            className={`step-circle ${currentStep >= step ? 'active' : ''}`}
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: currentStep >= step ? "#007bff" : "#e9ecef",
                              color: currentStep >= step ? "white" : "#6c757d",
                              zIndex: 2,
                              cursor: currentStep > step ? "pointer" : "default"
                            }}
                            onClick={() => currentStep > step && setCurrentStep(step)}
                          >
                            {step}
                          </div>
                        ))}
                        <div 
                          className="step-line position-absolute"
                          style={{
                            height: "2px",
                            background: "#e9ecef",
                            top: "15px",
                            left: "15px",
                            right: "15px",
                            zIndex: 1
                          }}
                        ></div>
                        <div 
                          className="step-line-progress position-absolute"
                          style={{
                            height: "2px",
                            background: "#007bff",
                            top: "15px",
                            left: "15px",
                            width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
                            zIndex: 1,
                            transition: "width 0.3s ease"
                          }}
                        ></div>
                      </div>
                      <div className="d-flex justify-content-between text-center">
                        <div style={{ width: "80px" }}>Property</div>
                        <div style={{ width: "80px" }}>Details</div>
                        <div style={{ width: "80px" }}>Payment</div>
                      </div>
                    </div>
                    
                    <Form>
                      {renderStepContent()}
                      
                      <div className="d-flex justify-content-between mt-4">
                        {currentStep > 1 && (
                          <Button
                            variant="light"
                            onClick={handleBack}
                            disabled={isSubmitting}
                            className="px-4 shadow-sm"
                            style={{ borderRadius: "8px" }}
                          >
                            Back
                          </Button>
                        )}
                        
                        <div className="ms-auto">
                          {currentStep < 3 ? (
                            <Button
                              variant="primary"
                              onClick={handleNext}
                              disabled={isSubmitting}
                              className="px-4 shadow-sm"
                              style={{ borderRadius: "8px" }}
                            >
                              Next
                            </Button>
                          ) : (
                            <div className="d-flex gap-2">
                              <Button
                                variant="secondary"
                                onClick={handleManualBooking}
                                disabled={isSubmitting}
                                className="px-4 shadow-sm"
                                style={{ borderRadius: "8px" }}
                              >
                                Create Pending Booking
                              </Button>
                              <Button
                                variant="success"
                                onClick={handleReserveNow}
                                disabled={isSubmitting}
                                className="px-4 shadow-sm"
                                style={{ borderRadius: "8px" }}
                              >
                                <FaLock className="me-2" /> Proceed to Payment
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              
              <Tab.Pane eventKey="bookings">
                <Card className="border-0 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden" }}>
                  <Card.Header className="bg-light py-3" style={{ border: "none" }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 fw-bold">
                        <FaListAlt className="me-2 text-primary" /> All Bookings
                      </h5>
                      <div className="position-relative">
                        <Form.Control
                          type="search"
                          placeholder="Search by name, property or ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="border-0 shadow-sm"
                          style={{ borderRadius: "50px", paddingLeft: "2.5rem", width: "300px" }}
                        />
                        <FaSearch style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#6c757d" }} />
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <div className="table-responsive">
                      <Table hover className="mb-0">
                        <thead style={{ backgroundColor: "#f8f9fa" }}>
                          <tr>
                            <th className="ps-4">ID</th>
                            <th>Client</th>
                            <th>Property</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Amount</th>
                            <th className="text-center">Status</th>
                            <th className="text-end pe-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredBookings.length > 0 ? (
                            filteredBookings.map((booking) => (
                              <tr key={booking.id}>
                                <td className="ps-4 fw-medium">{booking.id}</td>
                                <td>{booking.fullName}</td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <span>{booking.propertyTitle}</span>
                                    <Badge 
                                      bg="light" 
                                      text="dark" 
                                      className="ms-2" 
                                      style={{ fontSize: "0.65rem" }}
                                    >
                                      {booking.apartmentType === "3br" ? "3BR" :
                                       booking.apartmentType === "4br" ? "4BR" :
                                       booking.apartmentType === "5br" ? "5BR" :
                                       "5BR Party"}
                                    </Badge>
                                  </div>
                                </td>
                                <td>
                                  {new Date(booking.checkIn).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric"
                                  })}
                                </td>
                                <td>
                                  {new Date(booking.checkOut).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric"
                                  })}
                                </td>
                                <td>₦{booking.amount.toLocaleString()}</td>
                                <td className="text-center">
                                  {booking.paymentStatus === "paid" ? (
                                    <Badge bg="success" pill className="px-3 py-2">
                                      <FaCheckCircle className="me-1" /> Paid
                                    </Badge>
                                  ) : (
                                    <Badge bg="warning" text="dark" pill className="px-3 py-2">
                                      <FaRegClock className="me-1" /> Pending
                                    </Badge>
                                  )}
                                </td>
                                <td className="text-end pe-4">
                                  <Button 
                                    variant="light" 
                                    size="sm" 
                                    className="me-1" 
                                    title="View details"
                                    onClick={() => handleViewBooking(booking)}
                                  >
                                    <FaEye />
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="text-center py-4 text-muted">
                                {searchTerm ? "No bookings found matching your search." : "No bookings found. Create a new booking to get started."}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

      {/* Payment Modal */}
      <Modal
        show={showPaymentModal}
        onHide={() => !isProcessing && setShowPaymentModal(false)}
        centered
        backdrop="static"
        size="md"
      >
        <Modal.Header
          className="bg-primary text-white"
          closeButton={!isProcessing}
          style={{ border: "none" }}
        >
          <Modal.Title>
            <FaLock className="me-2" /> Complete Payment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handlePaymentSubmit}>
            <div className="mb-4 p-3 rounded" style={{ backgroundColor: "#f8f9fa" }}>
              <h6 className="mb-3 fw-bold">Booking Summary</h6>
              <p className="mb-2">
                <strong>Property:</strong> {properties.find(p => p.id === formData.propertyId)?.title}
              </p>
              <p className="mb-2">
                <strong>Type:</strong> {getApartmentTypeName(formData.apartmentType)}
              </p>
              <p className="mb-2">
                <strong>Duration:</strong> {getDays()} {getDays() === 1 ? 'day' : 'days'}
              </p>
              <p className="mb-2">
                <strong>Check-in:</strong>{" "}
                {startDate?.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="mb-2">
                <strong>Check-out:</strong>{" "}
                {endDate?.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="mb-0 fs-5 fw-bold text-primary">
                <strong>Total Amount:</strong> ₦{calculateAmount().toLocaleString()}
              </p>
            </div>
            
            <Button
              variant="success"
              type="submit"
              className="w-100 py-3"
              disabled={isProcessing}
              style={{ borderRadius: "8px" }}
            >
              {isProcessing ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    className="me-2"
                  />
                  Processing...
                </>
              ) : (
                <>
                  <FaLock className="me-2" /> Pay ₦{calculateAmount().toLocaleString()} Now
                </>
              )}
            </Button>
            <div className="d-flex align-items-center justify-content-center mt-3">
              <FaShieldAlt className="text-muted me-2" size={14} />
              <p className="text-center text-muted small mb-0">
                Secure payment powered by Paystack
              </p>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      
      {/* Booking Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton style={{ border: "none" }}>
          <Modal.Title>
            <FaEye className="me-2" /> Booking Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedBooking && (
            <div>
              <div className="mb-4 p-3 rounded" style={{ backgroundColor: "#f8f9fa" }}>
                <h6 className="mb-3 fw-bold d-flex align-items-center">
                  <FaBuilding className="me-2 text-primary" /> Property Information
                </h6>
                <Row>
                  <Col md={6}>
                    <p className="mb-2"><strong>Booking ID:</strong> {selectedBooking.id}</p>
                    <p className="mb-2"><strong>Property:</strong> {selectedBooking.propertyTitle}</p>
                    <p className="mb-2"><strong>Apartment Type:</strong> {getApartmentTypeName(selectedBooking.apartmentType)}</p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-2">
                      <strong>Status:</strong>{" "}
                      <Badge bg={selectedBooking.paymentStatus === "paid" ? "success" : "warning"}>
                        {selectedBooking.paymentStatus === "paid" ? "Paid" : "Pending"}
                      </Badge>
                    </p>
                    <p className="mb-2"><strong>Amount:</strong> ₦{selectedBooking.amount.toLocaleString()}</p>
                    {selectedBooking.paymentReference && (
                      <p className="mb-2"><strong>Payment Ref:</strong> {selectedBooking.paymentReference}</p>
                    )}
                  </Col>
                </Row>
              </div>
              
              <div className="mb-4 p-3 rounded" style={{ backgroundColor: "#f8f9fa" }}>
                <h6 className="mb-3 fw-bold d-flex align-items-center">
                  <FaUser className="me-2 text-primary" /> Client Information
                </h6>
                <Row>
                  <Col md={6}>
                    <p className="mb-2"><strong>Name:</strong> {selectedBooking.fullName}</p>
                    <p className="mb-2"><strong>Email:</strong> {selectedBooking.email}</p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-2"><strong>Phone:</strong> {selectedBooking.phone}</p>
                  </Col>
                </Row>
              </div>
              
              <div className="mb-4 p-3 rounded" style={{ backgroundColor: "#f8f9fa" }}>
                <h6 className="mb-3 fw-bold d-flex align-items-center">
                  <FaCalendarAlt className="me-2 text-primary" /> Booking Dates
                </h6>
                <Row>
                  <Col md={6}>
                    <p className="mb-2">
                      <strong>Check-in:</strong>{" "}
                      {new Date(selectedBooking.checkIn).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        weekday: "long"
                      })}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-2">
                      <strong>Check-out:</strong>{" "}
                      {new Date(selectedBooking.checkOut).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        weekday: "long"
                      })}
                    </p>
                  </Col>
                </Row>
              </div>
              
              {selectedBooking.specialRequests && selectedBooking.specialRequests !== "None" && (
                <div className="mb-4 p-3 rounded" style={{ backgroundColor: "#f8f9fa" }}>
                  <h6 className="mb-2 fw-bold">Special Requests</h6>
                  <p className="mb-0">{selectedBooking.specialRequests}</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          {selectedBooking && selectedBooking.paymentStatus === "pending" && (
            <Button variant="success">
              <FaMoneyBillWave className="me-2" /> Collect Payment
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminClientRegistration;