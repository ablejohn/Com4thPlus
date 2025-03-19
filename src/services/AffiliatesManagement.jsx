// AffiliatesManagement.jsx
import React, { useState } from "react";
import {
  Card,
  Table,
  Badge,
  Button,
  Form,
  Modal,
  Row,
  Col,
  InputGroup,
  Alert
} from "react-bootstrap";
import { FaUserPlus, FaEdit, FaTrash, FaCopy } from "react-icons/fa";

const AffiliatesManagement = () => {
  // State
  const [affiliates, setAffiliates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAffiliate, setCurrentAffiliate] = useState(null);
  const [copyAlert, setCopyAlert] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    referralCode: "",
    commissionRate: 5,
    status: "Active"
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Generate a referral code
  const generateReferralCode = () => {
    const name = formData.name.split(' ')[0].toUpperCase().slice(0, 4);
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return `${name}${randomNum}`;
  };

  // Save affiliate (just updates state, no Firestore)
  const handleSaveAffiliate = () => {
    // Validate
    if (!formData.name || !formData.email) {
      alert("Name and email are required");
      return;
    }
    
    // Prepare data
    const affiliateData = {
      ...formData,
      referralCode: formData.referralCode || generateReferralCode(),
    };
    
    if (currentAffiliate) {
      // Update existing
      setAffiliates(affiliates.map(a => 
        a.id === currentAffiliate.id ? { ...a, ...affiliateData } : a
      ));
    } else {
      // Add new
      const newAffiliate = {
        id: Date.now().toString(), // Simple ID generation
        ...affiliateData,
        totalReferrals: 0,
        pendingCommission: 0,
        paidCommission: 0
      };
      
      setAffiliates([...affiliates, newAffiliate]);
    }
    
    setShowModal(false);
    resetForm();
  };

  // Delete affiliate
  const handleDeleteAffiliate = (id) => {
    if (window.confirm("Are you sure you want to delete this affiliate?")) {
      setAffiliates(affiliates.filter(a => a.id !== id));
    }
  };

  // Edit affiliate
  const handleEditAffiliate = (affiliate) => {
    setCurrentAffiliate(affiliate);
    setFormData({
      name: affiliate.name,
      email: affiliate.email,
      phone: affiliate.phone || "",
      company: affiliate.company || "",
      referralCode: affiliate.referralCode || "",
      commissionRate: affiliate.commissionRate || 5,
      status: affiliate.status || "Active"
    });
    setShowModal(true);
  };

  // Copy referral link
  const copyReferralLink = (code) => {
    // This just shows the alert without actually copying anything
    setCopyAlert(true);
    setTimeout(() => setCopyAlert(false), 3000);
  };

  // Reset form
  const resetForm = () => {
    setCurrentAffiliate(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      referralCode: "",
      commissionRate: 5,
      status: "Active"
    });
  };

  return (
    <>
      {copyAlert && (
        <Alert 
          variant="success" 
          className="position-fixed top-0 start-50 translate-middle-x mt-4"
          style={{ zIndex: 1050 }}
        >
          Referral link copied to clipboard!
        </Alert>
      )}
      
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Affiliate Partners</h5>
          <Button 
            variant="primary" 
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <FaUserPlus className="me-2" /> Add New Affiliate
          </Button>
        </Card.Header>
        <Card.Body>
          {affiliates.length > 0 ? (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Referral Code</th>
                  <th>Commission</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {affiliates.map(affiliate => (
                  <tr key={affiliate.id}>
                    <td>
                      <div className="fw-bold">{affiliate.name}</div>
                      {affiliate.company && (
                        <div className="small text-muted">{affiliate.company}</div>
                      )}
                    </td>
                    <td>
                      <div>{affiliate.email}</div>
                      <div className="small">{affiliate.phone}</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <code className="me-2">{affiliate.referralCode}</code>
                        <Button 
                          variant="link" 
                          className="p-0" 
                          onClick={() => copyReferralLink(affiliate.referralCode)}
                        >
                          <FaCopy size={14} />
                        </Button>
                      </div>
                      <div className="small text-muted">
                        {affiliate.commissionRate}% commission
                      </div>
                    </td>
                    <td>
                      <div>₦{(affiliate.pendingCommission || 0).toLocaleString()}</div>
                      <div className="small text-muted">
                        ₦{(affiliate.paidCommission || 0).toLocaleString()} paid
                      </div>
                    </td>
                    <td>
                      <Badge bg={affiliate.status === "Active" ? "success" : "secondary"}>
                        {affiliate.status}
                      </Badge>
                    </td>
                    <td>
                      <Button 
                        size="sm" 
                        variant="outline-primary" 
                        className="me-1"
                        onClick={() => handleEditAffiliate(affiliate)}
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline-danger"
                        onClick={() => handleDeleteAffiliate(affiliate.id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-4">
              <h5>No affiliates found</h5>
              <p className="text-muted">
                Add your first affiliate partner to get started
              </p>
              <Button 
                variant="primary" 
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
              >
                <FaUserPlus className="me-2" /> Add New Affiliate
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Add/Edit Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentAffiliate ? "Edit Affiliate" : "Add New Affiliate"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formCompany">
                  <Form.Label>Company (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Company name"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formStatus">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formReferralCode">
                  <Form.Label>Referral Code</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      name="referralCode"
                      value={formData.referralCode}
                      onChange={handleInputChange}
                      placeholder="Auto-generated if empty"
                    />
                    <Button 
                      variant="outline-secondary"
                      onClick={() => setFormData({...formData, referralCode: generateReferralCode()})}
                    >
                      Generate
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formCommissionRate">
              <Form.Label>Commission Rate (%)</Form.Label>
              <Form.Control
                type="number"
                name="commissionRate"
                value={formData.commissionRate}
                onChange={handleInputChange}
                placeholder="Default commission percentage"
                min="0"
                max="100"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveAffiliate}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AffiliatesManagement;