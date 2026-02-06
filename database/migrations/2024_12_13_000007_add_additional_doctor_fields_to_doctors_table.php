<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $columnsToAdd = [
            'profile_photo' => fn (Blueprint $table) => $table->string('profile_photo')->nullable()->after('bio'),
            'qualifications' => fn (Blueprint $table) => $table->string('qualifications')->nullable()->after('profile_photo'),
            'education' => fn (Blueprint $table) => $table->text('education')->nullable()->after('qualifications'),
            'medical_school' => fn (Blueprint $table) => $table->string('medical_school')->nullable()->after('education'),
            'graduation_year' => fn (Blueprint $table) => $table->integer('graduation_year')->nullable()->after('medical_school'),
            'certifications' => fn (Blueprint $table) => $table->text('certifications')->nullable()->after('graduation_year'),
            'languages_spoken' => fn (Blueprint $table) => $table->text('languages_spoken')->nullable()->after('certifications'),
            'office_address' => fn (Blueprint $table) => $table->string('office_address')->nullable()->after('languages_spoken'),
            'city' => fn (Blueprint $table) => $table->string('city')->nullable()->after('office_address'),
            'state' => fn (Blueprint $table) => $table->string('state')->nullable()->after('city'),
            'zip_code' => fn (Blueprint $table) => $table->string('zip_code', 10)->nullable()->after('state'),
            'emergency_contact' => fn (Blueprint $table) => $table->string('emergency_contact')->nullable()->after('zip_code'),
            'emergency_phone' => fn (Blueprint $table) => $table->string('emergency_phone')->nullable()->after('emergency_contact'),
            'awards_recognition' => fn (Blueprint $table) => $table->text('awards_recognition')->nullable()->after('emergency_phone'),
            'research_interests' => fn (Blueprint $table) => $table->text('research_interests')->nullable()->after('awards_recognition'),
            'accepting_new_patients' => fn (Blueprint $table) => $table->boolean('accepting_new_patients')->default(true)->after('research_interests'),
            'gender' => fn (Blueprint $table) => $table->string('gender')->nullable()->after('accepting_new_patients'),
            'date_of_birth' => fn (Blueprint $table) => $table->date('date_of_birth')->nullable()->after('gender'),
        ];

        foreach ($columnsToAdd as $column => $callback) {
            if (! Schema::hasColumn('doctors', $column)) {
                Schema::table('doctors', function (Blueprint $table) use ($callback) {
                    $callback($table);
                });
            }
        }
    }

    public function down(): void
    {
        $columns = [
            'profile_photo', 'qualifications', 'education', 'medical_school', 'graduation_year',
            'certifications', 'languages_spoken', 'office_address', 'city', 'state', 'zip_code',
            'emergency_contact', 'emergency_phone', 'awards_recognition', 'research_interests',
            'accepting_new_patients', 'gender', 'date_of_birth'
        ];

        foreach ($columns as $col) {
            if (Schema::hasColumn('doctors', $col)) {
                Schema::table('doctors', function (Blueprint $table) use ($col) {
                    $table->dropColumn($col);
                });
            }
        }
    }
};
