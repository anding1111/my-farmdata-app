
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/layouts/DashboardLayout";
import SuppliersTable from "@/components/suppliers/SuppliersTable";
import SupplierDialog from "@/components/suppliers/SupplierDialog";
import SupplierFilters from "@/components/suppliers/SupplierFilters";
import { Supplier, SupplierFilters as SupplierFiltersType } from "@/types/suppliers";
import { suppliersApi } from "@/api/suppliers";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<SupplierFiltersType>({});
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>();
  const { toast } = useToast();

  const loadSuppliers = async () => {
    try {
      setIsLoading(true);
      const data = await suppliersApi.getSuppliers(filters);
      setSuppliers(data);
      setFilteredSuppliers(data);
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

  const handleNewSupplier = () => {
    setSelectedSupplier(undefined);
    setSupplierDialogOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSupplierDialogOpen(true);
  };

  const handleSupplierSaved = () => {
    loadSuppliers();
  };

  const handleSupplierDeleted = () => {
    loadSuppliers();
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between h-16 p-4 border-b bg-white">
        <h1 className="text-2xl font-semibold">Proveedores</h1>
        <Button onClick={handleNewSupplier}>
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
        
        <SuppliersTable
          suppliers={filteredSuppliers}
          onSupplierSelect={handleEditSupplier}
          onSupplierEdit={handleEditSupplier}
          onSupplierDeleted={handleSupplierDeleted}
          isLoading={isLoading}
        />
      </div>

      <SupplierDialog
        open={supplierDialogOpen}
        onOpenChange={setSupplierDialogOpen}
        supplier={selectedSupplier}
        onSupplierSaved={handleSupplierSaved}
      />
    </DashboardLayout>
  );
};

export default Suppliers;
