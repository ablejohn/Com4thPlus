import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { FaBed, FaBath, FaMapMarkerAlt, FaStar, FaHeart, FaWifi, FaCar, FaSwimmingPool, FaDumbbell } from "react-icons/fa";
import { Container, Row, Col, Form, Button, Pagination, Badge, Placeholder } from "react-bootstrap";

const PropertiesPage = () => {
  // Enhanced sample data with more details
  const propertiesData = [
    {
      id: 1,
      image: "appartment1.jpg",
      title: "Luxury Apartment with City View",
      location: "Manhattan, New York",
      price: 2500,
      bedrooms: 3,
      bathrooms: 2,
      rating: 4.8,
      reviews: 124,
      type: "Apartment",
      amenities: ["Parking", "Gym", "Pool", "WiFi"],
      superhost: true,
      size: "1,200 sq ft",
    },
    {
      id: 2,
      image: "appartment1.jpg",
      title: "Beachfront Cottage with Ocean Views",
      location: "Malibu, California",
      price: 3800,
      bedrooms: 2,
      bathrooms: 2,
      rating: 4.9,
      reviews: 89,
      type: "Cottage",
      amenities: ["Beach Access", "WiFi", "Parking"],
      superhost: false,
      size: "900 sq ft",
    },
    {
      id: 3,
      image: "appartment1.jpg",
      title: "Modern Villa with Infinity Pool",
      location: "Beverly Hills, Los Angeles",
      price: 5500,
      bedrooms: 4,
      bathrooms: 3,
      rating: 4.95,
      reviews: 156,
      type: "Villa",
      amenities: ["Pool", "Garden", "Smart Home", "Gym"],
      superhost: true,
      size: "3,500 sq ft",
    },
  ];

  // States
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    type: "",
    bedrooms: "",
    amenities: new Set(),
  });
  const [sortBy, setSortBy] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const propertiesPerPage = 6;

  // Available amenities
  const availableAmenities = [
    { icon: <FaWifi />, name: "WiFi" },
    { icon: <FaCar />, name: "Parking" },
    { icon: <FaSwimmingPool />, name: "Pool" },
    { icon: <FaDumbbell />, name: "Gym" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort properties
  const filteredProperties = propertiesData
    .filter((property) => {
      const locationMatch = !filters.location || 
        property.location.toLowerCase().includes(filters.location.toLowerCase());
      const minPriceMatch = !filters.minPrice || property.price >= parseInt(filters.minPrice);
      const maxPriceMatch = !filters.maxPrice || property.price <= parseInt(filters.maxPrice);
      const typeMatch = !filters.type || property.type === filters.type;
      const bedroomsMatch = !filters.bedrooms || property.bedrooms >= parseInt(filters.bedrooms);
      const amenitiesMatch = filters.amenities.size === 0 || 
        [...filters.amenities].every(amenity => property.amenities.includes(amenity));
      
      return locationMatch && minPriceMatch && maxPriceMatch && typeMatch && 
             bedroomsMatch && amenitiesMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "recommended":
          return (b.rating * b.reviews) - (a.rating * a.reviews);
        default:
          return 0;
      }
    });

  const currentProperties = filteredProperties.slice(
    (currentPage - 1) * propertiesPerPage,
    currentPage * propertiesPerPage
  );

  const toggleFavorite = (propertyId, event) => {
    event.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  const PropertyCard = ({ property, isLoading }) => {
    if (isLoading) {
      return (
        <div className="property-card card border-0 h-100 shadow-sm">
          <Placeholder as="div" animation="glow">
            <Placeholder xs={12} style={{ height: "300px" }} />
          </Placeholder>
          <div className="card-body p-4">
            <Placeholder as="h5" animation="glow">
              <Placeholder xs={8} />
            </Placeholder>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={6} /> <Placeholder xs={4} />
            </Placeholder>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={4} /> <Placeholder xs={3} />
            </Placeholder>
          </div>
        </div>
      );
    }

    return (
      <Link to={`/propertydetail`} style={{ textDecoration: "none", color: "inherit" }}>
        <div
          className="property-card card border-0 h-100"
          style={{
            transition: "all 0.3s ease",
            cursor: "pointer",
            borderRadius: "16px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
          }}
        >
          <div className="position-relative">
            {property.superhost && (
              <Badge 
                bg="dark" 
                className="position-absolute"
                style={{ top: "20px", left: "20px", zIndex: 1 }}
              >
                SUPERHOST
              </Badge>
            )}
            <Button
              variant="light"
              className="position-absolute rounded-circle p-2"
              style={{ 
                top: "20px", 
                right: "20px", 
                zIndex: 1,
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onClick={(e) => toggleFavorite(property.id, e)}
            >
              <FaHeart 
                size={20} 
                color={favorites.has(property.id) ? "#FF385C" : "#484848"} 
              />
            </Button>
            <img
              src={property.image}
              alt={property.title}
              className="card-img-top"
              style={{ 
                height: "300px", 
                objectFit: "cover", 
                borderRadius: "16px"
              }}
            />
          </div>
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h5 className="card-title mb-0 fw-bold">{property.title}</h5>
              <div className="d-flex align-items-center">
                <FaStar className="text-warning me-1" />
                <span>{property.rating}</span>
                <span className="text-muted ms-1">({property.reviews})</span>
              </div>
            </div>
            <p className="card-text text-muted mb-2">
              <FaMapMarkerAlt className="me-2" />
              {property.location}
            </p>
            <div className="d-flex justify-content-between text-muted mb-3">
              <span>
                <FaBed className="me-2" />{property.bedrooms} Beds
              </span>
              <span>
                <FaBath className="me-2" />{property.bathrooms} Baths
              </span>
              <span>{property.size}</span>
            </div>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {property.amenities.map((amenity, index) => (
                <Badge 
                  bg="light" 
                  text="dark" 
                  className="py-2 px-3" 
                  key={index}
                  style={{ borderRadius: "20px" }}
                >
                  {amenity}
                </Badge>
              ))}
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="h4 fw-bold">${property.price}</span>
                <span className="text-muted">/night</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="bg-light min-vh-100 cont">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <Container className="py-4">
          <h1 className="display-4 fw-bold text-center mb-2">
            Find Your Perfect Stay
          </h1>
          <p className="text-muted text-center mb-5">
            Explore our curated collection of exceptional properties
          </p>
        </Container>
      </div>

      <Container className="py-5">
        {/* Filters Section */}
        <div className="bg-white rounded-4 shadow-sm p-4 mb-5">
          <Row className="g-4">
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-bold">Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Where are you going?"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="border-0 bg-light"
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label className="fw-bold">Min Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="$"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="border-0 bg-light"
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label className="fw-bold">Max Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="$"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="border-0 bg-light"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-bold">Property Type</Form.Label>
                <Form.Select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="border-0 bg-light"
                >
                  <option value="">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Cottage">Cottage</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button 
                variant="primary" 
                className="w-100"
                style={{ 
                  backgroundColor: "#0044cc",
                  borderColor: "#0044cc",
                  borderRadius: "8px"
                }}
              >
                Search
              </Button>
            </Col>
          </Row>

          {/* Amenities Filter */}
          <div className="mt-4">
            <p className="fw-bold mb-3">Amenities</p>
            <div className="d-flex flex-wrap gap-3">
              {availableAmenities.map((amenity, index) => (
                <Button
                  key={index}
                  variant={filters.amenities.has(amenity.name) ? "dark" : "outline-dark"}
                  className="rounded-pill px-4 py-2"
                  onClick={() => {
                    const newAmenities = new Set(filters.amenities);
                    if (newAmenities.has(amenity.name)) {
                      newAmenities.delete(amenity.name);
                    } else {
                      newAmenities.add(amenity.name);
                    }
                    setFilters({ ...filters, amenities: newAmenities });
                  }}
                >
                  <span className="me-2">{amenity.icon}</span>
                  {amenity.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Sort Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="text-muted">
            {filteredProperties.length} properties found
          </div>
          <Form.Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-auto ms-3"
            style={{ borderRadius: "8px" }}
          >
            <option value="recommended">Recommended</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="rating">Top Rated</option>
          </Form.Select>
        </div>

        {/* Properties Grid */}
        <Row className="g-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Col key={index} lg={4} md={6}>
                <PropertyCard isLoading={true} />
              </Col>
            ))
          ) : currentProperties.length > 0 ? (
            currentProperties.map((property) => (
              <Col key={property.id} lg={4} md={6}>
                <PropertyCard property={property} isLoading={false} />
              </Col>
            ))
          ) : (
            <Col xs={12} className="text-center py-5">
              <div className="mb-4">
                <FaSearch size={48} className="text-muted" />
              </div>
              <h3 className="mb-3">No properties found</h3>
              <p className="text-muted mb-4">
                Try adjusting your search criteria to find more properties
              </p>
              <Button 
                variant="outline-primary" 
                onClick={() => {
                  setFilters({
                    location: "",
                    minPrice: "",
                    maxPrice: "",
                    type: "",
                    bedrooms: "",
                    amenities: new Set()
                  });
                  setSortBy("recommended");
                }}
                style={{ borderRadius: "8px" }}
              >
                Clear All Filters
              </Button>
            </Col>
          )}
        </Row>

        {/* Pagination */}
        {filteredProperties.length > propertiesPerPage && (
          <div className="d-flex justify-content-center mt-5">
            <Pagination className="gap-2">
              <Pagination.First 
                onClick={() => setCurrentPage(1)} 
                disabled={currentPage === 1}
                className="rounded"
              />
              <Pagination.Prev 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded"
              />
              {Array.from({ 
                length: Math.min(
                  5,
                  Math.ceil(filteredProperties.length / propertiesPerPage)
                )
              }).map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className="rounded"
                  style={{
                    backgroundColor: currentPage === index + 1 ? "#FF385C" : "white",
                    borderColor: currentPage === index + 1 ? "#FF385C" : "#dee2e6"
                  }}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next 
                onClick={() => setCurrentPage(prev => 
                  Math.min(prev + 1, Math.ceil(filteredProperties.length / propertiesPerPage))
                )}
                disabled={currentPage === Math.ceil(filteredProperties.length / propertiesPerPage)}
                className="rounded"
              />
              <Pagination.Last 
                onClick={() => setCurrentPage(Math.ceil(filteredProperties.length / propertiesPerPage))}
                disabled={currentPage === Math.ceil(filteredProperties.length / propertiesPerPage)}
                className="rounded"
              />
            </Pagination>
          </div>
        )}

        {/* Newsletter Section */}
        <div className="bg-white rounded-4 shadow-sm p-5 mt-5 text-center">
          <h3 className="mb-3">Get the Best Properties in Your Inbox</h3>
          <p className="text-muted mb-4">
            Subscribe to our newsletter and never miss our new properties and special offers
          </p>
          <Row className="justify-content-center">
            <Col md={6}>
              <Form className="d-flex gap-2">
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  className="border-0 bg-light"
                  style={{ borderRadius: "8px" }}
                />
                <Button 
                  variant="primary"
                  style={{ 
                    backgroundColor: "#0044cc",
                    borderColor: "#0044cc",
                    borderRadius: "8px"
                  }}
                >
                  Subscribe
                </Button>
              </Form>
            </Col>
          </Row>
        </div>
      </Container>

      {/* Custom CSS */}
      <style jsx>{`
        .property-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .btn-primary:hover {
          background-color: #0044cc !important;
          border-color: #0044cc !important;
        }
        
        .form-control:focus, .form-select:focus {
          box-shadow: 0 0 0 2px rgba(255, 56, 92, 0.25);
          border-color: #0044cc;
        }

        .cont{
          margin-top: 150px;
        }
        
        .pagination .page-link {
          border-radius: 8px;
          margin: 0 4px;
          color: #484848;
        }
        
        .pagination .page-item.active .page-link {
          background-color: #0044cc;
          border-color: #0044cc;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default PropertiesPage;