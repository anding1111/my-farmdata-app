import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CategoryForm from "./CategoryForm";
import { type Category } from "@/api/inventory";
import { 
  useCreateCategory, 
  useUpdateCategory 
} from "@/hooks/useInventory";

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category?: Category;
}

const CategoryDialog = ({ open, onClose, category }: CategoryDialogProps) => {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const handleSubmit = async (data: any) => {
    try {
      if (category) {
        await updateCategory.mutateAsync({ id: category.id, data });
      } else {
        await createCategory.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      // Error handled by the hook
    }
  };

  const isLoading = createCategory.isPending || updateCategory.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? "Editar Categoría" : "Nueva Categoría"}
          </DialogTitle>
          <DialogDescription>
            {category 
              ? "Modifique los datos de la categoría"
              : "Complete los datos para crear una nueva categoría"
            }
          </DialogDescription>
        </DialogHeader>
        
        <CategoryForm
          category={category}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;