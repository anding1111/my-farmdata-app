// Grafo - vertices conectados por aristas
// Se usa para relaciones entre productos

// Vertice del grafo
export class Vertex<T> {
  public data: T;                    // datos del vertice
  public edges: Edge<T>[] = [];      // aristas que salen

  constructor(data: T) {
    this.data = data;
  }

  addEdge(edge: Edge<T>): void {
    this.edges.push(edge);
  }

  removeEdge(to: Vertex<T>): boolean {
    const index = this.edges.findIndex(edge => edge.to === to);
    if (index !== -1) {
      this.edges.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Arista del grafo
export class Edge<T> {
  public from: Vertex<T>;       // vertice origen
  public to: Vertex<T>;         // vertice destino
  public weight: number;        // peso de la relacion
  public label?: string;        // etiqueta

  constructor(from: Vertex<T>, to: Vertex<T>, weight: number = 1, label?: string) {
    this.from = from;
    this.to = to;
    this.weight = weight;
    this.label = label;
  }
}

// Clase principal del grafo
export class Graph<T> {
  private vertices: Vertex<T>[] = [];

  // agregar vertice
  addVertex(data: T): Vertex<T> {
    const vertex = new Vertex(data);
    this.vertices.push(vertex);
    this.printStructure();
    return vertex;
  }

  // remover vertice
  removeVertex(vertex: Vertex<T>): boolean {
    const index = this.vertices.indexOf(vertex);
    if (index === -1) return false;

    // remover aristas que apuntan a este vertice
    this.vertices.forEach(v => {
      v.removeEdge(vertex);
    });

    // remover el vertice
    this.vertices.splice(index, 1);
    this.printStructure();
    return true;
  }

  // agregar arista
  addEdge(from: Vertex<T>, to: Vertex<T>, weight: number = 1, label?: string): Edge<T> {
    const edge = new Edge(from, to, weight, label);
    from.addEdge(edge);
    this.printStructure();
    return edge;
  }

  // remover arista
  removeEdge(from: Vertex<T>, to: Vertex<T>): boolean {
    const result = from.removeEdge(to);
    if (result) {
      this.printStructure();
    }
    return result;
  }

  // buscar vertice
  findVertex(predicate: (data: T) => boolean): Vertex<T> | null {
    const result = this.vertices.find(vertex => predicate(vertex.data)) || null;
    console.log('🔍 Graph - Búsqueda de vértice:', result ? 'ENCONTRADO' : 'NO ENCONTRADO');
    return result;
  }

  // obtener todos los vertices
  getVertices(): Vertex<T>[] {
    return [...this.vertices];
  }

  // obtener vertices adyacentes
  getAdjacent(vertex: Vertex<T>): Vertex<T>[] {
    return vertex.edges.map(edge => edge.to);
  }

  // buscar camino entre vertices
  findPath(start: Vertex<T>, end: Vertex<T>): Vertex<T>[] | null {
    if (start === end) return [start];

    const visited = new Set<Vertex<T>>();
    const queue: { vertex: Vertex<T>, path: Vertex<T>[] }[] = [{ vertex: start, path: [start] }];
    visited.add(start);

    while (queue.length > 0) {
      const { vertex, path } = queue.shift()!;

      for (const edge of vertex.edges) {
        if (edge.to === end) {
          const finalPath = [...path, edge.to];
          console.log('🔍 Graph - Camino encontrado:', finalPath.map(v => v.data));
          return finalPath;
        }

        if (!visited.has(edge.to)) {
          visited.add(edge.to);
          queue.push({ vertex: edge.to, path: [...path, edge.to] });
        }
      }
    }

    console.log('🔍 Graph - No se encontró camino');
    return null;
  }

  // recorrido en profundidad
  dfs(start: Vertex<T>, visited = new Set<Vertex<T>>()): T[] {
    const result: T[] = [];
    
    const dfsHelper = (vertex: Vertex<T>) => {
      visited.add(vertex);
      result.push(vertex.data);

      vertex.edges.forEach(edge => {
        if (!visited.has(edge.to)) {
          dfsHelper(edge.to);
        }
      });
    };

    dfsHelper(start);
    console.log('🔍 Graph - DFS traversal:', result);
    return result;
  }

  // recorrido por niveles
  bfs(start: Vertex<T>): T[] {
    const result: T[] = [];
    const visited = new Set<Vertex<T>>();
    const queue: Vertex<T>[] = [start];
    visited.add(start);

    while (queue.length > 0) {
      const vertex = queue.shift()!;
      result.push(vertex.data);

      vertex.edges.forEach(edge => {
        if (!visited.has(edge.to)) {
          visited.add(edge.to);
          queue.push(edge.to);
        }
      });
    }

    console.log('🔍 Graph - BFS traversal:', result);
    return result;
  }

  // imprimir estructura
  printStructure(): void {
    console.log('🕸️ GRAPH - Estructura completa:');
    console.log('Número de vértices:', this.vertices.length);
    
    this.vertices.forEach((vertex, index) => {
      console.log(`Vértice [${index}]:`, JSON.stringify(vertex.data));
      if (vertex.edges.length > 0) {
        console.log('  Aristas:');
        vertex.edges.forEach((edge, edgeIndex) => {
          console.log(`    [${edgeIndex}] -> ${JSON.stringify(edge.to.data)} (peso: ${edge.weight}${edge.label ? `, label: ${edge.label}` : ''})`);
        });
      } else {
        console.log('  Sin aristas');
      }
    });

    // matriz de conexiones
    console.log('Conexiones:');
    this.vertices.forEach(v1 => {
      const connections = this.vertices.map(v2 => {
        const edge = v1.edges.find(e => e.to === v2);
        return edge ? edge.weight : 0;
      });
      console.log(`  ${JSON.stringify(v1.data)} -> [${connections.join(', ')}]`);
    });
    console.log('---');
  }
}