import { 
  ReportFilter, 
  SalesReport, 
  InventoryReport, 
  SupplierReport, 
  ClientReport, 
  FinancialReport,
  ReportExportOptions 
} from '@/types/reports';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Mock data para desarrollo
const mockSalesReport: SalesReport = {
  id: 1,
  period: '2024-01',
  total_sales: 15750000,
  total_transactions: 342,
  average_sale: 46053,
  best_selling_product: 'Vitamina D3',
  top_client: 'María García López',
  growth_percentage: 12.5,
  daily_sales: [
    { date: '2024-01-01', sales: 450000, transactions: 12 },
    { date: '2024-01-02', sales: 380000, transactions: 8 },
    { date: '2024-01-03', sales: 520000, transactions: 15 },
    { date: '2024-01-04', sales: 670000, transactions: 18 },
    { date: '2024-01-05', sales: 890000, transactions: 25 },
    { date: '2024-01-06', sales: 750000, transactions: 20 },
    { date: '2024-01-07', sales: 410000, transactions: 11 }
  ],
  product_sales: [
    { product_id: 1, product_name: 'Vitamina D3', product_code: 'VIT-D3-001', quantity_sold: 45, total_revenue: 1350000, profit_margin: 35 },
    { product_id: 2, product_name: 'Omega 3', product_code: 'OMG-001', quantity_sold: 32, total_revenue: 960000, profit_margin: 40 },
    { product_id: 3, product_name: 'Complejo B', product_code: 'CB-001', quantity_sold: 28, total_revenue: 840000, profit_margin: 32 }
  ],
  client_sales: [
    { client_id: 1, client_name: 'María García López', total_purchases: 8, total_amount: 450000, frequency: 2.1 },
    { client_id: 2, client_name: 'Carlos Rodríguez', total_purchases: 6, total_amount: 380000, frequency: 1.8 },
    { client_id: 3, client_name: 'Ana Martínez', total_purchases: 5, total_amount: 290000, frequency: 1.5 }
  ]
};

const mockInventoryReport: InventoryReport = {
  id: 1,
  period: '2024-01',
  total_products: 156,
  total_value: 45000000,
  low_stock_items: 12,
  expired_items: 3,
  expiring_soon: 8,
  stock_turnover: 4.2,
  categories_summary: [
    { category_id: 1, category_name: 'Vitaminas', product_count: 45, total_value: 15000000, percentage: 33.3 },
    { category_id: 2, category_name: 'Articulaciones', product_count: 32, total_value: 12000000, percentage: 26.7 },
    { category_id: 3, category_name: 'Cardiovascular', product_count: 28, total_value: 10000000, percentage: 22.2 }
  ],
  low_stock_products: [
    { product_id: 4, product_name: 'Calcio + Magnesio', product_code: 'CAL-001', current_stock: 5, min_stock: 20, status: 'critical' },
    { product_id: 5, product_name: 'Hierro Quelado', product_code: 'HIE-001', current_stock: 12, min_stock: 25, status: 'warning' }
  ],
  expiry_alerts: [
    { product_id: 6, product_name: 'Probióticos', batch_number: 'LOT-2024-001', expiry_date: '2024-02-15', days_to_expire: 5, quantity: 15, status: 'expiring_soon' },
    { product_id: 7, product_name: 'Enzimas Digestivas', batch_number: 'LOT-2023-045', expiry_date: '2024-01-30', days_to_expire: -2, quantity: 8, status: 'expired' }
  ]
};

const mockSupplierReport: SupplierReport = {
  id: 1,
  period: '2024-01',
  total_suppliers: 25,
  active_suppliers: 18,
  total_purchases: 8500000,
  average_delivery_time: 3.2,
  top_suppliers: [
    { supplier_id: 1, supplier_name: 'Laboratorios ABC', total_orders: 15, total_amount: 3200000, on_time_delivery: 93.3, rating: 4.8 },
    { supplier_id: 2, supplier_name: 'Distribuidora Norte', total_orders: 12, total_amount: 2800000, on_time_delivery: 91.7, rating: 4.6 }
  ],
  supplier_performance: [
    { supplier_id: 1, supplier_name: 'Laboratorios ABC', orders_completed: 15, average_delivery_days: 2.8, quality_rating: 4.8, payment_terms_compliance: 100 },
    { supplier_id: 2, supplier_name: 'Distribuidora Norte', orders_completed: 12, average_delivery_days: 3.1, quality_rating: 4.6, payment_terms_compliance: 95 }
  ]
};

const mockClientReport: ClientReport = {
  id: 1,
  period: '2024-01',
  total_clients: 1250,
  new_clients: 85,
  active_clients: 890,
  client_retention_rate: 78.5,
  average_purchase_value: 85000,
  top_clients: [
    { client_id: 1, client_name: 'María García López', total_purchases: 8, total_amount: 450000, last_purchase_date: '2024-01-28', loyalty_score: 95 },
    { client_id: 2, client_name: 'Carlos Rodríguez', total_purchases: 6, total_amount: 380000, last_purchase_date: '2024-01-26', loyalty_score: 88 }
  ],
  client_segments: [
    { segment: 'Premium', client_count: 125, percentage: 10, average_value: 250000 },
    { segment: 'Frecuente', client_count: 375, percentage: 30, average_value: 120000 },
    { segment: 'Ocasional', client_count: 750, percentage: 60, average_value: 45000 }
  ]
};

const mockFinancialReport: FinancialReport = {
  id: 1,
  period: '2024-01',
  total_revenue: 15750000,
  total_costs: 9500000,
  gross_profit: 6250000,
  net_profit: 4800000,
  profit_margin: 30.5,
  monthly_comparison: [
    { month: '2023-11', revenue: 14200000, costs: 8900000, profit: 5300000 },
    { month: '2023-12', revenue: 15100000, costs: 9200000, profit: 5900000 },
    { month: '2024-01', revenue: 15750000, costs: 9500000, profit: 6250000 }
  ],
  expense_breakdown: [
    { category: 'Compras de Inventario', amount: 7200000, percentage: 75.8 },
    { category: 'Personal', amount: 1800000, percentage: 18.9 },
    { category: 'Servicios', amount: 300000, percentage: 3.2 },
    { category: 'Otros', amount: 200000, percentage: 2.1 }
  ]
};

// Helper function para simular llamadas a la API
const simulateApiCall = () => new Promise(resolve => setTimeout(resolve, 800));

// Función helper para hacer requests autenticados
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  
  // Mock implementation para reportes
  if (url.includes('/api/reports')) {
    return mockFetchReports(url, options);
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

// Mock fetch para reportes
const mockFetchReports = async (url: string, options: RequestInit = {}) => {
  await simulateApiCall();
  
  const method = options.method || 'GET';
  const urlParts = url.split('?');
  const basePath = urlParts[0];
  
  if (method === 'GET' && basePath === '/api/reports/sales') {
    return new Response(JSON.stringify({
      success: true,
      data: mockSalesReport
    }), { status: 200 });
  }
  
  if (method === 'GET' && basePath === '/api/reports/inventory') {
    return new Response(JSON.stringify({
      success: true,
      data: mockInventoryReport
    }), { status: 200 });
  }
  
  if (method === 'GET' && basePath === '/api/reports/suppliers') {
    return new Response(JSON.stringify({
      success: true,
      data: mockSupplierReport
    }), { status: 200 });
  }
  
  if (method === 'GET' && basePath === '/api/reports/clients') {
    return new Response(JSON.stringify({
      success: true,
      data: mockClientReport
    }), { status: 200 });
  }
  
  if (method === 'GET' && basePath === '/api/reports/financial') {
    return new Response(JSON.stringify({
      success: true,
      data: mockFinancialReport
    }), { status: 200 });
  }
  
  if (method === 'POST' && basePath === '/api/reports/export') {
    // Simular exportación
    return new Response(JSON.stringify({
      success: true,
      data: {
        download_url: '/downloads/report_' + Date.now() + '.pdf',
        filename: 'reporte_' + Date.now() + '.pdf'
      }
    }), { status: 200 });
  }
  
  return new Response(JSON.stringify({
    success: false,
    message: 'Endpoint no encontrado'
  }), { status: 404 });
};

// API methods
export const reportsApi = {
  // Obtener reporte de ventas
  getSalesReport: async (filters: ReportFilter): Promise<SalesReport> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const queryString = params.toString();
    const url = `/api/reports/sales${queryString ? `?${queryString}` : ''}`;
    
    const response = await authenticatedFetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al obtener reporte de ventas');
    }
    
    return data.data;
  },

  // Obtener reporte de inventario
  getInventoryReport: async (filters: ReportFilter): Promise<InventoryReport> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const queryString = params.toString();
    const url = `/api/reports/inventory${queryString ? `?${queryString}` : ''}`;
    
    const response = await authenticatedFetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al obtener reporte de inventario');
    }
    
    return data.data;
  },

  // Obtener reporte de proveedores
  getSupplierReport: async (filters: ReportFilter): Promise<SupplierReport> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const queryString = params.toString();
    const url = `/api/reports/suppliers${queryString ? `?${queryString}` : ''}`;
    
    const response = await authenticatedFetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al obtener reporte de proveedores');
    }
    
    return data.data;
  },

  // Obtener reporte de clientes
  getClientReport: async (filters: ReportFilter): Promise<ClientReport> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const queryString = params.toString();
    const url = `/api/reports/clients${queryString ? `?${queryString}` : ''}`;
    
    const response = await authenticatedFetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al obtener reporte de clientes');
    }
    
    return data.data;
  },

  // Obtener reporte financiero
  getFinancialReport: async (filters: ReportFilter): Promise<FinancialReport> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const queryString = params.toString();
    const url = `/api/reports/financial${queryString ? `?${queryString}` : ''}`;
    
    const response = await authenticatedFetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al obtener reporte financiero');
    }
    
    return data.data;
  },

  // Exportar reporte
  exportReport: async (reportType: string, filters: ReportFilter, options: ReportExportOptions): Promise<{ download_url: string; filename: string }> => {
    const response = await authenticatedFetch('/api/reports/export', {
      method: 'POST',
      body: JSON.stringify({
        report_type: reportType,
        filters,
        export_options: options
      }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al exportar reporte');
    }
    
    return data.data;
  },
};