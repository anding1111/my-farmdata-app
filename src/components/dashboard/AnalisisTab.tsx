import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Network, 
  Package, 
  Search,
  Eye,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useDataStructuresContext } from "@/context/DataStructuresContext";
import { useToast } from "@/hooks/use-toast";

export function AnalisisTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<{ found: boolean; path: number[]; comparisons: number; time: number } | null>(null);
  const { products, searchProduct, deleteProduct } = useDataStructuresContext();
  const { toast } = useToast();

  // Simular la estructura del AVL Tree para visualización
  const generateTreeVisualization = useMemo(() => {
    if (products.length === 0) return { nodes: [], edges: [] };

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // Función para crear nodos del árbol basado en los productos ordenados
    const createTreeNodes = (sortedProducts: typeof products, startX = 0, startY = 0, level = 0, nodeId = "root") => {
      if (sortedProducts.length === 0) return;
      
      const midIndex = Math.floor(sortedProducts.length / 2);
      const currentProduct = sortedProducts[midIndex];
      const leftProducts = sortedProducts.slice(0, midIndex);
      const rightProducts = sortedProducts.slice(midIndex + 1);
      
      // Crear nodo actual
      nodes.push({
        id: nodeId,
        type: 'default',
        position: { x: startX, y: startY },
        data: {
          label: (
            <div className="text-center p-2">
              <div className="font-bold text-blue-600">ID: {currentProduct.id}</div>
              <div className="text-xs">{currentProduct.name}</div>
              <div className="text-xs text-gray-500">Stock: {currentProduct.stock}</div>
              <div className="text-xs text-green-600">${currentProduct.price}</div>
            </div>
          )
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
        style: {
          backgroundColor: searchResult?.path.includes(currentProduct.id) ? '#fef3c7' : '#ffffff',
          border: searchResult?.path.includes(currentProduct.id) ? '2px solid #f59e0b' : '1px solid #e5e7eb',
          borderRadius: '8px',
          width: 120,
          height: 80
        }
      });
      
      // Crear nodos hijos
      if (leftProducts.length > 0) {
        const leftNodeId = `${nodeId}-left`;
        const leftX = startX - (150 / (level + 1));
        const leftY = startY + 120;
        
        edges.push({
          id: `${nodeId}-to-left`,
          source: nodeId,
          target: leftNodeId,
          type: 'default',
          style: { stroke: '#6b7280' },
          label: 'L'
        });
        
        createTreeNodes(leftProducts, leftX, leftY, level + 1, leftNodeId);
      }
      
      if (rightProducts.length > 0) {
        const rightNodeId = `${nodeId}-right`;
        const rightX = startX + (150 / (level + 1));
        const rightY = startY + 120;
        
        edges.push({
          id: `${nodeId}-to-right`,
          source: nodeId,
          target: rightNodeId,
          type: 'default',
          style: { stroke: '#6b7280' },
          label: 'R'
        });
        
        createTreeNodes(rightProducts, rightX, rightY, level + 1, rightNodeId);
      }
    };
    
    // Ordenar productos por ID (como lo haría el AVL Tree)
    const sortedProducts = [...products].sort((a, b) => a.id - b.id);
    createTreeNodes(sortedProducts, 400, 50);
    
    return { nodes, edges };
  }, [products, searchResult]);

  const [nodes, setNodes, onNodesChange] = useNodesState(generateTreeVisualization.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(generateTreeVisualization.edges);

  // Actualizar nodos y edges cuando cambien los productos o resultado de búsqueda
  React.useEffect(() => {
    setNodes(generateTreeVisualization.nodes);
    setEdges(generateTreeVisualization.edges);
  }, [generateTreeVisualization, setNodes, setEdges]);

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id.toString().includes(searchQuery)
  );

  const handleSearchProduct = () => {
    if (!searchQuery) return;
    
    const productId = parseInt(searchQuery);
    if (isNaN(productId)) return;
    
    const startTime = performance.now();
    const foundProduct = searchProduct(productId);
    const endTime = performance.now();
    
    // Simular el camino de búsqueda en el AVL Tree
    const searchPath = simulateSearchPath(productId, products);
    
    setSearchResult({
      found: !!foundProduct,
      path: searchPath,
      comparisons: searchPath.length,
      time: endTime - startTime
    });
    
    if (foundProduct) {
      toast({
        title: "🎯 Producto encontrado",
        description: `${foundProduct.name} - Stock: ${foundProduct.stock} | Comparaciones: ${searchPath.length}`,
      });
    } else {
      toast({
        title: "❌ Producto no encontrado",
        description: `No se encontró un producto con ID ${productId} | Comparaciones: ${searchPath.length}`,
        variant: "destructive",
      });
    }
  };

  // Función para simular el camino de búsqueda en el AVL Tree
  const simulateSearchPath = (targetId: number, productList: typeof products): number[] => {
    const sortedProducts = [...productList].sort((a, b) => a.id - b.id);
    const path: number[] = [];
    
    const searchInSubtree = (products: typeof sortedProducts): boolean => {
      if (products.length === 0) return false;
      
      const midIndex = Math.floor(products.length / 2);
      const currentProduct = products[midIndex];
      path.push(currentProduct.id);
      
      if (currentProduct.id === targetId) return true;
      
      if (targetId < currentProduct.id) {
        return searchInSubtree(products.slice(0, midIndex));
      } else {
        return searchInSubtree(products.slice(midIndex + 1));
      }
    };
    
    searchInSubtree(sortedProducts);
    return path;
  };

  const handleDeleteProduct = (productId: number) => {
    deleteProduct(productId);
    setSearchResult(null); // Limpiar resultado de búsqueda
    toast({
      title: "🗑️ Producto eliminado",
      description: `Producto con ID ${productId} eliminado del árbol. Árbol rebalanceado automáticamente.`,
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

          {/* Información de búsqueda */}
          {searchResult && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {searchResult.found ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  Resultado de Búsqueda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="font-medium">{searchResult.time.toFixed(2)}ms</div>
                      <div className="text-muted-foreground">Tiempo</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-purple-500" />
                    <div>
                      <div className="font-medium">{searchResult.comparisons}</div>
                      <div className="text-muted-foreground">Comparaciones</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-orange-500" />
                    <div>
                      <div className="font-medium">O(log n)</div>
                      <div className="text-muted-foreground">Complejidad</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-green-500" />
                    <div>
                      <div className="font-medium">{searchResult.found ? 'Encontrado' : 'No encontrado'}</div>
                      <div className="text-muted-foreground">Estado</div>
                    </div>
                  </div>
                </div>
                
                {searchResult.path.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Camino de búsqueda:</h4>
                    <div className="flex gap-2 flex-wrap">
                      {searchResult.path.map((nodeId, index) => (
                        <Badge 
                          key={nodeId} 
                          variant={index === searchResult.path.length - 1 && searchResult.found ? "default" : "secondary"}
                          className="flex items-center gap-1"
                        >
                          {nodeId}
                          {index < searchResult.path.length - 1 && <span className="ml-1">→</span>}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Búsqueda */}
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Buscar producto por ID o nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSearchProduct()}
            />
            <Button onClick={handleSearchProduct} variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            {searchResult && (
              <Button onClick={() => setSearchResult(null)} variant="ghost">
                Limpiar
              </Button>
            )}
          </div>

          {/* Visualización del Árbol AVL con React Flow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Estructura Visual del Árbol AVL
              </CardTitle>
              <CardDescription>
                Representación visual de cómo están organizados los productos en memoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full border rounded-lg overflow-hidden">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  fitView
                  fitViewOptions={{ padding: 0.2 }}
                  attributionPosition="bottom-left"
                  nodesDraggable={false}
                  nodesConnectable={false}
                  elementsSelectable={false}
                >
                  <Background color="#f1f5f9" size={1} />
                  <Controls showInteractive={false} />
                  <MiniMap 
                    nodeColor="#e2e8f0"
                    maskColor="rgba(0, 0, 0, 0.1)"
                    position="bottom-right"
                  />
                </ReactFlow>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <strong>Nodos totales:</strong> {products.length}
                  </div>
                  <div>
                    <strong>Altura máxima:</strong> {Math.ceil(Math.log2(products.length + 1)) || 1}
                  </div>
                  <div>
                    <strong>Factor de balance:</strong> Óptimo
                  </div>
                  <div>
                    <strong>Tipo de recorrido:</strong> In-order
                  </div>
                </div>
                
                {products.length > 0 && (
                  <div className="mt-3">
                    <strong className="text-sm">Recorrido in-order (ordenado):</strong>
                    <div className="mt-1 flex gap-1 flex-wrap">
                      {products.map((product, index) => (
                        <Badge key={product.id} variant="outline" className="text-xs">
                          {product.id}
                          {index < products.length - 1 && <span className="ml-1">→</span>}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información de memoria y estructura */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Información de Memoria y Estructura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-blue-600">Estructura en Memoria:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Cada nodo contiene:</span>
                      <Badge variant="outline">Datos + 2 Punteros</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Memoria por nodo:</span>
                      <Badge variant="outline">~48 bytes</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total estimado:</span>
                      <Badge variant="outline">~{(products.length * 48)} bytes</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Balanceamiento:</span>
                      <Badge variant="default" className="bg-green-500">Automático</Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3 text-purple-600">Operaciones Recientes:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Árbol balanceado automáticamente</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Productos ordenados por ID</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Búsqueda eficiente O(log n)</span>
                    </div>
                    {searchResult && (
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 ${searchResult.found ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
                        <span>Última búsqueda: {searchResult.found ? 'Exitosa' : 'Fallida'}</span>
                      </div>
                    )}
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