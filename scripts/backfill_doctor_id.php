<?php
// Script to backfill appointments.doctor_id from doctors.name when they match exactly

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
// bootstrap the application to use the DB facade
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    $updated = DB::update("UPDATE appointments a JOIN doctors d ON a.doctor_name = d.name SET a.doctor_id = d.id WHERE a.doctor_id IS NULL");
    echo "Updated rows: {$updated}\n";

    $remaining = DB::table('appointments')->whereNull('doctor_id')->count();
    echo "Remaining rows with NULL doctor_id: {$remaining}\n";

    // Optionally show some sample rows that still have null doctor_id for manual inspection
    $samples = DB::select("SELECT id, doctor_name FROM appointments WHERE doctor_id IS NULL LIMIT 10");
    if (count($samples) > 0) {
        echo "Sample unmatched rows:\n";
        foreach ($samples as $row) {
            echo "#{$row->id}: {$row->doctor_name}\n";
        }
    }
} catch (Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
