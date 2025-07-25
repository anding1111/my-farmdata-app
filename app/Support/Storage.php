<?php
namespace App\Support;
class Storage {
    private static string $file = __DIR__ . '/../../storage/app/farmdata.json';
    public static function load(): array {
        if (!file_exists(self::$file)) self::seed();
        return json_decode(file_get_contents(self::$file), true);
    }
    public static function save(array $data): void { file_put_contents(self::$file, json_encode($data, JSON_PRETTY_PRINT)); }
    private static function seed(): void {
        $products = [];
        for ($i = 1; $i <= 500; $i++) {
            $products[] = [
                'id'    => $i,
                'name'  => "Medicamento_$i",
                'stock' => random_int(1, 999),
                'price' => random_int(1000, 50000) / 100
            ];
        }
        $queue = [];
        for ($i = 1; $i <= 200; $i++) {
            $queue[] = [
                'ticket'   => $i,
                'customer' => "Cliente_$i",
                'time'     => now()->toTimeString()
            ];
        }
        self::save(['products' => $products, 'queue' => $queue]);
    }
}