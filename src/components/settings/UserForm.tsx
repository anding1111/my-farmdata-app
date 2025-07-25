import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { User, Role, UserFormData } from "@/types/settings";
import { settingsApi } from "@/api/settings";

interface UserFormProps {
  user?: User | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    role_id: 0,
    is_active: true,
    password: "",
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await settingsApi.getRoles();
        setRoles(rolesData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Error al cargar los roles",
          variant: "destructive",
        });
      }
    };

    loadRoles();

    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role_id: user.role_id,
        is_active: user.is_active,
        password: "",
      });
    }
  }, [user, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role_id) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    if (!user && !formData.password) {
      toast({
        title: "Error",
        description: "La contraseña es obligatoria para nuevos usuarios",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      if (user) {
        await settingsApi.updateUser(user.id, formData);
        toast({
          title: "Usuario actualizado",
          description: "El usuario se ha actualizado exitosamente",
        });
      } else {
        await settingsApi.createUser(formData);
        toast({
          title: "Usuario creado",
          description: "El usuario se ha creado exitosamente",
        });
      }
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: user ? "Error al actualizar el usuario" : "Error al crear el usuario",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Ingresa el nombre completo"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="ejemplo@farmadata.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="+57 300 123 4567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Rol *</Label>
          <Select
            value={formData.role_id ? formData.role_id.toString() : ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, role_id: parseInt(value) }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            {user ? "Nueva contraseña (opcional)" : "Contraseña *"}
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder={user ? "Dejar vacío para mantener actual" : "Mínimo 8 caracteres"}
            required={!user}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, is_active: checked }))
            }
          />
          <Label htmlFor="is_active">Usuario activo</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : user ? "Actualizar" : "Crear Usuario"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;