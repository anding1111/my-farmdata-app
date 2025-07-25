import { PharmacySettings, User, Role, UserFormData, RoleFormData, DEFAULT_PERMISSIONS } from '@/types/settings';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Mock data
let mockPharmacySettings: PharmacySettings = {
  id: 1,
  name: 'FarmaData',
  address: 'Carrera 15 #93-47, Bogotá',
  phone: '+57 1 234 5678',
  email: 'info@farmadata.com',
  nit: '900123456-1',
  license_number: 'INVIMA-2024-001',
  manager_name: 'Dr. María García',
  opening_hours: {
    monday: { open: '08:00', close: '20:00', is_closed: false },
    tuesday: { open: '08:00', close: '20:00', is_closed: false },
    wednesday: { open: '08:00', close: '20:00', is_closed: false },
    thursday: { open: '08:00', close: '20:00', is_closed: false },
    friday: { open: '08:00', close: '20:00', is_closed: false },
    saturday: { open: '09:00', close: '18:00', is_closed: false },
    sunday: { open: '10:00', close: '16:00', is_closed: false }
  },
  tax_settings: {
    iva_rate: 19,
    retention_rate: 2.5,
    discount_rate: 10
  },
  notification_settings: {
    low_stock_alerts: true,
    expiry_alerts: true,
    email_notifications: true,
    sms_notifications: false
  },
  created_at: '2024-01-01T10:00:00Z',
  updated_at: '2024-01-15T14:30:00Z'
};

let mockUsers: User[] = [
  {
    id: 1,
    name: 'Administrador',
    email: 'admin@farmadata.com',
    phone: '+57 300 123 4567',
    role_id: 1,
    role_name: 'Administrador',
    permissions: ['dashboard.view', 'sales.create', 'inventory.edit', 'settings.edit'],
    is_active: true,
    last_login: '2024-01-20T15:30:00Z',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-20T15:30:00Z'
  },
  {
    id: 2,
    name: 'María García',
    email: 'maria@farmadata.com',
    phone: '+57 310 987 6543',
    role_id: 2,
    role_name: 'Farmacéutico',
    permissions: ['dashboard.view', 'sales.create', 'inventory.view', 'clients.view'],
    is_active: true,
    last_login: '2024-01-19T12:15:00Z',
    created_at: '2024-01-02T09:00:00Z',
    updated_at: '2024-01-19T12:15:00Z'
  }
];

let mockRoles: Role[] = [
  {
    id: 1,
    name: 'Administrador',
    description: 'Acceso completo al sistema',
    permissions: DEFAULT_PERMISSIONS,
    users_count: 1,
    is_system: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z'
  },
  {
    id: 2,
    name: 'Farmacéutico',
    description: 'Acceso a ventas e inventario',
    permissions: DEFAULT_PERMISSIONS.slice(0, 6),
    users_count: 1,
    is_system: false,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z'
  }
];

let nextUserId = 3;
let nextRoleId = 3;

const simulateApiCall = () => new Promise(resolve => setTimeout(resolve, 500));

const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  
  if (url.includes('/api/settings')) {
    return mockFetchSettings(url, options);
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

const mockFetchSettings = async (url: string, options: RequestInit = {}) => {
  await simulateApiCall();
  
  const method = options.method || 'GET';
  const basePath = url.split('?')[0];
  
  // Pharmacy settings
  if (method === 'GET' && basePath === '/api/settings/pharmacy') {
    return new Response(JSON.stringify({ success: true, data: mockPharmacySettings }), { status: 200 });
  }
  
  if (method === 'PUT' && basePath === '/api/settings/pharmacy') {
    const body = JSON.parse(options.body as string);
    mockPharmacySettings = { ...mockPharmacySettings, ...body, updated_at: new Date().toISOString() };
    return new Response(JSON.stringify({ success: true, data: mockPharmacySettings }), { status: 200 });
  }
  
  // Users
  if (method === 'GET' && basePath === '/api/settings/users') {
    return new Response(JSON.stringify({ success: true, data: mockUsers }), { status: 200 });
  }
  
  if (method === 'POST' && basePath === '/api/settings/users') {
    const body = JSON.parse(options.body as string);
    const role = mockRoles.find(r => r.id === body.role_id);
    const newUser: User = {
      id: nextUserId++,
      ...body,
      role_name: role?.name || 'Sin rol',
      permissions: role?.permissions.map(p => p.name) || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return new Response(JSON.stringify({ success: true, data: newUser }), { status: 201 });
  }
  
  // Roles
  if (method === 'GET' && basePath === '/api/settings/roles') {
    return new Response(JSON.stringify({ success: true, data: mockRoles }), { status: 200 });
  }
  
  if (method === 'POST' && basePath === '/api/settings/roles') {
    const body = JSON.parse(options.body as string);
    const permissions = DEFAULT_PERMISSIONS.filter(p => body.permission_ids.includes(p.id));
    const newRole: Role = {
      id: nextRoleId++,
      ...body,
      permissions,
      users_count: 0,
      is_system: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockRoles.push(newRole);
    return new Response(JSON.stringify({ success: true, data: newRole }), { status: 201 });
  }
  
  // Permissions
  if (method === 'GET' && basePath === '/api/settings/permissions') {
    return new Response(JSON.stringify({ success: true, data: DEFAULT_PERMISSIONS }), { status: 200 });
  }
  
  return new Response(JSON.stringify({ success: false, message: 'Endpoint no encontrado' }), { status: 404 });
};

export const settingsApi = {
  // Pharmacy settings
  getPharmacySettings: async (): Promise<PharmacySettings> => {
    const response = await authenticatedFetch('/api/settings/pharmacy');
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  updatePharmacySettings: async (settings: Partial<PharmacySettings>): Promise<PharmacySettings> => {
    const response = await authenticatedFetch('/api/settings/pharmacy', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    const response = await authenticatedFetch('/api/settings/users');
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  createUser: async (userData: UserFormData): Promise<User> => {
    const response = await authenticatedFetch('/api/settings/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Roles
  getRoles: async (): Promise<Role[]> => {
    const response = await authenticatedFetch('/api/settings/roles');
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  createRole: async (roleData: RoleFormData): Promise<Role> => {
    const response = await authenticatedFetch('/api/settings/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Permissions
  getPermissions: async () => {
    const response = await authenticatedFetch('/api/settings/permissions');
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
};