import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductReceiptForm from "./ProductReceiptForm";
import { ProductReceiptFormData } from "@/types/inventory";

interface ProductReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductReceiptDialog = ({ open, onOpenChange }: ProductReceiptDialogProps) => {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Recibir Productos de Proveedor</DialogTitle>
        </DialogHeader>
        <ProductReceiptForm 
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductReceiptDialog;