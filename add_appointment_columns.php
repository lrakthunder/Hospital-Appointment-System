<?php

try {
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=thunder_hospital', 'root', 'Gwapoakodiba_123');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Adding patient info columns to appointments table...\n\n";
    
    // Check if columns exist first
    $stmt = $pdo->query("SHOW COLUMNS FROM appointments LIKE 'patient_name'");
    if ($stmt->rowCount() == 0) {
        $pdo->exec("ALTER TABLE appointments ADD COLUMN patient_name VARCHAR(255) NULL AFTER user_id");
        echo "✓ Added patient_name column\n";
    } else {
        echo "• patient_name column already exists\n";
    }
    
    $stmt = $pdo->query("SHOW COLUMNS FROM appointments LIKE 'patient_email'");
    if ($stmt->rowCount() == 0) {
        $pdo->exec("ALTER TABLE appointments ADD COLUMN patient_email VARCHAR(255) NULL AFTER patient_name");
        echo "✓ Added patient_email column\n";
    } else {
        echo "• patient_email column already exists\n";
    }
    
    $stmt = $pdo->query("SHOW COLUMNS FROM appointments LIKE 'patient_phone'");
    if ($stmt->rowCount() == 0) {
        $pdo->exec("ALTER TABLE appointments ADD COLUMN patient_phone VARCHAR(20) NULL AFTER patient_email");
        echo "✓ Added patient_phone column\n";
    } else {
        echo "• patient_phone column already exists\n";
    }
    
    echo "\n✓ Successfully updated appointments table!\n";
    
    echo "\nUpdated appointments table structure:\n";
    $stmt = $pdo->query("DESCRIBE appointments");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($columns as $column) {
        echo "- {$column['Field']} ({$column['Type']})\n";
    }
    
} catch (PDOException $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
