import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import AutoScrollToTop from "./components/autoscrolltoTop";
import ScrollToTopButton from "./components/scrolltoTop";
import { PropertyProvider } from "./services/propertyContext";
import "./styling/styles.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const Home = lazy(() => import("./pages/home"));
const PropertyPage = lazy(() => import("./pages/newProperties"));
const PropertyDetailPage = lazy(() => import("./pages/propertydetail"));
const LocationPage = lazy(() => import("./pages/location"));
const ContactPage = lazy(() => import("./pages/contact"));
const AdminPropertyForm = lazy(() => import("./services/Dashboard"));
const AdminLogin = lazy(() => import("./services/AdminLogin"));

// Protected Route Component
const ProtectedAdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();
  const firestore = getFirestore();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(firestore, "users", user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists() && userDoc.data().role === "admin") {
            setIsAdmin(true);
          }
        } catch (err) {
          console.error("Error checking admin status:", err);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Checking admin status...</span>
        </Spinner>
      </Container>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

// Admin Layout Component
const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Outlet />
    </div>
  );
};

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <PropertyProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <AutoScrollToTop />
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
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route
                path="add-property"
                element={
                  <ProtectedAdminRoute>
                    <AdminPropertyForm />
                  </ProtectedAdminRoute>
                }
              />
              {/* You can add more admin routes here */}
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Suspense>
      {!isAdminRoute && <Footer />}
      <ScrollToTopButton />
      <style>{`
        .main-content {
          min-height: calc(100vh - 160px);
          padding-bottom: 2rem;
        }
      `}</style>
    </PropertyProvider>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
