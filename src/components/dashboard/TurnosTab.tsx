import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, UserPlus, UserX } from "lucide-react";
import { toast } from "sonner";

interface Turno {
  customer: string;
  ticket: number;
  time: string;
  priority: string;
}

export function TurnosTab() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTurnos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/turns');
      const data = await response.json();
      setTurnos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching turnos:', error);
      toast.error('Error al cargar turnos');
      setLoading(false);
    }
  };

  const atenderTurno = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/turns', {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.next) {
        toast.success(`Atendiendo a: ${data.next.customer}`);
        fetchTurnos(); // Recargar lista
      } else {
        toast.info('No hay más turnos en la cola');
      }
    } catch (error) {
      toast.error('Error al atender turno');
    }
  };

  useEffect(() => {
    fetchTurnos();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'destructive';
      case 'preferencial': return 'secondary';
      default: return 'default';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Cargando turnos...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Sistema de Turnos - Cola Enlazada
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Estructura: Cola FIFO usando nodos enlazados (sin arreglos)
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Turnos en cola: {turnos.length}</span>
            </div>
            <Button onClick={atenderTurno} disabled={turnos.length === 0}>
              <UserX className="h-4 w-4 mr-2" />
              Atender Siguiente
            </Button>
          </div>

          <div className="grid gap-2 max-h-96 overflow-y-auto">
            {turnos.map((turno, index) => (
              <div
                key={turno.ticket}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  index === 0 ? 'bg-primary/5 border-primary' : 'bg-card'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{turno.customer}</span>
                    <span className="text-xs text-muted-foreground">
                      Ticket: {turno.ticket}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityColor(turno.priority)}>
                    {turno.priority}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {turno.time}
                  </span>
                  {index === 0 && (
                    <Badge variant="default">Siguiente</Badge>
                  )}
                </div>
              </div>
            ))}
            
            {turnos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No hay turnos en la cola
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}