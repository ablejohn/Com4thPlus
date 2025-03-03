import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FaCheckCircle, FaHome, FaDownload } from "react-icons/fa";
import { Container, Button, Row, Col, Card } from "react-bootstrap";

const PaymentSuccess = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Extract query parameters with fallback values
  const reference = queryParams.get("ref") || "N/A";
  const amount = queryParams.get("amount") || "0";
  const type = queryParams.get("type") || "";
  
  // Format date for receipt
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  
  // Map apartment types to their full descriptions
  const apartmentTypeMap = {
    "3br": "3 Bedroom Apartment",
    "4br": "4 Bedroom Apartment",
    "5br": "5 Bedroom Apartment",
    "5br-party": "5 Bedroom Party House"
  };
  
  const apartmentType = apartmentTypeMap[type] || "Not specified";
  
  // Handle print receipt functionality
  const handlePrintReceipt = () => {
    window.print();
  };
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center">
                <FaCheckCircle size={80} className="text-success mb-4" />
                <h1 className="fw-bold mb-3">Payment Successful!</h1>
                <p className="lead mb-4">
                  Thank you for your payment. Your reservation has been confirmed.
                </p>
              </div>
              
              <Card className="bg-light border-0 mb-4">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold m-0">Payment Details</h5>
                    <small className="text-muted">{currentDate}</small>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <Row className="mb-2">
                    <Col xs={5} className="fw-bold">Reference:</Col>
                    <Col xs={7} className="text-break">{reference}</Col>
                  </Row>
                  
                  <Row className="mb-2">
                    <Col xs={5} className="fw-bold">Amount:</Col>
                    <Col xs={7}>₦{parseFloat(amount).toLocaleString()}</Col>
                  </Row>
                  
                  <Row className="mb-2">
                    <Col xs={5} className="fw-bold">Apartment Type:</Col>
                    <Col xs={7}>{apartmentType}</Col>
                  </Row>
                  
                  <Row className="mb-0">
                    <Col xs={5} className="fw-bold">Status:</Col>
                    <Col xs={7} className="text-success">Confirmed</Col>
                  </Row>
                </Card.Body>
              </Card>
              
              <div className="d-flex flex-column flex-md-row gap-3">
                <Button 
                  variant="outline-secondary" 
                  className="d-flex align-items-center justify-content-center gap-2 flex-fill"
                  onClick={handlePrintReceipt}
                >
                  <FaDownload />
                  <span>Download Receipt</span>
                </Button>
                
                <Link to="/" className="flex-fill">
                  <Button 
                    variant="primary" 
                    className="d-flex align-items-center justify-content-center gap-2 w-100"
                  >
                    <FaHome />
                    <span>Back to Home</span>
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentSuccess;