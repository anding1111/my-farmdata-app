import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Edit, Trash2, MoreHorizontal, Building, Phone, Mail, Star, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Supplier } from "@/types/suppliers";
import { suppliersApi } from "@/api/suppliers";

interface SuppliersTableProps {
  suppliers: Supplier[];
  onSupplierSelect: (supplier: Supplier) => void;
  onSupplierEdit: (supplier: Supplier) => void;
  onSupplierDeleted: () => void;
  isLoading?: boolean;
}

const SuppliersTable = ({ suppliers, onSupplierSelect, onSupplierEdit, onSupplierDeleted, isLoading }: SuppliersTableProps) => {
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const { toast } = useToast();

  const handleDeleteSupplier = async (supplier: Supplier) => {
    try {
      await suppliersApi.deleteSupplier(supplier.id);
      toast({
        title: "Proveedor eliminado",
        description: `El proveedor ${supplier.name} ha sido eliminado exitosamente.`,
      });
      onSupplierDeleted();
      setDeletingSupplier(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ha ocurrido un error al eliminar el proveedor",
        variant: "destructive",
      });
    }
  };

  const getTaxTypeLabel = (type: string) => {
    const types = {
      'RUT': 'RUT',
      'NIT': 'NIT',
      'CC': 'C.C.',
      'CE': 'C.E.'
    };
    return types[type as keyof typeof types] || type;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge variant="default">Activo</Badge>;
    } else if (status === 'suspended') {
      return <Badge variant="destructive">Suspendido</Badge>;
    }
    return <Badge variant="secondary">Inactivo</Badge>;
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return <span className="text-muted-foreground">Sin calificación</span>;
    
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">({rating})</span>
      </div>
    );
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (suppliers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay proveedores</h3>
            <p className="text-muted-foreground">
              No se encontraron proveedores que coincidan con los filtros aplicados.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
          <CardDescription>
            {suppliers.length} proveedor{suppliers.length !== 1 ? 'es' : ''} encontrado{suppliers.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Identificación</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Calificación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.code}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{supplier.name}</div>
                        {supplier.company_name && supplier.company_name !== supplier.name && (
                          <div className="text-sm text-muted-foreground">
                            {supplier.company_name}
                          </div>
                        )}
                        {supplier.contact_person && (
                          <div className="text-sm text-muted-foreground">
                            Contacto: {supplier.contact_person}
                          </div>
                        )}
                        {(supplier.city || supplier.department) && (
                          <div className="text-sm text-muted-foreground">
                            {supplier.city}{supplier.department && `, ${supplier.department}`}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {supplier.tax_id ? (
                        <div>
                          <div className="font-medium">
                            {getTaxTypeLabel(supplier.tax_type)} {supplier.tax_id}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No registrado</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {supplier.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {supplier.phone}
                          </div>
                        )}
                        {supplier.mobile && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {supplier.mobile}
                          </div>
                        )}
                        {supplier.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {supplier.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {supplier.supplier_category ? (
                        <Badge variant="outline">{supplier.supplier_category}</Badge>
                      ) : (
                        <span className="text-muted-foreground">Sin categoría</span>
                      )}
                    </TableCell>
                    <TableCell>{getRatingStars(supplier.rating)}</TableCell>
                    <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setSelectedSupplier(supplier)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onSupplierEdit(supplier)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setDeletingSupplier(supplier)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={!!deletingSupplier} onOpenChange={() => setDeletingSupplier(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar proveedor?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el proveedor{' '}
              <strong>{deletingSupplier?.name}</strong> y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingSupplier && handleDeleteSupplier(deletingSupplier)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de detalles del proveedor */}
      {selectedSupplier && (
        <AlertDialog open={!!selectedSupplier} onOpenChange={() => setSelectedSupplier(null)}>
          <AlertDialogContent className="max-w-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Detalles del Proveedor</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">INFORMACIÓN BÁSICA</h4>
                  <div className="mt-1">
                    <p className="font-medium">{selectedSupplier.name}</p>
                    {selectedSupplier.company_name && (
                      <p className="text-sm text-muted-foreground">{selectedSupplier.company_name}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Código: {selectedSupplier.code}
                    </p>
                    {selectedSupplier.supplier_category && (
                      <p className="text-sm text-muted-foreground">
                        Categoría: {selectedSupplier.supplier_category}
                      </p>
                    )}
                    {selectedSupplier.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        {getRatingStars(selectedSupplier.rating)}
                      </div>
                    )}
                  </div>
                </div>
                
                {(selectedSupplier.contact_person || selectedSupplier.phone || selectedSupplier.email) && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">CONTACTO</h4>
                    <div className="mt-1 space-y-1">
                      {selectedSupplier.contact_person && (
                        <p className="text-sm font-medium">{selectedSupplier.contact_person}</p>
                      )}
                      {selectedSupplier.phone && (
                        <p className="text-sm">{selectedSupplier.phone}</p>
                      )}
                      {selectedSupplier.mobile && (
                        <p className="text-sm">{selectedSupplier.mobile}</p>
                      )}
                      {selectedSupplier.email && (
                        <p className="text-sm">{selectedSupplier.email}</p>
                      )}
                      {selectedSupplier.website && (
                        <p className="text-sm text-blue-600">{selectedSupplier.website}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {(selectedSupplier.address || selectedSupplier.city) && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">DIRECCIÓN</h4>
                    <div className="mt-1">
                      {selectedSupplier.address && (
                        <p className="text-sm">{selectedSupplier.address}</p>
                      )}
                      {selectedSupplier.city && (
                        <p className="text-sm">
                          {selectedSupplier.city}{selectedSupplier.department && `, ${selectedSupplier.department}`}
                        </p>
                      )}
                      {selectedSupplier.country && (
                        <p className="text-sm">{selectedSupplier.country}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {(selectedSupplier.tax_id || selectedSupplier.tax_type) && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">INFORMACIÓN TRIBUTARIA</h4>
                    <div className="mt-1">
                      {selectedSupplier.tax_id && (
                        <p className="text-sm">
                          {getTaxTypeLabel(selectedSupplier.tax_type)} {selectedSupplier.tax_id}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {(selectedSupplier.payment_terms || selectedSupplier.credit_limit) && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">INFORMACIÓN FINANCIERA</h4>
                    <div className="mt-1 space-y-1">
                      {selectedSupplier.payment_terms && (
                        <div>
                          <p className="text-sm font-medium">Términos de pago:</p>
                          <p className="text-sm">{selectedSupplier.payment_terms}</p>
                        </div>
                      )}
                      {selectedSupplier.credit_limit && (
                        <div>
                          <p className="text-sm font-medium">Límite de crédito:</p>
                          <p className="text-sm">{formatCurrency(selectedSupplier.credit_limit)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {(selectedSupplier.bank_name || selectedSupplier.bank_account) && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">INFORMACIÓN BANCARIA</h4>
                    <div className="mt-1 space-y-1">
                      {selectedSupplier.bank_name && (
                        <p className="text-sm font-medium">{selectedSupplier.bank_name}</p>
                      )}
                      {selectedSupplier.bank_account && (
                        <p className="text-sm">
                          Cuenta {selectedSupplier.account_type === 'savings' ? 'de ahorros' : 'corriente'}: {selectedSupplier.bank_account}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedSupplier.notes && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">NOTAS</h4>
                    <p className="text-sm mt-1">{selectedSupplier.notes}</p>
                  </div>
                )}
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cerrar</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                setSelectedSupplier(null);
                onSupplierEdit(selectedSupplier);
              }}>
                Editar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default SuppliersTable;