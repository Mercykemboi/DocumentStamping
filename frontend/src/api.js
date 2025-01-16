import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/auth", // Replace with your backend URL
});

// Add the token to the Authorization header for authenticated requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
