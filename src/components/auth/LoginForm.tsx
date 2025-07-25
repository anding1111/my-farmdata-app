
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success("¡Inicio de sesión exitoso!");
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      toast.error(error.message || "Error al iniciar sesión. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Contraseña</Label>
          <Link 
            to="/recuperar-contrasena" 
            className="text-sm text-primary hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary-600" 
        disabled={isLoading}
      >
        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
      
      <div className="text-center text-sm">
        ¿No tienes una cuenta?{" "}
        <Link to="/registro" className="text-primary hover:underline">
          Regístrate
        </Link>
      </div>

      <div className="mt-6 rounded-md bg-blue-50 p-3 border border-blue-100">
        <div className="text-center text-xs font-medium text-blue-700 mb-2">
          Perfiles de prueba
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <UserRound className="h-3 w-3 text-primary" />
            <span className="font-medium">Administrador:</span>
            <span>admin@farmacia.com / admin123</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <UserRound className="h-3 w-3 text-primary" />
            <span className="font-medium">Vendedor:</span>
            <span>vendedor@farmacia.com / venta123</span>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
