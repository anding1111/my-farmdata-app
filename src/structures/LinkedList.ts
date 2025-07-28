import { Node } from './Node';

// Lista enlazada - cada nodo apunta al siguiente
// Se usa para historial de ventas
export class LinkedList<T> {
  private head: Node<T> | null = null;  // primer nodo
  private size: number = 0;             // contador de elementos

  // agregar al final
  append(data: T): void {
    console.log('➕ LINKED LIST - Insertando al final:', JSON.stringify(data));
    const newNode = new Node(data);
    
    if (this.head === null) {
      console.log('  📍 Lista vacía - nuevo nodo será HEAD');
      this.head = newNode;
    } else {
      console.log('  🔍 Recorriendo hasta el final...');
      // recorrer hasta el final
      let current = this.head;
      let index = 0;
      
      while (current.next !== null) {
        console.log(`    Paso ${index + 1}: Visitando nodo ${JSON.stringify(current.data)}`);
        current = current.next;
        index++;
      }
      
      console.log(`    ✅ Llegamos al final en ${index + 1} pasos. Último nodo: ${JSON.stringify(current.data)}`);
      // conectar al final
      current.next = newNode;
      console.log('    🔗 Nuevo nodo conectado al final');
    }
    this.size++;
    console.log(`📊 Tamaño actual: ${this.size}`);
    this.printStructure();
  }

  // agregar al inicio
  prepend(data: T): void {
    const newNode = new Node(data);
    newNode.next = this.head;
    this.head = newNode;
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
    console.log('🔍 LINKED LIST - Iniciando búsqueda secuencial desde HEAD...');
    let current = this.head;
    let index = 0;
    
    while (current !== null) {
      console.log(`  🔍 Paso ${index + 1}: Revisando nodo con data: ${JSON.stringify(current.data)}`);
      
      if (predicate(current.data)) {
        console.log(`  ✅ ¡ENCONTRADO en posición ${index}! Pasos totales: ${index + 1}`);
        console.log('🔍 LinkedList - Elemento encontrado:', current.data);
        return current.data;
      }
      
      console.log(`  ➡️ No coincide, avanzando al siguiente nodo...`);
      current = current.next;
      index++;
    }
    
    console.log(`  ❌ Búsqueda completada. Recorridos ${index} nodos sin éxito.`);
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
        
        console.log(`  [${index}] Nodo@${nodeId}${isHead}:`);
        console.log(`       Data: ${JSON.stringify(current.data)}`);
        console.log(`       Next: ${nextData} -> ${nextId}`);
        console.log(`       Conexion: ${current.next ? '🔗 CONECTADO' : '🔒 FINAL'}`);
        
        current = current.next;
        index++;
      }
    } else {
      console.log('Lista vacía');
    }
    
    console.log('Array representation:', this.toArray());
    console.log('---');
  }

  // validar integridad de punteros
  private validateIntegrity(): boolean {
    if (this.isEmpty()) return true;
    
    if (!this.head) return false;
    
    let current = this.head;
    let count = 0;
    
    while (current) {
      current = current.next;
      count++;
      
      if (count > this.size) return false; // ciclo infinito
    }
    
    return count === this.size;
  }
}