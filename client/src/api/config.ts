import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
