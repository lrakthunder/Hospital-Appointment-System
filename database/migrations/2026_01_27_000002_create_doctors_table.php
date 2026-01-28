<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone')->nullable();
            $table->string('department')->nullable();
            $table->string('specialization')->nullable();
            $table->string('license_number')->nullable();
            $table->integer('years_of_experience')->nullable();
            $table->decimal('consultation_fee', 10, 2)->nullable();
            $table->text('available_days')->nullable();
            $table->time('available_time_start')->nullable();
            $table->time('available_time_end')->nullable();
            $table->text('bio')->nullable();
            $table->string('status')->default('active');
            $table->string('role')->default('doctor');
            $table->string('profile_photo')->nullable();
            $table->string('qualifications')->nullable();
            $table->text('education')->nullable();
            $table->string('medical_school')->nullable();
            $table->integer('graduation_year')->nullable();
            $table->text('certifications')->nullable();
            $table->text('languages_spoken')->nullable();
            $table->string('office_address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('zip_code', 10)->nullable();
            $table->string('emergency_contact')->nullable();
            $table->string('emergency_phone')->nullable();
            $table->text('awards_recognition')->nullable();
            $table->text('research_interests')->nullable();
            $table->boolean('accepting_new_patients')->default(true);
            $table->string('gender')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
