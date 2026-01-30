<?php
require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Appointment;
use App\Models\Doctor;
use Illuminate\Support\Facades\DB;

$doctor = Doctor::first();
if (! $doctor) {
    echo "No doctor found in DB\n";
    exit(1);
}

echo "Doctor id={$doctor->id} name={$doctor->name}\n\n";

$q1 = Appointment::where('doctor_id', $doctor->id);
$q2 = (clone $q1)->whereDate('appointment_date', today())->orderBy('appointment_time');
$q3 = (clone $q1)->whereDate('appointment_date', '>', today())->where('status', '!=', 'cancelled')->orderBy('appointment_date')->orderBy('appointment_time')->limit(10);

echo "Total SQL: " . $q1->toSql() . "\n";
echo "Total Bindings: "; print_r($q1->getBindings());

echo "Today SQL: " . $q2->toSql() . "\n";
echo "Today Bindings: "; print_r($q2->getBindings());

echo "Upcoming SQL: " . $q3->toSql() . "\n";
echo "Upcoming Bindings: "; print_r($q3->getBindings());

// Also run the queries to see runtime failure
try {
    echo "\nRunning today query...\n";
    $rows = $q2->get();
    echo "Rows fetched: " . count($rows) . "\n";
} catch (Throwable $e) {
    echo "Error running today query: " . $e->getMessage() . "\n";
}

