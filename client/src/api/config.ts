import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://rabbeat.cs.colman.ac.il/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
