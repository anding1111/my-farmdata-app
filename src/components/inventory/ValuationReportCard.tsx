import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import {
  BarChart,
  PieChart,
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
import { DollarSign, TrendingUp, Package, Building } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Register required components
echarts.use([
  BarChart,
  PieChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  DataZoomComponent,
  CanvasRenderer
]);

interface ValuationReportCardProps {
  data: any;
  isLoading: boolean;
  title: string;
  onRefresh?: () => void;
}

const ValuationReportCard = ({ data, isLoading, title, onRefresh }: ValuationReportCardProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
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

  // Calculate valuation metrics
  const valuationData = products.map((product: any) => {
    const purchaseValue = product.current_stock * product.purchase_price;
    const saleValue = product.current_stock * product.sale_price;
    const potentialProfit = saleValue - purchaseValue;
    const marginPercentage = purchaseValue > 0 ? ((saleValue - purchaseValue) / purchaseValue) * 100 : 0;
    
    return {
      ...product,
      purchase_value: purchaseValue,
      sale_value: saleValue,
      potential_profit: potentialProfit,
      margin_percentage: marginPercentage
    };
  });

  // Group by category for analysis
  const categoryValuation = valuationData.reduce((acc: any, product: any) => {
    const categoryName = product.category?.name || 'Sin Categoría';
    if (!acc[categoryName]) {
      acc[categoryName] = {
        products_count: 0,
        purchase_value: 0,
        sale_value: 0,
        potential_profit: 0
      };
    }
    acc[categoryName].products_count++;
    acc[categoryName].purchase_value += product.purchase_value;
    acc[categoryName].sale_value += product.sale_value;
    acc[categoryName].potential_profit += product.potential_profit;
    return acc;
  }, {});

  // Prepare chart data for category valuation
  const categoryChartData = Object.entries(categoryValuation).map(([name, data]: [string, any]) => ({
    name,
    ...data
  }));

  // Main valuation chart
  const valuationChartOption = {
    title: {
      text: 'Valuación por Categoría',
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
        const category = params[0];
        const data = categoryValuation[category.name];
        return `${category.name}<br/>
                Productos: ${data.products_count}<br/>
                Valor Compra: $${data.purchase_value.toLocaleString()}<br/>
                Valor Venta: $${data.sale_value.toLocaleString()}<br/>
                Ganancia Potencial: $${data.potential_profit.toLocaleString()}`;
      }
    },
    legend: {
      data: ['Valor de Compra', 'Valor de Venta']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categoryChartData.map(item => item.name),
      axisLabel: {
        rotate: 45,
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      name: 'Valor ($)',
      axisLabel: {
        formatter: (value: number) => `$${(value / 1000).toFixed(0)}K`
      }
    },
    series: [
      {
        name: 'Valor de Compra',
        type: 'bar',
        data: categoryChartData.map(item => item.purchase_value),
        itemStyle: {
          color: '#ef4444'
        }
      },
      {
        name: 'Valor de Venta',
        type: 'bar',
        data: categoryChartData.map(item => item.sale_value),
        itemStyle: {
          color: '#22c55e'
        }
      }
    ]
  };

  // Top products by value
  const topProductsByValue = valuationData
    .sort((a, b) => b.sale_value - a.sale_value)
    .slice(0, 10);

  // Profit margin analysis
  const marginAnalysis = valuationData.reduce((acc: any, product: any) => {
    if (product.margin_percentage < 10) acc.low++;
    else if (product.margin_percentage < 30) acc.medium++;
    else if (product.margin_percentage < 50) acc.good++;
    else acc.excellent++;
    return acc;
  }, { low: 0, medium: 0, good: 0, excellent: 0 });

  const exportColumns = [
    { key: 'code', label: 'Código' },
    { key: 'name', label: 'Producto' },
    { 
      key: 'category', 
      label: 'Categoría',
      format: (value: any) => value?.name || 'Sin Categoría'
    },
    { key: 'current_stock', label: 'Stock Actual' },
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
      key: 'purchase_value', 
      label: 'Valor Total Compra',
      format: (value: number) => `$${(value || 0).toLocaleString()}`
    },
    { 
      key: 'sale_value', 
      label: 'Valor Total Venta',
      format: (value: number) => `$${(value || 0).toLocaleString()}`
    },
    { 
      key: 'potential_profit', 
      label: 'Ganancia Potencial',
      format: (value: number) => `$${(value || 0).toLocaleString()}`
    },
    { 
      key: 'margin_percentage', 
      label: 'Margen (%)',
      format: (value: number) => `${value?.toFixed(1) || 0}%`
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {title}
          </CardTitle>
          <ExportButtons
            data={valuationData}
            reportTitle={title}
            chartRef={chartRef}
            isLoading={isLoading}
            fileName="reporte_valuacion"
            columns={exportColumns}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 border-blue-200 bg-blue-50">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Valor Total Inventario</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${(summary.total_purchase_value || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 border-green-200 bg-green-50">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Valor de Venta</p>
                <p className="text-2xl font-bold text-green-600">
                  ${(summary.total_sale_value || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 border-purple-200 bg-purple-50">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Ganancia Potencial</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${(summary.total_potential_profit || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 border-orange-200 bg-orange-50">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Margen Promedio</p>
                <p className="text-2xl font-bold text-orange-600">
                  {summary.average_margin ? `${summary.average_margin.toFixed(1)}%` : '0%'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Profit Margin Analysis */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Análisis de Márgenes de Ganancia</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{marginAnalysis.low}</div>
              <p className="text-sm text-muted-foreground">Bajo (&lt;10%)</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{marginAnalysis.medium}</div>
              <p className="text-sm text-muted-foreground">Medio (10-30%)</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{marginAnalysis.good}</div>
              <p className="text-sm text-muted-foreground">Bueno (30-50%)</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{marginAnalysis.excellent}</div>
              <p className="text-sm text-muted-foreground">Excelente (&gt;50%)</p>
            </div>
          </div>
        </Card>

        {/* Chart */}
        {categoryChartData.length > 0 && (
          <Card className="p-4">
            <div ref={chartRef}>
              <ReactEChartsCore
                echarts={echarts}
                option={valuationChartOption}
                style={{ height: '400px', width: '100%' }}
                notMerge={true}
                lazyUpdate={true}
              />
            </div>
          </Card>
        )}

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Products by Value */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">Productos de Mayor Valor</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {topProductsByValue.map((product, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.current_stock} unidades × ${product.sale_price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">
                      ${product.sale_value.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.margin_percentage.toFixed(1)}% margen
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Category Performance */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">Rendimiento por Categoría</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {categoryChartData
                .sort((a, b) => b.potential_profit - a.potential_profit)
                .map((category, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {category.products_count} productos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-purple-600">
                      ${category.potential_profit.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${category.sale_value.toLocaleString()} valor
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Investment Analysis */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Análisis de Inversión</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">Capital Invertido</h4>
              <p className="text-2xl font-bold text-blue-600">
                ${valuationData.reduce((sum, p) => sum + p.purchase_value, 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Costo total del inventario</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">Valor Realizable</h4>
              <p className="text-2xl font-bold text-green-600">
                ${valuationData.reduce((sum, p) => sum + p.sale_value, 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Valor de venta estimado</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800">ROI Potencial</h4>
              <p className="text-2xl font-bold text-purple-600">
                {(() => {
                  const totalPurchase = valuationData.reduce((sum, p) => sum + p.purchase_value, 0);
                  const totalSale = valuationData.reduce((sum, p) => sum + p.sale_value, 0);
                  const roi = totalPurchase > 0 ? ((totalSale - totalPurchase) / totalPurchase) * 100 : 0;
                  return `${roi.toFixed(1)}%`;
                })()}
              </p>
              <p className="text-xs text-muted-foreground">Retorno sobre inversión</p>
            </div>
          </div>
        </Card>

        {/* Report Details */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Detalles del Reporte</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Fecha de generación: {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}</p>
            <p>Productos valuados: {valuationData.length}</p>
            <p>Metodología: Valuación basada en costos de adquisición y precios de venta actuales</p>
            <p>Nota: Los valores reflejan el inventario al momento de la consulta</p>
          </div>
        </Card>
      </CardContent>
    </Card>
  );
};

export default ValuationReportCard;