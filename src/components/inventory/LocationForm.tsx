import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Settings, 
  Thermometer, 
  Droplets, 
  Shield, 
  Package,
  Shuffle
} from "lucide-react";
import { type Location, type LocationFormData, LOCATION_TYPE_OPTIONS, LOCATION_STATUS_OPTIONS } from "@/types/inventory";
import { useCreateLocation, useUpdateLocation, useLocations } from "@/hooks/useInventory";

const locationFormSchema = z.object({
  code: z.string().min(1, "El código es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  type: z.enum(['pharmacy', 'zone', 'shelf', 'compartment']),
  parent_id: z.number().optional(),
  status: z.enum(['active', 'inactive', 'maintenance']),
  // Características
  temperature_controlled: z.boolean().optional(),
  humidity_controlled: z.boolean().optional(),
  requires_security: z.boolean().optional(),
  max_capacity: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  depth: z.number().optional(),
});

interface LocationFormProps {
  location?: Location | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const LocationForm = ({ location, onSuccess, onCancel }: LocationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: locationsResponse } = useLocations();
  const locations = locationsResponse?.data || [];
  
  const createLocationMutation = useCreateLocation();
  const updateLocationMutation = useUpdateLocation();

  const form = useForm<LocationFormData & {
    temperature_controlled?: boolean;
    humidity_controlled?: boolean;
    requires_security?: boolean;
    max_capacity?: number;
    width?: number;
    height?: number;
    depth?: number;
  }>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      type: 'shelf',
      status: 'active',
      temperature_controlled: false,
      humidity_controlled: false,
      requires_security: false,
    },
  });

  // Poblar formulario si es edición
  useEffect(() => {
    if (location) {
      form.reset({
        code: location.code,
        name: location.name,
        description: location.description || '',
        type: location.type,
        parent_id: location.parent_id,
        status: location.status,
        temperature_controlled: location.characteristics?.temperature_controlled || false,
        humidity_controlled: location.characteristics?.humidity_controlled || false,
        requires_security: location.characteristics?.requires_security || false,
        max_capacity: location.characteristics?.max_capacity,
        width: location.characteristics?.dimensions?.width,
        height: location.characteristics?.dimensions?.height,
        depth: location.characteristics?.dimensions?.depth,
      });
    }
  }, [location, form]);

  const generateCode = () => {
    const type = form.getValues('type');
    const typePrefix = {
      pharmacy: 'FARM',
      zone: 'ZONA',
      shelf: 'EST',
      compartment: 'COMP'
    }[type];

    const existingCodes = locations
      .filter(l => l.code.startsWith(typePrefix))
      .map(l => l.code)
      .sort();

    let nextNumber = 1;
    for (const code of existingCodes) {
      const numberPart = parseInt(code.replace(typePrefix, ''));
      if (numberPart >= nextNumber) {
        nextNumber = numberPart + 1;
      }
    }

    const newCode = `${typePrefix}${nextNumber.toString().padStart(2, '0')}`;
    form.setValue('code', newCode);
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const locationData: Omit<Location, 'id' | 'created_at' | 'updated_at' | 'current_capacity' | 'products_count'> = {
        code: data.code,
        name: data.name,
        description: data.description,
        type: data.type,
        parent_id: data.parent_id,
        status: data.status,
        characteristics: {
          temperature_controlled: data.temperature_controlled,
          humidity_controlled: data.humidity_controlled,
          requires_security: data.requires_security,
          max_capacity: data.max_capacity,
          dimensions: (data.width || data.height || data.depth) ? {
            width: data.width,
            height: data.height,
            depth: data.depth,
          } : undefined,
        },
      };

      if (location) {
        await updateLocationMutation.mutateAsync({ id: location.id, data: locationData });
      } else {
        await createLocationMutation.mutateAsync(locationData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error al guardar ubicación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar ubicaciones padre basado en el tipo seleccionado
  const getAvailableParents = () => {
    const currentType = form.watch('type');
    const hierarchy = {
      pharmacy: [],
      zone: ['pharmacy'],
      shelf: ['pharmacy', 'zone'],
      compartment: ['pharmacy', 'zone', 'shelf']
    };

    const allowedParentTypes = hierarchy[currentType] || [];
    return locations.filter(loc => 
      allowedParentTypes.includes(loc.type) && 
      loc.id !== location?.id // No puede ser padre de sí mismo
    );
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Información Básica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Ubicación</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione el tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LOCATION_TYPE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parent_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación Padre</FormLabel>
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione ubicación padre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Sin ubicación padre</SelectItem>
                          {getAvailableParents().map((parent) => (
                            <SelectItem key={parent.id} value={parent.id.toString()}>
                              {parent.name} ({parent.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input {...field} placeholder="Ej: EST01" />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generateCode}
                          disabled={!form.watch('type')}
                        >
                          <Shuffle className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione el estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LOCATION_STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: Estante A1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Descripción opcional de la ubicación" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Características */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Características
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="temperature_controlled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Thermometer className="h-4 w-4" />
                          Control de Temperatura
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Requiere refrigeración o temperatura controlada
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="humidity_controlled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Droplets className="h-4 w-4" />
                          Control de Humedad
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Requiere control de humedad ambiente
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requires_security"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Seguridad Especial
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Requiere medidas de seguridad adicionales
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="max_capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Capacidad Máxima
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          placeholder="Número máximo de productos"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base">Dimensiones (cm)</Label>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ancho</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="cm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alto</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="cm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="depth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profundidad</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="cm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : location ? 'Actualizar' : 'Crear'} Ubicación
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LocationForm;