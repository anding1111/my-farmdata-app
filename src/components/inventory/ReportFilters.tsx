import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

export interface ReportFilters {
  dateRange?: {
    from: Date;
    to: Date;
  };
  category_id?: number;
  laboratory_id?: number;
  location_id?: number;
  supplier_id?: number;
  reportType?: string;
}

interface ReportFiltersProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  categories?: any[];
  laboratories?: any[];
  locations?: any[];
  suppliers?: any[];
  availableReportTypes?: { value: string; label: string }[];
}

const ReportFiltersComponent = ({ 
  filters, 
  onFiltersChange,
  categories = [],
  laboratories = [],
  locations = [],
  suppliers = [],
  availableReportTypes = []
}: ReportFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<ReportFilters>(filters);

  const handleFilterChange = (key: keyof ReportFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: ReportFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = () => {
    return Object.entries(localFilters).some(([key, value]) => {
      if (key === 'dateRange') {
        return value && (value as any).from && (value as any).to;
      }
      return value !== undefined && value !== null && value !== "";
    });
  };

  const getActiveFiltersCount = () => {
    return Object.entries(localFilters).filter(([key, value]) => {
      if (key === 'dateRange') {
        return value && (value as any).from && (value as any).to;
      }
      return value !== undefined && value !== null && value !== "";
    }).length;
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {hasActiveFilters() && (
              <Badge 
                variant="secondary" 
                className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filtros de Reporte</h4>
              {hasActiveFilters() && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="h-8 px-2"
                >
                  <X className="h-3 w-3 mr-1" />
                  Limpiar
                </Button>
              )}
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <Label>Rango de Fechas</Label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !localFilters.dateRange?.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localFilters.dateRange?.from ? (
                        format(localFilters.dateRange.from, "dd/MM/yyyy", { locale: es })
                      ) : (
                        "Desde"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={localFilters.dateRange?.from}
                      onSelect={(date) => {
                        if (date) {
                          handleFilterChange('dateRange', {
                            ...localFilters.dateRange,
                            from: date
                          });
                        }
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !localFilters.dateRange?.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localFilters.dateRange?.to ? (
                        format(localFilters.dateRange.to, "dd/MM/yyyy", { locale: es })
                      ) : (
                        "Hasta"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={localFilters.dateRange?.to}
                      onSelect={(date) => {
                        if (date) {
                          handleFilterChange('dateRange', {
                            ...localFilters.dateRange,
                            to: date
                          });
                        }
                      }}
                      disabled={(date) =>
                        date > new Date() || 
                        date < new Date("1900-01-01") ||
                        (localFilters.dateRange?.from && date < localFilters.dateRange.from)
                      }
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Report Type Filter */}
            {availableReportTypes.length > 0 && (
              <div className="space-y-2">
                <Label>Tipo de Reporte</Label>
                <Select 
                  value={localFilters.reportType || ''} 
                  onValueChange={(value) => handleFilterChange('reportType', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los tipos</SelectItem>
                    {availableReportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select 
                  value={localFilters.category_id?.toString() || ''} 
                  onValueChange={(value) => handleFilterChange('category_id', value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Laboratory Filter */}
            {laboratories.length > 0 && (
              <div className="space-y-2">
                <Label>Laboratorio</Label>
                <Select 
                  value={localFilters.laboratory_id?.toString() || ''} 
                  onValueChange={(value) => handleFilterChange('laboratory_id', value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los laboratorios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los laboratorios</SelectItem>
                    {laboratories.map((lab) => (
                      <SelectItem key={lab.id} value={lab.id.toString()}>
                        {lab.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Location Filter */}
            {locations.length > 0 && (
              <div className="space-y-2">
                <Label>Ubicación</Label>
                <Select 
                  value={localFilters.location_id?.toString() || ''} 
                  onValueChange={(value) => handleFilterChange('location_id', value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las ubicaciones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las ubicaciones</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id.toString()}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Supplier Filter */}
            {suppliers.length > 0 && (
              <div className="space-y-2">
                <Label>Proveedor</Label>
                <Select 
                  value={localFilters.supplier_id?.toString() || ''} 
                  onValueChange={(value) => handleFilterChange('supplier_id', value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los proveedores" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los proveedores</SelectItem>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id.toString()}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ReportFiltersComponent;