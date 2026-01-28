<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Doctor;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        Doctor::create([
            'name' => 'Dr. John Smith',
            'email' => 'doctor@test.com',
            'password' => Hash::make('Doctor@2025'),
            'phone' => '09123456789',
            'department' => 'Cardiology',
            'specialization' => 'Interventional Cardiology',
            'license_number' => 'MD-12345',
            'years_of_experience' => 10,
            'consultation_fee' => 1500.00,
            'available_days' => 'Monday,Tuesday,Wednesday,Thursday,Friday',
            'available_time_start' => '09:00',
            'available_time_end' => '17:00',
            'bio' => 'Experienced cardiologist specializing in interventional procedures.',
            'status' => 'active',
            'role' => 'doctor'
        ]);
    }
}
