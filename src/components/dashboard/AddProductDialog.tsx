import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

interface AddProductDialogProps {
  onAddProduct: (product: Product, quantity: number) => void;
  availableProducts: Product[];
}

export function AddProductDialog({ onAddProduct, availableProducts }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId) {
      toast({
        title: "Error",
        description: "Debes seleccionar un producto",
        variant: "destructive",
      });
      return;
    }

    const product = availableProducts.find(p => p.id === parseInt(selectedProductId));
    if (!product) return;

    onAddProduct(product, quantity);
    
    // Reset form
    setSelectedProductId("");
    setQuantity(1);
    setOpen(false);
    
    toast({
      title: "Producto agregado",
      description: `${product.name} ha sido agregado a la lista`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agregar producto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar producto a la lista</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Producto *</Label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un producto" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    <div className="flex items-center gap-2">
                      <img src={product.image} alt={product.name} className="w-6 h-6 rounded object-cover" />
                      <span>{product.name}</span>
                      <span className="text-muted-foreground ml-auto">
                        ${product.price.toLocaleString()}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max="999"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Agregar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}