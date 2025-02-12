import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaBed, FaBath, FaMapMarkerAlt, FaStar, FaHeart, FaWifi, FaCar, FaSwimmingPool, FaDumbbell, FaUserCircle } from "react-icons/fa";
import { Container, Row, Col, Button, Badge, Card, Carousel, Modal, Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker CSS

const PropertyDetailPage = () => {
  const { id } = useParams(); // Get the property ID from the URL
  const [property, setProperty] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [startDate, setStartDate] = useState(null); // Check-in date
  const [endDate, setEndDate] = useState(null); // Check-out date

  // Fetch property data based on the ID
  useEffect(() => {
    // Simulate fetching data from an API
    const fetchProperty = async () => {
      const mockData = {
        id: 1,
        title: "Luxury Apartment with City View",
        location: "Manhattan, New York",
        price: 2500,
        description: "Experience luxury living in this stunning apartment featuring breathtaking city views. This meticulously designed space offers modern amenities and comfortable living in the heart of Manhattan.",
        bedrooms: 3,
        bathrooms: 2,
        size: "1,200 sq ft",
        rating: 4.8,
        reviews: 124,
        host: {
          name: "Sarah Johnson",
          rating: 4.9,
          reviews: 342,
          response_rate: 99,
          response_time: "within an hour",
          superhost: true,
        },
        amenities: [
          { icon: <FaWifi />, name: "High-speed WiFi" },
          { icon: <FaCar />, name: "Free parking" },
          { icon: <FaSwimmingPool />, name: "Pool access" },
          { icon: <FaDumbbell />, name: "Fitness center" },
        ],
        images: [
          "appartment1.jpg",
          "appartment1.jpg",
          "appartment1.jpg",
          "appartment1.jpg",
        ],
        reviews_list: [
          {
            user: "John D.",
            rating: 5,
            date: "January 2025",
            comment: "Amazing property with stunning views. The amenities were top-notch and the location couldn't be better.",
          },
          {
            user: "Emma S.",
            rating: 4.5,
            date: "December 2024",
            comment: "Beautiful apartment in a great location. Very clean and well-maintained.",
          },
        ],
        rules: [
          "Check-in: After 3:00 PM",
          "Checkout: 11:00 AM",
          "No smoking",
          "No pets",
          "No parties or events",
        ],
      };

      // Simulate a delay for fetching data
      setTimeout(() => {
        setProperty(mockData);
      }, 1000);
    };

    fetchProperty();
  }, [id]);

  if (!property) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <div className="bg-light min-vh-100" style={{ marginTop: "150px" }}>
      {/* Image Gallery */}
      <div className="position-relative">
        <Row className="g-2 mx-0">
          <Col md={6}>
            <div
              className="position-relative"
              style={{ cursor: "pointer" }}
              onClick={() => setShowGalleryModal(true)}
            >
              <img
                src={property.images[activeImage]}
                alt="Main property view"
                className="img-fluid w-100 h-100 object-fit-cover"
                style={{ maxHeight: "600px", borderRadius: "16px" }}
              />
            </div>
          </Col>
          <Col md={6}>
            <Row className="g-2">
              {property.images.slice(1, 5).map((image, index) => (
                <Col md={6} key={index}>
                  <div
                    className="position-relative"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowGalleryModal(true)}
                  >
                    <img
                      src={image}
                      alt={`Property view ${index + 2}`}
                      className="img-fluid w-100 h-100 object-fit-cover"
                      style={{ maxHeight: "295px", borderRadius: "16px" }}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </div>

      {/* Gallery Modal */}
      <Modal
        show={showGalleryModal}
        onHide={() => setShowGalleryModal(false)}
        size="lg"
        centered
      >
        <Modal.Body className="p-0">
          <Carousel activeIndex={activeImage} onSelect={setActiveImage} interval={null}>
            {property.images.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  src={image}
                  alt={`Property view ${index + 1}`}
                  className="d-block w-100"
                  style={{ maxHeight: "80vh", objectFit: "cover", borderRadius: "16px" }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
      </Modal>

      <Container className="py-5">
        <Row>
          <Col lg={8}>
            {/* Property Header */}
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h1 className="mb-2 fw-bold">{property.title}</h1>
                <p className="text-muted">
                  <FaMapMarkerAlt className="me-2" />
                  {property.location}
                </p>
              </div>
              <Button
                variant={isFavorite ? "danger" : "outline-danger"}
                className="rounded-circle p-2"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <FaHeart size={20} />
              </Button>
            </div>

            {/* Key Features */}
            <div className="d-flex gap-4 mb-4 text-muted">
              <div>
                <FaBed className="me-2" />
                {property.bedrooms} Bedrooms
              </div>
              <div>
                <FaBath className="me-2" />
                {property.bathrooms} Bathrooms
              </div>
              <div>{property.size}</div>
            </div>

            {/* Description */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h4 className="mb-3 fw-bold">About this place</h4>
                <p className="text-muted">{property.description}</p>
              </Card.Body>
            </Card>

            {/* Amenities */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h4 className="mb-3 fw-bold">What this place offers</h4>
                <Row className="g-4">
                  {property.amenities.map((amenity, index) => (
                    <Col md={6} key={index}>
                      <div className="d-flex align-items-center text-muted">
                        <span className="me-3">{amenity.icon}</span>
                        {amenity.name}
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            {/* Reviews */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <div className="d-flex align-items-center mb-4">
                  <FaStar className="text-warning me-2" size={24} />
                  <h4 className="mb-0 fw-bold">{property.rating} · {property.reviews} reviews</h4>
                </div>
                {property.reviews_list.map((review, index) => (
                  <div key={index} className="mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <FaUserCircle size={40} className="me-3 text-muted" />
                      <div>
                        <h6 className="mb-0 fw-bold">{review.user}</h6>
                        <small className="text-muted">{review.date}</small>
                      </div>
                    </div>
                    <p className="mb-0 text-muted">{review.comment}</p>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Booking Card */}
            <Card className="border-0 shadow-sm sticky-top" style={{ top: "10rem" }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <span className="h3 fw-bold">${property.price}</span>
                    <span className="text-muted">/night</span>
                  </div>
                  <div>
                    <FaStar className="text-warning me-1" />
                    <span>{property.rating}</span>
                    <span className="text-muted">({property.reviews})</span>
                  </div>
                </div>

                {/* Date Picker */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Check-in</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Select check-in date"
                    className="form-control"
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold">Check-out</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="Select check-out date"
                    className="form-control"
                  />
                </div>

                <Button
                  variant="primary"
                  className="w-100 mb-3 fw-bold"
                  style={{
                    backgroundColor: "#0044cc",
                    borderColor: "#0044cc",
                  }}
                >
                  Reserve now
                </Button>

                {/* Host Information */}
                <div className="border-top pt-4 mt-4">
                  <div className="d-flex align-items-center mb-3">
                    <FaUserCircle size={48} className="me-3 text-muted" />
                    <div>
                      <h5 className="mb-0 fw-bold">Hosted by {property.host.name}</h5>
                      {property.host.superhost && <Badge bg="dark">Superhost</Badge>}
                    </div>
                  </div>
                  <div className="text-muted mb-2">
                    <div>Response rate: {property.host.response_rate}%</div>
                    <div>Response time: {property.host.response_time}</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PropertyDetailPage;