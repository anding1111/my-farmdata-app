import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MovementForm from './MovementForm';
import { Movement } from '@/types/inventory';

interface MovementDialogProps {
  movement?: Movement;
  onClose: () => void;
}

const MovementDialog = ({ movement, onClose }: MovementDialogProps) => {
  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {movement ? 'Editar Movimiento' : 'Nuevo Movimiento'}
        </DialogTitle>
      </DialogHeader>
      <MovementForm
        movement={movement}
        onSuccess={onClose}
        onCancel={onClose}
      />
    </DialogContent>
  );
};

export default MovementDialog;