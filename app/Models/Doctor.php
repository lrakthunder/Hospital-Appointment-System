<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Doctor extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'department',
        'specialization',
        'license_number',
        'years_of_experience',
        'consultation_fee',
        'available_days',
        'available_time_start',
        'available_time_end',
        'bio',
        'status',
        'role',
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
        'date_of_birth',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'consultation_fee' => 'decimal:2',
            'years_of_experience' => 'integer',
            'available_time_start' => 'datetime:H:i',
            'available_time_end' => 'datetime:H:i',
            'password' => 'hashed',
            'available_days' => 'array',
            'accepting_new_patients' => 'boolean',
        ];
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'doctor_id', 'id');
    }

    public function getAvailableDaysArrayAttribute()
    {
        return explode(',', $this->available_days);
    }
}
