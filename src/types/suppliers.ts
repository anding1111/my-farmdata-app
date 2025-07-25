// Tipos para el módulo de proveedores

export interface Supplier {
  id: number;
  code: string;
  name: string;
  company_name?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  city?: string;
  department?: string;
  country?: string;
  tax_id?: string;
  tax_type: 'RUT' | 'NIT' | 'CC' | 'CE';
  website?: string;
  bank_name?: string;
  bank_account?: string;
  account_type?: 'savings' | 'checking';
  payment_terms?: string;
  credit_limit?: number;
  rating?: 1 | 2 | 3 | 4 | 5;
  supplier_category?: string;
  notes?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

// Datos para formulario de proveedor
export interface SupplierFormData {
  code: string;
  name: string;
  company_name?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  city?: string;
  department?: string;
  country?: string;
  tax_id?: string;
  tax_type: 'RUT' | 'NIT' | 'CC' | 'CE';
  website?: string;
  bank_name?: string;
  bank_account?: string;
  account_type?: 'savings' | 'checking';
  payment_terms?: string;
  credit_limit?: number;
  rating?: 1 | 2 | 3 | 4 | 5;
  supplier_category?: string;
  notes?: string;
  status: 'active' | 'inactive' | 'suspended';
}

// Filtros para búsqueda de proveedores
export interface SupplierFilters {
  search?: string;
  tax_type?: string;
  city?: string;
  department?: string;
  status?: string;
  supplier_category?: string;
  rating?: number;
}

// Constantes
export const TAX_TYPE_OPTIONS = [
  { value: 'RUT', label: 'RUT' },
  { value: 'NIT', label: 'NIT' },
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'CE', label: 'Cédula de Extranjería' }
];

export const SUPPLIER_STATUS_OPTIONS = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'suspended', label: 'Suspendido' }
];

export const ACCOUNT_TYPE_OPTIONS = [
  { value: 'savings', label: 'Ahorros' },
  { value: 'checking', label: 'Corriente' }
];

export const SUPPLIER_CATEGORIES = [
  'Laboratorio Farmacéutico',
  'Distribuidor Mayorista',
  'Importador',
  'Fabricante',
  'Representante Comercial',
  'Droguería',
  'Proveedor de Equipos',
  'Servicios',
  'Otros'
];

export const RATING_OPTIONS = [
  { value: 1, label: '⭐ (1)' },
  { value: 2, label: '⭐⭐ (2)' },
  { value: 3, label: '⭐⭐⭐ (3)' },
  { value: 4, label: '⭐⭐⭐⭐ (4)' },
  { value: 5, label: '⭐⭐⭐⭐⭐ (5)' }
];

export const COLOMBIA_DEPARTMENTS = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá',
  'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba',
  'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena',
  'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda',
  'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca',
  'Vaupés', 'Vichada'
];