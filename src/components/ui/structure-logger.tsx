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
    if (!state || !state.root) return <div className="text-muted-foreground">Árbol vacío</div>;
    
    const renderNode = (node: any, level = 0) => (
      <div key={`${node.data?.id || 'root'}-${level}`} className="flex flex-col items-center">
        <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xs mb-2">
          {node.data?.name?.substring(0, 3) || node.data?.id || 'N'}
          <div className="absolute -top-1 -right-1 bg-accent text-accent-foreground rounded-full w-4 h-4 flex items-center justify-center text-xs">
            {node.height || 1}
          </div>
        </div>
        <div className="flex gap-4">
          {node.left && (
            <div className="flex flex-col items-center">
              <div className="w-px h-4 bg-border"></div>
              {renderNode(node.left, level + 1)}
            </div>
          )}
          {node.right && (
            <div className="flex flex-col items-center">
              <div className="w-px h-4 bg-border"></div>
              {renderNode(node.right, level + 1)}
            </div>
          )}
        </div>
      </div>
    );

    return (
      <div className="p-4 bg-muted/20 rounded-lg overflow-auto">
        <div className="text-sm font-medium mb-2">Estructura AVL Tree:</div>
        <div className="flex justify-center">
          {renderNode(state.root)}
        </div>
      </div>
    );
  };

  const renderLinkedQueue = (state: any) => {
    if (!state || (!state.head && state.size === 0)) {
      return <div className="text-muted-foreground">Cola vacía</div>;
    }

    return (
      <div className="p-4 bg-muted/20 rounded-lg">
        <div className="text-sm font-medium mb-2">Cola Enlazada (FIFO):</div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">Head: {state.head?.data?.ticket || 'null'}</Badge>
          <Badge variant="outline">Tail: {state.tail?.data?.ticket || 'null'}</Badge>
          <Badge variant="outline">Size: {state.size || 0}</Badge>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {state.items && state.items.map((item: any, index: number) => (
            <div key={index} className="flex items-center">
              <div className="bg-secondary text-secondary-foreground p-2 rounded text-xs whitespace-nowrap">
                {item.ticket || item.name || `Item ${index + 1}`}
              </div>
              {index < state.items.length - 1 && (
                <div className="mx-1 text-muted-foreground">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLinkedList = (state: any) => {
    if (!state || (!state.head && state.size === 0)) {
      return <div className="text-muted-foreground">Lista vacía</div>;
    }

    return (
      <div className="p-4 bg-muted/20 rounded-lg">
        <div className="text-sm font-medium mb-2">Lista Enlazada:</div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">Head: {state.head?.data?.id || 'null'}</Badge>
          <Badge variant="outline">Size: {state.size || 0}</Badge>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {state.items && state.items.map((item: any, index: number) => (
            <div key={index} className="flex items-center">
              <div className="bg-secondary text-secondary-foreground p-2 rounded text-xs">
                {item.product || item.customer || `Item ${index + 1}`}
              </div>
              {index < state.items.length - 1 && (
                <div className="mx-1 text-muted-foreground">→</div>
              )}
            </div>
          ))}
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
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [selectedLog, setSelectedLog] = React.useState<LogEntry | null>(null);

  if (!isVisible) {
    return (
      <Button
        onClick={onToggleVisibility}
        className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 p-0"
        variant="default"
      >
        <Eye className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className={`fixed ${isExpanded ? 'inset-4' : 'bottom-4 right-4 w-96 h-96'} z-50 transition-all duration-300`}>
      <Card className="h-full flex flex-col shadow-2xl border-2">
        <CardHeader className="flex-shrink-0 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Logger de Estructuras</CardTitle>
            <div className="flex gap-1">
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              </Button>
              <Button
                onClick={onClear}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                Limpiar
              </Button>
              <Button
                onClick={onToggleVisibility}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <EyeOff className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {logs.length} operaciones registradas
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-2">
          <div className="h-full flex gap-2">
            {/* Lista de logs */}
            <div className="w-1/3 border-r pr-2">
              <div className="text-xs font-medium mb-2">Operaciones:</div>
              <div className="space-y-1 max-h-full overflow-y-auto">
                {logs.slice(-10).reverse().map((log) => (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`p-2 rounded cursor-pointer text-xs ${
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
                      <Badge variant="outline">{selectedLog.executionTime}ms</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-xs font-medium mb-2">Estado Anterior:</div>
                    <StructureVisualizer
                      structure={selectedLog.structure}
                      state={selectedLog.beforeState}
                      title="Antes"
                    />
                  </div>

                  <Separator />

                  <div>
                    <div className="text-xs font-medium mb-2">Estado Posterior:</div>
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
                        <div className="text-xs font-medium mb-2">Métricas:</div>
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
        </CardContent>
      </Card>
    </div>
  );
};