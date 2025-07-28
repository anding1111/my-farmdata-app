import { Node } from './Node';

// Cola enlazada para turnos FIFO
export class LinkedQueue<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;
  private size: number = 0;

  // Agregar elemento al final de la cola (encolar)
  enqueue(data: T): void {
    const newNode = new Node(data);
    if (this.tail === null) {
      this.head = this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.size++;
    this.printStructure();
  }

  // Remover elemento del frente de la cola (desencolar)
  dequeue(): T | null {
    if (this.head === null) {
      console.log('⚠️ Queue vacía - no se puede desencolar');
      return null;
    }
    
    const data = this.head.data;
    this.head = this.head.next;
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