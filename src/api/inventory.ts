const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Mock data for categories
let mockCategories: Category[] = [
  {
    id: 1,
    name: "Vitaminas",
    description: "Suplementos vitamínicos y minerales",
    status: "active",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Articulaciones",
    description: "Productos para la salud articular",
    status: "active",
    created_at: "2024-01-16T10:30:00Z",
    updated_at: "2024-01-16T10:30:00Z"
  },
  {
    id: 3,
    name: "Cardiovascular",
    description: "Productos para la salud del corazón",
    status: "active",
    created_at: "2024-01-17T10:30:00Z",
    updated_at: "2024-01-17T10:30:00Z"
  },
  {
    id: 4,
    name: "Pediátrico",
    description: "Productos para niños",
    status: "active",
    created_at: "2024-01-18T10:30:00Z",
    updated_at: "2024-01-18T10:30:00Z"
  },
  {
    id: 5,
    name: "Vitaminas Pediátricas",
    description: "Vitaminas específicas para niños",
    parent_id: 4,
    status: "active",
    created_at: "2024-01-19T10:30:00Z",
    updated_at: "2024-01-19T10:30:00Z"
  }
];

let nextCategoryId = 6;

// Función helper para hacer requests autenticados
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  
  // Mock implementation for categories
  if (url.includes('/api/inventory/categories')) {
    return mockFetchCategories(url, options);
  }
  
  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
};

// Mock fetch for categories
const mockFetchCategories = async (url: string, options: RequestInit = {}) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const method = options.method || 'GET';
  
  if (method === 'GET' && url === '/api/inventory/categories') {
    return new Response(JSON.stringify({
      success: true,
      data: mockCategories
    }), { status: 200 });
  }
  
  if (method === 'POST' && url === '/api/inventory/categories') {
    const body = JSON.parse(options.body as string);
    const newCategory: Category = {
      id: nextCategoryId++,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockCategories.push(newCategory);
    return new Response(JSON.stringify({
      success: true,
      data: newCategory
    }), { status: 201 });
  }
  
  if (method === 'PUT' && url.match(/\/api\/inventory\/categories\/\d+/)) {
    const id = parseInt(url.split('/').pop()!);
    const body = JSON.parse(options.body as string);
    const categoryIndex = mockCategories.findIndex(c => c.id === id);
    
    if (categoryIndex === -1) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Categoría no encontrada'
      }), { status: 404 });
    }
    
    mockCategories[categoryIndex] = {
      ...mockCategories[categoryIndex],
      ...body,
      updated_at: new Date().toISOString()
    };
    
    return new Response(JSON.stringify({
      success: true,
      data: mockCategories[categoryIndex]
    }), { status: 200 });
  }
  
  if (method === 'DELETE' && url.match(/\/api\/inventory\/categories\/\d+/)) {
    const id = parseInt(url.split('/').pop()!);
    const categoryIndex = mockCategories.findIndex(c => c.id === id);
    
    if (categoryIndex === -1) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Categoría no encontrada'
      }), { status: 404 });
    }
    
    // Check if category has subcategories
    const hasSubcategories = mockCategories.some(c => c.parent_id === id);
    if (hasSubcategories) {
      return new Response(JSON.stringify({
        success: false,
        message: 'No se puede eliminar una categoría que tiene subcategorías'
      }), { status: 400 });
    }
    
    mockCategories.splice(categoryIndex, 1);
    return new Response(JSON.stringify({
      success: true,
      message: 'Categoría eliminada exitosamente'
    }), { status: 200 });
  }
  
  return new Response(JSON.stringify({
    success: false,
    message: 'Endpoint no encontrado'
  }), { status: 404 });
};

// Función helper para manejar respuestas de la API
const handleApiResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Error en la solicitud');
  }
  
  return data;
};

export interface Product {
  id: number;
  code: string;
  barcode?: string;
  name: string;
  description?: string;
  category_id: number;
  category?: Category;
  laboratory_id?: number;
  laboratory?: Laboratory;
  active_ingredient?: string;
  concentration?: string;
  presentation?: string;
  purchase_price: number;
  sale_price: number;
  min_stock: number;
  max_stock: number;
  current_stock: number;
  location?: string;
  requires_prescription: boolean;
  status: 'active' | 'inactive' | 'discontinued';
  created_at: string;
  updated_at: string;
  batches?: Batch[];
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Laboratory {
  id: number;
  name: string;
  contact_info?: string;
  phone?: string;
  email?: string;
  address?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: number;
  product_id: number;
  product?: Product;
  batch_number: string;
  manufacture_date: string;
  expiry_date: string;
  purchase_date: string;
  quantity: number;
  remaining_quantity: number;
  purchase_price: number;
  supplier_id?: number;
  supplier?: Supplier;
  status: 'active' | 'expired' | 'recalled';
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  tax_id?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface InventoryMovement {
  id: number;
  product_id: number;
  product?: Product;
  batch_id?: number;
  batch?: Batch;
  movement_type: 'entry' | 'exit' | 'adjustment' | 'transfer';
  quantity: number;
  unit_cost?: number;
  total_cost?: number;
  reason: string;
  reference_document?: string;
  user_id: number;
  user?: any;
  created_at: string;
  updated_at: string;
}

export interface InventoryAlert {
  id: number;
  type: 'low_stock' | 'expiry_warning' | 'expired' | 'out_of_stock';
  product_id: number;
  product?: Product;
  batch_id?: number;
  batch?: Batch;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

// API del inventario
export const inventoryApi = {
  // ========== PRODUCTOS ==========
  getProducts: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    category_id?: number;
    status?: string;
    low_stock?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category_id) queryParams.append('category_id', params.category_id.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.low_stock) queryParams.append('low_stock', 'true');

    const response = await authenticatedFetch(`/api/inventory/products?${queryParams}`);
    return handleApiResponse(response);
  },

  getProduct: async (id: number) => {
    const response = await authenticatedFetch(`/api/inventory/products/${id}`);
    return handleApiResponse(response);
  },

  createProduct: async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'current_stock'>) => {
    const response = await authenticatedFetch('/api/inventory/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return handleApiResponse(response);
  },

  updateProduct: async (id: number, productData: Partial<Product>) => {
    const response = await authenticatedFetch(`/api/inventory/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    return handleApiResponse(response);
  },

  deleteProduct: async (id: number) => {
    const response = await authenticatedFetch(`/api/inventory/products/${id}`, {
      method: 'DELETE',
    });
    return handleApiResponse(response);
  },

  // ========== CATEGORÍAS ==========
  getCategories: async () => {
    const response = await authenticatedFetch('/api/inventory/categories');
    return handleApiResponse(response);
  },

  createCategory: async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await authenticatedFetch('/api/inventory/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
    return handleApiResponse(response);
  },

  updateCategory: async (id: number, categoryData: Partial<Category>) => {
    const response = await authenticatedFetch(`/api/inventory/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
    return handleApiResponse(response);
  },

  deleteCategory: async (id: number) => {
    const response = await authenticatedFetch(`/api/inventory/categories/${id}`, {
      method: 'DELETE',
    });
    return handleApiResponse(response);
  },

  // ========== LABORATORIOS ==========
  getLaboratories: async () => {
    const response = await authenticatedFetch('/api/inventory/laboratories');
    return handleApiResponse(response);
  },

  createLaboratory: async (labData: Omit<Laboratory, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await authenticatedFetch('/api/inventory/laboratories', {
      method: 'POST',
      body: JSON.stringify(labData),
    });
    return handleApiResponse(response);
  },

  // ========== LOTES ==========
  getBatches: async (productId?: number) => {
    const url = productId 
      ? `/api/inventory/batches?product_id=${productId}`
      : '/api/inventory/batches';
    const response = await authenticatedFetch(url);
    return handleApiResponse(response);
  },

  createBatch: async (batchData: Omit<Batch, 'id' | 'created_at' | 'updated_at' | 'remaining_quantity'>) => {
    const response = await authenticatedFetch('/api/inventory/batches', {
      method: 'POST',
      body: JSON.stringify(batchData),
    });
    return handleApiResponse(response);
  },

  updateBatch: async (id: number, batchData: Partial<Batch>) => {
    const response = await authenticatedFetch(`/api/inventory/batches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(batchData),
    });
    return handleApiResponse(response);
  },

  // ========== PROVEEDORES ==========
  getSuppliers: async () => {
    const response = await authenticatedFetch('/api/inventory/suppliers');
    return handleApiResponse(response);
  },

  createSupplier: async (supplierData: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await authenticatedFetch('/api/inventory/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplierData),
    });
    return handleApiResponse(response);
  },

  // ========== MOVIMIENTOS DE INVENTARIO ==========
  getMovements: async (params?: {
    page?: number;
    per_page?: number;
    product_id?: number;
    movement_type?: string;
    date_from?: string;
    date_to?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.product_id) queryParams.append('product_id', params.product_id.toString());
    if (params?.movement_type) queryParams.append('movement_type', params.movement_type);
    if (params?.date_from) queryParams.append('date_from', params.date_from);
    if (params?.date_to) queryParams.append('date_to', params.date_to);

    const response = await authenticatedFetch(`/api/inventory/movements?${queryParams}`);
    return handleApiResponse(response);
  },

  createMovement: async (movementData: Omit<InventoryMovement, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    const response = await authenticatedFetch('/api/inventory/movements', {
      method: 'POST',
      body: JSON.stringify(movementData),
    });
    return handleApiResponse(response);
  },

  // ========== ALERTAS ==========
  getAlerts: async (params?: {
    type?: string;
    priority?: string;
    is_read?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.is_read !== undefined) queryParams.append('is_read', params.is_read.toString());

    const response = await authenticatedFetch(`/api/inventory/alerts?${queryParams}`);
    return handleApiResponse(response);
  },

  markAlertAsRead: async (id: number) => {
    const response = await authenticatedFetch(`/api/inventory/alerts/${id}/read`, {
      method: 'PUT',
    });
    return handleApiResponse(response);
  },

  // ========== REPORTES ==========
  getInventoryReport: async () => {
    const response = await authenticatedFetch('/api/inventory/reports/inventory');
    return handleApiResponse(response);
  },

  getExpiryReport: async (days?: number) => {
    const url = days 
      ? `/api/inventory/reports/expiry?days=${days}`
      : '/api/inventory/reports/expiry';
    const response = await authenticatedFetch(url);
    return handleApiResponse(response);
  },

  getLowStockReport: async () => {
    const response = await authenticatedFetch('/api/inventory/reports/low-stock');
    return handleApiResponse(response);
  },

  getValuationReport: async () => {
    const response = await authenticatedFetch('/api/inventory/reports/valuation');
    return handleApiResponse(response);
  },

  // ========== AJUSTES DE INVENTARIO ==========
  adjustStock: async (adjustmentData: {
    product_id: number;
    batch_id?: number;
    quantity: number;
    reason: string;
    reference_document?: string;
  }) => {
    const response = await authenticatedFetch('/api/inventory/adjust-stock', {
      method: 'POST',
      body: JSON.stringify(adjustmentData),
    });
    return handleApiResponse(response);
  },

  // ========== INGRESO DE PRODUCTOS ==========
  receiveProducts: async (receiptData: {
    product_id: number;
    batch_number: string;
    manufacture_date: string;
    expiry_date: string;
    purchase_date: string;
    quantity: number;
    purchase_price: number;
    supplier_id?: number;
    reference_document?: string;
    notes?: string;
  }) => {
    const response = await authenticatedFetch('/api/inventory/receive-products', {
      method: 'POST',
      body: JSON.stringify(receiptData),
    });
    return handleApiResponse(response);
  },

  // ========== BÚSQUEDA AVANZADA ==========
  searchProducts: async (query: string) => {
    const response = await authenticatedFetch(`/api/inventory/search?q=${encodeURIComponent(query)}`);
    return handleApiResponse(response);
  },
};