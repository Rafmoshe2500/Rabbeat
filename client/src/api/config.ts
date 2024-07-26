import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://193.106.55.125/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
