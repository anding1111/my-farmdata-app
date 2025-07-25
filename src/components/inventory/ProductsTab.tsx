import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { useProducts, useCategories, useLaboratories, useDeleteProduct } from "@/hooks/useInventory";
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

  const { data: productsData, isLoading } = useProducts({
    page: currentPage,
    per_page: itemsPerPage,
    search: searchQuery || undefined,
    category_id: selectedCategory ? parseInt(selectedCategory) : undefined,
    status: selectedStatus || undefined,
    low_stock: showLowStock || undefined,
  });

  const { data: categoriesData } = useCategories();
  const { data: laboratoriesData } = useLaboratories();
  const deleteProductMutation = useDeleteProduct();

  const products = productsData?.data || [];
  const totalPages = Math.ceil((productsData?.total || 0) / itemsPerPage);
  const categories = categoriesData?.data || [];
  const laboratories = laboratoriesData?.data || [];

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      await deleteProductMutation.mutateAsync(productId);
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const getStockStatus = (product: Product) => {
    if (product.current_stock === 0) {
      return { label: "Sin Stock", variant: "destructive" as const, icon: AlertTriangle };
    }
    if (product.current_stock <= product.min_stock) {
      return { label: "Stock Bajo", variant: "secondary" as const, icon: AlertTriangle };
    }
    return { label: "Normal", variant: "default" as const, icon: Package };
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Sin categoría';
  };

  const getLaboratoryName = (laboratoryId?: number) => {
    if (!laboratoryId) return 'Sin laboratorio';
    const laboratory = laboratories.find(lab => lab.id === laboratoryId);
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
                {products.map((product: Product) => {
                  const stockStatus = getStockStatus(product);
                  const StatusIcon = stockStatus.icon;
                  
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono text-sm">
                        {product.code}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          {product.active_ingredient && (
                            <div className="text-sm text-gray-500">
                              {product.active_ingredient} {product.concentration}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryName(product.category_id)}</TableCell>
                      <TableCell>{getLaboratoryName(product.laboratory_id)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon className="h-4 w-4" />
                          <span className="font-medium">{product.current_stock}</span>
                          <Badge variant={stockStatus.variant} className="text-xs">
                            {stockStatus.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        ${product.sale_price.toLocaleString()}
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

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-700">
                  Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, productsData?.total || 0)} de {productsData?.total || 0} productos
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
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
            onSuccess={() => {
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