
import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, CheckSquare } from "lucide-react";
import { Input } from "@/components/ui/input";

const Dashboard = () => {
  // Estado para la búsqueda y el modo de vista
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedList, setSelectedList] = useState("Mis vitaminas");
  
  // Datos de ejemplo para simular contenido
  const products = [
    {
      id: 1,
      name: "Inflavin",
      price: 34000,
      image: "https://via.placeholder.com/150x150/FF8C00/FFFFFF?text=Inflavin"
    },
    {
      id: 2,
      name: "Jointum (gotas)",
      price: 8000,
      image: "https://via.placeholder.com/150x150/654321/FFFFFF?text=Jointum"
    },
    {
      id: 3,
      name: "Jointum (tabletas)",
      price: 8000,
      image: "https://via.placeholder.com/150x150/A9A9A9/FFFFFF?text=Jointum"
    },
    {
      id: 4,
      name: "Veno Protect",
      price: 15000,
      image: "https://via.placeholder.com/150x150/FF6347/FFFFFF?text=Veno"
    }
  ];

  const productLists = [
    { 
      id: 1,
      name: "Mis vitaminas", 
      total: 123000,
      products: [
        {image: "https://via.placeholder.com/50x50/00AA55/FFFFFF?text=V1"},
        {image: "https://via.placeholder.com/50x50/0055AA/FFFFFF?text=V2"},
        {image: "https://via.placeholder.com/50x50/AA0055/FFFFFF?text=V3"},
        {image: "https://via.placeholder.com/50x50/55AA00/FFFFFF?text=V4"},
      ],
      moreCount: 2
    },
    { 
      id: 2,
      name: "Para padres", 
      total: 34000,
      products: [
        {image: "https://via.placeholder.com/50x50/AACC00/FFFFFF?text=P1"},
        {image: "https://via.placeholder.com/50x50/00CCAA/FFFFFF?text=P2"},
        {image: "https://via.placeholder.com/50x50/CC00AA/FFFFFF?text=P3"},
      ],
      moreCount: 0
    },
    { 
      id: 3,
      name: "Vacaciones", 
      total: 12000,
      products: [
        {image: "https://via.placeholder.com/50x50/FFA500/FFFFFF?text=V1"},
        {image: "https://via.placeholder.com/50x50/FF4500/FFFFFF?text=V2"},
      ],
      moreCount: 0
    },
    { 
      id: 4,
      name: "Medicinas para niños", 
      total: 87000,
      products: [
        {image: "https://via.placeholder.com/50x50/4169E1/FFFFFF?text=N1"},
        {image: "https://via.placeholder.com/50x50/6A5ACD/FFFFFF?text=N2"},
        {image: "https://via.placeholder.com/50x50/9370DB/FFFFFF?text=N3"},
        {image: "https://via.placeholder.com/50x50/8A2BE2/FFFFFF?text=N4"},
      ],
      moreCount: 5
    },
  ];
  
  // Filtrar productos según la búsqueda
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtrar listas según la búsqueda
  const filteredLists = productLists.filter(list => 
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Función para formatear moneda colombiana (COP)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Obtener la lista seleccionada
  const getSelectedListTotal = () => {
    const list = productLists.find(list => list.name === selectedList);
    return list ? list.total : 0;
  };

  // Manejadores de eventos
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleListSelect = (listName: string) => {
    setSelectedList(listName);
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
                placeholder="Buscar en archivos..."
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
            <div className="flex">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="mr-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </Button>
            </div>
          </div>

          <div className="border border-dashed border-blue-300 rounded-md p-4 mb-4 flex items-center justify-center">
            <Button variant="ghost" className="text-blue-500 flex items-center">
              <Plus className="h-5 w-5 mr-2" /> Añadir nueva lista
            </Button>
          </div>

          <div className="space-y-4">
            {filteredLists.map((list) => (
              <Card 
                key={list.id} 
                className={`overflow-hidden cursor-pointer transition-all ${selectedList === list.name ? 'ring-2 ring-primary' : ''}`}
                onClick={() => handleListSelect(list.name)}
              >
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{list.name}</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {list.products.map((product, idx) => (
                        <div key={idx} className="h-10 w-10 rounded-md bg-slate-200 border border-white overflow-hidden">
                          <img src={product.image} alt="" className="h-full w-full object-cover" />
                        </div>
                      ))}
                      {list.moreCount > 0 && (
                        <div className="h-10 w-10 rounded-md bg-slate-100 border border-white flex items-center justify-center text-xs font-medium">
                          +{list.moreCount}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Total</div>
                      <div className="font-medium">{formatCurrency(list.total)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Columna derecha - Vista detallada */}
        <div className="w-1/2 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h2 className="text-2xl font-semibold">{selectedList}</h2>
              <span className="ml-2 text-2xl text-gray-400">6</span>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mb-4 flex items-center">
            <Button variant="outline" size="sm" className="flex items-center mr-2">
              <CheckSquare className="h-4 w-4 mr-1" />
            </Button>
          </div>

          <div className={`grid ${viewMode === "grid" ? "grid-cols-2" : "grid-cols-1"} gap-4 mb-4`}>
            {filteredProducts.map((product) => (
              <Card key={product.id} className={`overflow-hidden ${viewMode === "list" ? "flex" : ""}`}>
                <div className={`${viewMode === "list" ? "w-1/3" : "w-full h-40"} bg-gray-100 flex items-center justify-center`}>
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
                </div>
                <CardContent className={`p-4 ${viewMode === "list" ? "w-2/3" : ""}`}>
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <div className="mt-2 font-semibold text-blue-600">{formatCurrency(product.price)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-auto pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg">Total</div>
              <div className="text-xl font-semibold">{formatCurrency(getSelectedListTotal())}</div>
            </div>
            
            <Button className="w-full py-6 text-lg bg-slate-800 hover:bg-slate-700">
              Comprar ahora
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
