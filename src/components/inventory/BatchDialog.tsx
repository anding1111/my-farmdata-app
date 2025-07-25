import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BatchForm from "./BatchForm";
import { type Batch } from "@/api/inventory";
import { 
  useCreateBatch, 
  useUpdateBatch 
} from "@/hooks/useInventory";

interface BatchDialogProps {
  open: boolean;
  onClose: () => void;
  batch?: Batch;
}

const BatchDialog = ({ open, onClose, batch }: BatchDialogProps) => {
  const createBatch = useCreateBatch();
  const updateBatch = useUpdateBatch();

  const handleSubmit = async (data: any) => {
    try {
      if (batch) {
        await updateBatch.mutateAsync({ id: batch.id, data });
      } else {
        await createBatch.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      // Error handled by the hook
    }
  };

  const isLoading = createBatch.isPending || updateBatch.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {batch ? "Editar Lote" : "Nuevo Lote"}
          </DialogTitle>
          <DialogDescription>
            {batch 
              ? "Modifique los datos del lote"
              : "Complete los datos para crear un nuevo lote"
            }
          </DialogDescription>
        </DialogHeader>
        
        <BatchForm
          batch={batch}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BatchDialog;