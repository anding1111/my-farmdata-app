// Re-exportar tipos desde la API para mantener consistencia
export type {
  Product,
  Category,
  Laboratory,
  Batch,
  Supplier,
  InventoryMovement,
  InventoryAlert,
} from '@/api/inventory';

// Tipos adicionales para UI
export interface InventoryStats {
  totalProducts: number;
  totalValue: number;
  lowStockProducts: number;
  expiringProducts: number;
  expiredProducts: number;
  pendingAlerts: number;
}

export interface ProductFormData {
  code: string;
  barcode?: string;
  name: string;
  description?: string;
  category_id: number;
  laboratory_id?: number;
  active_ingredient?: string;
  concentration?: string;
  presentation?: string;
  purchase_price: number;
  sale_price: number;
  min_stock: number;
  max_stock: number;
  location?: string;
  requires_prescription: boolean;
  status: 'active' | 'inactive' | 'discontinued';
}

export interface BatchFormData {
  product_id: number;
  batch_number: string;
  expiry_date: string;
  purchase_date: string;
  quantity: number;
  purchase_price: number;
  supplier_id?: number;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  parent_id?: number;
  status: 'active' | 'inactive';
}

export interface LaboratoryFormData {
  name: string;
  contact_info?: string;
  phone?: string;
  email?: string;
  address?: string;
  status: 'active' | 'inactive';
}

export interface SupplierFormData {
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  tax_id?: string;
  status: 'active' | 'inactive';
}

export interface MovementFormData {
  product_id: number;
  batch_id?: number;
  movement_type: 'entry' | 'exit' | 'adjustment' | 'transfer';
  quantity: number;
  unit_cost?: number;
  reason: string;
  reference_document?: string;
}

export interface InventoryFilters {
  search?: string;
  category_id?: number;
  laboratory_id?: number;
  status?: string;
  low_stock?: boolean;
  expiring_soon?: boolean;
  requires_prescription?: boolean;
}

export interface AlertFilters {
  type?: string;
  priority?: string;
  is_read?: boolean;
}

// Constantes
export const PRODUCT_STATUS_OPTIONS = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'discontinued', label: 'Descontinuado' }
];

export const MOVEMENT_TYPE_OPTIONS = [
  { value: 'entry', label: 'Entrada' },
  { value: 'exit', label: 'Salida' },
  { value: 'adjustment', label: 'Ajuste' },
  { value: 'transfer', label: 'Transferencia' }
];

export const ALERT_TYPE_OPTIONS = [
  { value: 'low_stock', label: 'Stock Bajo' },
  { value: 'expiry_warning', label: 'Próximo a Vencer' },
  { value: 'expired', label: 'Vencido' },
  { value: 'out_of_stock', label: 'Sin Stock' }
];

export const ALERT_PRIORITY_OPTIONS = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' }
];

export const PRESENTATION_OPTIONS = [
  'Tabletas',
  'Cápsulas',
  'Jarabe',
  'Suspensión',
  'Gotas',
  'Ampolletas',
  'Viales',
  'Crema',
  'Ungüento',
  'Gel',
  'Loción',
  'Spray',
  'Inhalador',
  'Supositorios',
  'Óvulos',
  'Parches',
  'Solución',
  'Polvo',
  'Granulado'
];

export const CONCENTRATION_UNITS = [
  'mg',
  'g',
  'mcg',
  'UI',
  'mL',
  '%',
  'mg/mL',
  'g/100mL',
  'mcg/mL'
];