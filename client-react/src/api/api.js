

// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001",
  withCredentials: true,
});

export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const getTemplates = () => API.get("/templates");
export const createTemplate = (data) => API.post("/template", data);
export const updateTemplate = (id, data) => API.put(`/templates/${id}`, data);
export const deleteTemplate = (id) => API.delete(`/templates/${id}`);
