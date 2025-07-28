import { Node } from './Node';

// Cola enlazada - FIFO (primero en entrar, primero en salir)
// Se usa para turnos de atencion
export class LinkedQueue<T> {
  private head: Node<T> | null = null;  // frente de la cola
  private tail: Node<T> | null = null;  // final de la cola
  private size: number = 0;             // numero de elementos

  // agregar al final (enqueue)
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

  // remover del frente (dequeue)
  dequeue(): T | null {
    if (this.head === null) {
      console.log('Queue vacía');
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

  // ver el primero sin remover
  peek(): T | null {
    return this.head ? this.head.data : null;
  }

  // verificar si esta vacia
  isEmpty(): boolean {
    return this.head === null;
  }

  // obtener tamaño
  getSize(): number {
    return this.size;
  }

  // convertir a array
  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  // buscar elemento
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

  // imprimir estructura
  printStructure(): void {
    console.log('📋 LINKED QUEUE - Estructura completa:');
    console.log('Size:', this.size);
    console.log('Head:', this.head?.data || 'null');
    console.log('Tail:', this.tail?.data || 'null');
    
    // Validacion de integridad
    const isValid = this.validateIntegrity();
    console.log('Integridad:', isValid ? '✅ VÁLIDA' : '❌ CORRUPTA');
    
    if (this.head) {
      let current = this.head;
      let index = 0;
      console.log('Nodos y punteros detallados:');
      while (current) {
        const nodeId = `0x${(Math.abs(JSON.stringify(current.data).split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 65536).toString(16).padStart(4, '0')}`;
        const nextData = current.next ? JSON.stringify(current.next.data) : 'null';
        const nextId = current.next ? `0x${(Math.abs(JSON.stringify(current.next.data).split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 65536).toString(16).padStart(4, '0')}` : 'null';
        const isHead = current === this.head ? ' [HEAD]' : '';
        const isTail = current === this.tail ? ' [TAIL]' : '';
        
        console.log(`  [${index}] Nodo@${nodeId}${isHead}${isTail}:`);
        console.log(`       Data: ${JSON.stringify(current.data)}`);
        console.log(`       Next: ${nextData} -> ${nextId}`);
        console.log(`       Conexion: ${current.next ? '🔗 CONECTADO' : '🔒 FINAL'}`);
        
        current = current.next;
        index++;
      }
    } else {
      console.log('Queue vacía');
    }
    
    console.log('Array representation:', this.toArray());
    console.log('---');
  }

  // validar integridad de punteros
  private validateIntegrity(): boolean {
    if (this.isEmpty()) return true;
    
    if (!this.head || !this.tail) return false;
    
    // verificar que head y tail sean correctos
    let current = this.head;
    let count = 0;
    let lastNode = null;
    
    while (current) {
      lastNode = current;
      current = current.next;
      count++;
      
      if (count > this.size) return false; // ciclo infinito
    }
    
    return lastNode === this.tail && count === this.size;
  }
}