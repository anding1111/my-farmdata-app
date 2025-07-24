import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProductList } from "@/types/product";
import { formatCurrency } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, CreditCard, Truck } from "lucide-react";
import { PaymentReceipt } from "./PaymentReceipt";

interface PurchaseDialogProps {
  list: ProductList;
  children: React.ReactNode;
}

export function PurchaseDialog({ list, children }: PurchaseDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [showReceipt, setShowReceipt] = useState(false);
  const [purchaseData, setPurchaseData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryAddress: "",
    paymentMethod: "cash",
    notes: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    // Si no hay datos del cliente, asignar cliente genérico
    const finalPurchaseData = {
      ...purchaseData,
      customerName: purchaseData.customerName || "Cliente Mostrador",
      customerEmail: purchaseData.customerEmail || "mostrador@farmacia.local",
      customerPhone: purchaseData.customerPhone || "000-000-0000",
      deliveryAddress: purchaseData.deliveryAddress || "Entrega en mostrador"
    };
    
    setPurchaseData(finalPurchaseData);
    
    // Simular proceso de compra
    setTimeout(() => {
      toast({
        title: "¡Compra realizada con éxito!",
        description: `La orden para "${list.name}" ha sido procesada.`,
      });
      
      // Cerrar el modal de compra y mostrar el recibo
      setOpen(false);
      setShowReceipt(true);
      setStep(1);
    }, 1500);
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    // Resetear datos después de cerrar el recibo
    setPurchaseData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      deliveryAddress: "",
      paymentMethod: "cash",
      notes: "",
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <ShoppingCart className="h-4 w-4" />
              <h3 className="text-base font-semibold">Resumen de la orden</h3>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium mb-2 text-sm">{list.name}</h4>
              <div className="space-y-1">
                {list.products.slice(0, 3).map((product, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span>{product.name} x{product.quantity}</span>
                    <span>{formatCurrency(product.price * product.quantity)}</span>
                  </div>
                ))}
                {list.products.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{list.products.length - 3} productos más...
                  </div>
                )}
                <div className="border-t pt-1 flex justify-between font-semibold text-sm">
                  <span>Total:</span>
                  <span>{formatCurrency(list.total)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="customerName" className="text-xs">Nombre completo (opcional)</Label>
                <Input
                  id="customerName"
                  value={purchaseData.customerName}
                  onChange={(e) => setPurchaseData({ ...purchaseData, customerName: e.target.value })}
                  placeholder="Tu nombre completo"
                  className="h-8 text-sm"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="customerEmail" className="text-xs">Email (opcional)</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={purchaseData.customerEmail}
                  onChange={(e) => setPurchaseData({ ...purchaseData, customerEmail: e.target.value })}
                  placeholder="tu@email.com"
                  className="h-8 text-sm"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="customerPhone" className="text-xs">Teléfono (opcional)</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={purchaseData.customerPhone}
                  onChange={(e) => setPurchaseData({ ...purchaseData, customerPhone: e.target.value })}
                  placeholder="+57 300 123 4567"
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Truck className="h-4 w-4" />
              <h3 className="text-base font-semibold">Entrega y notas</h3>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="deliveryAddress" className="text-xs">Dirección de entrega (opcional)</Label>
                <Textarea
                  id="deliveryAddress"
                  value={purchaseData.deliveryAddress}
                  onChange={(e) => setPurchaseData({ ...purchaseData, deliveryAddress: e.target.value })}
                  placeholder="Calle 123 #45-67, Barrio, Ciudad"
                  rows={2}
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="notes" className="text-xs">Notas adicionales (opcional)</Label>
                <Textarea
                  id="notes"
                  value={purchaseData.notes}
                  onChange={(e) => setPurchaseData({ ...purchaseData, notes: e.target.value })}
                  placeholder="Instrucciones especiales para la entrega..."
                  rows={2}
                  className="text-sm"
                />
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2 text-sm">Información de entrega</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Entrega gratuita en Bogotá</li>
                <li>• Tiempo estimado: 24-48 horas</li>
                <li>• Horario: Lunes a viernes 8:00 AM - 6:00 PM</li>
                <li>• Sábados: 8:00 AM - 2:00 PM</li>
              </ul>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <CreditCard className="h-4 w-4" />
              <h3 className="text-base font-semibold">Método de pago</h3>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`p-3 border rounded-lg text-left ${
                    purchaseData.paymentMethod === 'cash' ? 'border-primary bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setPurchaseData({ ...purchaseData, paymentMethod: 'cash' })}
                >
                  <div className="font-medium text-sm">Efectivo</div>
                  <div className="text-xs text-muted-foreground">Pago contraentrega</div>
                </button>
                
                <button
                  type="button"
                  className={`p-3 border rounded-lg text-left ${
                    purchaseData.paymentMethod === 'card' ? 'border-primary bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setPurchaseData({ ...purchaseData, paymentMethod: 'card' })}
                >
                  <div className="font-medium text-sm">Tarjeta</div>
                  <div className="text-xs text-muted-foreground">Débito o crédito</div>
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium mb-2 text-sm">Resumen final</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Cliente:</span>
                  <span>{purchaseData.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span>{purchaseData.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span>Teléfono:</span>
                  <span>{purchaseData.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pago:</span>
                  <span>{purchaseData.paymentMethod === 'card' ? 'Tarjeta' : 'Efectivo'}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold text-sm">
                  <span>Total a pagar:</span>
                  <span>{formatCurrency(list.total)}</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] h-[580px] flex flex-col" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>
              Comprar lista: {list.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="mb-3 flex-shrink-0">
            <div className="flex gap-2">
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`flex-1 h-1.5 rounded ${
                    step >= stepNumber ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Datos</span>
              <span>Entrega</span>
              <span>Pago</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              {renderStep()}
            </div>
            
            <div className="flex justify-between gap-2 pt-4 flex-shrink-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => step > 1 ? setStep(step - 1) : setOpen(false)}
                className="h-9 text-sm"
              >
                {step > 1 ? 'Anterior' : 'Cancelar'}
              </Button>
              <Button type="submit" className="h-9 text-sm">
                {step < 3 ? 'Siguiente' : 'Confirmar compra'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Recibo de pago */}
      <PaymentReceipt
        isOpen={showReceipt}
        onClose={handleCloseReceipt}
        orderData={{
          list,
          customerName: purchaseData.customerName,
          customerEmail: purchaseData.customerEmail,
          customerPhone: purchaseData.customerPhone,
          deliveryAddress: purchaseData.deliveryAddress,
          paymentMethod: purchaseData.paymentMethod,
          notes: purchaseData.notes,
        }}
      />
    </>
  );
}