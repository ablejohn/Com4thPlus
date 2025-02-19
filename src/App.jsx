// App.jsx
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import AutoScrollToTop from "./components/autoscrolltoTop";
import ScrollToTopButton from "./components/scrolltoTop";
import "./styling/styles.css";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/home"));
const PropertyPage = lazy(() => import("./pages/property"));
const PropertyDetailPage = lazy(() => import("./pages/propertydetail"));
const LocationPage = lazy(() => import("./pages/location"));
const ContactPage = lazy(() => import("./pages/contact"));
const AdminPage = lazy(() => import("./Admin/Dashboard"));

const App = () => {
  return (
    <Router>
      <AutoScrollToTop />
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
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </Suspense>
      <Footer />
      <ScrollToTopButton />
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
