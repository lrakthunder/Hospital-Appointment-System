<?php

try {
    $pdo = new PDO(
        'mysql:host=127.0.0.1;dbname=thunder_hospital',
        'root',
        'Gwapoakodiba_123'
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Checking doctors table structure...\n\n";
    
    $stmt = $pdo->query("DESCRIBE doctors");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Current columns in doctors table:\n";
    foreach ($columns as $column) {
        echo "- {$column['Field']} ({$column['Type']})\n";
    }
    
    echo "\n✓ Successfully retrieved doctors table structure\n";
    
} catch (PDOException $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
