// In production (built client), use relative path so it works on any domain.
// In development, default to localhost:3001.
export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    const headers = {
        'ngrok-skip-browser-warning': 'true',
        ...options.headers,
    };

    return fetch(url, { ...options, headers });
};
