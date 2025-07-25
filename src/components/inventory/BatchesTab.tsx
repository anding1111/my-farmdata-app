import { useState } from "react";
import { Plus, MoreHorizontal, Edit, Trash2, Package, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import BatchDialog from "./BatchDialog";
import { 
  useAllBatches, 
  useDeleteBatch,
  useProducts 
} from "@/hooks/useInventory";
import { type Batch } from "@/api/inventory";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";

const BatchesTab = () => {
  const [batchDialog, setBatchDialog] = useState<{
    open: boolean;
    batch?: Batch;
  }>({ open: false });
  
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    batch?: Batch;
  }>({ open: false });

  const { data: batchesResponse, isLoading } = useAllBatches();
  const { data: productsResponse } = useProducts();
  const deleteBatch = useDeleteBatch();
  
  const batches = batchesResponse?.data || [];
  const products = productsResponse?.data || [];

  const handleEdit = (batch: Batch) => {
    setBatchDialog({ open: true, batch });
  };

  const handleDelete = (batch: Batch) => {
    setDeleteDialog({ open: true, batch });
  };

  const confirmDelete = async () => {
    if (deleteDialog.batch) {
      try {
        await deleteBatch.mutateAsync(deleteDialog.batch.id);
        setDeleteDialog({ open: false });
      } catch (error) {
        // Error handled by the hook
      }
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'expired': return 'destructive';
      case 'recalled': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'expired': return 'Vencido';
      case 'recalled': return 'Retirado';
      default: return status;
    }
  };

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = differenceInDays(expiry, today);
    
    if (daysUntilExpiry < 0) {
      return { variant: 'destructive' as const, text: 'Vencido', icon: AlertTriangle };
    } else if (daysUntilExpiry <= 30) {
      return { variant: 'destructive' as const, text: `Vence en ${daysUntilExpiry} días`, icon: AlertTriangle };
    } else if (daysUntilExpiry <= 90) {
      return { variant: 'secondary' as const, text: `Vence en ${daysUntilExpiry} días`, icon: null };
    }
    return { variant: 'default' as const, text: `Vence en ${daysUntilExpiry} días`, icon: null };
  };

  const findProduct = (productId: number) => {
    return products.find(p => p.id === productId);
  };

  const getStockStatus = (batch: Batch) => {
    const percentage = (batch.remaining_quantity / batch.quantity) * 100;
    if (percentage === 0) return { variant: 'secondary' as const, text: 'Agotado' };
    if (percentage <= 20) return { variant: 'destructive' as const, text: 'Stock Bajo' };
    if (percentage <= 50) return { variant: 'secondary' as const, text: 'Stock Medio' };
    return { variant: 'default' as const, text: 'Stock Alto' };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lotes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Cargando lotes...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Lotes
              <Badge variant="secondary" className="ml-2">
                {batches.length}
              </Badge>
            </CardTitle>
            <Button
              onClick={() => setBatchDialog({ open: true })}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Lote
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {batches.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-semibold">No hay lotes registrados</p>
              <p className="text-muted-foreground mb-4">
                Comience registrando su primer lote de productos
              </p>
              <Button onClick={() => setBatchDialog({ open: true })}>
                <Plus className="h-4 w-4 mr-2" />
                Registrar Primer Lote
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Número de Lote</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Estado Stock</TableHead>
                    <TableHead>Fabricación</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batches.map((batch) => {
                    const product = findProduct(batch.product_id);
                    const expiryStatus = getExpiryStatus(batch.expiry_date);
                    const stockStatus = getStockStatus(batch);
                    const ExpiryIcon = expiryStatus.icon;
                    
                    return (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">
                          {product?.name || `Producto ID: ${batch.product_id}`}
                        </TableCell>
                        <TableCell className="font-mono">
                          {batch.batch_number}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {batch.remaining_quantity} / {batch.quantity}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {Math.round((batch.remaining_quantity / batch.quantity) * 100)}% disponible
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={stockStatus.variant}>
                            {stockStatus.text}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(batch.manufacture_date), "dd/MM/yyyy", { locale: es })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {ExpiryIcon && <ExpiryIcon className="h-4 w-4" />}
                            <div className="flex flex-col">
                              <span className="text-sm">
                                {format(new Date(batch.expiry_date), "dd/MM/yyyy", { locale: es })}
                              </span>
                              <Badge variant={expiryStatus.variant} className="text-xs">
                                {expiryStatus.text}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(batch.status)}>
                            {getStatusText(batch.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-background border">
                              <DropdownMenuItem onClick={() => handleEdit(batch)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(batch)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <BatchDialog
        open={batchDialog.open}
        onClose={() => setBatchDialog({ open: false })}
        batch={batchDialog.batch}
      />

      <AlertDialog open={deleteDialog.open} onOpenChange={() => setDeleteDialog({ open: false })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar lote?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el lote "
              {deleteDialog.batch?.batch_number}".
              {deleteDialog.batch?.remaining_quantity && deleteDialog.batch.remaining_quantity > 0 && (
                <span className="block mt-2 text-destructive font-medium">
                  Advertencia: Este lote aún tiene stock disponible ({deleteDialog.batch.remaining_quantity} unidades).
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BatchesTab;