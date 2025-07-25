import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Search, 
  MapPin, 
  Building2, 
  Archive, 
  Package,
  Edit,
  Trash2,
  Eye,
  Filter,
  X
} from "lucide-react";
import { type Location, LOCATION_TYPE_OPTIONS, LOCATION_STATUS_OPTIONS } from "@/types/inventory";
import { useLocations, useDeleteLocation } from "@/hooks/useInventory";
import LocationDialog from "./LocationDialog";
import LocationTreeView from "./LocationTreeView";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const LocationsTab = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtros
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    parent_id: undefined as number | undefined,
  });

  const { data: locationsResponse, isLoading } = useLocations(filters);
  const deleteLocationMutation = useDeleteLocation();
  
  const locations = locationsResponse?.data || [];

  const handleCreateLocation = () => {
    setSelectedLocation(null);
    setIsLocationDialogOpen(true);
  };

  const handleEditLocation = (location: Location) => {
    setSelectedLocation(location);
    setIsLocationDialogOpen(true);
  };

  const handleDeleteLocation = (id: number) => {
    deleteLocationMutation.mutate(id);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      status: 'all',
      parent_id: undefined,
    });
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'pharmacy': return <Building2 className="h-4 w-4" />;
      case 'zone': return <MapPin className="h-4 w-4" />;
      case 'shelf': return <Archive className="h-4 w-4" />;
      case 'compartment': return <Package className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      maintenance: 'destructive'
    } as const;
    
    const labels = {
      active: 'Activo',
      inactive: 'Inactivo', 
      maintenance: 'Mantenimiento'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const renderTableView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Ubicaciones ({locations.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'table' ? 'tree' : 'table')}
            >
              {viewMode === 'table' ? 'Vista Árbol' : 'Vista Tabla'}
            </Button>
            <Button onClick={handleCreateLocation}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Ubicación
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o código..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={filters.type}
                onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {LOCATION_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {LOCATION_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Cargando ubicaciones...</div>
        ) : locations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron ubicaciones
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-mono text-sm">
                    {location.code}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getLocationIcon(location.type)}
                      <div>
                        <div className="font-medium">{location.name}</div>
                        {location.description && (
                          <div className="text-sm text-muted-foreground">
                            {location.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {LOCATION_TYPE_OPTIONS.find(t => t.value === location.type)?.label}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(location.status)}
                  </TableCell>
                  <TableCell>
                    {location.characteristics?.max_capacity ? (
                      <div className="text-sm">
                        <div>{location.current_capacity || 0} / {location.characteristics.max_capacity}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(((location.current_capacity || 0) / location.characteristics.max_capacity) * 100)}% ocupado
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Sin límite</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {location.products_count || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditLocation(location)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={location.products_count! > 0}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar ubicación?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente la ubicación "{location.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteLocation(location.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {viewMode === 'table' ? renderTableView() : (
        <LocationTreeView 
          locations={locations}
          onEditLocation={handleEditLocation}
          onDeleteLocation={handleDeleteLocation}
          onCreateLocation={handleCreateLocation}
        />
      )}

      <LocationDialog
        location={selectedLocation}
        isOpen={isLocationDialogOpen}
        onClose={() => setIsLocationDialogOpen(false)}
        onSuccess={() => setIsLocationDialogOpen(false)}
      />
    </div>
  );
};

export default LocationsTab;