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
      id: Date.now() + Math.random(), // ID único
      product: producto,
      productName: producto, // Para compatibilidad
      customer: cliente,
      quantity: cantidad,
      price: precio,
      total: total,
      date: new Date().toISOString() // Fecha válida en formato ISO
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
                      {new Date(sale.date).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
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

          {/* Visualización de la LinkedList */}
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <h4 className="font-medium mb-3">Visualización de la Lista Enlazada:</h4>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline">Size: {sales.length}</Badge>
              <Badge variant="secondary">Head: {sales[0]?.product || 'null'}</Badge>
            </div>
            
            {/* Elementos de la lista */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sales.slice(0, 5).map((sale, index) => (
                <div key={sale.id} className="flex items-center gap-2">
                  <div className={`px-3 py-2 rounded text-xs ${
                    index === 0 
                      ? 'bg-green-600 text-white' 
                      : 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                  }`}>
                    <div className="font-medium">Venta #{sale.id}</div>
                    <div className="text-xs">{sale.product || sale.productName}</div>
                    <div className="text-xs">{sale.customer} - ${sale.total}</div>
                  </div>
                  {index < Math.min(sales.length - 1, 4) && (
                    <div className="text-green-400">↓</div>
                  )}
                </div>
              ))}
              {sales.length > 5 && (
                <div className="text-sm text-green-600 dark:text-green-400 text-center">
                  ... y {sales.length - 5} ventas más
                </div>
              )}
            </div>

            {/* Detalles de nodos y punteros */}
            <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border">
              <h5 className="text-sm font-medium mb-2">Nodos y Punteros:</h5>
              <div className="space-y-1 text-xs font-mono max-h-32 overflow-y-auto">
                {sales.map((sale, index) => (
                  <div key={sale.id} className="flex justify-between">
                    <span>[{index}] Data: {JSON.stringify({id: sale.id, product: sale.product || sale.productName, customer: sale.customer})}</span>
                    <span>→ Next: {index < sales.length - 1 ? `[${index + 1}]` : 'null'}</span>
                  </div>
                ))}
                {sales.length === 0 && (
                  <div className="text-muted-foreground">Lista vacía</div>
                )}
              </div>
            </div>
          </div>

          {/* Información de la estructura */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
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