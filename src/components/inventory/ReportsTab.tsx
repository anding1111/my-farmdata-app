import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  useInventoryReport,
  useExpiryReport,
  useLowStockReport,
  useValuationReport,
  useCategories,
  useLaboratories,
  useLocations,
  useSuppliers
} from "@/hooks/useInventory";
import { ReportFilters } from "./ReportFilters";
import ReportFiltersComponent from "./ReportFilters";
import InventoryReportCard from "./InventoryReportCard";
import ExpiryReportCard from "./ExpiryReportCard";
import LowStockReportCard from "./LowStockReportCard";
import ValuationReportCard from "./ValuationReportCard";
import { 
  BarChart3, 
  Package, 
  Clock, 
  AlertTriangle, 
  DollarSign,
  RefreshCw,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

const ReportsTab = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  const [inventoryFilters, setInventoryFilters] = useState<ReportFilters>({});
  const [expiryFilters, setExpiryFilters] = useState<ReportFilters>({});
  const [lowStockFilters, setLowStockFilters] = useState<ReportFilters>({});
  const [valuationFilters, setValuationFilters] = useState<ReportFilters>({});

  // Fetch supporting data for filters
  const { data: categoriesData } = useCategories();
  const { data: laboratoriesData } = useLaboratories();
  const { data: locationsData } = useLocations();
  const { data: suppliersData } = useSuppliers();

  const categories = categoriesData?.data || [];
  const laboratories = laboratoriesData?.data || [];
  const locations = locationsData?.data || [];
  const suppliers = suppliersData?.data || [];

  // Report queries
  const {
    data: inventoryReport,
    isLoading: inventoryLoading,
    refetch: refetchInventory
  } = useInventoryReport();

  const {
    data: expiryReport,
    isLoading: expiryLoading,
    refetch: refetchExpiry
  } = useExpiryReport();

  const {
    data: lowStockReport,
    isLoading: lowStockLoading,
    refetch: refetchLowStock
  } = useLowStockReport();

  const {
    data: valuationReport,
    isLoading: valuationLoading,
    refetch: refetchValuation
  } = useValuationReport();

  const handleRefreshAll = async () => {
    try {
      await Promise.all([
        refetchInventory(),
        refetchExpiry(),
        refetchLowStock(),
        refetchValuation()
      ]);
      toast.success("Todos los reportes han sido actualizados");
    } catch (error) {
      toast.error("Error al actualizar los reportes");
    }
  };

  const reportTabs = [
    {
      id: "inventory",
      label: "Inventario General",
      icon: Package,
      description: "Reporte completo del inventario con análisis por categorías"
    },
    {
      id: "expiry",
      label: "Vencimientos",
      icon: Clock,
      description: "Productos próximos a vencer y ya vencidos"
    },
    {
      id: "low-stock",
      label: "Stock Bajo",
      icon: AlertTriangle,
      description: "Productos con stock bajo o agotados"
    },
    {
      id: "valuation",
      label: "Valuación",
      icon: DollarSign,
      description: "Análisis financiero y valuación del inventario"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Reportes de Inventario
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshAll}
              disabled={inventoryLoading || expiryLoading || lowStockLoading || valuationLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${
                inventoryLoading || expiryLoading || lowStockLoading || valuationLoading ? 'animate-spin' : ''
              }`} />
              Actualizar Todos
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            {reportTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-2 text-xs sm:text-sm"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Report Description Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Card 
                  key={tab.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isActive ? 'ring-2 ring-primary border-primary' : ''
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                      <h3 className={`font-medium ${isActive ? 'text-primary' : ''}`}>
                        {tab.label}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tab.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Report Content */}
          <TabsContent value="inventory" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <ReportFiltersComponent
                filters={inventoryFilters}
                onFiltersChange={setInventoryFilters}
                categories={categories}
                laboratories={laboratories}
                locations={locations}
                suppliers={suppliers}
              />
            </div>
            <InventoryReportCard
              data={inventoryReport}
              isLoading={inventoryLoading}
              title="Reporte General de Inventario"
              onRefresh={refetchInventory}
            />
          </TabsContent>

          <TabsContent value="expiry" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <ReportFiltersComponent
                filters={expiryFilters}
                onFiltersChange={setExpiryFilters}
                categories={categories}
                laboratories={laboratories}
                locations={locations}
                suppliers={suppliers}
              />
            </div>
            <ExpiryReportCard
              data={expiryReport}
              isLoading={expiryLoading}
              title="Reporte de Vencimientos"
              onRefresh={refetchExpiry}
            />
          </TabsContent>

          <TabsContent value="low-stock" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <ReportFiltersComponent
                filters={lowStockFilters}
                onFiltersChange={setLowStockFilters}
                categories={categories}
                laboratories={laboratories}
                locations={locations}
                suppliers={suppliers}
              />
            </div>
            <LowStockReportCard
              data={lowStockReport}
              isLoading={lowStockLoading}
              title="Reporte de Stock Bajo"
              onRefresh={refetchLowStock}
            />
          </TabsContent>

          <TabsContent value="valuation" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <ReportFiltersComponent
                filters={valuationFilters}
                onFiltersChange={setValuationFilters}
                categories={categories}
                laboratories={laboratories}
                locations={locations}
                suppliers={suppliers}
              />
            </div>
            <ValuationReportCard
              data={valuationReport}
              isLoading={valuationLoading}
              title="Reporte de Valuación"
              onRefresh={refetchValuation}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReportsTab;