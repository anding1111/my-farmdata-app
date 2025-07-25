import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronRight, 
  Building2, 
  MapPin, 
  Archive, 
  Package,
  Plus,
  Edit,
  Trash2,
  Thermometer,
  Droplets,
  Shield
} from "lucide-react";
import { type Location } from "@/types/inventory";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface LocationTreeViewProps {
  locations: Location[];
  onEditLocation: (location: Location) => void;
  onDeleteLocation: (id: number) => void;
  onCreateLocation: () => void;
}

interface LocationNodeProps {
  location: Location;
  children: Location[];
  level: number;
  onEditLocation: (location: Location) => void;
  onDeleteLocation: (id: number) => void;
  allLocations: Location[];
}

const LocationNode = ({ 
  location, 
  children, 
  level, 
  onEditLocation, 
  onDeleteLocation,
  allLocations 
}: LocationNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Expandir automáticamente los primeros 2 niveles

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
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'} className="text-xs">
        {status === 'active' ? 'Activo' : status === 'inactive' ? 'Inactivo' : 'Mantenimiento'}
      </Badge>
    );
  };

  const hasCharacteristics = location.characteristics && (
    location.characteristics.temperature_controlled ||
    location.characteristics.humidity_controlled ||
    location.characteristics.requires_security
  );

  return (
    <div className={`ml-${level * 4}`}>
      <div className="flex items-center justify-between p-3 border-l-2 border-muted hover:bg-muted/50 rounded-r-lg group">
        <div className="flex items-center gap-3 flex-1">
          {children.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          
          {children.length === 0 && (
            <div className="w-6" />
          )}

          <div className="flex items-center gap-2">
            {getLocationIcon(location.type)}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium">{location.name}</span>
                <span className="text-xs font-mono text-muted-foreground">
                  {location.code}
                </span>
                {getStatusBadge(location.status)}
              </div>
              {location.description && (
                <span className="text-sm text-muted-foreground">
                  {location.description}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Características especiales */}
            {hasCharacteristics && (
              <div className="flex items-center gap-1">
                {location.characteristics?.temperature_controlled && (
                  <Thermometer className="h-3 w-3 text-blue-500" />
                )}
                {location.characteristics?.humidity_controlled && (
                  <Droplets className="h-3 w-3 text-blue-500" />
                )}
                {location.characteristics?.requires_security && (
                  <Shield className="h-3 w-3 text-orange-500" />
                )}
              </div>
            )}

            {/* Capacidad */}
            {location.characteristics?.max_capacity && (
              <div className="text-xs">
                <Badge variant="outline">
                  {location.current_capacity || 0} / {location.characteristics.max_capacity}
                </Badge>
              </div>
            )}

            {/* Número de productos */}
            {location.products_count !== undefined && (
              <Badge variant="secondary" className="text-xs">
                {location.products_count} productos
              </Badge>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditLocation(location)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={location.products_count! > 0 || children.length > 0}
                className="h-8 w-8 p-0"
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
                  onClick={() => onDeleteLocation(location.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Renderizar hijos si está expandido */}
      {isExpanded && children.length > 0 && (
        <div className="ml-4">
          {children.map((child) => {
            const grandChildren = allLocations.filter(loc => loc.parent_id === child.id);
            return (
              <LocationNode
                key={child.id}
                location={child}
                children={grandChildren}
                level={level + 1}
                onEditLocation={onEditLocation}
                onDeleteLocation={onDeleteLocation}
                allLocations={allLocations}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const LocationTreeView = ({ 
  locations, 
  onEditLocation, 
  onDeleteLocation, 
  onCreateLocation 
}: LocationTreeViewProps) => {
  // Construir el árbol jerárquico
  const rootLocations = locations.filter(loc => !loc.parent_id);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Estructura de Ubicaciones
          </CardTitle>
          <Button onClick={onCreateLocation}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Ubicación
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {rootLocations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay ubicaciones configuradas
          </div>
        ) : (
          <div className="space-y-2">
            {rootLocations.map((rootLocation) => {
              const children = locations.filter(loc => loc.parent_id === rootLocation.id);
              return (
                <LocationNode
                  key={rootLocation.id}
                  location={rootLocation}
                  children={children}
                  level={0}
                  onEditLocation={onEditLocation}
                  onDeleteLocation={onDeleteLocation}
                  allLocations={locations}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationTreeView;