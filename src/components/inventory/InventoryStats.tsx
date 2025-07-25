import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  DollarSign, 
  AlertTriangle, 
  Calendar,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface InventoryStatsProps {
  stats: {
    totalProducts: number;
    totalValue: number;
    lowStockProducts: number;
    expiringProducts: number;
    pendingAlerts: number;
  };
}

const InventoryStats = ({ stats }: InventoryStatsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const statsCards = [
    {
      title: "Total Productos",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Valor Inventario",
      value: formatCurrency(stats.totalValue),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Stock Bajo",
      value: stats.lowStockProducts.toLocaleString(),
      icon: TrendingDown,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      badge: stats.lowStockProducts > 0 ? "Atención" : "Normal",
      badgeVariant: stats.lowStockProducts > 0 ? "destructive" : "default",
    },
    {
      title: "Próximos a Vencer",
      value: stats.expiringProducts.toLocaleString(),
      icon: Calendar,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      badge: stats.expiringProducts > 0 ? "Revisar" : "OK",
      badgeVariant: stats.expiringProducts > 0 ? "destructive" : "default",
    },
    {
      title: "Alertas Pendientes",
      value: stats.pendingAlerts.toLocaleString(),
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      badge: stats.pendingAlerts > 0 ? "Urgente" : "Limpio",
      badgeVariant: stats.pendingAlerts > 0 ? "destructive" : "default",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={`${stat.borderColor} ${stat.bgColor}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                {stat.title}
              </CardTitle>
              <Icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              {stat.badge && (
                <Badge 
                  variant={stat.badgeVariant as "default" | "destructive"} 
                  className="text-xs"
                >
                  {stat.badge}
                </Badge>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default InventoryStats;