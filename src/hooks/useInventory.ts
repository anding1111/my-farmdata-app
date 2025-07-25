import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi, type Product, type Category, type Laboratory, type Supplier, type InventoryAlert, type Batch, type Location, type ProductLocation } from '@/api/inventory';
import { toast } from 'sonner';

// Hook para productos
export const useProducts = (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: number;
  status?: string;
  low_stock?: boolean;
}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => inventoryApi.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para un producto específico
export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => inventoryApi.getProduct(id),
    enabled: !!id,
  });
};

// Hook para crear producto
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto creado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear el producto');
    },
  });
};

// Hook para actualizar producto
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      inventoryApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar el producto');
    },
  });
};

// Hook para eliminar producto
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar el producto');
    },
  });
};

// Hook para categorías
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: inventoryApi.getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para crear categoría
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoría creada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear la categoría');
    },
  });
};

// Hook para actualizar categoría
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Category> }) =>
      inventoryApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoría actualizada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar la categoría');
    },
  });
};

// Hook para eliminar categoría
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoría eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar la categoría');
    },
  });
};

// Hook para laboratorios
export const useLaboratories = () => {
  return useQuery({
    queryKey: ['laboratories'],
    queryFn: inventoryApi.getLaboratories,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para crear laboratorio
export const useCreateLaboratory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.createLaboratory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratories'] });
      toast.success('Laboratorio creado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear el laboratorio');
    },
  });
};

// Hook para proveedores
export const useSuppliers = () => {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: inventoryApi.getSuppliers,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para crear proveedor
export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Proveedor creado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear el proveedor');
    },
  });
};

// Hook para lotes
export const useBatches = (productId?: number) => {
  return useQuery({
    queryKey: ['batches', productId],
    queryFn: () => inventoryApi.getBatches(productId),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para crear lote
export const useCreateBatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.createBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Lote creado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear el lote');
    },
  });
};

export const useAllBatches = () => {
  return useQuery({
    queryKey: ['batches'],
    queryFn: () => inventoryApi.getBatches(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useUpdateBatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Batch> }) =>
      inventoryApi.updateBatch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Lote actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar el lote');
    },
  });
};

export const useDeleteBatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.deleteBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Lote eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar el lote');
    },
  });
};

// Hook para movimientos
export const useMovements = (params?: {
  page?: number;
  per_page?: number;
  product_id?: number;
  movement_type?: string;
  date_from?: string;
  date_to?: string;
}) => {
  return useQuery({
    queryKey: ['movements', params],
    queryFn: () => inventoryApi.getMovements(params),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para crear movimiento
export const useCreateMovement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.createMovement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast.success('Movimiento registrado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al registrar el movimiento');
    },
  });
};

// Hook para alertas
export const useAlerts = (params?: {
  type?: string;
  priority?: string;
  is_read?: boolean;
}) => {
  return useQuery({
    queryKey: ['alerts', params],
    queryFn: () => inventoryApi.getAlerts(params),
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
};

// Hook para marcar alerta como leída
export const useMarkAlertAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.markAlertAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al marcar la alerta');
    },
  });
};

// Hook para ajustar stock
export const useAdjustStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.adjustStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast.success('Ajuste de inventario realizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al ajustar el inventario');
    },
  });
};

// Hook para ingreso de productos desde proveedores
export const useProductReceipt = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.receiveProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
      toast.success('Productos recibidos exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al recibir productos');
    },
  });
};

// Hook para reportes
export const useInventoryReport = () => {
  return useQuery({
    queryKey: ['inventory-report'],
    queryFn: inventoryApi.getInventoryReport,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useExpiryReport = (days?: number) => {
  return useQuery({
    queryKey: ['expiry-report', days],
    queryFn: () => inventoryApi.getExpiryReport(days),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useLowStockReport = () => {
  return useQuery({
    queryKey: ['low-stock-report'],
    queryFn: inventoryApi.getLowStockReport,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useValuationReport = () => {
  return useQuery({
    queryKey: ['valuation-report'],
    queryFn: inventoryApi.getValuationReport,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para búsqueda de productos
export const useSearchProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await inventoryApi.searchProducts(query);
      setSearchResults(results.data || []);
    } catch (error) {
      console.error('Error al buscar productos:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchProducts(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchProducts,
  };
};

// Hook para estadísticas del inventario
export const useInventoryStats = () => {
  const [stats, setStats] = useState<{
    totalProducts: number;
    totalValue: number;
    lowStockProducts: number;
    expiringProducts: number;
    pendingAlerts: number;
  }>({
    totalProducts: 0,
    totalValue: 0,
    lowStockProducts: 0,
    expiringProducts: 0,
    pendingAlerts: 0,
  });

  const { data: products } = useProducts();
  const { data: alerts } = useAlerts({ is_read: false });

  useEffect(() => {
    if (products?.data) {
      const productList = products.data;
      const totalProducts = productList.length;
      const totalValue = productList.reduce((sum: number, product: Product) => 
        sum + (product.current_stock * product.purchase_price), 0);
      const lowStockProducts = productList.filter((product: Product) => 
        product.current_stock <= product.min_stock).length;

      setStats(prev => ({
        ...prev,
        totalProducts,
        totalValue,
        lowStockProducts,
      }));
    }

    if (alerts?.data) {
      const pendingAlerts = alerts.data.length;
      const expiringProducts = alerts.data.filter((alert: InventoryAlert) => 
        alert.type === 'expiry_warning' || alert.type === 'expired').length;

      setStats(prev => ({
        ...prev,
        pendingAlerts,
        expiringProducts,
      }));
    }
  }, [products, alerts]);

  return stats;
};

// ========== HOOKS PARA UBICACIONES ==========

// Hook para ubicaciones
export const useLocations = (params?: {
  search?: string;
  type?: string;
  parent_id?: number;
  status?: string;
  has_products?: boolean;
}) => {
  return useQuery({
    queryKey: ['locations', params],
    queryFn: () => inventoryApi.getLocations(params),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para una ubicación específica
export const useLocation = (id: number) => {
  return useQuery({
    queryKey: ['location', id],
    queryFn: () => inventoryApi.getLocation(id),
    enabled: !!id,
  });
};

// Hook para crear ubicación
export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Ubicación creada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear la ubicación');
    },
  });
};

// Hook para actualizar ubicación
export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Location> }) =>
      inventoryApi.updateLocation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Ubicación actualizada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar la ubicación');
    },
  });
};

// Hook para eliminar ubicación
export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Ubicación eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar la ubicación');
    },
  });
};

// Hook para ubicaciones de productos
export const useProductLocations = (params?: {
  product_id?: number;
  location_id?: number;
}) => {
  return useQuery({
    queryKey: ['product-locations', params],
    queryFn: () => inventoryApi.getProductLocations(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para crear ubicación de producto
export const useCreateProductLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.createProductLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-locations'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Producto asignado a ubicación exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al asignar producto a ubicación');
    },
  });
};

// Hook para actualizar ubicación de producto
export const useUpdateProductLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductLocation> }) =>
      inventoryApi.updateProductLocation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-locations'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Asignación de producto actualizada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar la asignación');
    },
  });
};

// Hook para eliminar ubicación de producto
export const useDeleteProductLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.deleteProductLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-locations'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Asignación de producto eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar la asignación');
    },
  });
};

// Hook para búsqueda de ubicaciones
export const useSearchLocations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await inventoryApi.searchLocations(query);
      setSearchResults(results.data || []);
    } catch (error) {
      console.error('Error al buscar ubicaciones:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchLocations(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchLocations,
  };
};

// Movement hooks
export const useMovements = (filters?: any) => {
  return useQuery({
    queryKey: ['movements', filters],
    queryFn: () => inventoryApi.getMovements(filters),
  });
};

export const useUpdateMovement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      inventoryApi.updateMovement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      toast.success('Movimiento actualizado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar el movimiento');
    },
  });
};

export const useDeleteMovement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => inventoryApi.deleteMovement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      toast.success('Movimiento eliminado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar el movimiento');
    },
  });
};

export const useSearchMovements = (query: string) => {
  return useQuery({
    queryKey: ['search-movements', query],
    queryFn: () => inventoryApi.searchMovements(query),
    enabled: query.length > 0,
  });
};