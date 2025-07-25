import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Movement, CreateMovementData, UpdateMovementData } from '@/types/inventory';
import { useCreateMovement, useUpdateMovement, useProducts, useLocations } from '@/hooks/useInventory';
import ProductSearchInput from './ProductSearchInput';
import LocationSearchInput from './LocationSearchInput';

const MOVEMENT_TYPE_OPTIONS = [
  { value: 'entry', label: 'Entrada' },
  { value: 'exit', label: 'Salida' },
  { value: 'transfer', label: 'Transferencia' },
  { value: 'adjustment', label: 'Ajuste' }
];

const MOVEMENT_SUBTYPE_OPTIONS = {
  entry: [
    { value: 'purchase', label: 'Compra' },
    { value: 'customer_return', label: 'Devolución de Cliente' },
    { value: 'production', label: 'Producción' },
    { value: 'positive_adjustment', label: 'Ajuste Positivo' }
  ],
  exit: [
    { value: 'sale', label: 'Venta' },
    { value: 'supplier_return', label: 'Devolución a Proveedor' },
    { value: 'loss', label: 'Pérdida' },
    { value: 'damage', label: 'Daño' },
    { value: 'negative_adjustment', label: 'Ajuste Negativo' }
  ],
  transfer: [
    { value: 'location_transfer', label: 'Transferencia Entre Ubicaciones' },
    { value: 'warehouse_transfer', label: 'Transferencia Entre Almacenes' }
  ],
  adjustment: [
    { value: 'positive_adjustment', label: 'Ajuste Positivo' },
    { value: 'negative_adjustment', label: 'Ajuste Negativo' }
  ]
};

const movementSchema = z.object({
  product_id: z.number({ required_error: "El producto es requerido" }),
  type: z.enum(['entry', 'exit', 'transfer', 'adjustment'], {
    required_error: "El tipo de movimiento es requerido"
  }),
  subtype: z.string({ required_error: "El subtipo es requerido" }),
  quantity: z.number({ required_error: "La cantidad es requerida" }).min(1, "La cantidad debe ser mayor a 0"),
  unit_cost: z.number().optional(),
  location_from_id: z.number().optional(),
  location_to_id: z.number().optional(),
  reason: z.string({ required_error: "El motivo es requerido" }).min(1, "El motivo es requerido"),
  reference_document: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => {
  // Validaciones condicionales según el tipo de movimiento
  if (data.type === 'entry' && !data.location_to_id) {
    return false;
  }
  if (data.type === 'exit' && !data.location_from_id) {
    return false;
  }
  if (data.type === 'transfer' && (!data.location_from_id || !data.location_to_id)) {
    return false;
  }
  if (data.type === 'transfer' && data.location_from_id === data.location_to_id) {
    return false;
  }
  return true;
}, {
  message: "Las ubicaciones son requeridas según el tipo de movimiento",
  path: ["location_to_id"]
});

interface MovementFormProps {
  movement?: Movement;
  onSuccess: () => void;
  onCancel: () => void;
}

const MovementForm = ({ movement, onSuccess, onCancel }: MovementFormProps) => {
  const [selectedType, setSelectedType] = useState<string>(movement?.type || '');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedLocationFrom, setSelectedLocationFrom] = useState<any>(null);
  const [selectedLocationTo, setSelectedLocationTo] = useState<any>(null);

  const createMovementMutation = useCreateMovement();
  const updateMovementMutation = useUpdateMovement();
  const { data: products = [] } = useProducts();
  const { data: locations = [] } = useLocations();

  const form = useForm<z.infer<typeof movementSchema>>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      product_id: movement?.product_id || 0,
      type: movement?.type || 'entry',
      subtype: movement?.subtype || '',
      quantity: movement?.quantity || 1,
      unit_cost: movement?.unit_cost || undefined,
      location_from_id: movement?.location_from_id || undefined,
      location_to_id: movement?.location_to_id || undefined,
      reason: movement?.reason || '',
      reference_document: movement?.reference_document || '',
      notes: movement?.notes || '',
    },
  });

  // Efecto para inicializar los datos del movimiento en edición
  useEffect(() => {
    if (movement) {
      setSelectedType(movement.type);
      const product = products.find(p => p.id === movement.product_id);
      if (product) setSelectedProduct(product);
      
      const locationFrom = locations.find(l => l.id === movement.location_from_id);
      if (locationFrom) setSelectedLocationFrom(locationFrom);
      
      const locationTo = locations.find(l => l.id === movement.location_to_id);
      if (locationTo) setSelectedLocationTo(locationTo);
    }
  }, [movement, products, locations]);

  const onSubmit = async (data: z.infer<typeof movementSchema>) => {
    try {
      if (movement) {
        await updateMovementMutation.mutateAsync({
          id: movement.id,
          data: {
            ...data,
            subtype: data.subtype as any
          }
        });
      } else {
        // For create, use the old API endpoint with movement_type
        const createData = {
          product_id: data.product_id,
          movement_type: data.type,
          quantity: data.quantity,
          unit_cost: data.unit_cost,
          reason: data.reason,
          reference_document: data.reference_document,
        };
        await createMovementMutation.mutateAsync(createData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar movimiento:', error);
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    form.setValue('type', type as any);
    form.setValue('subtype', ''); // Reset subtipo al cambiar tipo
  };

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    form.setValue('product_id', product.id);
  };

  const handleLocationFromSelect = (location: any) => {
    setSelectedLocationFrom(location);
    form.setValue('location_from_id', location?.id || undefined);
  };

  const handleLocationToSelect = (location: any) => {
    setSelectedLocationTo(location);
    form.setValue('location_to_id', location?.id || undefined);
  };

  const getSubtypeOptions = () => {
    if (!selectedType) return [];
    return MOVEMENT_SUBTYPE_OPTIONS[selectedType as keyof typeof MOVEMENT_SUBTYPE_OPTIONS] || [];
  };

  const shouldShowLocationFrom = () => {
    return selectedType === 'exit' || selectedType === 'transfer';
  };

  const shouldShowLocationTo = () => {
    return selectedType === 'entry' || selectedType === 'transfer' || selectedType === 'adjustment';
  };

  const shouldShowCost = () => {
    return selectedType === 'entry' || selectedType === 'exit';
  };

  const isLoading = createMovementMutation.isPending || updateMovementMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Producto */}
              <FormField
                control={form.control}
                name="product_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Producto *</FormLabel>
                    <FormControl>
                      <ProductSearchInput
                        value={selectedProduct}
                        onSelect={handleProductSelect}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo de movimiento */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Movimiento *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={handleTypeChange}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MOVEMENT_TYPE_OPTIONS.map((option) => (
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

              {/* Subtipo */}
              <FormField
                control={form.control}
                name="subtype"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtipo *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading || !selectedType}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar subtipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getSubtypeOptions().map((option) => (
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

              {/* Cantidad */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Costo unitario */}
              {shouldShowCost() && (
                <FormField
                  control={form.control}
                  name="unit_cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Costo Unitario</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* Ubicaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Ubicaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Ubicación origen */}
              {shouldShowLocationFrom() && (
                <FormField
                  control={form.control}
                  name="location_from_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación Origen *</FormLabel>
                      <FormControl>
                        <LocationSearchInput
                          value={selectedLocationFrom}
                          onSelect={handleLocationFromSelect}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Ubicación destino */}
              {shouldShowLocationTo() && (
                <FormField
                  control={form.control}
                  name="location_to_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación Destino *</FormLabel>
                      <FormControl>
                        <LocationSearchInput
                          value={selectedLocationTo}
                          onSelect={handleLocationToSelect}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Información adicional */}
        <Card>
          <CardHeader>
            <CardTitle>Información Adicional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Motivo */}
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        placeholder="Describe el motivo del movimiento"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Documento de referencia */}
              <FormField
                control={form.control}
                name="reference_document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento de Referencia</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        placeholder="Número de factura, orden, etc."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notas */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isLoading}
                      placeholder="Información adicional sobre el movimiento"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : movement ? 'Actualizar' : 'Crear'} Movimiento
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MovementForm;