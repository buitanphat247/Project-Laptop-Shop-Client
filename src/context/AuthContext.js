import React, { createContext, useContext, useState, useLayoutEffect } from 'react';
import { getCookie, decodeBase64, getUserId, setCookie } from '../utils/auth';
import axiosClient from '../config/axios';

// Tạo context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useLayoutEffect(() => {
        const encodedProfile = getCookie('profile_user');
        if (encodedProfile) {
            try {
                const json = decodeBase64(decodeURIComponent(encodedProfile));
                const parsed = JSON.parse(json);

                setUser(parsed);
                setIsLoggedIn(true);
                setRole(parsed.role || null);
            } catch {
                setUser(null);
                setIsLoggedIn(false);
                setRole(null);
            }
        } else {
            setUser(null);
            setIsLoggedIn(false);
            setRole(null);
        }
        setIsAuthLoading(false);
    }, []);

    // Hàm signin: gọi API, set cookie, cập nhật state
    const signin = async (email, password) => {
        try {
            const response = await axiosClient.post('/auth/login', { email, password });
            const result = response.data;
            // Set cookie accessToken
            setCookie('accessToken', result.data.accessToken || '');
            // Set cookie profile_user (base64 encode)
            const userProfile = {
                id: result.data.id,
                fullname: result.data.fullname,
                email: result.data.email,
                role: result.data.role
            };
            const encodedProfile = btoa(JSON.stringify(userProfile));
            setCookie('profile_user', encodedProfile);
            // Set cookie login_status (base64 encode)
            const loginStatus = { isLoggedIn: true, role: result.data.role };
            setCookie('login_status', btoa(JSON.stringify(loginStatus)));
            // Cập nhật state context
            setUser(userProfile);
            setIsLoggedIn(true);
            setRole(result.data.role || null);
            return { success: true, user: userProfile };
        } catch (error) {
            setUser(null);
            setIsLoggedIn(false);
            setRole(null);
            return { success: false, error };
        }
    };

    // Hàm logout: gọi API, xóa cookie, clear state
    const logout = async () => {
        try {
            const userId = getUserId ? getUserId() : user?.id;
            if (userId) {
                await axiosClient.post('/auth/logout', { userId });
            }
        } catch (err) { }
        document.cookie = "profile_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "login_status=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setUser(null);
        setIsLoggedIn(false);
        setRole(null);
    };

    const login = (userData) => {
        setUser(userData);
        setIsLoggedIn(true);
        setRole(userData.role || null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, role, isAuthLoading, login, logout, signin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);