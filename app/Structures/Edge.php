<?php
namespace App\Structures;

class Edge
{
    public Vertex $source;
    public Vertex $destination;
    public mixed  $weight;

    public function __construct(Vertex $source, Vertex $destination, $weight = 1)
    {
        $this->source = $source;
        $this->destination = $destination;
        $this->weight = $weight;
    }

    public function getSource(): Vertex
    {
        return $this->source;
    }

    public function getDestination(): Vertex
    {
        return $this->destination;
    }

    public function getWeight(): mixed
    {
        return $this->weight;
    }

    public function setWeight($weight): void
    {
        $this->weight = $weight;
    }
}