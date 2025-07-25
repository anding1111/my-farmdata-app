import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import { SupplierFilters as SupplierFiltersType, TAX_TYPE_OPTIONS, SUPPLIER_STATUS_OPTIONS, SUPPLIER_CATEGORIES, COLOMBIA_DEPARTMENTS, RATING_OPTIONS } from "@/types/suppliers";

interface SupplierFiltersProps {
  filters: SupplierFiltersType;
  onFiltersChange: (filters: SupplierFiltersType) => void;
  onClearFilters: () => void;
}

const SupplierFilters = ({ filters, onFiltersChange, onClearFilters }: SupplierFiltersProps) => {
  const updateFilter = (key: keyof SupplierFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const removeFilter = (key: keyof SupplierFiltersType) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof SupplierFiltersType] !== undefined && 
    filters[key as keyof SupplierFiltersType] !== null && 
    filters[key as keyof SupplierFiltersType] !== ''
  );

  const getFilterLabel = (key: string, value: any) => {
    switch (key) {
      case 'tax_type':
        return TAX_TYPE_OPTIONS.find(opt => opt.value === value)?.label || value;
      case 'status':
        return SUPPLIER_STATUS_OPTIONS.find(opt => opt.value === value)?.label || value;
      case 'rating':
        return RATING_OPTIONS.find(opt => opt.value === value)?.label || value;
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
            placeholder="Nombre, código, contacto..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo Tributario</label>
          <Select
            value={filters.tax_type || 'all'}
            onValueChange={(value) => updateFilter('tax_type', value === 'all' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {TAX_TYPE_OPTIONS.map((option) => (
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
            value={filters.department || 'all'}
            onValueChange={(value) => updateFilter('department', value === 'all' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los departamentos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los departamentos</SelectItem>
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
            value={filters.status || 'all'}
            onValueChange={(value) => updateFilter('status', value === 'all' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {SUPPLIER_STATUS_OPTIONS.map((option) => (
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
          <label className="text-sm font-medium">Categoría</label>
          <Select
            value={filters.supplier_category || 'all'}
            onValueChange={(value) => updateFilter('supplier_category', value === 'all' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {SUPPLIER_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Calificación</label>
          <Select
            value={filters.rating?.toString() || 'all'}
            onValueChange={(value) => updateFilter('rating', value === 'all' ? undefined : parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas las calificaciones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las calificaciones</SelectItem>
              {RATING_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
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
                   key === 'tax_type' ? 'Tipo trib.' :
                   key === 'department' ? 'Depto.' :
                   key === 'status' ? 'Estado' :
                   key === 'city' ? 'Ciudad' :
                   key === 'supplier_category' ? 'Categoría' :
                   key === 'rating' ? 'Calificación' : key}:
                </span>
                <span className="font-medium">{getFilterLabel(key, value)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => removeFilter(key as keyof SupplierFiltersType)}
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

export default SupplierFilters;