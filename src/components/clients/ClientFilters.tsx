import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import { ClientFilters as ClientFiltersType, DOCUMENT_TYPE_OPTIONS, CLIENT_STATUS_OPTIONS, COLOMBIA_DEPARTMENTS } from "@/types/clients";

interface ClientFiltersProps {
  filters: ClientFiltersType;
  onFiltersChange: (filters: ClientFiltersType) => void;
  onClearFilters: () => void;
}

const ClientFilters = ({ filters, onFiltersChange, onClearFilters }: ClientFiltersProps) => {
  const updateFilter = (key: keyof ClientFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const removeFilter = (key: keyof ClientFiltersType) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof ClientFiltersType] !== undefined && 
    filters[key as keyof ClientFiltersType] !== null && 
    filters[key as keyof ClientFiltersType] !== ''
  );

  const getFilterLabel = (key: string, value: any) => {
    switch (key) {
      case 'document_type':
        return DOCUMENT_TYPE_OPTIONS.find(opt => opt.value === value)?.label || value;
      case 'status':
        return CLIENT_STATUS_OPTIONS.find(opt => opt.value === value)?.label || value;
      case 'has_insurance':
        return value === true ? 'Con seguro' : 'Sin seguro';
      default:
        return value;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filtros</span>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Buscar</label>
          <Input
            placeholder="Nombre, código, documento..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Documento</label>
          <Select
            value={filters.document_type || ''}
            onValueChange={(value) => updateFilter('document_type', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los tipos</SelectItem>
              {DOCUMENT_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Departamento</label>
          <Select
            value={filters.department || ''}
            onValueChange={(value) => updateFilter('department', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los departamentos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los departamentos</SelectItem>
              {COLOMBIA_DEPARTMENTS.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Estado</label>
          <Select
            value={filters.status || ''}
            onValueChange={(value) => updateFilter('status', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los estados</SelectItem>
              {CLIENT_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Ciudad</label>
          <Input
            placeholder="Ciudad"
            value={filters.city || ''}
            onChange={(e) => updateFilter('city', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Seguro Médico</label>
          <Select
            value={filters.has_insurance?.toString() || ''}
            onValueChange={(value) => updateFilter('has_insurance', value === '' ? undefined : value === 'true')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="true">Con seguro</SelectItem>
              <SelectItem value="false">Sin seguro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mostrar filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (value === undefined || value === null || value === '') return null;
            
            return (
              <Badge key={key} variant="secondary" className="flex items-center gap-1">
                <span className="text-xs">
                  {key === 'search' ? 'Búsqueda' : 
                   key === 'document_type' ? 'Tipo doc.' :
                   key === 'department' ? 'Depto.' :
                   key === 'status' ? 'Estado' :
                   key === 'city' ? 'Ciudad' :
                   key === 'has_insurance' ? 'Seguro' : key}:
                </span>
                <span className="font-medium">{getFilterLabel(key, value)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => removeFilter(key as keyof ClientFiltersType)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientFilters;