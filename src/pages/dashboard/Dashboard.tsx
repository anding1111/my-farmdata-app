
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
  Baby
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
    if (!selectedList) return;
    addProductToList(selectedList.id, product, quantity);
  };

  const handleRemoveProduct = (productId: number) => {
    if (!selectedList) return;
    removeProductFromList(selectedList.id, productId);
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado de la lista",
    });
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (!selectedList) return;
    updateProductQuantity(selectedList.id, productId, newQuantity);
  };

  return (
    <DashboardLayout>
      <div className="flex h-full overflow-hidden">
        {/* Columna izquierda - Listas de medicamentos */}
        <div className="w-1/2 p-4 bg-white border-r overflow-y-auto">
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

        {/* Columna derecha - Vista detallada */}
        <div className="w-1/2 p-4 overflow-y-auto">
          {selectedList && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <h2 className="text-2xl font-semibold">{selectedList.name}</h2>
                  <span className="ml-2 text-2xl text-gray-400">{selectedList.products.length}</span>
                </div>
                <div className="flex gap-2">
                  <AddProductDialog onAddProduct={handleAddProduct} availableProducts={products} />
                  <div className="flex gap-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className={`grid ${viewMode === "grid" ? "grid-cols-2" : "grid-cols-1"} gap-4 mb-4`}>
                {selectedListProducts.map((item) => (
                  <Card key={item.productId} className={`overflow-hidden ${viewMode === "list" ? "flex" : ""}`}>
                    <div className={`${viewMode === "list" ? "w-1/3" : "w-full h-40"} bg-gray-100 flex items-center justify-center`}>
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                    </div>
                    <CardContent className={`p-4 ${viewMode === "list" ? "w-2/3" : ""}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-lg">{item.name}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProduct(item.productId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="font-semibold text-blue-600">{formatCurrency(item.price)}</div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-auto pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg">Total</div>
                  <div className="text-xl font-semibold">{formatCurrency(selectedList.total)}</div>
                </div>
                
                <PurchaseDialog list={selectedList}>
                  <Button className="w-full py-6 text-lg bg-slate-800 hover:bg-slate-700">
                    Comprar ahora
                  </Button>
                </PurchaseDialog>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
