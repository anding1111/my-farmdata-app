// Tipos para el módulo de clientes

export interface Client {
  id: number;
  code: string;
  name: string;
  email?: string;
  phone?: string;
  document_type: 'CC' | 'TI' | 'CE' | 'PP' | 'NIT';
  document_number: string;
  birth_date?: string;
  address?: string;
  city?: string;
  department?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  insurance_provider?: string;
  insurance_number?: string;
  allergies?: string;
  medical_conditions?: string;
  notes?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

// Datos para formulario de cliente
export interface ClientFormData {
  code: string;
  name: string;
  email?: string;
  phone?: string;
  document_type: 'CC' | 'TI' | 'CE' | 'PP' | 'NIT';
  document_number: string;
  birth_date?: string;
  address?: string;
  city?: string;
  department?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  insurance_provider?: string;
  insurance_number?: string;
  allergies?: string;
  medical_conditions?: string;
  notes?: string;
  status: 'active' | 'inactive';
}

// Filtros para búsqueda de clientes
export interface ClientFilters {
  search?: string;
  document_type?: string;
  city?: string;
  department?: string;
  status?: string;
  has_insurance?: boolean;
}

// Constantes
export const DOCUMENT_TYPE_OPTIONS = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PP', label: 'Pasaporte' },
  { value: 'NIT', label: 'NIT' }
];

export const CLIENT_STATUS_OPTIONS = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' }
];

export const COLOMBIA_DEPARTMENTS = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá',
  'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba',
  'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena',
  'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda',
  'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca',
  'Vaupés', 'Vichada'
];