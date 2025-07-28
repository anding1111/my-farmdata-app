import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { 
  staticProducts, 
  staticCategories, 
  staticLaboratories, 
  staticSuppliers,
  staticBatches,
  getNextProductId,
  getNextCategoryId,
  getNextLabId,
  getNextSupplierId,
  getNextBatchId,
  type StaticProduct
} from '@/data/staticData';
import { 
  type Category, 
  type Laboratory, 
  type Supplier,
  type Batch,
  type ProductFormData,
  type CategoryFormData,
  type LaboratoryFormData,
  type SupplierFormData,
  type BatchFormData,
  type InventoryAlert
} from '@/types/inventory';

// Main state store
let productsStore = [...staticProducts];
let categoriesStore = [...staticCategories];
let laboratoriesStore = [...staticLaboratories];
let suppliersStore = [...staticSuppliers];
let batchesStore = [...staticBatches];

// Hook para productos con funcionalidad completa
export const useProducts = (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: number;
  status?: string;
  low_stock?: boolean;
}) => {
  const [products] = useState(productsStore);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (params?.search) {
      const search = params.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.code.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search) ||
        p.active_ingredient?.toLowerCase().includes(search)
      );
    }

    if (params?.category_id) {
      result = result.filter(p => p.category_id === params.category_id);
    }

    if (params?.status) {
      result = result.filter(p => p.status === params.status);
    }

    if (params?.low_stock) {
      result = result.filter(p => p.current_stock <= p.min_stock);
    }

    return result;
  }, [products, params]);

  return {
    data: { data: filteredProducts, total: filteredProducts.length },
    isLoading: false,
    error: null
  };
};

// Hook para un producto específico
export const useProduct = (id: number) => {
  const product = productsStore.find(p => p.id === id);
  return {
    data: product,
    isLoading: false,
    error: null
  };
};

// Hook para crear producto
export const useCreateProduct = () => {
  return {
    mutateAsync: async (data: ProductFormData) => {
      console.log('🆕 CREAR PRODUCTO - Datos recibidos:', data);
      
      const newProduct: StaticProduct = {
        id: getNextProductId(),
        code: data.code,
        barcode: data.barcode,
        name: data.name,
        description: data.description,
        category_id: data.category_id,
        laboratory_id: data.laboratory_id,
        active_ingredient: data.active_ingredient,
        concentration: data.concentration,
        presentation: data.presentation,
        purchase_price: data.purchase_price,
        sale_price: data.sale_price,
        current_stock: 0, // Inicia en 0
        min_stock: data.min_stock,
        max_stock: data.max_stock,
        location: data.location,
        requires_prescription: data.requires_prescription,
        status: data.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      productsStore.push(newProduct);
      console.log('✅ PRODUCTO CREADO:', newProduct);
      console.log('📊 TOTAL PRODUCTOS EN STORE:', productsStore.length);
      toast.success('Producto creado exitosamente');
      return newProduct;
    },
    isPending: false
  };
};

// Hook para actualizar producto
export const useUpdateProduct = () => {
  return {
    mutateAsync: async ({ id, data }: { id: number; data: Partial<StaticProduct> }) => {
      console.log('✏️ ACTUALIZAR PRODUCTO - ID:', id, 'Datos:', data);
      
      const index = productsStore.findIndex(p => p.id === id);
      if (index !== -1) {
        productsStore[index] = {
          ...productsStore[index],
          ...data,
          updated_at: new Date().toISOString()
        };
        console.log('✅ PRODUCTO ACTUALIZADO:', productsStore[index]);
        toast.success('Producto actualizado exitosamente');
        return productsStore[index];
      }
      throw new Error('Producto no encontrado');
    },
    isPending: false
  };
};

// Hook para eliminar producto
export const useDeleteProduct = () => {
  return {
    mutateAsync: async (id: number) => {
      console.log('🗑️ ELIMINAR PRODUCTO - ID:', id);
      
      const index = productsStore.findIndex(p => p.id === id);
      if (index !== -1) {
        const deletedProduct = productsStore.splice(index, 1)[0];
        console.log('✅ PRODUCTO ELIMINADO:', deletedProduct);
        console.log('📊 TOTAL PRODUCTOS EN STORE:', productsStore.length);
        toast.success('Producto eliminado exitosamente');
        return deletedProduct;
      }
      throw new Error('Producto no encontrado');
    },
    isPending: false
  };
};

// Hook para categorías
export const useCategories = () => {
  return {
    data: { data: categoriesStore },
    isLoading: false,
    error: null
  };
};

// Hook para crear categoría
export const useCreateCategory = () => {
  return {
    mutateAsync: async (data: CategoryFormData) => {
      const newCategory: Category = {
        id: getNextCategoryId(),
        name: data.name,
        description: data.description,
        parent_id: data.parent_id,
        status: data.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      categoriesStore.push(newCategory);
      console.log('✅ CATEGORÍA CREADA:', newCategory);
      toast.success('Categoría creada exitosamente');
      return newCategory;
    },
    isPending: false
  };
};

// Hook para actualizar categoría
export const useUpdateCategory = () => {
  return {
    mutateAsync: async ({ id, data }: { id: number; data: Partial<Category> }) => {
      const index = categoriesStore.findIndex(c => c.id === id);
      if (index !== -1) {
        categoriesStore[index] = {
          ...categoriesStore[index],
          ...data,
          updated_at: new Date().toISOString()
        };
        console.log('✅ CATEGORÍA ACTUALIZADA:', categoriesStore[index]);
        toast.success('Categoría actualizada exitosamente');
        return categoriesStore[index];
      }
      throw new Error('Categoría no encontrada');
    },
    isPending: false
  };
};

// Hook para eliminar categoría
export const useDeleteCategory = () => {
  return {
    mutateAsync: async (id: number) => {
      const index = categoriesStore.findIndex(c => c.id === id);
      if (index !== -1) {
        const deleted = categoriesStore.splice(index, 1)[0];
        console.log('✅ CATEGORÍA ELIMINADA:', deleted);
        toast.success('Categoría eliminada exitosamente');
        return deleted;
      }
      throw new Error('Categoría no encontrada');
    },
    isPending: false
  };
};

// Hook para laboratorios
export const useLaboratories = () => {
  return {
    data: { data: laboratoriesStore },
    isLoading: false,
    error: null
  };
};

// Hook para crear laboratorio
export const useCreateLaboratory = () => {
  return {
    mutateAsync: async (data: LaboratoryFormData) => {
      const newLab: Laboratory = {
        id: getNextLabId(),
        name: data.name,
        contact_info: data.contact_info,
        phone: data.phone,
        email: data.email,
        address: data.address,
        status: data.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      laboratoriesStore.push(newLab);
      console.log('✅ LABORATORIO CREADO:', newLab);
      toast.success('Laboratorio creado exitosamente');
      return newLab;
    },
    isPending: false
  };
};

// Hook para proveedores
export const useSuppliers = () => {
  return {
    data: { data: suppliersStore },
    isLoading: false,
    error: null
  };
};

// Hook para crear proveedor
export const useCreateSupplier = () => {
  return {
    mutateAsync: async (data: SupplierFormData) => {
      const newSupplier: Supplier = {
        id: getNextSupplierId(),
        name: data.name,
        contact_person: data.contact_person,
        phone: data.phone,
        email: data.email,
        address: data.address,
        tax_id: data.tax_id,
        status: data.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      suppliersStore.push(newSupplier);
      console.log('✅ PROVEEDOR CREADO:', newSupplier);
      toast.success('Proveedor creado exitosamente');
      return newSupplier;
    },
    isPending: false
  };
};

// Hook para lotes
export const useBatches = (productId?: number) => {
  const batches = productId 
    ? batchesStore.filter(b => b.product_id === productId)
    : batchesStore;
  
  return {
    data: { data: batches },
    isLoading: false,
    error: null
  };
};

export const useAllBatches = () => {
  return {
    data: { data: batchesStore },
    isLoading: false,
    error: null
  };
};

// Hook para crear lote
export const useCreateBatch = () => {
  return {
    mutateAsync: async (data: BatchFormData) => {
      const newBatch: Batch = {
        id: getNextBatchId(),
        product_id: data.product_id,
        batch_number: data.batch_number,
        manufacture_date: data.manufacture_date,
        expiry_date: data.expiry_date,
        purchase_date: data.purchase_date,
        quantity: data.quantity,
        remaining_quantity: data.quantity,
        purchase_price: data.purchase_price,
        supplier_id: data.supplier_id,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      batchesStore.push(newBatch);
      
      // Update product stock
      const productIndex = productsStore.findIndex(p => p.id === data.product_id);
      if (productIndex !== -1) {
        productsStore[productIndex].current_stock += data.quantity;
      }

      console.log('✅ LOTE CREADO:', newBatch);
      toast.success('Lote creado exitosamente');
      return newBatch;
    },
    isPending: false
  };
};

// Hook para actualizar lote
export const useUpdateBatch = () => {
  return {
    mutateAsync: async ({ id, data }: { id: number; data: Partial<Batch> }) => {
      const index = batchesStore.findIndex(b => b.id === id);
      if (index !== -1) {
        batchesStore[index] = {
          ...batchesStore[index],
          ...data,
          updated_at: new Date().toISOString()
        };
        console.log('✅ LOTE ACTUALIZADO:', batchesStore[index]);
        toast.success('Lote actualizado exitosamente');
        return batchesStore[index];
      }
      throw new Error('Lote no encontrado');
    },
    isPending: false
  };
};

// Hook para eliminar lote
export const useDeleteBatch = () => {
  return {
    mutateAsync: async (id: number) => {
      const index = batchesStore.findIndex(b => b.id === id);
      if (index !== -1) {
        const deleted = batchesStore.splice(index, 1)[0];
        console.log('✅ LOTE ELIMINADO:', deleted);
        toast.success('Lote eliminado exitosamente');
        return deleted;
      }
      throw new Error('Lote no encontrado');
    },
    isPending: false
  };
};

// Hook para estadísticas del inventario
export const useInventoryStats = () => {
  const stats = useMemo(() => {
    const totalProducts = productsStore.length;
    const totalValue = productsStore.reduce((sum, product) => 
      sum + (product.current_stock * product.purchase_price), 0);
    const lowStockProducts = productsStore.filter(product => 
      product.current_stock <= product.min_stock).length;
    const expiringProducts = 0; // Simplified for demo
    const pendingAlerts = lowStockProducts;

    return {
      totalProducts,
      totalValue,
      lowStockProducts,
      expiringProducts,
      pendingAlerts,
    };
  }, []);

  return stats;
};

// Hook básico para búsqueda de productos
export const useSearchProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StaticProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const search = query.toLowerCase();
      const results = productsStore.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.code.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      );
      setSearchResults(results);
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

// Hooks adicionales con implementaciones básicas
export const useAlerts = () => ({ data: { data: [] }, isLoading: false });
export const useMarkAlertAsRead = () => ({ mutateAsync: async () => {}, isPending: false });
export const useInventoryMovements = () => ({ data: { data: [] }, isLoading: false });
export const useCreateMovement = () => ({ mutateAsync: async () => {}, isPending: false });
export const useAdjustStock = () => ({ mutateAsync: async () => {}, isPending: false });
export const useProductReceipt = () => ({ mutateAsync: async () => {}, isPending: false });
export const useInventoryReport = () => ({ data: null, isLoading: false });
export const useExpiryReport = () => ({ data: null, isLoading: false });
export const useLowStockReport = () => ({ data: null, isLoading: false });
export const useValuationReport = () => ({ data: null, isLoading: false });
export const useLocations = () => ({ data: { data: [] }, isLoading: false });
export const useLocation = () => ({ data: null, isLoading: false });
export const useCreateLocation = () => ({ mutateAsync: async () => {}, isPending: false });
export const useUpdateLocation = () => ({ mutateAsync: async () => {}, isPending: false });
export const useDeleteLocation = () => ({ mutateAsync: async () => {}, isPending: false });
export const useProductLocations = () => ({ data: { data: [] }, isLoading: false });
export const useCreateProductLocation = () => ({ mutateAsync: async () => {}, isPending: false });
export const useUpdateProductLocation = () => ({ mutateAsync: async () => {}, isPending: false });
export const useDeleteProductLocation = () => ({ mutateAsync: async () => {}, isPending: false });
export const useSearchLocations = () => ({ searchQuery: '', setSearchQuery: () => {}, searchResults: [], isSearching: false });
export const useMovements = () => ({ data: { data: [] }, isLoading: false });
export const useUpdateMovement = () => ({ mutateAsync: async () => {}, isPending: false });
export const useDeleteMovement = () => ({ mutateAsync: async () => {}, isPending: false });
export const useSearchMovements = () => ({ searchQuery: '', setSearchQuery: () => {}, searchResults: [], isSearching: false });