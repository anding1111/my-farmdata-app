
// FarmaData Dashboard - Shopping Cart Implementation
import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { PurchaseDialog } from "@/components/dashboard/PurchaseDialog";
import { formatCurrency } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
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
  
  const { toast } = useToast();

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
    // Resetear vista de lista específica al buscar
    setSelectedListForView(null);
  };

  const handleListSelect = (listId: number) => {
    // Al hacer clic en una lista, cambiar a vista de productos y mostrar solo esos productos
    setSelectedListForView(listId);
    setCatalogMode('products');
    setSearchQuery(''); // Limpiar búsqueda para mostrar solo productos de la lista
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
    // Agregar al carrito independiente
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
    // Si hay una lista seleccionada para vista, mostrar solo sus productos
    if (selectedListForView) {
      const selectedListData = productLists.find(list => list.id === selectedListForView);
      if (selectedListData) {
        return selectedListData.products.map(listProduct => 
          products.find(product => product.id === listProduct.productId)
        ).filter(Boolean) as typeof products;
      }
    }
    
    // Si hay búsqueda, filtrar todos los productos
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query))
      );
    }
    
    // Por defecto, mostrar todos los productos
    return products;
  })();

  return (
    <DashboardLayout>
      <div className="flex h-full overflow-hidden">
        {/* Columna principal unificada - Productos y Listas */}
        <div className="w-2/3 p-6 bg-white border-r overflow-y-auto">
          {/* Header con toggle y búsqueda */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {catalogMode === 'lists' 
                  ? 'Mis Listas' 
                  : selectedListForView 
                    ? `${productLists.find(list => list.id === selectedListForView)?.name || 'Lista'} - Productos`
                    : 'Catálogo de Productos'
                }
              </h1>
              {/* Toggle muy intuitivo */}
              <div className="flex items-center bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => {
                    setCatalogMode('products');
                    setSelectedListForView(null); // Resetear vista de lista específica
                  }}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    catalogMode === 'products' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Productos
                </button>
                <button
                  onClick={() => setCatalogMode('lists')}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    catalogMode === 'lists' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900'
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
                  className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
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
              <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 mb-6 flex items-center justify-center bg-blue-50">
                <CreateListDialog onCreateList={createList} />
              </div>
            )}
          </div>

          {/* Vista de Listas con diseño original mejorado */}
          {catalogMode === 'lists' && (
            <div className="grid grid-cols-1 gap-6">
              {productLists.map((list) => {
                const IconComponent = getListIcon(list.icon);
                return (
                  <Card 
                    key={list.id} 
                    className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                      selectedListId === list.id ? 'ring-2 ring-blue-500 shadow-lg border-blue-200' : 'hover:border-blue-200'
                    }`}
                    onClick={() => handleListSelect(list.id)}
                  >
                    <CardHeader className="p-6 pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-${list.color || 'blue'}-100`}>
                            <IconComponent className={`h-5 w-5 text-${list.color || 'blue'}-600`} />
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
                              // TODO: Implementar edición
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
                              className="text-red-600"
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
                            <div key={idx} className="h-12 w-12 rounded-lg bg-slate-200 border-2 border-white overflow-hidden shadow-sm">
                              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                            </div>
                          ))}
                          {list.products.length > 4 && (
                            <div className="h-12 w-12 rounded-lg bg-slate-100 border-2 border-white flex items-center justify-center text-sm font-medium shadow-sm">
                              +{list.products.length - 4}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            {list.products.length} productos
                          </div>
                          <div className="text-lg font-bold text-blue-600">{formatCurrency(list.total)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Vista de Productos optimizada y responsive */}
          {catalogMode === 'products' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-lg">No se encontraron productos</p>
                  <p className="text-sm">Intenta con otra búsqueda</p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white hover:scale-105 animate-fade-in relative overflow-hidden"
                    onClick={(e) => {
                      // No agregar si se hace clic en el botón de información
                      const target = e.target as HTMLElement;
                      if (!target.closest('[data-info-button]')) {
                        handleAddProduct(product, 1);
                      }
                    }}
                  >
                    {/* Botón de información flotante */}
                    <Button
                      variant="ghost"
                      size="sm"
                      data-info-button="true"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProductInfo(product);
                      }}
                      className="absolute top-3 right-3 z-10 h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                    >
                      <Info className="h-4 w-4 text-blue-600" />
                    </Button>
                    
                    {/* Indicador de stock */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                        product.inStock 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.inStock ? 'Disponible' : 'Sin stock'}
                      </span>
                    </div>

                    {/* Fondo degradado suave */}
                    <div className="h-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-50"></div>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300 relative z-10" 
                      />
                    </div>

                    <CardContent className="p-4">
                      <div className="mb-3">
                        <h3 className="font-bold text-base mb-2 text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors">
                          {product.name}
                        </h3>
                        <span className="inline-block text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                          {product.category}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                          {formatCurrency(product.price)}
                        </div>
                        
                        {/* Botón circular de agregar - más sutil */}
                        <div className="w-10 h-10 bg-blue-600 group-hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-110">
                          <Plus className="h-5 w-5 text-white" />
                        </div>
                      </div>

                      {/* Barra de hover para indicar que es clickeable */}
                      <div className="mt-3 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </CardContent>

                    {/* Efecto de brillo al hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 group-hover:translate-x-full animate-pulse"></div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Modal de información del producto */}
          {selectedProductInfo && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 animate-scale-in">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{selectedProductInfo.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProductInfo(null)}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex gap-4 mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                    <img 
                      src={selectedProductInfo.image} 
                      alt={selectedProductInfo.name} 
                      className="w-full h-full object-contain p-2" 
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{formatCurrency(selectedProductInfo.price)}</div>
                    <span className="inline-block text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {selectedProductInfo.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {selectedProductInfo.description && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Descripción</h4>
                      <p className="text-gray-600 text-sm">{selectedProductInfo.description}</p>
                    </div>
                  )}
                  {selectedProductInfo.manufacturer && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Fabricante</h4>
                      <p className="text-gray-600 text-sm">{selectedProductInfo.manufacturer}</p>
                    </div>
                  )}
                  {selectedProductInfo.activeIngredient && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Ingrediente Activo</h4>
                      <p className="text-gray-600 text-sm">{selectedProductInfo.activeIngredient}</p>
                    </div>
                  )}
                  {selectedProductInfo.dosage && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Dosificación</h4>
                      <p className="text-gray-600 text-sm">{selectedProductInfo.dosage}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Disponibilidad</h4>
                    <span className={`inline-block text-sm px-3 py-1 rounded-full ${
                      selectedProductInfo.inStock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedProductInfo.inStock ? 'En stock' : 'Sin stock'}
                    </span>
                  </div>
                  {selectedProductInfo.prescription && (
                    <div>
                      <span className="inline-block text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                        Requiere prescripción médica
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => {
                    handleAddProduct(selectedProductInfo, 1);
                    setSelectedProductInfo(null);
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
                  disabled={!selectedProductInfo.inStock}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar al carrito
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha - Carrito de compras moderno */}
        <div className="w-1/3 bg-gray-50 flex flex-col h-full">
          {/* Header del carrito */}
          <div className="p-6 bg-white border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Mi Carrito</h2>
              <span className="text-sm text-gray-500">
                {shoppingCart.length} {shoppingCart.length === 1 ? 'producto' : 'productos'}
              </span>
            </div>
          </div>

          {/* Lista de productos - Scrolleable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {shoppingCart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-lg font-medium mb-2">Tu carrito está vacío</p>
                <p className="text-sm text-center">Agrega productos desde el catálogo para comenzar</p>
              </div>
            ) : (
              shoppingCart.map((item) => (
                <div key={item.productId} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    {/* Imagen del producto */}
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-contain p-2" 
                      />
                    </div>
                    
                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                        {item.name}
                      </h4>
                      <div className="text-xl font-bold text-gray-900 mb-2">
                        {formatCurrency(item.price)}
                      </div>
                      
                      {/* Controles de cantidad */}
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateCartQuantity(item.productId, item.quantity - 1)}
                          className="h-8 w-8 p-0 rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateCartQuantity(item.productId, item.quantity + 1)}
                          className="h-8 w-8 p-0 rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Botón eliminar */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFromCart(item.productId)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer del carrito - Fijo */}
          {shoppingCart.length > 0 && (
            <div className="bg-white border-t p-6 space-y-4">
              {/* Resumen de precios */}
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-xl text-gray-900">
                    <span>TOTAL</span>
                    <span>{formatCurrency(cartTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Botón de proceder al pago */}
              <Button className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-2xl transition-all duration-200 hover:scale-105">
                Proceder al pago
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
