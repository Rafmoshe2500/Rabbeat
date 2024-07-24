import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://193.106.55.125:3000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
