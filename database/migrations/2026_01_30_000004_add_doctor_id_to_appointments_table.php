<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Adds a nullable `doctor_id` to `appointments` and an optional foreign key.
     */
    public function up()
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->unsignedBigInteger('doctor_id')->nullable()->after('patient_phone');
            $table->foreign('doctor_id')->references('id')->on('doctors')->onDelete('set null');
        });

        // Optional backfill: if `appointments.doctor_name` exactly matches `doctors.name`,
        // uncomment and run `php artisan migrate` to populate `doctor_id` automatically.
        // Use cautiously if names may differ.
        //
        // DB::table('appointments')
        //     ->join('doctors', 'doctors.name', '=', 'appointments.doctor_name')
        //     ->update(['appointments.doctor_id' => DB::raw('doctors.id')]);
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropForeign(['doctor_id']);
            $table->dropColumn('doctor_id');
        });
    }
};
