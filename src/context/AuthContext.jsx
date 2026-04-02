import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../utils/api';
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = Cookies.get('authToken');
        const savedRole = Cookies.get('authRole');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedRole) {
            setToken(savedToken);
            setRole(savedRole);
            setUser(savedUser ? JSON.parse(savedUser) : null);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (email, password, loginRole) => {
        try {
            const response = await authApi.login(email, password, loginRole);

            if (!response.success) {
                return {
                    success: false,
                    message: response.error || 'Đăng nhập thất bại',
                    errors: response.data || null,
                    status: response.status || 422,
                };
            }

            const { user: userData, token: authToken } = response.data;

            Cookies.set('authToken', authToken, { expires: 7, path: '/' });
            Cookies.set('authRole', loginRole, { expires: 7, path: '/' });
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(authToken);
            setRole(loginRole);
            setUser(userData);
            setIsAuthenticated(true);

            return { success: true, user: userData };
        } catch (error) {
            const errorResponse = error.response?.data || error;
            return {
                success: false,
                message: errorResponse.message || 'Đăng nhập thất bại',
                errors: errorResponse.errors || null,
                status: errorResponse.status || 422,
            };
        }
    };

    const register = async (name, email, password, password_confirmation, loginRole) => {
        try {
            const response = await authApi.register(name, email, password, password_confirmation, loginRole);

            if (!response.success) {
                return {
                    success: false,
                    message: response.error || 'Đăng ký thất bại',
                    errors: response.data || null,
                    status: response.status || 422,
                };
            }

            const { user: userData, token: authToken } = response.data;

            Cookies.set('authToken', authToken, { expires: 7, path: '/' });
            Cookies.set('authRole', loginRole, { expires: 7, path: '/' });
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(authToken);
            setRole(loginRole);
            setUser(userData);
            setIsAuthenticated(true);

            return { success: true, user: userData };
        } catch (error) {
            const errorResponse = error.response?.data || error;
            return {
                success: false,
                message: errorResponse.message || 'Đăng ký thất bại',
                errors: errorResponse.errors || null,
                status: errorResponse.status || 422,
            };
        }
    };

    const logout = async () => {
        try {
            if (role) {
                await authApi.logout(role);
            }
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            Cookies.remove('authToken');
            Cookies.remove('authRole');
            localStorage.removeItem('user');

            setToken(null);
            setRole(null);
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const value = {
        user,
        token,
        role,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
