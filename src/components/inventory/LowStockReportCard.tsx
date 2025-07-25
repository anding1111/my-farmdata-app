import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import {
  BarChart,
  LineChart
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
import { Package, AlertTriangle, TrendingDown, Zap } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Register required components
echarts.use([
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  DataZoomComponent,
  CanvasRenderer
]);

interface LowStockReportCardProps {
  data: any;
  isLoading: boolean;
  title: string;
  onRefresh?: () => void;
}

const LowStockReportCard = ({ data, isLoading, title, onRefresh }: LowStockReportCardProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
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

  // Categorize by stock severity
  const stockCategories = products.reduce((acc: any, product: any) => {
    const stockRatio = product.current_stock / product.min_stock;
    const stockPercentage = (product.current_stock / product.max_stock) * 100;
    
    if (product.current_stock === 0) {
      acc.outOfStock.push({ ...product, stockRatio, stockPercentage });
    } else if (stockRatio < 0.5) {
      acc.critical.push({ ...product, stockRatio, stockPercentage });
    } else if (stockRatio < 1) {
      acc.low.push({ ...product, stockRatio, stockPercentage });
    } else if (stockPercentage < 30) {
      acc.warning.push({ ...product, stockRatio, stockPercentage });
    }
    
    return acc;
  }, { 
    outOfStock: [], 
    critical: [], 
    low: [], 
    warning: [] 
  });

  // Prepare chart data - Stock levels
  const chartData = products
    .map((product: any) => {
      const stockPercentage = (product.current_stock / product.max_stock) * 100;
      return {
        name: product.name,
        code: product.code,
        current_stock: product.current_stock,
        min_stock: product.min_stock,
        max_stock: product.max_stock,
        stock_percentage: stockPercentage,
        reorder_needed: product.max_stock - product.current_stock
      };
    })
    .sort((a, b) => a.stock_percentage - b.stock_percentage)
    .slice(0, 20); // Top 20 most critical

  const chartOption = {
    title: {
      text: 'Niveles de Stock Críticos (Top 20)',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const data = params[0];
        const item = chartData[data.dataIndex];
        return `${item.name}<br/>
                Código: ${item.code}<br/>
                Stock actual: ${item.current_stock}<br/>
                Stock mínimo: ${item.min_stock}<br/>
                Stock máximo: ${item.max_stock}<br/>
                Nivel: ${item.stock_percentage.toFixed(1)}%<br/>
                Necesita reposición: ${item.reorder_needed}`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.map(item => `${item.name.substring(0, 15)}...`),
      axisLabel: {
        rotate: 45,
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      name: 'Nivel de Stock (%)',
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: 'Nivel de Stock',
        type: 'bar',
        data: chartData.map(item => ({
          value: item.stock_percentage,
          itemStyle: {
            color: item.stock_percentage === 0 ? '#ef4444' :
                   item.stock_percentage < 20 ? '#f97316' :
                   item.stock_percentage < 40 ? '#eab308' : '#22c55e'
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        markLine: {
          data: [
            {
              name: 'Nivel Crítico',
              yAxis: 20,
              lineStyle: {
                color: '#ef4444',
                type: 'dashed'
              },
              label: {
                formatter: 'Crítico (20%)'
              }
            }
          ]
        }
      }
    ]
  };

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
      key: 'stock_percentage', 
      label: 'Nivel de Stock (%)',
      format: (value: number) => `${value?.toFixed(1) || 0}%`
    },
    { 
      key: 'reorder_quantity', 
      label: 'Cantidad a Reponer',
      format: (value: number) => value?.toString() || '0'
    },
    { 
      key: 'estimated_value', 
      label: 'Valor Estimado Reposición',
      format: (value: number) => `$${(value || 0).toLocaleString()}`
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {title}
          </CardTitle>
          <ExportButtons
            data={products.map((p: any) => ({
              ...p,
              stock_percentage: (p.current_stock / p.max_stock) * 100,
              reorder_quantity: p.max_stock - p.current_stock,
              estimated_value: (p.max_stock - p.current_stock) * p.purchase_price
            }))}
            reportTitle={title}
            chartRef={chartRef}
            isLoading={isLoading}
            fileName="reporte_stock_bajo"
            columns={exportColumns}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 border-red-200 bg-red-50">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Sin Stock</p>
                <p className="text-2xl font-bold text-red-500">
                  {stockCategories.outOfStock.length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 border-orange-200 bg-orange-50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Stock Crítico</p>
                <p className="text-2xl font-bold text-orange-500">
                  {stockCategories.critical.length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 border-yellow-200 bg-yellow-50">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Stock Bajo</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {stockCategories.low.length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 border-blue-200 bg-blue-50">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">En Alerta</p>
                <p className="text-2xl font-bold text-blue-500">
                  {stockCategories.warning.length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Priority Actions */}
        {(stockCategories.outOfStock.length > 0 || stockCategories.critical.length > 0) && (
          <Card className="p-4 border-red-200 bg-red-50">
            <h3 className="font-medium mb-3 text-red-800">🚨 Acciones Inmediatas Requeridas</h3>
            <div className="space-y-2">
              {stockCategories.outOfStock.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Crítico</Badge>
                  <span className="text-sm">
                    {stockCategories.outOfStock.length} productos sin stock - Reposición urgente
                  </span>
                </div>
              )}
              {stockCategories.critical.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">Urgente</Badge>
                  <span className="text-sm">
                    {stockCategories.critical.length} productos en nivel crítico
                  </span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Chart */}
        {chartData.length > 0 && (
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

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Reorder Recommendations */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">Recomendaciones de Reposición</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Productos a reponer:</span>
                <span className="font-bold text-blue-600">
                  {stockCategories.outOfStock.length + stockCategories.critical.length + stockCategories.low.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Inversión estimada:</span>
                <span className="font-bold text-green-600">
                  ${[...stockCategories.outOfStock, ...stockCategories.critical, ...stockCategories.low]
                    .reduce((sum: number, product: any) => 
                      sum + ((product.max_stock - product.current_stock) * product.purchase_price), 0
                    ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Unidades a ordenar:</span>
                <span className="font-bold text-purple-600">
                  {[...stockCategories.outOfStock, ...stockCategories.critical, ...stockCategories.low]
                    .reduce((sum: number, product: any) => 
                      sum + (product.max_stock - product.current_stock), 0
                    ).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Most Critical Items */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">Más Críticos</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {[...stockCategories.outOfStock, ...stockCategories.critical].slice(0, 8).map((product, index) => (
                <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.current_stock}/{product.max_stock} unidades
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge 
                      variant={product.current_stock === 0 ? "destructive" : "secondary"}
                      className={product.current_stock > 0 ? "bg-orange-100 text-orange-800" : ""}
                    >
                      {product.current_stock === 0 ? 'Sin Stock' : 'Crítico'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {product.stockPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Category Analysis */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Análisis por Categoría</h3>
          <div className="space-y-2">
            {Object.entries(
              products.reduce((acc: any, product: any) => {
                const categoryName = product.category?.name || 'Sin Categoría';
                if (!acc[categoryName]) {
                  acc[categoryName] = { total: 0, lowStock: 0, outOfStock: 0 };
                }
                acc[categoryName].total++;
                if (product.current_stock === 0) acc[categoryName].outOfStock++;
                else if ((product.current_stock / product.min_stock) < 1) acc[categoryName].lowStock++;
                return acc;
              }, {})
            ).map(([category, data]: [string, any]) => (
              <div key={category} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium">{category}</span>
                <div className="flex gap-2">
                  {data.outOfStock > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {data.outOfStock} sin stock
                    </Badge>
                  )}
                  {data.lowStock > 0 && (
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                      {data.lowStock} stock bajo
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {data.total} total
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Report Details */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Detalles del Reporte</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Fecha de generación: {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}</p>
            <p>Productos analizados: {products.length}</p>
            <p>Criterio de stock bajo: Menor al stock mínimo configurado</p>
            <p>Criterio crítico: Menos del 50% del stock mínimo</p>
          </div>
        </Card>
      </CardContent>
    </Card>
  );
};

export default LowStockReportCard;