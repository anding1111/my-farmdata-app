// Tipos para el módulo de configuración

export interface PharmacySettings {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  nit: string;
  license_number: string;
  manager_name: string;
  logo_url?: string;
  opening_hours: {
    monday: { open: string; close: string; is_closed: boolean };
    tuesday: { open: string; close: string; is_closed: boolean };
    wednesday: { open: string; close: string; is_closed: boolean };
    thursday: { open: string; close: string; is_closed: boolean };
    friday: { open: string; close: string; is_closed: boolean };
    saturday: { open: string; close: string; is_closed: boolean };
    sunday: { open: string; close: string; is_closed: boolean };
  };
  tax_settings: {
    iva_rate: number;
    retention_rate: number;
    discount_rate: number;
  };
  notification_settings: {
    low_stock_alerts: boolean;
    expiry_alerts: boolean;
    email_notifications: boolean;
    sms_notifications: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role_id: number;
  role_name: string;
  permissions: string[];
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
  users_count: number;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  name: string;
  description: string;
  module: string;
  action: string;
  resource: string;
}

export interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  role_id: number;
  password?: string;
  password_confirmation?: string;
  is_active: boolean;
}

export interface RoleFormData {
  name: string;
  description: string;
  permission_ids: number[];
}

// Constantes
export const USER_STATUS_OPTIONS = [
  { value: true, label: 'Activo' },
  { value: false, label: 'Inactivo' }
];

export const PERMISSION_MODULES = [
  'dashboard',
  'sales',
  'inventory', 
  'clients',
  'suppliers',
  'reports',
  'settings'
];

export const PERMISSION_ACTIONS = [
  'view',
  'create', 
  'edit',
  'delete',
  'export'
];

export const DEFAULT_PERMISSIONS = [
  { id: 1, name: 'dashboard.view', description: 'Ver dashboard', module: 'dashboard', action: 'view', resource: 'dashboard' },
  { id: 2, name: 'sales.view', description: 'Ver ventas', module: 'sales', action: 'view', resource: 'sales' },
  { id: 3, name: 'sales.create', description: 'Crear ventas', module: 'sales', action: 'create', resource: 'sales' },
  { id: 4, name: 'inventory.view', description: 'Ver inventario', module: 'inventory', action: 'view', resource: 'inventory' },
  { id: 5, name: 'inventory.edit', description: 'Editar inventario', module: 'inventory', action: 'edit', resource: 'inventory' },
  { id: 6, name: 'clients.view', description: 'Ver clientes', module: 'clients', action: 'view', resource: 'clients' },
  { id: 7, name: 'clients.create', description: 'Crear clientes', module: 'clients', action: 'create', resource: 'clients' },
  { id: 8, name: 'suppliers.view', description: 'Ver proveedores', module: 'suppliers', action: 'view', resource: 'suppliers' },
  { id: 9, name: 'reports.view', description: 'Ver reportes', module: 'reports', action: 'view', resource: 'reports' },
  { id: 10, name: 'settings.view', description: 'Ver configuración', module: 'settings', action: 'view', resource: 'settings' },
  { id: 11, name: 'settings.edit', description: 'Editar configuración', module: 'settings', action: 'edit', resource: 'settings' }
];

export const WEEKDAYS = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' }
];