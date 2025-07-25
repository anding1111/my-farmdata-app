
import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, TrendingUp, TrendingDown } from "lucide-react";
import { useGenerateSaleMovement } from "@/hooks/useAutoMovements";
import { useToast } from "@/hooks/use-toast";

const Sales = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const generateSaleMovement = useGenerateSaleMovement();
  const { toast } = useToast();

  // Datos de ejemplo para demostrar el funcionamiento
  const sampleSale = {
    customer: "Cliente Ejemplo",
    products: [
      { id: 1, name: "Vitamina D3", quantity: 2, price: 15000 },
      { id: 2, name: "Omega 3", quantity: 1, price: 25000 }
    ],
    total: 55000
  };

  const handleProcessSale = async () => {
    setIsProcessing(true);
    try {
      const saleId = Date.now();
      const referenceDocument = `VT-${saleId}`;

      // Generar movimientos automáticos para cada producto
      for (const product of sampleSale.products) {
        await generateSaleMovement.mutateAsync({
          product_id: product.id,
          quantity: product.quantity,
          unit_cost: product.price,
          sale_id: saleId,
          reference_document: referenceDocument,
        });
      }

      toast({
        title: "¡Venta procesada exitosamente!",
        description: `Se han generado automáticamente los movimientos de inventario para ${sampleSale.products.length} productos.`,
      });
    } catch (error) {
      toast({
        title: "Error al procesar venta",
        description: "No se pudieron generar todos los movimientos de inventario.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader title="Ventas" />
      <div className="p-6 space-y-6">
        {/* Explicación del sistema automático */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sistema de Movimientos Automáticos
            </CardTitle>
            <CardDescription>
              El sistema ahora genera automáticamente movimientos de inventario cuando se procesan ventas, recepciones y transferencias.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-900">Ventas</p>
                  <p className="text-sm text-green-700">Genera movimientos de salida automáticamente</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-900">Recepciones</p>
                  <p className="text-sm text-blue-700">Genera movimientos de entrada automáticamente</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="p-2 bg-purple-100 rounded">
                  <TrendingDown className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-purple-900">Transferencias</p>
                  <p className="text-sm text-purple-700">Movimientos entre ubicaciones</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demostración de venta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Demostración de Venta
            </CardTitle>
            <CardDescription>
              Procesa esta venta de ejemplo para ver cómo se generan automáticamente los movimientos de inventario.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Cliente: {sampleSale.customer}</h4>
              <div className="space-y-2">
                {sampleSale.products.map((product) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <span>{product.name} x{product.quantity}</span>
                    <span className="font-medium">${product.price.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between items-center font-semibold">
                  <span>Total:</span>
                  <span>${sampleSale.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleProcessSale}
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                {isProcessing ? "Procesando..." : "Procesar Venta"}
              </Button>
              
              <Badge variant="outline" className="flex items-center gap-2">
                <Package className="h-3 w-3" />
                Genera movimientos automáticos
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
              <p><strong>¿Cómo funciona?</strong></p>
              <p>Al procesar la venta, el sistema automáticamente:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Genera movimientos de salida para cada producto vendido</li>
                <li>Marca los movimientos como "automáticos" para diferenciación</li>
                <li>Incluye la referencia de la venta en el movimiento</li>
                <li>Actualiza el inventario sin intervención manual</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>¿Dónde ver los movimientos?</CardTitle>
            <CardDescription>
              Todos los movimientos automáticos se registran en el módulo de inventario.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ve a <strong>Inventario → Movimientos</strong> para ver todos los movimientos generados automáticamente.
              Los movimientos automáticos están marcados con una etiqueta especial y no se pueden editar manualmente.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Sales;
