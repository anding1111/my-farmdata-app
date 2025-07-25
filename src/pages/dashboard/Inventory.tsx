
import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  Plus, 
  Search, 
  AlertTriangle, 
  TrendingDown, 
  Calendar,
  BarChart3,
  FileText,
  Settings,
  Filter
} from "lucide-react";
import ProductsTab from "@/components/inventory/ProductsTab";
import CategoriesTab from "@/components/inventory/CategoriesTab";
import BatchesTab from "@/components/inventory/BatchesTab";
import MovementsTab from "@/components/inventory/MovementsTab";
import AlertsTab from "@/components/inventory/AlertsTab";
import ReportsTab from "@/components/inventory/ReportsTab";
import InventoryStats from "@/components/inventory/InventoryStats";
import { useInventoryStats, useAlerts } from "@/hooks/useInventory";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("products");
  const stats = useInventoryStats();
  const { data: alerts } = useAlerts({ is_read: false });

  const unreadAlertsCount = alerts?.data?.length || 0;

  return (
    <DashboardLayout>
      <DashboardHeader title="Gestión de Inventario" />
      
      <div className="p-6 space-y-6">
        {/* Estadísticas principales */}
        <InventoryStats stats={stats} />

        {/* Alertas rápidas */}
        {unreadAlertsCount > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-amber-800">Alertas Pendientes</CardTitle>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  {unreadAlertsCount}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 text-sm">
                Tienes {unreadAlertsCount} alerta{unreadAlertsCount > 1 ? 's' : ''} pendiente{unreadAlertsCount > 1 ? 's' : ''} que requieren tu atención.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 border-amber-300 text-amber-700 hover:bg-amber-100"
                onClick={() => setActiveTab("alerts")}
              >
                Ver Alertas
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Productos
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
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <ProductsTab />
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
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
