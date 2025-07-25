<?php

use Illuminate\Support\Facades\Route;
use App\Structures\AvlTree;
use App\Structures\LinkedQueue;
use App\Support\Storage;

/* ---------- PRODUCTS (AVL TREE) ---------- */
Route::prefix('products')->group(function () {
    Route::get('/', function () {
        $data   = Storage::load();
        $tree   = new AvlTree();
        foreach ($data['products'] as $p) $tree->insert($p);
        return response()->json($tree->toArray());
    });

    Route::post('/', function () {
        $payload = request()->validate([
            'id'    => 'required|integer',
            'name'  => 'required|string',
            'stock' => 'required|integer',
            'price' => 'required|numeric'
        ]);

        $data   = Storage::load();
        $tree   = new AvlTree();
        foreach ($data['products'] as $p) $tree->insert($p);
        $tree->insert($payload);
        Storage::save(['products' => $tree->toArray(), 'queue' => $data['queue']]);

        return response()->json(['message' => 'Producto agregado']);
    });

    Route::get('/{id}', function (int $id) {
        $data = Storage::load();
        $tree = new AvlTree();
        foreach ($data['products'] as $p) $tree->insert($p);
        $product = $tree->search($id);
        return $product ? response()->json($product) : response()->json([], 404);
    });
});

/* ---------- TURNS (LINKED QUEUE) ---------- */
Route::prefix('turns')->group(function () {
    Route::get('/', function () {
        $data = Storage::load();
        $q    = new LinkedQueue();
        foreach ($data['queue'] as $t) $q->enqueue($t);
        return response()->json($q->toArray());
    });

    Route::post('/', function () {
        $payload = request()->validate(['customer' => 'required|string']);
        $payload['ticket'] = now()->timestamp;
        $payload['time']   = now()->toTimeString();

        $data = Storage::load();
        $q    = new LinkedQueue();
        foreach ($data['queue'] as $t) $q->enqueue($t);
        $q->enqueue($payload);
        Storage::save(['products' => $data['products'], 'queue' => $q->toArray()]);

        return response()->json(['message' => 'Turno agregado']);
    });

    Route::delete('/', function () {
        $data = Storage::load();
        $q    = new LinkedQueue();
        foreach ($data['queue'] as $t) $q->enqueue($t);
        $next = $q->dequeue();
        Storage::save(['products' => $data['products'], 'queue' => $q->toArray()]);
        return response()->json(['next' => $next]);
    });
});