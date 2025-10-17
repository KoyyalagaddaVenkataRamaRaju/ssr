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

export const adminRegisterDepartement = async (departmentData) => {
  try {
    const response = await api.post('/api/departments/register', departmentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};


export const fetchTeachersByDepartment = async (departmentId) => {
  console.log(departmentId)
  try {
    const response = await api.get(`/api/admin/users?role=teacher&department=${departmentId}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};


export const getAllDepartments = async () => {
  try {
    const response = await api.get('/api/departments');
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const getDepartmentById = async (departmentId) => {
  try {
    const response = await api.get(`/api/departments/${departmentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const createBatch = async (departmentId, batchData) => {
  try {
    const response = await api.post(`/api/departments/${departmentId}/batches`, batchData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const getAllBatchesByDepartmentId = async (departmentId) => {
  try {
    const response = await api.get(`/api/departments/${departmentId}/batches`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export default api;