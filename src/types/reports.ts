// Tipos para el módulo de reportes

export interface ReportFilter {
  start_date: string;
  end_date: string;
  category_id?: number;
  supplier_id?: number;
  product_id?: number;
  client_id?: number;
  location_id?: number;
  status?: string;
  report_type?: string;
}

export interface SalesReport {
  id: number;
  period: string;
  total_sales: number;
  total_transactions: number;
  average_sale: number;
  best_selling_product: string;
  top_client: string;
  growth_percentage: number;
  daily_sales: DailySale[];
  product_sales: ProductSale[];
  client_sales: ClientSale[];
}

export interface DailySale {
  date: string;
  sales: number;
  transactions: number;
}

export interface ProductSale {
  product_id: number;
  product_name: string;
  product_code: string;
  quantity_sold: number;
  total_revenue: number;
  profit_margin: number;
}

export interface ClientSale {
  client_id: number;
  client_name: string;
  total_purchases: number;
  total_amount: number;
  frequency: number;
}

export interface InventoryReport {
  id: number;
  period: string;
  total_products: number;
  total_value: number;
  low_stock_items: number;
  expired_items: number;
  expiring_soon: number;
  stock_turnover: number;
  categories_summary: CategorySummary[];
  low_stock_products: LowStockProduct[];
  expiry_alerts: ExpiryAlert[];
}

export interface CategorySummary {
  category_id: number;
  category_name: string;
  product_count: number;
  total_value: number;
  percentage: number;
}

export interface LowStockProduct {
  product_id: number;
  product_name: string;
  product_code: string;
  current_stock: number;
  min_stock: number;
  status: 'critical' | 'warning' | 'low';
}

export interface ExpiryAlert {
  product_id: number;
  product_name: string;
  batch_number: string;
  expiry_date: string;
  days_to_expire: number;
  quantity: number;
  status: 'expired' | 'expiring_soon' | 'warning';
}

export interface SupplierReport {
  id: number;
  period: string;
  total_suppliers: number;
  active_suppliers: number;
  total_purchases: number;
  average_delivery_time: number;
  top_suppliers: TopSupplier[];
  supplier_performance: SupplierPerformance[];
}

export interface TopSupplier {
  supplier_id: number;
  supplier_name: string;
  total_orders: number;
  total_amount: number;
  on_time_delivery: number;
  rating: number;
}

export interface SupplierPerformance {
  supplier_id: number;
  supplier_name: string;
  orders_completed: number;
  average_delivery_days: number;
  quality_rating: number;
  payment_terms_compliance: number;
}

export interface ClientReport {
  id: number;
  period: string;
  total_clients: number;
  new_clients: number;
  active_clients: number;
  client_retention_rate: number;
  average_purchase_value: number;
  top_clients: TopClient[];
  client_segments: ClientSegment[];
}

export interface TopClient {
  client_id: number;
  client_name: string;
  total_purchases: number;
  total_amount: number;
  last_purchase_date: string;
  loyalty_score: number;
}

export interface ClientSegment {
  segment: string;
  client_count: number;
  percentage: number;
  average_value: number;
}

export interface FinancialReport {
  id: number;
  period: string;
  total_revenue: number;
  total_costs: number;
  gross_profit: number;
  net_profit: number;
  profit_margin: number;
  monthly_comparison: MonthlyFinancial[];
  expense_breakdown: ExpenseBreakdown[];
}

export interface MonthlyFinancial {
  month: string;
  revenue: number;
  costs: number;
  profit: number;
}

export interface ExpenseBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface ReportExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  include_charts: boolean;
  include_details: boolean;
  template?: string;
}

// Constantes
export const REPORT_TYPES = [
  { value: 'sales', label: 'Ventas', icon: 'TrendingUp' },
  { value: 'inventory', label: 'Inventario', icon: 'Package' },
  { value: 'clients', label: 'Clientes', icon: 'Users' },
  { value: 'suppliers', label: 'Proveedores', icon: 'Building' },
  { value: 'financial', label: 'Financiero', icon: 'DollarSign' },
  { value: 'products', label: 'Productos', icon: 'Pill' }
];

export const PERIOD_OPTIONS = [
  { value: 'today', label: 'Hoy' },
  { value: 'yesterday', label: 'Ayer' },
  { value: 'this_week', label: 'Esta Semana' },
  { value: 'last_week', label: 'Semana Pasada' },
  { value: 'this_month', label: 'Este Mes' },
  { value: 'last_month', label: 'Mes Pasado' },
  { value: 'this_quarter', label: 'Este Trimestre' },
  { value: 'last_quarter', label: 'Trimestre Pasado' },
  { value: 'this_year', label: 'Este Año' },
  { value: 'last_year', label: 'Año Pasado' },
  { value: 'custom', label: 'Personalizado' }
];

export const EXPORT_FORMATS = [
  { value: 'pdf', label: 'PDF', icon: 'FileText' },
  { value: 'excel', label: 'Excel', icon: 'FileSpreadsheet' },
  { value: 'csv', label: 'CSV', icon: 'File' }
];