import axios from "axios";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // Set a timeout for requests
});

apiClient.interceptors.request.use(
  (config) => {
    // Check if mock mode is enabled
    if (import.meta.env.VITE_USE_MOCK_API === "true") {
      // Log the request for debugging
      console.warn(`Request made to mock: ${config.url}`, config);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
