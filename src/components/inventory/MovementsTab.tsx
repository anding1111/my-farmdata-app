import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  ArrowRightLeft,
  Settings2,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

import { useMovements, useDeleteMovement } from '@/hooks/useInventory';
import MovementDialog from './MovementDialog';
import { Movement } from '@/types/inventory';

const MovementsTab = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMovement, setEditingMovement] = useState<Movement | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { toast } = useToast();
  const { data: movements = [], isLoading } = useMovements();
  const deleteMovementMutation = useDeleteMovement();

  const filteredMovements = movements.filter((movement: Movement) => {
    const matchesSearch = 
      search === '' ||
      movement.id.toString().includes(search) ||
      movement.product_name?.toLowerCase().includes(search.toLowerCase()) ||
      movement.reason.toLowerCase().includes(search.toLowerCase()) ||
      movement.reference_document?.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === 'all' || movement.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleEdit = (movement: Movement) => {
    // Solo permitir editar movimientos manuales
    if (movement.notes?.includes('automático') || movement.notes?.includes('Venta automática') || movement.notes?.includes('Recepción automática')) {
      toast({
        title: "Acción no permitida",
        description: "No se pueden editar movimientos generados automáticamente",
        variant: "destructive",
      });
      return;
    }
    setEditingMovement(movement);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number, movement: Movement) => {
    // Solo permitir eliminar movimientos manuales
    if (movement.notes?.includes('automático') || movement.notes?.includes('Venta automática') || movement.notes?.includes('Recepción automática')) {
      toast({
        title: "Acción no permitida",
        description: "No se pueden eliminar movimientos generados automáticamente",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await deleteMovementMutation.mutateAsync(id);
      toast({
        title: "Movimiento eliminado",
        description: "El movimiento ha sido eliminado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el movimiento.",
        variant: "destructive",
      });
    }
  };

  const getMovementTypeIcon = (type: string) => {
    switch (type) {
      case 'entry':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'exit':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'transfer':
        return <ArrowRightLeft className="h-4 w-4 text-blue-600" />;
      case 'adjustment':
        return <Settings2 className="h-4 w-4 text-yellow-600" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getMovementTypeLabel = (type: string) => {
    switch (type) {
      case 'entry':
        return 'Entrada';
      case 'exit':
        return 'Salida';
      case 'transfer':
        return 'Transferencia';
      case 'adjustment':
        return 'Ajuste';
      default:
        return type;
    }
  };

  const getMovementTypeBadge = (type: string) => {
    switch (type) {
      case 'entry':
        return <Badge variant="default" className="bg-green-100 text-green-800">Entrada</Badge>;
      case 'exit':
        return <Badge variant="destructive">Salida</Badge>;
      case 'transfer':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Transferencia</Badge>;
      case 'adjustment':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Ajuste</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Movimientos de Inventario</h2>
          <p className="text-muted-foreground">
            Gestiona todos los movimientos de entrada, salida y transferencias de productos
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Movimiento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Movimiento</DialogTitle>
            </DialogHeader>
            <MovementDialog
              onClose={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, producto, motivo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="entry">Entradas</SelectItem>
                <SelectItem value="exit">Salidas</SelectItem>
                <SelectItem value="transfer">Transferencias</SelectItem>
                <SelectItem value="adjustment">Ajustes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Movements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Movimientos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No se encontraron movimientos
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMovements.map((movement: Movement) => (
                      <TableRow key={movement.id}>
                        <TableCell className="font-mono">#{movement.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              {getMovementTypeIcon(movement.type)}
                              {getMovementTypeBadge(movement.type)}
                            </div>
                            {(movement.notes?.includes('automático') || movement.notes?.includes('Venta automática') || movement.notes?.includes('Recepción automática')) && (
                              <Badge variant="outline" className="text-xs">
                                Automático
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{movement.product_name || 'Producto no encontrado'}</p>
                            <p className="text-sm text-muted-foreground">{movement.product_code}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            movement.type === 'entry' ? 'text-green-600' : 
                            movement.type === 'exit' ? 'text-red-600' : 
                            'text-blue-600'
                          }`}>
                            {movement.type === 'entry' ? '+' : movement.type === 'exit' ? '-' : '±'}{movement.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{movement.reason}</TableCell>
                        <TableCell>
                          {format(new Date(movement.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(movement)}
                              disabled={movement.notes?.includes('automático') || movement.notes?.includes('Venta automática') || movement.notes?.includes('Recepción automática')}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  disabled={movement.notes?.includes('automático') || movement.notes?.includes('Venta automática') || movement.notes?.includes('Recepción automática')}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar movimiento?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente el movimiento #{movement.id}.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(movement.id, movement)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Movimiento</DialogTitle>
          </DialogHeader>
          {editingMovement && (
            <MovementDialog
              movement={editingMovement}
              onClose={() => {
                setIsEditDialogOpen(false);
                setEditingMovement(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MovementsTab;