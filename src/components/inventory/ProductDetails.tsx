import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { type Product } from "@/api/inventory";
import { Package, Edit, MapPin, Calendar, DollarSign } from "lucide-react";

interface ProductDetailsProps {
  product: Product;
  onEdit: () => void;
  onClose: () => void;
}

const ProductDetails = ({ product, onEdit, onClose }: ProductDetailsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStockStatus = () => {
    if (product.current_stock === 0) return { label: "Sin Stock", variant: "destructive" as const };
    if (product.current_stock <= product.min_stock) return { label: "Stock Bajo", variant: "secondary" as const };
    return { label: "Normal", variant: "default" as const };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold">{product.name}</h3>
          <p className="text-gray-600 mt-1">Código: {product.code}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información básica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Nombre</label>
              <p className="font-medium">{product.name}</p>
            </div>
            {product.description && (
              <div>
                <label className="text-sm font-medium text-gray-500">Descripción</label>
                <p>{product.description}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">Estado</label>
              <div className="mt-1">
                <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                  {product.status === 'active' ? 'Activo' : 
                   product.status === 'inactive' ? 'Inactivo' : 'Descontinuado'}
                </Badge>
              </div>
            </div>
            {product.location && (
              <div>
                <label className="text-sm font-medium text-gray-500">Ubicación</label>
                <p className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {product.location}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock e inventario */}
        <Card>
          <CardHeader>
            <CardTitle>Stock e Inventario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Stock Actual</label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold">{product.current_stock}</span>
                <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Stock Mínimo</label>
                <p className="font-medium">{product.min_stock}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Stock Máximo</label>
                <p className="font-medium">{product.max_stock}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información farmacéutica */}
        {(product.active_ingredient || product.concentration || product.presentation) && (
          <Card>
            <CardHeader>
              <CardTitle>Información Farmacéutica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {product.active_ingredient && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Principio Activo</label>
                  <p className="font-medium">{product.active_ingredient}</p>
                </div>
              )}
              {product.concentration && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Concentración</label>
                  <p className="font-medium">{product.concentration}</p>
                </div>
              )}
              {product.presentation && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Presentación</label>
                  <p className="font-medium">{product.presentation}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Prescripción</label>
                <Badge variant={product.requires_prescription ? "destructive" : "default"}>
                  {product.requires_prescription ? 'Requiere receta' : 'Venta libre'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Precios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Precios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Precio de Compra</label>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(product.purchase_price)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Precio de Venta</label>
              <p className="text-lg font-bold text-blue-600">
                {formatCurrency(product.sale_price)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Margen</label>
              <p className="font-medium">
                {((product.sale_price - product.purchase_price) / product.purchase_price * 100).toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fechas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Información de Registro
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha de Creación</label>
            <p>{new Date(product.created_at).toLocaleDateString('es-CO')}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Última Actualización</label>
            <p>{new Date(product.updated_at).toLocaleDateString('es-CO')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetails;