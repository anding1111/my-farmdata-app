import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Client, ClientFormData } from "@/types/clients";
import { clientsApi } from "@/api/clients";
import ClientForm from "./ClientForm";

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client;
  onClientSaved: () => void;
}

const ClientDialog = ({ open, onOpenChange, client, onClientSaved }: ClientDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: ClientFormData) => {
    setIsLoading(true);
    try {
      if (client) {
        await clientsApi.updateClient(client.id, data);
        toast({
          title: "Cliente actualizado",
          description: "El cliente ha sido actualizado exitosamente.",
        });
      } else {
        await clientsApi.createClient(data);
        toast({
          title: "Cliente creado",
          description: "El cliente ha sido creado exitosamente.",
        });
      }
      
      onClientSaved();
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
            {client ? "Editar Cliente" : "Nuevo Cliente"}
          </DialogTitle>
        </DialogHeader>
        
        <ClientForm
          initialData={client}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ClientDialog;