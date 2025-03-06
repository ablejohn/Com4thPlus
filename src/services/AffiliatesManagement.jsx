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
  Tabs,
  Tab,
  ProgressBar,
  Alert
} from "react-bootstrap";
import {
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaLink,
  FaCopy,
  FaHandshake,
  FaMoneyBillWave,
  FaChartLine,
  FaUsers,
  FaSave,
  FaTimes
} from "react-icons/fa";

const AffiliatesManagement = () => {
  // State for affiliates
  const [activeTab, setActiveTab] = useState("affiliates");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentAffiliate, setCurrentAffiliate] = useState(null);
  const [copyAlert, setCopyAlert] = useState(false);
  
  // Affiliate form data
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Active",
    referralCode: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    commissionRate: 5,
    notes: ""
  });

  // Mock affiliate data
  const [affiliates, setAffiliates] = useState([
    {
      id: 1,
      name: "Tobi Akinlade",
      email: "tobi@realtypartners.ng",
      phone: "+234 802 345 6789",
      company: "Realty Partners Ltd",
      status: "Active",
      referralCode: "TOBI500",
      bankName: "GTBank",
      accountNumber: "0123456789",
      accountName: "Tobi Akinlade",
      commissionRate: 7.5,
      dateJoined: "2025-01-15T09:30:00Z",
      totalReferrals: 8,
      pendingCommission: 350000,
      paidCommission: 560000,
      notes: "Premium partner, very active"
    },
    {
      id: 2,
      name: "Ngozi Okonkwo",
      email: "ngozi@homefinders.com",
      phone: "+234 705 111 2222",
      company: "Home Finders Agency",
      status: "Active",
      referralCode: "NGOZI350",
      bankName: "First Bank",
      accountNumber: "9876543210",
      accountName: "Ngozi Okonkwo",
      commissionRate: 5,
      dateJoined: "2025-02-10T14:45:00Z",
      totalReferrals: 3,
      pendingCommission: 125000,
      paidCommission: 75000,
      notes: "New partner with good potential"
    },
    {
      id: 3,
      name: "Emmanuel Adebayo",
      email: "emmanuel@realestate.com",
      phone: "+234 812 333 4444",
      company: "Lagos Homes",
      status: "Inactive",
      referralCode: "EMMA200",
      bankName: "UBA",
      accountNumber: "5555666677",
      accountName: "Emmanuel Adebayo",
      commissionRate: 5,
      dateJoined: "2025-01-05T10:15:00Z",
      totalReferrals: 0,
      pendingCommission: 0,
      paidCommission: 0,
      notes: "Inactive since registration"
    }
  ]);

  // Mock referrals data
  const [referrals, setReferrals] = useState([
    {
      id: 1,
      affiliateId: 1,
      affiliateName: "Tobi Akinlade",
      leadName: "John Doe",
      property: "2-Bedroom in Lekki",
      propertyPrice: 25000000,
      status: "Viewing Scheduled",
      referralDate: "2025-02-25T13:20:00Z",
      commissionAmount: 1875000,
      commissionPaid: false
    },
    {
      id: 2,
      affiliateId: 1,
      affiliateName: "Tobi Akinlade",
      leadName: "Sarah Williams",
      property: "Office Space in Ikoyi",
      propertyPrice: 45000000,
      status: "Negotiating",
      referralDate: "2025-03-01T09:45:00Z",
      commissionAmount: 3375000,
      commissionPaid: false
    },
    {
      id: 3,
      affiliateId: 2,
      affiliateName: "Ngozi Okonkwo",
      leadName: "Michael Johnson",
      property: "Duplex in Victoria Island",
      propertyPrice: 85000000,
      status: "Booking Created",
      referralDate: "2025-03-02T15:30:00Z",
      commissionAmount: 4250000, 
      commissionPaid: false
    }
  ]);

  // Filter affiliates based on search
  const filteredAffiliates = affiliates.filter(affiliate => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      affiliate.name.toLowerCase().includes(searchLower) ||
      affiliate.email.toLowerCase().includes(searchLower) ||
      affiliate.company?.toLowerCase().includes(searchLower) ||
      affiliate.referralCode.toLowerCase().includes(searchLower)
    );
  });

  // Generate a random referral code
  const generateReferralCode = () => {
    const name = formData.name.split(' ')[0].toUpperCase().slice(0, 4);
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return `${name}${randomNum}`;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add or update affiliate
  const handleSaveAffiliate = () => {
    const newAffiliate = {
      ...formData,
      id: formData.id || Date.now(),
      referralCode: formData.referralCode || generateReferralCode(),
      dateJoined: formData.dateJoined || new Date().toISOString(),
      totalReferrals: currentAffiliate?.totalReferrals || 0,
      pendingCommission: currentAffiliate?.pendingCommission || 0,
      paidCommission: currentAffiliate?.paidCommission || 0
    };

    if (currentAffiliate) {
      // Update existing affiliate
      setAffiliates(affiliates.map(a => a.id === currentAffiliate.id ? newAffiliate : a));
    } else {
      // Add new affiliate
      setAffiliates([...affiliates, newAffiliate]);
    }

    setShowAddModal(false);
    resetForm();
  };

  // Delete affiliate
  const handleDeleteAffiliate = (id) => {
    setAffiliates(affiliates.filter(a => a.id !== id));
    // Also remove any referrals linked to this affiliate
    setReferrals(referrals.filter(r => r.affiliateId !== id));
  };

  // Edit affiliate
  const handleEditAffiliate = (affiliate) => {
    setCurrentAffiliate(affiliate);
    setFormData({
      id: affiliate.id,
      name: affiliate.name,
      email: affiliate.email,
      phone: affiliate.phone,
      company: affiliate.company,
      status: affiliate.status,
      referralCode: affiliate.referralCode,
      bankName: affiliate.bankName,
      accountNumber: affiliate.accountNumber,
      accountName: affiliate.accountName,
      commissionRate: affiliate.commissionRate,
      notes: affiliate.notes
    });
    setShowAddModal(true);
  };

  // Reset form
  const resetForm = () => {
    setCurrentAffiliate(null);
    setFormData({
      id: "",
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "Active",
      referralCode: "",
      bankName: "",
      accountNumber: "",
      accountName: "",
      commissionRate: 5,
      notes: ""
    });
  };

  // Copy referral link
  const copyReferralLink = (code) => {
    const baseUrl = window.location.origin;
    const referralLink = `${baseUrl}/property?ref=${code}`;
    navigator.clipboard.writeText(referralLink);
    setCopyAlert(true);
    setTimeout(() => setCopyAlert(false), 3000);
  };

  return (
    <>
      {copyAlert && (
        <Alert 
          variant="success" 
          className="position-fixed top-0 start-50 translate-middle-x mt-4 z-index-1050"
          style={{ zIndex: 1050 }}
        >
          Referral link copied to clipboard!
        </Alert>
      )}
      
      <Card>
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="affiliates" title="Affiliate Partners">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <Button 
                  variant="primary" 
                  onClick={() => {
                    resetForm();
                    setShowAddModal(true);
                  }}
                >
                  <FaUserPlus className="me-2" /> Add New Affiliate
                </Button>
                
                <InputGroup style={{ maxWidth: "300px" }}>
                  <Form.Control
                    placeholder="Search affiliates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="outline-secondary">
                    <FaSearch />
                  </Button>
                </InputGroup>
              </div>
              
              {filteredAffiliates.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Referral Code</th>
                      <th>Performance</th>
                      <th>Commission</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAffiliates.map(affiliate => (
                      <tr key={affiliate.id}>
                        <td>
                          <div>
                            <span className="fw-bold">{affiliate.name}</span>
                            {affiliate.company && (
                              <div className="small text-muted">{affiliate.company}</div>
                            )}
                          </div>
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
                            {affiliate.commissionRate}% commission rate
                          </div>
                        </td>
                        <td>
                          <div className="mb-1">
                            <span>{affiliate.totalReferrals} referrals</span>
                          </div>
                          <ProgressBar 
                            now={Math.min(affiliate.totalReferrals * 10, 100)} 
                            variant={
                              affiliate.totalReferrals >= 10 ? "success" :
                              affiliate.totalReferrals >= 5 ? "info" : "warning"
                            } 
                            style={{ height: "6px" }} 
                          />
                        </td>
                        <td>
                          <div>₦{affiliate.pendingCommission.toLocaleString()}</div>
                          <div className="small text-muted">
                            ₦{affiliate.paidCommission.toLocaleString()} paid
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
                          {affiliate.pendingCommission > 0 && (
                            <Button 
                              size="sm" 
                              variant="outline-success" 
                              className="me-1"
                              onClick={() => {
                                setCurrentAffiliate(affiliate);
                                setShowPaymentModal(true);
                              }}
                            >
                              <FaMoneyBillWave />
                            </Button>
                          )}
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
                  <FaHandshake size={40} className="text-muted mb-3" />
                  <h5>No affiliates found</h5>
                  <p className="text-muted">
                    {searchTerm 
                      ? "Try adjusting your search" 
                      : "Add your first affiliate partner to get started"}
                  </p>
                  {!searchTerm && (
                    <Button 
                      variant="primary" 
                      onClick={() => {
                        resetForm();
                        setShowAddModal(true);
                      }}
                    >
                      <FaUserPlus className="me-2" /> Add New Affiliate
                    </Button>
                  )}
                </div>
              )}
            </Tab>
            
            <Tab eventKey="referrals" title="Referral Tracking">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Referral Transactions</h5>
                <InputGroup style={{ maxWidth: "300px" }}>
                  <Form.Control
                    placeholder="Search referrals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="outline-secondary">
                    <FaSearch />
                  </Button>
                </InputGroup>
              </div>
              
              {referrals.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Affiliate</th>
                      <th>Lead</th>
                      <th>Property</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Commission</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map(referral => (
                      <tr key={referral.id}>
                        <td>{referral.affiliateName}</td>
                        <td>{referral.leadName}</td>
                        <td>
                          <div>{referral.property}</div>
                          <div className="small text-muted">
                            ₦{referral.propertyPrice.toLocaleString()}
                          </div>
                        </td>
                        <td>{new Date(referral.referralDate).toLocaleDateString('en-NG')}</td>
                        <td>
                          <Badge bg={
                            referral.status === "New" 
                              ? "secondary" 
                              : referral.status === "Viewing Scheduled" 
                                ? "info"
                                : referral.status === "Negotiating"
                                  ? "primary"
                                  : "success"
                          }>
                            {referral.status}
                          </Badge>
                        </td>
                        <td>
                          <div>₦{referral.commissionAmount.toLocaleString()}</div>
                          <div className="small text-muted">
                            {referral.commissionPaid ? "Paid" : "Pending"}
                          </div>
                        </td>
                        <td>
                          <Button size="sm" variant="outline-primary" className="me-1">
                            <FaEdit />
                          </Button>
                          <Button size="sm" variant="outline-success" disabled={referral.commissionPaid}>
                            <FaMoneyBillWave />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <FaLink size={40} className="text-muted mb-3" />
                  <h5>No referrals yet</h5>
                  <p className="text-muted">
                    Referrals will appear here when affiliates start bringing in leads
                  </p>
                </div>
              )}
            </Tab>
            
            <Tab eventKey="performance" title="Performance Analysis">
              <div className="text-center py-5">
                <FaChartLine size={40} className="text-primary mb-3" />
                <h4>Affiliate Performance Analytics</h4>
                <p className="text-muted mb-4">
                  Track affiliate performance, conversion rates, and ROI
                </p>
                <p>
                  Total Active Affiliates: <span className="fw-bold">{affiliates.filter(a => a.status === "Active").length}</span>
                </p>
                <p>
                  Total Referrals: <span className="fw-bold">{referrals.length}</span>
                </p>
                <p>
                  Total Pending Commission: <span className="fw-bold">₦{affiliates.reduce((sum, a) => sum + a.pendingCommission, 0).toLocaleString()}</span>
                </p>
                <p>
                  Total Paid Commission: <span className="fw-bold">₦{affiliates.reduce((sum, a) => sum + a.paidCommission, 0).toLocaleString()}</span>
                </p>
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
      
      {/* Add/Edit Affiliate Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentAffiliate ? "Edit Affiliate Partner" : "Add New Affiliate Partner"}
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
                    placeholder="Enter affiliate's full name"
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
                    placeholder="Enter affiliate's email"
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
                    placeholder="e.g. +234 123 456 7890"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formCompany">
                  <Form.Label>Company/Agency (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Company or agency name if applicable"
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
                      placeholder="Auto-generated if left empty"
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

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBankName">
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    placeholder="Bank for commission payments"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formAccountNumber">
                  <Form.Label>Account Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Account number for payments"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formAccountName">
                  <Form.Label>Account Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleInputChange}
                    placeholder="Name on bank account"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
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
                  <Form.Text className="text-muted">
                    Percentage of property price paid as commission
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formNotes">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional information about this affiliate"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            <FaTimes /> Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveAffiliate}>
            <FaSave /> {currentAffiliate ? "Update Affiliate" : "Save Affiliate"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Payment Modal */}
      <Modal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        centered
      >
        {currentAffiliate && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                Process Commission Payment
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-4">
                <h5>{currentAffiliate.name}</h5>
                <p className="text-muted">{currentAffiliate.email} | {currentAffiliate.phone}</p>
              </div>
              
              <div className="bg-light p-3 rounded mb-4">
                <div className="row">
                  <div className="col-6">
                    <h6>Bank Details</h6>
                    <p className="mb-1"><strong>Bank:</strong> {currentAffiliate.bankName}</p>
                    <p className="mb-1"><strong>Account:</strong> {currentAffiliate.accountNumber}</p>
                    <p><strong>Name:</strong> {currentAffiliate.accountName}</p>
                  </div>
                  <div className="col-6">
                    <h6>Payment Summary</h6>
                    <p className="mb-1"><strong>Pending:</strong> ₦{currentAffiliate.pendingCommission.toLocaleString()}</p>
                    <p><strong>Previously Paid:</strong> ₦{currentAffiliate.paidCommission.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <Form>
                <Form.Group className="mb-3" controlId="formPaymentAmount">
                  <Form.Label>Payment Amount</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₦</InputGroup.Text>
                    <Form.Control
                      type="number"
                      defaultValue={currentAffiliate.pendingCommission}
                      max={currentAffiliate.pendingCommission}
                    />
                  </InputGroup>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formPaymentMethod">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select defaultValue="bank">
                    <option value="bank">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="mobile">Mobile Money</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formPaymentNotes">
                  <Form.Label>Payment Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Add any notes about this payment"
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="success" 
                onClick={() => {
                  // In a real implementation, this would process the payment
                  // For demo purposes, we'll just update the affiliate's commission data
                  const updatedAffiliates = affiliates.map(a => {
                    if (a.id === currentAffiliate.id) {
                      return {
                        ...a,
                        paidCommission: a.paidCommission + a.pendingCommission,
                        pendingCommission: 0
                      };
                    }
                    return a;
                  });
                  setAffiliates(updatedAffiliates);
                  setShowPaymentModal(false);
                }}
              >
                <FaMoneyBillWave className="me-2" /> Process Payment
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
};

export default AffiliatesManagement;