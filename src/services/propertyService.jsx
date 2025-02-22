import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const propertyService = {
  // Existing methods remain the same
  async createProperty(propertyData) {
    try {
      const formData = new FormData();
      const propertyDataWithoutImages = { ...propertyData };
      delete propertyDataWithoutImages.images;
      formData.append("data", JSON.stringify(propertyDataWithoutImages));

      propertyData.images.forEach((image) => {
        formData.append(`images`, image);
      });

      const response = await axios.post(
        `${API_BASE_URL}/api/properties`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating property:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create property"
      );
    }
  },

  async uploadImages(images) {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await axios.post(
        `${API_BASE_URL}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error(
        error.response?.data?.message || "Failed to upload images"
      );
    }
  },

  async getProperties() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/properties`);
      return response.data;
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch properties"
      );
    }
  },

  // New methods for updating and deleting properties
  async updateProperty(propertyId, propertyData) {
    try {
      const formData = new FormData();
      const propertyDataWithoutImages = { ...propertyData };

      // Handle existing images that are kept
      if (propertyData.existingImages) {
        propertyDataWithoutImages.images = propertyData.existingImages;
      }
      delete propertyDataWithoutImages.newImages;

      formData.append("data", JSON.stringify(propertyDataWithoutImages));

      // Append any new images
      if (propertyData.newImages) {
        propertyData.newImages.forEach((image) => {
          formData.append(`images`, image);
        });
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/properties/${propertyId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating property:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update property"
      );
    }
  },

  async deleteProperty(propertyId) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/properties/${propertyId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting property:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete property"
      );
    }
  },

  async toggleAvailability(propertyId, isAvailable) {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/properties/${propertyId}/availability`,
        { availability: isAvailable }
      );
      return response.data;
    } catch (error) {
      console.error("Error toggling availability:", error);
      throw new Error(
        error.response?.data?.message || "Failed to toggle availability"
      );
    }
  },
};
