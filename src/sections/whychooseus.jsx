import React from "react";
import { FaShieldAlt, FaAward, FaHeart } from "react-icons/fa";
import { Fade } from "react-awesome-reveal";
import { Parallax } from "react-parallax";

const WhyChooseUs = () => {
  const features = [
    {
      icon: (
        <FaShieldAlt size={50} role="img" aria-label="Verified Properties" />
      ),
      title: "Verified Properties",
      desc: "All properties are personally verified for quality and safety, ensuring a comfortable and secure stay for our guests.",
    },
    {
      icon: <FaAward size={50} role="img" aria-label="Premium Service" />,
      title: "Premium Service",
      desc: "Experience 24/7 concierge support with our dedicated team ready to assist you at any moment during your stay.",
    },
    {
      icon: <FaHeart size={50} role="img" aria-label="Best Value" />,
      title: "Best Value",
      desc: "Enjoy competitive rates with no hidden fees, guaranteed to provide the best value for your luxury accommodation.",
    },
  ];

  const handleLearnMoreClick = () => {
    document.getElementById("about-us").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Parallax
      bgImage="https://via.placeholder.com/1920x1080" // Replace with your background image
      strength={300}
    >
      <section className="py-5" style={{ backgroundColor: "rgba(0, 48, 135, 0.9)" }}>
        <div className="container">
          <h2 className="text-center text-white mb-5">Why Choose Com4thPlus</h2>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-md-4">
                <Fade direction="up" triggerOnce>
                  <div className="feature-card card h-100 border-0 text-center p-4 shadow-sm">
                    <div className="card-body">
                      <div
                        className="icon-wrapper mb-4"
                        style={{ color: "#FFD700" }}
                      >
                        {feature.icon}
                      </div>
                      <h4 className="card-title mb-3 text-white">{feature.title}</h4>
                      <p className="card-text text-light">{feature.desc}</p>
                    </div>
                  </div>
                </Fade>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <button
              className="btn btn-primary btn-lg"
              style={{
                backgroundColor: "#FFD700",
                borderColor: "#FFD700",
                color: "#003087",
              }}
              onClick={handleLearnMoreClick}
              aria-label="Learn more about Com4thPlus"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Custom Styles */}
        <style>
          {`
            .feature-card {
              transition: transform 0.3s ease, box-shadow 0.3s ease;
              background: linear-gradient(145deg, #0044cc, #003087);
              border-radius: 15px;
            }
            .feature-card:hover {
              transform: translateY(-10px);
              box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.25);
            }
            .icon-wrapper {
              transition: transform 0.3s ease;
            }
            .feature-card:hover .icon-wrapper {
              transform: scale(1.1);
            }
            .btn-primary:hover {
              background-color: #ffcc00 !important;
              border-color: #ffcc00 !important;
            }
          `}
        </style>
      </section>
    </Parallax>
  );
};

export default WhyChooseUs;