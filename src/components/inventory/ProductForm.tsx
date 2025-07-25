import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCreateProduct, useUpdateProduct, useCategories, useLaboratories } from "@/hooks/useInventory";
import { type Product } from "@/api/inventory";
import { PRODUCT_STATUS_OPTIONS, PRESENTATION_OPTIONS } from "@/types/inventory";

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductForm = ({ product, onSuccess, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    code: '',
    barcode: '',
    name: '',
    description: '',
    category_id: '',
    laboratory_id: '',
    active_ingredient: '',
    concentration: '',
    presentation: '',
    purchase_price: '',
    sale_price: '',
    min_stock: '',
    max_stock: '',
    location: '',
    requires_prescription: false,
    status: 'active' as 'active' | 'inactive' | 'discontinued',
  });

  const { data: categoriesData } = useCategories();
  const { data: laboratoriesData } = useLaboratories();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const categories = categoriesData?.data || [];
  const laboratories = laboratoriesData?.data || [];
  const isEditing = !!product;
  const isLoading = createProductMutation.isPending || updateProductMutation.isPending;

  useEffect(() => {
    if (product) {
      setFormData({
        code: product.code,
        barcode: product.barcode || '',
        name: product.name,
        description: product.description || '',
        category_id: product.category_id.toString(),
        laboratory_id: product.laboratory_id?.toString() || '',
        active_ingredient: product.active_ingredient || '',
        concentration: product.concentration || '',
        presentation: product.presentation || '',
        purchase_price: product.purchase_price.toString(),
        sale_price: product.sale_price.toString(),
        min_stock: product.min_stock.toString(),
        max_stock: product.max_stock.toString(),
        location: product.location || '',
        requires_prescription: product.requires_prescription,
        status: product.status,
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        code: formData.code,
        barcode: formData.barcode || undefined,
        name: formData.name,
        description: formData.description || undefined,
        category_id: parseInt(formData.category_id),
        laboratory_id: formData.laboratory_id ? parseInt(formData.laboratory_id) : undefined,
        active_ingredient: formData.active_ingredient || undefined,
        concentration: formData.concentration || undefined,
        presentation: formData.presentation || undefined,
        purchase_price: parseFloat(formData.purchase_price),
        sale_price: parseFloat(formData.sale_price),
        min_stock: parseInt(formData.min_stock),
        max_stock: parseInt(formData.max_stock),
        location: formData.location || undefined,
        requires_prescription: formData.requires_prescription,
        status: formData.status,
      };

      if (isEditing && product) {
        await updateProductMutation.mutateAsync({
          id: product.id,
          data: productData,
        });
      } else {
        await createProductMutation.mutateAsync(productData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const generateCode = () => {
    const code = 'PROD' + Date.now().toString().slice(-6);
    setFormData(prev => ({ ...prev, code }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información básica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código del Producto *</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="PROD001"
                  required
                />
                <Button type="button" variant="outline" onClick={generateCode}>
                  Generar
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcode">Código de Barras</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                placeholder="7702001234567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Producto *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Paracetamol 500mg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descripción detallada del producto..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Clasificación */}
      <Card>
        <CardHeader>
          <CardTitle>Clasificación y Laboratorio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="laboratory">Laboratorio</Label>
              <Select value={formData.laboratory_id} onValueChange={(value) => setFormData(prev => ({ ...prev, laboratory_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar laboratorio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin laboratorio</SelectItem>
                  {laboratories.map((laboratory) => (
                    <SelectItem key={laboratory.id} value={laboratory.id.toString()}>
                      {laboratory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información farmacéutica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Farmacéutica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="active_ingredient">Principio Activo</Label>
              <Input
                id="active_ingredient"
                value={formData.active_ingredient}
                onChange={(e) => setFormData(prev => ({ ...prev, active_ingredient: e.target.value }))}
                placeholder="Paracetamol"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="concentration">Concentración</Label>
              <Input
                id="concentration"
                value={formData.concentration}
                onChange={(e) => setFormData(prev => ({ ...prev, concentration: e.target.value }))}
                placeholder="500mg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="presentation">Presentación</Label>
              <Select value={formData.presentation} onValueChange={(value) => setFormData(prev => ({ ...prev, presentation: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar presentación" />
                </SelectTrigger>
                <SelectContent>
                  {PRESENTATION_OPTIONS.map((presentation) => (
                    <SelectItem key={presentation} value={presentation}>
                      {presentation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="requires_prescription"
              checked={formData.requires_prescription}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requires_prescription: checked }))}
            />
            <Label htmlFor="requires_prescription">Requiere prescripción médica</Label>
          </div>
        </CardContent>
      </Card>

      {/* Precios e inventario */}
      <Card>
        <CardHeader>
          <CardTitle>Precios e Inventario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchase_price">Precio de Compra *</Label>
              <Input
                id="purchase_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.purchase_price}
                onChange={(e) => setFormData(prev => ({ ...prev, purchase_price: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sale_price">Precio de Venta *</Label>
              <Input
                id="sale_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.sale_price}
                onChange={(e) => setFormData(prev => ({ ...prev, sale_price: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_stock">Stock Mínimo *</Label>
              <Input
                id="min_stock"
                type="number"
                min="0"
                value={formData.min_stock}
                onChange={(e) => setFormData(prev => ({ ...prev, min_stock: e.target.value }))}
                placeholder="10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_stock">Stock Máximo *</Label>
              <Input
                id="max_stock"
                type="number"
                min="0"
                value={formData.max_stock}
                onChange={(e) => setFormData(prev => ({ ...prev, max_stock: e.target.value }))}
                placeholder="100"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Estante A-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado */}
      <Card>
        <CardHeader>
          <CardTitle>Estado del Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="status">Estado *</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'} Producto
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;