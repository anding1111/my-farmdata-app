import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDataStructures } from "@/hooks/useDataStructures";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  Package,
  AlertTriangle,
  MoreHorizontal,
  QrCode,
  Eye
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePureInventory } from '@/hooks/usePureInventory';
import { useToast } from '@/hooks/use-toast';
import ProductForm from "./ProductForm";
import ProductDetails from "./ProductDetails";
import { type Product } from "@/api/inventory";

const ProductsTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [showLowStock, setShowLowStock] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const inventory = usePureInventory();
  const { toast } = useToast();
  
  const products = inventory.products;
  const categories = inventory.categories;
  const laboratories = inventory.laboratories;
  const isLoading = false;

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const result = inventory.deleteProduct(productId);
      if (result.success) {
        toast({
          title: "Producto eliminado",
          description: "El producto ha sido removido del AVL Tree."
        });
      }
    }
  };

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const getStockStatus = (product: any) => {
    const currentStock = product.current_stock || product.stock || 0;
    const minStock = product.min_stock || product.minStock || 0;
    
    if (currentStock === 0) {
      return { label: "Sin Stock", variant: "destructive" as const, icon: AlertTriangle };
    }
    if (currentStock <= minStock) {
      return { label: "Stock Bajo", variant: "secondary" as const, icon: AlertTriangle };
    }
    return { label: "Normal", variant: "default" as const, icon: Package };
  };

  const getCategoryName = (categoryId: number | string) => {
    const category = categories.find(cat => cat.id === Number(categoryId));
    return category?.name || 'Sin categoría';
  };

  const getLaboratoryName = (laboratoryId?: number | string) => {
    if (!laboratoryId) return 'Sin laboratorio';
    const laboratory = laboratories.find(lab => lab.id === Number(laboratoryId));
    return laboratory?.name || 'Sin laboratorio';
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedStatus("");
    setShowLowStock(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos del Inventario
            </CardTitle>
            <CardDescription>
              Gestiona todos los productos de tu farmacia
            </CardDescription>
          </div>
          <Button onClick={() => {
            setSelectedProduct(null);
            setShowProductForm(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="inactive">Inactivo</SelectItem>
              <SelectItem value="discontinued">Descontinuado</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={showLowStock ? "default" : "outline"}
            onClick={() => setShowLowStock(!showLowStock)}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Stock Bajo
          </Button>

          <Button variant="ghost" onClick={clearFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Laboratorio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Precio Venta</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: any) => {
                  const stockStatus = getStockStatus(product);
                  const StatusIcon = stockStatus.icon;
                  
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono text-sm">
                        {product.code || `P${product.id}`}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          {(product.active_ingredient || product.activeIngredient) && (
                            <div className="text-sm text-gray-500">
                              {product.active_ingredient || product.activeIngredient} {product.concentration}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryName(product.category_id || product.category)}</TableCell>
                      <TableCell>{getLaboratoryName(product.laboratory_id || product.laboratory)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon className="h-4 w-4" />
                          <span className="font-medium">{product.current_stock || product.stock || 0}</span>
                          <Badge variant={stockStatus.variant} className="text-xs">
                            {stockStatus.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        ${((product.sale_price || product.price) || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                          {product.status === 'active' ? 'Activo' : 
                           product.status === 'inactive' ? 'Inactivo' : 'Descontinuado'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(product)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(product)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Información de AVL Tree */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-medium mb-2">Información del AVL Tree:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Total productos:</strong> {products.length} nodos
                </div>
                <div>
                  <strong>Estructura:</strong> Árbol AVL balanceado
                </div>
                <div>
                  <strong>Complejidad búsqueda:</strong> O(log n)
                </div>
                <div>
                  <strong>Auto-balanceado:</strong> Sí
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>

      {/* Diálogos */}
      <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct 
                ? 'Modifica la información del producto'
                : 'Ingresa la información del nuevo producto'
              }
            </DialogDescription>
          </DialogHeader>
        <ProductForm
          product={selectedProduct}
          onSuccess={(productData?: any) => {
            // Si se está creando un producto nuevo, agregarlo al AVL Tree
            if (!selectedProduct && productData) {
              const result = inventory.createProduct(productData);
              toast({
                title: "Producto creado",
                description: `${result.data.name} ha sido agregado al inventario AVL Tree.`
              });
            } else if (selectedProduct && productData) {
              // Si se está editando, actualizar en AVL Tree
              const result = inventory.updateProduct(selectedProduct.id, productData);
              toast({
                title: "Producto actualizado",
                description: `${result.data.name} ha sido actualizado en el AVL Tree.`
              });
            }
            
            setShowProductForm(false);
            setSelectedProduct(null);
          }}
          onCancel={() => {
            setShowProductForm(false);
            setSelectedProduct(null);
          }}
        />
        </DialogContent>
      </Dialog>

      <Dialog open={showProductDetails} onOpenChange={setShowProductDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Producto</DialogTitle>
            <DialogDescription>
              Información completa del producto
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <ProductDetails
              product={selectedProduct}
              onEdit={() => {
                setShowProductDetails(false);
                setShowProductForm(true);
              }}
              onClose={() => {
                setShowProductDetails(false);
                setSelectedProduct(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProductsTab;