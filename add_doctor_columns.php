<?php

try {
    $pdo = new PDO(
        'mysql:host=127.0.0.1;dbname=thunder_hospital',
        'root',
        'Gwapoakodiba_123'
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Adding missing columns to doctors table...\n\n";
    
    // Add license_number column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN license_number VARCHAR(100) NULL AFTER phone");
    echo "✓ Added license_number column\n";
    
    // Rename experience_years to years_of_experience
    $pdo->exec("ALTER TABLE doctors CHANGE COLUMN experience_years years_of_experience INT NULL");
    echo "✓ Renamed experience_years to years_of_experience\n";
    
    // Add department column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN department VARCHAR(255) NULL AFTER password");
    echo "✓ Added department column\n";
    
    // Add status column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN status VARCHAR(255) DEFAULT 'active' AFTER bio");
    echo "✓ Added status column\n";
    
    // Add role column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN role VARCHAR(255) DEFAULT 'doctor' AFTER status");
    echo "✓ Added role column\n";
    
    // Add education column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN education TEXT NULL AFTER qualifications");
    echo "✓ Added education column\n";
    
    // Add medical_school column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN medical_school VARCHAR(255) NULL AFTER education");
    echo "✓ Added medical_school column\n";
    
    // Add graduation_year column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN graduation_year INT NULL AFTER medical_school");
    echo "✓ Added graduation_year column\n";
    
    // Add certifications column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN certifications TEXT NULL AFTER graduation_year");
    echo "✓ Added certifications column\n";
    
    // Add languages_spoken column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN languages_spoken TEXT NULL AFTER certifications");
    echo "✓ Added languages_spoken column\n";
    
    // Add office_address column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN office_address VARCHAR(255) NULL AFTER languages_spoken");
    echo "✓ Added office_address column\n";
    
    // Add city column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN city VARCHAR(255) NULL AFTER office_address");
    echo "✓ Added city column\n";
    
    // Add state column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN state VARCHAR(255) NULL AFTER city");
    echo "✓ Added state column\n";
    
    // Add zip_code column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN zip_code VARCHAR(10) NULL AFTER state");
    echo "✓ Added zip_code column\n";
    
    // Add emergency_contact column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN emergency_contact VARCHAR(255) NULL AFTER zip_code");
    echo "✓ Added emergency_contact column\n";
    
    // Add emergency_phone column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN emergency_phone VARCHAR(255) NULL AFTER emergency_contact");
    echo "✓ Added emergency_phone column\n";
    
    // Add awards_recognition column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN awards_recognition TEXT NULL AFTER emergency_phone");
    echo "✓ Added awards_recognition column\n";
    
    // Add research_interests column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN research_interests TEXT NULL AFTER awards_recognition");
    echo "✓ Added research_interests column\n";
    
    // Add accepting_new_patients column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN accepting_new_patients TINYINT(1) DEFAULT 1 AFTER research_interests");
    echo "✓ Added accepting_new_patients column\n";
    
    // Add gender column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN gender VARCHAR(255) NULL AFTER accepting_new_patients");
    echo "✓ Added gender column\n";
    
    // Add date_of_birth column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN date_of_birth DATE NULL AFTER gender");
    echo "✓ Added date_of_birth column\n";
    
    // Add remember_token column
    $pdo->exec("ALTER TABLE doctors ADD COLUMN remember_token VARCHAR(100) NULL AFTER date_of_birth");
    echo "✓ Added remember_token column\n";
    
    // Rename is_active to match migration (status already added above)
    // We'll keep is_active and status for now
    
    echo "\n✓ Successfully added all missing columns to doctors table!\n";
    echo "\nUpdated doctors table structure:\n";
    
    $stmt = $pdo->query("DESCRIBE doctors");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($columns as $column) {
        echo "- {$column['Field']} ({$column['Type']})\n";
    }
    
} catch (PDOException $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
