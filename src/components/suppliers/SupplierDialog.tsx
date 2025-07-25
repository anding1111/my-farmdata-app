import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Supplier, SupplierFormData } from "@/types/suppliers";
import { suppliersApi } from "@/api/suppliers";
import SupplierForm from "./SupplierForm";

interface SupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier?: Supplier;
  onSupplierSaved: () => void;
}

const SupplierDialog = ({ open, onOpenChange, supplier, onSupplierSaved }: SupplierDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: SupplierFormData) => {
    setIsLoading(true);
    try {
      if (supplier) {
        await suppliersApi.updateSupplier(supplier.id, data);
        toast({
          title: "Proveedor actualizado",
          description: "El proveedor ha sido actualizado exitosamente.",
        });
      } else {
        await suppliersApi.createSupplier(data);
        toast({
          title: "Proveedor creado",
          description: "El proveedor ha sido creado exitosamente.",
        });
      }
      
      onSupplierSaved();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ha ocurrido un error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {supplier ? "Editar Proveedor" : "Nuevo Proveedor"}
          </DialogTitle>
        </DialogHeader>
        
        <SupplierForm
          initialData={supplier}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SupplierDialog;