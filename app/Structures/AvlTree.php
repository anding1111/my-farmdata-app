<?php
namespace App\Structures;

class AvlTree
{
    private ?Node $root = null;

    private function height(?Node $n): int   { return $n?->height ?? 0; }
    private function bal(?Node $n): int      { return $this->height($n->left) - $this->height($n->right); }

    private function rotateRight(Node $y): Node
    {
        $x = $y->left; $T2 = $x->right;
        $x->right = $y; $y->left = $T2;
        $y->height = 1 + max($this->height($y->left), $this->height($y->right));
        $x->height = 1 + max($this->height($x->left), $this->height($x->right));
        return $x;
    }

    private function rotateLeft(Node $x): Node
    {
        $y = $x->right; $T2 = $y->left;
        $y->left = $x; $x->right = $T2;
        $x->height = 1 + max($this->height($x->left), $this->height($x->right));
        $y->height = 1 + max($this->height($y->left), $this->height($y->right));
        return $y;
    }

    private function balance(Node $n): Node
    {
        $n->height = 1 + max($this->height($n->left), $this->height($n->right));
        $bal = $this->bal($n);
        if ($bal > 1 && $this->bal($n->left) >= 0)  return $this->rotateRight($n);
        if ($bal > 1 && $this->bal($n->left) < 0)   { $n->left = $this->rotateLeft($n->left);  return $this->rotateRight($n); }
        if ($bal < -1 && $this->bal($n->right) <= 0) return $this->rotateLeft($n);
        if ($bal < -1 && $this->bal($n->right) > 0)  { $n->right = $this->rotateRight($n->right); return $this->rotateLeft($n); }
        return $n;
    }

    private function insertRec(?Node $node, array $p): Node
    {
        if ($node === null) return new Node($p);
        if ($p['id'] < $node->data['id'])       $node->left  = $this->insertRec($node->left,  $p);
        elseif ($p['id'] > $node->data['id'])   $node->right = $this->insertRec($node->right, $p);
        else                                    $node->data['stock'] += $p['stock'];
        return $this->balance($node);
    }

    private function inOrder(?Node $n, array &$out): void
    {
        if ($n) { $this->inOrder($n->left, $out); $out[] = $n->data; $this->inOrder($n->right, $out); }
    }

    public function insert(array $p): void          { $this->root = $this->insertRec($this->root, $p); }
    public function search(int $id): mixed          { $n = $this->root; while ($n) { if ($id === $n->data['id']) return $n->data; $n = $id < $n->data['id'] ? $n->left : $n->right; } return null; }
    public function toArray(): array                { $out = []; $this->inOrder($this->root, $out); return $out; }
}