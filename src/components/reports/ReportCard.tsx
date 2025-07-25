import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package } from "lucide-react";

interface ReportCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
  progress?: number;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
}

const ReportCard = ({ 
  title, 
  value, 
  description, 
  trend, 
  icon, 
  className = "",
  progress,
  badge 
}: ReportCardProps) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      // Si es dinero (mayor a 1000)
      if (val >= 1000) {
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0
        }).format(val);
      }
      // Si es porcentaje (entre 0 y 100 con decimales)
      if (val > 0 && val <= 100 && val % 1 !== 0) {
        return `${val.toFixed(1)}%`;
      }
      // Número normal
      return val.toLocaleString('es-CO');
    }
    return val;
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              {formatValue(value)}
            </div>
            {badge && (
              <Badge variant={badge.variant || "default"}>
                {badge.text}
              </Badge>
            )}
          </div>
          
          {progress !== undefined && (
            <div className="space-y-1">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {progress.toFixed(1)}% del objetivo
              </p>
            </div>
          )}
          
          {description && (
            <CardDescription className="text-xs">
              {description}
            </CardDescription>
          )}
          
          {trend && (
            <div className="flex items-center gap-1 text-xs">
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={trend.isPositive ? "text-green-500" : "text-red-500"}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-muted-foreground">vs período anterior</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para métricas de ventas
export const SalesMetrics = ({ report }: { report: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <ReportCard
      title="Ventas Totales"
      value={report.total_sales}
      description="Ingresos del período"
      trend={{ value: report.growth_percentage, isPositive: report.growth_percentage > 0 }}
      icon={<DollarSign className="h-4 w-4 text-primary" />}
    />
    <ReportCard
      title="Transacciones"
      value={report.total_transactions}
      description="Número de ventas"
      icon={<ShoppingCart className="h-4 w-4 text-primary" />}
    />
    <ReportCard
      title="Venta Promedio"
      value={report.average_sale}
      description="Por transacción"
      icon={<TrendingUp className="h-4 w-4 text-primary" />}
    />
    <ReportCard
      title="Producto Top"
      value={report.best_selling_product}
      description="Más vendido"
      icon={<Package className="h-4 w-4 text-primary" />}
      badge={{ text: "Top", variant: "default" }}
    />
  </div>
);

// Componente para métricas de inventario
export const InventoryMetrics = ({ report }: { report: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <ReportCard
      title="Productos Totales"
      value={report.total_products}
      description="En inventario"
      icon={<Package className="h-4 w-4 text-primary" />}
    />
    <ReportCard
      title="Valor Total"
      value={report.total_value}
      description="Del inventario"
      icon={<DollarSign className="h-4 w-4 text-primary" />}
    />
    <ReportCard
      title="Stock Bajo"
      value={report.low_stock_items}
      description="Productos en alerta"
      icon={<TrendingDown className="h-4 w-4 text-orange-500" />}
      badge={{ text: "Alerta", variant: "destructive" }}
    />
    <ReportCard
      title="Rotación"
      value={`${report.stock_turnover}x`}
      description="Veces por año"
      icon={<TrendingUp className="h-4 w-4 text-primary" />}
    />
  </div>
);

// Componente para métricas de clientes
export const ClientMetrics = ({ report }: { report: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <ReportCard
      title="Total Clientes"
      value={report.total_clients}
      description="Base de clientes"
      icon={<Users className="h-4 w-4 text-primary" />}
    />
    <ReportCard
      title="Clientes Nuevos"
      value={report.new_clients}
      description="En el período"
      icon={<TrendingUp className="h-4 w-4 text-green-500" />}
      badge={{ text: "Nuevos", variant: "default" }}
    />
    <ReportCard
      title="Retención"
      value={report.client_retention_rate}
      description="Tasa de retención"
      progress={report.client_retention_rate}
      icon={<Users className="h-4 w-4 text-primary" />}
    />
    <ReportCard
      title="Compra Promedio"
      value={report.average_purchase_value}
      description="Por cliente"
      icon={<DollarSign className="h-4 w-4 text-primary" />}
    />
  </div>
);

// Componente para métricas de proveedores
export const SupplierMetrics = ({ report }: { report: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <ReportCard
      title="Total Proveedores"
      value={report.total_suppliers}
      description="Registrados"
      icon={<Users className="h-4 w-4 text-primary" />}
    />
    <ReportCard
      title="Proveedores Activos"
      value={report.active_suppliers}
      description="Con pedidos"
      icon={<TrendingUp className="h-4 w-4 text-green-500" />}
    />
    <ReportCard
      title="Compras Totales"
      value={report.total_purchases}
      description="Del período"
      icon={<DollarSign className="h-4 w-4 text-primary" />}
    />
    <ReportCard
      title="Tiempo Entrega"
      value={`${report.average_delivery_time} días`}
      description="Promedio"
      icon={<Package className="h-4 w-4 text-primary" />}
    />
  </div>
);

// Componente para métricas financieras
export const FinancialMetrics = ({ report }: { report: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <ReportCard
      title="Ingresos Totales"
      value={report.total_revenue}
      description="Del período"
      icon={<DollarSign className="h-4 w-4 text-green-500" />}
    />
    <ReportCard
      title="Costos Totales"
      value={report.total_costs}
      description="Gastos del período"
      icon={<TrendingDown className="h-4 w-4 text-red-500" />}
    />
    <ReportCard
      title="Utilidad Bruta"
      value={report.gross_profit}
      description="Antes de gastos"
      icon={<TrendingUp className="h-4 w-4 text-primary" />}
    />
    <ReportCard
      title="Margen de Utilidad"
      value={report.profit_margin}
      description="Porcentaje"
      progress={report.profit_margin}
      icon={<DollarSign className="h-4 w-4 text-primary" />}
    />
  </div>
);

export default ReportCard;