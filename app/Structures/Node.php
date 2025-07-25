<?php
namespace App\Structures;
class Node {
    public mixed $data;
    public ?Node $next = null;
    public ?Node $left = null;
    public ?Node $right = null;
    public int $height = 1;
    public function __construct($data) { $this->data = $data; }
}