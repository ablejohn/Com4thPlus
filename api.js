import { db } from "./firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
  addDoc,
} from "firebase/firestore";

export const api = {
  async getProperties() {
    try {
      const docRef = doc(db, "properties", "propertyList");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Fetched Firestore data:", data);
        if (data.list) {
          return data.list.map((property) => ({
            ...property,
            images: property.images || [],
            blockedDates: property.blockedDates || [],
          }));
        }
        console.log("No 'list' field in document");
        return [];
      }
      console.log("Document does not exist");
      return [];
    } catch (error) {
      console.error("Error fetching properties:", error);
      return [];
    }
  },

  async saveProperties(properties) {
    try {
      const updatedProperties = properties.map((property) => ({
        ...property,
        images: property.images || [],
        blockedDates: property.blockedDates || [],
      }));
      console.log("Saving properties:", updatedProperties);
      await setDoc(doc(db, "properties", "propertyList"), {
        list: updatedProperties,
      });
      return true;
    } catch (error) {
      console.error("Error saving properties:", error);
      return false;
    }
  },

  async deleteProperty(id) {
    try {
      const currentProperties = await api.getProperties();
      const updatedProperties = currentProperties.filter((p) => p.id !== id);
      console.log("Deleting property ID:", id, "New list:", updatedProperties);
      await setDoc(doc(db, "properties", "propertyList"), {
        list: updatedProperties,
      });
      return true;
    } catch (error) {
      console.error("Error deleting property:", error);
      return false;
    }
  },

  async updateProperty(propertyId, updates) {
    try {
      const currentProperties = await api.getProperties();
      const updatedProperties = currentProperties.map((property) =>
        property.id === propertyId ? { ...property, ...updates } : property
      );
      console.log("Updating property ID:", propertyId, "Updates:", updates);
      await setDoc(doc(db, "properties", "propertyList"), {
        list: updatedProperties,
      });
      return true;
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  },

  async updateBlockedDates(propertyId, newBlockedDates) {
    try {
      const currentProperties = await api.getProperties();
      const updatedProperties = currentProperties.map((property) =>
        property.id === propertyId
          ? { ...property, blockedDates: newBlockedDates }
          : property
      );
      console.log(
        "Updating blocked dates for property ID:",
        propertyId,
        "New blocked dates:",
        newBlockedDates
      );
      await setDoc(doc(db, "properties", "propertyList"), {
        list: updatedProperties,
      });
      return true;
    } catch (error) {
      console.error("Error updating blocked dates:", error);
      throw error;
    }
  },

  async createBooking(bookingData) {
    try {
      const bookingRef = await addDoc(collection(db, "bookings"), {
        ...bookingData,
        createdAt: new Date().toISOString(),
      });
      console.log("Booking created with ID:", bookingRef.id);
      return { success: true, id: bookingRef.id };
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },
};
