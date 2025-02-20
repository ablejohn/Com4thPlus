import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const propertyService = {
  async createProperty(propertyData) {
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Add all property data except images
      const propertyDataWithoutImages = { ...propertyData };
      delete propertyDataWithoutImages.images;
      formData.append("data", JSON.stringify(propertyDataWithoutImages));

      // Add images
      propertyData.images.forEach((image) => {
        formData.append(`images`, image);
      });

      const response = await axios.post(
        `${API_BASE_URL}/api/properties`, // Updated to include /api
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
        `${API_BASE_URL}/api/upload`, // Updated to include /api
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

  // Added a method to fetch properties
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
};
