import { useState } from "react";
import { Plus, MoreHorizontal, Edit, Trash2, FolderTree } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import CategoryDialog from "./CategoryDialog";
import { 
  useCategories, 
  useDeleteCategory 
} from "@/hooks/useInventory";
import { type Category } from "@/api/inventory";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const CategoriesTab = () => {
  const [categoryDialog, setCategoryDialog] = useState<{
    open: boolean;
    category?: Category;
  }>({ open: false });
  
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    category?: Category;
  }>({ open: false });

  const { data: categoriesResponse, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();
  
  const categories = categoriesResponse?.data || [];

  const handleEdit = (category: Category) => {
    setCategoryDialog({ open: true, category });
  };

  const handleDelete = (category: Category) => {
    setDeleteDialog({ open: true, category });
  };

  const confirmDelete = async () => {
    if (deleteDialog.category) {
      try {
        await deleteCategory.mutateAsync(deleteDialog.category.id);
        setDeleteDialog({ open: false });
      } catch (error) {
        // Error handled by the hook
      }
    }
  };

  const getStatusVariant = (status: string) => {
    return status === 'active' ? 'default' : 'secondary';
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Activo' : 'Inactivo';
  };

  const findParentCategory = (parentId?: number) => {
    if (!parentId) return null;
    return categories.find(cat => cat.id === parentId);
  };

  // Organizar categorías en jerarquía para mostrar
  const organizeCategories = (categories: Category[]) => {
    const organized: Category[] = [];
    const added = new Set<number>();

    // Primero agregar categorías padre (sin parent_id)
    categories.forEach(category => {
      if (!category.parent_id && !added.has(category.id)) {
        organized.push(category);
        added.add(category.id);
      }
    });

    // Luego agregar subcategorías
    categories.forEach(category => {
      if (category.parent_id && !added.has(category.id)) {
        organized.push(category);
        added.add(category.id);
      }
    });

    return organized;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            Categorías
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Cargando categorías...</div>
        </CardContent>
      </Card>
    );
  }

  const organizedCategories = organizeCategories(categories);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FolderTree className="h-5 w-5" />
              Categorías
            </CardTitle>
            <Button
              onClick={() => setCategoryDialog({ open: true })}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <FolderTree className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-semibold">No hay categorías</p>
              <p className="text-muted-foreground mb-4">
                Comience creando su primera categoría
              </p>
              <Button onClick={() => setCategoryDialog({ open: true })}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Categoría
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Categoría Padre</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizedCategories.map((category) => {
                    const parentCategory = findParentCategory(category.parent_id);
                    const isSubcategory = !!category.parent_id;
                    
                    return (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          <div className={`${isSubcategory ? 'ml-6' : ''} flex items-center gap-2`}>
                            {isSubcategory && (
                              <div className="w-4 h-px bg-muted-foreground"></div>
                            )}
                            {category.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {category.description || "-"}
                        </TableCell>
                        <TableCell>
                          {parentCategory ? (
                            <span className="text-sm bg-muted px-2 py-1 rounded">
                              {parentCategory.name}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(category.status)}>
                            {getStatusText(category.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(category.created_at), "dd/MM/yyyy", { locale: es })}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(category)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(category)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CategoryDialog
        open={categoryDialog.open}
        onClose={() => setCategoryDialog({ open: false })}
        category={categoryDialog.category}
      />

      <AlertDialog open={deleteDialog.open} onOpenChange={() => setDeleteDialog({ open: false })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la categoría "
              {deleteDialog.category?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CategoriesTab;