
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProductsTab from "@/components/inventory/ProductsTab";

const Inventory = () => {
  return (
    <DashboardLayout>
      <DashboardHeader title="Gestión de Inventario" />
      
      <div className="p-6">
        <ProductsTab />
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
