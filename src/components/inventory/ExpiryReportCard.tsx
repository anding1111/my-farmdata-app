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
import { Clock, AlertTriangle, Calendar, Package } from "lucide-react";
import { format, differenceInDays } from "date-fns";
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

interface ExpiryReportCardProps {
  data: any;
  isLoading: boolean;
  title: string;
  onRefresh?: () => void;
}

const ExpiryReportCard = ({ data, isLoading, title, onRefresh }: ExpiryReportCardProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
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
  const batches = reportData.batches || [];
  const summary = reportData.summary || {};

  // Categorize by expiry urgency
  const now = new Date();
  const expiryCategories = batches.reduce((acc: any, batch: any) => {
    const expiryDate = new Date(batch.expiry_date);
    const daysToExpiry = differenceInDays(expiryDate, now);
    
    if (daysToExpiry < 0) {
      acc.expired.push(batch);
    } else if (daysToExpiry <= 30) {
      acc.expiringSoon.push(batch);
    } else if (daysToExpiry <= 90) {
      acc.expiringMedium.push(batch);
    } else {
      acc.expiringLater.push(batch);
    }
    
    return acc;
  }, { 
    expired: [], 
    expiringSoon: [], 
    expiringMedium: [], 
    expiringLater: [] 
  });

  // Prepare chart data - Expiry timeline
  const timelineData = batches
    .map((batch: any) => {
      const expiryDate = new Date(batch.expiry_date);
      const daysToExpiry = differenceInDays(expiryDate, now);
      return {
        name: batch.product?.name || `Producto ${batch.product_id}`,
        batch_number: batch.batch_number,
        expiry_date: batch.expiry_date,
        days_to_expiry: daysToExpiry,
        quantity: batch.remaining_quantity,
        value: batch.remaining_quantity * (batch.product?.sale_price || 0)
      };
    })
    .sort((a, b) => a.days_to_expiry - b.days_to_expiry)
    .slice(0, 20); // Top 20 most urgent

  const chartOption = {
    title: {
      text: 'Productos Próximos a Vencer (Top 20)',
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
        const item = timelineData[data.dataIndex];
        return `${item.name}<br/>
                Lote: ${item.batch_number}<br/>
                Días para vencer: ${item.days_to_expiry}<br/>
                Cantidad: ${item.quantity}<br/>
                Valor: $${item.value.toLocaleString()}`;
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
      data: timelineData.map(item => `${item.name.substring(0, 15)}...`),
      axisLabel: {
        rotate: 45,
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      name: 'Días para Vencer',
      axisLabel: {
        formatter: '{value}'
      }
    },
    series: [
      {
        name: 'Días para Vencer',
        type: 'bar',
        data: timelineData.map(item => ({
          value: item.days_to_expiry,
          itemStyle: {
            color: item.days_to_expiry < 0 ? '#ef4444' :
                   item.days_to_expiry <= 30 ? '#f97316' :
                   item.days_to_expiry <= 90 ? '#eab308' : '#22c55e'
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  const exportColumns = [
    { key: 'batch_number', label: 'Número de Lote' },
    { 
      key: 'product', 
      label: 'Producto',
      format: (value: any) => value?.name || 'Producto no encontrado'
    },
    { 
      key: 'expiry_date', 
      label: 'Fecha de Vencimiento',
      format: (value: string) => format(new Date(value), 'dd/MM/yyyy', { locale: es })
    },
    { 
      key: 'manufacture_date', 
      label: 'Fecha de Fabricación',
      format: (value: string) => format(new Date(value), 'dd/MM/yyyy', { locale: es })
    },
    { key: 'remaining_quantity', label: 'Cantidad Restante' },
    { 
      key: 'purchase_price', 
      label: 'Precio de Compra',
      format: (value: number) => `$${value?.toLocaleString() || 0}`
    },
    { 
      key: 'total_value', 
      label: 'Valor Total',
      format: (value: number) => `$${(value || 0).toLocaleString()}`
    },
    {
      key: 'days_to_expiry',
      label: 'Días para Vencer',
      format: (value: number) => {
        if (value < 0) return `Vencido hace ${Math.abs(value)} días`;
        return `${value} días`;
      }
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {title}
          </CardTitle>
          <ExportButtons
            data={batches.map((batch: any) => ({
              ...batch,
              total_value: batch.remaining_quantity * batch.purchase_price,
              days_to_expiry: differenceInDays(new Date(batch.expiry_date), now)
            }))}
            reportTitle={title}
            chartRef={chartRef}
            isLoading={isLoading}
            fileName="reporte_vencimientos"
            columns={exportColumns}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 border-red-200 bg-red-50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Vencidos</p>
                <p className="text-2xl font-bold text-red-500">
                  {expiryCategories.expired.length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 border-orange-200 bg-orange-50">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Vencen en 30 días</p>
                <p className="text-2xl font-bold text-orange-500">
                  {expiryCategories.expiringSoon.length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 border-yellow-200 bg-yellow-50">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Vencen en 90 días</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {expiryCategories.expiringMedium.length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 border-green-200 bg-green-50">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Estables</p>
                <p className="text-2xl font-bold text-green-500">
                  {expiryCategories.expiringLater.length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Priority Alert */}
        {(expiryCategories.expired.length > 0 || expiryCategories.expiringSoon.length > 0) && (
          <Card className="p-4 border-red-200 bg-red-50">
            <h3 className="font-medium mb-3 text-red-800">⚠️ Atención Requerida</h3>
            <div className="space-y-2">
              {expiryCategories.expired.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Crítico</Badge>
                  <span className="text-sm">
                    {expiryCategories.expired.length} lotes ya han vencido
                  </span>
                </div>
              )}
              {expiryCategories.expiringSoon.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">Urgente</Badge>
                  <span className="text-sm">
                    {expiryCategories.expiringSoon.length} lotes vencen en los próximos 30 días
                  </span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Chart */}
        {timelineData.length > 0 && (
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

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Value at Risk */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">Valor en Riesgo</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Productos vencidos:</span>
                <span className="font-bold text-red-500">
                  ${expiryCategories.expired.reduce((sum: number, batch: any) => 
                    sum + (batch.remaining_quantity * (batch.product?.sale_price || 0)), 0
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Vencen en 30 días:</span>
                <span className="font-bold text-orange-500">
                  ${expiryCategories.expiringSoon.reduce((sum: number, batch: any) => 
                    sum + (batch.remaining_quantity * (batch.product?.sale_price || 0)), 0
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Vencen en 90 días:</span>
                <span className="font-bold text-yellow-500">
                  ${expiryCategories.expiringMedium.reduce((sum: number, batch: any) => 
                    sum + (batch.remaining_quantity * (batch.product?.sale_price || 0)), 0
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Most Urgent Items */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">Más Urgentes</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {timelineData.slice(0, 8).map((item, index) => (
                <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Lote: {item.batch_number}</p>
                  </div>
                  <Badge 
                    variant={
                      item.days_to_expiry < 0 ? "destructive" :
                      item.days_to_expiry <= 30 ? "secondary" : "outline"
                    }
                    className={
                      item.days_to_expiry <= 30 && item.days_to_expiry >= 0 ? "bg-orange-100 text-orange-800" : ""
                    }
                  >
                    {item.days_to_expiry < 0 ? 
                      `Vencido` : 
                      `${item.days_to_expiry}d`
                    }
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Report Details */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Detalles del Reporte</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Fecha de generación: {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}</p>
            <p>Total de lotes analizados: {batches.length}</p>
            <p>Rango de fechas de vencimiento: {
              batches.length > 0 ? 
                `${format(new Date(Math.min(...batches.map((b: any) => new Date(b.expiry_date).getTime()))), 'dd/MM/yyyy', { locale: es })} - ${format(new Date(Math.max(...batches.map((b: any) => new Date(b.expiry_date).getTime()))), 'dd/MM/yyyy', { locale: es })}` :
                'N/A'
            }</p>
          </div>
        </Card>
      </CardContent>
    </Card>
  );
};

export default ExpiryReportCard;