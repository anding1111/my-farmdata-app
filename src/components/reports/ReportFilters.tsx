import { useState } from "react";
import { Calendar, CalendarDays, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReportFilter, PERIOD_OPTIONS } from "@/types/reports";

interface ReportFiltersProps {
  filters: ReportFilter;
  onFiltersChange: (filters: ReportFilter) => void;
  onClearFilters: () => void;
  reportType: string;
}

const ReportFilters = ({ filters, onFiltersChange, onClearFilters, reportType }: ReportFiltersProps) => {
  const [showCustomDates, setShowCustomDates] = useState(false);

  const updateFilter = (key: keyof ReportFilter, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const removeFilter = (key: keyof ReportFilter) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const handlePeriodChange = (period: string) => {
    if (period === 'custom') {
      setShowCustomDates(true);
      updateFilter('report_type', period);
    } else {
      setShowCustomDates(false);
      // Calcular fechas automáticamente según el período
      const dates = calculatePeriodDates(period);
      onFiltersChange({
        ...filters,
        start_date: dates.start,
        end_date: dates.end,
        report_type: period
      });
    }
  };

  const calculatePeriodDates = (period: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (period) {
      case 'today':
        return {
          start: today.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0]
        };
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          start: yesterday.toISOString().split('T')[0],
          end: yesterday.toISOString().split('T')[0]
        };
      case 'this_week':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return {
          start: startOfWeek.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0]
        };
      case 'last_week':
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
        return {
          start: lastWeekStart.toISOString().split('T')[0],
          end: lastWeekEnd.toISOString().split('T')[0]
        };
      case 'this_month':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
          start: startOfMonth.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0]
        };
      case 'last_month':
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        return {
          start: lastMonthStart.toISOString().split('T')[0],
          end: lastMonthEnd.toISOString().split('T')[0]
        };
      default:
        return {
          start: today.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0]
        };
    }
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof ReportFilter] !== undefined && 
    filters[key as keyof ReportFilter] !== null && 
    filters[key as keyof ReportFilter] !== ''
  );

  const getFilterLabel = (key: string, value: any) => {
    switch (key) {
      case 'start_date':
        return `Desde: ${value}`;
      case 'end_date':
        return `Hasta: ${value}`;
      case 'report_type':
        return PERIOD_OPTIONS.find(opt => opt.value === value)?.label || value;
      default:
        return `${key}: ${value}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros del Reporte
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Limpiar filtros
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Período */}
          <div className="space-y-2">
            <Label htmlFor="period">Período</Label>
            <Select
              value={filters.report_type || 'this_month'}
              onValueChange={handlePeriodChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                {PERIOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fechas personalizadas */}
          {(showCustomDates || filters.report_type === 'custom') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="start_date">Fecha Inicio</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="start_date"
                    type="date"
                    value={filters.start_date || ''}
                    onChange={(e) => updateFilter('start_date', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">Fecha Fin</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="end_date"
                    type="date"
                    value={filters.end_date || ''}
                    onChange={(e) => updateFilter('end_date', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </>
          )}

          {/* Filtros específicos por tipo de reporte */}
          {reportType === 'sales' && (
            <div className="space-y-2">
              <Label htmlFor="client_id">Cliente</Label>
              <Select
                value={filters.client_id?.toString() || 'all'}
                onValueChange={(value) => updateFilter('client_id', value === 'all' ? undefined : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los clientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los clientes</SelectItem>
                  <SelectItem value="1">María García López</SelectItem>
                  <SelectItem value="2">Carlos Rodríguez</SelectItem>
                  <SelectItem value="3">Ana Martínez</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {(reportType === 'inventory' || reportType === 'sales') && (
            <div className="space-y-2">
              <Label htmlFor="category_id">Categoría</Label>
              <Select
                value={filters.category_id?.toString() || 'all'}
                onValueChange={(value) => updateFilter('category_id', value === 'all' ? undefined : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="1">Vitaminas</SelectItem>
                  <SelectItem value="2">Articulaciones</SelectItem>
                  <SelectItem value="3">Cardiovascular</SelectItem>
                  <SelectItem value="4">Pediátrico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {(reportType === 'inventory' || reportType === 'suppliers') && (
            <div className="space-y-2">
              <Label htmlFor="supplier_id">Proveedor</Label>
              <Select
                value={filters.supplier_id?.toString() || 'all'}
                onValueChange={(value) => updateFilter('supplier_id', value === 'all' ? undefined : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los proveedores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los proveedores</SelectItem>
                  <SelectItem value="1">Laboratorios ABC</SelectItem>
                  <SelectItem value="2">Distribuidora Norte</SelectItem>
                  <SelectItem value="3">Droguería Central</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {reportType === 'inventory' && (
            <div className="space-y-2">
              <Label htmlFor="location_id">Ubicación</Label>
              <Select
                value={filters.location_id?.toString() || 'all'}
                onValueChange={(value) => updateFilter('location_id', value === 'all' ? undefined : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las ubicaciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las ubicaciones</SelectItem>
                  <SelectItem value="1">Farmacia Principal</SelectItem>
                  <SelectItem value="2">Zona Vitaminas</SelectItem>
                  <SelectItem value="3">Zona Refrigerada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Mostrar filtros activos */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <span className="text-sm font-medium text-muted-foreground">Filtros activos:</span>
            {Object.entries(filters).map(([key, value]) => {
              if (value === undefined || value === null || value === '') return null;
              
              return (
                <Badge key={key} variant="secondary" className="flex items-center gap-1">
                  <span className="text-xs">{getFilterLabel(key, value)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => removeFilter(key as keyof ReportFilter)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportFilters;