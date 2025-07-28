import { Node } from './Node';

/**
 * 🔗 LISTA ENLAZADA (LinkedList)
 * 
 * ¿Qué es una Lista Enlazada?
 * - Es una estructura de datos lineal donde cada elemento (nodo) contiene:
 *   • Datos del elemento
 *   • Un puntero/referencia al siguiente nodo
 * 
 * Ventajas:
 * - Tamaño dinámico (crece/decrece según necesidad)
 * - Inserción/eliminación eficiente al inicio O(1)
 * - No requiere memoria contigua
 * 
 * Desventajas:
 * - No permite acceso aleatorio (no puedes ir directamente al elemento N)
 * - Requiere memoria extra para los punteros
 * - Búsqueda secuencial O(n)
 * 
 * Uso en este proyecto: Historial de ventas (LIFO - más recientes primero)
 */
export class LinkedList<T> {
  private head: Node<T> | null = null;  // 🎯 Primer nodo de la lista
  private size: number = 0;             // 📊 Contador de elementos

  // ➕ Agregar al final de la lista
  // Complejidad: O(n) porque debe recorrer hasta el final
  append(data: T): void {
    const newNode = new Node(data);
    if (this.head === null) {
      // 📋 Lista vacía: el nuevo nodo se convierte en head
      this.head = newNode;
    } else {
      // 🔍 Recorrer hasta encontrar el último nodo
      let current = this.head;
      while (current.next !== null) {
        current = current.next;
      }
      // 🔗 Conectar el último nodo con el nuevo
      current.next = newNode;
    }
    this.size++;
    this.printStructure();
  }

  // ⬅️ Agregar al inicio de la lista (prepend)
  // Complejidad: O(1) - muy eficiente!
  // Este método se usa para el historial de ventas (más recientes primero)
  prepend(data: T): void {
    const newNode = new Node(data);  // 🆕 Crear nuevo nodo
    newNode.next = this.head;        // 🔗 El nuevo nodo apunta al head actual
    this.head = newNode;             // 🎯 El nuevo nodo se convierte en head
    this.size++;
    this.printStructure();
  }

  // Insertar en posición específica
  insertAt(index: number, data: T): boolean {
    if (index < 0 || index > this.size) {
      console.log('⚠️ Índice fuera de rango');
      return false;
    }

    if (index === 0) {
      this.prepend(data);
      return true;
    }

    const newNode = new Node(data);
    let current = this.head;
    for (let i = 0; i < index - 1; i++) {
      current = current!.next;
    }

    newNode.next = current!.next;
    current!.next = newNode;
    this.size++;
    this.printStructure();
    return true;
  }

  // Remover por valor
  remove(data: T): boolean {
    if (this.head === null) return false;

    if (JSON.stringify(this.head.data) === JSON.stringify(data)) {
      this.head = this.head.next;
      this.size--;
      this.printStructure();
      return true;
    }

    let current = this.head;
    while (current.next !== null) {
      if (JSON.stringify(current.next.data) === JSON.stringify(data)) {
        current.next = current.next.next;
        this.size--;
        this.printStructure();
        return true;
      }
      current = current.next;
    }
    return false;
  }

  // Remover por índice
  removeAt(index: number): T | null {
    if (index < 0 || index >= this.size) {
      console.log('⚠️ Índice fuera de rango');
      return null;
    }

    if (index === 0) {
      const data = this.head!.data;
      this.head = this.head!.next;
      this.size--;
      this.printStructure();
      return data;
    }

    let current = this.head;
    for (let i = 0; i < index - 1; i++) {
      current = current!.next;
    }

    const data = current!.next!.data;
    current!.next = current!.next!.next;
    this.size--;
    this.printStructure();
    return data;
  }

  // Buscar elemento
  find(predicate: (item: T) => boolean): T | null {
    let current = this.head;
    while (current !== null) {
      if (predicate(current.data)) {
        console.log('🔍 LinkedList - Elemento encontrado:', current.data);
        return current.data;
      }
      current = current.next;
    }
    console.log('🔍 LinkedList - Elemento no encontrado');
    return null;
  }

  // Obtener elemento por índice
  get(index: number): T | null {
    if (index < 0 || index >= this.size) return null;

    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }
    return current!.data;
  }

  // Verificar si está vacía
  isEmpty(): boolean {
    return this.head === null;
  }

  // Obtener tamaño
  getSize(): number {
    return this.size;
  }

  // Convertir a array
  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  // Limpiar lista
  clear(): void {
    this.head = null;
    this.size = 0;
    this.printStructure();
  }

  // Imprimir estructura completa
  printStructure(): void {
    console.log('📝 LINKED LIST - Estructura completa:');
    console.log('Size:', this.size);
    console.log('Head:', this.head?.data || 'null');
    
    if (this.head) {
      let current = this.head;
      let index = 0;
      console.log('Nodos y punteros:');
      while (current) {
        const nextData = current.next ? JSON.stringify(current.next.data) : 'null';
        console.log(`  [${index}] Data: ${JSON.stringify(current.data)} -> Next: ${nextData}`);
        current = current.next;
        index++;
      }
    } else {
      console.log('Lista vacía');
    }
    
    console.log('Array representation:', this.toArray());
    console.log('---');
  }
}