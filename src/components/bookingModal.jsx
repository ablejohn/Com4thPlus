import React, { useState } from 'react';
import { X, Calendar, Users, Clock, ChevronRight } from 'lucide-react';

const BookingModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "1",
    special: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="modal show d-block" 
        tabIndex="-1" 
        role="dialog"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold text-primary">Book Your Luxury Stay</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
                aria-label="Close"
              />
            </div>
            
            <div className="modal-body">
              <p className="text-muted mb-4">Experience premium living in GRA Ikeja</p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="checkIn" className="form-label">Check-in Date</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Calendar size={18} />
                    </span>
                    <input
                      type="date"
                      className="form-control"
                      id="checkIn"
                      value={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="checkOut" className="form-label">Check-out Date</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Calendar size={18} />
                    </span>
                    <input
                      type="date"
                      className="form-control"
                      id="checkOut"
                      value={formData.checkOut}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="guests" className="form-label">Number of Guests</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Users size={18} />
                    </span>
                    <select
                      className="form-select"
                      id="guests"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      required
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} Guest{num > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="special" className="form-label">Special Requests</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Clock size={18} />
                    </span>
                    <textarea
                      className="form-control"
                      id="special"
                      rows="3"
                      value={formData.special}
                      onChange={(e) => setFormData({ ...formData, special: e.target.value })}
                      placeholder="Any special requests?"
                    ></textarea>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  Confirm Booking
                  <ChevronRight size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .modal-content {
          border-radius: 1rem;
          border: none;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .input-group-text {
          background-color: #f8f9fa;
          border-right: none;
        }

        .form-control, .form-select {
          border-left: none;
        }

        .form-control:focus, .form-select:focus {
          border-color: #ced4da;
          box-shadow: none;
          border-left: none;
        }

        .input-group-text svg {
          color: #0d6efd;
        }

        .btn-primary {
          background: linear-gradient(to right, #0d6efd, #0b5ed7);
          border: none;
          padding: 0.75rem 1.5rem;
          transition: transform 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 576px) {
          .modal-dialog {
            margin: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default BookingModal;