import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts, useSuppliers, useProductReceipt } from "@/hooks/useInventory";
import { ProductReceiptFormData } from "@/types/inventory";
import { CalendarIcon, Package, User, FileText } from "lucide-react";
import ProductSearchInput from "./ProductSearchInput";
import { type Product } from "@/api/inventory";
import { useGenerateReceiptMovement } from "@/hooks/useAutoMovements";

const receiptSchema = z.object({
  product_id: z.number().min(1, "Selecciona un producto"),
  batch_number: z.string().min(1, "El número de lote es requerido"),
  manufacture_date: z.string().min(1, "La fecha de fabricación es requerida"),
  expiry_date: z.string().min(1, "La fecha de vencimiento es requerida"),
  purchase_date: z.string().min(1, "La fecha de compra es requerida"),
  quantity: z.number().min(1, "La cantidad debe ser mayor a 0"),
  purchase_price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  supplier_id: z.number().optional(),
  reference_document: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => {
  const manufactureDate = new Date(data.manufacture_date);
  const expiryDate = new Date(data.expiry_date);
  return manufactureDate < expiryDate;
}, {
  message: "La fecha de fabricación debe ser anterior a la fecha de vencimiento",
  path: ["expiry_date"],
}).refine((data) => {
  const purchaseDate = new Date(data.purchase_date);
  const today = new Date();
  return purchaseDate <= today;
}, {
  message: "La fecha de compra no puede ser futura",
  path: ["purchase_date"],
});

interface ProductReceiptFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductReceiptForm = ({ onSuccess, onCancel }: ProductReceiptFormProps) => {
  const { data: products } = useProducts();
  const { data: suppliers } = useSuppliers();
  const receiptMutation = useProductReceipt();
  const generateReceiptMovement = useGenerateReceiptMovement();

  const form = useForm<ProductReceiptFormData>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      product_id: 0,
      batch_number: "",
      manufacture_date: "",
      expiry_date: "",
      purchase_date: new Date().toISOString().split('T')[0],
      quantity: 1,
      purchase_price: 0,
      supplier_id: undefined,
      reference_document: "",
      notes: "",
    },
  });

  const onSubmit = async (data: ProductReceiptFormData) => {
    try {
      // Procesar la recepción de productos
      await receiptMutation.mutateAsync(data);
      
      // Generar movimiento automático de entrada
      await generateReceiptMovement.mutateAsync({
        product_id: data.product_id,
        quantity: data.quantity,
        unit_cost: data.purchase_price,
        supplier_id: data.supplier_id,
        reference_document: data.reference_document,
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error en recepción de productos:', error);
      // Error handling se maneja en los hooks
    }
  };

  const selectedProduct = products?.data?.find(p => p.id === form.watch("product_id"));

  const handleProductSelect = (product: Product) => {
    if (product.id === 0) {
      // Handle clear/reset
      form.setValue("product_id", 0);
      return;
    }
    form.setValue("product_id", product.id);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información del Producto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" />
                Información del Producto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="product_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Producto *</FormLabel>
                    <FormControl>
                      <ProductSearchInput
                        value={field.value}
                        onSelect={handleProductSelect}
                        placeholder="Buscar producto por nombre o código de barras..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedProduct && (
                <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="font-medium">{selectedProduct.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Stock actual:</span>
                      <span className="ml-2 font-medium">{selectedProduct.current_stock}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Precio venta:</span>
                      <span className="ml-2 font-medium">${selectedProduct.sale_price}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Stock mínimo:</span>
                      <span className="ml-2 font-medium">{selectedProduct.min_stock}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Categoría:</span>
                      <span className="ml-2 font-medium">{selectedProduct.category?.name || 'Sin categoría'}</span>
                    </div>
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="batch_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Lote *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: LT2024001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        placeholder="1"
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
                    <FormLabel>Precio de Compra *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Información de Fechas y Proveedor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarIcon className="h-5 w-5" />
                Fechas y Proveedor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="manufacture_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Fabricación *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiry_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Vencimiento *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchase_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Compra *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proveedor</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar proveedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers?.data?.map((supplier) => (
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
            </CardContent>
          </Card>
        </div>

        {/* Información Adicional */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Información Adicional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="reference_document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento de Referencia</FormLabel>
                  <FormControl>
                    <Input placeholder="Número de factura, guía, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observaciones adicionales sobre el ingreso"
                      className="min-h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={receiptMutation.isPending || generateReceiptMovement.isPending}
          >
            {(receiptMutation.isPending || generateReceiptMovement.isPending) ? "Procesando..." : "Recibir Productos"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductReceiptForm;