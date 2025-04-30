
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Dashboard = () => {
  // Datos de ejemplo para simular contenido similar a la imagen
  const products = [
    {
      id: 1,
      name: "Inflavin",
      price: 34.00,
      image: "https://via.placeholder.com/100x100/FF8C00/FFFFFF?text=Inflavin"
    },
    {
      id: 2,
      name: "Jointum (drops)",
      price: 8.00,
      image: "https://via.placeholder.com/100x100/654321/FFFFFF?text=Jointum"
    },
    {
      id: 3,
      name: "Jointum (tablets)",
      price: 8.00,
      image: "https://via.placeholder.com/100x100/A9A9A9/FFFFFF?text=Jointum"
    },
    {
      id: 4,
      name: "Veno Protect",
      price: 15.00,
      image: "https://via.placeholder.com/100x100/FF6347/FFFFFF?text=Veno"
    }
  ];

  const productLists = [
    { name: "My vitamins", total: 123.00 },
    { name: "For parents", total: 34.00 },
    { name: "Vacation", total: 12.00 },
    { name: "Children's medicines", total: 87.00 },
  ];

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
                  <div className="text-sm font-medium">${list.total.toFixed(2)}</div>
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
                <div className="mt-2 font-semibold">${product.price.toFixed(2)}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="md:col-span-2 flex justify-between items-center px-4 py-3 bg-white rounded-lg border">
          <div className="text-lg font-medium">Total</div>
          <div className="text-xl font-semibold">$123.00</div>
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
