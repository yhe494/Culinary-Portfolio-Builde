// src/api/api.js
import axios from "axios";

// For debugging
console.log("API base URL: /api");

const API = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Add request interceptor for debugging
API.interceptors.request.use(
  config => {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`, config.data);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Auth endpoints - Using the exact endpoint paths from the backend
export const signin = (data) => API.post("/signin", data);
export const signout = () => API.post("/signout");
export const register = (data) => API.post("/users", data);

// Templates endpoints
export const login = (data) => API.post("/auth/login", data);
export const getTemplates = () => API.get("/templates");
export const createTemplate = (data) => API.post("/template", data);
export const updateTemplate = (id, data) => API.put(`/templates/${id}`, data);
export const deleteTemplate = (id) => API.delete(`/templates/${id}`);
