import { useState, useEffect } from 'react';
import { AvlTree } from '@/structures/AvlTree';
import { LinkedQueue } from '@/structures/LinkedQueue';
import { LinkedList } from '@/structures/LinkedList';
import { Graph, Vertex } from '@/structures/Graph';
import { Stack } from '@/structures/Stack';


// Tipos para las estructuras - Aligned with full inventory system
export interface Product {
  id: number;
  code?: string;
  barcode?: string;
  name: string;
  description?: string;
  category_id?: number;
  category?: string;
  laboratory_id?: number;
  laboratory?: string;
  active_ingredient?: string;
  concentration?: string;
  presentation?: string;
  purchase_price?: number;
  sale_price?: number;
  price?: number; // For backward compatibility
  current_stock?: number;
  stock?: number; // For backward compatibility
  min_stock?: number;
  minStock?: number; // For backward compatibility
  max_stock?: number;
  location?: string;
  requires_prescription?: boolean;
  requiresPrescription?: boolean; // For backward compatibility
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Turn {
  id: number;
  customer: string;
  ticket: number;
  priority: string;
  time: string;
}

export interface Sale {
  id: number;
  productId?: number;
  product?: string;
  productName?: string;
  quantity: number;
  total: number;
  date: string;
  customer: string;
}

export interface Relation {
  id: string;
  type: 'supplier' | 'product' | 'category';
  name: string;
}

export interface Action {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  user: string;
  details?: any;
}

// Hook principal para manejar todas las estructuras de datos
export const useDataStructures = () => {
  
  // Inicializar estructuras
  const [productTree] = useState(() => new AvlTree<Product>((a, b) => a.id - b.id));
  const [turnQueue] = useState(() => new LinkedQueue<Turn>());
  const [salesHistory] = useState(() => new LinkedList<Sale>());
  const [relationGraph] = useState(() => new Graph<Relation>());
  const [actionsStack] = useState(() => new Stack<Action>());

  // Estados para las UI
  const [products, setProducts] = useState<Product[]>([]);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [relations, setRelations] = useState<Relation[]>([]);
  const [actionsHistory, setActionsHistory] = useState<Action[]>([]);

  // Inicializar con datos de ejemplo
  useEffect(() => {
    console.log('🚀 Inicializando estructuras de datos...');
    
    // Productos de ejemplo
    const sampleProducts: Product[] = [
      { id: 1, name: 'Aspirina', price: 15000, category: 'Analgésicos', stock: 50 },
      { id: 2, name: 'Vitamina C', price: 25000, category: 'Vitaminas', stock: 30 },
      { id: 3, name: 'Ibuprofeno', price: 18000, category: 'Analgésicos', stock: 25 }
    ];

    sampleProducts.forEach(product => {
      productTree.insert(product);
    });
    setProducts(productTree.inOrder());

    // Turnos de ejemplo
    const sampleTurns: Turn[] = [
      { id: 1, customer: 'Juan Pérez', ticket: 101, priority: 'normal', time: '09:30' },
      { id: 2, customer: 'María García', ticket: 102, priority: 'alta', time: '09:45' }
    ];

    sampleTurns.forEach(turn => {
      turnQueue.enqueue(turn);
    });
    setTurns(turnQueue.toArray());

    // Relaciones de ejemplo
    const supplier = relationGraph.addVertex({ id: 'supp1', type: 'supplier', name: 'Laboratorios ABC' });
    const category = relationGraph.addVertex({ id: 'cat1', type: 'category', name: 'Analgésicos' });
    const productVertex = relationGraph.addVertex({ id: 'prod1', type: 'product', name: 'Aspirina' });
    
    relationGraph.addEdge(supplier, productVertex, 1, 'suministra');
    relationGraph.addEdge(productVertex, category, 1, 'pertenece_a');
    
    setRelations(relationGraph.getVertices().map(v => v.data));

    // Acciones de ejemplo
    const sampleActions: Action[] = [
      { id: 1, type: 'Sistema', description: 'Sistema iniciado', timestamp: new Date().toLocaleString('es-ES'), user: 'Sistema', details: {} },
      { id: 2, type: 'Sistema', description: 'Estructuras de datos inicializadas', timestamp: new Date().toLocaleString('es-ES'), user: 'Sistema', details: {} }
    ];

    sampleActions.forEach(action => {
      actionsStack.push(action);
    });
    setActionsHistory(actionsStack.toArray());


  }, []); // Solo ejecutar una vez al montar el componente

  // Funciones para productos (AVL Tree)
  const addProduct = (product: Product) => {
    productTree.insert(product);
    const newProducts = productTree.inOrder();
    setProducts(newProducts);
  };

  const updateProduct = (product: Product) => {
    productTree.insert(product); // AVL actualiza si ya existe
    const newProducts = productTree.inOrder();
    setProducts(newProducts);
  };

  const deleteProduct = (productId: number) => {
    const product = productTree.search({ id: productId } as Product);
    if (product) {
      productTree.delete(product);
      const newProducts = productTree.inOrder();
      setProducts(newProducts);
    }
  };

  const searchProduct = (productId: number): Product | null => {
    return productTree.search({ id: productId } as Product);
  };

  // Funciones para turnos (Linked Queue)
  const addTurn = (turn: Turn) => {
    turnQueue.enqueue(turn);
    const newTurns = turnQueue.toArray();
    setTurns(newTurns);
  };

  const serveTurn = (): Turn | null => {
    const served = turnQueue.dequeue();
    const newTurns = turnQueue.toArray();
    setTurns(newTurns);
    return served;
  };

  const peekNextTurn = (): Turn | null => {
    return turnQueue.peek();
  };

  const searchTurn = (predicate: (turn: Turn) => boolean): Turn | null => {
    return turnQueue.search(predicate);
  };

  // Funciones para ventas (Linked List)
  const addSale = (sale: Sale) => {
    salesHistory.prepend(sale); // Más recientes al inicio
    const newSales = salesHistory.toArray();
    setSales(newSales);
  };

  const removeSale = (saleId: number) => {
    const saleToRemove = sales.find(sale => sale.id === saleId);
    if (saleToRemove) {
      const removed = salesHistory.remove(saleToRemove);
      const newSales = salesHistory.toArray();
      setSales(newSales);
      return removed;
    }
    return false;
  };

  const searchSale = (predicate: (sale: Sale) => boolean): Sale | null => {
    return salesHistory.find(predicate);
  };

  const clearSalesHistory = () => {
    salesHistory.clear();
    setSales([]);
  };

  // Funciones para relaciones (Graph)
  const addRelation = (relation: Relation): Vertex<Relation> => {
    const vertex = relationGraph.addVertex(relation);
    setRelations(relationGraph.getVertices().map(v => v.data));
    return vertex;
  };

  const addRelationEdge = (fromId: string, toId: string, label?: string) => {
    const fromVertex = relationGraph.findVertex(r => r.id === fromId);
    const toVertex = relationGraph.findVertex(r => r.id === toId);
    
    if (fromVertex && toVertex) {
      relationGraph.addEdge(fromVertex, toVertex, 1, label);
    }
  };

  const removeRelation = (relationId: string) => {
    const vertex = relationGraph.findVertex(r => r.id === relationId);
    if (vertex) {
      relationGraph.removeVertex(vertex);
      setRelations(relationGraph.getVertices().map(v => v.data));
    }
  };

  const findPath = (fromId: string, toId: string): Relation[] | null => {
    const fromVertex = relationGraph.findVertex(r => r.id === fromId);
    const toVertex = relationGraph.findVertex(r => r.id === toId);
    
    if (fromVertex && toVertex) {
      const path = relationGraph.findPath(fromVertex, toVertex);
      return path ? path.map(v => v.data) : null;
    }
    return null;
  };

  // Funciones para acciones (Stack)
  const addAction = (action: Action) => {
    actionsStack.push(action);
    const newActions = actionsStack.toArray();
    setActionsHistory(newActions);
  };

  const undoLastAction = (): Action | null => {
    const lastAction = actionsStack.pop();
    const newActions = actionsStack.toArray();
    setActionsHistory(newActions);
    return lastAction;
  };

  const peekLastAction = (): Action | null => {
    return actionsStack.peek();
  };

  const clearActionsHistory = () => {
    actionsStack.clear();
    setActionsHistory([]);
  };

  const getActionsStats = () => {
    const actions = actionsStack.toArray();
    return {
      total: actions.length,
      manual: actions.filter(a => a.type === 'Manual').length,
      system: actions.filter(a => a.type === 'Sistema').length
    };
  };

  return {
    // Estados
    products,
    turns,
    sales,
    relations,
    actionsHistory,
    
    // Funciones para productos (AVL Tree)
    addProduct,
    updateProduct,
    deleteProduct,
    searchProduct,
    
    // Funciones para turnos (Queue)
    addTurn,
    serveTurn,
    peekNextTurn,
    searchTurn,
    
    // Funciones para ventas (LinkedList)
    addSale,
    removeSale,
    searchSale,
    clearSalesHistory,
    
    // Funciones para relaciones (Graph)
    addRelation,
    addRelationEdge,
    removeRelation,
    findPath,

    // Funciones para acciones (Stack)
    addAction,
    undoLastAction,
    peekLastAction,
    clearActionsHistory,
    getActionsStats,

    // Acceso directo a las estructuras para debugging
    structures: {
      productTree,
      turnQueue,
      salesHistory,
      relationGraph,
      actionsStack
    }
  };
};