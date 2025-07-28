import { Node } from './Node';

/**
 * 📋 COLA ENLAZADA (LinkedQueue) - FIFO
 * 
 * ¿Qué es una Cola?
 * - Estructura de datos que sigue el principio FIFO (First In, First Out)
 * - Como una fila en el banco: el primero en llegar es el primero en ser atendido
 * 
 * Operaciones principales:
 * - enqueue(): Agregar elemento al final de la cola
 * - dequeue(): Remover elemento del frente de la cola
 * - peek(): Ver el elemento del frente sin removerlo
 * 
 * Implementación con Lista Enlazada:
 * - head: apunta al frente de la cola (donde se remueven elementos)
 * - tail: apunta al final de la cola (donde se agregan elementos)
 * 
 * Uso en este proyecto: Sistema de turnos de atención al cliente
 */
export class LinkedQueue<T> {
  private head: Node<T> | null = null;  // 🎯 Frente de la cola (primero en salir)
  private tail: Node<T> | null = null;  // 🔚 Final de la cola (último en entrar)
  private size: number = 0;             // 📊 Número de elementos en la cola

  // ➕ Agregar elemento al final de la cola (encolar/enqueue)
  // Complejidad: O(1) - muy eficiente gracias al puntero tail
  enqueue(data: T): void {
    const newNode = new Node(data);
    if (this.tail === null) {
      // 📋 Cola vacía: head y tail apuntan al mismo nodo
      this.head = this.tail = newNode;
    } else {
      // 🔗 Conectar el nuevo nodo al final y actualizar tail
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.size++;
    this.printStructure();
  }

  // ➖ Remover elemento del frente de la cola (desencolar/dequeue)
  // Complejidad: O(1) - muy eficiente
  // Principio FIFO: el primer elemento en entrar es el primero en salir
  dequeue(): T | null {
    if (this.head === null) {
      console.log('⚠️ Queue vacía - no se puede desencolar');
      return null;
    }
    
    const data = this.head.data;  // 📦 Guardar los datos del nodo a remover
    this.head = this.head.next;   // 🎯 Mover head al siguiente nodo
    if (this.head === null) {
      this.tail = null;
    }
    this.size--;
    this.printStructure();
    return data;
  }

  // Ver el primer elemento sin removerlo
  peek(): T | null {
    return this.head ? this.head.data : null;
  }

  // Verificar si está vacía
  isEmpty(): boolean {
    return this.head === null;
  }

  // Obtener tamaño
  getSize(): number {
    return this.size;
  }

  // Convertir a array para visualización
  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  // Buscar elemento
  search(predicate: (item: T) => boolean): T | null {
    let current = this.head;
    while (current) {
      if (predicate(current.data)) {
        console.log('🔍 Queue - Elemento encontrado:', current.data);
        return current.data;
      }
      current = current.next;
    }
    console.log('🔍 Queue - Elemento no encontrado');
    return null;
  }

  // Imprimir estructura completa
  printStructure(): void {
    console.log('📋 LINKED QUEUE - Estructura completa:');
    console.log('Size:', this.size);
    console.log('Head:', this.head?.data || 'null');
    console.log('Tail:', this.tail?.data || 'null');
    
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
      console.log('Queue vacía');
    }
    
    console.log('Array representation:', this.toArray());
    console.log('---');
  }
}