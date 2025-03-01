import React, { useState, useEffect, useCallback, memo } from "react";
import { FaShieldAlt, FaAward, FaHeart, FaChevronDown } from "react-icons/fa";
import { Fade } from "react-awesome-reveal";
import { Parallax } from "react-parallax";

// Memoized Feature Card component for performance
const FeatureCard = memo(({ icon, title, desc, index, totalItems }) => {
  const getAnimationDirection = () => {
    // Create a staggered animation pattern
    if (totalItems === 1) return "up";
    if (totalItems === 2) return index === 0 ? "left" : "right";
    return index === 0 ? "left" : index === totalItems - 1 ? "right" : "up";
  };

  return (
    <Fade direction={getAnimationDirection()} triggerOnce delay={index * 150} duration={800}>
      <div className="feature-card">
        <div className="feature-content">
          <div className="icon-wrapper" aria-hidden="true">
            {icon}
          </div>
          <div className="feature-text">
            <h3 className="feature-title">{title}</h3>
            <p className="feature-desc">{desc}</p>
          </div>
        </div>
        <div className="feature-accent-border"></div>
      </div>
    </Fade>
  );
});

FeatureCard.displayName = "FeatureCard";

const WhyChooseUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolledToView, setHasScrolledToView] = useState(false);

  const features = [
    {
      icon: <FaShieldAlt size={32} aria-hidden="true" />,
      title: "Location",
      desc: "Prime location close to airports, restaurants, and business hubs",
    },
    {
      icon: <FaAward size={32} aria-hidden="true" />,
      title: "Premium Service",
      desc: "Comfortable and well-furnished accommodations for restful stays",
    },
    {
      icon: <FaHeart size={32} aria-hidden="true" />,
      title: "Security",
      desc: "Secure environment with 24/7 security for peace of mind",
    },
  ];

  const scrollToAboutUs = useCallback(() => {
    const aboutSection = document.getElementById("about-us");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Intersection Observer for animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasScrolledToView) {
          setIsVisible(true);
          setHasScrolledToView(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector(".why-choose-section");
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, [hasScrolledToView]);

  return (
    <Parallax
      bgImage="/images/luxury-apartment-bg.jpg"
      strength={300}
      bgImageStyle={{ objectFit: "cover", objectPosition: "center" }}
      blur={{ min: -5, max: 5 }}
      className="parallax-wrapper"
    >
      <div className="overlay"></div>
      <section 
        className={`why-choose-section ${isVisible ? 'is-visible' : ''}`}
        aria-labelledby="why-choose-title"
      >
        <div className="container">
          <div className="content-wrapper">
            <div className="left-column">
              <header className="section-header">
                <span className="badge">Our Commitment</span>
                <h2 id="why-choose-title" className="section-title">Why Choose Com4thPlus</h2>
                <div className="title-separator"></div>
                <p className="section-subtitle">Experience the difference with our premium accommodations and services</p>
                
                <button
                  className="btn-learn-more"
                  onClick={scrollToAboutUs}
                  aria-label="Learn more about Com4thPlus"
                >
                  <span className="btn-text">Learn More</span>
                  <span className="btn-icon"><FaChevronDown size={14} /></span>
                </button>
              </header>
            </div>
            
            <div className="right-column">
              <div className="features-container">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={feature.title}
                    icon={feature.icon}
                    title={feature.title}
                    desc={feature.desc}
                    index={index}
                    totalItems={features.length}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Styles */}
        <style jsx>{`
          /* Base Variables */
          :root {
            --primary: #40E0D0;
            --primary-dark: #2BBEB0;
            --primary-light: rgba(64, 224, 208, 0.2);
            --primary-glow: rgba(64, 224, 208, 0.6);
            --secondary: #002060;
            --secondary-light: rgba(0, 32, 96, 0.7);
            --text-white: #fff;
            --text-light: rgba(255, 255, 255, 0.85);
            --text-muted: rgba(255, 255, 255, 0.7);
            
            --card-bg: rgba(255, 255, 255, 0.06);
            --card-hover: rgba(255, 255, 255, 0.09);
            --card-border: rgba(255, 255, 255, 0.1);
            
            --space-xs: 0.5rem;
            --space-sm: 1rem;
            --space-md: 1.5rem;
            --space-lg: 2.5rem;
            --space-xl: 4rem;
            
            --radius-sm: 4px;
            --radius-md: 8px;
            --radius-lg: 16px;
            --radius-round: 50px;
            
            --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.15);
            --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.2);
            --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.3);
            
            --transition-fast: 0.25s ease;
            --transition-medium: 0.4s ease;
          }
          
          /* Layout & Structure */
          .parallax-wrapper {
            position: relative;
            overflow: hidden;
          }
          
          .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--secondary) 0%, rgba(0, 20, 60, 0.85) 100%);
            z-index: 1;
          }
          
          .why-choose-section {
            position: relative;
            padding: 7rem 0;
            color: var(--text-white);
            z-index: 2;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
          }
          
          .why-choose-section.is-visible {
            opacity: 1;
            transform: translateY(0);
          }
          
          .container {
            width: 90%;
            max-width: 1280px;
            margin: 0 auto;
          }
          
          .content-wrapper {
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--space-xl);
          }
          
          /* Left Column - Header */
          .section-header {
            position: relative;
            max-width: 540px;
          }
          
          .badge {
            display: inline-block;
            background-color: rgba(64, 224, 208, 0.1);
            color: var(--primary);
            font-weight: 600;
            font-size: 0.75rem;
            padding: 0.5rem 1.25rem;
            border-radius: var(--radius-round);
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-bottom: var(--space-sm);
            backdrop-filter: blur(8px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          
          .section-title {
            font-size: 2.75rem;
            font-weight: 700;
            letter-spacing: -0.5px;
            line-height: 1.2;
            margin-bottom: var(--space-sm);
            color: var(--text-white);
            position: relative;
            display: inline-block;
          }
          
          .title-separator {
            width: 70px;
            height: 3px;
            background: linear-gradient(to right, var(--primary), var(--primary-light));
            margin-bottom: var(--space-md);
            border-radius: var(--radius-sm);
          }
          
          .section-subtitle {
            font-size: 1.1rem;
            font-weight: 300;
            line-height: 1.6;
            color: var(--text-light);
            margin-bottom: var(--space-lg);
          }
          
          .btn-learn-more {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: var(--primary);
            color: var(--secondary);
            font-weight: 600;
            padding: 0.9rem 2rem;
            border-radius: var(--radius-round);
            border: none;
            box-shadow: var(--shadow-sm);
            transition: all var(--transition-fast);
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }
          
          .btn-learn-more::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
            transform: translateX(-100%);
            transition: transform 0.6s ease;
          }
          
          .btn-learn-more:hover {
            background: var(--primary-dark);
            box-shadow: var(--shadow-md);
            transform: translateY(-3px);
          }
          
          .btn-learn-more:hover::before {
            transform: translateX(100%);
          }
          
          .btn-text {
            position: relative;
            z-index: 2;
          }
          
          .btn-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 2;
            transition: transform 0.3s ease;
          }
          
          .btn-learn-more:hover .btn-icon {
            transform: translateY(3px);
          }
          
          /* Right Column - Features */
          .features-container {
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--space-md);
            height: 100%;
          }
          
          .feature-card {
            background: var(--card-bg);
            border-radius: var(--radius-lg);
            overflow: hidden;
            position: relative;
            transition: all var(--transition-medium);
            border: 1px solid var(--card-border);
            backdrop-filter: blur(10px);
            box-shadow: var(--shadow-sm);
          }
          
          .feature-content {
            display: flex;
            align-items: center;
            gap: var(--space-md);
            padding: var(--space-lg);
          }
          
          .icon-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 64px;
            height: 64px;
            background: linear-gradient(135deg, var(--primary), var(--primary-light));
            border-radius: 12px;
            color: var(--secondary);
            transition: all var(--transition-medium);
            box-shadow: 0 3px 10px rgba(64, 224, 208, 0.2);
          }
          
          .feature-text {
            flex: 1;
          }
          
          .feature-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: var(--space-xs);
            color: var(--text-white);
            transition: color var(--transition-fast);
          }
          
          .feature-desc {
            color: var(--text-muted);
            font-size: 0.95rem;
            line-height: 1.5;
            margin: 0;
            transition: color var(--transition-fast);
          }
          
          .feature-accent-border {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(to right, var(--primary), transparent);
            transform: scaleX(0);
            transform-origin: left;
            transition: transform var(--transition-medium);
          }
          
          .feature-card:hover {
            background: var(--card-hover);
            transform: translateY(-5px);
            box-shadow: var(--shadow-md);
            border-color: rgba(64, 224, 208, 0.2);
          }
          
          .feature-card:hover .feature-accent-border {
            transform: scaleX(1);
          }
          
          .feature-card:hover .feature-title {
            color: var(--primary);
          }
          
          .feature-card:hover .feature-desc {
            color: var(--text-light);
          }
          
          .feature-card:hover .icon-wrapper {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(64, 224, 208, 0.3);
          }
          
          /* Responsive Styles */
          @media (min-width: 1024px) {
            .content-wrapper {
              grid-template-columns: 1fr 1fr;
              align-items: center;
            }
            
            .left-column {
              padding-right: var(--space-lg);
            }
            
            .right-column {
              position: relative;
            }
            
            .right-column::before {
              content: "";
              position: absolute;
              left: -50px;
              top: 50%;
              height: 80%;
              width: 1px;
              background: linear-gradient(to bottom, transparent, var(--primary), transparent);
              transform: translateY(-50%);
            }
            
            .section-title {
              font-size: 3rem;
            }
          }
          
          @media (min-width: 768px) and (max-width: 1023px) {
            .section-title {
              font-size: 2.5rem;
            }
            
            .features-container {
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            }
          }
          
          @media (max-width: 767px) {
            .why-choose-section {
              padding: 5rem 0;
            }
            
            .section-title {
              font-size: 2rem;
            }
            
            .feature-content {
              flex-direction: column;
              text-align: center;
              gap: var(--space-sm);
            }
            
            .section-header {
              text-align: center;
              margin: 0 auto var(--space-xl);
            }
            
            .title-separator {
              margin-left: auto;
              margin-right: auto;
            }
          }
          
          @media (prefers-reduced-motion: reduce) {
            .why-choose-section, .feature-card, .icon-wrapper, .feature-accent-border,
            .btn-learn-more, .btn-learn-more::before, .btn-icon {
              transition: none;
            }
          }
        `}</style>
      </section>
    </Parallax>
  );
};

export default WhyChooseUs;