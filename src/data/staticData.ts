// Static data for frontend-only operation
import { Product as InventoryProduct, Category, Laboratory, Supplier, Batch } from "@/api/inventory";

export interface StaticProduct extends Omit<InventoryProduct, 'current_stock'> {
  current_stock: number;
}

// Static Categories
export const staticCategories: Category[] = [
  { id: 1, name: "Analgésicos", description: "Medicamentos para el dolor", parent_id: null, status: "active", created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 2, name: "Antibióticos", description: "Medicamentos antimicrobianos", parent_id: null, status: "active", created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 3, name: "Vitaminas", description: "Suplementos vitamínicos", parent_id: null, status: "active", created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 4, name: "Antihistamínicos", description: "Medicamentos para alergias", parent_id: null, status: "active", created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 5, name: "Cardiovasculares", description: "Medicamentos para el corazón", parent_id: null, status: "active", created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 6, name: "Digestivos", description: "Medicamentos para el sistema digestivo", parent_id: null, status: "active", created_at: "2024-01-01", updated_at: "2024-01-01" },
];

// Static Laboratories
export const staticLaboratories: Laboratory[] = [
  { id: 1, name: "Laboratorios Bayer", contact_info: "info@bayer.com", phone: "+1234567890", email: "info@bayer.com", address: "Calle Principal 123", status: "active", created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 2, name: "Pfizer Colombia", contact_info: "contacto@pfizer.co", phone: "+1234567891", email: "contacto@pfizer.co", address: "Av. El Dorado 456", status: "active", created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 3, name: "Laboratorios Genfar", contact_info: "info@genfar.com", phone: "+1234567892", email: "info@genfar.com", address: "Carrera 7 789", status: "active", created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 4, name: "Tecnoquímicas", contact_info: "contacto@tecnoquimicas.com", phone: "+1234567893", email: "contacto@tecnoquimicas.com", address: "Zona Industrial 321", status: "active", created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 5, name: "Laboratorios Synthesis", contact_info: "info@synthesis.com", phone: "+1234567894", email: "info@synthesis.com", address: "Calle 85 654", status: "active", created_at: "2024-01-01", updated_at: "2024-01-01" },
];

// Static Suppliers
export const staticSuppliers: Supplier[] = [
  { id: 1, name: "Distribuidora Farmacéutica ABC", contact_person: "Juan Pérez", phone: "+1234567890", email: "juan@abc.com", address: "Calle 123", tax_id: "900123456-1", status: "active", created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 2, name: "Farmadrogas S.A.S", contact_person: "María García", phone: "+1234567891", email: "maria@farmadrogas.com", address: "Av. 456", tax_id: "900123457-2", status: "active", created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 3, name: "Droguería Nacional", contact_person: "Carlos López", phone: "+1234567892", email: "carlos@nacional.com", address: "Carrera 789", tax_id: "900123458-3", status: "active", created_at: "2024-01-01", updated_at: "2024-01-01" },
];

// Static Products with complete pharmacy inventory
export const staticProducts: StaticProduct[] = [
  {
    id: 1,
    code: "PARA500",
    barcode: "7702001234567",
    name: "Paracetamol 500mg",
    description: "Analgésico y antipirético para el alivio del dolor y fiebre",
    category_id: 1,
    laboratory_id: 1,
    active_ingredient: "Paracetamol",
    concentration: "500mg",
    presentation: "Tabletas",
    purchase_price: 1500,
    sale_price: 2800,
    current_stock: 150,
    min_stock: 20,
    max_stock: 500,
    location: "Estante A-1",
    requires_prescription: false,
    status: "active",
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  },
  {
    id: 2,
    code: "AMOX500",
    barcode: "7702001234568",
    name: "Amoxicilina 500mg",
    description: "Antibiótico de amplio espectro",
    category_id: 2,
    laboratory_id: 2,
    active_ingredient: "Amoxicilina",
    concentration: "500mg",
    presentation: "Cápsulas",
    purchase_price: 3200,
    sale_price: 5800,
    current_stock: 85,
    min_stock: 30,
    max_stock: 300,
    location: "Estante B-2",
    requires_prescription: true,
    status: "active",
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  },
  {
    id: 3,
    code: "VITC1000",
    barcode: "7702001234569",
    name: "Vitamina C 1000mg",
    description: "Suplemento vitamínico para reforzar el sistema inmunológico",
    category_id: 3,
    laboratory_id: 3,
    active_ingredient: "Ácido Ascórbico",
    concentration: "1000mg",
    presentation: "Tabletas",
    purchase_price: 2800,
    sale_price: 4500,
    current_stock: 200,
    min_stock: 40,
    max_stock: 600,
    location: "Estante C-1",
    requires_prescription: false,
    status: "active",
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  },
  {
    id: 4,
    code: "LORA10",
    barcode: "7702001234570",
    name: "Loratadina 10mg",
    description: "Antihistamínico para el tratamiento de alergias",
    category_id: 4,
    laboratory_id: 4,
    active_ingredient: "Loratadina",
    concentration: "10mg",
    presentation: "Tabletas",
    purchase_price: 1800,
    sale_price: 3200,
    current_stock: 75,
    min_stock: 25,
    max_stock: 250,
    location: "Estante D-1",
    requires_prescription: false,
    status: "active",
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  },
  {
    id: 5,
    code: "ATEN50",
    barcode: "7702001234571",
    name: "Atenolol 50mg",
    description: "Betabloqueador para hipertensión arterial",
    category_id: 5,
    laboratory_id: 5,
    active_ingredient: "Atenolol",
    concentration: "50mg",
    presentation: "Tabletas",
    purchase_price: 2200,
    sale_price: 4000,
    current_stock: 45,
    min_stock: 15,
    max_stock: 200,
    location: "Estante E-1",
    requires_prescription: true,
    status: "active",
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  },
  {
    id: 6,
    code: "OMEP20",
    barcode: "7702001234572",
    name: "Omeprazol 20mg",
    description: "Inhibidor de la bomba de protones para úlceras gástricas",
    category_id: 6,
    laboratory_id: 1,
    active_ingredient: "Omeprazol",
    concentration: "20mg",
    presentation: "Cápsulas",
    purchase_price: 2600,
    sale_price: 4800,
    current_stock: 120,
    min_stock: 30,
    max_stock: 400,
    location: "Estante F-1",
    requires_prescription: false,
    status: "active",
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  },
  {
    id: 7,
    code: "IBUPR400",
    barcode: "7702001234573",
    name: "Ibuprofeno 400mg",
    description: "Antiinflamatorio no esteroideo",
    category_id: 1,
    laboratory_id: 2,
    active_ingredient: "Ibuprofeno",
    concentration: "400mg",
    presentation: "Tabletas",
    purchase_price: 1700,
    sale_price: 3100,
    current_stock: 95,
    min_stock: 25,
    max_stock: 350,
    location: "Estante A-2",
    requires_prescription: false,
    status: "active",
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  },
  {
    id: 8,
    code: "VITD3",
    barcode: "7702001234574",
    name: "Vitamina D3 2000 UI",
    description: "Suplemento de vitamina D para huesos fuertes",
    category_id: 3,
    laboratory_id: 3,
    active_ingredient: "Colecalciferol",
    concentration: "2000 UI",
    presentation: "Cápsulas",
    purchase_price: 3500,
    sale_price: 6200,
    current_stock: 80,
    min_stock: 20,
    max_stock: 300,
    location: "Estante C-2",
    requires_prescription: false,
    status: "active",
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  },
  {
    id: 9,
    code: "CLOR10",
    barcode: "7702001234575",
    name: "Clorfenamina 10mg",
    description: "Antihistamínico clásico para alergias",
    category_id: 4,
    laboratory_id: 4,
    active_ingredient: "Clorfenamina",
    concentration: "10mg",
    presentation: "Tabletas",
    purchase_price: 1200,
    sale_price: 2400,
    current_stock: 60,
    min_stock: 20,
    max_stock: 200,
    location: "Estante D-2",
    requires_prescription: false,
    status: "active",
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  },
  {
    id: 10,
    code: "AMLOD5",
    barcode: "7702001234576",
    name: "Amlodipino 5mg",
    description: "Bloqueador de canales de calcio para hipertensión",
    category_id: 5,
    laboratory_id: 5,
    active_ingredient: "Amlodipino",
    concentration: "5mg",
    presentation: "Tabletas",
    purchase_price: 1900,
    sale_price: 3600,
    current_stock: 110,
    min_stock: 25,
    max_stock: 350,
    location: "Estante E-2",
    requires_prescription: true,
    status: "active",
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  }
];

// Static Batches
export const staticBatches: Batch[] = [
  {
    id: 1,
    product_id: 1,
    batch_number: "PARA001",
    manufacture_date: "2024-01-15",
    expiry_date: "2026-01-15",
    purchase_date: "2024-02-01",
    quantity: 100,
    remaining_quantity: 100,
    purchase_price: 1500,
    supplier_id: 1,
    status: "active",
    created_at: "2024-02-01",
    updated_at: "2024-02-01"
  },
  {
    id: 2,
    product_id: 2,
    batch_number: "AMOX002",
    manufacture_date: "2024-02-10",
    expiry_date: "2025-02-10",
    purchase_date: "2024-02-15",
    quantity: 50,
    remaining_quantity: 50,
    purchase_price: 3200,
    supplier_id: 2,
    status: "active",
    created_at: "2024-02-15",
    updated_at: "2024-02-15"
  },
  {
    id: 3,
    product_id: 3,
    batch_number: "VITC003",
    manufacture_date: "2024-01-20",
    expiry_date: "2027-01-20",
    purchase_date: "2024-02-05",
    quantity: 150,
    remaining_quantity: 150,
    purchase_price: 2800,
    supplier_id: 1,
    status: "active",
    created_at: "2024-02-05",
    updated_at: "2024-02-05"
  }
];

// Get static data functions
export const getStaticProducts = () => [...staticProducts];
export const getStaticCategories = () => [...staticCategories];
export const getStaticLaboratories = () => [...staticLaboratories];
export const getStaticSuppliers = () => [...staticSuppliers];
export const getStaticBatches = () => [...staticBatches];

// Counter for new IDs
let nextProductId = Math.max(...staticProducts.map(p => p.id)) + 1;
let nextCategoryId = Math.max(...staticCategories.map(c => c.id)) + 1;
let nextLabId = Math.max(...staticLaboratories.map(l => l.id)) + 1;
let nextSupplierId = Math.max(...staticSuppliers.map(s => s.id)) + 1;
let nextBatchId = Math.max(...staticBatches.map(b => b.id)) + 1;

export const getNextProductId = () => nextProductId++;
export const getNextCategoryId = () => nextCategoryId++;
export const getNextLabId = () => nextLabId++;
export const getNextSupplierId = () => nextSupplierId++;
export const getNextBatchId = () => nextBatchId++;