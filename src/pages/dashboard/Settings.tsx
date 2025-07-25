
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Building, Users, Shield, Save, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/layouts/DashboardLayout";
import { PharmacySettings, User, Role, WEEKDAYS, DEFAULT_PERMISSIONS } from "@/types/settings";
import { settingsApi } from "@/api/settings";
import UserDialog from "@/components/settings/UserDialog";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("pharmacy");
  const [pharmacySettings, setPharmacySettings] = useState<PharmacySettings | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userDialog, setUserDialog] = useState<{ open: boolean; user?: User | null }>({ open: false });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user?: User | null }>({ open: false });
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [settingsData, usersData, rolesData] = await Promise.all([
        settingsApi.getPharmacySettings(),
        settingsApi.getUsers(),
        settingsApi.getRoles()
      ]);
      setPharmacySettings(settingsData);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cargar la configuración",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSavePharmacySettings = async () => {
    if (!pharmacySettings) return;
    
    try {
      await settingsApi.updatePharmacySettings(pharmacySettings);
      toast({
        title: "Configuración guardada",
        description: "Los ajustes de la farmacia se han guardado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar la configuración",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (user: User) => {
    try {
      await settingsApi.deleteUser(user.id);
      toast({
        title: "Usuario eliminado",
        description: "El usuario se ha eliminado exitosamente",
      });
      loadData();
      setDeleteDialog({ open: false });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar el usuario",
        variant: "destructive",
      });
    }
  };

  const renderPharmacySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>Datos básicos de la farmacia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={pharmacySettings?.name || ''}
                onChange={(e) => setPharmacySettings(prev => prev ? {...prev, name: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nit">NIT</Label>
              <Input
                id="nit"
                value={pharmacySettings?.nit || ''}
                onChange={(e) => setPharmacySettings(prev => prev ? {...prev, nit: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={pharmacySettings?.phone || ''}
                onChange={(e) => setPharmacySettings(prev => prev ? {...prev, phone: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={pharmacySettings?.email || ''}
                onChange={(e) => setPharmacySettings(prev => prev ? {...prev, email: e.target.value} : null)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Horarios de Atención</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {WEEKDAYS.map((day) => (
              <div key={day.key} className="flex items-center gap-4">
                <div className="w-20 text-sm font-medium">{day.label}</div>
                <Switch
                  checked={!pharmacySettings?.opening_hours[day.key as keyof typeof pharmacySettings.opening_hours]?.is_closed}
                  onCheckedChange={(checked) => {
                    setPharmacySettings(prev => prev ? {
                      ...prev,
                      opening_hours: {
                        ...prev.opening_hours,
                        [day.key]: { ...prev.opening_hours[day.key as keyof typeof prev.opening_hours], is_closed: !checked }
                      }
                    } : null);
                  }}
                />
                {!pharmacySettings?.opening_hours[day.key as keyof typeof pharmacySettings.opening_hours]?.is_closed && (
                  <>
                    <Input
                      type="time"
                      className="w-32"
                      value={pharmacySettings?.opening_hours[day.key as keyof typeof pharmacySettings.opening_hours]?.open || ''}
                      onChange={(e) => {
                        setPharmacySettings(prev => prev ? {
                          ...prev,
                          opening_hours: {
                            ...prev.opening_hours,
                            [day.key]: { ...prev.opening_hours[day.key as keyof typeof prev.opening_hours], open: e.target.value }
                          }
                        } : null);
                      }}
                    />
                    <span>-</span>
                    <Input
                      type="time"
                      className="w-32"
                      value={pharmacySettings?.opening_hours[day.key as keyof typeof pharmacySettings.opening_hours]?.close || ''}
                      onChange={(e) => {
                        setPharmacySettings(prev => prev ? {
                          ...prev,
                          opening_hours: {
                            ...prev.opening_hours,
                            [day.key]: { ...prev.opening_hours[day.key as keyof typeof prev.opening_hours], close: e.target.value }
                          }
                        } : null);
                      }}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSavePharmacySettings}>
          <Save className="h-4 w-4 mr-2" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Usuarios del Sistema</CardTitle>
            <CardDescription>Gestiona los usuarios y sus accesos</CardDescription>
          </div>
          <Button onClick={() => setUserDialog({ open: true, user: null })}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último acceso</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role_name}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? "default" : "secondary"}>
                      {user.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.last_login ? new Date(user.last_login).toLocaleDateString('es-CO') : 'Nunca'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setUserDialog({ open: true, user })}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setDeleteDialog({ open: true, user })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderRoles = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Roles y Permisos</CardTitle>
            <CardDescription>Define los roles y sus permisos en el sistema</CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Rol
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rol</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Permisos</TableHead>
                <TableHead>Usuarios</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{role.permissions.length} permisos</Badge>
                  </TableCell>
                  <TableCell>{role.users_count}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!role.is_system && (
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between h-16 p-4 border-b bg-white">
        <h1 className="text-2xl font-semibold">Configuración</h1>
      </div>
      
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pharmacy" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Farmacia
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Roles
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pharmacy" className="mt-6">
            {renderPharmacySettings()}
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            {renderUsers()}
          </TabsContent>
          
          <TabsContent value="roles" className="mt-6">
            {renderRoles()}
          </TabsContent>
        </Tabs>
      </div>

      <UserDialog
        open={userDialog.open}
        onClose={() => setUserDialog({ open: false })}
        user={userDialog.user}
        onSuccess={loadData}
      />

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El usuario "{deleteDialog.user?.name}" será eliminado permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog.user && handleDeleteUser(deleteDialog.user)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Settings;
