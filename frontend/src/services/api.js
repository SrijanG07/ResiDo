const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const propertyService = {
  // Get all properties with filters
  async getProperties(filters = {}) {
    const queryParams = new URLSearchParams();

    if (filters.city) queryParams.append("city", filters.city);
    if (filters.locality) queryParams.append("locality", filters.locality);
    if (filters.min_price) queryParams.append("min_price", filters.min_price);
    if (filters.max_price) queryParams.append("max_price", filters.max_price);
    if (filters.property_type)
      queryParams.append("property_type", filters.property_type);
    if (filters.listing_type)
      queryParams.append("listing_type", filters.listing_type);
    if (filters.bedrooms) queryParams.append("bedrooms", filters.bedrooms);
    if (filters.pet_friendly)
      queryParams.append("pet_friendly", filters.pet_friendly);
    if (filters.bachelor_friendly)
      queryParams.append("bachelor_friendly", filters.bachelor_friendly);

    const response = await fetch(`${API_BASE_URL}/properties?${queryParams}`);
    if (!response.ok) throw new Error("Failed to fetch properties");
    return response.json();
  },

  // Get single property
  async getPropertyById(id) {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`);
    if (!response.ok) throw new Error("Failed to fetch property");
    return response.json();
  },
};

export const authService = {
  async register(data) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Registration failed");
    return response.json();
  },

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Login failed");
    return response.json();
  },
};

// Upload Service for Cloudinary
export const uploadService = {
  // Upload single image
  async uploadImage(file, type = "property") {
    const token = localStorage.getItem("ResiDo_token");
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type); // 'property' or 'panorama'

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload image");
    }
    return response.json();
  },

  // Upload multiple images
  async uploadImages(files, type = "property") {
    const token = localStorage.getItem("ResiDo_token");
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });
    formData.append("type", type);

    const response = await fetch(`${API_BASE_URL}/upload/images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload images");
    }
    return response.json();
  },

  // Delete image
  async deleteImage(publicId) {
    const token = localStorage.getItem("ResiDo_token");
    const response = await fetch(
      `${API_BASE_URL}/upload/image/${encodeURIComponent(publicId)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete image");
    }
    return response.json();
  },
};
