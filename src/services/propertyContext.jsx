// PropertyContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../../api";

const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProperties()
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch properties:", error);
        setLoading(false);
      });
  }, []);

  return (
    <PropertyContext.Provider value={{ properties, setProperties, loading }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error("useProperties must be used within a PropertyProvider");
  }
  return context;
};
