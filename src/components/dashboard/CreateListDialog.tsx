import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Heart, Home, Stethoscope, Pill, Baby } from "lucide-react";
import { CreateListData } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

interface CreateListDialogProps {
  onCreateList: (data: CreateListData) => void;
}

const colors = [
  { name: "Azul", value: "blue", bg: "bg-blue-500" },
  { name: "Verde", value: "green", bg: "bg-green-500" },
  { name: "Rojo", value: "red", bg: "bg-red-500" },
  { name: "Púrpura", value: "purple", bg: "bg-purple-500" },
  { name: "Naranja", value: "orange", bg: "bg-orange-500" },
  { name: "Rosa", value: "pink", bg: "bg-pink-500" },
];

const icons = [
  { name: "Corazón", value: "heart", Icon: Heart },
  { name: "Casa", value: "home", Icon: Home },
  { name: "Estetoscopio", value: "stethoscope", Icon: Stethoscope },
  { name: "Píldora", value: "pill", Icon: Pill },
  { name: "Bebé", value: "baby", Icon: Baby },
];

export function CreateListDialog({ onCreateList }: CreateListDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateListData>({
    name: "",
    description: "",
    color: "blue",
    icon: "heart",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la lista es requerido",
        variant: "destructive",
      });
      return;
    }

    onCreateList(formData);
    
    // Reset form
    setFormData({
      name: "",
      description: "",
      color: "blue",
      icon: "heart",
    });
    
    setOpen(false);
    
    toast({
      title: "Lista creada",
      description: `La lista "${formData.name}" ha sido creada exitosamente`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-blue-500 flex items-center">
          <Plus className="h-5 w-5 mr-2" /> Añadir nueva lista
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear nueva lista</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la lista *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Mis vitaminas diarias"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Breve descripción de la lista..."
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`w-8 h-8 rounded-full ${color.bg} ${
                    formData.color === color.value ? "ring-2 ring-offset-2 ring-gray-400" : ""
                  }`}
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Icono</Label>
            <div className="flex gap-2">
              {icons.map((icon) => (
                <button
                  key={icon.value}
                  type="button"
                  className={`p-2 rounded-md border ${
                    formData.icon === icon.value ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                  onClick={() => setFormData({ ...formData, icon: icon.value })}
                  title={icon.name}
                >
                  <icon.Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear lista</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}