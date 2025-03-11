import React, { useState } from "react";
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
} from "react-bootstrap";
import { FaUserPlus, FaLock } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useProperties } from "../services/propertyContext";
import { api } from "../../api";
import { usePaystackPayment } from "react-paystack";

const PAYSTACK_PUBLIC_KEY = "YOUR_PAYSTACK_PUBLIC_KEY"; // Replace with your key

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
  const { properties, updateProperty, updatePropertyBlockedDates } =
    useProperties();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    propertyId: "",
    apartmentType: "",
    amount: "",
    paymentStatus: "pending",
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getDays = () => {
    if (startDate && endDate) {
      const difference = Math.abs(endDate - startDate);
      return Math.ceil(difference / (1000 * 60 * 60 * 24));
    }
    return 1;
  };

  const calculateAmount = () => {
    const selectedProperty = properties.find(
      (p) => p.id === formData.propertyId
    );
    if (!selectedProperty || !formData.apartmentType) return 0;
    let baseAmount = selectedProperty.priceNaira || 0;
    const priceMultipliers = {
      "3br": 1,
      "4br": 1.2,
      "5br": 1.4,
      "5br-party": 2,
    };
    baseAmount = baseAmount * (priceMultipliers[formData.apartmentType] || 1);
    return formData.apartmentType === "5br-party"
      ? baseAmount
      : baseAmount * getDays();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "propertyId" && value) {
      const selectedProperty = properties.find((p) => p.id === value);
      if (selectedProperty && selectedProperty.apartmentType) {
        setFormData((prev) => ({
          ...prev,
          apartmentType: selectedProperty.apartmentType[0] || "",
        }));
      }
    }
  };

  const config = {
    reference: new Date().getTime().toString(),
    email: formData.email,
    amount: calculateAmount() * 100,
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

  const onPaymentSuccess = async (reference) => {
    setIsProcessing(false);
    setShowPaymentModal(false);
    const selectedProperty = properties.find(
      (p) => p.id === formData.propertyId
    );
    const newBlockedDates = [
      ...(selectedProperty.blockedDates || []),
      {
        start: startDate.toISOString().split("T")[0],
        end: endDate.toISOString().split("T")[0],
      },
    ];
    const bookingData = {
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
    };

    try {
      await api.createBooking(bookingData);
      await updateProperty(formData.propertyId, { availability: "Booked" });
      await updatePropertyBlockedDates(formData.propertyId, newBlockedDates);
      setSuccess("Payment successful and booking confirmed!");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        propertyId: "",
        apartmentType: "",
        amount: "",
        paymentStatus: "pending",
      });
      setStartDate(null);
      setEndDate(null);
    } catch (err) {
      setError("Payment succeeded but booking failed. Please contact support.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPaymentClose = () => {
    setIsProcessing(false);
    setShowPaymentModal(false);
    setError("Payment cancelled. Booking not completed.");
    setIsSubmitting(false);
  };

  const handleReserveNow = () => {
    if (!startDate || !endDate) {
      setError("Please select both check-in and check-out dates");
      return;
    }
    if (!formData.propertyId) {
      setError("Please select a property");
      return;
    }
    if (!formData.apartmentType) {
      setError("Please select an apartment type");
      return;
    }
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError("Please fill in all contact information");
      return;
    }
    const selectedProperty = properties.find(
      (p) => p.id === formData.propertyId
    );
    if (selectedProperty.availability !== "Available Now") {
      setError("This property is not available for booking");
      return;
    }
    if (
      !isDateRangeAvailable(selectedProperty.blockedDates, startDate, endDate)
    ) {
      setError("Selected dates conflict with existing bookings");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setIsSubmitting(true);
    initializePayment(onPaymentSuccess, onPaymentClose);
  };

  const availableProperties = properties.filter(
    (p) => p.availability === "Available Now"
  );

  return (
    <Container className="py-5">
      <Row>
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FaUserPlus className="me-2" /> Manual Client Registration
              </h5>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert
                  variant="danger"
                  onClose={() => setError("")}
                  dismissible
                >
                  {error}
                </Alert>
              )}
              {success && (
                <Alert
                  variant="success"
                  onClose={() => setSuccess("")}
                  dismissible
                >
                  {success}
                </Alert>
              )}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Select Property</Form.Label>
                  <Form.Select
                    name="propertyId"
                    value={formData.propertyId}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">-- Select Property --</option>
                    {availableProperties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.title} - {property.location}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter client's full name"
                    required
                    disabled={isSubmitting}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter client's email"
                    required
                    disabled={isSubmitting}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter client's phone number"
                    required
                    disabled={isSubmitting}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Apartment Type</Form.Label>
                  <Form.Select
                    name="apartmentType"
                    value={formData.apartmentType}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting || !formData.propertyId}
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

                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    className="form-control"
                    disabled={isSubmitting}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate || new Date()}
                    dateFormat="MMMM d, yyyy"
                    className="form-control"
                    disabled={isSubmitting}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Amount (₦)</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={formData.amount || calculateAmount()}
                    onChange={handleChange}
                    placeholder="Enter or auto-calculated amount"
                    required
                    disabled={isSubmitting}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  className="w-100"
                  onClick={handleReserveNow}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
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
                      <FaLock className="me-2" /> Proceed to Payment
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FaUserPlus className="me-2" /> Booking Summary
              </h5>
            </Card.Header>
            <Card.Body>
              {isSubmitting ? (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Processing...</span>
                  </Spinner>
                </div>
              ) : formData.propertyId ? (
                <>
                  <p>
                    <strong>Property:</strong>{" "}
                    {
                      properties.find((p) => p.id === formData.propertyId)
                        ?.title
                    }
                  </p>
                  <p>
                    <strong>Type:</strong>{" "}
                    {formData.apartmentType === "3br"
                      ? "3 Bedroom"
                      : formData.apartmentType === "4br"
                      ? "4 Bedroom"
                      : formData.apartmentType === "5br"
                      ? "5 Bedroom"
                      : "5 Bedroom (Party)"}
                  </p>
                  <p>
                    <strong>Client:</strong> {formData.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {formData.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {formData.phone}
                  </p>
                  <p>
                    <strong>Check-in:</strong>{" "}
                    {startDate?.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p>
                    <strong>Check-out:</strong>{" "}
                    {endDate?.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p>
                    <strong>Amount:</strong> ₦
                    {calculateAmount().toLocaleString()}
                  </p>
                  {formData.apartmentType === "5br-party" && (
                    <p className="text-danger">
                      <strong>Caution Fee:</strong> ₦100,000 (due at arrival)
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <h6 className="text-muted">
                    Fill in details to see booking summary
                  </h6>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showPaymentModal}
        onHide={() => !isProcessing && setShowPaymentModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header
          className="bg-primary text-white"
          closeButton={!isProcessing}
        >
          <Modal.Title>
            <FaLock className="me-2" /> Complete Payment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePaymentSubmit}>
            <div className="mb-4">
              <h6 className="mb-3 fw-bold">Booking Summary</h6>
              <p>
                <strong>Property:</strong>{" "}
                {properties.find((p) => p.id === formData.propertyId)?.title}
              </p>
              <p>
                <strong>Type:</strong>{" "}
                {formData.apartmentType === "3br"
                  ? "3 Bedroom"
                  : formData.apartmentType === "4br"
                  ? "4 Bedroom"
                  : formData.apartmentType === "5br"
                  ? "5 Bedroom"
                  : "5 Bedroom (Party)"}
              </p>
              <p>
                <strong>Check-in:</strong>{" "}
                {startDate?.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p>
                <strong>Check-out:</strong>{" "}
                {endDate?.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p>
                <strong>Total Amount:</strong> ₦
                {calculateAmount().toLocaleString()}
              </p>
              {formData.apartmentType === "5br-party" && (
                <p className="text-danger">
                  <strong>Caution Fee:</strong> ₦100,000 (To be paid at arrival)
                </p>
              )}
            </div>
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={isProcessing}
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
                `Pay ₦${calculateAmount().toLocaleString()} Now`
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

export default AdminClientRegistration;
