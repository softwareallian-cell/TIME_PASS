import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
export default function AuthProvider({ children }) {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('currentUSER')))

    const login = (userData) => {
        const userWithRole = { ...userData, role: userData.role || 'user' };
        localStorage.setItem('currentUSER', JSON.stringify(userWithRole))
        setUser(userWithRole);
    }

    const logout = () => {
        localStorage.removeItem('currentUSER');
        setUser(null);
    };

    const useDebounce = (value, delay) => {
        const [debouncedvalue, setDebouncedValue] = useState(value);
        useEffect(() => {
            const t = setTimeout(() => setDebouncedValue(value), delay);
            console.log("useEffected called", "t=", t);
            return () => { console.log("TIMEOUT CLEARED"); clearTimeout(t); }
        }, [value, delay]);

        return debouncedvalue;
    }

    return (
        <AuthContext.Provider value={{ useDebounce, user, login, logout, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);