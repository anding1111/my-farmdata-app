import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlerts, useMarkAlertAsRead } from "@/hooks/useInventory";
import { AlertFilters } from "@/types/inventory";
import AlertDialog from "./AlertDialog";
import AlertFiltersComponent from "./AlertFilters";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  AlertTriangle, 
  Clock, 
  XCircle, 
  Package,
  Search,
  CheckCircle2,
  RefreshCw,
  Eye,
  Bell,
  BellOff
} from "lucide-react";
import { toast } from "sonner";

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

const AlertsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<AlertFilters>({});
  
  const { data: alertsData, isLoading, error, refetch } = useAlerts(filters);
  const markAsReadMutation = useMarkAlertAsRead();

  const alerts = alertsData?.data || [];

  // Filter alerts by search term
  const filteredAlerts = useMemo(() => {
    if (!searchTerm) return alerts;
    
    return alerts.filter(alert => 
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.product?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getTypeLabel(alert.type).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [alerts, searchTerm]);

  const handleMarkAsRead = async (alertId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      await markAsReadMutation.mutateAsync(alertId);
      toast.success("Alerta marcada como leída");
    } catch (error) {
      toast.error("Error al marcar la alerta como leída");
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadAlerts = filteredAlerts.filter(alert => !alert.is_read);
    
    if (unreadAlerts.length === 0) {
      toast.info("No hay alertas sin leer");
      return;
    }

    try {
      // Mark all unread alerts as read
      await Promise.all(
        unreadAlerts.map(alert => markAsReadMutation.mutateAsync(alert.id))
      );
      toast.success(`${unreadAlerts.length} alertas marcadas como leídas`);
    } catch (error) {
      toast.error("Error al marcar las alertas como leídas");
    }
  };

  const unreadCount = filteredAlerts.filter(alert => !alert.is_read).length;
  const criticalCount = filteredAlerts.filter(alert => alert.priority === 'critical').length;
  const highCount = filteredAlerts.filter(alert => alert.priority === 'high').length;

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertas de Inventario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Error al cargar alertas</h3>
            <p className="text-muted-foreground mb-4">
              No se pudieron cargar las alertas del inventario.
            </p>
            <Button onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Alertas de Inventario
            </CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive">
                {unreadCount} sin leer
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleMarkAllAsRead}
                disabled={markAsReadMutation.isPending}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Marcar Todas Leídas
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{filteredAlerts.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <BellOff className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Sin Leer</p>
                <p className="text-2xl font-bold text-destructive">{unreadCount}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <div>
                <p className="text-sm font-medium">Críticas</p>
                <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Alta Prioridad</p>
                <p className="text-2xl font-bold text-orange-500">{highCount}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar alertas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <AlertFiltersComponent 
            filters={filters} 
            onFiltersChange={setFilters} 
          />
        </div>

        {/* Alerts Table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Mensaje</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-24">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : filteredAlerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No hay alertas</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || Object.keys(filters).length > 0
                        ? "No se encontraron alertas con los filtros aplicados."
                        : "No hay alertas de inventario en este momento."
                      }
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlerts.map((alert) => {
                  const Icon = getAlertIcon(alert.type);
                  return (
                    <AlertDialog 
                      key={alert.id} 
                      alert={alert} 
                      onAlertUpdate={() => refetch()}
                    >
                      <TableRow 
                        className={`cursor-pointer hover:bg-muted/50 ${!alert.is_read ? 'bg-muted/30' : ''}`}
                      >
                        <TableCell>
                          <Icon className={`h-4 w-4 ${
                            alert.priority === 'critical' ? 'text-destructive' :
                            alert.priority === 'high' ? 'text-orange-500' :
                            alert.priority === 'medium' ? 'text-yellow-500' :
                            'text-muted-foreground'
                          }`} />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getTypeLabel(alert.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {alert.product?.name || `Producto ${alert.product_id}`}
                            </p>
                            {alert.product?.code && (
                              <p className="text-xs text-muted-foreground">
                                {alert.product.code}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate" title={alert.message}>
                            {alert.message}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getAlertColor(alert.priority)}>
                            {getPriorityLabel(alert.priority)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(alert.created_at), 'dd/MM/yy HH:mm', { locale: es })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={alert.is_read ? "outline" : "default"}>
                            {alert.is_read ? "Leída" : "Sin leer"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {!alert.is_read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => handleMarkAsRead(alert.id, e)}
                                disabled={markAsReadMutation.isPending}
                                className="h-8 w-8 p-0"
                                title="Marcar como leída"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              title="Ver detalles"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </AlertDialog>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsTab;