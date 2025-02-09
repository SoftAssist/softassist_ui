import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8087/api/v1';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add Clerk token here later
    // const token = await getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject({
      message: 'An error occurred while sending the request',
      originalError: error
    });
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    try {
      return response.data;
    } catch (error) {
      console.error('Response parsing error:', error);
      return Promise.reject({
        message: 'Error parsing response data',
        originalError: error
      });
    }
  },
  (error) => {
    // Handle different error cases
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data
      });
      return Promise.reject({
        message: error.response.data?.message || 'Server error occurred',
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
      return Promise.reject({
        message: 'Network error - no response from server',
        originalError: error
      });
    } else {
      // Other errors
      console.error('Error:', error.message);
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        originalError: error
      });
    }
  }
);

// Helper function for making API calls
const apiRequest = async ({
  method = 'GET',
  url,
  data = null,
  params = null,
  headers = {},
}) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      params,
      headers: {
        ...axiosInstance.defaults.headers,
        ...headers,
      },
    });
    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    throw {
      message: error.message || 'An error occurred during the API request',
      originalError: error
    };
  }
};

export { apiRequest };
export default axiosInstance; 