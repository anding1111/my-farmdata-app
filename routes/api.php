<?php

use Illuminate\Support\Facades\Route;
use App\Structures\AvlTree;
use App\Structures\LinkedQueue;
use App\Structures\Stack;
use App\Structures\LinkedList;
use App\Structures\HashTable;
use App\Structures\Graph;
use App\Structures\Vertex;
use App\Structures\Edge;
use App\Support\Storage;
use Illuminate\Http\Request;

/* ========== PRODUCTOS (ÁRBOL AVL) ========== 
 * Cumple con requerimientos académicos: 
 * - Estructura no-lineal tipo árbol
 * - Búsqueda eficiente O(log n)
 * - Sin usar librerías externas
 */
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

/* ========== TURNOS (COLA ENLAZADA) ========== 
 * Cumple con requerimientos académicos:
 * - Estructura lineal usando solo nodos
 * - FIFO (First In, First Out)
 * - Sin usar arreglos ni librerías
 */
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
    
    // Laboratories routes
    Route::prefix('laboratories')->group(function () {
        Route::get('/', function () {
            try {
                return response()->json([
                    'data' => [
                        ['id' => 1, 'name' => 'Laboratorios ABC S.A.S', 'code' => 'LAB001'],
                        ['id' => 2, 'name' => 'Farmacéutica XYZ Ltda', 'code' => 'LAB002'],
                        ['id' => 3, 'name' => 'Distribuidora MED S.A', 'code' => 'LAB003'],
                        ['id' => 4, 'name' => 'Laboratorio Nacional', 'code' => 'LAB004'],
                        ['id' => 5, 'name' => 'Pharma Internacional', 'code' => 'LAB005']
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

/* ========== PILA (PILA ENLAZADA) ========== 
 * Cumple con requerimientos académicos:
 * - Estructura lineal usando solo nodos
 * - LIFO (Last In, First Out) 
 * - Sin usar arreglos ni librerías
 */
Route::prefix('stack')->group(function () {
    Route::get('/', function () {
        $data = Storage::load();
        $stack = new Stack();
        if (isset($data['stack'])) {
            foreach (array_reverse($data['stack']) as $item) {
                $stack->push($item);
            }
        }
        return response()->json($stack->toArray());
    });

    Route::post('/', function () {
        $payload = request()->validate(['data' => 'required']);
        $data = Storage::load();
        $stack = new Stack();
        
        if (isset($data['stack'])) {
            foreach (array_reverse($data['stack']) as $item) {
                $stack->push($item);
            }
        }
        
        $stack->push($payload['data']);
        $newData = $data;
        $newData['stack'] = array_reverse($stack->toArray());
        Storage::save($newData);
        
        return response()->json(['message' => 'Item agregado al stack', 'success' => true]);
    });

    Route::delete('/', function () {
        $data = Storage::load();
        $stack = new Stack();
        
        if (isset($data['stack'])) {
            foreach (array_reverse($data['stack']) as $item) {
                $stack->push($item);
            }
        }
        
        $popped = $stack->pop();
        $newData = $data;
        $newData['stack'] = array_reverse($stack->toArray());
        Storage::save($newData);
        
        return response()->json(['popped' => $popped, 'success' => true]);
    });

    Route::get('/peek', function () {
        $data = Storage::load();
        $stack = new Stack();
        
        if (isset($data['stack'])) {
            foreach (array_reverse($data['stack']) as $item) {
                $stack->push($item);
            }
        }
        
        return response()->json(['top' => $stack->peek(), 'success' => true]);
    });
});

/* ========== LISTA ENLAZADA ========== 
 * Cumple con requerimientos académicos:
 * - Estructura lineal usando solo nodos
 * - Acceso secuencial a elementos
 * - Sin usar arreglos ni librerías
 */
Route::prefix('list')->group(function () {
    Route::get('/', function () {
        $data = Storage::load();
        $list = new LinkedList();
        if (isset($data['list'])) {
            foreach ($data['list'] as $item) {
                $list->append($item);
            }
        }
        return response()->json($list->toArray());
    });

    Route::post('/', function () {
        $payload = request()->validate([
            'data' => 'required',
            'position' => 'nullable|string|in:start,end'
        ]);
        
        $data = Storage::load();
        $list = new LinkedList();
        
        if (isset($data['list'])) {
            foreach ($data['list'] as $item) {
                $list->append($item);
            }
        }
        
        if (($payload['position'] ?? 'end') === 'start') {
            $list->prepend($payload['data']);
        } else {
            $list->append($payload['data']);
        }
        
        $newData = $data;
        $newData['list'] = $list->toArray();
        Storage::save($newData);
        
        return response()->json(['message' => 'Item agregado a la lista', 'success' => true]);
    });

    Route::delete('/', function () {
        $payload = request()->validate(['data' => 'required']);
        $data = Storage::load();
        $list = new LinkedList();
        
        if (isset($data['list'])) {
            foreach ($data['list'] as $item) {
                $list->append($item);
            }
        }
        
        $removed = $list->remove($payload['data']);
        $newData = $data;
        $newData['list'] = $list->toArray();
        Storage::save($newData);
        
        return response()->json(['removed' => $removed, 'success' => true]);
    });

    Route::get('/find/{item}', function ($item) {
        $data = Storage::load();
        $list = new LinkedList();
        
        if (isset($data['list'])) {
            foreach ($data['list'] as $listItem) {
                $list->append($listItem);
            }
        }
        
        return response()->json(['found' => $list->find($item), 'success' => true]);
    });
});

/* ========== TABLA HASH ========== 
 * Cumple con requerimientos académicos:
 * - Estructura de datos con función hash personalizada
 * - Búsqueda eficiente O(1) promedio
 * - Sin usar HashMap ni librerías
 */
Route::prefix('hash')->group(function () {
    Route::get('/', function () {
        $data = Storage::load();
        $hash = new HashTable();
        if (isset($data['hash'])) {
            foreach ($data['hash'] as $item) {
                $hash->put($item['key'], $item['value']);
            }
        }
        return response()->json($hash->toArray());
    });

    Route::post('/', function () {
        $payload = request()->validate([
            'key' => 'required',
            'value' => 'required'
        ]);
        
        $data = Storage::load();
        $hash = new HashTable();
        
        if (isset($data['hash'])) {
            foreach ($data['hash'] as $item) {
                $hash->put($item['key'], $item['value']);
            }
        }
        
        $hash->put($payload['key'], $payload['value']);
        $newData = $data;
        $newData['hash'] = $hash->toArray();
        Storage::save($newData);
        
        return response()->json(['message' => 'Par clave-valor agregado', 'success' => true]);
    });

    Route::get('/{key}', function ($key) {
        $data = Storage::load();
        $hash = new HashTable();
        
        if (isset($data['hash'])) {
            foreach ($data['hash'] as $item) {
                $hash->put($item['key'], $item['value']);
            }
        }
        
        $value = $hash->get($key);
        return response()->json(['key' => $key, 'value' => $value, 'success' => true]);
    });

    Route::delete('/{key}', function ($key) {
        $data = Storage::load();
        $hash = new HashTable();
        
        if (isset($data['hash'])) {
            foreach ($data['hash'] as $item) {
                $hash->put($item['key'], $item['value']);
            }
        }
        
        $removed = $hash->remove($key);
        $newData = $data;
        $newData['hash'] = $hash->toArray();
        Storage::save($newData);
        
        return response()->json(['removed' => $removed, 'success' => true]);
    });

    Route::get('/keys/all', function () {
        $data = Storage::load();
        $hash = new HashTable();
        
        if (isset($data['hash'])) {
            foreach ($data['hash'] as $item) {
                $hash->put($item['key'], $item['value']);
            }
        }
        
        return response()->json(['keys' => $hash->keys(), 'success' => true]);
    });
});

/* ========== GRAFO (CON VÉRTICES Y ARISTAS) ========== 
 * Cumple con requerimientos académicos:
 * - Usa VÉRTICES y ARISTAS (NO nodos)
 * - Representa relaciones entre entidades
 * - Sin usar librerías de grafos
 */
Route::prefix('graph')->group(function () {
    Route::get('/', function () {
        $data = Storage::load();
        $graph = new Graph();
        
        if (isset($data['graph'])) {
            $vertices = [];
            
            // Create vertices first
            foreach ($data['graph'] as $vertexData) {
                $vertex = $graph->addVertex($vertexData['data']);
                $vertices[$vertexData['data']] = $vertex;
            }
            
            // Add edges
            foreach ($data['graph'] as $vertexData) {
                $sourceVertex = $vertices[$vertexData['data']];
                foreach ($vertexData['edges'] as $edgeData) {
                    if (isset($vertices[$edgeData['destination']])) {
                        $destinationVertex = $vertices[$edgeData['destination']];
                        $graph->addEdge($sourceVertex, $destinationVertex, $edgeData['weight']);
                    }
                }
            }
        }
        
        return response()->json($graph->toArray());
    });

    Route::post('/vertex', function () {
        $payload = request()->validate(['data' => 'required']);
        $data = Storage::load();
        $graph = new Graph();
        
        if (isset($data['graph'])) {
            $vertices = [];
            foreach ($data['graph'] as $vertexData) {
                $vertex = $graph->addVertex($vertexData['data']);
                $vertices[$vertexData['data']] = $vertex;
            }
            foreach ($data['graph'] as $vertexData) {
                $sourceVertex = $vertices[$vertexData['data']];
                foreach ($vertexData['edges'] as $edgeData) {
                    if (isset($vertices[$edgeData['destination']])) {
                        $destinationVertex = $vertices[$edgeData['destination']];
                        $graph->addEdge($sourceVertex, $destinationVertex, $edgeData['weight']);
                    }
                }
            }
        }
        
        $graph->addVertex($payload['data']);
        $newData = $data;
        $newData['graph'] = $graph->toArray();
        Storage::save($newData);
        
        return response()->json(['message' => 'Vértice agregado', 'success' => true]);
    });

    Route::post('/edge', function () {
        $payload = request()->validate([
            'source' => 'required',
            'destination' => 'required',
            'weight' => 'nullable|numeric'
        ]);
        
        $data = Storage::load();
        $graph = new Graph();
        $vertices = [];
        
        if (isset($data['graph'])) {
            foreach ($data['graph'] as $vertexData) {
                $vertex = $graph->addVertex($vertexData['data']);
                $vertices[$vertexData['data']] = $vertex;
            }
            foreach ($data['graph'] as $vertexData) {
                $sourceVertex = $vertices[$vertexData['data']];
                foreach ($vertexData['edges'] as $edgeData) {
                    if (isset($vertices[$edgeData['destination']])) {
                        $destinationVertex = $vertices[$edgeData['destination']];
                        $graph->addEdge($sourceVertex, $destinationVertex, $edgeData['weight']);
                    }
                }
            }
        }
        
        $sourceVertex = $vertices[$payload['source']] ?? null;
        $destinationVertex = $vertices[$payload['destination']] ?? null;
        
        if ($sourceVertex && $destinationVertex) {
            $graph->addEdge($sourceVertex, $destinationVertex, $payload['weight'] ?? 1);
            $newData = $data;
            $newData['graph'] = $graph->toArray();
            Storage::save($newData);
            
            return response()->json(['message' => 'Arista agregada', 'success' => true]);
        }
        
        return response()->json(['error' => 'Vértices no encontrados'], 400);
    });

    Route::delete('/vertex', function () {
        $payload = request()->validate(['data' => 'required']);
        $data = Storage::load();
        $graph = new Graph();
        $vertices = [];
        
        if (isset($data['graph'])) {
            foreach ($data['graph'] as $vertexData) {
                $vertex = $graph->addVertex($vertexData['data']);
                $vertices[$vertexData['data']] = $vertex;
            }
            foreach ($data['graph'] as $vertexData) {
                $sourceVertex = $vertices[$vertexData['data']];
                foreach ($vertexData['edges'] as $edgeData) {
                    if (isset($vertices[$edgeData['destination']])) {
                        $destinationVertex = $vertices[$edgeData['destination']];
                        $graph->addEdge($sourceVertex, $destinationVertex, $edgeData['weight']);
                    }
                }
            }
        }
        
        $vertexToRemove = $vertices[$payload['data']] ?? null;
        if ($vertexToRemove) {
            $removed = $graph->removeVertex($vertexToRemove);
            $newData = $data;
            $newData['graph'] = $graph->toArray();
            Storage::save($newData);
            
            return response()->json(['removed' => $removed, 'success' => true]);
        }
        
        return response()->json(['error' => 'Vértice no encontrado'], 400);
    });

    Route::delete('/edge', function () {
        $payload = request()->validate([
            'source' => 'required',
            'destination' => 'required'
        ]);
        
        $data = Storage::load();
        $graph = new Graph();
        $vertices = [];
        
        if (isset($data['graph'])) {
            foreach ($data['graph'] as $vertexData) {
                $vertex = $graph->addVertex($vertexData['data']);
                $vertices[$vertexData['data']] = $vertex;
            }
            foreach ($data['graph'] as $vertexData) {
                $sourceVertex = $vertices[$vertexData['data']];
                foreach ($vertexData['edges'] as $edgeData) {
                    if (isset($vertices[$edgeData['destination']])) {
                        $destinationVertex = $vertices[$edgeData['destination']];
                        $graph->addEdge($sourceVertex, $destinationVertex, $edgeData['weight']);
                    }
                }
            }
        }
        
        $sourceVertex = $vertices[$payload['source']] ?? null;
        $destinationVertex = $vertices[$payload['destination']] ?? null;
        
        if ($sourceVertex && $destinationVertex) {
            $removed = $graph->removeEdge($sourceVertex, $destinationVertex);
            $newData = $data;
            $newData['graph'] = $graph->toArray();
            Storage::save($newData);
            
            return response()->json(['removed' => $removed, 'success' => true]);
        }
        
        return response()->json(['error' => 'Vértices no encontrados'], 400);
    });
});