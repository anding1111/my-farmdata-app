import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart
} from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  DataZoomComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import ExportButtons from "./ExportButtons";
import { Package, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Register required components
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  DataZoomComponent,
  CanvasRenderer
]);

interface InventoryReportCardProps {
  data: any;
  isLoading: boolean;
  title: string;
  onRefresh?: () => void;
}

const InventoryReportCard = ({ data, isLoading, title, onRefresh }: InventoryReportCardProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </Card>
              ))}
            </div>
            <Skeleton className="h-80 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const reportData = data?.data || {};
  const products = reportData.products || [];
  const summary = reportData.summary || {};

  // Prepare chart data
  const categoryData = products.reduce((acc: any, product: any) => {
    const categoryName = product.category?.name || 'Sin Categoría';
    if (!acc[categoryName]) {
      acc[categoryName] = { count: 0, value: 0 };
    }
    acc[categoryName].count += 1;
    acc[categoryName].value += product.current_stock * product.sale_price;
    return acc;
  }, {});

  const chartOption = {
    title: {
      text: 'Distribución por Categorías',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `${params.name}<br/>
                Productos: ${categoryData[params.name]?.count || 0}<br/>
                Valor: $${(categoryData[params.name]?.value || 0).toLocaleString()}`;
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [
      {
        name: 'Categorías',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: Object.entries(categoryData).map(([name, data]: [string, any]) => ({
          value: data.count,
          name: name
        }))
      }
    ]
  };

  // Stock level analysis
  const stockLevels = products.reduce((acc: any, product: any) => {
    const stockRatio = product.current_stock / product.max_stock;
    if (stockRatio === 0) acc.outOfStock++;
    else if (stockRatio < 0.2) acc.low++;
    else if (stockRatio < 0.5) acc.medium++;
    else acc.high++;
    return acc;
  }, { outOfStock: 0, low: 0, medium: 0, high: 0 });

  const exportColumns = [
    { key: 'code', label: 'Código' },
    { key: 'name', label: 'Producto' },
    { 
      key: 'category', 
      label: 'Categoría',
      format: (value: any) => value?.name || 'Sin Categoría'
    },
    { key: 'current_stock', label: 'Stock Actual' },
    { key: 'min_stock', label: 'Stock Mínimo' },
    { key: 'max_stock', label: 'Stock Máximo' },
    { 
      key: 'purchase_price', 
      label: 'Precio Compra',
      format: (value: number) => `$${value?.toLocaleString() || 0}`
    },
    { 
      key: 'sale_price', 
      label: 'Precio Venta',
      format: (value: number) => `$${value?.toLocaleString() || 0}`
    },
    { 
      key: 'total_value', 
      label: 'Valor Total',
      format: (value: number) => `$${(value || 0).toLocaleString()}`
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {title}
          </CardTitle>
          <ExportButtons
            data={products.map((p: any) => ({
              ...p,
              total_value: p.current_stock * p.sale_price
            }))}
            reportTitle={title}
            chartRef={chartRef}
            isLoading={isLoading}
            fileName="reporte_inventario"
            columns={exportColumns}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Productos</p>
                <p className="text-2xl font-bold">{summary.total_products || 0}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Valor Total</p>
                <p className="text-2xl font-bold">
                  ${(summary.total_value || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Stock Bajo</p>
                <p className="text-2xl font-bold text-orange-500">
                  {summary.low_stock_products || 0}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Categorías Activas</p>
                <p className="text-2xl font-bold">
                  {Object.keys(categoryData).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Stock Level Analysis */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Análisis de Niveles de Stock</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge variant="destructive" className="mb-2">Sin Stock</Badge>
              <p className="text-2xl font-bold text-destructive">{stockLevels.outOfStock}</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="mb-2 bg-orange-100 text-orange-800">Stock Bajo</Badge>
              <p className="text-2xl font-bold text-orange-600">{stockLevels.low}</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="mb-2 bg-yellow-100 text-yellow-800">Stock Medio</Badge>
              <p className="text-2xl font-bold text-yellow-600">{stockLevels.medium}</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="mb-2 bg-green-100 text-green-800">Stock Alto</Badge>
              <p className="text-2xl font-bold text-green-600">{stockLevels.high}</p>
            </div>
          </div>
        </Card>

        {/* Chart */}
        {Object.keys(categoryData).length > 0 && (
          <Card className="p-4">
            <div ref={chartRef}>
              <ReactEChartsCore
                echarts={echarts}
                option={chartOption}
                style={{ height: '400px', width: '100%' }}
                notMerge={true}
                lazyUpdate={true}
              />
            </div>
          </Card>
        )}

        {/* Report Details */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Detalles del Reporte</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Fecha de generación: {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}</p>
            <p>Total de registros: {products.length}</p>
            <p>Valor promedio por producto: ${products.length > 0 ? Math.round((summary.total_value || 0) / products.length).toLocaleString() : 0}</p>
          </div>
        </Card>
      </CardContent>
    </Card>
  );
};

export default InventoryReportCard;