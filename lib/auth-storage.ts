"use client"

// Client-side authentication storage utilities
const TOKEN_KEY = 'fulser_auth_token';
const USER_KEY = 'fulser_user_data';

export interface UserData {
    id: string;
    email: string;
    name: string | null;
    role: string;
}

export const authStorage = {
    // Save token to localStorage
    setToken: (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, token);
        }
    },

    // Get token from localStorage
    getToken: (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(TOKEN_KEY);
        }
        return null;
    },

    // Remove token from localStorage
    removeToken: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY);
        }
    },

    // Save user data to localStorage
    setUser: (user: UserData) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
    },

    // Get user data from localStorage
    getUser: (): UserData | null => {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem(USER_KEY);
            return userData ? JSON.parse(userData) : null;
        }
        return null;
    },

    // Remove user data from localStorage
    removeUser: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(USER_KEY);
        }
    },

    // Clear all auth data
    clearAuth: () => {
        authStorage.removeToken();
        authStorage.removeUser();
    },

    // Check if user is authenticated
    isAuthenticated: (): boolean => {
        return !!authStorage.getToken();
    }
};
