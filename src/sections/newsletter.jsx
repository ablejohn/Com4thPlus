import React from "react";

const Newsletter = () => {
  return (
    <section className="py-5" style={{ backgroundColor: "#003087" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h2 className="text-white mb-4">Get Special Offers</h2>
            <p className="text-white-50 mb-4">
              Subscribe to our newsletter and receive exclusive deals on luxury
              stays
            </p>
            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="Enter your email"
              />
              <button className="btn btn-warning btn-lg px-4 fw-bold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
