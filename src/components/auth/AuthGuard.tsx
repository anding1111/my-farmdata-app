
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  console.log("🔒 AuthGuard - import.meta.env.DEV:", import.meta.env.DEV);
  console.log("🔒 AuthGuard - NODE_ENV:", import.meta.env.NODE_ENV);
  
  // En desarrollo, siempre permitir acceso
  if (import.meta.env.DEV) {
    console.log("🔒 AuthGuard - Modo desarrollo detectado, permitiendo acceso");
    return <>{children}</>;
  }

  const { isAuthenticated, isLoading } = useAuth();
  
  console.log("🔒 AuthGuard - isLoading:", isLoading);
  console.log("🔒 AuthGuard - isAuthenticated:", isAuthenticated);

  if (isLoading) {
    console.log("🔒 AuthGuard - Mostrando spinner de carga");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("🔒 AuthGuard - No autenticado, redirigiendo a login");
    return <Navigate to="/login" replace />;
  }

  console.log("🔒 AuthGuard - Autenticado, permitiendo acceso");
  return <>{children}</>;
};

export default AuthGuard;
