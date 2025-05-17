const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiOptions {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
}

async function api(endpoint: string, options: ApiOptions = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
    }

    return response.json();
}

export const authApi = {
    startRegistration: (phoneNumber: string) =>
        api('/auth/start-registration', { method: 'POST', body: { phoneNumber } }),

    verifyPhone: (phoneNumber: string, otp: string) =>
        api('/auth/verify-phone', { method: 'POST', body: { phoneNumber, otp } }),

    register: (data: any) =>
        api('/auth/register', { method: 'POST', body: data }),

    verifyEmail: (email: string, otp: string) =>
        api('/auth/verify-email', { method: 'POST', body: { email, otp } }),

    submitKyc: (kycDetails: any) =>
        api('/auth/kyc', { method: 'POST', body: kycDetails }),
}; 