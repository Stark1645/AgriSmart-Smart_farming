import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkBackendHealth = async () => {
  try {
    const res = await api.get('/health');
    return res.data;
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
};
