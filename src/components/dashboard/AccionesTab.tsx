import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  History, 
  Clock,
  Trash2,
  Eye,
  Undo,
  Plus,
  User
} from "lucide-react";
import { useDataStructuresContext } from "@/context/DataStructuresContext";
import { useToast } from "@/hooks/use-toast";

interface Action {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  user: string;
  details?: any;
}

export function AccionesTab() {
  const [actionDescription, setActionDescription] = useState("");
  const { actionsHistory, addAction, undoLastAction, clearActionsHistory, getActionsStats } = useDataStructuresContext();
  const { toast } = useToast();

  const stats = getActionsStats();

  const handleAddAction = () => {
    if (!actionDescription.trim()) return;
    
    const newAction: Action = {
      id: Date.now(),
      type: 'Manual',
      description: actionDescription,
      timestamp: new Date().toLocaleString('es-ES'),
      user: 'Usuario',
      details: { manual: true }
    };
    
    addAction(newAction);
    setActionDescription("");
    
    toast({
      title: "✅ Acción registrada",
      description: `Se registró: "${actionDescription}"`,
    });
  };

  const handleUndoAction = () => {
    const undoneAction = undoLastAction();
    if (undoneAction) {
      toast({
        title: "↩️ Acción deshecha",
        description: `Se deshizo: "${undoneAction.description}"`,
      });
    } else {
      toast({
        title: "⚠️ No hay acciones",
        description: "No hay acciones para deshacer",
        variant: "destructive",
      });
    }
  };

  const handleClearHistory = () => {
    clearActionsHistory();
    toast({
      title: "🗑️ Historial limpiado",
      description: "Se eliminaron todas las acciones del historial",
    });
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'Manual': return <User className="h-4 w-4" />;
      case 'Sistema': return <Clock className="h-4 w-4" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'Manual': return 'bg-blue-500';
      case 'Sistema': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de Acciones (Stack)
          </CardTitle>
          <CardDescription>
            Registro de acciones en orden LIFO - las más recientes aparecen primero
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total Acciones</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="text-sm font-bold">LIFO</div>
                    <div className="text-sm text-muted-foreground">Estructura</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-purple-500" />
                  <div>
                    <div className="text-sm font-bold">O(1)</div>
                    <div className="text-sm text-muted-foreground">Complejidad</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="text-sm font-bold">{stats.manual}</div>
                    <div className="text-sm text-muted-foreground">Manuales</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controles */}
          <div className="flex gap-2">
            <Input
              placeholder="Describe la acción a registrar..."
              value={actionDescription}
              onChange={(e) => setActionDescription(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAddAction()}
            />
            <Button onClick={handleAddAction} disabled={!actionDescription.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
            <Button onClick={handleUndoAction} variant="outline">
              <Undo className="h-4 w-4 mr-2" />
              Deshacer
            </Button>
            <Button onClick={handleClearHistory} variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
          </div>

          {/* Visualización del Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Estructura Visual del Stack
              </CardTitle>
              <CardDescription>
                Las acciones más recientes están en la parte superior (LIFO)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {actionsHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay acciones registradas
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">TOP → Más reciente</h4>
                      {actionsHistory.slice(0, 10).map((action, index) => (
                        <div 
                          key={action.id} 
                          className={`p-3 rounded-lg border-l-4 bg-muted/50 ${
                            index === 0 ? 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20' : 'border-l-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-2">
                              <div className={`p-1 rounded ${getActionColor(action.type)} text-white`}>
                                {getActionIcon(action.type)}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{action.description}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {action.timestamp} • {action.user}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={action.type === 'Manual' ? 'default' : 'secondary'} className="text-xs">
                                {action.type}
                              </Badge>
                              {index === 0 && (
                                <Badge variant="outline" className="text-xs bg-blue-100 dark:bg-blue-900">
                                  TOP
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {actionsHistory.length > 10 && (
                        <div className="text-center text-sm text-muted-foreground py-2">
                          ... y {actionsHistory.length - 10} acciones más (mostrando solo las 10 más recientes)
                        </div>
                      )}
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <strong>Elemento TOP:</strong> {actionsHistory[0]?.description.substring(0, 20)}...
                        </div>
                        <div>
                          <strong>Tamaño Stack:</strong> {actionsHistory.length}
                        </div>
                        <div>
                          <strong>Operación Push:</strong> O(1)
                        </div>
                        <div>
                          <strong>Operación Pop:</strong> O(1)
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <strong className="text-sm">Stack completo (TOP → BOTTOM):</strong>
                        <div className="mt-1 flex gap-1 flex-wrap">
                          {actionsHistory.slice(0, 5).map((action, index) => (
                            <Badge key={action.id} variant="outline" className="text-xs">
                              {index + 1}: {action.description.substring(0, 15)}...
                              {index < Math.min(actionsHistory.length - 1, 4) && <span className="ml-1">↓</span>}
                            </Badge>
                          ))}
                          {actionsHistory.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                              +{actionsHistory.length - 5} más
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información de la estructura Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Información de la Estructura Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-blue-600">Características:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Principio:</span>
                      <Badge variant="outline">LIFO</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Push (agregar):</span>
                      <Badge variant="outline">O(1)</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Pop (remover):</span>
                      <Badge variant="outline">O(1)</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Peek (ver tope):</span>
                      <Badge variant="outline">O(1)</Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3 text-purple-600">Uso en el Sistema:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Ideal para:</span>
                      <Badge variant="outline">Historial</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Deshacer acciones:</span>
                      <Badge variant="outline">Eficiente</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Memoria:</span>
                      <Badge variant="outline">Dinámica</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Acceso:</span>
                      <Badge variant="outline">Solo TOP</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}