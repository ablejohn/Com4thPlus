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
  Spinner
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaCreditCard, FaCheck } from "react-icons/fa";

const ManualBooking = ({ 
  properties, 
  selectedProperty, 
  onPropertySelect, 
  showMessage 
}) => {
  // Form state
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)); // 3 days later
  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    adults: 1,
    children: 0
  });
  const [paymentInfo, setPaymentInfo] = useState({
    amount: "",
    method: "credit_card",
    reference: "",
    notes: ""
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  // Load blocked dates and update price when property changes
  useEffect(() => {
    if (selectedProperty) {
      fetchBlockedDates(selectedProperty.id);
      fetchRecentBookings(selectedProperty.id);
      
      // Set default price if property has a nightly rate
      if (selectedProperty.price) {
        const nights = Math.ceil((checkOutDate - checkInDate) / (24 * 60 * 60 * 1000));
        setPaymentInfo({
          ...paymentInfo,
          amount: (selectedProperty.price * nights).toString()
        });
      }
    }
  }, [selectedProperty]);

  // Update price when dates change
  useEffect(() => {
    if (selectedProperty && selectedProperty.price) {
      const nights = Math.ceil((checkOutDate - checkInDate) / (24 * 60 * 60 * 1000));
      setPaymentInfo({
        ...paymentInfo,
        amount: (selectedProperty.price * nights).toString()
      });
    }
  }, [checkInDate, checkOutDate]);

  // Fetch blocked dates for the selected property
  const fetchBlockedDates = async (propertyId) => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await api.getBlockedDates(propertyId);
      // setBlockedDates(response.data);
      
      // Simulated data for demonstration
      setTimeout(() => {
        const mockBlockedDates = [
          { 
            id: 1, 
            startDate: new Date(2025, 2, 15), 
            endDate: new Date(2025, 2, 20)
          },
          { 
            id: 2, 
            startDate: new Date(2025, 3, 10), 
            endDate: new Date(2025, 3, 15)
          }
        ];
        setBlockedDates(mockBlockedDates);
        setLoading(false);
      }, 600);
    } catch (error) {
      showMessage("Failed to load blocked dates", "danger");
      setLoading(false);
    }
  };

  // Fetch recent bookings
  const fetchRecentBookings = async (propertyId) => {
    try {
      // Replace with actual API call
      // const response = await api.getRecentBookings(propertyId);
      // setRecentBookings(response.data);
      
      // Simulated data for demonstration
      setTimeout(() => {
        const mockBookings = [
          {
            id: 'B12345',
            guestName: 'John Smith',
            checkIn: new Date(2025, 2, 5),
            checkOut: new Date(2025, 2, 10),
            totalAmount: 850,
            status: 'confirmed'
          },
          {
            id: 'B12346',
            guestName: 'Sarah Johnson',
            checkIn: new Date(2025, 2, 22),
            checkOut: new Date(2025, 2, 27),
            totalAmount: 925,
            status: 'confirmed'
          }
        ];
        setRecentBookings(mockBookings);
      }, 800);
    } catch (error) {
      console.error("Failed to fetch recent bookings", error);
    }
  };

  // Handle guest info changes
  const handleGuestInfoChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo({
      ...guestInfo,
      [name]: value
    });
  };

  // Handle payment info changes
  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: value
    });
  };

  // Check if selected dates overlap with blocked dates
  const checkDateAvailability = () => {
    if (!blockedDates.length) return true;
    
    for (const blockedPeriod of blockedDates) {
      // Check if the selected date range overlaps with any blocked period
      if (
        (checkInDate >= blockedPeriod.startDate && checkInDate <= blockedPeriod.endDate) ||
        (checkOutDate >= blockedPeriod.startDate && checkOutDate <= blockedPeriod.endDate) ||
        (checkInDate <= blockedPeriod.startDate && checkOutDate >= blockedPeriod.endDate)
      ) {
        return false;
      }
    }
    return true;
  };

  // Handle booking submission
  const handleSubmitBooking = async () => {
    if (!selectedProperty) {
      showMessage("Please select a property first", "warning");
      return;
    }

    if (checkInDate >= checkOutDate) {
      showMessage("Check-out date must be after check-in date", "warning");
      return;
    }

    if (!checkDateAvailability()) {
      showMessage("Selected dates overlap with blocked dates", "danger");
      return;
    }

    // Validate form data
    if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email) {
      showMessage("Please fill all required guest information", "warning");
      return;
    }

    if (!paymentInfo.amount || isNaN(paymentInfo.amount) || Number(paymentInfo.amount) <= 0) {
      showMessage("Please enter a valid payment amount", "warning");
      return;
    }

    try {
      setLoading(true);
      
      // Prepare booking data
      const bookingData = {
        propertyId: selectedProperty.id,
        checkInDate,
        checkOutDate,
        guest: guestInfo,
        payment: {
          ...paymentInfo,
          amount: Number(paymentInfo.amount)
        },
        status: "confirmed",
        createdAt: new Date(),
        bookingId: `B${Math.floor(10000 + Math.random() * 90000)}`
      };
      
      // Replace with actual API call
      // await api.createBooking(bookingData);
      
      // Simulate API call
      setTimeout(() => {
        // Add to recent bookings
        setRecentBookings([
          {
            id: bookingData.bookingId,
            guestName: `${guestInfo.firstName} ${guestInfo.lastName}`,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            totalAmount: Number(paymentInfo.amount),
            status: 'confirmed'
          },
          ...recentBookings
        ]);
        
        // Show success message
        showMessage("Booking created successfully!", "success");
        
        // Reset form
        setGuestInfo({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          adults: 1,
          children: 0
        });
        
        setPaymentInfo({
          amount: selectedProperty.price ? selectedProperty.price.toString() : "",
          method: "credit_card",
          reference: "",
          notes: ""
        });
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      showMessage("Failed to create booking", "danger");
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
                      value={selectedProperty?.id || ''}
                      onChange={(e) => onPropertySelect(e.target.value)}
                    >
                      <option value="">-- Select Property --</option>
                      {properties.map(property => (
                        <option key={property.id} value={property.id}>
                          {property.name || property.title || `Property #${property.id}`}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Date Selection */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Check-In Date</Form.Label>
                    <DatePicker
                      selected={checkInDate}
                      onChange={date => setCheckInDate(date)}
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
                      onChange={date => setCheckOutDate(date)}
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

              <hr className="my-4" />

              <h6 className="mb-3">
                <FaCreditCard className="me-2" /> Payment Information
              </h6>

              {/* Payment Information */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Amount*</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        type="number"
                        name="amount"
                        value={paymentInfo.amount}
                        onChange={handlePaymentInfoChange}
                        required
                        min="0"
                        step="0.01"
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Select
                      name="method"
                      value={paymentInfo.method}
                      onChange={handlePaymentInfoChange}
                    >
                      <option value="credit_card">Credit Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cash">Cash</option>
                      <option value="paypal">PayPal</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Reference/Transaction ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="reference"
                      value={paymentInfo.reference}
                      onChange={handlePaymentInfoChange}
                      placeholder="Optional reference number"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="notes"
                      value={paymentInfo.notes}
                      onChange={handlePaymentInfoChange}
                      placeholder="Any additional notes"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-grid mt-4">
                <Button 
                  variant="success" 
                  onClick={handleSubmitBooking}
                  disabled={loading || !selectedProperty}
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
                      <FaCheck className="me-2" /> Create Booking
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
            {!selectedProperty ? (
              <div className="text-center py-5">
                <h6 className="text-muted">Select a property to view bookings</h6>
              </div>
            ) : loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="text-center py-5">
                <h6 className="text-muted">No bookings for this property</h6>
              </div>
            ) : (
              <ListGroup>
                {recentBookings.map(booking => (
                  <ListGroup.Item 
                    key={booking.id}
                    className="d-flex flex-column"
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <Badge bg="success" className="me-2">{booking.status}</Badge>
                        <span className="fw-bold">{booking.guestName}</span>
                      </div>
                      <small className="text-muted">ID: {booking.id}</small>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small>
                          {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                        </small>
                      </div>
                      <div>
                        <Badge bg="info">${booking.totalAmount}</Badge>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ManualBooking;