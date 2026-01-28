<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('user_type', ['doctor', 'admin', 'client'])
                ->default('client')
                ->after('role');
        });

        // Backfill existing users: admins keep admin, others become client
        DB::table('users')
            ->where('role', 'admin')
            ->update(['user_type' => 'admin']);

        DB::table('users')
            ->where('role', '!=', 'admin')
            ->update(['user_type' => 'client']);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('user_type');
        });
    }
};
