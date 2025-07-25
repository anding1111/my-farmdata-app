<?php
namespace App\Structures;
class LinkedQueue {
    private ?Node $head = null;
    private ?Node $tail = null;
    private int $size = 0;

    public function enqueue($item): void {
        $n = new Node($item);
        if ($this->tail === null) { $this->head = $this->tail = $n; }
        else { $this->tail->next = $n; $this->tail = $n; }
        $this->size++;
    }
    public function dequeue(): mixed {
        if ($this->head === null) return null;
        $val = $this->head->data;
        $this->head = $this->head->next;
        if ($this->head === null) $this->tail = null;
        $this->size--;
        return $val;
    }
    public function toArray(): array { $out = []; $curr = $this->head; while ($curr) { $out[] = $curr->data; $curr = $curr->next; } return $out; }
    public function size(): int { return $this->size; }
}