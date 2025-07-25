<?php
namespace App\Structures;

class LinkedList
{
    private ?Node $head = null;
    private int   $size = 0;

    public function append($item): void
    {
        $new = new Node($item);
        if ($this->head === null) {
            $this->head = $new;
        } else {
            $curr = $this->head;
            while ($curr->next !== null) {
                $curr = $curr->next;
            }
            $curr->next = $new;
        }
        $this->size++;
    }

    public function prepend($item): void
    {
        $new = new Node($item);
        $new->next = $this->head;
        $this->head = $new;
        $this->size++;
    }

    public function remove($item): bool
    {
        if ($this->head === null) return false;

        if ($this->head->data === $item) {
            $this->head = $this->head->next;
            $this->size--;
            return true;
        }

        $curr = $this->head;
        while ($curr->next !== null) {
            if ($curr->next->data === $item) {
                $curr->next = $curr->next->next;
                $this->size--;
                return true;
            }
            $curr = $curr->next;
        }
        return false;
    }

    public function find($item): bool
    {
        $curr = $this->head;
        while ($curr !== null) {
            if ($curr->data === $item) return true;
            $curr = $curr->next;
        }
        return false;
    }

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

    public function size(): int 
    { 
        return $this->size; 
    }

    public function isEmpty(): bool
    {
        return $this->head === null;
    }
}