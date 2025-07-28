import { useState, useEffect } from 'react';
import { AvlTree } from '@/structures/AvlTree';
import { LinkedQueue } from '@/structures/LinkedQueue';
import { LinkedList } from '@/structures/LinkedList';
import { Graph, Vertex } from '@/structures/Graph';

// Tipos para las estructuras
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
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
  productId: number;
  productName: string;
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

// Hook principal para manejar todas las estructuras de datos
export const useDataStructures = () => {
  // Inicializar estructuras
  const [productTree] = useState(() => new AvlTree<Product>((a, b) => a.id - b.id));
  const [turnQueue] = useState(() => new LinkedQueue<Turn>());
  const [salesHistory] = useState(() => new LinkedList<Sale>());
  const [relationGraph] = useState(() => new Graph<Relation>());

  // Estados para las UI
  const [products, setProducts] = useState<Product[]>([]);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [relations, setRelations] = useState<Relation[]>([]);

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

  }, [productTree, turnQueue, salesHistory, relationGraph]);

  // Funciones para productos (AVL Tree)
  const addProduct = (product: Product) => {
    productTree.insert(product);
    setProducts(productTree.inOrder());
  };

  const updateProduct = (product: Product) => {
    productTree.insert(product); // AVL actualiza si ya existe
    setProducts(productTree.inOrder());
  };

  const deleteProduct = (productId: number) => {
    const product = productTree.search({ id: productId } as Product);
    if (product) {
      productTree.delete(product);
      setProducts(productTree.inOrder());
    }
  };

  const searchProduct = (productId: number): Product | null => {
    return productTree.search({ id: productId } as Product);
  };

  // Funciones para turnos (Linked Queue)
  const addTurn = (turn: Turn) => {
    turnQueue.enqueue(turn);
    setTurns(turnQueue.toArray());
  };

  const serveTurn = (): Turn | null => {
    const served = turnQueue.dequeue();
    setTurns(turnQueue.toArray());
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
    setSales(salesHistory.toArray());
  };

  const removeSale = (saleId: number) => {
    const removed = salesHistory.remove({ id: saleId } as Sale);
    if (removed) {
      setSales(salesHistory.toArray());
    }
    return removed;
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

  return {
    // Estados
    products,
    turns,
    sales,
    relations,
    
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

    // Acceso directo a las estructuras para debugging
    structures: {
      productTree,
      turnQueue,
      salesHistory,
      relationGraph
    }
  };
};