import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://10.10.248.125/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;