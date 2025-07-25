
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ClientsTable from "@/components/clients/ClientsTable";
import ClientDialog from "@/components/clients/ClientDialog";
import ClientFilters from "@/components/clients/ClientFilters";
import { Client, ClientFilters as ClientFiltersType } from "@/types/clients";
import { clientsApi } from "@/api/clients";

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ClientFiltersType>({});
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();
  const { toast } = useToast();

  const loadClients = async () => {
    try {
      setIsLoading(true);
      const data = await clientsApi.getClients(filters);
      setClients(data);
      setFilteredClients(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al cargar clientes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, [filters]);

  const handleFiltersChange = (newFilters: ClientFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleNewClient = () => {
    setSelectedClient(undefined);
    setClientDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setClientDialogOpen(true);
  };

  const handleClientSaved = () => {
    loadClients();
  };

  const handleClientDeleted = () => {
    loadClients();
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between h-16 p-4 border-b bg-white">
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <Button onClick={handleNewClient}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>
      
      <div className="p-6 space-y-6">
        <ClientFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />
        
        <ClientsTable
          clients={filteredClients}
          onClientSelect={handleEditClient}
          onClientEdit={handleEditClient}
          onClientDeleted={handleClientDeleted}
          isLoading={isLoading}
        />
      </div>

      <ClientDialog
        open={clientDialogOpen}
        onOpenChange={setClientDialogOpen}
        client={selectedClient}
        onClientSaved={handleClientSaved}
      />
    </DashboardLayout>
  );
};

export default Clients;
