import { Node } from './Node';

// Arbol AVL - se mantiene balanceado automaticamente
// Factor de balance entre -1, 0, 1
export class AvlTree<T> {
  private root: Node<T> | null = null;  // nodo raiz del arbol
  private compareFunction: (a: T, b: T) => number;  // funcion para comparar

  constructor(compareFunction: (a: T, b: T) => number) {
    this.compareFunction = compareFunction;
  }

  // obtener altura del nodo
  private getHeight(node: Node<T> | null): number {
    return node ? node.height : 0;
  }

  // calcular factor de balance
  private getBalance(node: Node<T> | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  // actualizar altura del nodo
  private updateHeight(node: Node<T>): void {
    node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
  }

  // rotacion derecha
  private rotateRight(y: Node<T>): Node<T> {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    this.updateHeight(y);
    this.updateHeight(x);

    return x;
  }

  // rotacion izquierda
  private rotateLeft(x: Node<T>): Node<T> {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    this.updateHeight(x);
    this.updateHeight(y);

    return y;
  }

  // Insertar elemento
  insert(data: T): void {
    console.log('🌱 AVL TREE - Iniciando inserción de:', JSON.stringify(data));
    this.root = this.insertNode(this.root, data, 0);
    this.printStructure();
  }

  private insertNode(node: Node<T> | null, data: T, level: number): Node<T> {
    const indent = '  '.repeat(level);
    
    // 1. Inserción normal de BST
    if (!node) {
      console.log(`${indent}🌱 Creando nuevo nodo en nivel ${level}: ${JSON.stringify(data)}`);
      return new Node(data);
    }

    console.log(`${indent}🔍 Nivel ${level}: Comparando ${JSON.stringify(data)} con ${JSON.stringify(node.data)}`);
    
    const cmp = this.compareFunction(data, node.data);
    if (cmp < 0) {
      console.log(`${indent}⬅️ Insertando en hijo IZQUIERDO`);
      node.left = this.insertNode(node.left, data, level + 1);
    } else if (cmp > 0) {
      console.log(`${indent}➡️ Insertando en hijo DERECHO`);
      node.right = this.insertNode(node.right, data, level + 1);
    } else {
      // Actualizar datos si ya existe
      console.log(`${indent}🔄 Actualizando nodo existente en nivel ${level}`);
      node.data = data;
      return node;
    }

    // 2. Actualizar altura
    this.updateHeight(node);

    // 3. Obtener balance
    const balance = this.getBalance(node);
    console.log(`${indent}⚖️ Balance del nodo ${JSON.stringify(node.data)}: ${balance}`);

    // 4. Casos de rotación
    // Izquierda Izquierda
    if (balance > 1 && this.compareFunction(data, node.left!.data) < 0) {
      console.log(`${indent}🔄 Rotación DERECHA (caso II) en ${JSON.stringify(node.data)}`);
      return this.rotateRight(node);
    }

    // Derecha Derecha
    if (balance < -1 && this.compareFunction(data, node.right!.data) > 0) {
      console.log(`${indent}🔄 Rotación IZQUIERDA (caso DD) en ${JSON.stringify(node.data)}`);
      return this.rotateLeft(node);
    }

    // Izquierda Derecha
    if (balance > 1 && this.compareFunction(data, node.left!.data) > 0) {
      console.log(`${indent}🔄 Rotación IZQUIERDA-DERECHA (caso ID) en ${JSON.stringify(node.data)}`);
      node.left = this.rotateLeft(node.left!);
      return this.rotateRight(node);
    }

    // Derecha Izquierda
    if (balance < -1 && this.compareFunction(data, node.right!.data) < 0) {
      console.log(`${indent}🔄 Rotación DERECHA-IZQUIERDA (caso DI) en ${JSON.stringify(node.data)}`);
      node.right = this.rotateRight(node.right!);
      return this.rotateLeft(node);
    }

    return node;
  }

  // Buscar elemento
  search(data: T): T | null {
    console.log('🔍 AVL TREE - Iniciando búsqueda de:', JSON.stringify(data));
    const result = this.searchNode(this.root, data, 0);
    console.log('🔍 AVL Tree - Búsqueda:', data, result ? 'ENCONTRADO' : 'NO ENCONTRADO');
    return result;
  }

  private searchNode(node: Node<T> | null, data: T, level: number): T | null {
    const indent = '  '.repeat(level);
    
    if (!node) {
      console.log(`${indent}❌ Nodo null en nivel ${level} - fin de recorrido`);
      return null;
    }

    console.log(`${indent}🔍 Nivel ${level}: Comparando con nodo ${JSON.stringify(node.data)}`);
    
    const cmp = this.compareFunction(data, node.data);
    if (cmp === 0) {
      console.log(`${indent}✅ ¡ENCONTRADO en nivel ${level}! Pasos totales: ${level + 1}`);
      return node.data;
    }
    if (cmp < 0) {
      console.log(`${indent}⬅️ Buscando en hijo IZQUIERDO (${JSON.stringify(data)} < ${JSON.stringify(node.data)})`);
      return this.searchNode(node.left, data, level + 1);
    }
    console.log(`${indent}➡️ Buscando en hijo DERECHO (${JSON.stringify(data)} > ${JSON.stringify(node.data)})`);
    return this.searchNode(node.right, data, level + 1);
  }

  // Eliminar elemento
  delete(data: T): void {
    this.root = this.deleteNode(this.root, data);
    this.printStructure();
  }

  private deleteNode(node: Node<T> | null, data: T): Node<T> | null {
    if (!node) return null;

    const cmp = this.compareFunction(data, node.data);
    if (cmp < 0) {
      node.left = this.deleteNode(node.left, data);
    } else if (cmp > 0) {
      node.right = this.deleteNode(node.right, data);
    } else {
      // Nodo a eliminar encontrado
      if (!node.left || !node.right) {
        const temp = node.left || node.right;
        if (!temp) {
          return null;
        } else {
          return temp;
        }
      } else {
        // Nodo con dos hijos
        const temp = this.getMinValueNode(node.right);
        node.data = temp.data;
        node.right = this.deleteNode(node.right, temp.data);
      }
    }

    this.updateHeight(node);
    const balance = this.getBalance(node);

    // Rotaciones después de eliminación
    if (balance > 1 && this.getBalance(node.left) >= 0) {
      return this.rotateRight(node);
    }

    if (balance > 1 && this.getBalance(node.left) < 0) {
      node.left = this.rotateLeft(node.left!);
      return this.rotateRight(node);
    }

    if (balance < -1 && this.getBalance(node.right) <= 0) {
      return this.rotateLeft(node);
    }

    if (balance < -1 && this.getBalance(node.right) > 0) {
      node.right = this.rotateRight(node.right!);
      return this.rotateLeft(node);
    }

    return node;
  }

  private getMinValueNode(node: Node<T>): Node<T> {
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current;
  }

  // Recorrido en orden
  inOrder(): T[] {
    const result: T[] = [];
    this.inOrderTraversal(this.root, result);
    return result;
  }

  private inOrderTraversal(node: Node<T> | null, result: T[]): void {
    if (node) {
      this.inOrderTraversal(node.left, result);
      result.push(node.data);
      this.inOrderTraversal(node.right, result);
    }
  }

  // Imprimir estructura completa
  printStructure(): void {
    console.log('🌳 AVL TREE - Estructura completa:');
    console.log('Root:', this.root?.data);
    
    // Validacion de integridad
    const isValid = this.validateIntegrity();
    console.log('Integridad:', isValid ? '✅ VÁLIDA' : '❌ CORRUPTA');
    
    this.printTree(this.root, '', true);
    console.log('In-order traversal:', this.inOrder());
    console.log('Altura total:', this.getHeight(this.root));
  }

  private printTree(node: Node<T> | null, prefix: string, isLast: boolean): void {
    if (node) {
      const nodeId = `0x${(Math.abs(JSON.stringify(node.data).split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 65536).toString(16).padStart(4, '0')}`;
      const leftId = node.left ? `0x${(Math.abs(JSON.stringify(node.left.data).split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 65536).toString(16).padStart(4, '0')}` : 'null';
      const rightId = node.right ? `0x${(Math.abs(JSON.stringify(node.right.data).split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 65536).toString(16).padStart(4, '0')}` : 'null';
      
      console.log(prefix + (isLast ? '└── ' : '├── ') + `Nodo@${nodeId}: ${JSON.stringify(node.data)}`);
      console.log(prefix + (isLast ? '    ' : '│   ') + `├─ h:${node.height}, b:${this.getBalance(node)}`);
      console.log(prefix + (isLast ? '    ' : '│   ') + `├─ Left: ${leftId}`);
      console.log(prefix + (isLast ? '    ' : '│   ') + `└─ Right: ${rightId}`);
      
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      if (node.left || node.right) {
        if (node.right) {
          this.printTree(node.right, newPrefix, !node.left);
        }
        if (node.left) {
          this.printTree(node.left, newPrefix, true);
        }
      }
    }
  }

  // validar integridad del arbol
  private validateIntegrity(): boolean {
    return this.validateNode(this.root);
  }

  private validateNode(node: Node<T> | null): boolean {
    if (!node) return true;
    
    // verificar altura
    const leftHeight = this.getHeight(node.left);
    const rightHeight = this.getHeight(node.right);
    const expectedHeight = Math.max(leftHeight, rightHeight) + 1;
    
    if (node.height !== expectedHeight) return false;
    
    // verificar balance AVL
    const balance = this.getBalance(node);
    if (Math.abs(balance) > 1) return false;
    
    // verificar orden BST
    if (node.left && this.compareFunction(node.left.data, node.data) >= 0) return false;
    if (node.right && this.compareFunction(node.right.data, node.data) <= 0) return false;
    
    return this.validateNode(node.left) && this.validateNode(node.right);
  }
}