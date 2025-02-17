import React, { useState } from "react";
import { X, Calendar, Users, Clock, ChevronRight } from "lucide-react";

const BookingModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "1",
    special: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="booking-modal">
        <button className="close-button" onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>

        <div className="modal-content">
          <h3 className="modal-title">Book Your Luxury Stay</h3>
          <p className="modal-subtitle">
            Experience premium living in GRA Ikeja
          </p>

          <form onSubmit={handleSubmit} className="booking-form">
            {/* Check-in Date */}
            <div className="form-group">
              <label htmlFor="checkIn" className="input-label">
                Check-in Date
              </label>
              <div className="input-wrapper">
                <Calendar className="input-icon" size={20} />
                <input
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) =>
                    setFormData({ ...formData, checkIn: e.target.value })
                  }
                  required
                  className="form-input"
                  id="checkIn"
                />
              </div>
            </div>

            {/* Check-out Date */}
            <div className="form-group">
              <label htmlFor="checkOut" className="input-label">
                Check-out Date
              </label>
              <div className="input-wrapper">
                <Calendar className="input-icon" size={20} />
                <input
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) =>
                    setFormData({ ...formData, checkOut: e.target.value })
                  }
                  required
                  className="form-input"
                  id="checkOut"
                />
              </div>
            </div>

            {/* Number of Guests */}
            <div className="form-group">
              <label htmlFor="guests" className="input-label">
                Number of Guests
              </label>
              <div className="input-wrapper">
                <Users className="input-icon" size={20} />
                <select
                  value={formData.guests}
                  onChange={(e) =>
                    setFormData({ ...formData, guests: e.target.value })
                  }
                  className="form-input"
                  required
                  id="guests"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} Guest{num > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Special Requests */}
            <div className="form-group">
              <label htmlFor="special" className="input-label">
                Special Requests
              </label>
              <div className="input-wrapper">
                <Clock className="input-icon" size={20} />
                <textarea
                  value={formData.special}
                  onChange={(e) =>
                    setFormData({ ...formData, special: e.target.value })
                  }
                  className="form-input"
                  placeholder="Any special requests?"
                  rows="3"
                  id="special"
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-button">
              Confirm Booking
              <ChevronRight size={18} />
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }

        .booking-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          z-index: 1001;
          animation: slideIn 0.3s ease-out;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .close-button:hover {
          background: #f0f0f0;
          transform: rotate(90deg);
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #003087;
        }

        .modal-subtitle {
          color: #666;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          position: relative;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #003087;
          z-index: 1;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:focus {
          border-color: #003087;
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 48, 135, 0.1);
        }

        textarea.form-input {
          resize: vertical;
          min-height: 100px;
          padding-left: 1rem;
        }

        .input-label {
          display: block;
          margin-bottom: 0.5rem;
          color: #003087;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .submit-button {
          background: linear-gradient(to right, #003087, #004299);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: transform 0.3s ease;
          font-size: 0.9rem;
        }

        .submit-button:hover {
          transform: translateY(-2px);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        @media (max-width: 480px) {
          .booking-modal {
            padding: 1rem;
          }

          .modal-title {
            font-size: 1.25rem;
          }

          .modal-subtitle {
            font-size: 0.8rem;
          }

          .form-input {
            padding: 0.5rem 0.5rem 0.5rem 2.5rem;
            font-size: 0.8rem;
          }

          .input-label {
            font-size: 0.8rem;
          }

          .submit-button {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </>
  );
};

export default BookingModal;