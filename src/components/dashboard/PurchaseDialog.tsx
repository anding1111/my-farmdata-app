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

interface PurchaseDialogProps {
  list: ProductList;
  children: React.ReactNode;
}

export function PurchaseDialog({ list, children }: PurchaseDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [purchaseData, setPurchaseData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryAddress: "",
    paymentMethod: "card",
    notes: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    // Simular proceso de compra
    setTimeout(() => {
      toast({
        title: "¡Compra realizada con éxito!",
        description: `La orden para "${list.name}" ha sido procesada. Recibirás un email de confirmación.`,
      });
      
      setOpen(false);
      setStep(1);
      setPurchaseData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        deliveryAddress: "",
        paymentMethod: "card",
        notes: "",
      });
    }, 1500);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <ShoppingCart className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Resumen de la orden</h3>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">{list.name}</h4>
              <div className="space-y-2">
                {list.products.slice(0, 3).map((product, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{product.name} x{product.quantity}</span>
                    <span>{formatCurrency(product.price * product.quantity)}</span>
                  </div>
                ))}
                {list.products.length > 3 && (
                  <div className="text-sm text-muted-foreground">
                    +{list.products.length - 3} productos más...
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(list.total)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nombre completo *</Label>
                <Input
                  id="customerName"
                  value={purchaseData.customerName}
                  onChange={(e) => setPurchaseData({ ...purchaseData, customerName: e.target.value })}
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={purchaseData.customerEmail}
                  onChange={(e) => setPurchaseData({ ...purchaseData, customerEmail: e.target.value })}
                  placeholder="tu@email.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Teléfono *</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={purchaseData.customerPhone}
                  onChange={(e) => setPurchaseData({ ...purchaseData, customerPhone: e.target.value })}
                  placeholder="+57 300 123 4567"
                  required
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Truck className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Entrega y notas</h3>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Dirección de entrega *</Label>
                <Textarea
                  id="deliveryAddress"
                  value={purchaseData.deliveryAddress}
                  onChange={(e) => setPurchaseData({ ...purchaseData, deliveryAddress: e.target.value })}
                  placeholder="Calle 123 #45-67, Barrio, Ciudad"
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                <Textarea
                  id="notes"
                  value={purchaseData.notes}
                  onChange={(e) => setPurchaseData({ ...purchaseData, notes: e.target.value })}
                  placeholder="Instrucciones especiales para la entrega..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Información de entrega</h4>
              <ul className="text-sm text-blue-800 space-y-1">
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
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <CreditCard className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Método de pago</h3>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`p-4 border rounded-lg text-left ${
                    purchaseData.paymentMethod === 'card' ? 'border-primary bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setPurchaseData({ ...purchaseData, paymentMethod: 'card' })}
                >
                  <div className="font-medium">Tarjeta</div>
                  <div className="text-sm text-muted-foreground">Débito o crédito</div>
                </button>
                
                <button
                  type="button"
                  className={`p-4 border rounded-lg text-left ${
                    purchaseData.paymentMethod === 'cash' ? 'border-primary bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setPurchaseData({ ...purchaseData, paymentMethod: 'cash' })}
                >
                  <div className="font-medium">Efectivo</div>
                  <div className="text-sm text-muted-foreground">Pago contraentrega</div>
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-3">Resumen final</h4>
              <div className="space-y-2 text-sm">
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
                <div className="border-t pt-2 flex justify-between font-semibold">
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Comprar lista: {list.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <div className="flex gap-2">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex-1 h-2 rounded ${
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
        
        <form onSubmit={handleSubmit}>
          {renderStep()}
          
          <div className="flex justify-between gap-2 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => step > 1 ? setStep(step - 1) : setOpen(false)}
            >
              {step > 1 ? 'Anterior' : 'Cancelar'}
            </Button>
            <Button type="submit">
              {step < 3 ? 'Siguiente' : 'Confirmar compra'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}