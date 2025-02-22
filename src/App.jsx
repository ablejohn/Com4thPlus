import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import AutoScrollToTop from "./components/autoscrolltoTop";
import ScrollToTopButton from "./components/scrolltoTop";
import PrivateRoute from "./components/privateRoute";
import "./styling/styles.css";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/home"));
const PropertyPage = lazy(() => import("./pages/newProperties")); // User-facing properties
const PropertyDetailPage = lazy(() => import("./pages/propertydetail"));
const LocationPage = lazy(() => import("./pages/location"));
const ContactPage = lazy(() => import("./pages/contact"));
const AdminPage = lazy(() => import("./services/property")); 
const AdminPropertyForm = lazy(() => import("./services/property")); // Edit/Delete page
const ViewAllProperties = lazy(() => import("./services/viewallproperties"));
const AdminLogin = lazy(() => import("./components/adminlogin"));

const App = () => {
  const location = useLocation(); // Get the current route location

  // Check if the current route is an admin route
  const isAdminRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/viewallproperties";

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <AutoScrollToTop />
      {/* Conditionally render Navigation */}
      {!isAdminRoute && <Navigation />}
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
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PropertyPage />} />
            <Route path="/propertydetail" element={<PropertyDetailPage />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/properties"
              element={
                <PrivateRoute>
                  <AdminPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/add-property"
              element={
                <PrivateRoute>
                  <AdminPropertyForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/viewallproperties"
              element={
                <PrivateRoute>
                  <ViewAllProperties />
                </PrivateRoute>
              }
            />

            {/* Catch-all Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Suspense>
      {/* Conditionally render Footer */}
      {!isAdminRoute && <Footer />}
      <ScrollToTopButton />
      <style>{`
        .main-content {
          min-height: calc(100vh - 160px);
          padding-bottom: 2rem;
        }
      `}</style>
    </>
  );
};

// Wrap the App component with Router to use useLocation
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
