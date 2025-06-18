// components/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  const hasToken =
    !!localStorage.getItem("token") || !!sessionStorage.getItem("token2");

  if (isLoading && !user && hasToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Agar children bo‘lsa uni qaytaradi, bo‘lmasa <Outlet> (nested route)
  return <>{children ? children : <Outlet />}</>;
};

export default ProtectedRoute;
