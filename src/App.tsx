
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
  document.documentElement.lang = 'es';
  
  // Establecer la zona horaria para Colombia
  try {
    // Si el navegador soporta Intl.DateTimeFormat con timeZone
    Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota' });
  } catch (e) {
    console.error("Error al configurar la zona horaria:", e);
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<GuestGuard><Login /></GuestGuard>} />
          <Route path="/registro" element={<GuestGuard><Register /></GuestGuard>} />
          <Route path="/recuperar-contrasena" element={<GuestGuard><ResetPassword /></GuestGuard>} />
          
          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={<AuthGuard><Dashboard /></AuthGuard>}
          />
          <Route
            path="/dashboard/inventario"
            element={<AuthGuard><Inventory /></AuthGuard>}
          />
          <Route
            path="/dashboard/clientes"
            element={<AuthGuard><Clients /></AuthGuard>}
          />
          <Route
            path="/dashboard/proveedores"
            element={<AuthGuard><Suppliers /></AuthGuard>}
          />
          <Route
            path="/dashboard/reportes"
            element={<AuthGuard><Reports /></AuthGuard>}
          />
          <Route
            path="/dashboard/configuracion"
            element={<AuthGuard><Settings /></AuthGuard>}
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
