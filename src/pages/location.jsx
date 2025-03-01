import React, { useEffect, useRef, useState } from "react";
import { MapPin, Navigation2, Car, Train, Bus, Plane } from "lucide-react";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Constants 
const LOCATION_COORDINATES = {
  lat: 6.576191,
  lng: 3.3586809,
  address: "ODUDUWA STREET, BY BOND HOTEL, NEAR INSIGHT COMMUNICATIONS, GRA, IKEJA LAGOS STATE.",
  phone: "+2348143183494",
  email: "info@com4thplus.com"
};

// Component for transportation option card
const TransportCard = ({ option }) => (
  <div className="transport-card h-100 position-relative">
    <div className="card-body">
      <div className="d-flex flex-column align-items-center text-center mb-3">
        <div className="icon-circle">
          {option.icon}
        </div>
        <h3 className="fs-5 fw-bold mb-0">{option.type}</h3>
      </div>
      <p className="fw-medium mb-2 text-center">{option.details}</p>
      <p className="text-muted small mb-0 text-center">{option.additional}</p>
    </div>
  </div>
);

// Component for attraction card
const AttractionCard = ({ attraction }) => (
  <div className="attraction-card h-100">
    <div className="overflow-hidden">
      <img 
        src={attraction.image} 
        alt={attraction.name} 
        className="attraction-img" 
      />
    </div>
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h4 className="fs-5 fw-bold mb-0">{attraction.name}</h4>
        <span className="badge-custom">{attraction.type}</span>
      </div>
      <p className="text-muted mb-3 small">{attraction.description}</p>
      <div className="d-flex justify-content-between mt-3">
        <div>
          <i className="bi bi-geo-alt me-1 primary-icon"></i>
          <small>{attraction.distance}</small>
        </div>
        <div>
          <i className="bi bi-stopwatch me-1 primary-icon"></i>
          <small>{attraction.walkingTime}</small>
        </div>
      </div>
    </div>
  </div>
);

// Contact Info component
const ContactInfo = () => (
  <div className="info-box">
    <div className="d-flex mb-3">
      <div className="info-icon">
        <i className="bi bi-geo-alt-fill"></i>
      </div>
      <div>
        <h5 className="mb-1 fw-bold">Address</h5>
        <p className="mb-0">{LOCATION_COORDINATES.address}</p>
      </div>
    </div>
    <div className="d-flex mb-3">
      <div className="info-icon">
        <i className="bi bi-telephone-fill"></i>
      </div>
      <div>
        <h5 className="mb-1 fw-bold">Phone</h5>
        <p className="mb-0">{LOCATION_COORDINATES.phone}</p>
      </div>
    </div>
    <div className="d-flex">
      <div className="info-icon">
        <i className="bi bi-envelope-fill"></i>
      </div>
      <div>
        <h5 className="mb-1 fw-bold">Email</h5>
        <p className="mb-0">{LOCATION_COORDINATES.email}</p>
      </div>
    </div>
  </div>
);

// Section component with animation
const AnimatedSection = ({ children, delay = 0, className = "" }) => {
  return (
    <section 
      className={`animate-on-scroll ${className}`} 
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
};

const LocationPage = () => {
  // Use ref to prevent recreating the map on re-renders
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Transportation options data
  const transportOptions = [
    {
      type: "Bus",
      icon: <Bus size={24} />,
      details: "Routes 23, 45 - 3 min walk",
      additional: "24/7 service available",
    },
    {
      type: "Airport",
      icon: <Plane size={24} />,
      details: "30 min drive",
      additional: "Direct airport shuttle available",
    },
    {
      type: "Parking",
      icon: <Car size={24} />,
      details: "On-site parking available",
      additional: "Secured with 24/7 surveillance",
    },
    {
      type: "Ride-Hailing",
      icon: <Car size={24} />,
      details: "Uber, Bolt available",
      additional: "Convenient for quick trips",
    },
    {
      type: "BRT (Bus Rapid Transit)",
      icon: <Bus size={24} />,
      details: "Multiple routes - 4 min walk",
      additional: "Dedicated lanes for faster travel",
    },
    {
      type: "Danfo Buses",
      icon: <Bus size={24} />,
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

    // Initialize map if container exists and map isn't created yet
    if (mapRef.current && !mapInstanceRef.current) {
      initializeMap();
    }

    // Add scroll event listener for animations
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Initialize Leaflet map
  const initializeMap = () => {
    // Create the map instance
    mapInstanceRef.current = L.map(mapRef.current, {
      zoomControl: false,  // Hide default zoom controls for cleaner interface
      attributionControl: false  // Hide attribution for cleaner look
    }).setView(
      [LOCATION_COORDINATES.lat, LOCATION_COORDINATES.lng], 
      15
    );

    // Add the tile layer (map style) - using a more minimalist style
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: "© OpenStreetMap contributors, © CARTO",
    }).addTo(mapInstanceRef.current);

    // Custom zoom control position
    L.control.zoom({
      position: 'bottomright'
    }).addTo(mapInstanceRef.current);

    // Add a standard marker with custom color
    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `<div class="marker-icon"><i class="bi bi-geo-alt-fill"></i></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
    
    const marker = L.marker(
      [LOCATION_COORDINATES.lat, LOCATION_COORDINATES.lng], 
      { icon: customIcon }
    ).addTo(mapInstanceRef.current);
    
    marker.bindPopup(`<b>Our Location</b><br>${LOCATION_COORDINATES.address}`).openPopup();

    // Add a circle to show approximate area
    L.circle(
      [LOCATION_COORDINATES.lat, LOCATION_COORDINATES.lng], 
      {
        color: '#40E0D0',
        fillColor: '#40E0D0',
        fillOpacity: 0.08,
        radius: 500
      }
    ).addTo(mapInstanceRef.current);
  };

  // Handle scroll for animations
  const handleScroll = () => {
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    
    scrollElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('is-visible');
      }
    });
    
    if (window.scrollY > 100) {
      setIsVisible(true);
    }
  };

  // Get directions function
  const getDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${LOCATION_COORDINATES.lat},${LOCATION_COORDINATES.lng}`);
  };

  return (
    <div className="location-page">
      {/* Styles */}
      <style>
        {`
          :root {
            --primary: #00A0A0;
            --primary-dark: #008080;
            --primary-light: rgba(0, 160, 160, 0.1);
            --primary-glow: rgba(0, 160, 160, 0.6);
            --secondary: #002060;
            --secondary-light: rgba(0, 32, 96, 0.85);
            --text-dark: #1A1A1A;
            --text-light: #6C757D;
            --text-muted: #90959A;
            --bg-light: #F8F9FA;
            --card-bg: #FFFFFF;
            --card-border: rgba(0, 0, 0, 0.08);
            --shadow-sm: 0 2px 10px rgba(0, 0, 0, 0.03);
            --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.05);
            --shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.07);
            --radius-sm: 4px;
            --radius-md: 8px;
            --radius-lg: 12px;
            --radius-round: 100px;
            --transition-fast: 0.25s ease;
            --transition-medium: 0.4s ease;
            --font-heading: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }
          
          .location-page {
            font-family: var(--font-body);
            color: var(--text-dark);
            background-color: var(--bg-light);
            overflow-x: hidden;
          }
          
          .location-page h1, .location-page h2, .location-page h3, .location-page h4, .location-page h5 {
            font-family: var(--font-heading);
          }
          
          .location-page .hero-banner {
            background: linear-gradient(to right, rgba(0, 32, 96, 0.95), rgba(0, 32, 96, 0.85)), 
                        url('/api/placeholder/1200/300') center/cover no-repeat;
            padding: 120px 0 100px;
            color: white;
            position: relative;
            overflow: hidden;
            border-bottom: 2px solid var(--primary);
          }
          
          .hero-banner::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
              radial-gradient(circle at 20% 80%, rgba(0, 160, 160, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(0, 160, 160, 0.08) 0%, transparent 50%);
            z-index: 1;
          }
          
          .hero-banner .container {
            position: relative;
            z-index: 2;
          }
          
          .hero-title {
            font-weight: 800;
            letter-spacing: -0.5px;
            margin-bottom: 1.5rem;
            font-size: 3.25rem;
            line-height: 1.1;
          }
          
          .hero-badge {
            display: inline-block;
            background-color: rgba(0, 160, 160, 0.12);
            color: #4BD0D0;
            font-weight: 600;
            font-size: 0.75rem;
            padding: 0.5rem 1.25rem;
            border-radius: var(--radius-round);
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-bottom: 1.5rem;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(0, 160, 160, 0.2);
          }
          
          .address-block {
            display: inline-flex;
            align-items: center;
            backdrop-filter: blur(8px);
            padding: 0.75rem 1.5rem;
            border-radius: var(--radius-round);
            border: 1px solid rgba(255, 255, 255, 0.08);
            margin-bottom: 2rem;
            max-width: 600px;
          }
          
          .btn-primary {
            display: inline-flex;
            align-items: center;
            background: var(--primary);
            color: white;
            font-weight: 600;
            padding: 0.75rem 1.75rem;
            border-radius: var(--radius-round);
            border: none;
            transition: all var(--transition-fast);
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 160, 160, 0.2);
          }
          
          .btn-primary::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
            transform: translateX(-100%);
            transition: transform 0.6s ease;
          }
          
          .btn-primary:hover {
            background: var(--primary-dark);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 160, 160, 0.25);
          }
          
          .btn-primary:hover::before {
            transform: translateX(100%);
          }
          
          .btn-outline {
            background: transparent;
            color: var(--primary);
            border: 1px solid var(--primary);
            font-weight: 600;
            padding: calc(0.75rem - 1px) calc(1.75rem - 1px);
            border-radius: var(--radius-round);
            transition: all var(--transition-fast);
          }
          
          .btn-outline:hover {
            background: rgba(0, 160, 160, 0.08);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 160, 160, 0.15);
          }
          
          .section-heading {
            position: relative;
            font-weight: 700;
            letter-spacing: -0.5px;
            padding-bottom: 1rem;
            margin-bottom: 2rem;
            color: var(--secondary);
            font-size: 2rem;
          }
          
          .section-heading::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 40px;
            height: 3px;
            background: var(--primary);
            border-radius: var(--radius-sm);
          }
          
          .transport-card {
            border-radius: var(--radius-md);
            border: 1px solid var(--card-border);
            transition: all var(--transition-medium);
            overflow: hidden;
            height: 100%;
            background: var(--card-bg);
            box-shadow: var(--shadow-sm);
          }
          
          .transport-card:hover {
            transform: translateY(-5px);
            border-color: rgba(0, 160, 160, 0.2);
            box-shadow: var(--shadow-md);
          }
          
          .icon-circle {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--primary-light);
            color: var(--primary);
            margin-bottom: 1rem;
            transition: all var(--transition-medium);
          }
          
          .transport-card:hover .icon-circle {
            transform: scale(1.05);
            background: var(--primary);
            color: white;
          }
          
          .transport-card::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            height: 2px;
            width: 100%;
            background: var(--primary);
            transform: scaleX(0);
            transform-origin: left;
            transition: transform var(--transition-medium);
          }
          
          .transport-card:hover::after {
            transform: scaleX(1);
          }
          
          .attraction-card {
            border-radius: var(--radius-md);
            overflow: hidden;
            height: 100%;
            transition: all var(--transition-medium);
            border: 1px solid var(--card-border);
            background: var(--card-bg);
            box-shadow: var(--shadow-sm);
          }
          
          .attraction-card:hover {
            transform: translateY(-5px);
            border-color: rgba(0, 160, 160, 0.2);
            box-shadow: var(--shadow-md);
          }
          
          .attraction-card .card-body {
            z-index: 2;
            position: relative;
            padding: 1.5rem;
          }
          
          .attraction-img {
            height: 180px;
            width: 100%;
            object-fit: cover;
            transition: transform var(--transition-medium);
          }
          
          .attraction-card:hover .attraction-img {
            transform: scale(1.05);
          }
          
          
          
         .info-box {
  background: var(--card-bg);
  border-radius: var(--radius-md);
  padding: 2rem;
  border: 1px solid var(--card-border);
  transition: all var(--transition-medium);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-box:hover {
  transform: translateY(-3px);
  border-color: rgba(0, 160, 160, 0.2);
  box-shadow: var(--shadow-md);
}

.info-box .d-flex {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.info-icon {
  width: 50px;
  height: 50px;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--transition-fast);
  font-size: 1.2rem;
  box-shadow: 0 2px 10px rgba(0, 160, 160, 0.1);
}

.info-box:hover .info-icon {
  background: var(--primary);
  color: white;
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 160, 160, 0.2);
}

.info-box h5 {
  margin-bottom: 0.35rem;
  color: var(--secondary);
  font-weight: 700;
}

.info-box p {
  margin-bottom: 0;
  color: var(--text-light);
}
        
          .contact-card {
            background: linear-gradient(120deg, var(--secondary) 0%, rgba(0, 32, 96, 0.95) 100%);
            color: white;
            border-radius: var(--radius-md);
            padding: 3rem;
            position: relative;
            overflow: hidden;
            z-index: 1;
            border: none;
            box-shadow: var(--shadow-lg);
          }
          
          .contact-card::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(0, 160, 160, 0.15) 0%, transparent 60%);
            opacity: 0.6;
            z-index: -1;
          }
          
          .map-container {
            border-radius: var(--radius-md);
            overflow: hidden;
            border: none;
            height: 450px;
            box-shadow: var(--shadow-md);
          }
          
          .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
          }
          
          .animate-on-scroll.is-visible {
            opacity: 1;
            transform: translateY(0);
          }
          
          .custom-map-marker .marker-icon {
            background: var(--primary);
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 10px rgba(0, 160, 160, 0.3);
          }
          
          .custom-map-marker .marker-icon i {
            transform: rotate(45deg);
            color: white;
            font-size: 16px;
          }
          
          .leaflet-popup-content-wrapper {
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-md);
          }
          
          .leaflet-popup-content {
            margin: 0.75rem 1rem;
            font-family: var(--font-body);
          }
          
          .section-separator {
            width: 100%;
            height: 1px;
            background: linear-gradient(to right, transparent, rgba(0, 160, 160, 0.15), transparent);
            margin: 4rem 0;
          }
          
          .contact-card .btn-primary {
            background: white;
            color: var(--secondary);
          }
          
          .contact-card .btn-primary:hover {
            background: rgba(255, 255, 255, 0.9);
            box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
          }
          
          .contact-card .btn-outline {
            color: white;
            border-color: rgba(255, 255, 255, 0.3);
          }
          
          .contact-card .btn-outline:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: white;
            box-shadow: 0 5px 15px rgba(255, 255, 255, 0.1);
          }
          
          .primary-icon {
            color: var(--primary);
          }
          
          .section-subtitle {
            color: var(--text-light);
            font-size: 1.1rem;
            max-width: 700px;
            margin-top: -1rem;
            margin-bottom: 2rem;
          }
          
          .card-body {
            padding: 1.75rem;
          }
          
          /* Scrollbar styling */
          .location-page::-webkit-scrollbar {
            width: 8px;
          }
          
          .location-page::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          
          .location-page::-webkit-scrollbar-thumb {
            background: var(--primary-light);
            border-radius: var(--radius-round);
          }
          
          .location-page::-webkit-scrollbar-thumb:hover {
            background: var(--primary);
          }
          
          /* Better typography */
          .lead {
            font-size: 1.1rem;
            font-weight: 400;
            line-height: 1.6;
            color: var(--text-light);
          }
          
          @media (max-width: 991px) {
            .container {
              padding-left: 1.5rem;
              padding-right: 1.5rem;
            }
            
            .hero-title {
              font-size: 2.5rem;
            }
            
            .section-heading {
              font-size: 1.75rem;
            }
          }
          
          @media (max-width: 767px) {
            .hero-title {
              font-size: 2rem;
            }
            
            .contact-card {
              padding: 2rem;
            }
            
            .map-container {
              height: 350px;
            }
            
            .info-box, .card-body {
              padding: 1.5rem;
            }
            
            .hero-banner {
              padding: 80px 0 60px;
            }
          }
          
          /* Top hover indicator for card focus */
          .transport-card::before,
          .attraction-card::before,
          .info-box::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--primary);
            transform: scaleX(0);
            transform-origin: center;
            transition: transform var(--transition-medium);
            z-index: 3;
          }
          
          .transport-card:hover::before,
          .attraction-card:hover::before,
          .info-box:hover::before {
            transform: scaleX(1);
          }
          
          /* Brand color utility classes */
          .text-primary {
            color: var(--primary) !important;
          }
          
          .bg-primary {
            background-color: var(--primary) !important;
          }
          
          .text-secondary {
            color: var(--secondary) !important;
          }
          
          .bg-secondary {
            background-color: var(--secondary) !important;
          }
        `}
      </style>

      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="container text-center">
          <span className="hero-badge">Our Location</span>
          <h1 className="hero-title">Find Us in Lagos</h1>
          <div className="address-block mx-auto">
            <MapPin size={20} className="text-primary me-2" />
            <span className="text-light">{LOCATION_COORDINATES.address}</span>
          </div>
          
        </div>
      </div>

      <div className="container py-5">
        {/* Map Section */}
        <AnimatedSection className="mb-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="section-heading">Our Location</h2>
              <p className="section-subtitle">
                We're conveniently located in the heart of Ikeja GRA, one of Lagos' most prestigious neighborhoods, 
                providing easy access to major attractions and transport hubs.
              </p>
              <ContactInfo />
            </div>
            <div className="col-lg-6">
              <div className="map-container">
                <div ref={mapRef} style={{ height: "100%", width: "100%" }}></div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="section-separator"></div>

        {/* Transportation Options */}
        <AnimatedSection className="mb-5">
          <h2 className="section-heading">Getting Here</h2>
          <p className="section-subtitle">
            Multiple transportation options are available to reach our location, making your journey convenient and hassle-free.
          </p>
          <div className="row g-4">
            {transportOptions.map((option, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <TransportCard option={option} />
              </div>
            ))}
          </div>
        </AnimatedSection>

        <div className="section-separator"></div>

        {/* Nearby Attractions */}
        <AnimatedSection className="mb-5">
          <h2 className="section-heading">Nearby Attractions</h2>
          <p className="section-subtitle">
            Explore these popular attractions near our location, all within walking distance or a short drive.
          </p>
          <div className="row g-4">
            {nearbyAttractions.map((attraction, index) => (
              <div key={index} className="col-md-6">
                <AttractionCard attraction={attraction} />
              </div>
            ))}
          </div>
        </AnimatedSection>

        <div className="section-separator"></div>
        
        
      </div>

    </div>
  );
};

export default LocationPage;