
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface GuestGuardProps {
  children: React.ReactNode;
}

const GuestGuard = ({ children }: GuestGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Modo desarrollo - redireccionar automáticamente al dashboard
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default GuestGuard;
