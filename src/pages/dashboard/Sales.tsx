// FarmaData Sales Module - Shopping Cart and Product Management
import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PurchaseDialog } from "@/components/dashboard/PurchaseDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  MoreVertical, 
  CheckSquare, 
  Grid3X3, 
  List, 
  ArrowUpDown,
  Edit,
  Copy,
  Trash2,
  Heart,
  Home,
  Stethoscope,
  Pill,
  Baby,
  ShoppingCart,
  Receipt,
  X,
  Minus,
  Info
} from "lucide-react";
import { useFarmaData } from "@/hooks/useFarmaData";
import { CreateListDialog } from "@/components/dashboard/CreateListDialog";
import { AddProductDialog } from "@/components/dashboard/AddProductDialog";
import { formatCurrency } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const Sales = () => {
  const {
    products,
    productLists,
    selectedList,
    selectedListId,
    searchQuery,
    viewMode,
    sortBy,
    selectedListProducts,
    setSelectedListId,
    setSearchQuery,
    setViewMode,
    setSortBy,
    createList,
    updateList,
    deleteList,
    duplicateList,
    addProductToList,
    removeProductFromList,
    updateProductQuantity,
    stats,
  } = useFarmaData();
  
  const [catalogMode, setCatalogMode] = useState<'products' | 'lists'>('products');
  const [shoppingCart, setShoppingCart] = useState<Array<{productId: number, product: any, quantity: number, image: string, name: string, price: number}>>([]);
  const [selectedListForView, setSelectedListForView] = useState<number | null>(null);
  const [selectedProductInfo, setSelectedProductInfo] = useState<any>(null);
  
  const { toast, dismiss } = useToast();

  // Iconos para las listas
  const getListIcon = (iconName?: string) => {
    switch (iconName) {
      case 'heart': return Heart;
      case 'home': return Home;
      case 'stethoscope': return Stethoscope;
      case 'pill': return Pill;
      case 'baby': return Baby;
      default: return Heart;
    }
  };

  // Manejadores de eventos
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedListForView(null);
  };

  const handleListSelect = (listId: number) => {
    setSelectedListForView(listId);
    setCatalogMode('products');
    setSearchQuery('');
  };

  const handleDeleteList = (listId: number) => {
    if (productLists.length <= 1) {
      toast({
        title: "No se puede eliminar",
        description: "Debe haber al menos una lista",
        variant: "destructive",
      });
      return;
    }
    
    deleteList(listId);
    toast({
      title: "Lista eliminada",
      description: "La lista ha sido eliminada exitosamente",
    });
  };

  const handleDuplicateList = (listId: number) => {
    duplicateList(listId);
    toast({
      title: "Lista duplicada",
      description: "Se ha creado una copia de la lista",
    });
  };

  const handleAddProduct = (product: any, quantity: number) => {
    dismiss();
    
    const existingItem = shoppingCart.find(item => item.productId === product.id);
    if (existingItem) {
      setShoppingCart(prev => prev.map(item => 
        item.productId === product.id 
          ? {...item, quantity: item.quantity + quantity}
          : item
      ));
    } else {
      setShoppingCart(prev => [...prev, {
        productId: product.id,
        product,
        quantity,
        image: product.image,
        name: product.name,
        price: product.price
      }]);
    }
    
    toast({
      title: "Producto agregado",
      description: `${product.name} agregado al carrito`,
      duration: 2000,
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setShoppingCart(prev => prev.filter(item => item.productId !== productId));
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado del carrito",
    });
  };

  const handleUpdateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setShoppingCart(prev => prev.map(item => 
      item.productId === productId 
        ? {...item, quantity: newQuantity}
        : item
    ));
  };

  const cartTotal = shoppingCart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Filtrar productos según la búsqueda y lista seleccionada
  const filteredProducts = (() => {
    if (selectedListForView) {
      const selectedListData = productLists.find(list => list.id === selectedListForView);
      if (selectedListData) {
        return selectedListData.products.map(listProduct => 
          products.find(product => product.id === listProduct.productId)
        ).filter(Boolean) as typeof products;
      }
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query))
      );
    }
    
    return products;
  })();

  return (
    <DashboardLayout>
      <DashboardHeader title="Sistema de Ventas" />
      <div className="flex h-full overflow-hidden">
        {/* Columna principal unificada - Productos y Listas */}
        <div className="w-2/3 p-6 bg-background border-r overflow-y-auto">
          {/* Header con toggle y búsqueda */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-foreground">
                {catalogMode === 'lists' 
                  ? 'Mis Listas' 
                  : selectedListForView 
                    ? `${productLists.find(list => list.id === selectedListForView)?.name || 'Lista'} - Productos`
                    : 'Catálogo de Productos'
                }
              </h1>
              {/* Toggle muy intuitivo */}
              <div className="flex items-center bg-muted rounded-full p-1">
                <button
                  onClick={() => {
                    setCatalogMode('products');
                    setSelectedListForView(null);
                  }}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    catalogMode === 'products' 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Productos
                </button>
                <button
                  onClick={() => setCatalogMode('lists')}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    catalogMode === 'lists' 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <List className="h-4 w-4 mr-2" />
                  Listas
                </button>
              </div>
            </div>

            {/* Barra de búsqueda mejorada */}
            {catalogMode === 'products' && (
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar productos por nombre o categoría..."
                  className="pl-12 h-12 text-lg border-2 focus:border-primary rounded-xl"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            )}

            {/* Botón para crear nueva lista cuando está en modo listas */}
            {catalogMode === 'lists' && (
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-6 mb-6 flex items-center justify-center bg-primary/5">
                <CreateListDialog onCreateList={createList} />
              </div>
            )}
          </div>

          {/* Vista de Listas */}
          {catalogMode === 'lists' && (
            <div className="grid grid-cols-1 gap-6">
              {productLists.map((list) => {
                const IconComponent = getListIcon(list.icon);
                return (
                  <Card 
                    key={list.id} 
                    className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                      selectedListId === list.id ? 'ring-2 ring-primary shadow-lg border-primary/20' : 'hover:border-primary/20'
                    }`}
                    onClick={() => handleListSelect(list.id)}
                  >
                    <CardHeader className="p-6 pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-semibold">{list.name}</CardTitle>
                            {list.description && (
                              <p className="text-sm text-muted-foreground mt-1">{list.description}</p>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                            }}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateList(list.id);
                            }}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteList(list.id);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {list.products.slice(0, 4).map((product, idx) => (
                            <div key={idx} className="h-12 w-12 rounded-lg bg-muted border-2 border-background overflow-hidden shadow-sm">
                              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                            </div>
                          ))}
                          {list.products.length > 4 && (
                            <div className="h-12 w-12 rounded-lg bg-muted border-2 border-background flex items-center justify-center text-sm font-medium shadow-sm">
                              +{list.products.length - 4}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            {list.products.length} productos
                          </div>
                          <div className="text-lg font-bold text-primary">{formatCurrency(list.total)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Vista de Productos */}
          {catalogMode === 'products' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-lg">No se encontraron productos</p>
                  <p className="text-sm">Intenta con otra búsqueda</p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="group relative overflow-hidden bg-card border rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (!target.closest('[data-info-button]')) {
                        handleAddProduct(product, 1);
                      }
                    }}
                  >
                    {/* Precio en esquina superior izquierda */}
                    <div className="absolute top-3 left-3 z-10 bg-foreground/90 text-background text-sm font-semibold px-2 py-1 rounded-lg">
                      {formatCurrency(product.price)}
                    </div>
                    
                    {/* Indicador de stock animado */}
                    <div className="absolute top-3 right-3 z-10">
                      <div className={`w-4 h-4 rounded-full relative ${
                        product.inStock 
                          ? 'bg-green-500' 
                          : 'bg-destructive'
                      }`}>
                        {product.inStock && (
                          <div className="absolute inset-0 rounded-full bg-green-500 animate-pulse opacity-75"></div>
                        )}
                      </div>
                    </div>

                    {/* Botón de información */}
                    <button
                      data-info-button="true"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedProductInfo(product);
                      }}
                      className="absolute bottom-3 right-3 z-20 w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                    >
                      <Info className="w-4 h-4 text-primary" />
                    </button>

                    {/* Imagen del producto */}
                    <div className="relative h-36 bg-gradient-to-br from-muted/50 via-background to-muted/50 flex items-center justify-center p-4">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-base text-foreground mb-1 line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                        {product.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          product.inStock 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {product.inStock ? 'En stock' : 'Agotado'}
                        </span>
                        <Plus className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>

        {/* Carrito de compras */}
        <div className="w-1/3 p-6 bg-muted/50 overflow-y-auto">
          <div className="sticky top-0 bg-muted/50 pb-4 border-b mb-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" />
              Carrito de compras
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {shoppingCart.length} productos seleccionados
            </p>
          </div>

          {shoppingCart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-2">Tu carrito está vacío</p>
              <p className="text-sm text-muted-foreground">Agrega productos para comenzar</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {shoppingCart.map((item) => (
                  <Card key={item.productId} className="p-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-contain rounded-lg bg-muted/50"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground line-clamp-2 mb-2">
                          {item.name}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
                            {formatCurrency(item.price)}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleUpdateCartQuantity(item.productId, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleUpdateCartQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={() => handleRemoveFromCart(item.productId)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                          Subtotal: {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Resumen del carrito */}
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío:</span>
                    <span className="font-medium">Gratis</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary">{formatCurrency(cartTotal)}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      setShoppingCart([]);
                      toast({
                        title: "Compra procesada",
                        description: "El carrito ha sido procesado exitosamente",
                      });
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Proceder al pago
                  </Button>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Modal de información del producto */}
      {selectedProductInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full max-h-[80vh] overflow-y-auto">
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 h-8 w-8 p-0"
                onClick={() => setSelectedProductInfo(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <img
                  src={selectedProductInfo.image}
                  alt={selectedProductInfo.name}
                  className="w-32 h-32 object-contain mx-auto mb-4"
                />
                <CardTitle className="text-xl">{selectedProductInfo.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Precio</h4>
                <p className="text-2xl font-bold text-primary">{formatCurrency(selectedProductInfo.price)}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Categoría</h4>
                <p className="text-foreground">{selectedProductInfo.category}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Disponibilidad</h4>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  selectedProductInfo.inStock 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {selectedProductInfo.inStock ? 'En stock' : 'Agotado'}
                </span>
              </div>
              {selectedProductInfo.description && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Descripción</h4>
                  <p className="text-sm text-foreground">{selectedProductInfo.description}</p>
                </div>
              )}
              <Button 
                className="w-full" 
                onClick={() => {
                  handleAddProduct(selectedProductInfo, 1);
                  setSelectedProductInfo(null);
                }}
                disabled={!selectedProductInfo.inStock}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar al carrito
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Sales;