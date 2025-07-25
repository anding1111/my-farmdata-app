import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, Calendar, User } from "lucide-react";
import ProductReceiptDialog from "./ProductReceiptDialog";

const ReceiptsTab = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Ingreso de Productos
          </CardTitle>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Recibir Productos
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                Ingresos Hoy
              </div>
              <div className="text-2xl font-semibold">0</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Package className="h-4 w-4" />
                Productos Recibidos
              </div>
              <div className="text-2xl font-semibold">0</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <User className="h-4 w-4" />
                Proveedores Activos
              </div>
              <div className="text-2xl font-semibold">0</div>
            </div>
          </div>
          
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No hay ingresos registrados</p>
            <p className="text-sm">Comienza registrando el primer ingreso de productos desde proveedores</p>
          </div>
        </CardContent>
      </Card>

      <ProductReceiptDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </div>
  );
};

export default ReceiptsTab;