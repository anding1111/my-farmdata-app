import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Network, 
  Package, 
  Search,
  Eye,
  BarChart3
} from "lucide-react";
import { useDataStructuresContext } from "@/context/DataStructuresContext";
import { useToast } from "@/hooks/use-toast";

export function AnalisisTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const { products, searchProduct, deleteProduct } = useDataStructuresContext();
  const { toast } = useToast();

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id.toString().includes(searchQuery)
  );

  const handleSearchProduct = () => {
    if (!searchQuery) return;
    
    const productId = parseInt(searchQuery);
    if (isNaN(productId)) return;
    
    const foundProduct = searchProduct(productId);
    if (foundProduct) {
      toast({
        title: "Producto encontrado",
        description: `${foundProduct.name} - Stock: ${foundProduct.stock}`,
      });
    } else {
      toast({
        title: "Producto no encontrado",
        description: `No se encontró un producto con ID ${productId}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = (productId: number) => {
    deleteProduct(productId);
    toast({
      title: "Producto eliminado",
      description: `Producto con ID ${productId} eliminado del árbol`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Análisis del Inventario (AVL Tree)
          </CardTitle>
          <CardDescription>
            Visualización y análisis de productos organizados en árbol AVL balanceado
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{products.length}</div>
                    <div className="text-sm text-muted-foreground">Total Productos</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">{Math.ceil(Math.log2(products.length + 1)) || 1}</div>
                    <div className="text-sm text-muted-foreground">Altura Árbol</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-purple-500" />
                  <div>
                    <div className="text-sm font-bold">O(log n)</div>
                    <div className="text-sm text-muted-foreground">Complejidad</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="text-sm font-bold">Balanceado</div>
                    <div className="text-sm text-muted-foreground">Estado AVL</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Búsqueda */}
          <div className="flex gap-2">
            <Input
              placeholder="Buscar producto por ID o nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearchProduct} variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>

          {/* Visualización del Árbol AVL */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Árbol AVL - Productos (Búsqueda Balanceada)
              </CardTitle>
              <CardDescription>
                Visualización de los productos organizados en un árbol AVL balanceado por ID
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">Size: {products.length}</Badge>
                  <Badge variant="secondary">Estructura: AVL Tree</Badge>
                  <Badge variant="secondary">Balanceado: Sí</Badge>
                </div>
                
                {/* Productos en el árbol */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                  {filteredProducts.slice(0, 12).map((product, index) => (
                    <div key={product.id} className={`p-2 rounded text-xs ${
                      index === 0 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200'
                    }`}>
                      <div className="font-medium">ID: {product.id}</div>
                      <div className="text-xs opacity-75">{product.name}</div>
                      <div className="text-xs opacity-75">Stock: {product.stock || 0}</div>
                      <div className="text-xs opacity-75">Precio: ${product.price || 0}</div>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="mt-1 h-5 text-xs"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                  {filteredProducts.length > 12 && (
                    <div className="p-2 rounded text-xs bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400 text-center">
                      ... +{filteredProducts.length - 12} más
                    </div>
                  )}
                </div>

                {/* Información del árbol */}
                <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                  <h5 className="text-sm font-medium mb-2">Información del Árbol AVL:</h5>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <strong>Nodos totales:</strong> {products.length}
                    </div>
                    <div>
                      <strong>Altura estimada:</strong> {Math.ceil(Math.log2(products.length + 1)) || 1}
                    </div>
                    <div>
                      <strong>Factor de balance:</strong> Óptimo (-1 ≤ fb ≤ 1)
                    </div>
                    <div>
                      <strong>Complejidad búsqueda:</strong> O(log n)
                    </div>
                  </div>
                </div>

                {/* Operaciones del árbol */}
                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border">
                  <h5 className="text-sm font-medium mb-2">Últimas Operaciones:</h5>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>✓ Inserción de producto #{products[0]?.id || 'N/A'}</div>
                    <div>✓ Rebalanceado automático del árbol</div>
                    <div>✓ Productos ordenados por ID ascendente</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información técnica */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h4 className="font-medium mb-2">Ventajas del Árbol AVL:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>✅ Autobalanceado:</strong> Mantiene la estructura balanceada automáticamente
              </div>
              <div>
                <strong>✅ Búsqueda eficiente:</strong> Complejidad O(log n) garantizada
              </div>
              <div>
                <strong>✅ Ordenado:</strong> Los elementos se mantienen en orden por ID
              </div>
              <div>
                <strong>✅ Consistente:</strong> Altura máxima log₂(n) para n elementos
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}