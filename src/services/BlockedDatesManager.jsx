// BlockedDatesManager.jsx
import React, { useState, useEffect } from "react";
import { Spinner, Alert } from "react-bootstrap";

const BlockedDatesManager = ({ propertyId, onBlockedDatesLoaded, showMessage }) => {
  const [loading, setLoading] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);

  // Fetch blocked dates when property changes
  useEffect(() => {
    if (propertyId) {
      fetchBlockedDates(propertyId);
    }
  }, [propertyId]);

  // Pass the blocked dates to parent component when they change
  useEffect(() => {
    if (onBlockedDatesLoaded) {
      onBlockedDatesLoaded(blockedDates);
    }
  }, [blockedDates, onBlockedDatesLoaded]);

  // Fetch blocked dates for the selected property
  const fetchBlockedDates = async (propertyId) => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await api.getBlockedDates(propertyId);
      // setBlockedDates(response.data);

      // Simulated data for demonstration
      setTimeout(() => {
        const mockBlockedDates = [
          {
            id: 1,
            startDate: new Date(2025, 2, 15),
            endDate: new Date(2025, 2, 20),
          },
          {
            id: 2,
            startDate: new Date(2025, 3, 10),
            endDate: new Date(2025, 3, 15),
          },
        ];
        setBlockedDates(mockBlockedDates);
        setLoading(false);
      }, 600);
    } catch (error) {
      if (showMessage) {
        showMessage("Failed to load blocked dates", "danger");
      }
      setLoading(false);
    }
  };

  // Utility function to check date availability
  // This can be called by the parent component
  const checkDateAvailability = (checkInDate, checkOutDate) => {
    if (!blockedDates.length) return true;

    for (const blockedPeriod of blockedDates) {
      // Check if the selected date range overlaps with any blocked period
      if (
        (checkInDate >= blockedPeriod.startDate &&
          checkInDate <= blockedPeriod.endDate) ||
        (checkOutDate >= blockedPeriod.startDate &&
          checkOutDate <= blockedPeriod.endDate) ||
        (checkInDate <= blockedPeriod.startDate &&
          checkOutDate >= blockedPeriod.endDate)
      ) {
        return false;
      }
    }
    return true;
  };

  return (
    <>
      {loading && (
        <div className="text-center mb-3">
          <Spinner animation="border" size="sm" />
          <span className="ms-2">Loading availability...</span>
        </div>
      )}
      
      {blockedDates.length > 0 && (
        <Alert variant="info" className="small mb-3">
          <strong>Note:</strong> This property has {blockedDates.length} blocked period(s). 
          Please ensure your dates don't conflict with existing bookings.
        </Alert>
      )}
    </>
  );
};

// Export the component and the utility function
export default BlockedDatesManager;

// Export the utility function separately for direct use
export const checkDateAvailability = (blockedDates, checkInDate, checkOutDate) => {
  if (!blockedDates || !blockedDates.length) return true;

  for (const blockedPeriod of blockedDates) {
    // Check if the selected date range overlaps with any blocked period
    if (
      (checkInDate >= blockedPeriod.startDate &&
        checkInDate <= blockedPeriod.endDate) ||
      (checkOutDate >= blockedPeriod.startDate &&
        checkOutDate <= blockedPeriod.endDate) ||
      (checkInDate <= blockedPeriod.startDate &&
        checkOutDate >= blockedPeriod.endDate)
    ) {
      return false;
    }
  }
  return true;
};