import React from "react";
import { FaShieldAlt, FaAward, FaHeart } from "react-icons/fa";

const WhyChooseUs = () => {
  const features = [
    {
      icon: (
        <FaShieldAlt size={40} role="img" aria-label="Verified Properties" />
      ),
      title: "Verified Properties",
      desc: "All properties are personally verified for quality and safety, ensuring a comfortable and secure stay for our guests.",
    },
    {
      icon: <FaAward size={40} role="img" aria-label="Premium Service" />,
      title: "Premium Service",
      desc: "Experience 24/7 concierge support with our dedicated team ready to assist you at any moment during your stay.",
    },
    {
      icon: <FaHeart size={40} role="img" aria-label="Best Value" />,
      title: "Best Value",
      desc: "Enjoy competitive rates with no hidden fees, guaranteed to provide the best value for your luxury accommodation.",
    },
  ];

  return (
    <section className="py-5" style={{ backgroundColor: "#003087" }}>
      <div className="container">
        <h2 className="text-center text-white mb-5">Why Choose Com4thPlus</h2>
        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-md-4">
              <div className="feature-card card h-100 border-0 text-center p-4 shadow-sm">
                <div className="card-body">
                  <div className="text-primary mb-4">{feature.icon}</div>
                  <h4 className="card-title mb-3 text-dark">{feature.title}</h4>
                  <p className="card-text text-muted">{feature.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Hover Effect */}
      <style>
        {`
          .feature-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15);
          }
        `}
      </style>
    </section>
  );
};

export default WhyChooseUs;
