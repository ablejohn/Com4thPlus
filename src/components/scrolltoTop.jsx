import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set up the scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="position-fixed bottom-0 end-0 m-4 p-3 bg-primary rounded-circle shadow-lg border-0 d-flex justify-content-center align-items-center"
          style={{
            width: "50px",
            height: "50px",
            zIndex: 1000,
            opacity: 0.9,
            transition: "all 0.3s ease",
            background: "linear-gradient(to right, #003087, #004299)",
            transform: isVisible ? "translateY(0)" : "translateY(100px)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(-5px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <ChevronUp size={24} color="white" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
