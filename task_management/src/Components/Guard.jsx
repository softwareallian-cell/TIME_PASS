import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from '../hooks/AuthContext';


export const AuthGuard = () => {
    const { user } = useAuth();
    return user ? <Outlet /> : <Navigate to="/login" />;
};

export const AdminGuard = () => {
    const { user } = useAuth();
    const isAdmin = user?.role?.toLowerCase() === 'admin';
    return isAdmin ? <Outlet /> : <><Navigate to="/" /></>;

};


export const GuestGuard = () => {
    const { user } = useAuth();
    return !user ? <Outlet /> : <Navigate to={`/dashboard/${user.id}`} />;
};