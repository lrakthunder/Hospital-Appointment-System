<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@hospital.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'user_type' => 'admin',
            'phone' => '1234567890',
        ]);

        // Create doctor user
        User::create([
            'name' => 'Doctor User',
            'email' => 'doctor@hospital.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'user_type' => 'client',
            'phone' => '0987654321',
        ]);

        // Create test user
        User::create([
            'name' => 'Test User',
            'email' => 'user@test.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'user_type' => 'client',
            'phone' => '0987654321',
        ]);
    }
}
