<?php
namespace App\Structures;
class AvlTree {
    private ?Node $root = null;

    private function h(?Node $n): int { return $n?->height ?? 0; }
    private function bal(?Node $n): int { return $n === null ? 0 : $this->h($n->left) - $this->h($n->right); }
    private function rotR(Node $y): Node {
        $x = $y->left; $T2 = $x->right;
        $x->right = $y; $y->left = $T2;
        $y->height = 1 + max($this->h($y->left), $this->h($y->right));
        $x->height = 1 + max($this->h($x->left), $this->h($x->right));
        return $x;
    }
    private function rotL(Node $x): Node {
        $y = $x->right; $T2 = $y->left;
        $y->left = $x; $x->right = $T2;
        $x->height = 1 + max($this->h($x->left), $this->h($x->right));
        $y->height = 1 + max($this->h($y->left), $this->h($y->right));
        return $y;
    }
    private function balance(Node $n): Node {
        $n->height = 1 + max($this->h($n->left), $this->h($n->right));
        $bal = $this->bal($n);
        if ($bal > 1 && $this->bal($n->left) >= 0) return $this->rotR($n);
        if ($bal > 1 && $this->bal($n->left) < 0) { $n->left = $this->rotL($n->left); return $this->rotR($n); }
        if ($bal < -1 && $this->bal($n->right) <= 0) return $this->rotL($n);
        if ($bal < -1 && $this->bal($n->right) > 0) { $n->right = $this->rotR($n->right); return $this->rotL($n); }
        return $n;
    }
    private function ins(?Node $n, $d): Node {
        if ($n === null) return new Node($d);
        if ($d['id'] < $n->data['id']) $n->left = $this->ins($n->left, $d);
        elseif ($d['id'] > $n->data['id']) $n->right = $this->ins($n->right, $d);
        else $n->data['stock'] += $d['stock'];
        return $this->balance($n);
    }
    private function inOrder(?Node $n, array &$out): void {
        if ($n) { $this->inOrder($n->left, $out); $out[] = $n->data; $this->inOrder($n->right, $out); }
    }
    public function insert(array $p): void { $this->root = $this->ins($this->root, $p); }
    public function search(int $id): mixed { $n = $this->root; while ($n) { if ($id === $n->data['id']) return $n->data; $n = $id < $n->data['id'] ? $n->left : $n->right; } return null; }
    public function toArray(): array { $out = []; $this->inOrder($this->root, $out); return $out; }
}