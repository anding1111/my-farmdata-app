<?php
namespace App\Structures;

/**
 * Implementación de Cola Enlazada (Queue) usando Nodos
 * Utilizada para sistemas de turnos y colas de espera - FIFO (First In, First Out)
 * Cumple con los requerimientos académicos: estructura lineal sin usar arreglos
 */
class LinkedQueue
{
    private ?Node $head = null; // Primer nodo (frente de la cola)
    private ?Node $tail = null; // Último nodo (final de la cola)
    private int   $size = 0;    // Tamaño actual de la cola

    /**
     * Agregar elemento al final de la cola (encolar)
     */
    public function enqueue($item): void
    {
        $new = new Node($item);
        if ($this->tail === null) {
            $this->head = $this->tail = $new;
        } else {
            $this->tail->next = $new;
            $this->tail = $new;
        }
        $this->size++;
    }

    /**
     * Remover elemento del frente de la cola (desencolar)
     */
    public function dequeue(): mixed
    {
        if ($this->head === null) return null;
        $val = $this->head->data;
        $this->head = $this->head->next;
        if ($this->head === null) $this->tail = null;
        $this->size--;
        return $val;
    }

    /**
     * Convertir cola a arreglo para visualización
     */
    public function toArray(): array
    {
        $out = []; 
        $curr = $this->head;
        while ($curr) { 
            $out[] = $curr->data; 
            $curr = $curr->next; 
        }
        return $out;
    }

    /**
     * Obtener tamaño actual de la cola
     */
    public function size(): int { return $this->size; }
}