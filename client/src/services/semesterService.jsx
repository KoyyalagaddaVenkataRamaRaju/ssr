import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const  fetchAllSemsters = async () => {
  try {
    const response = await api.get('/api/semesters');   
    console.log(response.data)
    return response.data;
    } catch (error) {   
    throw error.response?.data || { message: 'Network error' };
  }
}