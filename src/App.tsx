
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { initializeLocale } from "./config/locale";
import { AuthProvider } from "@/context/AuthContext";

// Authentication Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";

// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";
import Inventory from "./pages/dashboard/Inventory";

import Clients from "./pages/dashboard/Clients";
import Suppliers from "./pages/dashboard/Suppliers";
import Reports from "./pages/dashboard/Reports";
import Settings from "./pages/dashboard/Settings";

// Auth Guards
import AuthGuard from "./components/auth/AuthGuard";
import GuestGuard from "./components/auth/GuestGuard";

// Not Found Page
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Configurar la localización para Colombia/América Bogotá
if (typeof window !== 'undefined') {
  initializeLocale();
}

// Función para detectar modo desarrollo en Lovable
const isDevelopmentMode = () => {
  return (
    window.location.hostname.includes('lovable.app') ||
    window.location.hostname === 'localhost' ||
    import.meta.env.DEV ||
    process.env.NODE_ENV === 'development'
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={
            (() => {
              console.log("🚀 App - Redirigiendo de / a /dashboard");
              return <Navigate to="/dashboard" replace />;
            })()
          } />
          <Route path="/login" element={<GuestGuard><Login /></GuestGuard>} />
          <Route path="/registro" element={<GuestGuard><Register /></GuestGuard>} />
          <Route path="/recuperar-contrasena" element={<GuestGuard><ResetPassword /></GuestGuard>} />
          
          {/* Rutas protegidas - En desarrollo, sin AuthGuard */}
          <Route
            path="/dashboard"
            element={isDevelopmentMode() ? <Dashboard /> : <AuthGuard><Dashboard /></AuthGuard>}
          />
          <Route
            path="/dashboard/inventario"
            element={isDevelopmentMode() ? <Inventory /> : <AuthGuard><Inventory /></AuthGuard>}
          />
          <Route
            path="/dashboard/clientes"
            element={isDevelopmentMode() ? <Clients /> : <AuthGuard><Clients /></AuthGuard>}
          />
          <Route
            path="/dashboard/proveedores"
            element={isDevelopmentMode() ? <Suppliers /> : <AuthGuard><Suppliers /></AuthGuard>}
          />
          <Route
            path="/dashboard/reportes"
            element={isDevelopmentMode() ? <Reports /> : <AuthGuard><Reports /></AuthGuard>}
          />
          <Route
            path="/dashboard/configuracion"
            element={isDevelopmentMode() ? <Settings /> : <AuthGuard><Settings /></AuthGuard>}
          />
          
          {/* Ruta 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
