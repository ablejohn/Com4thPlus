import React from 'react';
import { Star, ArrowRight, Phone, Calendar, MapPin } from 'lucide-react';

const LuxuryProperty = () => {
  const property = {
    title: "Exclusive 5-Bedroom Luxury Suite",
    location: "GRA Ikeja, Lagos",
    description: "Experience unparalleled luxury in this meticulously designed residence featuring premium finishes, smart home technology, and breathtaking views. Complete with a private garden and 24/7 concierge service.",
    price: 899,
    rating: 4.9,
    amenities: [
      "Private Pool",
      "Smart Home System",
      "24/7 Security",
      "Concierge Service"
    ]
  };

  return (
    <div className="bg-white py-5">
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 mb-3 rounded-pill">
            Premium Property
          </span>
          <h2 className="display-5 fw-bold mb-3">{property.title}</h2>
          <p className="text-muted">
            <MapPin className="inline-block me-2" size={18} />
            {property.location}
          </p>
        </div>

        {/* Main Card */}
        <div className="card border-0 shadow-lg overflow-hidden rounded-4">
          {/* Image Section */}
          <div className="position-relative">
            <img
              src="appartment2.jpg"
              className="card-img-top"
              alt="Luxury Property"
              style={{ height: '400px', objectFit: 'cover', width: '100%' }}
            />
            <div className="position-absolute top-0 end-0 m-3">
              <span className="badge bg-dark bg-opacity-75 px-3 py-2 fs-6 rounded-pill">
                5 Bedrooms
              </span>
            </div>
          </div>

          <div className="card-body p-4">
            {/* Rating Section */}
            <div className="d-flex align-items-center mb-3">
              <div className="text-warning me-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="me-1"
                    size={20}
                    fill={i < Math.floor(property.rating) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-muted">
                {property.rating} Exceptional
              </span>
            </div>

            {/* Description */}
            <p className="card-text mb-4 text-muted">
              {property.description}
            </p>

            {/* Amenities */}
            <div className="row g-3 mb-4">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="col-md-6">
                  <div className="d-flex align-items-center p-3 rounded-4 bg-light">
                    <div className="flex-shrink-0">
                      <div className="rounded-circle bg-primary bg-opacity-10 p-2" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star className="text-primary" size={18} />
                      </div>
                    </div>
                    <div className="ms-3">
                      <p className="mb-0">{amenity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price and Actions */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h3 className="mb-0 text-primary">
                  ${property.price}
                  <small className="text-muted fs-6">/night</small>
                </h3>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-outline-primary rounded-pill d-flex align-items-center gap-2 px-3 py-2">
                  <Phone size={18} />
                  <span>Contact</span>
                </button>
                <button className="btn btn-outline-primary rounded-pill d-flex align-items-center gap-2 px-3 py-2">
                  <Calendar size={18} />
                  <span>Schedule Tour</span>
                </button>
                <button className="btn btn-primary rounded-pill d-flex align-items-center gap-2 px-3 py-2">
                  <span>Book Now</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuxuryProperty;