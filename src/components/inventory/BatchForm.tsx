import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { type Batch, type Product } from "@/api/inventory";
import { useSuppliers } from "@/hooks/useInventory";
import ProductSearchInput from "./ProductSearchInput";

const batchSchema = z.object({
  product_id: z.number().min(1, "Debe seleccionar un producto"),
  batch_number: z.string().min(1, "El número de lote es requerido"),
  quantity: z.number().min(1, "La cantidad debe ser mayor a 0"),
  manufacture_date: z.string().min(1, "La fecha de fabricación es requerida"),
  expiry_date: z.string().min(1, "La fecha de vencimiento es requerida"),
  purchase_date: z.string().min(1, "La fecha de compra es requerida"),
  purchase_price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  supplier_id: z.number().optional(),
  status: z.enum(["active", "expired", "recalled"]),
});

type BatchFormData = z.infer<typeof batchSchema>;

interface BatchFormProps {
  batch?: Batch;
  onSubmit: (data: BatchFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const BatchForm = ({ batch, onSubmit, onCancel, isLoading }: BatchFormProps) => {
  const { data: suppliersResponse } = useSuppliers();
  
  const suppliers = suppliersResponse?.data || [];

  const form = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      product_id: batch?.product_id || 0,
      batch_number: batch?.batch_number || "",
      quantity: batch?.quantity || 0,
      manufacture_date: batch?.manufacture_date || "",
      expiry_date: batch?.expiry_date || "",
      purchase_date: batch?.purchase_date || "",
      purchase_price: batch?.purchase_price || 0,
      supplier_id: batch?.supplier_id,
      status: batch?.status || "active",
    },
  });

  const handleSubmit = (data: BatchFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="product_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Producto</FormLabel>
              <FormControl>
                <ProductSearchInput
                  value={field.value}
                  onSelect={(product: Product) => {
                    field.onChange(product.id);
                  }}
                  placeholder="Buscar producto por nombre o código de barras..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="batch_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Lote</FormLabel>
              <FormControl>
                <Input placeholder="Ej: LOT001-2024" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purchase_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio de Compra</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="manufacture_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Fabricación</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "dd/MM/yyyy", { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiry_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Vencimiento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "dd/MM/yyyy", { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purchase_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Compra</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "dd/MM/yyyy", { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="supplier_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proveedor</FormLabel>
              <Select
                value={field.value?.toString() || "none"}
                onValueChange={(value) => field.onChange(value === "none" ? undefined : parseInt(value))}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un proveedor (opcional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Sin proveedor</SelectItem>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
                      {supplier.name}
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="expired">Vencido</SelectItem>
                  <SelectItem value="recalled">Retirado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : batch ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BatchForm;