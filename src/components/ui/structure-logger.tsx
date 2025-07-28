import React from 'react';
import { X, Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Separator } from './separator';

interface LogEntry {
  id: string;
  timestamp: string;
  structure: string;
  operation: string;
  beforeState: any;
  afterState: any;
  metrics: Record<string, any>;
  executionTime: number;
}

interface StructureLoggerProps {
  logs: LogEntry[];
  isVisible: boolean;
  onToggleVisibility: () => void;
  onClear: () => void;
}

const StructureVisualizer = ({ structure, state, title }: { structure: string; state: any; title: string }) => {
  const renderAvlTree = (state: any) => {
    if (!state || !state.root || (Array.isArray(state.root) && state.root.length === 0)) {
      return <div className="text-muted-foreground">Árbol vacío</div>;
    }

    const products = Array.isArray(state.root) ? state.root : [state.root];
    
    return (
      <div className="p-4 bg-muted/20 rounded-lg overflow-auto">
        <div className="text-sm font-medium mb-2">AVL Tree - Productos:</div>
        <div className="grid grid-cols-2 gap-2">
          {products.map((product: any, index: number) => (
            <div key={product.id || index} className="bg-primary text-primary-foreground p-2 rounded text-xs">
              <div className="font-medium">{product.name}</div>
              <div className="text-xs opacity-75">Stock: {product.stock}</div>
              <div className="text-xs opacity-75">Precio: ${product.price}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Total productos: {state.size || products.length}
        </div>
      </div>
    );
  };

  const renderLinkedQueue = (state: any) => {
    if (!state || (!state.queue && state.size === 0)) {
      return <div className="text-muted-foreground">Cola vacía</div>;
    }

    const items = state.queue || [];

    return (
      <div className="p-4 bg-muted/20 rounded-lg">
        <div className="text-sm font-medium mb-2">Cola Enlazada (FIFO) - Turnos:</div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">Size: {state.size || items.length}</Badge>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {items.map((item: any, index: number) => (
            <div key={index} className="flex items-center">
              <div className="bg-secondary text-secondary-foreground p-2 rounded text-xs whitespace-nowrap">
                <div className="font-medium">#{item.ticket}</div>
                <div className="text-xs">{item.customer}</div>
                <div className="text-xs">{item.service}</div>
              </div>
              {index < items.length - 1 && (
                <div className="mx-1 text-muted-foreground">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLinkedList = (state: any) => {
    if (!state || (!state.list && state.size === 0)) {
      return <div className="text-muted-foreground">Lista vacía</div>;
    }

    const items = state.list || [];

    return (
      <div className="p-4 bg-muted/20 rounded-lg">
        <div className="text-sm font-medium mb-2">Lista Enlazada - Ventas:</div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">Size: {state.size || items.length}</Badge>
        </div>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {items.slice(0, 5).map((item: any, index: number) => (
            <div key={index} className="bg-secondary text-secondary-foreground p-2 rounded text-xs">
              <div className="font-medium">Venta #{item.id}</div>
              <div className="text-xs">Cliente: {item.customer}</div>
              <div className="text-xs">Producto: {item.product}</div>
              <div className="text-xs">Total: ${item.total}</div>
            </div>
          ))}
          {items.length > 5 && (
            <div className="text-xs text-muted-foreground text-center">
              ... y {items.length - 5} ventas más
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGraph = (state: any) => {
    if (!state || (!state.vertices && state.vertexCount === 0)) {
      return <div className="text-muted-foreground">Grafo vacío</div>;
    }

    return (
      <div className="p-4 bg-muted/20 rounded-lg">
        <div className="text-sm font-medium mb-2">Grafo de Relaciones:</div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">Vértices: {state.vertexCount || 0}</Badge>
          <Badge variant="outline">Aristas: {state.edgeCount || 0}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {state.vertices && state.vertices.map((vertex: any, index: number) => (
            <div key={index} className="bg-secondary text-secondary-foreground p-2 rounded text-xs">
              {vertex.data?.name || vertex.data || `Vértice ${index + 1}`}
              {vertex.edges && vertex.edges.length > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  → {vertex.edges.length} conexiones
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStructure = () => {
    switch (structure) {
      case 'AvlTree':
        return renderAvlTree(state);
      case 'LinkedQueue':
        return renderLinkedQueue(state);
      case 'LinkedList':
        return renderLinkedList(state);
      case 'Graph':
        return renderGraph(state);
      default:
        return <div className="text-muted-foreground">Estructura no reconocida</div>;
    }
  };

  return (
    <div>
      <div className="text-sm font-medium mb-2">{title}</div>
      {renderStructure()}
    </div>
  );
};

export const StructureLogger: React.FC<StructureLoggerProps> = ({
  logs,
  isVisible,
  onToggleVisibility,
  onClear
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [selectedLog, setSelectedLog] = React.useState<LogEntry | null>(null);

  if (!isVisible) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggleVisibility}
          variant="outline"
          size="lg"
          className="bg-background/80 backdrop-blur-sm shadow-lg hover:bg-background/90 border-2"
        >
          <Eye className="h-5 w-5 mr-2" />
          Ver Logger de Estructuras
        </Button>
      </div>
    );
  }

  return (
    <div 
      className={`fixed z-50 bg-background/95 backdrop-blur-sm border rounded-lg shadow-xl transition-all duration-300 ${
        isExpanded ? 'w-[900px] h-[700px] bottom-6 right-6' : 'w-[500px] h-[400px] bottom-6 right-6'
      }`}
      style={{ minWidth: '400px', minHeight: '300px' }}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Logger de Estructuras de Datos</h3>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="outline"
              size="sm"
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button onClick={onClear} variant="outline" size="sm">
              Limpiar ({logs.length})
            </Button>
            <Button
              onClick={onToggleVisibility}
              variant="outline"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-4">
          {logs.length} operaciones registradas
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full flex gap-4">
            {/* Lista de logs */}
            <div className="w-1/3 border-r pr-4">
              <div className="text-sm font-medium mb-2">Operaciones:</div>
              <div className="space-y-2 max-h-full overflow-y-auto">
                {logs.slice(-10).reverse().map((log) => (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`p-3 rounded cursor-pointer text-sm transition-colors ${
                      selectedLog?.id === log.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <div className="font-medium">{log.structure}</div>
                    <div className="text-xs opacity-75">{log.operation}</div>
                    <div className="text-xs opacity-50">{log.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visualización */}
            <div className="flex-1 overflow-y-auto">
              {selectedLog ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{selectedLog.structure}</Badge>
                      <Badge variant="secondary">{selectedLog.operation}</Badge>
                      <Badge variant="outline">{selectedLog.executionTime.toFixed(2)}ms</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-sm font-medium mb-2">Estado Anterior:</div>
                    <StructureVisualizer
                      structure={selectedLog.structure}
                      state={selectedLog.beforeState}
                      title="Antes"
                    />
                  </div>

                  <Separator />

                  <div>
                    <div className="text-sm font-medium mb-2">Estado Posterior:</div>
                    <StructureVisualizer
                      structure={selectedLog.structure}
                      state={selectedLog.afterState}
                      title="Después"
                    />
                  </div>

                  {Object.keys(selectedLog.metrics).length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="text-sm font-medium mb-2">Métricas:</div>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(selectedLog.metrics).map(([key, value]) => (
                            <div key={key} className="bg-muted p-2 rounded text-xs">
                              <div className="font-medium">{key}:</div>
                              <div>{String(value)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Selecciona una operación para ver los detalles
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};