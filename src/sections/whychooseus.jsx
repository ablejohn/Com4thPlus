import React from "react";
import { FaShieldAlt, FaAward, FaHeart } from "react-icons/fa";
import { Fade } from "react-awesome-reveal";
import { Parallax } from "react-parallax";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaShieldAlt size={36} role="img" aria-label="Verified Properties" />,
      title: "Verified Properties",
      desc: "All properties are personally verified for quality and safety, ensuring a comfortable and secure stay for our guests.",
    },
    {
      icon: <FaAward size={36} role="img" aria-label="Premium Service" />,
      title: "Premium Service",
      desc: "Experience 24/7 concierge support with our dedicated team ready to assist you at any moment during your stay.",
    },
    {
      icon: <FaHeart size={36} role="img" aria-label="Best Value" />,
      title: "Best Value",
      desc: "Enjoy competitive rates with no hidden fees, guaranteed to provide the best value for your luxury accommodation.",
    },
  ];

  const handleLearnMoreClick = () => {
    document.getElementById("about-us").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Parallax
      bgImage="/images/luxury-apartment-bg.jpg" // Update with your actual image path
      strength={200}
      blur={{ min: -5, max: 5 }}
    >
      <section className="why-choose-section py-5 py-md-6">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-7 text-center">
              <span className="badge text-uppercase rounded-pill mb-3">Our Commitment</span>
              <h2 className="section-title mb-3">Why Choose Com4thPlus</h2>
              <div className="title-separator mx-auto"></div>
              <p className="section-subtitle mb-0">Experience the difference with our premium accommodations and services</p>
            </div>
          </div>
          
          <div className="row g-4 justify-content-center">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <Fade direction="up" triggerOnce delay={index * 100}>
                  <div className="feature-card h-100">
                    <div className="icon-container">
                      <div className="icon-wrapper">{feature.icon}</div>
                    </div>
                    <h4 className="feature-title">{feature.title}</h4>
                    <p className="feature-desc">{feature.desc}</p>
                  </div>
                </Fade>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-5">
            <button
              className="btn-learn-more"
              onClick={handleLearnMoreClick}
              aria-label="Learn more about Com4thPlus"
            >
              Learn More About Us
            </button>
          </div>
        </div>

        {/* Custom Styles */}
        <style>
          {`
            .why-choose-section {
              position: relative;
              color: #fff;
              padding: 6rem 0;
              overflow: hidden;
              background-color: rgba(0, 32, 96, 0.85);
            }
            
            .badge {
              background-color: rgba(64, 224, 208, 0.15);
              color:  #40E0D0;
              font-weight: 600;
              font-size: 0.75rem;
              padding: 0.5rem 1rem;
              letter-spacing: 1px;
            }
            
            .section-title {
              font-size: 2.5rem;
              font-weight: 700;
              letter-spacing: -0.5px;
              color: #ffffff;
              margin-bottom: 1.5rem;
            }
            
            .title-separator {
              width: 60px;
              height: 3px;
              background: linear-gradient(90deg,  #40E0D0,rgb(149, 235, 226));
              margin-bottom: 1.5rem;
            }
            
            .section-subtitle {
              font-size: 1.1rem;
              font-weight: 300;
              color: rgba(255, 255, 255, 0.8);
              max-width: 600px;
              margin: 0 auto 2rem;
            }
            
            .feature-card {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(10px);
              border-radius: 16px;
              padding: 2.5rem 2rem;
              transition: all 0.4s ease;
              border: 1px solid rgba(64, 224, 208, 0.1);
              position: relative;
              text-align: center;
              overflow: hidden;
            }
            
            .feature-card:hover {
              transform: translateY(-10px);
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
              background: rgba(255, 255, 255, 0.08);
              border-color: rgba(64, 224, 208, 0.3);
            }
            
            .feature-card:before {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 4px;
              background: linear-gradient(90deg,  #40E0D0,rgb(12, 245, 222));
              transform: scaleX(0);
              transform-origin: left;
              transition: transform 0.4s ease;
            }
            
            .feature-card:hover:before {
              transform: scaleX(1);
            }
            
            .icon-container {
              margin-bottom: 1.5rem;
              display: flex;
              justify-content: center;
            }
            
            .icon-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
              color:  #40E0D0;
              background: rgba(64, 224, 208, 0.1);
              border-radius: 50%;
              width: 80px;
              height: 80px;
              margin: 0 auto;
              transition: all 0.4s ease;
            }
            
            .feature-card:hover .icon-wrapper {
              transform: scale(1.1) rotate(5deg);
              background: rgba(64, 224, 208, 0.2);
              box-shadow: 0 0 20px rgba(64, 224, 208, 0.4);
            }
            
            .feature-title {
              font-size: 1.4rem;
              font-weight: 600;
              margin-bottom: 1rem;
              color: #ffffff;
              position: relative;
              display: inline-block;
            }
            
            .feature-desc {
              color: rgba(255, 255, 255, 0.75);
              font-size: 1rem;
              line-height: 1.6;
              margin-bottom: 0;
            }
            
            .btn-learn-more {
              background: linear-gradient(90deg,  #40E0D0,rgb(122, 225, 215));
              color: #002060;
              font-weight: 600;
              padding: 0.9rem 2.5rem;
              border-radius: 50px;
              border: none;
              box-shadow: 0 5px 15px rgba(64, 224, 208, 0.3);
              transition: all 0.3s ease;
              position: relative;
              overflow: hidden;
              z-index: 1;
              font-size: 1rem;
              letter-spacing: 0.5px;
              cursor: pointer;
            }
            
            .btn-learn-more:before {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              width: 0;
              height: 100%;
              background: #002060;
              transition: width 0.4s ease;
              z-index: -1;
              border-radius: 50px;
            }
            
            .btn-learn-more:hover {
              color:  #40E0D0;
              box-shadow: 0 8px 25px rgba(64, 224, 208, 0.5);
              transform: translateY(-2px);
            }
            
            .btn-learn-more:hover:before {
              width: 100%;
            }
            
            @media (max-width: 768px) {
              .section-title {
                font-size: 2rem;
              }
              
              .feature-card {
                padding: 2rem 1.5rem;
              }
              
              .icon-wrapper {
                width: 70px;
                height: 70px;
              }
            }
          `}
        </style>
      </section>
    </Parallax>
  );
};

export default WhyChooseUs;