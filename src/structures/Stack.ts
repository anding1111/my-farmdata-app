import { Node } from './Node';

// Pila - LIFO (ultimo en entrar, primero en salir)
// Se usa para historial de acciones
export class Stack<T> {
  private top: Node<T> | null = null;  // cima de la pila
  private size: number = 0;             // numero de elementos

  // agregar elemento a la cima (push)
  push(data: T): void {
    const newNode = new Node(data);
    newNode.next = this.top;
    this.top = newNode;
    this.size++;
    this.printStructure();
  }

  // remover elemento de la cima (pop)
  pop(): T | null {
    if (this.top === null) {
      console.log('Stack vacia');
      return null;
    }
    
    const data = this.top.data;
    this.top = this.top.next;
    this.size--;
    this.printStructure();
    return data;
  }

  // ver elemento de la cima sin remover
  peek(): T | null {
    return this.top ? this.top.data : null;
  }

  // verificar si esta vacia
  isEmpty(): boolean {
    return this.top === null;
  }

  // obtener tamaño
  getSize(): number {
    return this.size;
  }

  // convertir a array
  toArray(): T[] {
    const result: T[] = [];
    let current = this.top;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  // buscar elemento
  search(predicate: (item: T) => boolean): T | null {
    let current = this.top;
    while (current) {
      if (predicate(current.data)) {
        console.log('🔍 Stack - Elemento encontrado:', current.data);
        return current.data;
      }
      current = current.next;
    }
    console.log('🔍 Stack - Elemento no encontrado');
    return null;
  }

  // limpiar pila
  clear(): void {
    this.top = null;
    this.size = 0;
    this.printStructure();
  }

  // imprimir estructura
  printStructure(): void {
    console.log('📚 STACK - Estructura completa:');
    console.log('Size:', this.size);
    console.log('Top:', this.top?.data || 'null');
    
    if (this.top) {
      let current = this.top;
      let index = 0;
      console.log('Nodos y punteros:');
      while (current) {
        const nextData = current.next ? JSON.stringify(current.next.data) : 'null';
        console.log(`  [${index}] Data: ${JSON.stringify(current.data)} -> Next: ${nextData}`);
        current = current.next;
        index++;
      }
    } else {
      console.log('Stack vacia');
    }
    
    console.log('Array representation:', this.toArray());
    console.log('---');
  }
}