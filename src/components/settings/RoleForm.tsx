import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Role, RoleFormData, Permission, DEFAULT_PERMISSIONS } from "@/types/settings";
import { Loader2 } from "lucide-react";

interface RoleFormProps {
  role?: Role | null;
  onSubmit: (data: RoleFormData) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

const RoleForm = ({ role, onSubmit, isLoading = false, onCancel }: RoleFormProps) => {
  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    description: "",
    permission_ids: []
  });

  const [permissions, setPermissions] = useState<Permission[]>(DEFAULT_PERMISSIONS);

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
        permission_ids: role.permissions.map(p => p.id)
      });
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permission_ids: checked 
        ? [...prev.permission_ids, permissionId]
        : prev.permission_ids.filter(id => id !== permissionId)
    }));
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    const group = permission.name.split('.')[0]; // Use first part of permission name as group
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Rol *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ej: Vendedor"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe las responsabilidades del rol"
            disabled={isLoading}
            rows={3}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permisos</CardTitle>
          <CardDescription>Selecciona los permisos que tendrá este rol</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([group, groupPermissions]) => (
              <div key={group} className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  {group}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {groupPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={formData.permission_ids.includes(permission.id)}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.id, checked as boolean)
                        }
                        disabled={isLoading}
                      />
                      <Label 
                        htmlFor={`permission-${permission.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {permission.description}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !formData.name.trim()}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {role ? "Actualizar" : "Crear"} Rol
        </Button>
      </div>
    </form>
  );
};

export default RoleForm;