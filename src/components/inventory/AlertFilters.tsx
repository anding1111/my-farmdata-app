import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { AlertFilters } from "@/types/inventory";
import { Filter, X } from "lucide-react";

interface AlertFiltersProps {
  filters: AlertFilters;
  onFiltersChange: (filters: AlertFilters) => void;
}

const ALERT_TYPE_OPTIONS = [
  { value: 'low_stock', label: 'Stock Bajo' },
  { value: 'expiry_warning', label: 'Próximo a Vencer' },
  { value: 'expired', label: 'Vencido' },
  { value: 'out_of_stock', label: 'Sin Stock' }
];

const ALERT_PRIORITY_OPTIONS = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' }
];

const AlertFiltersComponent = ({ filters, onFiltersChange }: AlertFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<AlertFilters>(filters);

  const handleFilterChange = (key: keyof AlertFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: AlertFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== undefined && value !== null && value !== ""
  );

  const getActiveFiltersCount = () => {
    return Object.values(localFilters).filter(value => 
      value !== undefined && value !== null && value !== ""
    ).length;
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {hasActiveFilters && (
              <Badge 
                variant="secondary" 
                className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filtros de Alertas</h4>
              {hasActiveFilters && (
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

            {/* Type Filter */}
            <div className="space-y-2">
              <Label>Tipo de Alerta</Label>
              <Select 
                value={localFilters.type || ''} 
                onValueChange={(value) => handleFilterChange('type', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los tipos</SelectItem>
                  {ALERT_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority Filter */}
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select 
                value={localFilters.priority || ''} 
                onValueChange={(value) => handleFilterChange('priority', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las prioridades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las prioridades</SelectItem>
                  {ALERT_PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Read Status Filter */}
            <div className="space-y-2">
              <Label>Estado de Lectura</Label>
              <Select 
                value={localFilters.is_read === undefined ? '' : localFilters.is_read.toString()} 
                onValueChange={(value) => {
                  const boolValue = value === '' ? undefined : value === 'true';
                  handleFilterChange('is_read', boolValue);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las alertas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las alertas</SelectItem>
                  <SelectItem value="false">No leídas</SelectItem>
                  <SelectItem value="true">Leídas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AlertFiltersComponent;