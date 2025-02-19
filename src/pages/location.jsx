import React, { useEffect } from "react";
import { MapPin, Navigation2, Car, Train, Bus, Plane } from "lucide-react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LocationPage = () => {
  const coordinates = {
    lat: 6.576191,
    lng: 3.3586809,
    address:
      "ODUDUWA STREET, BY BOND HOTEL, NEAR INSIGHT COMMUNICATIONS, GRA, IKEJA LAGOS STATE.",
  };

  useEffect(() => {
    // Fix for the marker icon issue
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    // Initialize map
    const map = L.map("map").setView([coordinates.lat, coordinates.lng], 15);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Add marker for the apartment location
    const marker = L.marker([coordinates.lat, coordinates.lng]).addTo(map);
    marker
      .bindPopup(`<b>Our Location</b><br>${coordinates.address}`)
      .openPopup();

    // Cleanup function
    return () => {
      map.remove();
    };
  }, []);

  const nearbyAttractions = [
    {
      name: "Kalakuta Museum",
      distance: "0.7 miles",
      walkingTime: "12 mins",
      type: "Museum",
    },
    {
      name: "Ndubuisi Kanu Park",
      distance: "0.9 miles",
      walkingTime: "18 mins",
      type: "Park",
    },
    {
      name: "Ikeja City Mall",
      distance: "1.0 miles",
      walkingTime: "20 mins",
      type: "Shopping",
    },
    {
      name: "Johnson Jakande Tinubu Park",
      distance: "1.2 miles",
      walkingTime: "25 mins",
      type: "Park",
    },
  ];

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

  return (
    <div className="container py-5">
      {/* Header Section */}
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3 text-primary">Our Location</h1>
        <div className="d-flex align-items-center justify-content-center gap-2 text-muted">
          <MapPin size={24} className="text-primary" />
          <p className="fs-5 mb-0">{coordinates.address}</p>
        </div>
      </header>

      {/* Map Section */}
      <div className="card shadow-sm mb-5">
        <div className="card-body p-0">
          <div id="map" style={{ height: "400px", width: "100%" }}></div>
        </div>
      </div>

      {/* Transportation Options */}
      <section className="mb-5">
        <h2 className="fs-2 fw-bold mb-4">Getting Here</h2>
        <div className="row g-4">
          {transportOptions.map((option, index) => (
            <div key={index} className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm hover-shadow-md transition">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    {option.icon}
                    <h3 className="fs-5 fw-semibold mb-0">{option.type}</h3>
                  </div>
                  <p className="text-body fw-medium mb-2">{option.details}</p>
                  <p className="text-muted small mb-0">{option.additional}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nearby Attractions */}
      <section className="mb-5">
        <h2 className="fs-2 fw-bold mb-4">Nearby Attractions</h2>
        <div className="row g-4">
          {nearbyAttractions.map((attraction, index) => (
            <div key={index} className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm hover-shadow-md transition">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h3 className="fs-5 fw-semibold mb-0">{attraction.name}</h3>
                    <span className="badge bg-primary">{attraction.type}</span>
                  </div>
                  <div className="text-body">
                    <p className="mb-1">Distance: {attraction.distance}</p>
                    <p className="mb-0">Walking: {attraction.walkingTime}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-light rounded-3 p-5 text-center">
        <h2 className="fs-2 fw-bold mb-3">Need Directions?</h2>
        <p className="text-muted mb-4">
          Our team is available 24/7 to help you with directions and
          transportation arrangements.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/contact" className="btn btn-primary btn-lg px-4">
            Contact Us
          </Link>
        </div>
      </section>

      <style jsx>{`
        .hover-shadow-md {
          transition: box-shadow 0.3s ease;
        }
        .hover-shadow-md:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .transition {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default LocationPage;
