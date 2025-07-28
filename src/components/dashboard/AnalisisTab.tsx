import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  TrendingUp, 
  Network, 
  Package, 
  Building, 
  Tags,
  Eye,
  BarChart3
} from "lucide-react";
import { usePureInventory } from "@/hooks/usePureInventory";
import { useToast } from "@/hooks/use-toast";

export function AnalisisTab() {
  const [viewMode, setViewMode] = useState<'suppliers' | 'categories' | 'recommendations'>('suppliers');
  const [searchQuery, setSearchQuery] = useState("");
  const inventory = usePureInventory();
  const { toast } = useToast();

  // Generar nodos y aristas para el grafo interactivo
  const { nodes: flowNodes, edges: flowEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    if (viewMode === 'suppliers') {
      // Crear nodos para laboratorios
      const labs = inventory.laboratories.slice(0, 5); // Limitar para mejor visualización
      labs.forEach((lab, index) => {
        nodes.push({
          id: `lab-${lab.id}`,
          position: { x: index * 250, y: 100 },
          data: { 
            label: lab.name,
            type: 'laboratory',
            count: inventory.products.filter(p => String(p.laboratory_id) === String(lab.id)).length
          },
          type: 'default',
          style: { 
            background: '#3b82f6', 
            color: 'white',
            border: '2px solid #1d4ed8',
            borderRadius: '8px',
            padding: '10px'
          }
        });

        // Agregar productos de este laboratorio
        const labProducts = inventory.products
          .filter(p => String(p.laboratory_id) === String(lab.id))
          .slice(0, 3); // Máximo 3 productos por lab

        labProducts.forEach((product, prodIndex) => {
          const nodeId = `product-${product.id}`;
          nodes.push({
            id: nodeId,
            position: { x: index * 250 + (prodIndex - 1) * 80, y: 250 },
            data: { 
              label: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
              type: 'product',
              stock: product.current_stock || product.stock || 0
            },
            type: 'default',
            style: { 
              background: '#10b981', 
              color: 'white',
              border: '2px solid #059669',
              borderRadius: '8px',
              fontSize: '12px',
              padding: '8px'
            }
          });

          // Crear arista laboratorio -> producto
          edges.push({
            id: `lab-${lab.id}-product-${product.id}`,
            source: `lab-${lab.id}`,
            target: nodeId,
            type: 'smoothstep',
            style: { stroke: '#6b7280' }
          });
        });
      });
    } else if (viewMode === 'categories') {
      // Crear nodos para categorías
      const cats = inventory.categories.slice(0, 4);
      cats.forEach((cat, index) => {
        const angle = (index * 2 * Math.PI) / cats.length;
        const radius = 200;
        
        nodes.push({
          id: `cat-${cat.id}`,
          position: { 
            x: 300 + radius * Math.cos(angle), 
            y: 200 + radius * Math.sin(angle) 
          },
          data: { 
            label: cat.name,
            type: 'category',
            count: inventory.products.filter(p => String(p.category_id) === String(cat.id)).length
          },
          type: 'default',
          style: { 
            background: '#8b5cf6', 
            color: 'white',
            border: '2px solid #7c3aed',
            borderRadius: '8px',
            padding: '10px'
          }
        });
      });

      // Nodo central
      nodes.push({
        id: 'center',
        position: { x: 300, y: 200 },
        data: { label: 'Inventario\nFarmacia', type: 'center' },
        type: 'default',
        style: { 
          background: '#f59e0b', 
          color: 'white',
          border: '3px solid #d97706',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          fontSize: '12px',
          textAlign: 'center',
          padding: '10px'
        }
      });

      // Conectar categorías al centro
      inventory.categories.slice(0, 4).forEach((cat) => {
        edges.push({
          id: `center-cat-${cat.id}`,
          source: 'center',
          target: `cat-${cat.id}`,
          type: 'smoothstep',
          style: { stroke: '#f59e0b', strokeWidth: 2 }
        });
      });
    } else if (viewMode === 'recommendations') {
      // Análisis de productos con stock bajo
      const lowStockProducts = inventory.products
        .filter(p => (p.current_stock || p.stock || 0) <= (p.min_stock || p.minStock || 5))
        .slice(0, 6);

      lowStockProducts.forEach((product, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        
        nodes.push({
          id: `low-stock-${product.id}`,
          position: { x: col * 200 + 100, y: row * 150 + 100 },
          data: { 
            label: product.name.length > 12 ? product.name.substring(0, 12) + '...' : product.name,
            type: 'low-stock',
            stock: product.current_stock || product.stock || 0
          },
          type: 'default',
          style: { 
            background: '#ef4444', 
            color: 'white',
            border: '2px solid #dc2626',
            borderRadius: '8px',
            fontSize: '12px',
            padding: '8px'
          }
        });
      });
    }

    return { nodes, edges };
  }, [viewMode, inventory.products, inventory.laboratories, inventory.categories]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  // Actualizar nodos cuando cambie el modo de vista
  React.useEffect(() => {
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [flowNodes, flowEdges, setNodes, setEdges]);

  // Estadísticas del análisis
  const statistics = useMemo(() => {
    const totalProducts = inventory.products.length;
    const lowStockProducts = inventory.products.filter(p => 
      (p.current_stock || p.stock || 0) <= (p.min_stock || p.minStock || 5)
    ).length;
    
    const topLaboratory = inventory.laboratories.reduce((top, lab) => {
      const count = inventory.products.filter(p => String(p.laboratory_id) === String(lab.id)).length;
      return count > (top.count || 0) ? { ...lab, count } : top;
    }, { name: '', count: 0 });

    const topCategory = inventory.categories.reduce((top, cat) => {
      const count = inventory.products.filter(p => String(p.category_id) === String(cat.id)).length;
      return count > (top.count || 0) ? { ...cat, count } : top;
    }, { name: '', count: 0 });

    return {
      totalProducts,
      lowStockProducts,
      topLaboratory,
      topCategory
    };
  }, [inventory.products, inventory.laboratories, inventory.categories]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Análisis Inteligente del Inventario
          </CardTitle>
          <CardDescription>
            Visualización interactiva de relaciones entre productos, proveedores y categorías
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Controles */}
          <div className="flex gap-4 items-center">
            <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suppliers">Laboratorios y Productos</SelectItem>
                <SelectItem value="categories">Categorías del Inventario</SelectItem>
                <SelectItem value="recommendations">Alertas de Stock Bajo</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Buscar en el análisis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{statistics.totalProducts}</div>
                    <div className="text-sm text-muted-foreground">Total Productos</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="text-2xl font-bold">{statistics.lowStockProducts}</div>
                    <div className="text-sm text-muted-foreground">Stock Bajo</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="text-sm font-medium">{statistics.topLaboratory.name || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">Top Laboratorio</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Tags className="h-4 w-4 text-purple-500" />
                  <div>
                    <div className="text-sm font-medium">{statistics.topCategory.name || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">Top Categoría</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Grafo Interactivo */}
          <div className="h-96 border rounded-lg overflow-hidden bg-white">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              attributionPosition="bottom-left"
              style={{ backgroundColor: "#f8fafc" }}
            >
              <Background color="#e2e8f0" />
              <Controls />
              <MiniMap 
                zoomable 
                pannable 
                style={{ 
                  background: "#f1f5f9",
                  border: "1px solid #cbd5e1" 
                }}
              />
            </ReactFlow>
          </div>

          {/* Explicación del análisis actual */}
          <Card className="bg-blue-50 dark:bg-blue-950">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <div className="font-medium text-blue-900 dark:text-blue-100">
                    {viewMode === 'suppliers' && 'Análisis Laboratorio-Producto'}
                    {viewMode === 'categories' && 'Distribución por Categorías'}
                    {viewMode === 'recommendations' && 'Alertas de Reabastecimiento'}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    {viewMode === 'suppliers' && 'Visualiza qué productos maneja cada laboratorio y sus relaciones comerciales.'}
                    {viewMode === 'categories' && 'Muestra cómo se distribuyen los productos entre las diferentes categorías.'}
                    {viewMode === 'recommendations' && 'Identifica productos con stock crítico que requieren reabastecimiento inmediato.'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Información técnica */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h4 className="font-medium mb-2">Análisis Basado en Grafos:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Nodos activos:</strong> {nodes.length}
              </div>
              <div>
                <strong>Conexiones:</strong> {edges.length}
              </div>
              <div>
                <strong>Algoritmo:</strong> Análisis de adyacencia
              </div>
              <div>
                <strong>Visualización:</strong> Interactive React Flow
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}