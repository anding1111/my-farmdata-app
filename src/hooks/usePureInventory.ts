import { useDataStructuresContext } from '../context/DataStructuresContext';

import { getStaticCategories, getStaticLaboratories, getStaticSuppliers } from '../data/staticData';

// Hook que integra las estructuras puras con la funcionalidad de inventario
export const usePureInventory = () => {
  const dataStructures = useDataStructuresContext();

  // Datos estáticos para dropdowns
  const categories = getStaticCategories();
  const laboratories = getStaticLaboratories();
  const suppliers = getStaticSuppliers();
  const presentations = [
    { id: 1, name: 'Tabletas' },
    { id: 2, name: 'Cápsulas' },
    { id: 3, name: 'Jarabe' },
    { id: 4, name: 'Gotas' },
    { id: 5, name: 'Crema' },
    { id: 6, name: 'Spray' }
  ];

  // Funciones de productos usando AVL Tree
  const createProduct = (productData: any) => {
    const product = {
      ...productData,
      // Ensure both naming conventions work
      price: productData.sale_price || productData.price,
      stock: productData.current_stock || productData.stock,
      minStock: productData.min_stock || productData.minStock,
      category: productData.category_id?.toString() || productData.category,
      laboratory: productData.laboratory_id?.toString() || productData.laboratory,
      requiresPrescription: productData.requires_prescription || productData.requiresPrescription,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dataStructures.addProduct(product);
    return { data: product };
  };

  const updateProduct = (id: number, productData: any) => {
    const updatedProduct = {
      ...productData,
      id,
      // Ensure both naming conventions work
      price: productData.sale_price || productData.price,
      stock: productData.current_stock || productData.stock,
      minStock: productData.min_stock || productData.minStock,
      category: productData.category_id?.toString() || productData.category,
      laboratory: productData.laboratory_id?.toString() || productData.laboratory,
      requiresPrescription: productData.requires_prescription || productData.requiresPrescription,
      updatedAt: new Date().toISOString()
    };
    dataStructures.updateProduct(updatedProduct);
    return { data: updatedProduct };
  };

  const deleteProduct = (id: number) => {
    const product = dataStructures.products.find(p => p.id === id);
    if (product) {
      dataStructures.deleteProduct(id);
      return { success: true };
    }
    return { success: false };
  };

  const searchProducts = (query: string) => {
    return dataStructures.products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Funciones de turnos usando LinkedQueue
  const createTurn = (turnData: any) => {
    const turn = {
      ...turnData,
      ticket: `T${Date.now().toString().slice(-6)}`,
      time: new Date().toLocaleTimeString(),
      priority: turnData.priority || 'normal'
    };
    dataStructures.addTurn(turn);
    return { data: turn };
  };

  const serveTurn = () => {
    const servedTurn = dataStructures.serveTurn();
    return { data: servedTurn };
  };

  const getNextTurn = () => {
    return dataStructures.peekNextTurn();
  };

  // Funciones de ventas usando LinkedList
  const createSale = (saleData: any) => {
    const sale = {
      ...saleData,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString()
    };
    dataStructures.addSale(sale);
    
    // Actualizar stock del producto vendido
    const product = dataStructures.products.find(p => p.name === sale.product);
    if (product && product.stock >= sale.quantity) {
      const updatedProduct = {
        ...product,
        stock: product.stock - sale.quantity
      };
      dataStructures.updateProduct(updatedProduct);
    }
    
    return { data: sale };
  };

  const deleteSale = (id: number) => {
    const success = dataStructures.removeSale(id);
    return { success };
  };

  const clearSalesHistory = () => {
    dataStructures.clearSalesHistory();
    return { success: true };
  };

  // Funciones de relaciones usando Graph
  const createRelation = (relationData: any) => {
    dataStructures.addRelation(relationData);
    return { data: relationData };
  };

  const addRelationEdge = (fromId: string, toId: string, weight = 1) => {
    dataStructures.addRelationEdge(fromId, toId);
    return { success: true };
  };

  // Stats calculadas en tiempo real
  const getInventoryStats = () => {
    const products = dataStructures.products;
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => (p.stock || p.current_stock || 0) < (p.minStock || p.min_stock || 0)).length;
    const totalValue = products.reduce((sum, p) => sum + ((p.price || p.sale_price || 0) * (p.stock || p.current_stock || 0)), 0);
    const categoriesCount = new Set(products.map(p => p.category || p.category_id)).size;

    return {
      totalProducts,
      lowStockProducts,
      totalValue,
      categoriesCount,
      turnsPending: dataStructures.turns.length,
      totalSales: dataStructures.sales.length,
      relations: dataStructures.relations.length
    };
  };

  return {
    // Datos
    products: dataStructures.products,
    turns: dataStructures.turns,
    sales: dataStructures.sales,
    relations: dataStructures.relations,
    
    // Datos estáticos
    categories,
    laboratories,
    suppliers,
    presentations,
    
    // Funciones de productos
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    
    // Funciones de turnos
    createTurn,
    serveTurn,
    getNextTurn,
    
    // Funciones de ventas
    createSale,
    deleteSale,
    clearSalesHistory,
    
    // Funciones de relaciones
    createRelation,
    addRelationEdge,
    
    // Stats
    getInventoryStats,
    
    
    // Acceso directo a estructuras para debugging
    _internal: {
      avlTree: dataStructures.structures?.productTree,
      linkedQueue: dataStructures.structures?.turnQueue,
      linkedList: dataStructures.structures?.salesHistory,
      graph: dataStructures.structures?.relationGraph
    }
  };
};