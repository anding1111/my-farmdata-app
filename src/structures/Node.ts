// Nodo genérico para todas las estructuras de datos
export class Node<T> {
  public data: T;
  public next: Node<T> | null = null;
  public left: Node<T> | null = null;
  public right: Node<T> | null = null;
  public height: number = 1;

  constructor(data: T) {
    this.data = data;
  }
}