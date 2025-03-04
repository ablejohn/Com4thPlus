import { db } from "./firebase";
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
      const docRef = doc(db, "properties", "propertyList");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Fetched Firestore data:", data); // Debug log
        if (data.list) {
          return data.list.map((property) => ({
            ...property,
            images: property.images || [],
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
      }));
      console.log("Saving properties:", updatedProperties); // Debug log
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
      console.log("Deleting property ID:", id, "New list:", updatedProperties); // Debug log
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
