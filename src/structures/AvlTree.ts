import { Node } from './Node';

/**
 * 🌳 ÁRBOL AVL (Auto-balanceado)
 * 
 * ¿Qué es un AVL Tree?
 * - Es un árbol binario de búsqueda que se mantiene automáticamente balanceado
 * - Nombrado por Adelson-Velsky y Landis (sus inventores en 1962)
 * - Garantiza que la diferencia de altura entre subárboles izquierdo y derecho sea máximo 1
 * 
 * ¿Por qué es importante el balance?
 * - Un árbol balanceado garantiza búsquedas, inserciones y eliminaciones en O(log n)
 * - Sin balance, el árbol puede degenerar a una lista (O(n) en el peor caso)
 * 
 * Conceptos clave:
 * - Factor de Balance (FB) = altura_izquierda - altura_derecha
 * - FB debe estar entre -1, 0, 1 para mantener el balance
 * - Rotaciones: simples (LL, RR) y dobles (LR, RL) para rebalancear
 */
export class AvlTree<T> {
  private root: Node<T> | null = null;  // 🌳 Raíz del árbol (punto de entrada)
  private compareFunction: (a: T, b: T) => number;  // 🔍 Función para comparar elementos

  constructor(compareFunction: (a: T, b: T) => number) {
    this.compareFunction = compareFunction;
  }

  // 📏 Obtener altura del nodo
  // La altura es el número máximo de niveles desde este nodo hasta una hoja
  private getHeight(node: Node<T> | null): number {
    return node ? node.height : 0;
  }

  // ⚖️ Calcular factor de balance
  // FB = altura_izquierda - altura_derecha
  // Si FB > 1: subárbol izquierdo muy pesado
  // Si FB < -1: subárbol derecho muy pesado
  private getBalance(node: Node<T> | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  // 🔄 Actualizar altura del nodo
  // La altura de un nodo = 1 + máximo(altura_izquierda, altura_derecha)
  private updateHeight(node: Node<T>): void {
    node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
  }

  // 🔄 Rotación derecha (caso LL - Left Left)
  // Cuando el subárbol izquierdo está desbalanceado hacia la izquierda
  //     y              x
  //    / \    →       / \
  //   x   C          A   y
  //  / \                / \
  // A   B              B   C
  private rotateRight(y: Node<T>): Node<T> {
    const x = y.left!;  // x se convierte en la nueva raíz
    const T2 = x.right; // Subárbol que va a cambiar de padre

    x.right = y;
    y.left = T2;

    this.updateHeight(y);
    this.updateHeight(x);

    return x;
  }

  // Rotación izquierda
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
    this.root = this.insertNode(this.root, data);
    this.printStructure();
  }

  private insertNode(node: Node<T> | null, data: T): Node<T> {
    // 1. Inserción normal de BST
    if (!node) return new Node(data);

    const cmp = this.compareFunction(data, node.data);
    if (cmp < 0) {
      node.left = this.insertNode(node.left, data);
    } else if (cmp > 0) {
      node.right = this.insertNode(node.right, data);
    } else {
      // Actualizar datos si ya existe
      node.data = data;
      return node;
    }

    // 2. Actualizar altura
    this.updateHeight(node);

    // 3. Obtener balance
    const balance = this.getBalance(node);

    // 4. Casos de rotación
    // Izquierda Izquierda
    if (balance > 1 && this.compareFunction(data, node.left!.data) < 0) {
      return this.rotateRight(node);
    }

    // Derecha Derecha
    if (balance < -1 && this.compareFunction(data, node.right!.data) > 0) {
      return this.rotateLeft(node);
    }

    // Izquierda Derecha
    if (balance > 1 && this.compareFunction(data, node.left!.data) > 0) {
      node.left = this.rotateLeft(node.left!);
      return this.rotateRight(node);
    }

    // Derecha Izquierda
    if (balance < -1 && this.compareFunction(data, node.right!.data) < 0) {
      node.right = this.rotateRight(node.right!);
      return this.rotateLeft(node);
    }

    return node;
  }

  // Buscar elemento
  search(data: T): T | null {
    const result = this.searchNode(this.root, data);
    console.log('🔍 AVL Tree - Búsqueda:', data, result ? 'ENCONTRADO' : 'NO ENCONTRADO');
    return result;
  }

  private searchNode(node: Node<T> | null, data: T): T | null {
    if (!node) return null;

    const cmp = this.compareFunction(data, node.data);
    if (cmp === 0) return node.data;
    if (cmp < 0) return this.searchNode(node.left, data);
    return this.searchNode(node.right, data);
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
    this.printTree(this.root, '', true);
    console.log('In-order traversal:', this.inOrder());
    console.log('Altura total:', this.getHeight(this.root));
  }

  private printTree(node: Node<T> | null, prefix: string, isLast: boolean): void {
    if (node) {
      console.log(prefix + (isLast ? '└── ' : '├── ') + JSON.stringify(node.data) + ` (h:${node.height}, b:${this.getBalance(node)})`);
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
}