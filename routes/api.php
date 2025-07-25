<?php
use Illuminate\Support\Facades\Route;
use App\Structures\AvlTree;
use App\Structures\LinkedQueue;
use App\Support\Storage;

Route::prefix('products')->group(function () {
    Route::get('/',   fn() => Storage::load()['products']);
    Route::post('/',  function () {
        $p = request()->validate(['id'=>'required|int', 'name'=>'required', 'stock'=>'required|int', 'price'=>'required|numeric']);
        $data = Storage::load();
        $tree = new AvlTree();
        foreach ($data['products'] as $prod) $tree->insert($prod);
        $tree->insert($p);
        Storage::save(['products'=>$tree->toArray(),'queue'=>$data['queue']]);
        return response()->json(['msg'=>'Producto agregado']);
    });
});

Route::prefix('turns')->group(function () {
    Route::get('/',   fn() => Storage::load()['queue']);
    Route::post('/',  function () {
        $t = request()->validate(['customer'=>'required']);
        $t['ticket'] = now()->timestamp;
        $t['time']   = now()->toTimeString();
        $data = Storage::load();
        $q = new LinkedQueue();
        foreach ($data['queue'] as $turn) $q->enqueue($turn);
        $q->enqueue($t);
        Storage::save(['products'=>$data['products'],'queue'=>$q->toArray()]);
        return response()->json(['msg'=>'Turno agregado']);
    });
    Route::delete('/', function () {
        $data = Storage::load();
        $q = new LinkedQueue();
        foreach ($data['queue'] as $turn) $q->enqueue($turn);
        $next = $q->dequeue();
        Storage::save(['products'=>$data['products'],'queue'=>$q->toArray()]);
        return response()->json(['next'=>$next]);
    });
});