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

const App = () => {
  return (
    <Router>
      {/* Navigation Component */}
      <Navigation />

      {/* Main Content */}
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
            <Route path="/propertydetail" element={<PropertyDetailPage />} />
          </Routes>
        </div>
      </Suspense>

      {/* Footer Component */}
      <Footer />

      {/* Scroll To Top Component */}
      <ScrollToTop />

      {/* Style to ensure footer stays at bottom */}
      <style jsx>{`
        .main-content {
          min-height: calc(
            100vh - 160px
          ); /* Adjust based on your footer height */
          padding-bottom: 2rem;
        }
      `}</style>
    </Router>
  );
};

export default App;
