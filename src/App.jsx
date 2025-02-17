import React, { lazy, Suspense } from "react"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import ScrollToTop from "./components/scrolltoTop";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/home"));
const PropertyPage = lazy(() => import("./pages/property"));
const PropertyDetailPage = lazy(() => import("./pages/propertydetail"));
const LocationPage = lazy(() => import("./pages/location"));
const ContactPage = lazy(() => import("./pages/contact"));

const App = () => {
  return (
    <Router>
      <Navigation />
      <Suspense
        fallback={
          <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Container>
        }
      >
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PropertyPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            <Route path="/location" element={<LocationPage />} /> 
            <Route path="/contact" element={<ContactPage />} /> 
          </Routes>
        </div>
      </Suspense>
      <Footer />
      <ScrollToTop />
      <style>{`
        .main-content {
          min-height: calc(100vh - 160px);
          padding-bottom: 2rem;
        }
      `}</style>
    </Router>
  );
};

export default App;

// Explicitly reference React to avoid the warning
console.log(React);