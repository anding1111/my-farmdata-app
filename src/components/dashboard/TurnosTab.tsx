import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDataStructures } from "@/hooks/useDataStructures";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Users, 
  Plus, 
  UserCheck, 
  Clock,
  User,
  Trash2
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export function TurnosTab() {
  const [newTicket, setNewTicket] = useState({ customer: "", priority: "normal" as const });
  const { turns, addTurn, serveTurn, removeSale } = useDataStructures();
  const { toast } = useToast();

  // Agregar nuevo turno a la cola
  const agregarTurno = () => {
    if (!newTicket.customer.trim()) {
      toast({
        title: "Error",
        description: "Ingrese el nombre del cliente",
        variant: "destructive"
      });
      return;
    }

    const ticket = {
      id: Date.now(),
      ticket: Date.now(),
      customer: newTicket.customer,
      priority: newTicket.priority,
      time: new Date().toLocaleTimeString()
    };

    addTurn(ticket);
    toast({
      title: "Turno agregado",
      description: `${ticket.customer} ha sido agregado a la cola de atención.`
    });
    setNewTicket({ customer: "", priority: "normal" });
  };

  // Atender próximo turno
  const atenderTurno = () => {
    const nextTicket = serveTurn();
    if (nextTicket) {
      toast({
        title: "Turno atendido",
        description: `${nextTicket.customer} ha sido atendido y removido de la cola.`
      });
    } else {
      toast({
        title: "Cola vacía",
        description: "No hay turnos pendientes en la cola.",
        variant: "destructive"
      });
    }
  };

  // Remover turno específico  
  const removerTurno = (ticketId: number) => {
    // Nota: Queue no permite eliminar elementos específicos por diseño FIFO
    toast({
      title: "Operación no permitida",
      description: "En una cola FIFO solo se puede atender el siguiente turno.",
      variant: "destructive"
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'normal': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'normal': return 'Normal';
      case 'low': return 'Baja';
      default: return 'Normal';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Sistema de Turnos (Cola de Atención)
              </CardTitle>
              <CardDescription>
                Gestión de turnos usando cola FIFO (First In, First Out) - {turns.length} en espera
              </CardDescription>
            </div>
            <Button onClick={atenderTurno} disabled={turns.length === 0}>
              <UserCheck className="h-4 w-4 mr-2" />
              Atender Siguiente
            </Button>
          </div>

          {/* Información de la cola */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{turns.length}</div>
                    <div className="text-sm text-muted-foreground">En Cola</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="text-sm font-medium">{turns[0]?.customer || 'Ninguno'}</div>
                    <div className="text-sm text-muted-foreground">Siguiente</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="text-sm font-medium">{turns.length * 5} min</div>
                    <div className="text-sm text-muted-foreground">Tiempo Estimado</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-500" />
                  <div>
                    <div className="text-sm font-medium">{turns[turns.length - 1]?.customer || 'Ninguno'}</div>
                    <div className="text-sm text-muted-foreground">Último en Cola</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agregar nuevo turno */}
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Nombre del cliente..."
              value={newTicket.customer}
              onChange={(e) => setNewTicket({ ...newTicket, customer: e.target.value })}
              className="flex-1"
            />
            <select 
              value={newTicket.priority} 
              onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
              className="px-3 py-2 border rounded-md"
            >
              <option value="low">Baja Prioridad</option>
              <option value="normal">Normal</option>
              <option value="high">Alta Prioridad</option>
            </select>
            <Button onClick={agregarTurno}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Turno
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {turns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay turnos en la cola de atención</p>
              <p className="text-sm">Agregue un nuevo turno para comenzar</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Posición</TableHead>
                    <TableHead>Ticket</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Tiempo Estimado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {turns.map((appointment, index) => (
                    <TableRow key={appointment.id} className={index === 0 ? 'bg-blue-50 dark:bg-blue-950' : ''}>
                      <TableCell>
                        <Badge variant={index === 0 ? 'default' : 'outline'}>
                          {index === 0 ? 'SIGUIENTE' : `#${index + 1}`}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {appointment.ticket || appointment.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {appointment.customer}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(appointment.priority)}>
                          {getPriorityLabel(appointment.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>
                        {index === 0 ? 'AHORA' : `${index * 5} min`}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => removerTurno(appointment.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Visualización de la cola */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-medium mb-3">Visualización de la Cola (FIFO):</h4>
                <div className="flex items-center gap-2 overflow-x-auto">
                  <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
                    <span>Head →</span>
                  </div>
                  {turns.slice(0, 5).map((appointment, index) => (
                    <div key={appointment.id} className="flex items-center">
                      <div className={`px-3 py-2 rounded text-xs whitespace-nowrap ${
                        index === 0 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                      }`}>
                        {appointment.customer}
                      </div>
                      {index < Math.min(turns.length - 1, 4) && (
                        <div className="mx-1 text-blue-400">→</div>
                      )}
                    </div>
                  ))}
                  {turns.length > 5 && (
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      ... +{turns.length - 5} más
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
                    <span>← Tail</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Información de la estructura */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h4 className="font-medium mb-2">Información de la Cola Enlazada:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Tamaño actual:</strong> {turns.length} turnos
              </div>
              <div>
                <strong>Estructura:</strong> Cola enlazada (LinkedQueue)
              </div>
              <div>
                <strong>Política:</strong> FIFO (First In, First Out)
              </div>
              <div>
                <strong>Complejidad enqueue/dequeue:</strong> O(1)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}