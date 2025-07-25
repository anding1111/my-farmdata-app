<?php
namespace App\Structures;

/**
 * Implementación de Grafo usando Vértices y Aristas
 * Utilizado para representar relaciones entre entidades (proveedores-productos-categorías)
 * Cumple con los requerimientos académicos: usa vértices y aristas, NO nodos
 */
class Graph
{
    private array $vertices = []; // Colección de vértices del grafo
    private bool  $directed;      // Indica si el grafo es dirigido o no dirigido

    public function __construct(bool $directed = false)
    {
        $this->directed = $directed;
    }

    public function addVertex($data): Vertex
    {
        $vertex = new Vertex($data);
        $this->vertices[] = $vertex;
        return $vertex;
    }

    public function removeVertex(Vertex $vertexToRemove): bool
    {
        // Remove all edges pointing to this vertex
        foreach ($this->vertices as $vertex) {
            $vertex->removeEdge($vertexToRemove);
        }

        // Remove the vertex itself
        foreach ($this->vertices as $index => $vertex) {
            if ($vertex === $vertexToRemove) {
                unset($this->vertices[$index]);
                $this->vertices = array_values($this->vertices); // Re-index
                return true;
            }
        }
        return false;
    }

    public function addEdge(Vertex $source, Vertex $destination, $weight = 1): Edge
    {
        $edge = new Edge($source, $destination, $weight);
        $source->addEdge($edge);

        // If undirected, add edge in both directions
        if (!$this->directed) {
            $reverseEdge = new Edge($destination, $source, $weight);
            $destination->addEdge($reverseEdge);
        }

        return $edge;
    }

    public function removeEdge(Vertex $source, Vertex $destination): bool
    {
        $removed = $source->removeEdge($destination);
        
        if (!$this->directed) {
            $destination->removeEdge($source);
        }
        
        return $removed;
    }

    public function findVertex($data): ?Vertex
    {
        foreach ($this->vertices as $vertex) {
            if ($vertex->data === $data) {
                return $vertex;
            }
        }
        return null;
    }

    public function getVertices(): array
    {
        return $this->vertices;
    }

    public function getAllEdges(): array
    {
        $allEdges = [];
        foreach ($this->vertices as $vertex) {
            foreach ($vertex->getEdges() as $edge) {
                $allEdges[] = $edge;
            }
        }
        return $allEdges;
    }

    public function toArray(): array
    {
        $graphData = [];
        foreach ($this->vertices as $vertex) {
            $vertexData = [
                'data' => $vertex->data,
                'edges' => []
            ];
            
            foreach ($vertex->getEdges() as $edge) {
                $vertexData['edges'][] = [
                    'destination' => $edge->destination->data,
                    'weight' => $edge->weight
                ];
            }
            
            $graphData[] = $vertexData;
        }
        return $graphData;
    }

    public function isDirected(): bool
    {
        return $this->directed;
    }
}