import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, 
  MapPin, 
  Building2, 
  Archive, 
  Package,
  ChevronDown,
  X,
  Thermometer,
  Droplets,
  Shield
} from "lucide-react";
import { type Location } from "@/types/inventory";
import { useSearchLocations } from "@/hooks/useInventory";
import { cn } from "@/lib/utils";

interface LocationSearchInputProps {
  value?: number;
  onSelect: (location: Location) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  selectedLocation?: Location;
}

const LocationSearchInput = ({
  value,
  onSelect,
  placeholder = "Buscar ubicación...",
  className,
  disabled,
  selectedLocation
}: LocationSearchInputProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { searchQuery, setSearchQuery, searchResults, isSearching } = useSearchLocations();

  // Sincronizar con el valor externo
  useEffect(() => {
    if (selectedLocation) {
      setInputValue(selectedLocation.name);
    } else if (!value) {
      setInputValue("");
    }
  }, [selectedLocation, value]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setSearchQuery(value);
    if (value.length >= 2) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleSelectLocation = (location: Location) => {
    setInputValue(location.name);
    setOpen(false);
    onSelect(location);
    inputRef.current?.blur();
  };

  const clearSelection = () => {
    setInputValue("");
    setSearchQuery("");
    setOpen(false);
    // Llamar onSelect con un objeto "vacío" para indicar que se limpió la selección
    onSelect({ id: 0 } as Location);
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

  const getLocationPath = (location: Location) => {
    // En una implementación real, construirías la ruta completa
    // Por ahora, usamos el código y tipo como referencia
    return `${location.code} (${getTypeLabel(location.type)})`;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      pharmacy: 'Farmacia',
      zone: 'Zona',
      shelf: 'Estante',
      compartment: 'Compartimiento'
    };
    return labels[type as keyof typeof labels] || type;
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

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className="pr-20"
            />
            <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
              {inputValue && !disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="h-6 w-6 p-0 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[400px] p-0" 
          align="start"
          side="bottom"
        >
          <Command shouldFilter={false}>
            <CommandList>
              {isSearching && (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  Buscando ubicaciones...
                </div>
              )}
              
              {!isSearching && searchResults.length === 0 && searchQuery && (
                <CommandEmpty>
                  No se encontraron ubicaciones que coincidan con "{searchQuery}"
                </CommandEmpty>
              )}
              
              {!isSearching && searchResults.length === 0 && !searchQuery && (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  Escriba al menos 2 caracteres para buscar ubicaciones
                </div>
              )}

              {searchResults.length > 0 && (
                <CommandGroup heading={`${searchResults.length} ubicaciones encontradas`}>
                  {searchResults.map((location) => (
                    <CommandItem
                      key={location.id}
                      value={location.id.toString()}
                      onSelect={() => handleSelectLocation(location)}
                      className="flex items-center justify-between p-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {getLocationIcon(location.type)}
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{location.name}</span>
                            {getStatusBadge(location.status)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{getLocationPath(location)}</span>
                            {location.characteristics && (
                              <div className="flex items-center gap-1">
                                {location.characteristics.temperature_controlled && (
                                  <Thermometer className="h-3 w-3 text-blue-500" />
                                )}
                                {location.characteristics.humidity_controlled && (
                                  <Droplets className="h-3 w-3 text-blue-500" />
                                )}
                                {location.characteristics.requires_security && (
                                  <Shield className="h-3 w-3 text-orange-500" />
                                )}
                              </div>
                            )}
                          </div>
                          {location.description && (
                            <span className="text-xs text-muted-foreground">
                              {location.description}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {location.characteristics?.max_capacity && (
                          <Badge variant="outline" className="text-xs">
                            {location.current_capacity || 0}/{location.characteristics.max_capacity}
                          </Badge>
                        )}
                        {location.products_count !== undefined && (
                          <Badge variant="secondary" className="text-xs">
                            {location.products_count}
                          </Badge>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LocationSearchInput;