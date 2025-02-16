import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="container py-5">
      {/* Header Section */}
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3 text-primary">Contact Us</h1>
        <p className="lead text-muted mb-0">
          We'd love to hear from you! Reach out to us for any inquiries or feedback.
        </p>
      </header>

      {/* Contact Information and Form Section */}
      <div className="row g-4">
        {/* Contact Information */}
        <div className="col-lg-5">
          <div className="card h-100 border-0 shadow-sm hover-shadow transition">
            <div className="card-body p-4">
              <div className="contact-info mb-5">
                <h3 className="h4 mb-4 d-flex align-items-center">
                  <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                  Our Office
                </h3>
                <ul className="list-unstyled mb-0">
                  <li className="mb-3 d-flex align-items-center">
                    <i className="bi bi-building text-primary me-3 fs-5"></i>
                    <span>123 Luxury Street, New York, NY 10001</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <i className="bi bi-telephone-fill text-primary me-3 fs-5"></i>
                    <a href="tel:+11234567890" className="text-decoration-none text-body">
                      +1 (123) 456-7890
                    </a>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <i className="bi bi-envelope-fill text-primary me-3 fs-5"></i>
                    <a href="mailto:info@com4thplus.com" className="text-decoration-none text-body">
                      info@com4thplus.com
                    </a>
                  </li>
                </ul>
              </div>

              {/* Business Hours */}
              <div className="business-hours">
                <h3 className="h4 mb-4 d-flex align-items-center">
                  <i className="bi bi-clock-fill text-primary me-2"></i>
                  Business Hours
                </h3>
                <ul className="list-unstyled mb-0">
                  <li className="mb-3 d-flex justify-content-between align-items-center">
                    <span className="fw-medium">Monday - Friday</span>
                    <span className="badge bg-primary">9:00 AM - 6:00 PM</span>
                  </li>
                  <li className="mb-3 d-flex justify-content-between align-items-center">
                    <span className="fw-medium">Saturday</span>
                    <span className="badge bg-primary">10:00 AM - 4:00 PM</span>
                  </li>
                  <li className="mb-3 d-flex justify-content-between align-items-center">
                    <span className="fw-medium">Sunday</span>
                    <span className="badge bg-secondary">Closed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-lg-7">
          <div className="card h-100 border-0 shadow-sm hover-shadow transition">
            <div className="card-body p-4">
              <h3 className="h4 mb-4 d-flex align-items-center">
                <i className="bi bi-send-fill text-primary me-2"></i>
                Send Us a Message
              </h3>

              {submitStatus === 'success' && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  Message sent successfully!
                  <button type="button" className="btn-close" onClick={() => setSubmitStatus(null)}></button>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  There was an error sending your message. Please try again.
                  <button type="button" className="btn-close" onClick={() => setSubmitStatus(null)}></button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="needs-validation">
                <div className="row g-3">
                  {/* Name Field */}
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="name">Your Name</label>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="email">Your Email</label>
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="subject"
                        name="subject"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="subject">Subject</label>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        placeholder="Your Message"
                        style={{ height: "150px" }}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                      <label htmlFor="message">Your Message</label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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