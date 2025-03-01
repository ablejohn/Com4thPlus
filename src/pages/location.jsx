import React, { useEffect, useRef } from "react";
import { MapPin, Navigation2, Car, Train, Bus, Plane } from "lucide-react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LocationPage = () => {
  // Use ref to prevent recreating the map on re-renders
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const coordinates = {
    lat: 6.576191,
    lng: 3.3586809,
    address: "ODUDUWA STREET, BY BOND HOTEL, NEAR INSIGHT COMMUNICATIONS, GRA, IKEJA LAGOS STATE.",
  };

  // Transportation options data
  const transportOptions = [
    {
      type: "Bus",
      icon: <Bus className="text-primary" size={24} />,
      details: "Routes 23, 45 - 3 min walk",
      additional: "24/7 service available",
    },
    {
      type: "Airport",
      icon: <Plane className="text-primary" size={24} />,
      details: "30 min drive",
      additional: "Direct airport shuttle available",
    },
    {
      type: "Parking",
      icon: <Car className="text-primary" size={24} />,
      details: "On-site parking available",
      additional: "Secured with 24/7 surveillance",
    },
    {
      type: "Ride-Hailing",
      icon: <Car className="text-primary" size={24} />,
      details: "Uber, Bolt available",
      additional: "Convenient for quick trips",
    },
    {
      type: "BRT (Bus Rapid Transit)",
      icon: <Bus className="text-primary" size={24} />,
      details: "Multiple routes - 4 min walk",
      additional: "Dedicated lanes for faster travel",
    },
    {
      type: "Danfo Buses",
      icon: <Bus className="text-primary" size={24} />,
      details: "Various routes - 2 min walk",
      additional: "Affordable and widely available",
    },
  ];

  // Nearby attractions data
  const nearbyAttractions = [
    {
      name: "Kalakuta Museum",
      distance: "0.7 miles",
      walkingTime: "12 mins",
      type: "Museum",
      description: "Former home of Fela Kuti, showcasing his life and musical legacy.",
      image: "kalakuta.jpg",
    },
    {
      name: "Ndubuisi Kanu Park",
      distance: "0.9 miles",
      walkingTime: "18 mins",
      type: "Park",
      description: "Beautiful green space perfect for relaxation and outdoor activities.",
      image: "kanu.jpg",
    },
    {
      name: "Ikeja City Mall",
      distance: "1.0 miles",
      walkingTime: "20 mins",
      type: "Shopping",
      description: "Premier shopping destination with international and local brands.",
      image: "ikeja.jpg",
    },
    {
      name: "Johnson Jakande Tinubu Park",
      distance: "1.2 miles",
      walkingTime: "25 mins",
      type: "Park",
      description: "Scenic recreational area with walking paths and sitting areas.",
      image: "john.jpg",
    },
  ];

  // Initialize the map
  useEffect(() => {
    // Fix for the marker icon issue in Leaflet
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    // If the map container exists and we haven't created a map yet
    if (mapRef.current && !mapInstanceRef.current) {
      // Create the map instance
      mapInstanceRef.current = L.map(mapRef.current).setView([coordinates.lat, coordinates.lng], 15);

      // Add the tile layer (map style)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);

      // Add a standard marker
      const marker = L.marker([coordinates.lat, coordinates.lng]).addTo(mapInstanceRef.current);
      marker.bindPopup(`<b>Our Location</b><br>${coordinates.address}`).openPopup();

      // Add a circle to show approximate area
      L.circle([coordinates.lat, coordinates.lng], {
        color: '#007bff',
        fillColor: '#007bff',
        fillOpacity: 0.1,
        radius: 500
      }).addTo(mapInstanceRef.current);
    }

    // Cleanup function to properly remove the map when component unmounts
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Get directions function
  const getDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`);
  };

  return (
    <div className="location-page">
      {/* Custom CSS */}
      <style>
        {`
          .location-page .hero-banner {
            background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), 
                        url('/api/placeholder/1200/300') center/cover no-repeat;
            background-color: #2c3e50;
            padding: 80px 0;
            color: white;
          }
          
          .feature-card {
            transition: all 0.3s ease;
            border: none;
            border-radius: 0.5rem;
            overflow: hidden;
          }
          
          .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }
          
          .icon-circle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: rgba(13, 110, 253, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
          }
          
          .transport-card {
            transition: all 0.3s ease;
            border-bottom: 3px solid transparent;
          }
          
          .transport-card:hover {
            border-bottom: 3px solid #0d6efd;
            transform: translateY(-3px);
          }
          
          .attraction-img {
            height: 180px;
            object-fit: cover;
          }
          
          .section-heading {
            position: relative;
            padding-bottom: 15px;
            margin-bottom: 30px;
          }
          
          .section-heading:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 50px;
            height: 3px;
            background-color: #0d6efd;
          }
          
          .directions-card {
            background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
            color: white;
            border-radius: 1rem;
          }
        `}
      </style>

      {/* Hero Banner */}
      <div className="hero-banner mb-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Find Us in Lagos</h1>
          <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
            <MapPin size={24} className="text-primary" />
            <p className="fs-5 mb-0 text-light">{coordinates.address}</p>
          </div>
          <button className="btn btn-primary btn-lg px-4 py-2" onClick={getDirections}>
            <Navigation2 size={18} className="me-2" />
            Get Directions
          </button>
        </div>
      </div>

      <div className="container pb-5">
        {/* Map Section */}
        <section className="mb-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="section-heading">Our Location</h2>
              <p className="lead mb-4">
                We're conveniently located in the heart of Ikeja GRA, one of Lagos' most prestigious neighborhoods, 
                providing easy access to major attractions and transport hubs.
              </p>
              <div className="bg-light p-4 rounded">
                <div className="d-flex mb-3">
                  <div className="me-3 text-primary">
                    <i className="bi bi-geo-alt-fill fs-4"></i>
                  </div>
                  <div>
                    <h5 className="mb-1">Address</h5>
                    <p className="mb-0">{coordinates.address}</p>
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div className="me-3 text-primary">
                    <i className="bi bi-telephone-fill fs-4"></i>
                  </div>
                  <div>
                    <h5 className="mb-1">Phone</h5>
                    <p className="mb-0">+234 123 456 7890</p>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="me-3 text-primary">
                    <i className="bi bi-envelope-fill fs-4"></i>
                  </div>
                  <div>
                    <h5 className="mb-1">Email</h5>
                    <p className="mb-0">info@location.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card shadow">
                <div className="card-body p-0">
                  {/* Map container with ref instead of id */}
                  <div ref={mapRef} style={{ height: "450px", width: "100%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transportation Options */}
        <section className="mb-5">
          <h2 className="section-heading">Getting Here</h2>
          <div className="row g-4">
            {transportOptions.map((option, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="card transport-card h-100 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="icon-circle">
                        {option.icon}
                      </div>
                      <h3 className="fs-5 fw-semibold mb-0">{option.type}</h3>
                    </div>
                    <p className="fw-medium mb-2">{option.details}</p>
                    <p className="text-muted small mb-0">{option.additional}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nearby Attractions */}
        <section className="mb-5">
          <h2 className="section-heading">Nearby Attractions</h2>
          <div className="row g-4">
            {nearbyAttractions.map((attraction, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="card feature-card h-100 shadow">
                  <img 
                    src={attraction.image} 
                    alt={attraction.name} 
                    className="card-img-top attraction-img" 
                  />
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h4 className="fs-5 fw-semibold mb-0">{attraction.name}</h4>
                      <span className="badge bg-primary">{attraction.type}</span>
                    </div>
                    <p className="text-muted mb-3 small">{attraction.description}</p>
                    <div className="d-flex justify-content-between mt-3">
                      <div>
                        <i className="bi bi-geo-alt me-1 text-primary"></i>
                        <small>{attraction.distance}</small>
                      </div>
                      <div>
                        <i className="bi bi-stopwatch me-1 text-primary"></i>
                        <small>{attraction.walkingTime}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Box */}
        <section>
          <div className="directions-card p-5">
            <div className="row align-items-center">
              <div className="col-lg-8 mb-4 mb-lg-0">
                <h2 className="fs-2 fw-bold mb-3">Need Directions or Help?</h2>
                <p className="mb-0 opacity-75">
                  Our team is available 24/7 to help you with directions, transportation arrangements, 
                  or any other assistance you may need.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link to="/contact" className="btn btn-light btn-lg px-4">
                  Contact Us
                </Link>
                <button 
                  className="btn btn-outline-light btn-lg px-4 ms-2"
                  onClick={getDirections}
                >
                  <Navigation2 size={18} className="me-2" />
                  Directions
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LocationPage;