import { Node } from './Node';

// Pila - LIFO (ultimo en entrar, primero en salir)
// Se usa para historial de acciones
export class Stack<T> {
  private top: Node<T> | null = null;  // cima de la pila
  private size: number = 0;             // numero de elementos

  // agregar elemento a la cima (push)
  push(data: T): void {
    console.log('➕ STACK - Insertando en TOP:', JSON.stringify(data));
    const newNode = new Node(data);
    
    if (this.top === null) {
      console.log('  📍 Stack vacía - nuevo nodo será TOP');
    } else {
      console.log(`  🔗 Conectando nuevo nodo con TOP actual: ${JSON.stringify(this.top.data)}`);
    }
    
    newNode.next = this.top;
    this.top = newNode;
    this.size++;
    
    console.log(`  ✅ Inserción en TOP completada en 1 paso. Tamaño: ${this.size}`);
    this.printStructure();
  }

  // remover elemento de la cima (pop)
  pop(): T | null {
    console.log('➖ STACK - Removiendo desde TOP...');
    
    if (this.top === null) {
      console.log('  ❌ Stack vacía - no hay nada que remover');
      console.log('Stack vacia');
      return null;
    }
    
    const data = this.top.data;
    console.log(`  🎯 Acceso directo al TOP: ${JSON.stringify(data)}`);
    console.log(`  🔗 Actualizando TOP al siguiente nodo: ${this.top.next ? JSON.stringify(this.top.next.data) : 'null'}`);
    
    this.top = this.top.next;
    this.size--;
    
    console.log(`  ✅ Remoción completada en 1 paso. Tamaño: ${this.size}`);
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
    console.log('🔍 STACK - Iniciando búsqueda secuencial desde TOP...');
    let current = this.top;
    let index = 0;
    
    while (current) {
      console.log(`  🔍 Paso ${index + 1}: Revisando nodo con data: ${JSON.stringify(current.data)}`);
      
      if (predicate(current.data)) {
        console.log(`  ✅ ¡ENCONTRADO en posición ${index} desde TOP! Pasos totales: ${index + 1}`);
        console.log('🔍 Stack - Elemento encontrado:', current.data);
        return current.data;
      }
      
      console.log(`  ⬇️ No coincide, bajando al siguiente nodo...`);
      current = current.next;
      index++;
    }
    
    console.log(`  ❌ Búsqueda completada. Recorridos ${index} nodos sin éxito.`);
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
    
    // Validacion de integridad
    const isValid = this.validateIntegrity();
    console.log('Integridad:', isValid ? '✅ VÁLIDA' : '❌ CORRUPTA');
    
    if (this.top) {
      let current = this.top;
      let index = 0;
      console.log('Nodos y punteros detallados:');
      while (current) {
        const nodeId = `0x${(Math.abs(JSON.stringify(current.data).split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 65536).toString(16).padStart(4, '0')}`;
        const nextData = current.next ? JSON.stringify(current.next.data) : 'null';
        const nextId = current.next ? `0x${(Math.abs(JSON.stringify(current.next.data).split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 65536).toString(16).padStart(4, '0')}` : 'null';
        const isTop = current === this.top ? ' [TOP]' : '';
        
        console.log(`  [${index}] Nodo@${nodeId}${isTop}:`);
        console.log(`       Data: ${JSON.stringify(current.data)}`);
        console.log(`       Next: ${nextData} -> ${nextId}`);
        console.log(`       Conexion: ${current.next ? '🔗 CONECTADO' : '🔒 FINAL'}`);
        
        current = current.next;
        index++;
      }
    } else {
      console.log('Stack vacia');
    }
    
    console.log('Array representation:', this.toArray());
    console.log('---');
  }

  // validar integridad de punteros
  private validateIntegrity(): boolean {
    if (this.isEmpty()) return true;
    
    if (!this.top) return false;
    
    let current = this.top;
    let count = 0;
    
    while (current) {
      current = current.next;
      count++;
      
      if (count > this.size) return false; // ciclo infinito
    }
    
    return count === this.size;
  }
}