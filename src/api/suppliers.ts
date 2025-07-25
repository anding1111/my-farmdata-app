import { Supplier, SupplierFormData, SupplierFilters } from '@/types/suppliers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Mock data para desarrollo
let mockSuppliers: Supplier[] = [
  {
    id: 1,
    code: 'PROV-001',
    name: 'Laboratorios Farmacéuticos ABC S.A.S.',
    company_name: 'ABC Pharma',
    contact_person: 'Dr. Carlos Martínez',
    email: 'ventas@abcpharma.com',
    phone: '+57 1 234 5678',
    mobile: '+57 300 123 4567',
    address: 'Carrera 15 #93-47',
    city: 'Bogotá',
    department: 'Cundinamarca',
    country: 'Colombia',
    tax_id: '900123456',
    tax_type: 'NIT',
    website: 'www.abcpharma.com',
    bank_name: 'Banco de Bogotá',
    bank_account: '123456789',
    account_type: 'checking',
    payment_terms: '30 días',
    credit_limit: 50000000,
    rating: 5,
    supplier_category: 'Laboratorio Farmacéutico',
    notes: 'Proveedor principal de vitaminas y suplementos',
    status: 'active',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    code: 'PROV-002',
    name: 'Distribuidora Médica del Norte',
    company_name: 'MediNorte Ltda.',
    contact_person: 'Ana Rodríguez',
    email: 'compras@medinorte.com',
    phone: '+57 5 987 6543',
    mobile: '+57 310 987 6543',
    address: 'Calle 72 #68-15',
    city: 'Barranquilla',
    department: 'Atlántico',
    tax_id: '800987654',
    tax_type: 'NIT',
    payment_terms: '15 días',
    credit_limit: 25000000,
    rating: 4,
    supplier_category: 'Distribuidor Mayorista',
    status: 'active',
    created_at: '2024-01-16T14:20:00Z',
    updated_at: '2024-01-16T14:20:00Z'
  },
  {
    id: 3,
    code: 'PROV-003',
    name: 'Droguería Central S.A.',
    contact_person: 'Luis Pérez',
    email: 'pedidos@drogueriacentral.com',
    phone: '+57 2 555 0123',
    address: 'Avenida 6N #23-50',
    city: 'Cali',
    department: 'Valle del Cauca',
    tax_id: '700555123',
    tax_type: 'NIT',
    payment_terms: '45 días',
    credit_limit: 15000000,
    rating: 3,
    supplier_category: 'Droguería',
    notes: 'Especializado en medicamentos genéricos',
    status: 'active',
    created_at: '2024-01-17T09:45:00Z',
    updated_at: '2024-01-17T09:45:00Z'
  },
  {
    id: 4,
    code: 'PROV-004',
    name: 'Equipos Médicos Especializados',
    contact_person: 'María González',
    email: 'info@equiposmedicos.com',
    phone: '+57 4 444 7890',
    address: 'Carrera 50 #30-25',
    city: 'Medellín',
    department: 'Antioquia',
    tax_id: '600444789',
    tax_type: 'NIT',
    rating: 4,
    supplier_category: 'Proveedor de Equipos',
    status: 'active',
    created_at: '2024-01-18T16:30:00Z',
    updated_at: '2024-01-18T16:30:00Z'
  },
  {
    id: 5,
    code: 'PROV-005',
    name: 'Servicios Farmacéuticos Integrales',
    contact_person: 'Roberto Silva',
    email: 'contacto@serviciosfarma.com',
    tax_id: '500333222',
    tax_type: 'NIT',
    supplier_category: 'Servicios',
    status: 'suspended',
    notes: 'Suspendido por incumplimiento de pagos',
    created_at: '2024-01-10T11:15:00Z',
    updated_at: '2024-01-19T13:20:00Z'
  }
];

let nextSupplierId = 6;

// Helper function para simular llamadas a la API
const simulateApiCall = () => new Promise(resolve => setTimeout(resolve, 300));

// Función helper para hacer requests autenticados
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  
  // Mock implementation para proveedores
  if (url.includes('/api/suppliers')) {
    return mockFetchSuppliers(url, options);
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

// Mock fetch para proveedores
const mockFetchSuppliers = async (url: string, options: RequestInit = {}) => {
  await simulateApiCall();
  
  const method = options.method || 'GET';
  const urlParts = url.split('?');
  const basePath = urlParts[0];
  const searchParams = new URLSearchParams(urlParts[1] || '');
  
  if (method === 'GET' && basePath === '/api/suppliers') {
    let filteredSuppliers = [...mockSuppliers];
    
    // Aplicar filtros
    const search = searchParams.get('search');
    const taxType = searchParams.get('tax_type');
    const city = searchParams.get('city');
    const department = searchParams.get('department');
    const status = searchParams.get('status');
    const category = searchParams.get('supplier_category');
    const rating = searchParams.get('rating');
    
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredSuppliers = filteredSuppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm) ||
        supplier.code.toLowerCase().includes(searchTerm) ||
        (supplier.company_name && supplier.company_name.toLowerCase().includes(searchTerm)) ||
        (supplier.contact_person && supplier.contact_person.toLowerCase().includes(searchTerm)) ||
        (supplier.tax_id && supplier.tax_id.includes(searchTerm)) ||
        (supplier.email && supplier.email.toLowerCase().includes(searchTerm))
      );
    }
    
    if (taxType) {
      filteredSuppliers = filteredSuppliers.filter(supplier => supplier.tax_type === taxType);
    }
    
    if (city) {
      filteredSuppliers = filteredSuppliers.filter(supplier => supplier.city === city);
    }
    
    if (department) {
      filteredSuppliers = filteredSuppliers.filter(supplier => supplier.department === department);
    }
    
    if (status) {
      filteredSuppliers = filteredSuppliers.filter(supplier => supplier.status === status);
    }
    
    if (category) {
      filteredSuppliers = filteredSuppliers.filter(supplier => supplier.supplier_category === category);
    }
    
    if (rating) {
      filteredSuppliers = filteredSuppliers.filter(supplier => supplier.rating === parseInt(rating));
    }
    
    return new Response(JSON.stringify({
      success: true,
      data: filteredSuppliers
    }), { status: 200 });
  }
  
  if (method === 'GET' && basePath.match(/\/api\/suppliers\/\d+/)) {
    const id = parseInt(basePath.split('/').pop()!);
    const supplier = mockSuppliers.find(s => s.id === id);
    
    if (!supplier) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Proveedor no encontrado'
      }), { status: 404 });
    }
    
    return new Response(JSON.stringify({
      success: true,
      data: supplier
    }), { status: 200 });
  }
  
  if (method === 'POST' && basePath === '/api/suppliers') {
    const body = JSON.parse(options.body as string);
    
    // Verificar que el código y tax_id sean únicos
    const codeExists = mockSuppliers.some(s => s.code === body.code);
    const taxIdExists = mockSuppliers.some(s => s.tax_id === body.tax_id);
    
    if (codeExists) {
      return new Response(JSON.stringify({
        success: false,
        message: 'El código del proveedor ya existe'
      }), { status: 400 });
    }
    
    if (taxIdExists && body.tax_id) {
      return new Response(JSON.stringify({
        success: false,
        message: 'El número de identificación tributaria ya está registrado'
      }), { status: 400 });
    }
    
    const newSupplier: Supplier = {
      id: nextSupplierId++,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockSuppliers.push(newSupplier);
    
    return new Response(JSON.stringify({
      success: true,
      data: newSupplier,
      message: 'Proveedor creado exitosamente'
    }), { status: 201 });
  }
  
  if (method === 'PUT' && basePath.match(/\/api\/suppliers\/\d+/)) {
    const id = parseInt(basePath.split('/').pop()!);
    const body = JSON.parse(options.body as string);
    const supplierIndex = mockSuppliers.findIndex(s => s.id === id);
    
    if (supplierIndex === -1) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Proveedor no encontrado'
      }), { status: 404 });
    }
    
    // Verificar unicidad de código y tax_id (excluyendo el proveedor actual)
    const codeExists = mockSuppliers.some(s => s.id !== id && s.code === body.code);
    const taxIdExists = mockSuppliers.some(s => s.id !== id && s.tax_id === body.tax_id);
    
    if (codeExists) {
      return new Response(JSON.stringify({
        success: false,
        message: 'El código del proveedor ya existe'
      }), { status: 400 });
    }
    
    if (taxIdExists && body.tax_id) {
      return new Response(JSON.stringify({
        success: false,
        message: 'El número de identificación tributaria ya está registrado'
      }), { status: 400 });
    }
    
    mockSuppliers[supplierIndex] = {
      ...mockSuppliers[supplierIndex],
      ...body,
      updated_at: new Date().toISOString()
    };
    
    return new Response(JSON.stringify({
      success: true,
      data: mockSuppliers[supplierIndex],
      message: 'Proveedor actualizado exitosamente'
    }), { status: 200 });
  }
  
  if (method === 'DELETE' && basePath.match(/\/api\/suppliers\/\d+/)) {
    const id = parseInt(basePath.split('/').pop()!);
    const supplierIndex = mockSuppliers.findIndex(s => s.id === id);
    
    if (supplierIndex === -1) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Proveedor no encontrado'
      }), { status: 404 });
    }
    
    mockSuppliers.splice(supplierIndex, 1);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Proveedor eliminado exitosamente'
    }), { status: 200 });
  }
  
  return new Response(JSON.stringify({
    success: false,
    message: 'Endpoint no encontrado'
  }), { status: 404 });
};

// API methods
export const suppliersApi = {
  // Obtener todos los proveedores
  getSuppliers: async (filters?: SupplierFilters): Promise<Supplier[]> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const url = `/api/suppliers${queryString ? `?${queryString}` : ''}`;
    
    const response = await authenticatedFetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al obtener proveedores');
    }
    
    return data.data;
  },

  // Obtener proveedor por ID
  getSupplier: async (id: number): Promise<Supplier> => {
    const response = await authenticatedFetch(`/api/suppliers/${id}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al obtener proveedor');
    }
    
    return data.data;
  },

  // Crear proveedor
  createSupplier: async (supplierData: SupplierFormData): Promise<Supplier> => {
    const response = await authenticatedFetch('/api/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplierData),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al crear proveedor');
    }
    
    return data.data;
  },

  // Actualizar proveedor
  updateSupplier: async (id: number, supplierData: SupplierFormData): Promise<Supplier> => {
    const response = await authenticatedFetch(`/api/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(supplierData),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al actualizar proveedor');
    }
    
    return data.data;
  },

  // Eliminar proveedor
  deleteSupplier: async (id: number): Promise<void> => {
    const response = await authenticatedFetch(`/api/suppliers/${id}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al eliminar proveedor');
    }
  },
};