import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Role, RoleFormData } from "@/types/settings";
import { settingsApi } from "@/api/settings";
import RoleForm from "./RoleForm";

interface RoleDialogProps {
  open: boolean;
  onClose: () => void;
  role?: Role | null;
  onSuccess: () => void;
}

const RoleDialog = ({ open, onClose, role, onSuccess }: RoleDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: RoleFormData) => {
    try {
      setIsLoading(true);
      
      if (role) {
        await settingsApi.updateRole(role.id, data);
        toast({
          title: "Rol actualizado",
          description: "El rol se ha actualizado exitosamente",
        });
      } else {
        await settingsApi.createRole(data);
        toast({
          title: "Rol creado",
          description: "El rol se ha creado exitosamente",
        });
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: role ? "Error al actualizar el rol" : "Error al crear el rol",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{role ? "Editar Rol" : "Nuevo Rol"}</DialogTitle>
          <DialogDescription>
            {role ? "Modifica los datos del rol" : "Crea un nuevo rol en el sistema"}
          </DialogDescription>
        </DialogHeader>
        
        <RoleForm 
          role={role} 
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RoleDialog;