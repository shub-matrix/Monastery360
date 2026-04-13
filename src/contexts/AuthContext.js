import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export { AuthContext };

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is already logged in on component mount
    useEffect(() => {
        const savedAuth = localStorage.getItem('isAuthenticated');
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        console.log("AuthContext - Checking saved auth:", { savedAuth, savedUser, token });
        
        if (savedAuth === 'true' && savedUser) {
            const userData = JSON.parse(savedUser);
            console.log("AuthContext - Restoring user:", userData);
            setIsAuthenticated(true);
            setUser(userData);
        }
        setIsLoading(false);
    }, []);

    const login = (userData) => {
        console.log("AuthContext - Login called with:", userData);
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
        console.log("AuthContext - User saved to localStorage:", userData);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const value = {
        isAuthenticated,
        user,
        login,
        logout,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};