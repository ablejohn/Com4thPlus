import React from 'react';
import { Star, ArrowRight, Phone, Calendar, MapPin, Shield, Wifi, Coffee } from 'lucide-react';

const LuxuryProperty = () => {
  const property = {
    title: "Exclusive 5-Bedroom Luxury Suite",
    location: "GRA Ikeja, Lagos",
    description: "Experience unparalleled luxury in this meticulously designed residence featuring premium finishes, smart home technology, and breathtaking views. Complete with a private garden and 24/7 concierge service.",
    price: 899,
    rating: 4.9,
    features: ["5 Bedrooms", "4 Bathrooms", "7,500 sq ft", "Built 2022"],
    amenities: [
      { name: "Private Pool", icon: <Shield size={18} /> },
      { name: "Smart Home", icon: <Wifi size={18} /> },
      { name: "24/7 Security", icon: <Shield size={18} /> },
      { name: "Concierge", icon: <Coffee size={18} /> }
    ]
  };

  return (
    <div className="py-5 bg-light">
      <div className="container">
        {/* Single Hero Image */}
        <div className="position-relative mb-5 rounded overflow-hidden shadow">
          <img 
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Luxury Property" 
            className="img-fluid w-100" 
            style={{ height: "400px", objectFit: "cover" }}
          />
          <div className="position-absolute top-0 start-0 m-3">
            <span className="badge bg-info text-white px-3 py-2 rounded-pill">
              🌟 Premium Property
            </span>
          </div>
        </div>

        {/* Property Details */}
        <div className="row g-4">
          {/* Main Content */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                {/* Header */}
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                  <div>
                    <h1 className="h2 fw-bold text-info mb-2">{property.title}</h1>
                    <p className="d-flex align-items-center text-muted mb-0">
                      <MapPin size={16} className="me-2" />
                      <span>{property.location}</span>
                    </p>
                  </div>
                  <div className="d-flex align-items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < Math.floor(property.rating) ? "#FFD700" : "none"}
                        color="#FFD700"
                        className="me-1"
                      />
                    ))}
                    <span className="text-muted ms-1">{property.rating}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {property.features.map((feature, index) => (
                    <span key={index} className="badge bg-light text-info border border-info rounded-pill">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <div className="mb-4">
                  <h2 className="h5 fw-semibold text-info mb-3">About This Property</h2>
                  <p className="text-muted mb-0">{property.description}</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="h5 fw-semibold text-info mb-4">Premium Amenities</h2>
                <div className="row g-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="col-md-6">
                      <div className="d-flex align-items-center p-3 border rounded">
                        <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center" 
                             style={{ width: '48px', height: '48px' }}>
                          {amenity.icon}
                        </div>
                        <span className="ms-3 fw-medium text-info">{amenity.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm position-sticky" style={{ top: "1rem" }}>
              <div className="card-body p-4">
                <div className="mb-4">
                  <h3 className="h4 fw-bold text-info">
                    ${property.price}
                    <span className="text-muted fs-6 fw-normal">/night</span>
                  </h3>
                </div>

                <div className="d-grid gap-3 mb-4">
                  <button className="btn btn-info text-white rounded-pill d-flex align-items-center justify-content-center">
                    <span className="fw-medium">Book Now</span>
                    <ArrowRight size={18} className="ms-2" />
                  </button>

                  <button className="btn btn-outline-info rounded-pill d-flex align-items-center justify-content-center">
                    <Calendar size={18} className="me-2" />
                    <span className="fw-medium">Schedule Tour</span>
                  </button>

                  <button className="btn btn-outline-secondary rounded-pill d-flex align-items-center justify-content-center">
                    <Phone size={18} className="me-2" />
                    <span className="fw-medium">Contact Agent</span>
                  </button>
                </div>

                <div className="alert alert-light text-center text-muted small mb-0">
                  Secure payment • 24/7 support • Free cancellation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuxuryProperty;