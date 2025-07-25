import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Edit, Trash2, MoreHorizontal, User, Phone, Mail, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/types/clients";
import { clientsApi } from "@/api/clients";
import { format } from "date-fns";

interface ClientsTableProps {
  clients: Client[];
  onClientSelect: (client: Client) => void;
  onClientEdit: (client: Client) => void;
  onClientDeleted: () => void;
  isLoading?: boolean;
}

const ClientsTable = ({ clients, onClientSelect, onClientEdit, onClientDeleted, isLoading }: ClientsTableProps) => {
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const handleDeleteClient = async (client: Client) => {
    try {
      await clientsApi.deleteClient(client.id);
      toast({
        title: "Cliente eliminado",
        description: `El cliente ${client.name} ha sido eliminado exitosamente.`,
      });
      onClientDeleted();
      setDeletingClient(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ha ocurrido un error al eliminar el cliente",
        variant: "destructive",
      });
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const types = {
      'CC': 'C.C.',
      'TI': 'T.I.',
      'CE': 'C.E.',
      'PP': 'Pasaporte',
      'NIT': 'NIT'
    };
    return types[type as keyof typeof types] || type;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge variant="default">Activo</Badge>;
    }
    return <Badge variant="secondary">Inactivo</Badge>;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch {
      return '-';
    }
  };

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return '-';
    try {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return `${age} años`;
    } catch {
      return '-';
    }
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

  if (clients.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay clientes</h3>
            <p className="text-muted-foreground">
              No se encontraron clientes que coincidan con los filtros aplicados.
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
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {clients.length} cliente{clients.length !== 1 ? 's' : ''} encontrado{clients.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Seguro</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.code}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        {client.city && (
                          <div className="text-sm text-muted-foreground">
                            {client.city}{client.department && `, ${client.department}`}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {getDocumentTypeLabel(client.document_type)} {client.document_number}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {client.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </div>
                        )}
                        {client.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{calculateAge(client.birth_date)}</TableCell>
                    <TableCell>
                      {client.insurance_provider ? (
                        <div className="text-sm">
                          <div className="font-medium">{client.insurance_provider}</div>
                          {client.insurance_number && (
                            <div className="text-muted-foreground">{client.insurance_number}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Sin seguro</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
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
                          <DropdownMenuItem onClick={() => setSelectedClient(client)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onClientEdit(client)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setDeletingClient(client)}
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
      <AlertDialog open={!!deletingClient} onOpenChange={() => setDeletingClient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el cliente{' '}
              <strong>{deletingClient?.name}</strong> y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingClient && handleDeleteClient(deletingClient)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de detalles del cliente */}
      {selectedClient && (
        <AlertDialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Detalles del Cliente</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">INFORMACIÓN BÁSICA</h4>
                  <div className="mt-1">
                    <p className="font-medium">{selectedClient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {getDocumentTypeLabel(selectedClient.document_type)} {selectedClient.document_number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Código: {selectedClient.code}
                    </p>
                    {selectedClient.birth_date && (
                      <p className="text-sm text-muted-foreground">
                        Nacimiento: {formatDate(selectedClient.birth_date)} ({calculateAge(selectedClient.birth_date)})
                      </p>
                    )}
                  </div>
                </div>
                
                {(selectedClient.phone || selectedClient.email) && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">CONTACTO</h4>
                    <div className="mt-1 space-y-1">
                      {selectedClient.phone && (
                        <p className="text-sm">{selectedClient.phone}</p>
                      )}
                      {selectedClient.email && (
                        <p className="text-sm">{selectedClient.email}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {(selectedClient.address || selectedClient.city) && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">DIRECCIÓN</h4>
                    <div className="mt-1">
                      {selectedClient.address && (
                        <p className="text-sm">{selectedClient.address}</p>
                      )}
                      {selectedClient.city && (
                        <p className="text-sm">
                          {selectedClient.city}{selectedClient.department && `, ${selectedClient.department}`}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {(selectedClient.emergency_contact || selectedClient.emergency_phone) && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">CONTACTO DE EMERGENCIA</h4>
                    <div className="mt-1">
                      {selectedClient.emergency_contact && (
                        <p className="text-sm font-medium">{selectedClient.emergency_contact}</p>
                      )}
                      {selectedClient.emergency_phone && (
                        <p className="text-sm">{selectedClient.emergency_phone}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {(selectedClient.insurance_provider || selectedClient.insurance_number) && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">SEGURO MÉDICO</h4>
                    <div className="mt-1">
                      {selectedClient.insurance_provider && (
                        <p className="text-sm font-medium">{selectedClient.insurance_provider}</p>
                      )}
                      {selectedClient.insurance_number && (
                        <p className="text-sm">{selectedClient.insurance_number}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {(selectedClient.allergies || selectedClient.medical_conditions) && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">INFORMACIÓN MÉDICA</h4>
                    <div className="mt-1 space-y-1">
                      {selectedClient.allergies && (
                        <div>
                          <p className="text-sm font-medium">Alergias:</p>
                          <p className="text-sm">{selectedClient.allergies}</p>
                        </div>
                      )}
                      {selectedClient.medical_conditions && (
                        <div>
                          <p className="text-sm font-medium">Condiciones médicas:</p>
                          <p className="text-sm">{selectedClient.medical_conditions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedClient.notes && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">NOTAS</h4>
                    <p className="text-sm mt-1">{selectedClient.notes}</p>
                  </div>
                )}
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cerrar</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                setSelectedClient(null);
                onClientEdit(selectedClient);
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

export default ClientsTable;