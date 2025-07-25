import { Client, ClientFormData, ClientFilters } from '@/types/clients';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Mock data para desarrollo
let mockClients: Client[] = [
  {
    id: 1,
    code: 'CLI-001',
    name: 'María García López',
    email: 'maria.garcia@email.com',
    phone: '+57 300 123 4567',
    document_type: 'CC',
    document_number: '12345678',
    birth_date: '1985-03-15',
    address: 'Calle 123 #45-67',
    city: 'Bogotá',
    department: 'Cundinamarca',
    emergency_contact: 'Juan García',
    emergency_phone: '+57 300 987 6543',
    insurance_provider: 'EPS Sanitas',
    insurance_number: 'SAN123456789',
    allergies: 'Penicilina',
    medical_conditions: 'Hipertensión',
    notes: 'Cliente frecuente, prefiere medicamentos genéricos',
    status: 'active',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    code: 'CLI-002',
    name: 'Carlos Rodríguez Pérez',
    email: 'carlos.rodriguez@email.com',
    phone: '+57 310 555 1234',
    document_type: 'CC',
    document_number: '87654321',
    birth_date: '1978-09-22',
    address: 'Carrera 50 #30-25',
    city: 'Medellín',
    department: 'Antioquia',
    emergency_contact: 'Ana Rodríguez',
    emergency_phone: '+57 310 555 4321',
    insurance_provider: 'EPS Sura',
    insurance_number: 'SUR987654321',
    status: 'active',
    created_at: '2024-01-16T14:20:00Z',
    updated_at: '2024-01-16T14:20:00Z'
  },
  {
    id: 3,
    code: 'CLI-003',
    name: 'Ana Sofía Martínez',
    email: 'ana.martinez@email.com',
    phone: '+57 320 789 0123',
    document_type: 'TI',
    document_number: '1098765432',
    birth_date: '2010-05-10',
    address: 'Avenida 68 #15-30',
    city: 'Cali',
    department: 'Valle del Cauca',
    emergency_contact: 'Lucía Martínez',
    emergency_phone: '+57 320 789 9876',
    insurance_provider: 'EPS Coomeva',
    insurance_number: 'COO456789123',
    allergies: 'Ibuprofeno',
    notes: 'Paciente pediátrico',
    status: 'active',
    created_at: '2024-01-17T09:45:00Z',
    updated_at: '2024-01-17T09:45:00Z'
  },
  {
    id: 4,
    code: 'CLI-004',
    name: 'Roberto Jiménez Silva',
    phone: '+57 315 444 7890',
    document_type: 'CC',
    document_number: '45678912',
    birth_date: '1965-12-03',
    address: 'Diagonal 25 #40-15',
    city: 'Barranquilla',
    department: 'Atlántico',
    medical_conditions: 'Diabetes tipo 2',
    notes: 'Requiere seguimiento médico constante',
    status: 'active',
    created_at: '2024-01-18T16:30:00Z',
    updated_at: '2024-01-18T16:30:00Z'
  },
  {
    id: 5,
    code: 'CLI-005',
    name: 'Patricia Vásquez Luna',
    email: 'patricia.vasquez@email.com',
    document_type: 'CC',
    document_number: '78912345',
    status: 'inactive',
    created_at: '2024-01-10T11:15:00Z',
    updated_at: '2024-01-19T13:20:00Z'
  }
];

let nextClientId = 6;

// Helper function para simular llamadas a la API
const simulateApiCall = () => new Promise(resolve => setTimeout(resolve, 300));

// Función helper para hacer requests autenticados
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  
  // Mock implementation para clientes
  if (url.includes('/api/clients')) {
    return mockFetchClients(url, options);
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

// Mock fetch para clientes
const mockFetchClients = async (url: string, options: RequestInit = {}) => {
  await simulateApiCall();
  
  const method = options.method || 'GET';
  const urlParts = url.split('?');
  const basePath = urlParts[0];
  const searchParams = new URLSearchParams(urlParts[1] || '');
  
  if (method === 'GET' && basePath === '/api/clients') {
    let filteredClients = [...mockClients];
    
    // Aplicar filtros
    const search = searchParams.get('search');
    const documentType = searchParams.get('document_type');
    const city = searchParams.get('city');
    const department = searchParams.get('department');
    const status = searchParams.get('status');
    const hasInsurance = searchParams.get('has_insurance');
    
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredClients = filteredClients.filter(client =>
        client.name.toLowerCase().includes(searchTerm) ||
        client.code.toLowerCase().includes(searchTerm) ||
        client.document_number.includes(searchTerm) ||
        (client.email && client.email.toLowerCase().includes(searchTerm)) ||
        (client.phone && client.phone.includes(searchTerm))
      );
    }
    
    if (documentType) {
      filteredClients = filteredClients.filter(client => client.document_type === documentType);
    }
    
    if (city) {
      filteredClients = filteredClients.filter(client => client.city === city);
    }
    
    if (department) {
      filteredClients = filteredClients.filter(client => client.department === department);
    }
    
    if (status) {
      filteredClients = filteredClients.filter(client => client.status === status);
    }
    
    if (hasInsurance === 'true') {
      filteredClients = filteredClients.filter(client => client.insurance_provider);
    } else if (hasInsurance === 'false') {
      filteredClients = filteredClients.filter(client => !client.insurance_provider);
    }
    
    return new Response(JSON.stringify({
      success: true,
      data: filteredClients
    }), { status: 200 });
  }
  
  if (method === 'GET' && basePath.match(/\/api\/clients\/\d+/)) {
    const id = parseInt(basePath.split('/').pop()!);
    const client = mockClients.find(c => c.id === id);
    
    if (!client) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Cliente no encontrado'
      }), { status: 404 });
    }
    
    return new Response(JSON.stringify({
      success: true,
      data: client
    }), { status: 200 });
  }
  
  if (method === 'POST' && basePath === '/api/clients') {
    const body = JSON.parse(options.body as string);
    
    // Verificar que el código y número de documento sean únicos
    const codeExists = mockClients.some(c => c.code === body.code);
    const documentExists = mockClients.some(c => c.document_number === body.document_number);
    
    if (codeExists) {
      return new Response(JSON.stringify({
        success: false,
        message: 'El código del cliente ya existe'
      }), { status: 400 });
    }
    
    if (documentExists) {
      return new Response(JSON.stringify({
        success: false,
        message: 'El número de documento ya está registrado'
      }), { status: 400 });
    }
    
    const newClient: Client = {
      id: nextClientId++,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockClients.push(newClient);
    
    return new Response(JSON.stringify({
      success: true,
      data: newClient,
      message: 'Cliente creado exitosamente'
    }), { status: 201 });
  }
  
  if (method === 'PUT' && basePath.match(/\/api\/clients\/\d+/)) {
    const id = parseInt(basePath.split('/').pop()!);
    const body = JSON.parse(options.body as string);
    const clientIndex = mockClients.findIndex(c => c.id === id);
    
    if (clientIndex === -1) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Cliente no encontrado'
      }), { status: 404 });
    }
    
    // Verificar unicidad de código y documento (excluyendo el cliente actual)
    const codeExists = mockClients.some(c => c.id !== id && c.code === body.code);
    const documentExists = mockClients.some(c => c.id !== id && c.document_number === body.document_number);
    
    if (codeExists) {
      return new Response(JSON.stringify({
        success: false,
        message: 'El código del cliente ya existe'
      }), { status: 400 });
    }
    
    if (documentExists) {
      return new Response(JSON.stringify({
        success: false,
        message: 'El número de documento ya está registrado'
      }), { status: 400 });
    }
    
    mockClients[clientIndex] = {
      ...mockClients[clientIndex],
      ...body,
      updated_at: new Date().toISOString()
    };
    
    return new Response(JSON.stringify({
      success: true,
      data: mockClients[clientIndex],
      message: 'Cliente actualizado exitosamente'
    }), { status: 200 });
  }
  
  if (method === 'DELETE' && basePath.match(/\/api\/clients\/\d+/)) {
    const id = parseInt(basePath.split('/').pop()!);
    const clientIndex = mockClients.findIndex(c => c.id === id);
    
    if (clientIndex === -1) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Cliente no encontrado'
      }), { status: 404 });
    }
    
    mockClients.splice(clientIndex, 1);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Cliente eliminado exitosamente'
    }), { status: 200 });
  }
  
  return new Response(JSON.stringify({
    success: false,
    message: 'Endpoint no encontrado'
  }), { status: 404 });
};

// API methods
export const clientsApi = {
  // Obtener todos los clientes
  getClients: async (filters?: ClientFilters): Promise<Client[]> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const url = `/api/clients${queryString ? `?${queryString}` : ''}`;
    
    const response = await authenticatedFetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al obtener clientes');
    }
    
    return data.data;
  },

  // Obtener cliente por ID
  getClient: async (id: number): Promise<Client> => {
    const response = await authenticatedFetch(`/api/clients/${id}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al obtener cliente');
    }
    
    return data.data;
  },

  // Crear cliente
  createClient: async (clientData: ClientFormData): Promise<Client> => {
    const response = await authenticatedFetch('/api/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al crear cliente');
    }
    
    return data.data;
  },

  // Actualizar cliente
  updateClient: async (id: number, clientData: ClientFormData): Promise<Client> => {
    const response = await authenticatedFetch(`/api/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al actualizar cliente');
    }
    
    return data.data;
  },

  // Eliminar cliente
  deleteClient: async (id: number): Promise<void> => {
    const response = await authenticatedFetch(`/api/clients/${id}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al eliminar cliente');
    }
  },
};