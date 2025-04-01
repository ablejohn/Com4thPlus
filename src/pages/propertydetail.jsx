import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Spinner,
  Form,
  Modal,
  Alert,
  ListGroup,
} from "react-bootstrap";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaArrowLeft,
  FaPhone,
  FaCalendarAlt,
} from "react-icons/fa";
import { useProperties } from "../services/propertyContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { usePaystackPayment } from "react-paystack";
import { api } from "../../api";

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
  borderRadius: { sm: "8px", md: "16px" },
  boxShadow: { sm: "0 4px 12px rgba(0, 0, 0, 0.05)" },
};

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

const CONSTANT_HOUSE_RULES = [
  "Maximum number of guests is strictly 30 people for parties",
  "No large cooking is allowed for any get together or party at the apartment",
  "Refundable caution fee of 100k in all categories",
  "Check-in: After 2:00 PM",
  "Checkout: 12:00 PM",
];

const checkDateAvailability = (blockedDates, checkInDate, checkOutDate) => {
  if (!blockedDates || blockedDates.length === 0) return true;
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  return !blockedDates.some((range) => {
    const rangeStart = new Date(range.startDate || range.start);
    const rangeEnd = new Date(range.endDate || range.end);
    return start <= rangeEnd && end >= rangeStart;
  });
};

const getExcludedDates = (blockedDates) => {
  if (!blockedDates || blockedDates.length === 0) return [];
  const excluded = [];
  blockedDates.forEach(({ startDate, endDate, start, end }) => {
    const rangeStart = startDate || start;
    const rangeEnd = endDate || end;
    let currentDate = new Date(rangeStart);
    const endDateObj = new Date(rangeEnd);
    while (currentDate <= endDateObj) {
      excluded.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });
  return excluded;
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, loading, updatePropertyBlockedDates } = useProperties();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [apartmentType, setApartmentType] = useState("");
  const [amount, setAmount] = useState(0);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const property = properties.find((p) => p.id === id);
  const blockedDates = property ? property.blockedDates || [] : [];
  const excludedDates = getExcludedDates(blockedDates);

  const getDays = () => {
    if (startDate && endDate) {
      const difference = Math.abs(endDate - startDate);
      return Math.ceil(difference / (1000 * 60 * 60 * 24));
    }
    return 1;
  };

  useEffect(() => {
    if (apartmentType && property) {
      let baseAmount = property.priceNaira || 0;
      const priceMultipliers = {
        "3br": 1,
        "4br": 1.2,
        "5br": 1.4,
        "5br-party": 2,
      };
      baseAmount = baseAmount * (priceMultipliers[apartmentType] || 1);
      setAmount(
        apartmentType === "5br-party" ? baseAmount : baseAmount * getDays()
      );
    } else {
      setAmount(0);
    }
  }, [apartmentType, startDate, endDate, property]);

  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: amount * 100,
    publicKey: PAYSTACK_PUBLIC_KEY,
    metadata: {
      custom_fields: [
        {
          display_name: "Full Name",
          variable_name: "full_name",
          value: fullName,
        },
        {
          display_name: "Phone Number",
          variable_name: "phone_number",
          value: phone,
        },
        {
          display_name: "Apartment Type",
          variable_name: "apartment_type",
          value: apartmentType,
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

  const onSuccess = async (reference) => {
    setIsProcessing(false);
    setShowPaymentModal(false);

    const newBlockedDates = [
      ...(property.blockedDates || []),
      {
        start: startDate.toISOString().split("T")[0],
        end: endDate.toISOString().split("T")[0],
      },
    ];

    const bookingData = {
      fullName,
      email,
      phone,
      propertyId: id,
      propertyTitle: property.title,
      apartmentType,
      amount,
      paymentStatus: "paid",
      paymentReference: reference.reference,
      checkIn: startDate.toISOString().split("T")[0],
      checkOut: endDate.toISOString().split("T")[0],
    };

    try {
      await api.createBooking(bookingData);
      await updatePropertyBlockedDates(id, newBlockedDates);
      await api.updateProperty(id, { availability: "Booked" });
      navigate(
        `/payment-success?ref=${reference.reference}&amount=${amount}&type=${apartmentType}`
      );
    } catch (err) {
      setError("Payment succeeded but booking failed. Contact support.");
      console.error("Booking error:", err);
    }
  };

  const onClose = () => {
    setIsProcessing(false);
    setShowPaymentModal(false);
    setError("Payment cancelled. You can try again when ready.");
  };

  const handleReserveNow = () => {
    if (!apartmentType || !startDate || !endDate) {
      setError("Please select apartment type and dates");
      return;
    }

    if (!checkDateAvailability(blockedDates, startDate, endDate)) {
      setError("Selected dates are blocked. Please choose different dates.");
      return;
    }

    if (property.availability !== "Available Now") {
      setError("This property is no longer available.");
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!email || !fullName || !phone) {
      setError("Please fill in all required fields");
      return;
    }
    setIsProcessing(true);
    initializePayment(onSuccess, onClose);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner
          animation="border"
          role="status"
          className="mb-3"
          style={{ color: theme.colors.primary }}
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <h2>Loading property details...</h2>
      </Container>
    );
  }

  if (!property) {
    return (
      <Container className="py-5 text-center">
        <h2>Property Not Found</h2>
        <p>No property found with ID: {id}</p>
        <Button
          variant="outline-primary"
          onClick={() => navigate("/properties")}
          style={{
            borderColor: theme.colors.primary,
            color: theme.colors.primary,
          }}
        >
          <FaArrowLeft className="me-2" /> Back to Properties
        </Button>
      </Container>
    );
  }

  const getTypePrice = (type) => {
    const priceMultipliers = {
      "3br": 1,
      "4br": 1.2,
      "5br": 1.4,
      "5br-party": 2,
    };
    return property.priceNaira * (priceMultipliers[type] || 1);
  };

  return (
    <Container className="py-5">
      <Button
        variant="outline-primary"
        onClick={() => navigate("/properties")}
        className="mb-4"
        style={{
          borderColor: theme.colors.primary,
          color: theme.colors.primary,
        }}
      >
        <FaArrowLeft className="me-2" /> Back to Properties
      </Button>

      <Row>
        <Col lg={8}>
          <Row>
            <Col md={6}>
              <Card
                className="shadow-sm"
                style={{
                  borderRadius: theme.borderRadius.md,
                  overflow: "hidden",
                }}
              >
                <Card.Img
                  variant="top"
                  src={
                    property.images && property.images[0]
                      ? property.images[0]
                      : "https://via.placeholder.com/600x400"
                  }
                  alt={property.title}
                  style={{ height: "400px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/600x400";
                  }}
                />
              </Card>
            </Col>
            <Col md={6}>
              <h2 className="fw-bold" style={{ color: theme.colors.dark }}>
                {property.title}
              </h2>
              <Badge
                bg={
                  property.availability === "Available Now"
                    ? "success"
                    : property.availability === "Coming Soon"
                    ? "danger"
                    : "warning"
                }
                className="mb-3"
              >
                {property.availability}
              </Badge>
              <p className="mt-3">
                <FaMapMarkerAlt
                  className="me-2"
                  style={{ color: theme.colors.primary }}
                />{" "}
                {property.location}
              </p>
              <div className="d-flex flex-wrap gap-3 mb-3">
                <span>
                  <FaBed
                    className="me-2"
                    style={{ color: theme.colors.primary }}
                  />{" "}
                  {property.beds ?? "N/A"} Beds
                </span>
                <span>
                  <FaBath
                    className="me-2"
                    style={{ color: theme.colors.primary }}
                  />{" "}
                  {property.baths ?? "N/A"} Baths
                </span>
                <span>
                  <FaRulerCombined
                    className="me-2"
                    style={{ color: theme.colors.primary }}
                  />{" "}
                  {(property.sqft ?? 0).toLocaleString()} sqft
                </span>
              </div>
              <p>
                <FaPhone
                  className="me-2"
                  style={{ color: theme.colors.primary }}
                />{" "}
                {property.contactPhone || "N/A"}
              </p>
              <h4 className="fw-bold" style={{ color: theme.colors.primary }}>
                ₦{(property.priceNaira ?? 0).toLocaleString()}
              </h4>
            </Col>
          </Row>

          {/* Blocked Dates Section - Moved Up for Priority */}
          <Card
            className="mt-4 shadow-sm"
            style={{
              borderRadius: theme.borderRadius.sm,
              backgroundColor: theme.colors.primaryLight,
              border: `1px solid ${theme.colors.primary}`,
            }}
          >
            <Card.Body className="p-3">
              <h5
                className="fw-bold mb-3 d-flex align-items-center"
                style={{ color: theme.colors.primaryDark }}
              >
                <FaCalendarAlt className="me-2" /> Unavailable Dates
              </h5>
              {blockedDates.length > 0 ? (
                <ListGroup variant="flush">
                  {blockedDates.slice(0, 3).map((dateRange, index) => (
                    <ListGroup.Item
                      key={index}
                      className="border-0 p-1 d-flex justify-content-between align-items-center"
                    >
                      <span className="text-muted small">
                        {formatDate(dateRange.startDate || dateRange.start)} -{" "}
                        {formatDate(dateRange.endDate || dateRange.end)}
                      </span>
                      {dateRange.reason && (
                        <Badge bg="info" className="ms-2 small">
                          {dateRange.reason}
                        </Badge>
                      )}
                    </ListGroup.Item>
                  ))}
                  {blockedDates.length > 3 && (
                    <ListGroup.Item className="border-0 p-1 text-muted small">
                      +{blockedDates.length - 3} more blocked period(s)
                    </ListGroup.Item>
                  )}
                </ListGroup>
              ) : (
                <p className="text-success mb-0 small">
                  No blocked dates - fully available!
                </p>
              )}
            </Card.Body>
          </Card>

          {property.description && (
            <Card
              className="border-0 shadow-sm mt-4"
              style={{ borderRadius: theme.borderRadius.md }}
            >
              <div
                className="position-absolute"
                style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "6px",
                  background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                  borderRadius: `${theme.borderRadius.md} ${theme.borderRadius.md} 0 0`,
                }}
              />
              <Card.Body className="p-4">
                <h5
                  className="mb-3 fw-bold"
                  style={{ color: theme.colors.primaryDark }}
                >
                  About This Property
                </h5>
                <p className="text-muted" style={{ lineHeight: "1.7" }}>
                  {property.description}
                </p>
              </Card.Body>
            </Card>
          )}

          <Card
            className="border-0 shadow-sm mt-4"
            style={{ borderRadius: theme.borderRadius.md }}
          >
            <div
              className="position-absolute"
              style={{
                top: 0,
                left: 0,
                right: 0,
                height: "6px",
                background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                borderRadius: `${theme.borderRadius.md} ${theme.borderRadius.md} 0 0`,
              }}
            />
            <Card.Body className="p-4">
              <h5
                className="mb-3 fw-bold"
                style={{ color: theme.colors.primaryDark }}
              >
                House Rules
              </h5>
              <ul className="mb-0 ps-3">
                {CONSTANT_HOUSE_RULES.map((rule, index) => (
                  <li key={index} className="mb-2 text-muted">
                    {rule}
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm mt-4" style={{ borderRadius: theme.borderRadius.md }}>
  <div
    className="position-absolute"
    style={{
      top: 0,
      left: 0,
      right: 0,
      height: "6px",
      background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
      borderRadius: `${theme.borderRadius.md} ${theme.borderRadius.md} 0 0`,
    }}
  />
  <Card.Body className="p-4">
    <h5 className="mb-3 fw-bold" style={{ color: theme.colors.primaryDark }}>
      Pricing Information
    </h5>
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Apartment Type</th>
            <th>Daily Rate</th>
            <th>Party Rate (Flat Fee)</th>
            <th>Caution Fee</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>3 Bedroom</td>
            <td>₦{getTypePrice("3br").toLocaleString()}/day</td>
            <td>N/A</td>
            <td>₦100,000</td>
          </tr>
          <tr>
            <td>4 Bedroom</td>
            <td>₦{getTypePrice("4br").toLocaleString()}/day</td>
            <td>N/A</td>
            <td>₦100,000</td>
          </tr>
          <tr>
            <td>5 Bedroom</td>
            <td>₦{getTypePrice("5br").toLocaleString()}/day</td>
            <td>₦{getTypePrice("5br-party").toLocaleString()} (flat fee)</td>
            <td>₦100,000</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p className="text-muted mt-3 mb-0 small">
      * A refundable caution fee of ₦100,000 is required for all apartment types and is to be paid upon arrival.
    </p>
  </Card.Body>
</Card>
        </Col>

        <Col lg={4}>
          <div style={{ position: "sticky", top: "20px" }}>
            <Card
              className="shadow-sm border-0 mb-4"
              style={{ borderRadius: theme.borderRadius.md }}
            >
              <Card.Body className="p-4">
                <h5
                  className="fw-bold mb-4"
                  style={{ color: theme.colors.primaryDark }}
                >
                  Make a Reservation
                </h5>
                {error && (
                  <Alert
                    variant="danger"
                    onClose={() => setError("")}
                    dismissible
                  >
                    {error}
                  </Alert>
                )}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    Select Apartment Type
                  </Form.Label>
                  <Form.Select
                    value={apartmentType}
                    onChange={(e) => setApartmentType(e.target.value)}
                    style={{
                      padding: "0.75rem",
                      borderRadius: theme.borderRadius.sm,
                    }}
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
                    excludeDates={excludedDates}
                    className="form-control"
                    placeholderText="Select check-in date"
                    disabled={isProcessing}
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
                    excludeDates={excludedDates}
                    className="form-control"
                    placeholderText="Select check-out date"
                    disabled={isProcessing}
                  />
                </Form.Group>
                <div className="mb-4 p-3 rounded" style={{ backgroundColor: theme.colors.primaryLight }}>
  <h6 className="fw-bold mb-3">Price Breakdown</h6>
  {amount > 0 ? (
    <>
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
          ₦{amount.toLocaleString()}
        </span>
      </div>
      {apartmentType !== "5br-party" && (
        <div className="d-flex justify-content-between text-muted small mb-2">
          <span>
            {getDays()} {getDays() === 1 ? "day" : "days"}{" "}
            {startDate &&
              endDate &&
              `(${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})`}
          </span>
        </div>
      )}
      <hr className="my-3" />
      <div className="d-flex justify-content-between fw-bold">
        <span>Total</span>
        <span style={{ color: theme.colors.primaryDark }}>
          ₦{amount.toLocaleString()}
        </span>
      </div>
      {/* Show caution fee for all apartment types */}
      <div className="d-flex justify-content-between mt-2 text-danger">
        <span className="fw-bold">Caution Fee (Refundable)</span>
        <span className="fw-bold">₦100,000</span>
      </div>
    </>
  ) : (
    <p className="text-muted mb-0">
      Select apartment type and dates to see pricing
    </p>
  )}
</div>

                <Button
                  variant="primary"
                  className="w-100 py-3 fw-bold"
                  onClick={handleReserveNow}
                  disabled={
                    !apartmentType || !startDate || !endDate || isProcessing
                  }
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

            <Card
              className="shadow-sm border-0"
              style={{ borderRadius: theme.borderRadius.md }}
            >
              <Card.Body className="p-4">
                <h5
                  className="mb-3 fw-bold"
                  style={{ color: theme.colors.dark }}
                >
                  Have questions?
                </h5>
                <p className="text-muted mb-3">
                  Contact us directly for quick assistance
                </p>
                <Button
                  variant="outline-primary"
                  className="w-100 d-flex align-items-center justify-content-center py-2"
                  href={`tel:${property.contactPhone || "08143183494"}`}
                  style={{
                    borderColor: theme.colors.primary,
                    color: theme.colors.primary,
                    borderRadius: theme.borderRadius.sm,
                  }}
                >
                  <FaPhone className="me-2" /> Call{" "}
                  {property.contactPhone || "0814 318 3494"}
                </Button>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      <Modal
        show={showPaymentModal}
        onHide={() => !isProcessing && setShowPaymentModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton={!isProcessing}>
          <Modal.Title style={{ color: theme.colors.primaryDark }}>
            Complete Your Reservation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePaymentSubmit}>
            {error && (
              <Alert variant="danger" onClose={() => setError("")} dismissible>
                {error}
              </Alert>
            )}
           <div className="mb-4 p-3 rounded" style={{ backgroundColor: theme.colors.primaryLight }}>
  <h6 className="mb-3 fw-bold">Reservation Summary</h6>
  <div className="d-flex justify-content-between mb-2">
    <span>Property:</span>
    <span className="fw-bold">{property.title}</span>
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
  {startDate && (
    <div className="d-flex justify-content-between mb-2">
      <span>Check-in:</span>
      <span className="fw-bold">
        {startDate.toLocaleDateString()}
      </span>
    </div>
  )}
  {endDate && (
    <div className="d-flex justify-content-between mb-2">
      <span>Check-out:</span>
      <span className="fw-bold">
        {endDate.toLocaleDateString()}
      </span>
    </div>
  )}
  <div className="d-flex justify-content-between mt-3">
    <span className="fw-bold">Total Amount:</span>
    <span className="fw-bold">₦{amount.toLocaleString()}</span>
  </div>
  {/* Show caution fee for all apartment types */}
  <div className="d-flex justify-content-between mt-2">
    <span className="fw-bold text-danger">Caution Fee (Refundable):</span>
    <span className="fw-bold text-danger">
      ₦100,000 (To be paid at arrival)
    </span>
  </div>
</div>
            <h6
              className="mb-3 fw-bold"
              style={{ color: theme.colors.primaryDark }}
            >
              Contact Information
            </h6>
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
              className="w-100 py-3 fw-bold"
              disabled={isProcessing}
              style={{
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.primary,
                borderRadius: theme.borderRadius.sm,
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
                `Pay ₦${amount.toLocaleString()} Now`
              )}
            </Button>
            <p className="text-center text-muted small mt-3">
              Secure payment powered by Paystack
            </p>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PropertyDetailPage;
