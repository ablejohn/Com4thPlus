import { db } from "./firebase"; // Adjust path if needed
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

export const api = {
  async getProperties() {
    try {
      // Get the propertyList document which contains all properties
      const docRef = doc(db, "properties", "propertyList");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().list) {
        // Return the list of properties from the document
        return docSnap.data().list.map((property) => ({
          ...property,
          // Ensure images is always an array
          images: property.images || [],
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching properties:", error);
      return [];
    }
  },

  async saveProperties(properties) {
    try {
      // Ensure each property has an images array
      const updatedProperties = properties.map((property) => ({
        ...property,
        images: property.images || [],
      }));

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
      await setDoc(doc(db, "properties", "propertyList"), {
        list: updatedProperties,
      });
      return true;
    } catch (error) {
      console.error("Error deleting property:", error);
      return false;
    }
  },
};
