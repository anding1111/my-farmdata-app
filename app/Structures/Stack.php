<?php
namespace App\Structures;

class Stack
{
    private ?Node $top = null;
    private int   $size = 0;

    public function push($item): void
    {
        $new = new Node($item);
        $new->next = $this->top;
        $this->top = $new;
        $this->size++;
    }

    public function pop(): mixed
    {
        if ($this->top === null) return null;
        $val = $this->top->data;
        $this->top = $this->top->next;
        $this->size--;
        return $val;
    }

    public function peek(): mixed
    {
        return $this->top ? $this->top->data : null;
    }

    public function isEmpty(): bool
    {
        return $this->top === null;
    }

    public function toArray(): array
    {
        $out = []; 
        $curr = $this->top;
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
}