
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/layouts/DashboardLayout";
import SupplierFilters from "@/components/suppliers/SupplierFilters";
import { Supplier, SupplierFilters as SupplierFiltersType } from "@/types/suppliers";
import { suppliersApi } from "@/api/suppliers";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<SupplierFiltersType>({});
  const { toast } = useToast();

  const loadSuppliers = async () => {
    try {
      setIsLoading(true);
      const data = await suppliersApi.getSuppliers(filters);
      setSuppliers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al cargar proveedores",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, [filters]);

  const handleFiltersChange = (newFilters: SupplierFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between h-16 p-4 border-b bg-white">
        <h1 className="text-2xl font-semibold">Proveedores</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proveedor
        </Button>
      </div>
      
      <div className="p-6 space-y-6">
        <SupplierFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />
        
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">
            {isLoading ? "Cargando proveedores..." : `${suppliers.length} proveedores encontrados`}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Tabla y funcionalidades CRUD en desarrollo...
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Suppliers;
