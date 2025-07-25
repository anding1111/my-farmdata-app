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

// Mock data for batches
let mockBatches: Batch[] = [
  {
    id: 1,
    product_id: 1,
    batch_number: "LOT001-2024",
    quantity: 100,
    remaining_quantity: 75,
    manufacture_date: "2024-01-15",
    expiry_date: "2025-12-31",
    purchase_date: "2024-01-15",
    purchase_price: 28000,
    supplier_id: 1,
    status: "active",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    product_id: 1,
    batch_number: "LOT002-2024",
    quantity: 200,
    remaining_quantity: 200,
    manufacture_date: "2024-02-10",
    expiry_date: "2026-06-30",
    purchase_date: "2024-02-10",
    purchase_price: 27000,
    supplier_id: 1,
    status: "active",
    created_at: "2024-02-10T14:20:00Z",
    updated_at: "2024-02-10T14:20:00Z"
  },
  {
    id: 3,
    product_id: 2,
    batch_number: "LOT003-2024",
    quantity: 50,
    remaining_quantity: 30,
    manufacture_date: "2024-01-20",
    expiry_date: "2025-08-15",
    purchase_date: "2024-01-20",
    purchase_price: 25000,
    supplier_id: 2,
    status: "active",
    created_at: "2024-01-20T09:15:00Z",
    updated_at: "2024-01-20T09:15:00Z"
  },
  {
    id: 4,
    product_id: 3,
    batch_number: "LOT004-2023",
    quantity: 80,
    remaining_quantity: 0,
    manufacture_date: "2023-12-01",
    expiry_date: "2024-12-01",
    purchase_date: "2023-12-01",
    purchase_price: 30000,
    supplier_id: 1,
    status: "expired",
    created_at: "2023-12-01T11:45:00Z",
    updated_at: "2024-01-25T16:30:00Z"
  }
];

// Mock data for locations
let mockLocations: Location[] = [
  {
    id: 1,
    code: "FARM001",
    name: "Farmacia Principal",
    description: "Área principal de la farmacia",
    type: "pharmacy",
    status: "active",
    current_capacity: 0,
    products_count: 0,
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z"
  },
  {
    id: 2,
    code: "ZONA01",
    name: "Zona de Vitaminas",
    description: "Sección dedicada a vitaminas y suplementos",
    type: "zone",
    parent_id: 1,
    status: "active",
    characteristics: {
      temperature_controlled: false,
      humidity_controlled: false,
      requires_security: false,
      max_capacity: 500
    },
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z"
  },
  {
    id: 3,
    code: "EST01",
    name: "Estante A1",
    description: "Primer estante de vitaminas",
    type: "shelf",
    parent_id: 2,
    status: "active",
    characteristics: {
      max_capacity: 100,
      dimensions: { width: 120, height: 200, depth: 40 }
    },
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z"
  },
  {
    id: 4,
    code: "COMP01",
    name: "Compartimiento Superior",
    description: "Compartimiento superior del estante A1",
    type: "compartment",
    parent_id: 3,
    status: "active",
    characteristics: {
      max_capacity: 25,
      dimensions: { width: 120, height: 40, depth: 40 }
    },
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z"
  },
  {
    id: 5,
    code: "ZONA02",
    name: "Zona Refrigerada",
    description: "Sección para productos que requieren refrigeración",
    type: "zone",
    parent_id: 1,
    status: "active",
    characteristics: {
      temperature_controlled: true,
      humidity_controlled: true,
      requires_security: true,
      max_capacity: 200
    },
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z"
  }
];

// Mock data for product locations
let mockProductLocations: ProductLocation[] = [
  {
    id: 1,
    product_id: 1,
    location_id: 4,
    is_primary: true,
    quantity: 150,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    product_id: 2,
    location_id: 4,
    is_primary: true,
    quantity: 80,
    created_at: "2024-01-16T10:30:00Z",
    updated_at: "2024-01-16T10:30:00Z"
  }
];

// Mock data for movements
let mockMovements: Movement[] = [
  {
    id: 1,
    product_id: 1,
    product_name: "Vitamina D3",
    product_code: "VIT-D3-001",
    type: "entry",
    subtype: "purchase",
    quantity: 100,
    unit_cost: 15000,
    total_cost: 1500000,
    location_to_id: 3,
    location_to_name: "Estante A1",
    reason: "Compra inicial de inventario",
    reference_document: "FC-001",
    notes: "Proveedor: Laboratorios ABC",
    user_id: 1,
    user_name: "Juan Pérez",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  }
];

// Mock data for products
let mockProducts: any[] = [
  { id: 1, name: "Vitamina D3", code: "VIT-D3-001" },
  { id: 2, name: "Omega 3", code: "OMG-001" }
];

let nextCategoryId = 6;
let nextBatchId = 5;
let nextLocationId = 6;
let nextProductLocationId = 3;
let nextMovementId = 2;

// Helper function for API simulation
const simulateApiCall = () => new Promise(resolve => setTimeout(resolve, 300));

// Función helper para hacer requests autenticados
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  
  // Mock implementation for categories
  if (url.includes('/api/inventory/categories')) {
    return mockFetchCategories(url, options);
  }
  
  // Mock implementation for batches
  if (url.includes('/api/inventory/batches')) {
    return mockFetchBatches(url, options);
  }
  
  // Mock implementation for locations
  if (url.includes('/api/inventory/locations')) {
    return mockFetchLocations(url, options);
  }
  
  // Mock implementation for product locations
  if (url.includes('/api/inventory/product-locations')) {
    return mockFetchProductLocations(url, options);
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

// Mock fetch for batches
const mockFetchBatches = async (url: string, options: RequestInit = {}) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const method = options.method || 'GET';
  const urlParts = url.split('?');
  const basePath = urlParts[0];
  const searchParams = new URLSearchParams(urlParts[1] || '');
  
  if (method === 'GET' && basePath === '/api/inventory/batches') {
    const productId = searchParams.get('product_id');
    let filteredBatches = mockBatches;
    
    if (productId) {
      filteredBatches = mockBatches.filter(batch => batch.product_id === parseInt(productId));
    }
    
    return new Response(JSON.stringify({
      success: true,
      data: filteredBatches
    }), { status: 200 });
  }
  
  if (method === 'POST' && basePath === '/api/inventory/batches') {
    const body = JSON.parse(options.body as string);
    const newBatch: Batch = {
      id: nextBatchId++,
      ...body,
      remaining_quantity: body.quantity, // Initially, remaining equals total quantity
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockBatches.push(newBatch);
    return new Response(JSON.stringify({
      success: true,
      data: newBatch
    }), { status: 201 });
  }
  
  if (method === 'PUT' && basePath.match(/\/api\/inventory\/batches\/\d+/)) {
    const id = parseInt(basePath.split('/').pop()!);
    const body = JSON.parse(options.body as string);
    const batchIndex = mockBatches.findIndex(b => b.id === id);
    
    if (batchIndex === -1) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Lote no encontrado'
      }), { status: 404 });
    }
    
    mockBatches[batchIndex] = {
      ...mockBatches[batchIndex],
      ...body,
      updated_at: new Date().toISOString()
    };
    
    return new Response(JSON.stringify({
      success: true,
      data: mockBatches[batchIndex]
    }), { status: 200 });
  }
  
  if (method === 'DELETE' && basePath.match(/\/api\/inventory\/batches\/\d+/)) {
    const id = parseInt(basePath.split('/').pop()!);
    const batchIndex = mockBatches.findIndex(b => b.id === id);
    
    if (batchIndex === -1) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Lote no encontrado'
      }), { status: 404 });
    }
    
    // Check if batch has remaining stock
    if (mockBatches[batchIndex].remaining_quantity > 0) {
      return new Response(JSON.stringify({
        success: false,
        message: 'No se puede eliminar un lote con stock disponible'
      }), { status: 400 });
    }
    
    mockBatches.splice(batchIndex, 1);
    return new Response(JSON.stringify({
      success: true,
      message: 'Lote eliminado exitosamente'
    }), { status: 200 });
  }
  
  return new Response(JSON.stringify({
    success: false,
    message: 'Endpoint no encontrado'
  }), { status: 404 });
};

// Mock fetch for locations
const mockFetchLocations = async (url: string, options: RequestInit = {}) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const method = options.method || 'GET';
  const urlParts = url.split('?');
  const basePath = urlParts[0];
  const searchParams = new URLSearchParams(urlParts[1] || '');
  
  if (method === 'GET' && basePath === '/api/inventory/locations') {
    let filteredLocations = mockLocations;
    
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const parentId = searchParams.get('parent_id');
    const status = searchParams.get('status');
    
    if (search) {
      filteredLocations = filteredLocations.filter(loc => 
        loc.name.toLowerCase().includes(search.toLowerCase()) ||
        loc.code.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (type) {
      filteredLocations = filteredLocations.filter(loc => loc.type === type);
    }
    
    if (parentId) {
      filteredLocations = filteredLocations.filter(loc => loc.parent_id === parseInt(parentId));
    }
    
    if (status) {
      filteredLocations = filteredLocations.filter(loc => loc.status === status);
    }
    
    return new Response(JSON.stringify({
      success: true,
      data: filteredLocations
    }), { status: 200 });
  }
  
  if (method === 'POST' && basePath === '/api/inventory/locations') {
    const body = JSON.parse(options.body as string);
    const newLocation: Location = {
      id: nextLocationId++,
      ...body,
      products_count: 0,
      current_capacity: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockLocations.push(newLocation);
    return new Response(JSON.stringify({
      success: true,
      data: newLocation
    }), { status: 201 });
  }
  
  if (method === 'PUT' && basePath.match(/\/api\/inventory\/locations\/\d+/)) {
    const id = parseInt(basePath.split('/').pop()!);
    const body = JSON.parse(options.body as string);
    const locationIndex = mockLocations.findIndex(l => l.id === id);
    
    if (locationIndex === -1) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Ubicación no encontrada'
      }), { status: 404 });
    }
    
    mockLocations[locationIndex] = {
      ...mockLocations[locationIndex],
      ...body,
      updated_at: new Date().toISOString()
    };
    
    return new Response(JSON.stringify({
      success: true,
      data: mockLocations[locationIndex]
    }), { status: 200 });
  }
  
  if (method === 'DELETE' && basePath.match(/\/api\/inventory\/locations\/\d+/)) {
    const id = parseInt(basePath.split('/').pop()!);
    const locationIndex = mockLocations.findIndex(l => l.id === id);
    
    if (locationIndex === -1) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Ubicación no encontrada'
      }), { status: 404 });
    }
    
    // Check if location has children
    const hasChildren = mockLocations.some(l => l.parent_id === id);
    if (hasChildren) {
      return new Response(JSON.stringify({
        success: false,
        message: 'No se puede eliminar una ubicación que tiene sub-ubicaciones'
      }), { status: 400 });
    }
    
    // Check if location has products
    const hasProducts = mockProductLocations.some(pl => pl.location_id === id);
    if (hasProducts) {
      return new Response(JSON.stringify({
        success: false,
        message: 'No se puede eliminar una ubicación que tiene productos asignados'
      }), { status: 400 });
    }
    
    mockLocations.splice(locationIndex, 1);
    return new Response(JSON.stringify({
      success: true,
      message: 'Ubicación eliminada exitosamente'
    }), { status: 200 });
  }
  
  return new Response(JSON.stringify({
    success: false,
    message: 'Endpoint no encontrado'
  }), { status: 404 });
};

// Mock fetch for product locations
const mockFetchProductLocations = async (url: string, options: RequestInit = {}) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const method = options.method || 'GET';
  const urlParts = url.split('?');
  const basePath = urlParts[0];
  const searchParams = new URLSearchParams(urlParts[1] || '');
  
  if (method === 'GET' && basePath === '/api/inventory/product-locations') {
    let filteredProductLocations = mockProductLocations;
    
    const productId = searchParams.get('product_id');
    const locationId = searchParams.get('location_id');
    
    if (productId) {
      filteredProductLocations = filteredProductLocations.filter(pl => pl.product_id === parseInt(productId));
    }
    
    if (locationId) {
      filteredProductLocations = filteredProductLocations.filter(pl => pl.location_id === parseInt(locationId));
    }
    
    return new Response(JSON.stringify({
      success: true,
      data: filteredProductLocations
    }), { status: 200 });
  }
  
  if (method === 'POST' && basePath === '/api/inventory/product-locations') {
    const body = JSON.parse(options.body as string);
    
    // If setting as primary, remove primary from other locations for this product
    if (body.is_primary) {
      mockProductLocations.forEach(pl => {
        if (pl.product_id === body.product_id) {
          pl.is_primary = false;
        }
      });
    }
    
    const newProductLocation: ProductLocation = {
      id: nextProductLocationId++,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockProductLocations.push(newProductLocation);
    return new Response(JSON.stringify({
      success: true,
      data: newProductLocation
    }), { status: 201 });
  }
  
  if (method === 'PUT' && basePath.match(/\/api\/inventory\/product-locations\/\d+/)) {
    const id = parseInt(basePath.split('/').pop()!);
    const body = JSON.parse(options.body as string);
    const productLocationIndex = mockProductLocations.findIndex(pl => pl.id === id);
    
    if (productLocationIndex === -1) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Asignación de producto-ubicación no encontrada'
      }), { status: 404 });
    }
    
    // If setting as primary, remove primary from other locations for this product
    if (body.is_primary) {
      const productId = mockProductLocations[productLocationIndex].product_id;
      mockProductLocations.forEach(pl => {
        if (pl.product_id === productId && pl.id !== id) {
          pl.is_primary = false;
        }
      });
    }
    
    mockProductLocations[productLocationIndex] = {
      ...mockProductLocations[productLocationIndex],
      ...body,
      updated_at: new Date().toISOString()
    };
    
    return new Response(JSON.stringify({
      success: true,
      data: mockProductLocations[productLocationIndex]
    }), { status: 200 });
  }
  
  if (method === 'DELETE' && basePath.match(/\/api\/inventory\/product-locations\/\d+/)) {
    const id = parseInt(basePath.split('/').pop()!);
    const productLocationIndex = mockProductLocations.findIndex(pl => pl.id === id);
    
    if (productLocationIndex === -1) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Asignación de producto-ubicación no encontrada'
      }), { status: 404 });
    }
    
    mockProductLocations.splice(productLocationIndex, 1);
    return new Response(JSON.stringify({
      success: true,
      message: 'Asignación eliminada exitosamente'
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

export interface Location {
  id: number;
  code: string;
  name: string;
  description?: string;
  type: 'pharmacy' | 'zone' | 'shelf' | 'compartment';
  parent_id?: number;
  parent?: Location;
  children?: Location[];
  characteristics?: {
    temperature_controlled?: boolean;
    humidity_controlled?: boolean;
    requires_security?: boolean;
    max_capacity?: number;
    dimensions?: {
      width?: number;
      height?: number;
      depth?: number;
    };
  };
  status: 'active' | 'inactive' | 'maintenance';
  current_capacity?: number;
  products_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductLocation {
  id: number;
  product_id: number;
  product?: Product;
  location_id: number;
  location?: Location;
  quantity?: number;
  is_primary: boolean;
  notes?: string;
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

// Movement interfaces
export interface Movement {
  id: number;
  product_id: number;
  product_name?: string;
  product_code?: string;
  type: 'entry' | 'exit' | 'transfer' | 'adjustment';
  subtype: MovementSubtype;
  quantity: number;
  unit_cost?: number;
  total_cost?: number;
  location_from_id?: number;
  location_from_name?: string;
  location_to_id?: number;
  location_to_name?: string;
  reason: string;
  reference_document?: string;
  notes?: string;
  user_id?: number;
  user_name?: string;
  created_at: string;
  updated_at: string;
}

export type MovementSubtype = 
  | 'purchase' | 'customer_return' | 'production' | 'positive_adjustment'
  | 'sale' | 'supplier_return' | 'loss' | 'damage' | 'negative_adjustment'
  | 'location_transfer' | 'warehouse_transfer';

export interface CreateMovementData {
  product_id: number;
  type: Movement['type'];
  subtype: MovementSubtype;
  quantity: number;
  unit_cost?: number;
  location_from_id?: number;
  location_to_id?: number;
  reason: string;
  reference_document?: string;
  notes?: string;
}

export interface UpdateMovementData extends Partial<CreateMovementData> {
  id: number;
}

export interface MovementFilters {
  search?: string;
  type?: string;
  subtype?: string;
  product_id?: number;
  location_id?: number;
  date_from?: string;
  date_to?: string;
  user_id?: number;
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

  deleteBatch: async (id: number) => {
    const response = await authenticatedFetch(`/api/inventory/batches/${id}`, {
      method: 'DELETE',
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

  // ========== UBICACIONES ==========
  getLocations: async (params?: {
    search?: string;
    type?: string;
    parent_id?: number;
    status?: string;
    has_products?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.parent_id) queryParams.append('parent_id', params.parent_id.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.has_products) queryParams.append('has_products', params.has_products.toString());

    const response = await authenticatedFetch(`/api/inventory/locations?${queryParams}`);
    return handleApiResponse(response);
  },

  getLocation: async (id: number) => {
    const response = await authenticatedFetch(`/api/inventory/locations/${id}`);
    return handleApiResponse(response);
  },

  createLocation: async (locationData: Omit<Location, 'id' | 'created_at' | 'updated_at' | 'current_capacity' | 'products_count'>) => {
    const response = await authenticatedFetch('/api/inventory/locations', {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
    return handleApiResponse(response);
  },

  updateLocation: async (id: number, locationData: Partial<Location>) => {
    const response = await authenticatedFetch(`/api/inventory/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(locationData),
    });
    return handleApiResponse(response);
  },

  deleteLocation: async (id: number) => {
    const response = await authenticatedFetch(`/api/inventory/locations/${id}`, {
      method: 'DELETE',
    });
    return handleApiResponse(response);
  },

  // ========== UBICACIONES DE PRODUCTOS ==========
  getProductLocations: async (params?: {
    product_id?: number;
    location_id?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.product_id) queryParams.append('product_id', params.product_id.toString());
    if (params?.location_id) queryParams.append('location_id', params.location_id.toString());

    const response = await authenticatedFetch(`/api/inventory/product-locations?${queryParams}`);
    return handleApiResponse(response);
  },

  createProductLocation: async (productLocationData: Omit<ProductLocation, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await authenticatedFetch('/api/inventory/product-locations', {
      method: 'POST',
      body: JSON.stringify(productLocationData),
    });
    return handleApiResponse(response);
  },

  updateProductLocation: async (id: number, productLocationData: Partial<ProductLocation>) => {
    const response = await authenticatedFetch(`/api/inventory/product-locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productLocationData),
    });
    return handleApiResponse(response);
  },

  deleteProductLocation: async (id: number) => {
    const response = await authenticatedFetch(`/api/inventory/product-locations/${id}`, {
      method: 'DELETE',
    });
    return handleApiResponse(response);
  },

  // ========== BÚSQUEDA DE UBICACIONES ==========
  searchLocations: async (query: string) => {
    const response = await authenticatedFetch(`/api/inventory/locations/search?q=${encodeURIComponent(query)}`);
    return handleApiResponse(response);
  },

  // Movements API
  getMovements: async (filters?: any) => {
    await simulateApiCall();
    return { data: mockMovements };
  },

  getMovement: async (id: number) => {
    await simulateApiCall();
    return mockMovements.find(m => m.id === id);
  },

  createMovement: async (data: any) => {
    await simulateApiCall();
    const newMovement = {
      id: nextMovementId++,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockMovements.push(newMovement);
    return newMovement;
  },

  updateMovement: async (id: number, data: any) => {
    await simulateApiCall();
    const index = mockMovements.findIndex(m => m.id === id);
    if (index !== -1) {
      mockMovements[index] = { ...mockMovements[index], ...data };
      return mockMovements[index];
    }
    throw new Error('Movimiento no encontrado');
  },

  deleteMovement: async (id: number) => {
    await simulateApiCall();
    const index = mockMovements.findIndex(m => m.id === id);
    if (index !== -1) {
      mockMovements.splice(index, 1);
    }
  },

  searchMovements: async (query: string) => {
    await simulateApiCall();
    return mockMovements.filter(m => 
      m.product_name?.toLowerCase().includes(query.toLowerCase())
    );
  }
};