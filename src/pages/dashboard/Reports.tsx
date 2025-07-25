
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Package, Users, Building, DollarSign, Pill, RefreshCw, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/layouts/DashboardLayout";
import ReportFilters from "@/components/reports/ReportFilters";
import ReportCharts from "@/components/reports/ReportCharts";
import ReportExport from "@/components/reports/ReportExport";
import { 
  SalesMetrics, 
  InventoryMetrics, 
  ClientMetrics, 
  SupplierMetrics, 
  FinancialMetrics 
} from "@/components/reports/ReportCard";
import { ReportFilter, REPORT_TYPES } from "@/types/reports";
import { reportsApi } from "@/api/reports";

const Reports = () => {
  const [reportType, setReportType] = useState("sales");
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<ReportFilter>({
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    report_type: 'this_month'
  });
  const { toast } = useToast();

  const loadReport = async () => {
    try {
      setIsLoading(true);
      let data;
      
      switch (reportType) {
        case 'sales':
          data = await reportsApi.getSalesReport(filters);
          break;
        case 'inventory':
          data = await reportsApi.getInventoryReport(filters);
          break;
        case 'clients':
          data = await reportsApi.getClientReport(filters);
          break;
        case 'suppliers':
          data = await reportsApi.getSupplierReport(filters);
          break;
        case 'financial':
          data = await reportsApi.getFinancialReport(filters);
          break;
        default:
          throw new Error('Tipo de reporte no válido');
      }
      
      setReportData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al cargar el reporte",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [reportType, filters]);

  const handleFiltersChange = (newFilters: ReportFilter) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      report_type: 'this_month'
    });
  };

  const handleRefresh = () => {
    loadReport();
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'sales':
        return <TrendingUp className="h-5 w-5" />;
      case 'inventory':
        return <Package className="h-5 w-5" />;
      case 'clients':
        return <Users className="h-5 w-5" />;
      case 'suppliers':
        return <Building className="h-5 w-5" />;
      case 'financial':
        return <DollarSign className="h-5 w-5" />;
      case 'products':
        return <Pill className="h-5 w-5" />;
      default:
        return <TrendingUp className="h-5 w-5" />;
    }
  };

  const renderMetrics = () => {
    if (!reportData) return null;

    switch (reportType) {
      case 'sales':
        return <SalesMetrics report={reportData} />;
      case 'inventory':
        return <InventoryMetrics report={reportData} />;
      case 'clients':
        return <ClientMetrics report={reportData} />;
      case 'suppliers':
        return <SupplierMetrics report={reportData} />;
      case 'financial':
        return <FinancialMetrics report={reportData} />;
      default:
        return null;
    }
  };

  const getReportTitle = () => {
    const report = REPORT_TYPES.find(r => r.value === reportType);
    return report ? `Reporte de ${report.label}` : 'Reporte';
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between h-16 p-4 border-b bg-white">
        <h1 className="text-2xl font-semibold">Reportes</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          {reportData && (
            <ReportExport 
              reportType={reportType}
              filters={filters}
              data={reportData}
            />
          )}
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Selector de tipo de reporte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getReportIcon(reportType)}
              Tipos de Reportes
            </CardTitle>
            <CardDescription>
              Selecciona el tipo de reporte que deseas generar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {REPORT_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant={reportType === type.value ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setReportType(type.value)}
                >
                  {getReportIcon(type.value)}
                  <span className="text-sm font-medium">{type.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filtros */}
        <ReportFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          reportType={reportType}
        />

        {/* Contenido del reporte */}
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2">
                <RefreshCw className="h-6 w-6 animate-spin" />
                <span>Generando reporte...</span>
              </div>
            </CardContent>
          </Card>
        ) : reportData ? (
          <div className="space-y-6">
            {/* Header del reporte */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getReportIcon(reportType)}
                      {getReportTitle()}
                    </CardTitle>
                    <CardDescription>
                      Período: {filters.start_date} al {filters.end_date}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {new Date().toLocaleDateString('es-CO')}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Métricas principales */}
            {renderMetrics()}

            {/* Gráficos y visualizaciones */}
            <ReportCharts
              reportType={reportType}
              data={reportData}
              onExport={(chartType) => {
                toast({
                  title: "Exportando gráfico",
                  description: `Exportando ${chartType}...`,
                });
              }}
            />
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Selecciona un tipo de reporte y configura los filtros para comenzar
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
