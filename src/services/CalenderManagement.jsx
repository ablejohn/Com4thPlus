// CalendarManagement.jsx
import React, { useState, useEffect } from "react";
import { 
  Card, 
  Form, 
  Button, 
  Row, 
  Col,
  ListGroup, 
  Badge,
  Spinner
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaTrash, FaLock, FaUnlock } from "react-icons/fa";

const CalendarManagement = ({ 
  properties, 
  selectedProperty, 
  onPropertySelect, 
  showMessage 
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [blockReason, setBlockReason] = useState("");
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load blocked dates when property changes
  useEffect(() => {
    if (selectedProperty) {
      fetchBlockedDates(selectedProperty.id);
    }
  }, [selectedProperty]);

  // Fetch blocked dates for the selected property
  const fetchBlockedDates = async (propertyId) => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await api.getBlockedDates(propertyId);
      // setBlockedDates(response.data);
      
      // Simulated data for demonstration
      setTimeout(() => {
        const mockBlockedDates = [
          { 
            id: 1, 
            startDate: new Date(2025, 2, 15), 
            endDate: new Date(2025, 2, 20), 
            reason: "Maintenance" 
          },
          { 
            id: 2, 
            startDate: new Date(2025, 3, 10), 
            endDate: new Date(2025, 3, 15), 
            reason: "Owner stay" 
          }
        ];
        setBlockedDates(mockBlockedDates);
        setLoading(false);
      }, 800);
    } catch (error) {
      showMessage("Failed to load blocked dates", "danger");
      setLoading(false);
    }
  };

  // Handle blocking new dates
  const handleBlockDates = async () => {
    if (!selectedProperty) {
      showMessage("Please select a property first", "warning");
      return;
    }

    if (startDate > endDate) {
      showMessage("Start date cannot be after end date", "warning");
      return;
    }

    try {
      setLoading(true);
      
      // Create new blocked date entry
      const newBlockedDateEntry = {
        id: Date.now(), // Temporary ID, would be assigned by backend
        propertyId: selectedProperty.id,
        startDate,
        endDate,
        reason: blockReason || "Unavailable"
      };
      
      // Replace with actual API call
      // await api.blockDates(newBlockedDateEntry);
      
      // Simulate API call
      setTimeout(() => {
        // Update local state after successful API call
        setBlockedDates([...blockedDates, newBlockedDateEntry]);
        showMessage("Dates blocked successfully", "success");
        
        // Reset form fields
        setBlockReason("");
        setLoading(false);
      }, 800);
    } catch (error) {
      showMessage("Failed to block dates", "danger");
      setLoading(false);
    }
  };

  // Handle removing a blocked date
  const handleRemoveBlockedDate = async (id) => {
    try {
      setLoading(true);
      
      // Replace with actual API call
      // await api.unblockDates(id);
      
      // Simulate API call
      setTimeout(() => {
        // Update local state after successful API call
        setBlockedDates(blockedDates.filter(date => date.id !== id));
        showMessage("Block removed successfully", "success");
        setLoading(false);
      }, 800);
    } catch (error) {
      showMessage("Failed to remove block", "danger");
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Row>
      <Col lg={4} className="mb-4">
        <Card>
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">
              <FaCalendarAlt className="me-2" /> Block Dates
            </h5>
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Select Property</Form.Label>
                <Form.Select 
                  value={selectedProperty?.id || ''}
                  onChange={(e) => onPropertySelect(e.target.value)}
                >
                  <option value="">-- Select Property --</option>
                  {properties.map(property => (
                    <option key={property.id} value={property.id}>
                      {property.name || property.title || `Property #${property.id}`}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <DatePicker
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  className="form-control"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <DatePicker
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  dateFormat="MMMM d, yyyy"
                  className="form-control"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Reason (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Enter reason for blocking dates"
                />
              </Form.Group>

              <Button 
                variant="primary" 
                className="w-100" 
                onClick={handleBlockDates}
                disabled={loading || !selectedProperty}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaLock className="me-2" /> Block Dates
                  </>
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>

      <Col lg={8}>
        <Card>
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">
              <FaCalendarAlt className="me-2" /> Blocked Dates
            </h5>
          </Card.Header>
          <Card.Body>
            {!selectedProperty ? (
              <div className="text-center py-5">
                <h6 className="text-muted">Select a property to view blocked dates</h6>
              </div>
            ) : loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : blockedDates.length === 0 ? (
              <div className="text-center py-5">
                <h6 className="text-muted">No blocked dates for this property</h6>
              </div>
            ) : (
              <ListGroup>
                {blockedDates.map(date => (
                  <ListGroup.Item 
                    key={date.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <Badge bg="danger" className="me-2">Blocked</Badge>
                      <span className="fw-bold">
                        {formatDate(date.startDate)} - {formatDate(date.endDate)}
                      </span>
                      {date.reason && (
                        <p className="text-muted mb-0 mt-1">
                          Reason: {date.reason}
                        </p>
                      )}
                    </div>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleRemoveBlockedDate(date.id)}
                      disabled={loading}
                    >
                      <FaUnlock className="me-1" /> Unblock
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default CalendarManagement;