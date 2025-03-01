import React, { useState, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { motion } from "framer-motion";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactInfo = [
    {
      icon: "bi-building",
      title: "Office Address",
      content: "Ultimate Tax Relief NG SO&C House 17, Independence street off akinremi street, anifowose, ikeja, Lagos State.",
      type: "text",
    },
    {
      icon: "bi-telephone-fill",
      title: "Phone Number",
      content: "0814 318 3494",
      type: "phone",
      href: "tel:+2348143183494",
    },
    {
      icon: "bi-envelope-fill",
      title: "Email Address",
      content: "info@com4thplus.com",
      type: "email",
      href: "mailto:info@com4thplus.com",
    },
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM", status: "open" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM", status: "open" },
    { day: "Sunday", hours: "Closed", status: "closed" },
  ];

  const validateForm = useCallback(() => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s\-()]{10,15}$/;

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (formData.phone && !phoneRegex.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }

    return errors;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const ContactInfoItem = ({ icon, title, content, type, href }) => (
    <motion.div 
      className="mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="d-flex align-items-center mb-2">
        <div className="contact-icon-wrapper me-3">
          <i className={`bi ${icon} text-primary fs-4`} style={{ color: "#40E0D0" }} aria-hidden="true"></i>
        </div>
        <h3 className="h6 fw-semibold mb-0">{title}</h3>
      </div>
      <div className="ps-5">
        {href ? (
          <a 
            href={href}
            className="text-decoration-none text-body hover-primary"
            style={{ transition: 'color 0.2s ease' }}
          >
            {content}
          </a>
        ) : (
          <span>{content}</span>
        )}
      </div>
    </motion.div>
  );

  const BusinessHoursItem = ({ day, hours, status }) => (
    <motion.li 
      className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="fw-medium">{day}</span>
      <span className={`badge rounded-pill ${status === 'open' ? 'bg-primary text-white' : 'bg-light text-dark'}`} style={{ backgroundColor: status === 'open' ? "#40E0D0" : "#f8f9fa" }}>
        {hours}
      </span>
    </motion.li>
  );

  const FormField = ({ type, name, label, value, onChange, error, as = "input" }) => {
    const Component = as;
    const props = {
      className: `form-control form-control-lg bg-light ${error ? 'is-invalid' : ''}`,
      id: name,
      name,
      placeholder: label,
      value,
      onChange,
      required: true,
      ...(as === "textarea" ? { style: { height: "150px" } } : { type }),
    };

    return (
      <motion.div 
        className="form-group mb-3"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <label htmlFor={name} className="form-label fw-medium mb-1">{label}</label>
        <Component {...props} />
        {error && <div className="invalid-feedback">{error}</div>}
      </motion.div>
    );
  };

  return (
    <div className="py-5" style={{ background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)" }}>
      <div className="container py-4">
        {/* Page Header */}
        <header className="text-center mb-5">
          <div className="d-inline-block px-3 py-2 rounded-pill mb-3" 
               style={{ background: "rgba(64, 224, 208, 0.1)", color: "#40E0D0" }}>
            <span className="fw-semibold" style={{ fontSize: "0.85rem", letterSpacing: "0.05em" }}>
              GET IN TOUCH
            </span>
          </div>
          <h1 className="display-4 fw-bold mb-3">Contact Us</h1>
          <div className="mx-auto" style={{ maxWidth: "700px" }}>
            <p className="lead text-muted">
              Whether you have questions about our luxury residences or want to schedule a viewing, 
              our team is ready to assist you every step of the way.
            </p>
          </div>
        </header>

        {/* Contact Content */}
        <div className="row g-4 justify-content-between">
          {/* Contact Information */}
          <div className="col-lg-5">
            <motion.div 
              className="card border-0 shadow-sm h-100 overflow-hidden"
              style={{ borderRadius: "16px" }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ 
                boxShadow: "0 15px 30px rgba(64, 224, 208, 0.15)" 
              }}
            >
              {/* Decorative accent */}
              <div 
                className="position-absolute" 
                style={{ 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  height: "6px", 
                  background: "linear-gradient(90deg, #40E0D0, #20B2AA)" 
                }} 
              />

              <div className="card-body p-4 p-lg-5">
                <div className="contact-info mb-5">
                  <h2 className="h4 fw-bold mb-4 pb-2 border-bottom border-light">
                    Contact Information
                  </h2>
                  
                  {contactInfo.map((info, index) => (
                    <ContactInfoItem key={index} {...info} />
                  ))}
                </div>

                <div className="business-hours mt-5">
                  <h2 className="h4 fw-bold mb-4 d-flex align-items-center">
                    <i className="bi bi-clock-fill me-2" style={{ color: "#40E0D0" }} aria-hidden="true"></i>
                    Business Hours
                  </h2>
                  <ul className="list-unstyled">
                    {businessHours.map((hours, index) => (
                      <BusinessHoursItem key={index} {...hours} />
                    ))}
                  </ul>
                </div>

                {/* Social Media Links */}
                <div className="social-links mt-5">
                  <h3 className="h6 mb-3 text-uppercase fw-semibold">Follow Us</h3>
                  <div className="d-flex gap-2">
                    {[
                      { icon: "bi-facebook", label: "Facebook" },
                      { icon: "bi-instagram", label: "Instagram" },
                      { icon: "bi-twitter", label: "Twitter" },
                      { icon: "bi-linkedin", label: "LinkedIn" }
                    ].map((social, index) => (
                      <motion.a 
                        key={index}
                        href="#" 
                        className="btn social-icon rounded-circle p-2"
                        aria-label={social.label}
                        style={{ 
                          borderColor: "#40E0D0", 
                          color: "#40E0D0",
                          width: "38px",
                          height: "38px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0",
                          transition: "all 0.2s ease"
                        }}
                        whileHover={{ 
                          backgroundColor: "#40E0D0", 
                          color: "white",
                          y: -5,
                          boxShadow: "0 6px 16px rgba(64, 224, 208, 0.25)" 
                        }}
                      >
                        <i className={`bi ${social.icon}`}></i>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-6">
            <motion.div 
              className="card border-0 shadow-sm h-100 overflow-hidden"
              style={{ borderRadius: "16px" }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ 
                boxShadow: "0 15px 30px rgba(64, 224, 208, 0.15)" 
              }}
            >
              {/* Decorative accent */}
              <div 
                className="position-absolute" 
                style={{ 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  height: "6px", 
                  background: "linear-gradient(90deg, #40E0D0, #20B2AA)" 
                }} 
              />

              <div className="card-body p-4 p-lg-5">
                <h2 className="h4 fw-bold mb-4">Send Us a Message</h2>

                {submitStatus === 'success' && (
                  <motion.div 
                    className="alert alert-success alert-dismissible fade show"
                    role="alert"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="d-flex">
                      <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                      <div>
                        <strong>Thank you!</strong> Your message has been sent successfully. 
                        Our team will contact you shortly.
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setSubmitStatus(null)}
                      aria-label="Close"
                    ></button>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div 
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="d-flex">
                      <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                      <div>
                        <strong>Oops!</strong> There was an error sending your message. 
                        Please try again or contact us directly.
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setSubmitStatus(null)}
                      aria-label="Close"
                    ></button>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} noValidate className="mt-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <FormField
                        type="text"
                        name="name"
                        label="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        error={formErrors.name}
                      />
                    </div>

                    <div className="col-md-6">
                      <FormField
                        type="email"
                        name="email"
                        label="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        error={formErrors.email}
                      />
                    </div>

                    <div className="col-md-6">
                      <FormField
                        type="tel"
                        name="phone"
                        label="Phone Number (Optional)"
                        value={formData.phone}
                        onChange={handleChange}
                        error={formErrors.phone}
                      />
                    </div>

                    <div className="col-md-6">
                      <FormField
                        type="text"
                        name="subject"
                        label="Subject"
                        value={formData.subject}
                        onChange={handleChange}
                        error={formErrors.subject}
                      />
                    </div>

                    <div className="col-12">
                      <FormField
                        as="textarea"
                        name="message"
                        label="Your Message"
                        value={formData.message}
                        onChange={handleChange}
                        error={formErrors.message}
                      />
                    </div>

                    <div className="col-12 mt-4">
                      <motion.div 
                        className="form-check mb-3"
                        whileHover={{ scale: 1.01 }}
                      >
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="privacyPolicy" 
                          required
                          style={{ 
                            borderColor: "#40E0D0",
                            outline: "none"
                          }}
                        />
                        <label className="form-check-label" htmlFor="privacyPolicy">
                          I agree to the <a href="#" style={{ color: "#40E0D0" }}>privacy policy</a> and consent to being contacted.
                        </label>
                      </motion.div>
                      <motion.button
                        type="submit"
                        className="btn btn-lg w-100 py-3 position-relative rounded-pill"
                        disabled={isSubmitting}
                        style={{ 
                          background: "linear-gradient(to right, #40E0D0, #20B2AA)",
                          border: "none",
                          color: "white"
                        }}
                        whileHover={{ 
                          y: -5,
                          boxShadow: "0 10px 20px rgba(64, 224, 208, 0.3)"
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {isSubmitting ? (
                          <>
                            <span 
                              className="spinner-border spinner-border-sm me-2" 
                              role="status" 
                              aria-hidden="true"
                            ></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send-fill me-2"></i>
                            Send Message
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .rounded-4 {
          border-radius: 16px !important;
        }
        .letter-spacing-1 {
          letter-spacing: 1px;
        }
        .contact-icon-wrapper {
          width: 40px;
          text-align: center;
        }
        .hover-primary:hover {
          color: #40E0D0 !important;
        }
        .form-control {
          border: 1px solid rgba(0,0,0,0.1);
          padding: 0.75rem 1rem;
          border-radius: 30px;
          transition: all 0.3s ease;
        }
        .form-control:focus {
          border-color: #40E0D0;
          box-shadow: 0 0 0 0.25rem rgba(64, 224, 208, 0.15);
        }
        .form-check-input:checked {
          background-color: #40E0D0;
          border-color: #40E0D0;
        }
        .rounded-pill {
          border-radius: 50px !important;
        }
        textarea.form-control {
          border-radius: 20px;
        }
        
        /* Background decorations */
        .py-5 {
          position: relative;
          overflow: hidden;
        }
        
        .py-5::before {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(64, 224, 208, 0.08) 0%, rgba(255,255,255,0) 70%);
          top: 10%;
          left: -100px;
          border-radius: 50%;
          z-index: 0;
        }
        
        .py-5::after {
          content: '';
          position: absolute;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(64, 224, 208, 0.05) 0%, rgba(255,255,255,0) 70%);
          bottom: 5%;
          right: -150px;
          border-radius: 50%;
          z-index: 0;
        }
        
        @media (max-width: 768px) {
          .card-body {
            padding: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;