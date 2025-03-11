import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../../api";

const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch properties on mount
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

  // Update blocked dates for a property
  const updatePropertyBlockedDates = async (propertyId, newBlockedDates) => {
    if (!propertyId) {
      console.error("Missing property ID in updatePropertyBlockedDates");
      throw new Error("Property ID is required to update blocked dates");
    }

    try {
      setLoading(true);

      // Log what we're sending to the API for debugging
      console.log("API call updateBlockedDates with:", {
        propertyId,
        newBlockedDates,
      });

      await api.updateBlockedDates(propertyId, newBlockedDates);

      // Update the properties state with the new blocked dates
      setProperties((prevProperties) => {
        // Find the property index
        const propertyIndex = prevProperties.findIndex(
          (p) => p.id === propertyId
        );

        // If property not found, return unchanged state
        if (propertyIndex === -1) {
          console.error(`Property with ID ${propertyId} not found in context`);
          return prevProperties;
        }

        // Create a new array with the updated property
        const updatedProperties = [...prevProperties];
        updatedProperties[propertyIndex] = {
          ...updatedProperties[propertyIndex],
          blockedDates: newBlockedDates,
        };

        return updatedProperties;
      });

      return true; // Indicate success
    } catch (error) {
      console.error("Failed to update blocked dates:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update property details
  const updateProperty = async (propertyId, updates) => {
    if (!propertyId) {
      console.error("Missing property ID in updateProperty");
      throw new Error("Property ID is required to update property");
    }

    try {
      setLoading(true);
      await api.updateProperty(propertyId, updates);

      setProperties((prevProperties) => {
        const propertyIndex = prevProperties.findIndex(
          (p) => p.id === propertyId
        );

        if (propertyIndex === -1) {
          console.error(`Property with ID ${propertyId} not found in context`);
          return prevProperties;
        }

        const updatedProperties = [...prevProperties];
        updatedProperties[propertyIndex] = {
          ...updatedProperties[propertyIndex],
          ...updates,
        };

        return updatedProperties;
      });

      return true;
    } catch (error) {
      console.error("Failed to update property:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    properties,
    setProperties,
    loading,
    updatePropertyBlockedDates,
    updateProperty,
  };

  return (
    <PropertyContext.Provider value={value}>
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
