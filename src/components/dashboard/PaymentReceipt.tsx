import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, FileText, Printer, Download } from "lucide-react";
import { formatCurrency } from "@/data/mockData";
import { ProductList } from "@/types/product";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PaymentReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    list: ProductList;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: string;
    paymentMethod: string;
    notes?: string;
  };
}

export function PaymentReceipt({ isOpen, onClose, orderData }: PaymentReceiptProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  // Generar número de factura único
  const invoiceNumber = `INV${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${new Date().getFullYear().toString().slice(-2)}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}`;
  
  // Calcular subtotal, descuento y total
  const subtotal = orderData.list.total;
  const discount = Math.round(subtotal * 0.1); // 10% descuento
  const finalTotal = subtotal - discount;

  const handlePrint = () => {
    const receiptElement = document.getElementById('receipt-content');
    if (receiptElement) {
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Recibo de Pago - ${invoiceNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .receipt { max-width: 600px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 30px; }
                .amount { font-size: 2rem; font-weight: bold; margin: 20px 0; }
                .invoice-number { color: #666; margin-bottom: 20px; }
                .status { background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; display: inline-block; }
                .section { margin: 20px 0; }
                .product-item { border-bottom: 1px solid #eee; padding: 10px 0; display: flex; justify-content: space-between; }
                .totals { border-top: 2px solid #eee; padding-top: 15px; margin-top: 15px; }
                .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
                .final-total { font-weight: bold; font-size: 1.1rem; }
                .billing-info { background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; }
              </style>
            </head>
            <body>
              ${receiptElement.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const receiptElement = document.getElementById('receipt-content');
      if (receiptElement) {
        const canvas = await html2canvas(receiptElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 190;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        
        let position = 10;
        
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight + 10;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save(`recibo-${invoiceNumber}.pdf`);
      }
    } catch (error) {
      console.error('Error al generar PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md w-full mx-4 p-0 overflow-hidden bg-white h-[90vh] flex flex-col"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        {/* Header mínimo */}
        <div className="flex justify-end p-2">
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 transition-colors rounded"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Contenido del recibo - con scroll */}
        <div className="flex-1 overflow-y-auto">
          <div id="receipt-content" className="px-4">
            {/* Icono y monto principal */}
            <div className="text-center mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-xl font-bold text-gray-900 mb-1">
                {formatCurrency(finalTotal)}
              </div>
              <div className="text-gray-500 text-xs">
                No. {invoiceNumber}
              </div>
            </div>

            {/* Información de estado y fecha */}
            <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
              <div>
                <div className="text-gray-500 mb-1">Estado</div>
                <div className="font-medium">Pagado</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Fecha de Pago</div>
                <div className="font-medium">
                  {new Date().toLocaleDateString('es-ES', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
            </div>

          {/* Información de facturación */}
          <div className="bg-gray-50 rounded-lg p-2 mb-3">
            <div className="text-xs">
              <div className="font-medium mb-1">Facturado a</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="mb-1">{orderData.customerEmail}</div>
                  <div className="font-medium">{orderData.customerName}</div>
                </div>
                <div>
                  <div className="text-gray-600">Detalles de facturación</div>
                  <div className="text-gray-600">{orderData.customerPhone}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de productos */}
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-2">Productos</div>
            <div className={`space-y-1 ${orderData.list.products.length > 5 ? 'max-h-48 overflow-y-auto' : ''}`}>
              {orderData.list.products.map((product, index) => (
                <div key={index} className="flex justify-between items-start py-1">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs">{product.name}</div>
                    <div className="text-xs text-gray-500">
                      {product.quantity}x {formatCurrency(product.price)}
                    </div>
                  </div>
                  <div className="text-xs font-medium ml-2">
                    {formatCurrency(product.price * product.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          </div>
        </div>

        {/* Footer fijo con totales */}
        <div className="bg-white border-t p-4">
          <div className="space-y-1 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>Total</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12"
            onClick={handleGeneratePDF}
            disabled={isGeneratingPDF}
          >
            <Download className="w-4 h-4 mr-2" />
            {isGeneratingPDF ? 'Generando...' : 'Enviar PDF'}
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-12"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}