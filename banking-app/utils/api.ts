const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface ApiOptions {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
}

async function api(endpoint: string, options: ApiOptions = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        body: options.body ? JSON.stringify(options.body) : undefined,
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
        api('/auth/start-registration', {
            method: 'POST',
            body: { phoneNumber: phoneNumber.replace(/\D/g, '') } // Remove non-digits
        }),

    verifyPhone: (phoneNumber: string, otp: string) =>
        api('/auth/verify-phone', {
            method: 'POST',
            body: {
                phoneNumber: phoneNumber.replace(/\D/g, ''),
                otp
            }
        }),

    register: (data: any) =>
        api('/auth/register', { method: 'POST', body: data }),

    verifyEmail: (email: string, otp: string) =>
        api('/auth/verify-email', { method: 'POST', body: { email, otp } }),

    submitKyc: (kycDetails: any) =>
        api('/auth/kyc', { method: 'POST', body: kycDetails }),
}; 