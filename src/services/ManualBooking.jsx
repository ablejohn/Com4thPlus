// ManualBooking.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  ListGroup,
  Badge,
  Spinner,
  Modal,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCheck,
} from "react-icons/fa";
import { usePaystackPayment } from "react-paystack";
import BlockedDatesManager, { checkDateAvailability } from "./BlockedDatesManager";

// Paystack config
const PAYSTACK_PUBLIC_KEY = "YOUR_PAYSTACK_PUBLIC_KEY"; // Replace with your actual key

const ManualBooking = ({
  properties,
  selectedProperty,
  onPropertySelect,
  showMessage,
}) => {
  // Form state
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  ); // 3 days later
  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    adults: 1,
    children: 0,
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [apartmentType, setApartmentType] = useState("");

  // Update price when dates change
  useEffect(() => {
    if (selectedProperty && selectedProperty.price) {
      const nights = Math.ceil(
        (checkOutDate - checkInDate) / (24 * 60 * 60 * 1000)
      );
      setTotalAmount(selectedProperty.price * nights);
    }
  }, [checkInDate, checkOutDate, selectedProperty]);

  // Handler for when blocked dates are loaded
  const handleBlockedDatesLoaded = (dates) => {
    setBlockedDates(dates);
  };

  // Fetch recent bookings (will be called after successful payment)
  const fetchRecentBookings = async (propertyId) => {
    try {
      // Replace with actual API call
      // const response = await api.getRecentBookings(propertyId);
      // setRecentBookings(response.data);

      // In a real implementation, this would fetch from your database
      // For demo purposes, we'll use the bookingData that was just created
      setRecentBookings((prevBookings) => [...prevBookings]);
    } catch (error) {
      console.error("Failed to fetch recent bookings", error);
    }
  };

  // Handle guest info changes
  const handleGuestInfoChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo({
      ...guestInfo,
      [name]: value,
    });
  };

  // Proceed to payment
  const handleProceedToPayment = () => {
    if (!selectedProperty) {
      showMessage("Please select a property first", "warning");
      return;
    }

    if (checkInDate >= checkOutDate) {
      showMessage("Check-out date must be after check-in date", "warning");
      return;
    }

    // Use the imported utility function to check date availability
    if (!checkDateAvailability(blockedDates, checkInDate, checkOutDate)) {
      showMessage("Selected dates overlap with blocked dates", "danger");
      return;
    }

    // Validate form data
    if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email) {
      showMessage("Please fill all required guest information", "warning");
      return;
    }

    if (!apartmentType) {
      showMessage("Please select an apartment type", "warning");
      return;
    }

    // Show payment modal
    setShowPaymentModal(true);
  };

  // Paystack config
  const config = {
    reference: new Date().getTime().toString(),
    email: guestInfo.email,
    amount: totalAmount * 100, // Convert to kobo
    publicKey: PAYSTACK_PUBLIC_KEY,
    metadata: {
      custom_fields: [
        {
          display_name: "Full Name",
          variable_name: "full_name",
          value: `${guestInfo.firstName} ${guestInfo.lastName}`,
        },
        {
          display_name: "Phone Number",
          variable_name: "phone_number",
          value: guestInfo.phone,
        },
        {
          display_name: "Apartment Type",
          variable_name: "apartment_type",
          value: apartmentType,
        },
        {
          display_name: "Check-in Date",
          variable_name: "check_in",
          value: checkInDate.toISOString().split("T")[0],
        },
        {
          display_name: "Check-out Date",
          variable_name: "check_out",
          value: checkOutDate.toISOString().split("T")[0],
        },
        {
          display_name: "Property ID",
          variable_name: "property_id",
          value: selectedProperty?.id || "",
        },
      ],
    },
  };

  const initializePayment = usePaystackPayment(config);

  const onPaymentSuccess = (reference) => {
    setIsProcessing(false);
    setShowPaymentModal(false);

    // Create booking
    const bookingData = {
      id: `B${Math.floor(10000 + Math.random() * 90000)}`,
      guestName: `${guestInfo.firstName} ${guestInfo.lastName}`,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalAmount: totalAmount,
      status: "confirmed",
      reference: reference.reference,
    };

    // Add to recent bookings
    setRecentBookings([bookingData, ...recentBookings]);

    // Show success message
    showMessage("Booking created successfully!", "success");

    // Reset form
    setGuestInfo({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      adults: 1,
      children: 0,
    });

    setApartmentType("");
  };

  const onPaymentClose = () => {
    setIsProcessing(false);
    setShowPaymentModal(false);
    showMessage("Payment cancelled. You can try again when ready.", "warning");
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    initializePayment(onPaymentSuccess, onPaymentClose);
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get prices for different apartment types (similar to PropertyDetailPage)
  const getTypePrice = (type) => {
    if (!selectedProperty || !selectedProperty.priceNaira) return 0;

    const priceMultipliers = {
      "3br": 1,
      "4br": 1.2,
      "5br": 1.4,
      "5br-party": 2,
    };

    const basePrice = selectedProperty.priceNaira;
    return basePrice * (priceMultipliers[type] || 1);
  };

  // Update total amount when apartment type changes
  const handleApartmentTypeChange = (e) => {
    const type = e.target.value;
    setApartmentType(type);

    if (type && selectedProperty) {
      const baseAmount = getTypePrice(type);

      // For party, it's a flat fee. For others, multiply by days
      const nights = Math.ceil(
        (checkOutDate - checkInDate) / (24 * 60 * 60 * 1000)
      );
      setTotalAmount(type === "5br-party" ? baseAmount : baseAmount * nights);
    } else {
      setTotalAmount(0);
    }
  };

  return (
    <Row>
      <Col lg={7} className="mb-4">
        <Card>
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">
              <FaCalendarAlt className="me-2" /> Create Manual Booking
            </h5>
          </Card.Header>
          <Card.Body>
            <Form>
              {/* Property Selection */}
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Select Property</Form.Label>
                    <Form.Select
                      value={selectedProperty?.id || ""}
                      onChange={(e) => onPropertySelect(e.target.value)}
                    >
                      <option value="">-- Select Property --</option>
                      {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                          {property.name ||
                            property.title ||
                            `Property #${property.id}`}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Blocked Dates Manager Component */}
              {selectedProperty && (
                <BlockedDatesManager
                  propertyId={selectedProperty.id}
                  onBlockedDatesLoaded={handleBlockedDatesLoaded}
                  showMessage={showMessage}
                />
              )}

              {/* Apartment Type Selection */}
              {selectedProperty && (
                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Select Apartment Type</Form.Label>
                      <Form.Select
                        value={apartmentType}
                        onChange={handleApartmentTypeChange}
                      >
                        <option value="">Choose an option</option>
                        <option value="3br">3 Bedroom</option>
                        <option value="4br">4 Bedroom</option>
                        <option value="5br">5 Bedroom</option>
                        <option value="5br-party">5 Bedroom (Party)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              )}

              {/* Date Selection */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Check-In Date</Form.Label>
                    <DatePicker
                      selected={checkInDate}
                      onChange={(date) => setCheckInDate(date)}
                      selectsStart
                      startDate={checkInDate}
                      endDate={checkOutDate}
                      minDate={new Date()}
                      dateFormat="MMMM d, yyyy"
                      className="form-control"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Check-Out Date</Form.Label>
                    <DatePicker
                      selected={checkOutDate}
                      onChange={(date) => setCheckOutDate(date)}
                      selectsEnd
                      startDate={checkInDate}
                      endDate={checkOutDate}
                      minDate={checkInDate}
                      dateFormat="MMMM d, yyyy"
                      className="form-control"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <hr className="my-4" />

              <h6 className="mb-3">
                <FaUser className="me-2" /> Guest Information
              </h6>

              {/* Guest Information */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>First Name*</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={guestInfo.firstName}
                      onChange={handleGuestInfoChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Last Name*</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={guestInfo.lastName}
                      onChange={handleGuestInfoChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email*</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaEnvelope />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        value={guestInfo.email}
                        onChange={handleGuestInfoChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaPhone />
                      </InputGroup.Text>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={guestInfo.phone}
                        onChange={handleGuestInfoChange}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Adults</Form.Label>
                    <Form.Control
                      type="number"
                      name="adults"
                      value={guestInfo.adults}
                      onChange={handleGuestInfoChange}
                      min="1"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Children</Form.Label>
                    <Form.Control
                      type="number"
                      name="children"
                      value={guestInfo.children}
                      onChange={handleGuestInfoChange}
                      min="0"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Price Display */}
              {apartmentType && selectedProperty && (
                <div
                  className="mb-4 p-3 rounded"
                  style={{ backgroundColor: "rgba(64, 224, 208, 0.1)" }}
                >
                  <h6 className="fw-bold mb-3">Price Breakdown</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span>
                      {apartmentType === "3br"
                        ? "3 Bedroom"
                        : apartmentType === "4br"
                        ? "4 Bedroom"
                        : apartmentType === "5br"
                        ? "5 Bedroom"
                        : "5 Bedroom (Party)"}
                    </span>
                    <span className="fw-bold">
                      ₦{totalAmount.toLocaleString()}
                    </span>
                  </div>
                  {apartmentType !== "5br-party" && (
                    <div className="d-flex justify-content-between text-muted small mb-2">
                      <span>
                        {Math.ceil(
                          (checkOutDate - checkInDate) / (24 * 60 * 60 * 1000)
                        )}{" "}
                        days
                        {` (${checkInDate.toLocaleDateString()} - ${checkOutDate.toLocaleDateString()})`}
                      </span>
                    </div>
                  )}
                  <hr className="my-3" />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total</span>
                    <span style={{ color: "#20B2AA" }}>
                      ₦{totalAmount.toLocaleString()}
                    </span>
                  </div>
                  {apartmentType === "5br-party" && (
                    <div className="d-flex justify-content-between mt-2 text-danger">
                      <span className="fw-bold">Caution Fee</span>
                      <span className="fw-bold">₦100,000</span>
                    </div>
                  )}
                </div>
              )}

              <div className="d-grid mt-4">
                <Button
                  variant="success"
                  onClick={handleProceedToPayment}
                  disabled={loading || !selectedProperty || !apartmentType}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheck className="me-2" /> Proceed to Payment
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>

      <Col lg={5}>
        <Card>
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">
              <FaCalendarAlt className="me-2" /> Recent Bookings
            </h5>
          </Card.Header>
          <Card.Body>
            {recentBookings.length === 0 ? (
              <div className="text-center py-5">
                <h6 className="text-muted">No bookings to display</h6>
                <p className="text-muted small">
                  Bookings will appear here after successful payment
                </p>
              </div>
            ) : (
              <ListGroup>
                {recentBookings.map((booking) => (
                  <ListGroup.Item
                    key={booking.id}
                    className="d-flex flex-column"
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <Badge bg="success" className="me-2">
                          {booking.status}
                        </Badge>
                        <span className="fw-bold">{booking.guestName}</span>
                      </div>
                      <small className="text-muted">ID: {booking.id}</small>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small>
                          {formatDate(booking.checkIn)} -{" "}
                          {formatDate(booking.checkOut)}
                        </small>
                      </div>
                      <div>
                        <Badge bg="info">
                          ₦{booking.totalAmount.toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      </Col>

      {/* Payment Modal */}
      <Modal
        show={showPaymentModal}
        onHide={() => !isProcessing && setShowPaymentModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton={!isProcessing}>
          <Modal.Title style={{ color: "#20B2AA" }}>
            Complete Your Reservation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePaymentSubmit}>
            <div
              className="mb-4 p-3 rounded"
              style={{ backgroundColor: "rgba(64, 224, 208, 0.1)" }}
            >
              <h6 className="mb-3 fw-bold">Reservation Summary</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Property:</span>
                <span className="fw-bold">
                  {selectedProperty?.title || selectedProperty?.name}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Type:</span>
                <span className="fw-bold">
                  {apartmentType === "3br"
                    ? "3 Bedroom"
                    : apartmentType === "4br"
                    ? "4 Bedroom"
                    : apartmentType === "5br"
                    ? "5 Bedroom"
                    : "5 Bedroom (Party)"}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Check-in:</span>
                <span className="fw-bold">
                  {checkInDate.toLocaleDateString()}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Check-out:</span>
                <span className="fw-bold">
                  {checkOutDate.toLocaleDateString()}
                </span>
              </div>
              <div className="d-flex justify-content-between mt-3">
                <span className="fw-bold">Total Amount:</span>
                <span className="fw-bold">₦{totalAmount.toLocaleString()}</span>
              </div>
              {apartmentType === "5br-party" && (
                <div className="d-flex justify-content-between mt-2">
                  <span className="fw-bold text-danger">Caution Fee:</span>
                  <span className="fw-bold text-danger">
                    ₦100,000 (To be paid at arrival)
                  </span>
                </div>
              )}
            </div>

            <Button
              variant="primary"
              type="submit"
              className="w-100 py-3 fw-bold"
              disabled={isProcessing}
              style={{
                backgroundColor: "#40E0D0",
                borderColor: "#40E0D0",
                borderRadius: "8px",
              }}
            >
              {isProcessing ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Processing...
                </>
              ) : (
                `Pay ₦${totalAmount.toLocaleString()} Now`
              )}
            </Button>
            <p className="text-center text-muted small mt-3">
              Secure payment powered by Paystack
            </p>
          </Form>
        </Modal.Body>
      </Modal>
    </Row>
  );
};

export default ManualBooking;