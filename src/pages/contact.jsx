import React, { useState, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactInfo = [
    {
      icon: "bi-building",
      content: "123 Luxury Street, New York, NY 10001",
      type: "text",
    },
    {
      icon: "bi-telephone-fill",
      content: "+1 (123) 456-7890",
      type: "phone",
      href: "tel:+11234567890",
    },
    {
      icon: "bi-envelope-fill",
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

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
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
      setFormData({ name: "", email: "", subject: "", message: "" });
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

  const ContactInfoItem = ({ icon, content, type, href }) => (
    <li className="mb-3 d-flex align-items-center">
      <i className={`bi ${icon} text-primary me-3 fs-5`} aria-hidden="true"></i>
      {href ? (
        <a 
          href={href}
          className="text-decoration-none text-body hover-primary transition"
          style={{ transition: 'color 0.3s ease' }}
        >
          {content}
        </a>
      ) : (
        <span>{content}</span>
      )}
    </li>
  );

  const BusinessHoursItem = ({ day, hours, status }) => (
    <li className="mb-3 d-flex justify-content-between align-items-center">
      <span className="fw-medium">{day}</span>
      <span className={`badge ${status === 'open' ? 'bg-primary' : 'bg-secondary'}`}>
        {hours}
      </span>
    </li>
  );

  const FormField = ({ type, name, label, value, onChange, error, as = "input" }) => {
    const Component = as;
    const props = {
      className: `form-control ${error ? 'is-invalid' : ''}`,
      id: name,
      name,
      placeholder: label,
      value,
      onChange,
      required: true,
      ...(as === "textarea" ? { style: { height: "150px" } } : {}),
    };

    return (
      <div className="form-floating">
        <Component {...props} />
        <label htmlFor={name}>{label}</label>
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    );
  };

  return (
    <div className="container py-5">
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3 text-primary">Contact Us</h1>
        <p className="lead text-muted mb-0">
          We'd love to hear from you! Reach out to us for any inquiries or feedback.
        </p>
      </header>

      <div className="row g-4">
        {/* Contact Information */}
        <div className="col-lg-5">
          <div 
            className="card h-100 border-0 shadow-sm"
            style={{ 
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div className="card-body p-4">
              <div className="contact-info mb-5">
                <h2 className="h4 mb-4 d-flex align-items-center">
                  <i className="bi bi-geo-alt-fill text-primary me-2" aria-hidden="true"></i>
                  Our Office
                </h2>
                <ul className="list-unstyled mb-0">
                  {contactInfo.map((info, index) => (
                    <ContactInfoItem key={index} {...info} />
                  ))}
                </ul>
              </div>

              <div className="business-hours">
                <h2 className="h4 mb-4 d-flex align-items-center">
                  <i className="bi bi-clock-fill text-primary me-2" aria-hidden="true"></i>
                  Business Hours
                </h2>
                <ul className="list-unstyled mb-0">
                  {businessHours.map((hours, index) => (
                    <BusinessHoursItem key={index} {...hours} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-lg-7">
          <div 
            className="card h-100 border-0 shadow-sm"
            style={{ 
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div className="card-body p-4">
              <h2 className="h4 mb-4 d-flex align-items-center">
                <i className="bi bi-send-fill text-primary me-2" aria-hidden="true"></i>
                Send Us a Message
              </h2>

              {submitStatus && (
                <div 
                  className={`alert alert-${submitStatus === 'success' ? 'success' : 'danger'} alert-dismissible fade show`}
                  role="alert"
                >
                  {submitStatus === 'success' 
                    ? "Message sent successfully! We'll get back to you soon."
                    : "There was an error sending your message. Please try again."}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setSubmitStatus(null)}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <FormField
                      type="text"
                      name="name"
                      label="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      error={formErrors.name}
                    />
                  </div>

                  <div className="col-md-6">
                    <FormField
                      type="email"
                      name="email"
                      label="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      error={formErrors.email}
                    />
                  </div>

                  <div className="col-12">
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

                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-3 position-relative overflow-hidden"
                      disabled={isSubmitting}
                      style={{ transition: 'all 0.3s ease' }}
                    >
                      {isSubmitting ? (
                        <>
                          <span 
                            className="spinner-border spinner-border-sm me-2" 
                            role="status" 
                            aria-hidden="true"
                          ></span>
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;