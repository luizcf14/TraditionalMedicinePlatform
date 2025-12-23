export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    const headers = {
        'ngrok-skip-browser-warning': 'true',
        ...options.headers,
    };

    return fetch(url, { ...options, headers });
};
