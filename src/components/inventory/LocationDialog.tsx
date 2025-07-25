import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LocationForm from "./LocationForm";
import { type Location } from "@/types/inventory";

interface LocationDialogProps {
  location?: Location | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LocationDialog = ({ location, isOpen, onClose, onSuccess }: LocationDialogProps) => {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {location ? 'Editar Ubicación' : 'Nueva Ubicación'}
          </DialogTitle>
        </DialogHeader>
        <LocationForm 
          location={location}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;