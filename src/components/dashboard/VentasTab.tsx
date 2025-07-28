import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, Search, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { usePureInventory } from "@/hooks/usePureInventory";
import { useToast } from "@/hooks/use-toast";

export function VentasTab() {
  const inventory = usePureInventory();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  const sales = inventory.sales;

  // Agregar venta de ejemplo
  const agregarVenta = () => {
    const productos = ['Paracetamol 500mg', 'Ibuprofeno 400mg', 'Amoxicilina 875mg', 'Vitamina C', 'Aspirina 100mg'];
    const clientes = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Luis Rodríguez'];
    
    const producto = productos[Math.floor(Math.random() * productos.length)];
    const cliente = clientes[Math.floor(Math.random() * clientes.length)];
    const cantidad = Math.floor(Math.random() * 5) + 1;
    const precio = Math.random() * 50 + 5;
    const total = precio * cantidad;
    
    const nuevaVenta = {
      product: producto,
      customer: cliente,
      quantity: cantidad,
      price: precio,
      total: total
    };
    
    try {
      const result = inventory.createSale(nuevaVenta);
      toast({
        title: "Venta registrada",
        description: `Venta de ${producto} agregada al historial (LinkedList).`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar la venta.",
        variant: "destructive"
      });
    }
  };

  // Eliminar venta
  const eliminarVenta = (saleId: number) => {
    try {
      const result = inventory.deleteSale(saleId);
      if (result.success) {
        toast({
          title: "Venta eliminada",
          description: "La venta ha sido removida del historial (LinkedList)."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la venta.",
        variant: "destructive"
      });
    }
  };

  // Buscar venta
  const buscarVenta = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Ingrese un término de búsqueda",
        variant: "destructive"
      });
      return;
    }

    const found = sales.find(sale => 
      (sale.product && sale.product.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sale.customer && sale.customer.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (found) {
      toast({
        title: "Venta encontrada",
        description: `Se encontró: ${found.product} - ${found.customer}`
      });
    } else {
      toast({
        title: "Sin resultados",
        description: "No se encontró ninguna venta con esos criterios",
        variant: "default"
      });
    }
  };

  // Limpiar historial
  const limpiarHistorial = () => {
    if (confirm("¿Está seguro de limpiar todo el historial?")) {
      try {
        inventory.clearSalesHistory();
        toast({
          title: "Historial limpiado",
          description: "Todas las ventas han sido removidas del LinkedList."
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo limpiar el historial.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Historial de Ventas (LinkedList)
              </CardTitle>
              <CardDescription>
                Registro de ventas usando lista enlazada - {sales.length} ventas registradas
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={agregarVenta} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Simular Venta
              </Button>
              <Button onClick={limpiarHistorial} variant="destructive">
                Limpiar Historial
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Buscador */}
          <div className="flex gap-2 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar por producto o cliente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && buscarVenta()}
              />
            </div>
            <Button onClick={buscarVenta} variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Buscar en Lista
            </Button>
          </div>

          {/* Tabla de ventas */}
          {sales.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No hay ventas registradas
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale, index) => (
                  <TableRow key={sale.id} className={index === 0 ? 'bg-green-50 dark:bg-green-950' : ''}>
                    <TableCell>{sale.id}</TableCell>
                    <TableCell className="font-medium">{sale.product || sale.productName}</TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>${sale.total.toLocaleString()}</TableCell>
                    <TableCell>
                      {new Date(sale.date).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      <Button 
                        onClick={() => eliminarVenta(sale.id)} 
                        variant="destructive" 
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Información de la estructura */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h4 className="font-medium mb-2">Información de la LinkedList:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Tamaño:</strong> {sales.length} nodos
              </div>
              <div>
                <strong>Último agregado:</strong> {sales[0]?.product || 'Ninguno'}
              </div>
              <div>
                <strong>Orden:</strong> Más recientes primero (LIFO)
              </div>
              <div>
                <strong>Estructura:</strong> Lista enlazada simple
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}