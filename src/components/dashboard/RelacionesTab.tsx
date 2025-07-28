import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Network, Plus, Search, Trash2, Route } from "lucide-react";
import { toast } from "sonner";
import { useDataStructures } from "@/hooks/useDataStructures";

export function RelacionesTab() {
  const { 
    relations, 
    addRelation, 
    addRelationEdge, 
    removeRelation,
    findPath
  } = useDataStructures();
  
  const [newRelation, setNewRelation] = useState({ name: "", type: "supplier" as const });
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [edgeLabel, setEdgeLabel] = useState("");

  // Agregar nueva relación (vértice)
  const agregarRelacion = () => {
    if (!newRelation.name.trim()) {
      toast.error("Ingrese un nombre para la relación");
      return;
    }

    const relation = {
      id: `${newRelation.type}_${Date.now()}`,
      type: newRelation.type,
      name: newRelation.name
    };

    addRelation(relation);
    toast.success(`${relation.type === 'supplier' ? 'Proveedor' : relation.type === 'product' ? 'Producto' : 'Categoría'} agregado: ${relation.name}`);
    setNewRelation({ name: "", type: "supplier" });
  };

  // Agregar conexión (arista)
  const agregarConexion = () => {
    if (!fromId || !toId) {
      toast.error("Seleccione origen y destino");
      return;
    }

    addRelationEdge(fromId, toId, edgeLabel);
    toast.success("Conexión creada exitosamente");
    setFromId("");
    setToId("");
    setEdgeLabel("");
  };

  // Eliminar relación
  const eliminarRelacion = (relationId: string) => {
    removeRelation(relationId);
    toast.success("Relación eliminada del grafo");
  };

  // Buscar camino
  const buscarCamino = () => {
    if (!fromId || !toId) {
      toast.error("Seleccione origen y destino para buscar camino");
      return;
    }

    const path = findPath(fromId, toId);
    if (path) {
      const pathNames = path.map(r => r.name).join(" → ");
      toast.success(`Camino encontrado: ${pathNames}`);
    } else {
      toast.error("No se encontró camino entre los elementos");
    }
  };

  // Agrupar relaciones por tipo
  const suppliers = relations.filter(r => r.type === 'supplier');
  const products = relations.filter(r => r.type === 'product');
  const categories = relations.filter(r => r.type === 'category');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'supplier': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'product': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'category': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Relaciones (Graph)
          </CardTitle>
          <CardDescription>
            Gestión de relaciones entre proveedores, productos y categorías usando grafos - {relations.length} vértices
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Agregar nueva relación */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-3">Agregar Vértice</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Nombre de la relación..."
                value={newRelation.name}
                onChange={(e) => setNewRelation({ ...newRelation, name: e.target.value })}
              />
              <Select value={newRelation.type} onValueChange={(value: any) => setNewRelation({ ...newRelation, type: value })}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier">Proveedor</SelectItem>
                  <SelectItem value="product">Producto</SelectItem>
                  <SelectItem value="category">Categoría</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={agregarRelacion}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </div>
          </div>

          {/* Crear conexiones */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-3">Crear Conexión (Arista)</h4>
            <div className="flex gap-2">
              <Select value={fromId} onValueChange={setFromId}>
                <SelectTrigger>
                  <SelectValue placeholder="Desde..." />
                </SelectTrigger>
                <SelectContent>
                  {relations.map(relation => (
                    <SelectItem key={relation.id} value={relation.id}>
                      {relation.name} ({relation.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={toId} onValueChange={setToId}>
                <SelectTrigger>
                  <SelectValue placeholder="Hacia..." />
                </SelectTrigger>
                <SelectContent>
                  {relations.map(relation => (
                    <SelectItem key={relation.id} value={relation.id}>
                      {relation.name} ({relation.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Etiqueta (opcional)"
                value={edgeLabel}
                onChange={(e) => setEdgeLabel(e.target.value)}
                className="w-32"
              />
              <Button onClick={agregarConexion}>
                Conectar
              </Button>
            </div>
          </div>

          {/* Buscar caminos */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-3">Buscar Camino</h4>
            <div className="flex gap-2">
              <Select value={fromId} onValueChange={setFromId}>
                <SelectTrigger>
                  <SelectValue placeholder="Desde..." />
                </SelectTrigger>
                <SelectContent>
                  {relations.map(relation => (
                    <SelectItem key={relation.id} value={relation.id}>
                      {relation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={toId} onValueChange={setToId}>
                <SelectTrigger>
                  <SelectValue placeholder="Hasta..." />
                </SelectTrigger>
                <SelectContent>
                  {relations.map(relation => (
                    <SelectItem key={relation.id} value={relation.id}>
                      {relation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={buscarCamino} variant="outline">
                <Route className="h-4 w-4 mr-2" />
                Buscar Camino
              </Button>
            </div>
          </div>

          {/* Visualización de relaciones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Proveedores */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Proveedores ({suppliers.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suppliers.map(supplier => (
                  <div key={supplier.id} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-950 rounded">
                    <span className="text-sm">{supplier.name}</span>
                    <Button 
                      onClick={() => eliminarRelacion(supplier.id)} 
                      variant="destructive" 
                      size="sm"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {suppliers.length === 0 && (
                  <div className="text-sm text-muted-foreground">No hay proveedores</div>
                )}
              </CardContent>
            </Card>

            {/* Productos */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Productos ({products.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {products.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950 rounded">
                    <span className="text-sm">{product.name}</span>
                    <Button 
                      onClick={() => eliminarRelacion(product.id)} 
                      variant="destructive" 
                      size="sm"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="text-sm text-muted-foreground">No hay productos</div>
                )}
              </CardContent>
            </Card>

            {/* Categorías */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Categorías ({categories.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-950 rounded">
                    <span className="text-sm">{category.name}</span>
                    <Button 
                      onClick={() => eliminarRelacion(category.id)} 
                      variant="destructive" 
                      size="sm"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="text-sm text-muted-foreground">No hay categorías</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Información del grafo */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h4 className="font-medium mb-2">Información del Grafo:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Vértices:</strong> {relations.length}
              </div>
              <div>
                <strong>Tipos:</strong> {suppliers.length} proveedores, {products.length} productos, {categories.length} categorías
              </div>
              <div>
                <strong>Estructura:</strong> Grafo dirigido
              </div>
              <div>
                <strong>Representación:</strong> Lista de adyacencia
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}