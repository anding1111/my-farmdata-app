
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Por favor ingresa tu correo electrónico");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Demo recuperación - simular una respuesta exitosa
      setTimeout(() => {
        setIsSubmitted(true);
        toast.success("Instrucciones enviadas a tu correo");
      }, 1500);
    } catch (error) {
      console.error("Error al enviar instrucciones:", error);
      toast.error("Ocurrió un error. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <div className="text-2xl font-semibold">Revisa tu correo</div>
        <p className="text-muted-foreground">
          Hemos enviado instrucciones para restablecer tu contraseña a <strong>{email}</strong>.
        </p>
        <Button asChild className="mt-4">
          <Link to="/login">Volver a inicio de sesión</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary-600" 
        disabled={isLoading}
      >
        {isLoading ? "Enviando instrucciones..." : "Recuperar contraseña"}
      </Button>
      
      <div className="text-center text-sm">
        <Link to="/login" className="text-primary hover:underline">
          Volver a inicio de sesión
        </Link>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
