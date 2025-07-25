import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InventoryAlert } from "@/types/inventory";
import { useMarkAlertAsRead } from "@/hooks/useInventory";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  AlertTriangle, 
  Clock, 
  XCircle, 
  Package,
  Calendar,
  Tag,
  CheckCircle2,
  Eye
} from "lucide-react";
import { toast } from "sonner";

interface AlertDialogProps {
  alert: InventoryAlert;
  children: React.ReactNode;
  onAlertUpdate?: () => void;
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'low_stock':
      return Package;
    case 'expiry_warning':
      return Clock;
    case 'expired':
      return XCircle;
    case 'out_of_stock':
      return AlertTriangle;
    default:
      return AlertTriangle;
  }
};

const getAlertColor = (priority: string) => {
  switch (priority) {
    case 'critical':
      return 'destructive';
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'secondary';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'low_stock':
      return 'Stock Bajo';
    case 'expiry_warning':
      return 'Próximo a Vencer';
    case 'expired':
      return 'Vencido';
    case 'out_of_stock':
      return 'Sin Stock';
    default:
      return type;
  }
};

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case 'critical':
      return 'Crítica';
    case 'high':
      return 'Alta';
    case 'medium':
      return 'Media';
    case 'low':
      return 'Baja';
    default:
      return priority;
  }
};

const AlertDialog = ({ alert, children, onAlertUpdate }: AlertDialogProps) => {
  const [open, setOpen] = useState(false);
  const markAsReadMutation = useMarkAlertAsRead();

  const handleMarkAsRead = async () => {
    if (alert.is_read) return;

    try {
      await markAsReadMutation.mutateAsync(alert.id);
      toast.success("Alerta marcada como leída");
      onAlertUpdate?.();
      setOpen(false);
    } catch (error) {
      toast.error("Error al marcar la alerta como leída");
    }
  };

  const Icon = getAlertIcon(alert.type);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            Detalle de Alerta
          </DialogTitle>
          <DialogDescription>
            Información detallada de la alerta
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Alert Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estado:</span>
            <Badge variant={alert.is_read ? "outline" : "default"}>
              {alert.is_read ? "Leída" : "No leída"}
            </Badge>
          </div>

          {/* Alert Type */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tipo:</span>
            <Badge variant="secondary">
              {getTypeLabel(alert.type)}
            </Badge>
          </div>

          {/* Priority */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Prioridad:</span>
            <Badge variant={getAlertColor(alert.priority)}>
              {getPriorityLabel(alert.priority)}
            </Badge>
          </div>

          {/* Product */}
          <div className="space-y-1">
            <span className="text-sm font-medium">Producto:</span>
            <div className="text-sm text-muted-foreground">
              {alert.product?.name || `Producto ID: ${alert.product_id}`}
              {alert.product?.code && (
                <span className="block text-xs">Código: {alert.product.code}</span>
              )}
            </div>
          </div>

          {/* Batch if available */}
          {alert.batch && (
            <div className="space-y-1">
              <span className="text-sm font-medium">Lote:</span>
              <div className="text-sm text-muted-foreground">
                {alert.batch.batch_number}
                <span className="block text-xs">
                  Vence: {format(new Date(alert.batch.expiry_date), 'dd/MM/yyyy', { locale: es })}
                </span>
              </div>
            </div>
          )}

          {/* Message */}
          <div className="space-y-1">
            <span className="text-sm font-medium">Mensaje:</span>
            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
              {alert.message}
            </p>
          </div>

          {/* Created date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Creada: {format(new Date(alert.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {!alert.is_read && (
              <Button 
                onClick={handleMarkAsRead}
                disabled={markAsReadMutation.isPending}
                size="sm"
                className="flex-1"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Marcar como Leída
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setOpen(false)}
              className={!alert.is_read ? "flex-1" : "w-full"}
            >
              <Eye className="h-4 w-4 mr-2" />
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDialog;