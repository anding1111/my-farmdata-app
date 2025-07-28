
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  Calendar,
  BarChart3,
  Settings,
  PackageOpen
} from "lucide-react";
import ProductsTab from "@/components/inventory/ProductsTab";
import CategoriesTab from "@/components/inventory/CategoriesTab";
import BatchesTab from "@/components/inventory/BatchesTab";
import MovementsTab from "@/components/inventory/MovementsTab";
import AlertsTab from "@/components/inventory/AlertsTab";
import ReportsTab from "@/components/inventory/ReportsTab";
import ReceiptsTab from "@/components/inventory/ReceiptsTab";
import LocationsTab from "@/components/inventory/LocationsTab";
import { VentasTab } from "@/components/dashboard/VentasTab";
import { AnalisisTab } from "@/components/dashboard/AnalisisTab";
import { TurnosTab } from "@/components/dashboard/TurnosTab";
import { useAlerts } from "@/hooks/useInventory";

const Inventory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'products';
  const { data: alerts } = useAlerts({ is_read: false });

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const unreadAlertsCount = alerts?.data?.length || 0;

  return (
    <DashboardLayout>
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Productos
            </TabsTrigger>
            <TabsTrigger value="ventas" className="flex items-center gap-2">
              Historial Ventas
            </TabsTrigger>
            <TabsTrigger value="turnos" className="flex items-center gap-2">
              Cola de Turnos
            </TabsTrigger>
            <TabsTrigger value="analisis" className="flex items-center gap-2">
              Análisis Inteligente
            </TabsTrigger>
            {/* Temporalmente desactivadas */}
            {/* 
            <TabsTrigger value="receipts" className="flex items-center gap-2">
              <PackageOpen className="h-4 w-4" />
              Ingresos
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Ubicaciones
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Categorías
            </TabsTrigger>
            <TabsTrigger value="batches" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Lotes
            </TabsTrigger>
            <TabsTrigger value="movements" className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Movimientos
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alertas
              {unreadAlertsCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {unreadAlertsCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Reportes
            </TabsTrigger>
            */}
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <ProductsTab />
          </TabsContent>

          <TabsContent value="ventas" className="space-y-4">
            <VentasTab />
          </TabsContent>

          <TabsContent value="turnos" className="space-y-4">
            <TurnosTab />
          </TabsContent>

          <TabsContent value="analisis" className="space-y-4">
            <AnalisisTab />
          </TabsContent>

          {/* Temporalmente desactivadas */}
          {/* 
          <TabsContent value="receipts" className="space-y-4">
            <ReceiptsTab />
          </TabsContent>

          <TabsContent value="locations" className="space-y-4">
            <LocationsTab />
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <CategoriesTab />
          </TabsContent>

          <TabsContent value="batches" className="space-y-4">
            <BatchesTab />
          </TabsContent>

          <TabsContent value="movements" className="space-y-4">
            <MovementsTab />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <AlertsTab />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <ReportsTab />
          </TabsContent>
          */}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
