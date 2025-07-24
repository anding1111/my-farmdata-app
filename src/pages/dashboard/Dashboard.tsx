
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
  Minus
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
  };

  const handleListSelect = (listId: number) => {
    setSelectedListId(listId);
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

  return (
    <DashboardLayout>
      <div className="flex h-full overflow-hidden">
        {/* Columna izquierda - Productos disponibles y listas */}
        <div className="w-1/3 p-4 bg-white border-r overflow-y-auto">
          <div className="mb-4 flex items-center">
            <div className="relative flex-1 mr-2">
              <Input
                type="text"
                placeholder="Buscar listas o productos..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <svg
                className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>

          <div className="border border-dashed border-blue-300 rounded-md p-4 mb-4 flex items-center justify-center">
            <CreateListDialog onCreateList={createList} />
          </div>

          <div className="space-y-4">
            {productLists.map((list) => {
              const IconComponent = getListIcon(list.icon);
              return (
                <Card 
                  key={list.id} 
                  className={`overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                    selectedListId === list.id ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                  onClick={() => handleListSelect(list.id)}
                >
                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-md bg-${list.color || 'blue'}-100`}>
                          <IconComponent className={`h-4 w-4 text-${list.color || 'blue'}-600`} />
                        </div>
                        <CardTitle className="text-lg">{list.name}</CardTitle>
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
                    {list.description && (
                      <p className="text-sm text-muted-foreground mt-1">{list.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-2">
                        {list.products.slice(0, 4).map((product, idx) => (
                          <div key={idx} className="h-10 w-10 rounded-md bg-slate-200 border-2 border-white overflow-hidden">
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          </div>
                        ))}
                        {list.products.length > 4 && (
                          <div className="h-10 w-10 rounded-md bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-medium">
                            +{list.products.length - 4}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {list.products.length} productos
                        </div>
                        <div className="font-medium">{formatCurrency(list.total)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Columna central - Catálogo de productos */}
        <div className="w-1/3 p-4 bg-slate-50 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              {catalogMode === 'lists' ? 'Listas' : 'Productos'}
            </h2>
            <div className="flex gap-2">
              <Button
                variant={catalogMode === "lists" ? "default" : "outline"}
                size="sm"
                onClick={() => setCatalogMode("lists")}
              >
                <List className="h-4 w-4 mr-1" />
                Listas
              </Button>
              <Button
                variant={catalogMode === "products" ? "default" : "outline"}
                size="sm"
                onClick={() => setCatalogMode("products")}
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Productos
              </Button>
            </div>
          </div>

          {/* Vista de Listas */}
          {catalogMode === 'lists' && (
            <div className="grid grid-cols-1 gap-4">
              {productLists.map((list) => {
                const IconComponent = getListIcon(list.icon);
                return (
                  <Card 
                    key={list.id} 
                    className={`group hover:shadow-md transition-all cursor-pointer border-2 hover:border-blue-200 ${
                      selectedListId === list.id ? 'ring-2 ring-primary shadow-lg border-blue-400' : ''
                    }`}
                    onClick={() => handleListSelect(list.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-md bg-${list.color || 'blue'}-100`}>
                          <IconComponent className={`h-6 w-6 text-${list.color || 'blue'}-600`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{list.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {list.description || `${list.products.length} productos`}
                          </p>
                          <div className="font-medium text-blue-600">
                            {formatCurrency(list.total)}
                          </div>
                        </div>
                        <div className="text-2xl text-blue-600 group-hover:translate-x-1 transition-transform">
                          →
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
            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-md transition-all cursor-pointer">
                  <div className="h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform" 
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-blue-600">{formatCurrency(product.price)}</div>
                      <Button
                        size="sm"
                        onClick={() => handleAddProduct(product, 1)}
                        className="h-8"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Columna derecha - Carrito de compras independiente */}
        <div className="w-1/3 p-4 bg-white border-l overflow-y-auto">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Carrito de Compras</h2>
          </div>

          {/* Lista de productos en el carrito */}
          <div className="space-y-3 mb-6">
            {shoppingCart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Tu carrito está vacío</p>
                <p className="text-sm">Agrega productos desde el catálogo</p>
              </div>
            ) : (
              shoppingCart.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-semibold text-blue-600">
                        {formatCurrency(item.price)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateCartQuantity(item.productId, item.quantity - 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateCartQuantity(item.productId, item.quantity + 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFromCart(item.productId)}
                    className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Resumen y total */}
          {shoppingCart.length > 0 && (
            <>
              <div className="border-t pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({shoppingCart.length} productos)</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-blue-600">{formatCurrency(cartTotal)}</span>
                </div>
              </div>

              <Button className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Proceder al pago
              </Button>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
