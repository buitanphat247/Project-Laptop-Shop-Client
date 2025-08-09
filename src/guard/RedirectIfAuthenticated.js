import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RedirectIfAuthenticated = ({ children }) => {
    const { isLoggedIn, isAuthLoading } = useAuth();
    if (isAuthLoading) return null; // hoặc spinner
    return isLoggedIn ? <Navigate to="/" replace /> : children;
};

export default RedirectIfAuthenticated;