import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Package, TrendingUp } from "lucide-react";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <DashboardHeader title="Dashboard" />
      <div className="p-6 space-y-6">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ventas del mes</p>
                  <p className="text-2xl font-bold">$2,543,000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Productos en stock</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Clientes activos</p>
                  <p className="text-2xl font-bold">345</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Crecimiento</p>
                  <p className="text-2xl font-bold">+12.5%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumen del negocio */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Negocio</CardTitle>
            <CardDescription>
              Una vista general de tu farmacia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Bienvenido al panel de control de tu farmacia. Aquí podrás ver las métricas principales 
              y gestionar todos los aspectos de tu negocio.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;