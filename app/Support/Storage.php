<?php
namespace App\Support;

class Storage
{
    private static string $file = __DIR__ . '/../../storage/app/farmdata.json';

    public static function load(): array
    {
        if (!file_exists(self::$file)) self::seed();
        return json_decode(file_get_contents(self::$file), true);
    }

    public static function save(array $data): void
    {
        file_put_contents(self::$file, json_encode($data, JSON_PRETTY_PRINT));
    }

    private static function seed(): void
    {
        // 500 fake products
        $products = [];
        for ($i = 1; $i <= 500; $i++) {
            $products[] = [
                'id'    => $i,
                'name'  => 'Medicamento_' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'stock' => random_int(1, 999),
                'price' => random_int(1000, 50000) / 100
            ];
        }

        // 200 fake pharmacy turns
        $queue = [];
        for ($i = 1; $i <= 200; $i++) {
            $queue[] = [
                'ticket'   => $i,
                'customer' => 'Cliente_' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'time'     => now()->toTimeString()
            ];
        }

        self::save(['products' => $products, 'queue' => $queue]);
    }
}