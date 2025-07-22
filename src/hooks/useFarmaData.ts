import { useState, useCallback, useMemo } from 'react';
import { Product, ProductList, CreateListData, ViewMode, SortOption } from '@/types/product';
import { mockProducts, mockProductLists, calculateListTotal } from '@/data/mockData';
import { useLocalStorage } from './useLocalStorage';

export function useFarmaData() {
  // Estados principales
  const [products] = useLocalStorage<Product[]>('farma-products', mockProducts);
  const [productLists, setProductLists] = useLocalStorage<ProductList[]>('farma-lists', mockProductLists);
  const [selectedListId, setSelectedListId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  // Funciones para gestión de listas
  const createList = useCallback((data: CreateListData) => {
    const newList: ProductList = {
      id: Date.now(),
      name: data.name,
      description: data.description,
      total: 0,
      products: [],
      moreCount: 0,
      color: data.color,
      icon: data.icon,
      createdAt: new Date().toISOString(),
    };
    
    setProductLists(prev => [...prev, newList]);
    setSelectedListId(newList.id);
  }, [setProductLists]);

  const updateList = useCallback((listId: number, updates: Partial<ProductList>) => {
    setProductLists(prev => 
      prev.map(list => 
        list.id === listId 
          ? { ...list, ...updates, updatedAt: new Date().toISOString() }
          : list
      )
    );
  }, [setProductLists]);

  const deleteList = useCallback((listId: number) => {
    setProductLists(prev => prev.filter(list => list.id !== listId));
    if (selectedListId === listId) {
      const remainingLists = productLists.filter(list => list.id !== listId);
      setSelectedListId(remainingLists.length > 0 ? remainingLists[0].id : 0);
    }
  }, [setProductLists, selectedListId, productLists]);

  const duplicateList = useCallback((listId: number) => {
    const listToDuplicate = productLists.find(list => list.id === listId);
    if (!listToDuplicate) return;

    const duplicatedList: ProductList = {
      ...listToDuplicate,
      id: Date.now(),
      name: `${listToDuplicate.name} (Copia)`,
      createdAt: new Date().toISOString(),
    };

    setProductLists(prev => [...prev, duplicatedList]);
  }, [productLists, setProductLists]);

  // Funciones para gestión de productos en listas
  const addProductToList = useCallback((listId: number, product: Product, quantity: number = 1) => {
    setProductLists(prev => 
      prev.map(list => {
        if (list.id !== listId) return list;
        
        const existingProductIndex = list.products.findIndex(p => p.productId === product.id);
        let updatedProducts;
        
        if (existingProductIndex >= 0) {
          // Si el producto ya existe, aumentar cantidad
          updatedProducts = list.products.map((p, index) => 
            index === existingProductIndex 
              ? { ...p, quantity: p.quantity + quantity }
              : p
          );
        } else {
          // Si es nuevo, agregarlo
          updatedProducts = [...list.products, {
            productId: product.id,
            quantity,
            image: product.image,
            name: product.name,
            price: product.price,
          }];
        }
        
        return {
          ...list,
          products: updatedProducts,
          total: calculateListTotal(updatedProducts),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, [setProductLists]);

  const removeProductFromList = useCallback((listId: number, productId: number) => {
    setProductLists(prev => 
      prev.map(list => {
        if (list.id !== listId) return list;
        
        const updatedProducts = list.products.filter(p => p.productId !== productId);
        
        return {
          ...list,
          products: updatedProducts,
          total: calculateListTotal(updatedProducts),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, [setProductLists]);

  const updateProductQuantity = useCallback((listId: number, productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeProductFromList(listId, productId);
      return;
    }
    
    setProductLists(prev => 
      prev.map(list => {
        if (list.id !== listId) return list;
        
        const updatedProducts = list.products.map(p => 
          p.productId === productId 
            ? { ...p, quantity: newQuantity }
            : p
        );
        
        return {
          ...list,
          products: updatedProducts,
          total: calculateListTotal(updatedProducts),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, [setProductLists, removeProductFromList]);

  // Datos computados
  const selectedList = useMemo(() => 
    productLists.find(list => list.id === selectedListId) || productLists[0]
  , [productLists, selectedListId]);

  const filteredLists = useMemo(() => 
    productLists.filter(list => 
      list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  , [productLists, searchQuery]);

  const selectedListProducts = useMemo(() => {
    if (!selectedList) return [];
    
    // Obtener productos completos de la lista seleccionada
    return selectedList.products.map(item => {
      const fullProduct = products.find(p => p.id === item.productId);
      return {
        ...item,
        product: fullProduct,
      };
    });
  }, [selectedList, products]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return selectedListProducts;
    
    return selectedListProducts.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product?.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product?.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedListProducts, searchQuery]);

  const sortedProducts = useMemo(() => {
    const productsToSort = [...filteredProducts];
    
    switch (sortBy) {
      case 'name':
        return productsToSort.sort((a, b) => a.name.localeCompare(b.name));
      case 'price':
        return productsToSort.sort((a, b) => a.price - b.price);
      case 'category':
        return productsToSort.sort((a, b) => 
          (a.product?.category || '').localeCompare(b.product?.category || '')
        );
      case 'date':
        return productsToSort.sort((a, b) => 
          new Date(b.product?.createdAt || 0).getTime() - new Date(a.product?.createdAt || 0).getTime()
        );
      default:
        return productsToSort;
    }
  }, [filteredProducts, sortBy]);

  // Estadísticas
  const stats = useMemo(() => ({
    totalLists: productLists.length,
    totalProducts: products.length,
    totalValue: productLists.reduce((sum, list) => sum + list.total, 0),
    averageListValue: productLists.length > 0 
      ? productLists.reduce((sum, list) => sum + list.total, 0) / productLists.length 
      : 0,
  }), [productLists, products]);

  return {
    // Estados
    products,
    productLists: filteredLists,
    selectedList,
    selectedListId,
    searchQuery,
    viewMode,
    sortBy,
    
    // Productos filtrados y ordenados
    selectedListProducts: sortedProducts,
    
    // Funciones de estado
    setSelectedListId,
    setSearchQuery,
    setViewMode,
    setSortBy,
    
    // Funciones de listas
    createList,
    updateList,
    deleteList,
    duplicateList,
    
    // Funciones de productos
    addProductToList,
    removeProductFromList,
    updateProductQuantity,
    
    // Estadísticas
    stats,
  };
}