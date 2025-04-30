
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Dashboard = () => {
  // Datos de ejemplo para simular contenido
  const products = [
    {
      id: 1,
      name: "Inflavin",
      price: 34000,
      image: "https://via.placeholder.com/100x100/FF8C00/FFFFFF?text=Inflavin"
    },
    {
      id: 2,
      name: "Jointum (gotas)",
      price: 8000,
      image: "https://via.placeholder.com/100x100/654321/FFFFFF?text=Jointum"
    },
    {
      id: 3,
      name: "Jointum (tabletas)",
      price: 8000,
      image: "https://via.placeholder.com/100x100/A9A9A9/FFFFFF?text=Jointum"
    },
    {
      id: 4,
      name: "Veno Protect",
      price: 15000,
      image: "https://via.placeholder.com/100x100/FF6347/FFFFFF?text=Veno"
    }
  ];

  const productLists = [
    { name: "Mis vitaminas", total: 123000 },
    { name: "Para padres", total: 34000 },
    { name: "Vacaciones", total: 12000 },
    { name: "Medicinas para niños", total: 87000 },
  ];
  
  // Función para formatear moneda colombiana (COP)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <DashboardLayout>
      <DashboardHeader title="Mi Inventario" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Listas de productos</h2>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" /> Nueva lista
              </Button>
            </div>
            
            {productLists.map((list) => (
              <Card key={list.name} className="mb-4">
                <CardHeader className="py-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{list.name}</CardTitle>
                  <div className="text-sm font-medium">{formatCurrency(list.total)}</div>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="flex space-x-2 items-center">
                    <div className="flex -space-x-2">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-10 w-10 rounded-md bg-slate-200 border border-white"></div>
                      ))}
                    </div>
                    <div className="ml-2 text-sm text-muted-foreground">+ más</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="w-full h-40 overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-medium text-lg">{product.name}</h3>
                <div className="mt-2 font-semibold">{formatCurrency(product.price)}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="md:col-span-2 flex justify-between items-center px-4 py-3 bg-white rounded-lg border">
          <div className="text-lg font-medium">Total</div>
          <div className="text-xl font-semibold">{formatCurrency(123000)}</div>
        </div>
        
        <div className="md:col-span-2">
          <Button className="w-full py-6 text-lg" size="lg">
            Comprar ahora
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
