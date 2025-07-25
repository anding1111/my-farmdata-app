import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Role, RoleFormData, Permission, DEFAULT_PERMISSIONS } from "@/types/settings";
import { Loader2, User, Shield } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Información Básica
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Permisos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4 mt-4">
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
                rows={4}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="mt-4">
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground mb-3">
              Selecciona los permisos que tendrá este rol
            </div>
            {Object.entries(groupedPermissions).map(([group, groupPermissions]) => (
              <div key={group} className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide border-b pb-1">
                  {group}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                  {groupPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={formData.permission_ids.includes(permission.id)}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.id, checked as boolean)
                        }
                        disabled={isLoading}
                        className="shrink-0"
                      />
                      <Label 
                        htmlFor={`permission-${permission.id}`}
                        className="text-xs font-normal cursor-pointer leading-tight"
                      >
                        {permission.description}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4 border-t">
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