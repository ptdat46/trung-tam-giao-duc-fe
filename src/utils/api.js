import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('authToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.data && !(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        const responseData = response.data?.data !== undefined ? response.data.data : response.data;
        return { success: true, data: responseData, status: response.status };
    },
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove('authToken');
            const path = window.location.pathname || '/';
            let target = '/login';
            if (path.startsWith('/admin')) target = '/admin/login';
            else if (path.startsWith('/manager')) target = '/manager/login';
            else if (path.startsWith('/editor')) target = '/editor/login';
            if (path !== target && path !== '/') {
                window.location.replace(target);
            }
        }
        const errorMessage = error.response?.data?.message || error.message || 'Network Error';
        const errorData = error.response?.data?.errors || null;
        return { success: false, error: errorMessage, data: errorData, status: error.response?.status };
    }
);

export const api = {
    get: (endpoint) => apiClient.get(endpoint),
    post: (endpoint, data) => apiClient.post(endpoint, data),
    put: (endpoint, data) => apiClient.put(endpoint, data),
    delete: (endpoint, data = null) => {
        if (data) {
            return apiClient.delete(endpoint, { data });
        }
        return apiClient.delete(endpoint);
    },
};

export const setAuthToken = (token) => {
    Cookies.set('authToken', token, {
        expires: 7,
        path: '/',
    });
};

export const setAuthRole = (role) => {
    Cookies.set('authRole', role, {
        expires: 7,
        path: '/',
    });
};

export const authApi = {
    login: (email, password, role) => {
        return apiClient.post(`/${role}/login`, { email, password });
    },
    register: (name, email, password, repassword, role) => {
        return apiClient.post(`/${role}/register`, {
            name,
            email,
            password,
            repassword,
        });
    },
    logout: (role) => {
        return apiClient.post(`/${role}/logout`);
    },
    me: (role) => {
        return apiClient.get(`/${role}/me`);
    },
};

export default api;
