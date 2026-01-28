<?php

$pdo = new PDO('mysql:host=127.0.0.1;dbname=thunder_hospital', 'root', 'Gwapoakodiba_123');
$stmt = $pdo->query('DESCRIBE appointments');
$columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($columns as $col) {
    echo $col['Field'] . ' (' . $col['Type'] . ')' . PHP_EOL;
}
