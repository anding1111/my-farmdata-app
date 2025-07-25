<?php

use Illuminate\Support\Facades\Route;
use App\Structures\AvlTree;
use App\Structures\LinkedQueue;
use App\Support\Storage;
use Illuminate\Http\Request;

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

/* ---------- INVENTORY API ROUTES ---------- */
Route::prefix('inventory')->group(function () {
    // Products routes
    Route::prefix('products')->group(function () {
        Route::get('/', function (Request $request) {
            try {
                $data = Storage::load();
                $tree = new AvlTree();
                foreach ($data['products'] as $p) $tree->insert($p);
                return response()->json([
                    'data' => $tree->toArray(),
                    'total' => count($tree->toArray()),
                    'success' => true
                ]);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        });
        
        Route::post('/', function (Request $request) {
            try {
                $payload = $request->validate([
                    'name' => 'required|string',
                    'description' => 'nullable|string',
                    'categoryId' => 'nullable|integer',
                    'laboratoryId' => 'nullable|integer',
                    'supplierId' => 'nullable|integer',
                    'price' => 'required|numeric|min:0',
                    'minStock' => 'nullable|integer|min:0',
                    'maxStock' => 'nullable|integer|min:0',
                    'currentStock' => 'nullable|integer|min:0',
                    'unit' => 'nullable|string'
                ]);
                
                $data = Storage::load();
                $tree = new AvlTree();
                foreach ($data['products'] as $p) $tree->insert($p);
                
                $newProduct = [
                    'id' => count($data['products']) + 1,
                    'name' => $payload['name'],
                    'description' => $payload['description'] ?? '',
                    'categoryId' => $payload['categoryId'] ?? null,
                    'laboratoryId' => $payload['laboratoryId'] ?? null,
                    'supplierId' => $payload['supplierId'] ?? null,
                    'price' => $payload['price'],
                    'minStock' => $payload['minStock'] ?? 0,
                    'maxStock' => $payload['maxStock'] ?? 100,
                    'currentStock' => $payload['currentStock'] ?? 0,
                    'unit' => $payload['unit'] ?? 'unidad',
                    'createdAt' => now()->toISOString(),
                    'updatedAt' => now()->toISOString()
                ];
                
                $tree->insert($newProduct);
                Storage::save(['products' => $tree->toArray(), 'queue' => $data['queue']]);
                
                return response()->json(['data' => $newProduct, 'success' => true], 201);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        });
        
        Route::get('/{id}', function (int $id) {
            try {
                $data = Storage::load();
                $tree = new AvlTree();
                foreach ($data['products'] as $p) $tree->insert($p);
                $product = $tree->search($id);
                
                if (!$product) {
                    return response()->json(['error' => 'Product not found'], 404);
                }
                
                return response()->json(['data' => $product, 'success' => true]);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        });
    });
    
    // Categories routes
    Route::prefix('categories')->group(function () {
        Route::get('/', function () {
            try {
                return response()->json([
                    'data' => [
                        ['id' => 1, 'name' => 'Medicamentos', 'description' => 'Productos farmacéuticos'],
                        ['id' => 2, 'name' => 'Suplementos', 'description' => 'Vitaminas y suplementos'],
                        ['id' => 3, 'name' => 'Cuidado Personal', 'description' => 'Productos de higiene']
                    ],
                    'success' => true
                ]);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        });
    });
    
    // Batches routes
    Route::prefix('batches')->group(function () {
        Route::get('/', function () {
            try {
                return response()->json(['data' => [], 'success' => true]);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        });
    });
    
    // Locations routes
    Route::prefix('locations')->group(function () {
        Route::get('/', function () {
            try {
                return response()->json([
                    'data' => [
                        ['id' => 1, 'name' => 'Almacén Principal', 'description' => 'Ubicación principal'],
                        ['id' => 2, 'name' => 'Estante A1', 'description' => 'Primer estante']
                    ],
                    'success' => true
                ]);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        });
    });
    
    // Movements routes
    Route::prefix('movements')->group(function () {
        Route::get('/', function () {
            try {
                return response()->json(['data' => [], 'success' => true]);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        });
    });
    
    // Alerts routes
    Route::prefix('alerts')->group(function () {
        Route::get('/', function () {
            try {
                return response()->json(['data' => [], 'success' => true]);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        });
    });
    
    // Reports routes
    Route::prefix('reports')->group(function () {
        Route::get('/inventory', function () {
            try {
                return response()->json(['data' => [], 'success' => true]);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        });
        
        Route::get('/expiry', function () {
            try {
                return response()->json(['data' => [], 'success' => true]);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        });
        
        Route::get('/low-stock', function () {
            try {
                return response()->json(['data' => [], 'success' => true]);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        });
        
        Route::get('/valuation', function () {
            try {
                return response()->json(['data' => [], 'success' => true]);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        });
    });
});