<?php
namespace App\Structures;

class HashTable
{
    private array $buckets;
    private int   $capacity;
    private int   $size = 0;

    public function __construct(int $capacity = 16)
    {
        $this->capacity = $capacity;
        $this->buckets = array_fill(0, $capacity, null);
    }

    private function hash($key): int
    {
        if (is_string($key)) {
            $hash = 0;
            for ($i = 0; $i < strlen($key); $i++) {
                $hash = ($hash + ord($key[$i])) % $this->capacity;
            }
            return $hash;
        }
        return abs($key) % $this->capacity;
    }

    public function put($key, $value): void
    {
        $index = $this->hash($key);
        $new = new Node(['key' => $key, 'value' => $value]);

        if ($this->buckets[$index] === null) {
            $this->buckets[$index] = $new;
            $this->size++;
        } else {
            $curr = $this->buckets[$index];
            while ($curr !== null) {
                if ($curr->data['key'] === $key) {
                    $curr->data['value'] = $value; // Update existing
                    return;
                }
                if ($curr->next === null) break;
                $curr = $curr->next;
            }
            $curr->next = $new; // Add new
            $this->size++;
        }
    }

    public function get($key): mixed
    {
        $index = $this->hash($key);
        $curr = $this->buckets[$index];

        while ($curr !== null) {
            if ($curr->data['key'] === $key) {
                return $curr->data['value'];
            }
            $curr = $curr->next;
        }
        return null;
    }

    public function remove($key): bool
    {
        $index = $this->hash($key);
        
        if ($this->buckets[$index] === null) return false;

        if ($this->buckets[$index]->data['key'] === $key) {
            $this->buckets[$index] = $this->buckets[$index]->next;
            $this->size--;
            return true;
        }

        $curr = $this->buckets[$index];
        while ($curr->next !== null) {
            if ($curr->next->data['key'] === $key) {
                $curr->next = $curr->next->next;
                $this->size--;
                return true;
            }
            $curr = $curr->next;
        }
        return false;
    }

    public function keys(): array
    {
        $keys = [];
        for ($i = 0; $i < $this->capacity; $i++) {
            $curr = $this->buckets[$i];
            while ($curr !== null) {
                $keys[] = $curr->data['key'];
                $curr = $curr->next;
            }
        }
        return $keys;
    }

    public function toArray(): array
    {
        $items = [];
        for ($i = 0; $i < $this->capacity; $i++) {
            $curr = $this->buckets[$i];
            while ($curr !== null) {
                $items[] = $curr->data;
                $curr = $curr->next;
            }
        }
        return $items;
    }

    public function size(): int 
    { 
        return $this->size; 
    }
}