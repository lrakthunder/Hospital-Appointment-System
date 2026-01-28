<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->string('profile_photo')->nullable()->after('bio');
            $table->string('qualifications')->nullable()->after('profile_photo');
            $table->text('education')->nullable()->after('qualifications');
            $table->string('medical_school')->nullable()->after('education');
            $table->integer('graduation_year')->nullable()->after('medical_school');
            $table->text('certifications')->nullable()->after('graduation_year');
            $table->text('languages_spoken')->nullable()->after('certifications');
            $table->string('office_address')->nullable()->after('languages_spoken');
            $table->string('city')->nullable()->after('office_address');
            $table->string('state')->nullable()->after('city');
            $table->string('zip_code', 10)->nullable()->after('state');
            $table->string('emergency_contact')->nullable()->after('zip_code');
            $table->string('emergency_phone')->nullable()->after('emergency_contact');
            $table->text('awards_recognition')->nullable()->after('emergency_phone');
            $table->text('research_interests')->nullable()->after('awards_recognition');
            $table->boolean('accepting_new_patients')->default(true)->after('research_interests');
            $table->string('gender')->nullable()->after('accepting_new_patients');
            $table->date('date_of_birth')->nullable()->after('gender');
        });
    }

    public function down(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->dropColumn([
                'profile_photo',
                'qualifications',
                'education',
                'medical_school',
                'graduation_year',
                'certifications',
                'languages_spoken',
                'office_address',
                'city',
                'state',
                'zip_code',
                'emergency_contact',
                'emergency_phone',
                'awards_recognition',
                'research_interests',
                'accepting_new_patients',
                'gender',
                'date_of_birth'
            ]);
        });
    }
};
