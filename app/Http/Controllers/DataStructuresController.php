<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Support\Storage;
use App\Structures\LinkedQueue;
use App\Structures\AvlTree;
use App\Structures\Stack;
use App\Structures\LinkedList;
use App\Structures\HashTable;
use App\Structures\Graph;

/**
 * Controlador para Estructuras de Datos
 * Maneja las operaciones CRUD para todas las estructuras de datos implementadas
 * Cumple con los requerimientos académicos del proyecto
 */
class DataStructuresController extends Controller
{
    /**
     * Obtener datos del árbol AVL de productos
     */
    public function getProducts(): JsonResponse
    {
        try {
            $data = Storage::read();
            return response()->json([
                'success' => true,
                'data' => $data['products'] ?? [],
                'structure_type' => 'AVL Tree',
                'description' => 'Árbol binario balanceado para productos del inventario'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos del árbol AVL: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Agregar producto al árbol AVL
     */
    public function addProduct(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'id' => 'required|integer',
                'name' => 'required|string',
                'stock' => 'required|integer|min:0',
                'price' => 'required|numeric|min:0'
            ]);

            $data = Storage::read();
            $tree = new AvlTree();
            
            // Cargar datos existentes en el árbol
            foreach ($data['products'] as $product) {
                $tree->insert($product);
            }
            
            // Insertar nuevo producto
            $tree->insert($validated);
            
            // Guardar árbol actualizado
            $data['products'] = $tree->toArray();
            Storage::write($data);

            return response()->json([
                'success' => true,
                'message' => 'Producto agregado exitosamente al árbol AVL',
                'data' => $validated
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al agregar producto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener datos de la cola enlazada
     */
    public function getQueue(): JsonResponse
    {
        try {
            $data = Storage::read();
            return response()->json([
                'success' => true,
                'data' => $data['queue'] ?? [],
                'structure_type' => 'Linked Queue',
                'description' => 'Cola enlazada para sistema de turnos - FIFO'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener cola: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Agregar elemento a la cola (encolar)
     */
    public function enqueue(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'item' => 'required'
            ]);

            $data = Storage::read();
            $queue = new LinkedQueue();
            
            // Cargar datos existentes
            foreach ($data['queue'] as $item) {
                $queue->enqueue($item);
            }
            
            // Agregar nuevo elemento
            $queue->enqueue($validated['item']);
            
            // Guardar cola actualizada
            $data['queue'] = $queue->toArray();
            Storage::write($data);

            return response()->json([
                'success' => true,
                'message' => 'Elemento agregado a la cola exitosamente',
                'data' => $validated['item'],
                'queue_size' => $queue->size()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al encolar elemento: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remover elemento de la cola (desencolar)
     */
    public function dequeue(): JsonResponse
    {
        try {
            $data = Storage::read();
            $queue = new LinkedQueue();
            
            // Cargar datos existentes
            foreach ($data['queue'] as $item) {
                $queue->enqueue($item);
            }
            
            // Remover elemento
            $dequeuedItem = $queue->dequeue();
            
            if ($dequeuedItem === null) {
                return response()->json([
                    'success' => false,
                    'message' => 'La cola está vacía'
                ], 400);
            }
            
            // Guardar cola actualizada
            $data['queue'] = $queue->toArray();
            Storage::write($data);

            return response()->json([
                'success' => true,
                'message' => 'Elemento removido de la cola exitosamente',
                'data' => $dequeuedItem,
                'queue_size' => $queue->size()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al desencolar elemento: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener datos del grafo
     */
    public function getGraph(): JsonResponse
    {
        try {
            $data = Storage::read();
            return response()->json([
                'success' => true,
                'data' => $data['graph'] ?? [],
                'structure_type' => 'Graph with Vertices and Edges',
                'description' => 'Grafo para representar relaciones entre proveedores, productos y categorías'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener grafo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Agregar vértice al grafo
     */
    public function addVertex(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'data' => 'required'
            ]);

            $data = Storage::read();
            $graph = new Graph();
            
            // Reconstruir grafo desde datos guardados
            // Por simplicidad, solo agregamos el nuevo vértice
            $graph->addVertex($validated['data']);
            
            // Agregar a los datos existentes
            $data['graph'][] = [
                'data' => $validated['data'],
                'edges' => []
            ];
            
            Storage::write($data);

            return response()->json([
                'success' => true,
                'message' => 'Vértice agregado al grafo exitosamente',
                'data' => $validated['data']
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al agregar vértice: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener todas las estructuras de datos (resumen)
     */
    public function getAllStructures(): JsonResponse
    {
        try {
            $data = Storage::read();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'avl_tree' => [
                        'type' => 'Árbol AVL',
                        'count' => count($data['products'] ?? []),
                        'description' => 'Árbol binario balanceado para productos'
                    ],
                    'queue' => [
                        'type' => 'Cola Enlazada',
                        'count' => count($data['queue'] ?? []),
                        'description' => 'Cola FIFO para sistema de turnos'
                    ],
                    'stack' => [
                        'type' => 'Pila Enlazada',
                        'count' => count($data['stack'] ?? []),
                        'description' => 'Pila LIFO para historial de operaciones'
                    ],
                    'list' => [
                        'type' => 'Lista Enlazada',
                        'count' => count($data['list'] ?? []),
                        'description' => 'Lista secuencial de elementos'
                    ],
                    'hash' => [
                        'type' => 'Tabla Hash',
                        'count' => count($data['hash'] ?? []),
                        'description' => 'Búsqueda rápida por clave'
                    ],
                    'graph' => [
                        'type' => 'Grafo con Vértices y Aristas',
                        'count' => count($data['graph'] ?? []),
                        'description' => 'Relaciones entre entidades'
                    ]
                ],
                'message' => 'Todas las estructuras implementadas según requerimientos académicos'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estructuras: ' . $e->getMessage()
            ], 500);
        }
    }
}