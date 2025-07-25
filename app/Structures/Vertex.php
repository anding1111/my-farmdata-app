<?php
namespace App\Structures;

class Vertex
{
    public mixed $data;
    public array $edges = [];

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function addEdge(Edge $edge): void
    {
        $this->edges[] = $edge;
    }

    public function removeEdge(Vertex $destination): bool
    {
        foreach ($this->edges as $index => $edge) {
            if ($edge->destination === $destination) {
                unset($this->edges[$index]);
                $this->edges = array_values($this->edges); // Re-index
                return true;
            }
        }
        return false;
    }

    public function getEdges(): array
    {
        return $this->edges;
    }

    public function hasEdgeTo(Vertex $destination): bool
    {
        foreach ($this->edges as $edge) {
            if ($edge->destination === $destination) {
                return true;
            }
        }
        return false;
    }
}